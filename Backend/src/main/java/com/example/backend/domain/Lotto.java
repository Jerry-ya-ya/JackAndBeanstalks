package com.example.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
public class Lotto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String numbers; // 存儲前 6 名，如 "5, 12, 23, 33, 40, 42"
    private LocalDateTime createdAt = LocalDateTime.now();
}
