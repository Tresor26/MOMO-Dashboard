import sqlite3
import xml.etree.ElementTree as ET
import re
from datetime import datetime
import logging


logging.basicConfig(filename='unprocessed_momo.log', level=logging.INFO, 
                   format='%(asctime)s - %(message)s')

DB_FILE = "momo_transactions.db"
XML_FILE = 'momo_sms.xml'


CATEGORIES = {
    'incoming_money': [
        r'You have received\s+(\d+(?:,\d+)*)\s+RWF from\s+([^(]+)',
        r'(\d+(?:,\d+)*)\s+RWF received from\s+([^(]+)',
        r'Money received[:\s]+(\d+(?:,\d+)*)\s+RWF from\s+([^(]+)',
    ],
    
    'payments_to_code_holders': [
        r'TxId:\s*\d+\.\s*Your payment of\s+(\d+(?:,\d+)*)\s+RWF to\s+([^0-9]+)\s*\d+',
        r'Payment of\s+(\d+(?:,\d+)*)\s+RWF to code holder\s+([^(]+)',
        r'Pay code payment[:\s]+(\d+(?:,\d+)*)\s+RWF to\s+([^(]+)',
        r'Your payment of\s+(\d+(?:,\d+)*)\s+RWF to\s+([^(]+)\s+pay code',
    ],
    
    'transfers_to_mobile': [
        r'\*165\*S\*(\d+(?:,\d+)*)\s+RWF transferred to\s+([^(]+)',
        r'(\d+(?:,\d+)*)\s+RWF transferred to mobile\s+(\d+)',
        r'Mobile transfer[:\s]+(\d+(?:,\d+)*)\s+RWF to\s+(\d+)',
        r'Transfer to\s+(\d+)[:\s]+(\d+(?:,\d+)*)\s+RWF',
    ],
    
    'bank_deposits': [
        r'\*113\*R\*A bank deposit of\s+(\d+(?:,\d+)*)\s+RWF has been added',
        r'Bank deposit[:\s]+(\d+(?:,\d+)*)\s+RWF',
        r'(\d+(?:,\d+)*)\s+RWF deposited to your bank account',
        r'Deposit to bank[:\s]+(\d+(?:,\d+)*)\s+RWF',
    ],
    
    'bank_transfers': [
        r'Bank transfer[:\s]+(\d+(?:,\d+)*)\s+RWF to\s+([^(]+)',
        r'(\d+(?:,\d+)*)\s+RWF transferred to bank account\s+([^(]+)',
        r'Transfer to bank[:\s]+(\d+(?:,\d+)*)\s+RWF',
        r'Your bank transfer of\s+(\d+(?:,\d+)*)\s+RWF',
    ],
    
    'airtime_purchases': [
        r'\*162\*TxId:\d+\*S\*Your payment of\s+(\d+(?:,\d+)*)\s+RWF to Airtime',
        r'Your payment of\s+(\d+(?:,\d+)*)\s+RWF to Airtime',
        r'Airtime purchase[:\s]+(\d+(?:,\d+)*)\s+RWF',
        r'(\d+(?:,\d+)*)\s+RWF airtime purchased',
    ],
    
    'cash_power_bills': [
        r'Cash Power payment[:\s]+(\d+(?:,\d+)*)\s+RWF',
        r'Your payment of\s+(\d+(?:,\d+)*)\s+RWF to Cash Power',
        r'(\d+(?:,\d+)*)\s+RWF paid for electricity',
        r'Electricity bill payment[:\s]+(\d+(?:,\d+)*)\s+RWF',
        r'EUCL payment[:\s]+(\d+(?:,\d+)*)\s+RWF',
    ],
    
    'third_party_transactions': [
        r'Transaction initiated by\s+([^:]+)[:\s]+(\d+(?:,\d+)*)\s+RWF',
        r'Third party transaction[:\s]+(\d+(?:,\d+)*)\s+RWF from\s+([^(]+)',
        r'([^(]+)\s+initiated transaction of\s+(\d+(?:,\d+)*)\s+RWF',
        r'Auto transaction[:\s]+(\d+(?:,\d+)*)\s+RWF',
    ],
    
    'agent_withdrawals': [
        r'Cash withdrawal[:\s]+(\d+(?:,\d+)*)\s+RWF from agent\s+([^(]+)',
        r'You withdrew\s+(\d+(?:,\d+)*)\s+RWF from agent\s+([^(]+)',
        r'Agent withdrawal[:\s]+(\d+(?:,\d+)*)\s+RWF',
        r'(\d+(?:,\d+)*)\s+RWF withdrawn from\s+([^(]+)',
    ],
    
    'internet_voice_bundles': [
        r'Internet bundle purchase[:\s]+(\d+(?:,\d+)*)\s+RWF',
        r'Voice bundle purchase[:\s]+(\d+(?:,\d+)*)\s+RWF',
        r'Your payment of\s+(\d+(?:,\d+)*)\s+RWF to Internet Bundle',
        r'Your payment of\s+(\d+(?:,\d+)*)\s+RWF to Voice Bundle',
        r'(\d+(?:,\d+)*)\s+RWF paid for internet bundle',
        r'(\d+(?:,\d+)*)\s+RWF paid for voice bundle',
        r'Bundle purchase[:\s]+(\d+(?:,\d+)*)\s+RWF',
    ],
    
    'other_transfers': [
        r'(\d+(?:,\d+)*)\s+RWF transferred',
        r'Transfer[:\s]+(\d+(?:,\d+)*)\s+RWF',
    ],
}

def clean_amount(amount_str):
    if amount_str:
        return float(amount_str.replace(',', ''))
    return 0.0

def extract_name(name_str):
    if name_str:
        # Remove extra spaces and parentheses content
        name = re.sub(r'\s*\([^)]*\)', '', name_str).strip()
        # Remove trailing numbers and special characters
        name = re.sub(r'\s*\d+\s*$', '', name).strip()
        return name
    return None

def extract_phone_number(text):
    phone_pattern = r'(\+?250\d{9}|\d{10}|\d{9})'
    match = re.search(phone_pattern, text)
    return match.group(1) if match else None

def categorize_sms(body):
    body = body.strip().replace('\n', ' ')
    
    for category, patterns in CATEGORIES.items():
        for pattern in patterns:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                result = {
                    'category': category,
                    'raw_body': body,
                    'sender': None,
                    'receiver': None,
                    'amount': 0.0
                }
                
                
                groups = match.groups()
                amount_group = None
                name_group = None
                
                for i, group in enumerate(groups):
                    if group and re.match(r'\d+(?:,\d+)*', group):
                        if amount_group is None:
                            amount_group = group
                    elif group and not re.match(r'^\d+(?:,\d+)*$', group):
                        if name_group is None:
                            name_group = group
                
                result['amount'] = clean_amount(amount_group) if amount_group else 0.0
                
                # Set sender/receiver based on category
                if category == 'incoming_money':
                    result['sender'] = extract_name(name_group) if name_group else 'Unknown'
                    result['receiver'] = 'You'
                    
                elif category in ['payments_to_code_holders', 'transfers_to_mobile', 'bank_transfers']:
                    result['sender'] = 'You'
                    if category == 'transfers_to_mobile':
                        phone = extract_phone_number(body)
                        result['receiver'] = phone if phone else extract_name(name_group)
                    else:
                        result['receiver'] = extract_name(name_group) if name_group else 'Unknown'
                        
                elif category == 'bank_deposits':
                    result['sender'] = 'Bank'
                    result['receiver'] = 'You'
                    
                elif category in ['airtime_purchases', 'cash_power_bills', 'internet_voice_bundles']:
                    result['sender'] = 'You'
                    if category == 'airtime_purchases':
                        result['receiver'] = 'Airtime'
                    elif category == 'cash_power_bills':
                        result['receiver'] = 'Cash Power/EUCL'
                    else:
                        result['receiver'] = 'Bundle Service'
                        
                elif category == 'third_party_transactions':
                    result['sender'] = extract_name(name_group) if name_group else 'Third Party'
                    result['receiver'] = 'You'
                    
                elif category == 'agent_withdrawals':
                    result['sender'] = 'You'
                    result['receiver'] = extract_name(name_group) if name_group else 'Agent'
                    
                else:  # other_transfers
                    # Try to determine direction from context
                    if any(word in body.lower() for word in ['to', 'transferred to', 'sent to']):
                        result['sender'] = 'You'
                        result['receiver'] = extract_name(name_group) if name_group else 'Unknown'
                    else:
                        result['sender'] = extract_name(name_group) if name_group else 'Unknown'
                        result['receiver'] = 'You'
                
                
                balance_match = re.search(r'(?:new balance|NEW BALANCE|balance)[:\s]+(\d+(?:,\d+)*)\s+RWF', body, re.IGNORECASE)
                if balance_match:
                    result['balance'] = clean_amount(balance_match.group(1))
                
                
                fee_match = re.search(r'(?:Fee was|fee)[:\s]+(\d+(?:,\d+)*)\s+RWF', body, re.IGNORECASE)
                if fee_match:
                    result['fee'] = clean_amount(fee_match.group(1))
                
                return result
    
    return None

def convert_timestamp(timestamp_str):
    try:
        # Convert milliseconds to seconds
        timestamp = int(timestamp_str) / 1000
        return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
    except:
        return None

def create_database():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sms_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        sender TEXT,
        receiver TEXT,
        date TEXT NOT NULL,
        description TEXT,
        raw_body TEXT,
        balance REAL,
        fee REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()

def process_sms():
    try:
        tree = ET.parse(XML_FILE)
        root = tree.getroot()
        
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Clear existing data
        cursor.execute('DELETE FROM sms_transactions')
        
        processed_count = 0
        ignored_count = 0
        
        print(f"Processing {len(root.findall('sms'))} SMS messages...")
        
        for sms in root.findall('sms'):
            body = sms.attrib.get('body', '').strip()
            date_timestamp = sms.attrib.get('date', '')
            
            if not body:
                ignored_count += 1
                continue
            
            # Convert timestamp
            date_formatted = convert_timestamp(date_timestamp)
            if not date_formatted:
                ignored_count += 1
                continue
            
            # Categorize SMS
            result = categorize_sms(body)
            
            if result:
                # Create description
                description = ""
                if result.get('sender') and result.get('receiver'):
                    if result['sender'] == 'You':
                        description = f"To {result['receiver']}"
                    elif result['receiver'] == 'You':
                        description = f"From {result['sender']}"
                    else:
                        description = f"From {result['sender']} to {result['receiver']}"
                
                # Insert into database
                cursor.execute('''
                INSERT INTO sms_transactions 
                (category, amount, sender, receiver, date, description, raw_body, balance, fee)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    result['category'],
                    result['amount'],
                    result.get('sender'),
                    result.get('receiver'),
                    date_formatted,
                    description,
                    result['raw_body'],
                    result.get('balance'),
                    result.get('fee')
                ))
                
                processed_count += 1
                
                # Print progress every 100 transactions
                if processed_count % 100 == 0:
                    print(f"Processed {processed_count} transactions...")
                    
            else:
                ignored_count += 1
                # Log ignored SMS for debugging
                logging.info(f"Ignored SMS: {body[:100]}...")
        
        conn.commit()
        conn.close()
        
        print(f"\n✅ Processing complete!")
        print(f"   Processed: {processed_count} transactions")
        print(f"   Ignored: {ignored_count} messages")
        print(f"   Success rate: {processed_count/(processed_count+ignored_count)*100:.1f}%")
        
        if ignored_count > 0:
            print(f"\n📝 Check 'unprocessed_momo.log' for ignored messages")
        
    except Exception as e:
        print(f"❌ Error processing SMS: {e}")

def display_category_summary():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT category, COUNT(*) as count, SUM(amount) as total_amount
    FROM sms_transactions 
    GROUP BY category 
    ORDER BY count DESC
    ''')
    
    results = cursor.fetchall()
    
    print(f"\n📊 Transaction Summary by Category:")
    print("-" * 60)
    for category, count, total in results:
        category_name = category.replace('_', ' ').title()
        print(f"{category_name:<25} {count:>6} transactions  {total:>12,.0f} RWF")
    
    conn.close()

def main():
    print("🔄 Creating database...")
    create_database()
    
    print("📱 Processing SMS messages...")
    process_sms()
    
    print("\n🔍 Verifying results...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM sms_transactions')
    total = cursor.fetchone()[0]
    
    print(f"📊 Database Summary:")
    print(f"   Total transactions: {total}")
    
    conn.close()
    
    # Display detailed category summary
    if total > 0:
        display_category_summary()

if __name__ == "__main__":
    main()