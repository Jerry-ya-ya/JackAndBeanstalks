package com.example.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // 測試階段先關閉
            .authorizeHttpRequests(auth -> auth
                // 靜態資源和頁面
                .requestMatchers("/", "/register", "/login", "/register.html", "/login.html", "/test.html", "/home.html").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**", "/static/**", "/**.html").permitAll()
                
                // API 端點 - 必須在所有其他規則之前，確保 POST 請求不被攔截
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/lotto/**").authenticated() // 樂透 API 需要登入
                .anyRequest().authenticated() // 其他都要登入
            )
            .formLogin(form -> form
                .loginPage("/login") // 明確指定登入頁面
                .loginProcessingUrl("/perform_login") // 使用不同的 URL 避免與其他 POST 衝突
                .defaultSuccessUrl("/userhome.html", true) // 登入成功後跳轉到使用者頁面
                .failureUrl("/login?error=true") // 登入失敗
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 使用強大的加密演算法
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}