package com.example.backend.service;

import com.example.backend.domain.Todo;
import com.example.backend.repo.TodoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TodoServiceSQL {
    private final TodoRepository repo;
    public TodoServiceSQL(TodoRepository repo){ this.repo = repo; }

    public List<Todo> list(){ return repo.findAll(); }
    public Todo get(Long id){ return repo.findById(id).orElseThrow(); }
    public Todo create(Todo t){ return repo.save(t); }
    public Todo update(Long id, Todo patch){
        Todo t = get(id);
        if (patch.getTitle()!=null) t.setTitle(patch.getTitle());
        t.setCompleted(patch.isCompleted());
        return repo.save(t);
    }
    public void delete(Long id){ repo.deleteById(id); }
}