from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_PATH = 'momo_transactions.db'

def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(query, args)
    rows = cur.fetchall()
    conn.close()
    return (rows[0] if rows else None) if one else rows

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    category = request.args.get('category')
    date = request.args.get('date')
    query = "SELECT * FROM sms_transactions WHERE 1=1"
    params = []

    if category:
        query += " AND category = ?"
        params.append(category)
    if date:
        query += " AND date LIKE ?"
        params.append(f"{date}%")

    results = query_db(query, params)
    return jsonify([dict(row) for row in results])

@app.route('/api/categories', methods=['GET'])
def get_categories():
    query = "SELECT DISTINCT category FROM sms_transactions"
    results = query_db(query)
    return jsonify([row['category'] for row in results])

@app.route('/api/summary', methods=['GET'])
def get_summary():
    query = """
    SELECT category, COUNT(*) as count, SUM(amount) as total
    FROM sms_transactions
    GROUP BY category
    ORDER BY total DESC
    """
    
    results = query_db(query)
    return jsonify([dict(row) for row in results])

@app.route('/api/monthly-transactions', methods=['GET'])
def get_monthly_transactions():
    query = """
    SELECT 
        strftime('%Y-%m', date) as month,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount,
        SUM(CASE WHEN sender = 'You' THEN amount ELSE 0 END) as outgoing_amount,
        SUM(CASE WHEN receiver = 'You' THEN amount ELSE 0 END) as incoming_amount
    FROM sms_transactions
    WHERE date IS NOT NULL
    GROUP BY strftime('%Y-%m', date)
    ORDER BY month
    """
    
    results = query_db(query)
    return jsonify([dict(row) for row in results])

if __name__ == '__main__':
    app.run(debug=True)