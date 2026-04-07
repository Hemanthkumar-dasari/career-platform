"""
Centralised rate-limiter instance.

Uses slowapi (starlette-compatible) with in-memory storage.
For production scale, replace the default in-memory storage with Redis:
    from limits.storage import RedisStorage
    limiter = Limiter(key_func=get_remote_address, storage_uri="redis://...")
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
