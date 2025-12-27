package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.example.backend.domain.Member;
import com.example.backend.repo.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Controller
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public String register(
            @ModelAttribute Member member,
            RedirectAttributes redirectAttributes) {
        
        // 檢查用戶名是否已存在
        if (member.getUsername() == null || member.getUsername().trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "用戶名不能為空");
            return "redirect:/register";
        }
        if (memberRepository.findByUsername(member.getUsername()) != null) {
            redirectAttributes.addFlashAttribute("error", "用戶名已存在");
            return "redirect:/register";
        }
        
        // 密碼加密後儲存
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        memberRepository.save(member);
        
        redirectAttributes.addFlashAttribute("success", "註冊成功！請登入");
        return "redirect:/login";
    }
}
