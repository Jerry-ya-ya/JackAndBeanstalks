package com.example.backend.exception;

import java.time.OffsetDateTime;

public class ApiErrorResponse {

    private OffsetDateTime timestamp;
    private int status;
    private String error;      // HTTP status name, e.g. "Bad Request"
    private String message;    // 簡單說明（給前端顯示）
    private String path;       // 請求路徑
    private String errorCode;  // 自訂錯誤代碼（e.g. "VALIDATION_ERROR"）
    private java.util.List<String> details; // 更細節的錯誤訊息列表

    public ApiErrorResponse() {}

    public ApiErrorResponse(int status, String error, String message,
                            String path, String errorCode,
                            java.util.List<String> details) {
        this.timestamp = OffsetDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.errorCode = errorCode;
        this.details = details;
    }

    public OffsetDateTime getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
    public String getPath() { return path; }
    public String getErrorCode() { return errorCode; }
    public java.util.List<String> getDetails() { return details; }

    public void setTimestamp(OffsetDateTime timestamp) { this.timestamp = timestamp; }
    public void setStatus(int status) { this.status = status; }
    public void setError(String error) { this.error = error; }
    public void setMessage(String message) { this.message = message; }
    public void setPath(String path) { this.path = path; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    public void setDetails(java.util.List<String> details) { this.details = details; }
}