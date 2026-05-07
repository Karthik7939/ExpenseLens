from sqlmodel import create_engine, SQLModel

DATABASE_URL = "sqlite:///./expense_lens.db"

# SQLite requires this arg when used in threaded envs (uvicorn)
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})

def init_db() -> None:
    SQLModel.metadata.create_all(engine)
