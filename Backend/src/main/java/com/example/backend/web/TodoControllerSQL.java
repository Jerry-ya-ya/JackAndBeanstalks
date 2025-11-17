package com.example.backend.web;

import com.example.backend.domain.Todo;
import com.example.backend.service.TodoServiceSQL;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/todosSQL")
public class TodoControllerSQL {
    private final TodoServiceSQL service;
    public TodoControllerSQL(TodoServiceSQL service){ this.service = service; }

    @GetMapping
    public List<Todo> list(){ return service.list(); }

    @GetMapping("/{id}")
    public Todo get(@PathVariable Long id){ return service.get(id); }
    
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Todo create(@RequestBody Todo t){ return service.create(t); }
    
    @PatchMapping("/{id}")
    public Todo update(@PathVariable Long id, @RequestBody Todo patch){
        return service.update(id, patch);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id){ service.delete(id); }
}
