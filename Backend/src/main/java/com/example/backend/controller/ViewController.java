package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;

@Controller
public class ViewController {
    @GetMapping("/")
    public String homePage() {
        return "forward:/home.html"; // 轉發到靜態資源
    }

    @GetMapping("/login")
    public String loginPage() {
        return "forward:/login.html"; // 轉發到靜態資源
    }
    
    @GetMapping("/register")
    public String registerPage() {
        return "forward:/register.html"; // 轉發到靜態資源
    }

    @GetMapping("/userhome")
    public String userhomePage() {
        return "forward:/userhome.html"; // 轉發到靜態資源
    }

    @GetMapping("/lotto")
    public String lottoPage() {
        return "forward:/lotto.html"; // 轉發到靜態資源
    }
}