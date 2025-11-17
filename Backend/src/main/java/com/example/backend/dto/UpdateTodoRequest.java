package com.example.backend.dto;

import jakarta.validation.constraints.Size;

public class UpdateTodoRequest {

    // PATCH 可選更新：title / completed 擇一或兩者
    @Size(max = 100, message = "title 最多 100 字")
    private String title;

    private Boolean completed;

    public UpdateTodoRequest() {}

    public UpdateTodoRequest(String title, Boolean completed) {
        this.title = title;
        this.completed = completed;
    }

    public String getTitle() { return title; }
    public Boolean getCompleted() { return completed; }

    public void setTitle(String title) { this.title = title; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}
