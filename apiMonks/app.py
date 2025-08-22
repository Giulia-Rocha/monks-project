from fastapi import FastAPI, HTTPException,Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

origins = [
    "http://localhost:5173",  # porta do seu frontend
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
metrics_df = pd.read_csv("metrics.csv")

class User(BaseModel):
    username: str
    password: str


@app.post("/login")
def login(user: User):
    users_df = pd.read_csv("users.csv")
    users_df.columns = users_df.columns.str.strip()

    # Verifica username e senha
    user_row = users_df[(users_df["username"] == user.username) & (users_df["password"] == user.password)]

    # Se não houver, retorna 401
    if user_row.empty:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")


    # Retorna informações do usuário
    return {
        "username": user_row.iloc[0]["username"],
        "role": user_row.iloc[0]["role"]
    }

@app.get("/metrics")
def get_metrics(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    sort_by: Optional[str] = None,
    order: str = "asc",
    role: str = "user",
    limit: int = Query(20, description="Número de registros por página"),
    offset: int = Query(0, description="Número de registros a pular")
):
    metrics_df = pd.read_csv("metrics.csv")
    metrics_df.columns = metrics_df.columns.str.strip()

    # Filtrar por data
    if start_date:
        metrics_df = metrics_df[metrics_df["date"] >= start_date]
    if end_date:
        metrics_df = metrics_df[metrics_df["date"] <= end_date]

    # Ordenar por coluna
    if sort_by and sort_by in metrics_df.columns:
        ascending = True if order.lower() == "asc" else False
        metrics_df = metrics_df.sort_values(by=sort_by, ascending=ascending)

    # Ocultar coluna cost_micros para não-admin
    if role.lower() != "admin" and "cost_micros" in metrics_df.columns:
        metrics_df = metrics_df.drop(columns=["cost_micros"])

    # Aplicar paginação
    metrics_df = metrics_df.iloc[offset:offset+limit]

    return metrics_df.to_dict(orient="records")





