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
- pip (comes with Python)

---

## Backend Setup (Flask API)

1. **Open a terminal and navigate to the backend directory:**
   ```powershell
   cd backend
   ```

2. **Install Python dependencies:**
   ```powershell
   py -m pip install -r requirements.txt
   ```

3. **Prepare your SMS export:**
   - Place your exported `momo_sms.xml` in the `backend/` directory.

4. **Process SMS and populate the database:**
   ```powershell
   py process_momo.py
   ```

5. **Run the Flask API:**
   ```powershell
   py app.py
   ```
   - The API will be available at `http://localhost:5000/api/transactions`.

---

## Frontend Setup (React Dashboard)

1. **Open a new terminal and navigate to the frontend directory:**
   ```powershell
   cd momo-dashboard
   ```

2. **Install Node.js dependencies:**
   ```powershell
   npm install
   ```

3. **Start the React app:**
   ```powershell
   npm start
   ```
   - The dashboard will be available at `http://localhost:3000`.

---

## Usage

- **Dashboard:** View summaries, charts, and lists of your MoMo transactions.
- **Filters:** Use the filter panel to narrow down transactions by category, date, or amount.
- **Unprocessed SMS:** Check `unprocessed_momo.log` for SMS messages that could not be categorized.

---

## Troubleshooting

- If you get a `pip` not found error, use `py -m pip` instead.
- Make sure Python and Node.js are added to your system PATH.
- If you change your SMS export, re-run `py process_momo.py` before restarting the backend.
- If you encounter CORS issues, ensure both backend and frontend are running on localhost.

---

## Customization

- **Categories & Regex:** Edit `process_momo.py` to adjust or add transaction categories and regex patterns.
- **Tailwind Theme:** Customize colors in `tailwind.config.js`.
- **API Endpoints:** Extend `app.py` for more API features.

---

## System Architecture

```
+-------------------+         REST API         +-------------------+         +-------------------+
|                   | <---------------------> |                   | <-----> |                   |
|   React Frontend  |                         |   Flask Backend    |         |     SQLite DB     |
| (momo-dashboard/) |                         |   (backend/)       |         | (momo_transactions|
|                   |                         |                   |         |      .db)         |
+-------------------+                         +-------------------+         +-------------------+
        ^                                              ^
        |                                              |
        |                                              |
        |                                              v
        |                                    +-------------------+
        |                                    |   Input Files     |
        |                                    | (momo_sms.xml)    |
        |                                    +-------------------+
        |                                              ^
        |                                              |
        |                                    +-------------------+
        |                                    |   Log File        |
        |                                    | (unprocessed_     |
        |                                    |   momo.log)       |
        |                                    +-------------------+
```

**[Momo dashboard system architecture diagram](https://drive.google.com/file/d/1iwjjYgTkvao590s1Fp0hnuU7AJLwO_1K/view?usp=sharing)**

**Data Flow:**
- User exports SMS to `momo_sms.xml`.
- Backend processes the XML and populates the SQLite database.
- Frontend fetches data from the backend API and displays it.

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

---

