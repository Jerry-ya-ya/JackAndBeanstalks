FROM mcr.microsoft.com/playwright:v1.53.1-jammy

WORKDIR /e2e

COPY package*.json ./
RUN npm ci

COPY . .

# 預設跑測試（也可以用 compose command 覆蓋）
CMD ["npx", "playwright", "test"]