package com.example.backend.service;

import com.example.backend.dto.CreateTodoRequest;
import com.example.backend.dto.TodoResponse;
import com.example.backend.dto.UpdateTodoRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TodoServiceIM {

    private final Map<Long, TodoResponse> store = new ConcurrentHashMap<>();
    private final AtomicLong seq = new AtomicLong(1);

    public TodoResponse create(CreateTodoRequest req) {
        Long id = seq.getAndIncrement();
        TodoResponse todo = new TodoResponse(id, req.getTitle(), false);
        store.put(id, todo);
        return todo;
    }

    public List<TodoResponse> findAll() {
        // 直接依 id 排序回傳
        return store.values().stream()
                .sorted(Comparator.comparingLong(TodoResponse::getId))
                .toList();
    }

    public Optional<TodoResponse> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public Optional<TodoResponse> patch(Long id, UpdateTodoRequest req) {
        TodoResponse existing = store.get(id);
        if (existing == null) return Optional.empty();

        if (req.getTitle() != null) {
            existing.setTitle(req.getTitle());
        }
        if (req.getCompleted() != null) {
            existing.setCompleted(req.getCompleted());
        }
        return Optional.of(existing);
    }

    public boolean delete(Long id) {
        return store.remove(id) != null;
    }

    // for demo：清空
    public void clear() { store.clear(); }
}
