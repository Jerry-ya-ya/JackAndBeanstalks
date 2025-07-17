import redis

r = redis.StrictRedis(
    host='redis',  # 如果未來用 Docker，可改為 'redis'
    port=6379,
    db=0,
    decode_responses=True
)