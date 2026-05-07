ExpenseLens backend (FastAPI + SQLite)

Quick start

1. Create a virtual environment and install dependencies

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r src/backend/requirements.txt
```

2. Run the server

```bash
uvicorn src.backend.app:app --reload
```

The API will be available at http://127.0.0.1:8000

Endpoints:
- GET /health
- GET /expenses
- POST /expenses (JSON body matching Expense model)
- DELETE /expenses/{id}
