package com.example.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "todo")
public class Todo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private boolean completed = false;

    @Column(name="created_at", nullable=false, updatable=false)
    @JsonIgnore
    private Instant createdAt;

    @Column(name="updated_at", nullable=false)
    @JsonIgnore
    private Instant updatedAt;

    @PrePersist
    public void prePersist(){
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = Instant.now();
        }
    }

    @PreUpdate
    public void touch(){ this.updatedAt = Instant.now(); }

    // getters/setters
    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }
    
    public String getTitle(){ return title; }
    public void setTitle(String title){ this.title = title; }
    
    public boolean isCompleted(){ return completed; }
    public void setCompleted(boolean completed){ this.completed = completed; }
    
    public Instant getCreatedAt(){ return createdAt; }
    public void setCreatedAt(Instant createdAt){ this.createdAt = createdAt; }
    
    public Instant getUpdatedAt(){ return updatedAt; }
    public void setUpdatedAt(Instant updatedAt){ this.updatedAt = updatedAt; }
}