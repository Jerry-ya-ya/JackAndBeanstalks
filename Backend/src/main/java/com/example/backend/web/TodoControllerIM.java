package com.example.backend.web;

import com.example.backend.dto.CreateTodoRequest;
import com.example.backend.dto.TodoResponse;
import com.example.backend.dto.UpdateTodoRequest;
import com.example.backend.service.TodoServiceIM;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/todosIM")
public class TodoControllerIM {

    private final TodoServiceIM service;

    public TodoControllerIM(TodoServiceIM service) { this.service = service; }

    @PostMapping
    public ResponseEntity<TodoResponse> create(@Valid @RequestBody CreateTodoRequest req) {
        TodoResponse created = service.create(req);
        return ResponseEntity.created(URI.create("/api/todos/" + created.getId())).body(created);
    }

    @GetMapping
    public List<TodoResponse> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> one(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TodoResponse> patch(@PathVariable Long id,
                                              @Valid @RequestBody UpdateTodoRequest req) {
        return service.patch(id, req)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean removed = service.delete(id);
        if (!removed) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
}
