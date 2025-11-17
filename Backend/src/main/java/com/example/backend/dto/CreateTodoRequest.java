package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTodoRequest {
    @NotBlank(message = "title 不可為空")
    @Size(max = 100, message = "title 最多 100 字")
    private String title;

    public CreateTodoRequest() {}

    public CreateTodoRequest(String title) { this.title = title; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
