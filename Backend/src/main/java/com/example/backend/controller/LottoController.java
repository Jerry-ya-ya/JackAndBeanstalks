package com.example.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.example.backend.service.LottoService;

import com.example.backend.domain.Lotto;
import com.example.backend.repo.LottoRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/lotto")
public class LottoController {
    @Autowired
    private LottoService lottoService;

    @Autowired
    private LottoRepository lottoRepository; // 直接注入 Repository 進行查詢

    // 抽獎 API
    @PostMapping("/generate")
    public ResponseEntity<String> generate(@RequestParam int groups) {
        lottoService.generateAndSaveStatistics(groups);
        return ResponseEntity.ok("產生成功！");
    }

    // 查詢所有結果 API (讓前端顯示表格)
    @GetMapping("/history")
    public List<Lotto> getHistory() {
        return lottoRepository.findAll(); 
    }
}