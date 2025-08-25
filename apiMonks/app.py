import pandas as pd
import uvicorn
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- 1. INICIALIZAÇÃO E MODELOS ---

app = FastAPI(
    title="API de Métricas Simples",
    description="Uma API para consultar métricas com filtros, ordenação e controle de acesso por papel."
)

# Modelos Pydantic para validação de dados de entrada
class User(BaseModel):
    username: str
    password: str

# --- 2. CARREGAMENTO E PREPARAÇÃO DE DADOS (Executado uma única vez) ---

def load_and_prepare_data():
    """Carrega, limpa e prepara os DataFrames na inicialização."""
    try:
        # Carrega dados de usuários
        users_df = pd.read_csv("users.csv")
        users_df.columns = users_df.columns.str.strip()
        
        # Carrega dados de métricas
        metrics_df = pd.read_csv("metrics.csv")
        metrics_df.columns = metrics_df.columns.str.strip()
        metrics_df['date'] = pd.to_datetime(metrics_df['date'], errors='coerce')
        metrics_df.dropna(subset=['date'], inplace=True)
        
        return users_df, metrics_df
    except FileNotFoundError as e:
        print(f"Erro: Arquivo não encontrado - {e}. Certifique-se que 'users.csv' e 'metrics.csv' existem.")
        exit()

USERS_DB_DF, METRICS_DF_CLEAN = load_and_prepare_data()

# --- 3. CAMADA DE SERVIÇO DE MÉTRICAS (Lógica de Negócio) ---

class MetricsService:
    def get_filtered_metrics(
        self,
        df: pd.DataFrame,
        start_date: Optional[str],
        end_date: Optional[str],
        sort_by: Optional[str],
        order: str,
        role: str
    ) -> pd.DataFrame:
        """Orquestra a aplicação de filtros, ordenação e regras de acesso."""
        processed_df = df.copy() # Essencial para não modificar o DataFrame original

        if start_date:
            processed_df = processed_df[processed_df["date"] >= pd.Timestamp(start_date)]
        if end_date:
            processed_df = processed_df[processed_df["date"] <= pd.Timestamp(end_date)]

        if sort_by:
            if sort_by not in processed_df.columns:
                raise ValueError(f"Coluna de ordenação inválida: '{sort_by}'")
            ascending = order.lower() == "asc"
            processed_df = processed_df.sort_values(by=sort_by, ascending=ascending)
        
        if role.lower() != "admin" and "cost_micros" in processed_df.columns:
            processed_df = processed_df.drop(columns=["cost_micros"])
            
        return processed_df

metrics_service = MetricsService()

# --- 4. ENDPOINTS DA API ---

# Adiciona configuração de CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login", summary="Verifica as credenciais do usuário")
def login(user: User):
    """
    Verifica o username e a senha (em texto plano) contra o users.csv.
    NOTA: Este método não é seguro para produção.
    """
    user_row = USERS_DB_DF[
        (USERS_DB_DF["username"] == user.username) & 
        (USERS_DB_DF["password"] == user.password)
    ]

    if user_row.empty:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")

    return {
        "username": user_row.iloc[0]["username"],
        "role": user_row.iloc[0]["role"]
    }

@app.get("/metrics", summary="Obtém métricas com filtros e paginação")
def get_metrics_endpoint(
    start_date: Optional[str] = Query(None, description="Data de início (YYYY-MM-DD)", regex=r"^\d{4}-\d{2}-\d{2}$"),
    end_date: Optional[str] = Query(None, description="Data de fim (YYYY-MM-DD)", regex=r"^\d{4}-\d{2}-\d{2}$"),
    sort_by: Optional[str] = Query(None, description="Coluna para ordenação"),
    order: str = Query("asc", description="Direção da ordenação ('asc' ou 'desc')"),
    role: str = Query("user", description="Papel do usuário ('user' ou 'admin') para controle de acesso"),
    limit: int = Query(10, ge=1, le=100, description="Número de registros por página"),
    offset: int = Query(0, ge=0, description="Número de registros a pular")
):
    """
    Endpoint para buscar métricas. O controle de acesso é feito via query param 'role'.
    """
    try:
        filtered_df = metrics_service.get_filtered_metrics(
            df=METRICS_DF_CLEAN,
            start_date=start_date,
            end_date=end_date,
            sort_by=sort_by,
            order=order,
            role=role
        )

        total_count = len(filtered_df)
        paginated_df = filtered_df.iloc[offset:offset + limit]

        response_data = paginated_df.copy()
        response_data['date'] = response_data['date'].dt.strftime('%Y-%m-%d')
        
        return {
            "data": response_data.to_dict(orient="records"),
            "pagination": {
                "total": total_count,
                "limit": limit,
                "offset": offset,
                "has_more": offset + limit < total_count
            }
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro interno: {str(e)}")

# --- Ponto de entrada para executar com `python app.py` ---
if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
