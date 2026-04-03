# AI Career Guidance Platform

An AI-powered platform that provides personalised career guidance via four core tools:
- **Learning Path Generator** — AI roadmaps from your skills to your target job
- **Project Idea Generator** — curated project ideas based on your tech stack
- **Resume Analyzer** — PDF upload + AI feedback with scores and action items
- **Interview Simulator** — real-time mock technical interviews with an AI interviewer

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, React Router v6 |
| Backend | FastAPI (Python 3.11), SQLAlchemy, Alembic |
| Database | PostgreSQL (SQLite for local dev) |
| Auth | JWT (pyjwt + passlib/bcrypt) |
| AI | Anthropic Claude via `anthropic` SDK |
| PDF | pdfplumber + PyMuPDF |
| Infra | Docker + Docker Compose |

## Quick Start

### Prerequisites
- Docker + Docker Compose
- An Anthropic API key

### 1. Configure environment

```bash
# Set your API key in backend/.env
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Run with Docker Compose

```bash
docker-compose up --build
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Swagger docs:** http://localhost:8000/docs

### Local development (without Docker)

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# Set DATABASE_URL=sqlite:///./career_platform.db in .env for local SQLite
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
.
├── backend/          FastAPI app
│   ├── app/
│   │   ├── api/      Route handlers
│   │   ├── core/     Config, JWT security
│   │   ├── db/       SQLAlchemy setup
│   │   ├── models/   DB models
│   │   ├── schemas/  Pydantic schemas
│   │   └── services/ LLM, PDF parser, interview logic
│   └── main.py
└── frontend/         React app
    └── src/
        ├── api/      Axios API clients
        ├── context/  Auth context
        ├── components/
        └── pages/
```
