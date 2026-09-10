import json
import time

_memory = {}

try:
    import redis
    from app.config import REDIS_URL
    _redis = redis.from_url(REDIS_URL, decode_responses=True)
    _redis.ping()
except Exception:
    _redis = None

def cache_get(key):
    if _redis:
        value = _redis.get(key)
        return json.loads(value) if value else None

    item = _memory.get(key)
    if not item:
        return None
    expires_at, value = item
    if time.time() > expires_at:
        _memory.pop(key, None)
        return None
    return value

def cache_set(key, value, ttl=300):
    if _redis:
        _redis.setex(key, ttl, json.dumps(value))
    else:
        _memory[key] = (time.time() + ttl, value)
