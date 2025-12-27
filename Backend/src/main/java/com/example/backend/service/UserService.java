package com.example.backend.service;

import com.example.backend.domain.Member;
import com.example.backend.repo.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service // 務必加上這個註解，Spring 才能自動掃描並註冊它
public class UserService implements UserDetailsService {
    @Autowired
    private MemberRepository memberRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 從資料庫查詢使用者
        Member member = memberRepository.findByUsername(username);
        if (member == null) {
            throw new UsernameNotFoundException("使用者不存在: " + username);
        }
        // 回傳實作了 UserDetails 介面的 Member 物件
        return member;
    }
}