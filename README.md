# Projeto Monks

Este projeto foi desenvolvido como parte de um processo seletivo e consiste numa aplicação full-stack com um backend em Python (FastAPI) e um frontend em React. A aplicação exibe dados de métricas, permitindo que os utilizadores façam login, filtrem e ordenem os dados, com controle de acesso baseado no perfil do usuário.



## ✅ Funcionalidades Implementadas
### API Backend:

Servidor web construído com FastAPI.

Leitura e processamento de dados a partir de arquivos .csv.

Endpoint de login simples (/login) para validar credenciais de usuários.

Endpoint de dados (/metrics) com as seguintes capacidades:

Filtragem de dados por intervalo de datas.

Ordenação de dados por qualquer coluna.

Controle de acesso para ocultar a coluna cost_micros de usuários comuns.

Paginação dos resultados.

### Frontend:

Interface reativa construída com React.

Sistema de rotas com proteção para a página do dashboard.

Interface de login para autenticação do utilizador.

Dashboard com uma tabela para visualização dos dados.

Controlos de interface para filtrar por data, ordenar por coluna e navegar entre as páginas.

Funcionalidade de Logout.

## 🛠️ Tecnologias Utilizadas
### Backend:

Python 3.10+

FastAPI: Framework web para a construção da API.

Pandas: Para manipulação e processamento dos dados dos arquivos CSV.

Uvicorn: Servidor ASGI para rodar a aplicação FastAPI.

### Frontend:

React 18+

React Router DOM: Para a gestão de rotas e navegação.

Axios: Para realizar as chamadas HTTP à API.

Tailwind CSS: Para a estilização da interface.

Vite: Como ferramenta de build e servidor de desenvolvimento.

## 🚀 Como Rodar o Projeto
Siga os passos abaixo para configurar e executar o projeto localmente.

Pré-requisitos
Antes de começar, certifique-se de que tem as seguintes ferramentas instaladas na sua máquina:

Node.js (versão 18 ou superior)

Python (versão 3.10 ou superior)

Um gestor de pacotes para o Node, como o npm ou yarn.

### 1. Clonar o Repositório
```bash
git clone https://github.com/Giulia-Rocha/monks-project.git
cd monks_project
```
### 2. Configurar e Rodar o Backend
Navegue para a pasta do backend 
```bash
cd apiMonks
```

 e siga os passos:

# 1. Crie e ative um ambiente virtual (recomendado)
```bash
python -m venv .venv
source .venv/bin/activate  # No Windows: .venv\Scripts\activate
```
# 2. Instale as dependências
```bash
pip install -r requirements.txt
```
# 3. Inicie o servidor da API
```bash
uvicorn app:app --reload
```
O servidor backend estará a rodar em http://127.0.0.1:8000.

3. Configurar e Rodar o Frontend
Abra um novo terminal, navegue para a pasta do frontend e siga os passos:

# Navegue para a pasta do frontend 
```bash
cd front
```

# 1. Instale as dependências
```bash
npm install
```
# 2. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação frontend estará acessível em http://localhost:5173.

## 🔑 Credenciais para Teste
Como a aplicação não possui um sistema de registo, utilize as seguintes credenciais (presentes no arquivo users.csv) para aceder:

### Usuário Comum:

Username: user2

Password: 908ijofff

(Este perfil não consegue ver a coluna cost_micros)

### Usuário Administrador:

Username: user1

Password: oeiruhn56146

(Este perfil consegue ver todas as colunas, incluindo cost_micros)