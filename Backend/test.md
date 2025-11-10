# 健康檢查 #

curl.exe http://localhost:8080/api/health



# Todo #

## 新增 (PowerShell + curl.exe) ##

$body = @{ title = "learn Spring"; completed = $false } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "http://localhost:8080/api/todos" -Method POST -Body $body -ContentType "application/json"

## 列表 ##

curl.exe http://localhost:8080/api/todos

## 更新（把 {id} 改成實際 id，使用變量） ##

$body = @{ completed = $true } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "http://localhost:8080/api/todos/1" `
  -Method Patch `
  -Body $body `
  -ContentType "application/json"

## 刪除 ##

curl.exe -X DELETE http://localhost:8080/api/todos/1



# Greeting #

## 預設 name=World ##
curl.exe "http://localhost:8080/api/hello"

## 自訂 name ##
curl.exe "http://localhost:8080/api/hello?name=Jerry"

## 驗證錯誤（超過 50 字元） ##
$long = "a" * 60
curl.exe "http://localhost:8080/api/hello?name=$long"


# Test html #
http://localhost:8080/test.html
