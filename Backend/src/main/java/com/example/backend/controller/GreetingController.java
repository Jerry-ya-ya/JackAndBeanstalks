package com.example.backend.controller;

import com.example.backend.dto.GreetingResponse;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Validated
public class GreetingController {
    // GET /api/hello?name=Jerry
    @GetMapping("/hello")
    public GreetingResponse hello(
            @RequestParam(defaultValue = "World")
            @Size(min = 1, max = 50, message = "name 長度需介於 1~50")
            String name
    ) {
        return new GreetingResponse("Hello, " + name + "!");
    }
    
    @GetMapping("/time")
    public Map<String, String> time() {
        var now = OffsetDateTime.now(ZoneId.of("Asia/Taipei"));
        return Map.of(
            "serverTime", now.toString(),
            "zone", "Asia/Taipei"
        );
    }
}