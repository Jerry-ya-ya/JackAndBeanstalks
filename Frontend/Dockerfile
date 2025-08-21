# docker build -t my-angular-app .
# docker run -d -p 4200:80 my-angular-app

# 第一階段：建構 Angular 專案
FROM node:20 AS build

WORKDIR /app
COPY . .

# 安裝依賴並打包專案（使用 npm ci 保證鎖檔一致性）
RUN npm ci
RUN npx ng build --configuration=production

# 第二階段：Nginx 提供靜態頁面
FROM nginx:stable-alpine

# 複製編譯後的檔案（Angular 19 的輸出結構）
COPY --from=build /app/dist/jackandbeanstalks/browser /usr/share/nginx/html

# 複製 Nginx 配置
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/error.conf /etc/nginx/conf.d/error.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# 開放 80 port（預設）
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]