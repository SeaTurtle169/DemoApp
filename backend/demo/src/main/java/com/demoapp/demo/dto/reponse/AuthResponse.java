package com.demoapp.demo.dto.reponse;

import java.util.List;

import com.demoapp.demo.models.Employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private List<String> authorities;
    private Employee user;
}
