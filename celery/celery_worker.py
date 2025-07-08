from celery import Celery

celery = Celery(
    'app',
    broker='redis://localhost:6379/0', #如果用 Docker，host 改成 redis
    backend='redis://localhost:6379/0'
)

celery.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json']
)