from datetime import date as date_type
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from .database import engine, init_db
from .models import Expense
from typing import List

app = FastAPI(title="ExpenseLens Backend")

# Allow local frontend access during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return RedirectResponse(url="/docs")


@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)


@app.get("/expenses", response_model=List[Expense])
def list_expenses():
    with Session(engine) as session:
        statement = select(Expense).order_by(Expense.date.desc())
        results = session.exec(statement).all()
        return results


@app.post("/expenses", response_model=Expense)
def create_expense(expense: Expense):
    with Session(engine) as session:
        parsed_date = expense.date
        if isinstance(parsed_date, str):
            parsed_date = date_type.fromisoformat(parsed_date)

        expense.date = parsed_date
        session.add(expense)
        session.commit()
        session.refresh(expense)
        return expense


@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    with Session(engine) as session:
        expense = session.get(Expense, expense_id)
        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        session.delete(expense)
        session.commit()
        return {"deleted": expense_id}
