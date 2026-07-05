# Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# 常見：psycopg(或 psycopg2) 需要編譯/系統套件。這裡放最常用的一組。
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install -r ./requirements.txt

# 複製專案（假設 Dockerfile 在 backend 根目錄）
COPY . .

# 預設不寫測試指令（你說不用幫你寫執行測試指令）
# 你可以用 docker compose run --rm pytest pytest
CMD ["python", "-c", "print('Test image ready. Run pytest via docker compose.')"]