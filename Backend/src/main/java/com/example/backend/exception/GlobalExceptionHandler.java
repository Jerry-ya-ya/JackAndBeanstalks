package com.example.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;

import org.springframework.validation.FieldError;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.*;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "JSON 解析錯誤");
        body.put("message", ex.getMessage());
        body.put("cause", ex.getCause() != null ? ex.getCause().getMessage() : "未知原因");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    /** JSON 解析錯誤 / 型別不符 */
    public ResponseEntity<ApiErrorResponse> handleNotReadable(
        HttpMessageNotReadableException ex,
        HttpServletRequest request) {

        ApiErrorResponse body = buildError(
                HttpStatus.BAD_REQUEST,
                "請求內容格式不正確（JSON 解析失敗或型別不符）",
                "MALFORMED_JSON",
                List.of(Optional.ofNullable(ex.getMostSpecificCause().getMessage()).orElse(ex.getMessage())),
                request
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getClass().getSimpleName());
        body.put("message", ex.getMessage());
        if (ex.getCause() != null) {
            body.put("cause", ex.getCause().getMessage());
        }
        ex.printStackTrace(); // 輸出到控制台以便調試
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    /** 其它未預期錯誤（最後防線） */
    private ApiErrorResponse buildError(HttpStatus status,
                                        String message,
                                        String errorCode,
                                        List<String> details,
                                        HttpServletRequest request) {

        return new ApiErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                errorCode,
                details
        );
    }

    public ResponseEntity<ApiErrorResponse> handleGeneric(
        Exception ex,
        HttpServletRequest request) {
                ex.printStackTrace(); // 開發階段可以保留，正式環境可換 logger
                ApiErrorResponse body = buildError(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "伺服器發生未預期錯誤",
                        "INTERNAL_ERROR",List.of(ex.getMessage()),
                        request
                );
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    /** @Valid body 驗證錯誤（DTO 欄位） */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        List<String> details = new ArrayList<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            String msg = fieldError.getField() + ": " + fieldError.getDefaultMessage();
            details.add(msg);
        }

        ApiErrorResponse body = buildError(
                HttpStatus.BAD_REQUEST,
                "請求內容驗證失敗",
                "VALIDATION_ERROR",
                details,
                request
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    /** @RequestParam / @PathVariable 等 ConstraintViolation */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request) {

        List<String> details = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .toList();

        ApiErrorResponse body = buildError(
                HttpStatus.BAD_REQUEST,
                "請求參數驗證失敗",
                "CONSTRAINT_VIOLATION",
                details,
                request
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    

    /** 資料庫約束錯誤（例如 unique key, not null） */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {

        ApiErrorResponse body = buildError(
                HttpStatus.CONFLICT,
                "資料庫約束違反",
                "DATA_INTEGRITY_VIOLATION",
                List.of(Optional.ofNullable(ex.getMostSpecificCause().getMessage())
                        .orElse(ex.getMessage())),
                request
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }
}