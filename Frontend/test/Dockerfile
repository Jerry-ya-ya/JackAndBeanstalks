# 第一階段：建置 Angular App
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

# 安裝依賴
COPY package*.json ./
RUN npm ci

# 複製原始碼並建置
COPY . .
RUN npm install -g @angular/cli
RUN ng build --configuration production

# 第二階段：使用 Nginx 服務靜態檔案
FROM nginx:stable-alpine

# 清除預設 nginx index.html
RUN rm -rf /usr/share/nginx/html/*

# 複製建置完成的 Angular 靜態檔案
COPY --from=build /app/dist/jackandbeanstalks/browser /usr/share/nginx/html

# 複製 Nginx 自定義設定（如有）
# COPY nginx.conf /etc/nginx/nginx.conf

# 開放 Port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]