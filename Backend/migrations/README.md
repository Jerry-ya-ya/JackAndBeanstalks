# Backend Migrations

This folder is managed by Alembic.

Run migrations from the `Backend` folder:

```bash
alembic upgrade head
```

Create a new revision after model changes:

```bash
alembic revision --autogenerate -m "describe change"
```

The first revision is:

```text
001_recruit_todo
```

# For docker

## Check history

```bash
docker compose -f docker-compose.1dev.yml exec backend python -m alembic history
```

## Upgrade

```bash
docker compose -f docker-compose.1dev.yml exec backend python -m alembic upgrade head
```