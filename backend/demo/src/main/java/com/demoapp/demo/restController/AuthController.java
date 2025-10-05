package com.demoapp.demo.restController;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demoapp.demo.dto.reponse.AuthResponse;
import com.demoapp.demo.dto.request.AuthRequest;
import com.demoapp.demo.services.AuthoritiesService;
import com.demoapp.demo.services.EmployeeAuthorityService;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthoritiesService authService;

    @Autowired
    private EmployeeAuthorityService employeeAuthorityService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/checkAssetOther")
    public boolean checkAssetOther(@RequestBody Map<String, Object> request) {
        Integer idEmployee = Integer.parseInt(request.get("idEmployee").toString());
        return employeeAuthorityService.ifAssetOther(idEmployee);
    }

}
