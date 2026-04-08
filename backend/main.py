from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api import auth, paths, projects, resumes, interviews, stats, chat, support
from app.core.config import settings
from app.core.rate_limiter import limiter
from app.db.database import engine
from app.db import base  # noqa: F401 – registers all models with metadata
from app.models import domain  # noqa: F401

app = FastAPI(
    title="AI Career Guidance Platform",
    description="AI-powered career guidance: learning paths, project ideas, resume analysis, and mock interviews.",
    version="1.0.0",
)

# ── Rate limiting ─────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Database tables ───────────────────────────────────────────────────────────
from app.db.base import Base
Base.metadata.create_all(bind=engine)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,       prefix="/api/auth",       tags=["Auth"])
app.include_router(paths.router,      prefix="/api/paths",      tags=["Learning Paths"])
app.include_router(projects.router,   prefix="/api/projects",   tags=["Project Ideas"])
app.include_router(resumes.router,    prefix="/api/resumes",    tags=["Resume Analyzer"])
app.include_router(interviews.router, prefix="/api/interviews", tags=["Interview Simulator"])
app.include_router(stats.router,      prefix="/api/stats",      tags=["Stats"])
app.include_router(chat.router,       prefix="/api/chat",       tags=["Chat"])
app.include_router(support.router,    prefix="/api/support",    tags=["Support"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "AI Career Guidance Platform"}
