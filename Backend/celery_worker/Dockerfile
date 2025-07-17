# 1️⃣ 使用 Python 官方映像
FROM python:3.11-slim

# 2️⃣ 設定工作目錄
WORKDIR /app/Backend

# 3️⃣ 複製 requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 4️⃣ 複製 Celery 代碼
COPY . .

# 5️⃣ 執行指令（部署版通常不需要 volumes，所以直接內建）
CMD ["celery", "-A", "celery_worker", "worker", "--loglevel=info"]