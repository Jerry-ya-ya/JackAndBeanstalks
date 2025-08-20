import os
import redis

# 統一由環境變數 REDIS_URL 控制，預設為 docker 服務名 'redis'
_redis_url = os.getenv('REDIS_URL', 'http://localhost:6379/0')
r = redis.from_url(_redis_url, decode_responses=True)