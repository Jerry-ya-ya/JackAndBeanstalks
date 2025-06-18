# docker build -t my-angular-app .
# docker run -d -p 4200:80 my-angular-app

# 第一階段：建構 Angular 專案
FROM node:20 AS build

WORKDIR /app
COPY . .

# 安裝 Angular CLI（如有需要）
RUN npm install -g @angular/cli

# 安裝依賴並打包專案
RUN npm install
RUN ng build --configuration production

# 第二階段：Nginx 提供靜態頁面
FROM nginx:stable-alpine
COPY --from=build /app/dist/jackandbeanstalks /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 複製編譯後的檔案
COPY --from=build /app/dist/jackandbeanstalks/browser /usr/share/nginx/html

# 複製自訂 Nginx 設定（可選）
# COPY nginx.conf /etc/nginx/nginx.conf

# 開放 80 port（預設）
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]