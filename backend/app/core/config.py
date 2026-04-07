from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite:///./career_platform.db"

    # ── JWT ───────────────────────────────────────────────────────────────────
    # No default — server will refuse to start without this set in the environment.
    # Generate a strong secret with: python -c "import secrets; print(secrets.token_hex(64))"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # ── AI ────────────────────────────────────────────────────────────────────
    GROQ_API_KEY: str = ""

    # ── Google OAuth ──────────────────────────────────────────────────────────
    GOOGLE_CLIENT_ID: str = ""

    # ── CORS ─────────────────────────────────────────────────────────────────
    # Comma-separated list read from env, e.g.:
    #   ALLOWED_ORIGINS=http://localhost:5173,https://your-app.vercel.app
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "https://career-platform-theta.vercel.app",
    ]

    APP_ENV: str = "development"

    @property
    def db_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("mysql://"):
            url = url.replace("mysql://", "mysql+pymysql://", 1)
        return url

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()