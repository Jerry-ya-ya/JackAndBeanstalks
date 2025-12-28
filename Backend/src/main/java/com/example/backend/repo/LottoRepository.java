package com.example.backend.repo;

import com.example.backend.domain.Lotto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LottoRepository extends JpaRepository<Lotto, Long> {
    
}
