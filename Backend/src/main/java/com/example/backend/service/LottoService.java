package com.example.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;
import com.example.backend.domain.Lotto;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.backend.repo.LottoRepository;

@Service
public class LottoService {
    @Autowired
    private LottoRepository repository;

    public List<Integer> generateAndSaveStatistics(int groups) {
        List<Integer> finalTop6 = new ArrayList<>();
        
        for (int g = 0; g < groups; g++) {
            // 1. 隨機產生 1-42 數字 100,000 次並統計
            int[] counts = new int[43]; // 索引 1-42
            Random random = new Random();
            for (int i = 0; i < 100000; i++) {
                int num = random.nextInt(42) + 1;
                counts[num]++;
            }

            // 2. 取得出現次數最高的前 6 個數字
            List<Integer> numbers = new ArrayList<>();
            for (int i = 1; i <= 42; i++) numbers.add(i);
            
            List<Integer> top6 = numbers.stream()
                .sorted((a, b) -> Integer.compare(counts[b], counts[a])) // 按次數降序
                .limit(6)
                .sorted() // 樂透號碼通常按大小排序儲存
                .collect(Collectors.toList());

            // 3. 儲存至資料庫（格式化數字為更友好的格式）
            Lotto result = new Lotto();
            String numbersStr = top6.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(", "));
            result.setNumbers(numbersStr);
            repository.save(result);
            
            finalTop6.addAll(top6);
        }
        return finalTop6;
    }
}
