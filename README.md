# MOMO-Dashboard

MOMO-Dashboard is a web application for visualizing and analyzing MTN Mobile Money (MoMo) transactions. It parses exported SMS messages, categorizes transactions, and provides interactive charts, summaries, and filtering tools for personal finance management.

---

## Features

- **Automated SMS Parsing:** Extracts and categorizes MoMo transactions from exported SMS XML files.
- **Transaction Storage:** Uses SQLite for storing and querying transaction data.
- **REST API:** Flask backend provides endpoints for accessing transaction data.
- **Interactive Dashboard:** React frontend with charts, summaries, and filters.
- **Filtering:** Filter transactions by category, date, and amount.
- **Visualizations:** Pie, bar, and line charts for transaction analysis.
- **Responsive UI:** Built with Tailwind CSS for modern, mobile-friendly design.
- **Logging:** Unrecognized or unprocessed SMS messages are logged for review.

---

## Project Structure

```
MOMO-Dashboard/
│
├── backend/
│   ├── app.py                # Flask API for transactions
│   ├── process_momo.py       # SMS XML parser and categorizer
│   ├── momo_sms.xml          # Exported SMS messages (input)
│   ├── momo_transactions.db  # SQLite database (generated)
│   └── unprocessed_momo.log  # Log of ignored/unprocessed SMS
│
├── momo-dashboard/
│   ├── public/
│   │   ├── index.html
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   └── components/
│   │       ├── Charts.jsx
│   │       ├── Filters.jsx
│   │       ├── SummaryCards.jsx
│   │       └── TransactionList.jsx
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
├── AUTHORS
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+
- pip

### Backend Setup

1. **Install dependencies:**
   ```bash
   pip install flask flask-cors
   ```

2. **Prepare your SMS export:**
   - Place your exported `momo_sms.xml` in the `backend/` directory.

3. **Process SMS and populate the database:**
   ```bash
   python backend/process_momo.py
   ```

4. **Run the Flask API:**
   ```bash
   python backend/app.py
   ```
   - The API will be available at `http://localhost:5000/api/transactions`.

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd momo-dashboard
   npm install
   ```

2. **Start the React app:**
   ```bash
   npm start
   ```
   - The dashboard will be available at `http://localhost:3000`.

---

## Usage

- **Dashboard:** View summaries, charts, and lists of your MoMo transactions.
- **Filters:** Use the filter panel to narrow down transactions by category, date, or amount.
- **Unprocessed SMS:** Check unprocessed_momo.log for SMS messages that could not be categorized.

---

## Customization

- **Categories & Regex:** Edit process_momo.py to adjust or add transaction categories and regex patterns.
- **Tailwind Theme:** Customize colors in tailwind.config.js.
- **API Endpoints:** Extend app.py for more API features.

---

## Contributors

See AUTHORS for the full list.

---

## License

This project is for educational and personal use. Please respect privacy and data security when handling SMS exports.

---

## Acknowledgements

- [Flask](https://flask.palletsprojects.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
```