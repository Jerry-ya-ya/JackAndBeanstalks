# 建立映像檔
# docker build -t my-flask-app .

# 啟動容器（並把 5000 port 映射出來）
# docker run --env-file .env -d -p 5000:5000 my-flask-app

# 使用官方 Python 基礎映像（這裡用 slim 比較小）
FROM python:3.11-slim

# 設定環境變數，讓 Python 不產生 .pyc
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 安裝 Microsoft SQL Server ODBC Driver 17
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17

# 其他需要的基本套件
RUN apt-get install -y \
    unixodbc \
    unixodbc-dev \
    gcc \
    g++ \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 建立工作目錄
WORKDIR /app

# 複製需求套件檔並安裝
COPY requirements.txt .

# 安裝 Python 套件
RUN pip install --no-cache-dir -r requirements.txt

# 複製專案所有程式碼到容器中
COPY . .

# 設定啟動指令（用 gunicorn 執行 Flask app）
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:create_app()", "--preload"]