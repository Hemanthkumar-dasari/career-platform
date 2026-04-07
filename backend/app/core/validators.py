"""
Input validation helpers shared across Pydantic schemas and route handlers.

Rules applied globally:
- Strip leading/trailing whitespace from strings
- Reject strings exceeding max_length
- Reject null bytes or non-printable control characters
- File upload: reject files larger than MAX_RESUME_BYTES
"""
import re
from fastapi import HTTPException

# ── File size limits ──────────────────────────────────────────────────────────
MAX_RESUME_BYTES = 5 * 1024 * 1024  # 5 MB

# Matches null bytes and non-printable ASCII control characters (except tab/newline)
_CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def sanitize_str(value: str, max_len: int, field_name: str = "field") -> str:
    """
    Strip whitespace, reject control chars, and enforce max length.
    Raises ValueError (Pydantic-compatible) so it works inside @field_validator.
    """
    if value is None:
        return value
    value = value.strip()
    if _CONTROL_CHAR_RE.search(value):
        raise ValueError(f"{field_name} contains invalid control characters.")
    if len(value) > max_len:
        raise ValueError(f"{field_name} must be at most {max_len} characters (got {len(value)}).")
    return value


def validate_file_size(file_bytes: bytes, max_bytes: int = MAX_RESUME_BYTES) -> None:
    """
    Validates uploaded file size. Raises HTTPException 413 if too large.
    Call this in route handlers after reading the file into memory.
    """
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {max_bytes // (1024 * 1024)} MB.",
        )
