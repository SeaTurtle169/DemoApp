package com.demoapp.demo.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.demoapp.demo.dto.reponse.AuthResponse;
import com.demoapp.demo.dto.request.AuthRequest;
import com.demoapp.demo.models.Employee;
import com.demoapp.demo.repository.EmployeeAuthorityRepository;
import com.demoapp.demo.repository.EmployeeRepository;
import com.demoapp.demo.util.JwtUtil;

@Service

public class AuthoritiesService {

    @Autowired
    private EmployeeRepository employeeRepo;
    @Autowired
    private EmployeeAuthorityRepository employeeAuthorityRepo;
    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest req) {
        Employee user = employeeRepo.findByEmail(req.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Thông tin đăng nhập chưa đúng"));

        if (!user.getPassword().equals(req.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Thông tin đăng nhập chưa đúng");
        }

        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Tài khoản đã bị khóa");
        }

        String roleName = user.getRole().getName();
        Integer userDeptId = user.getDepartment() != null ? user.getDepartment().getId() : null;

        // ✅ Nếu không chọn department khi login -> báo lỗi
        if (req.getDepartmentId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng chọn chi nhánh");
        }

        // ✅ Kiểm tra department
        boolean selectingOtherDept = (userDeptId != null && !userDeptId.equals(req.getDepartmentId()));

        if ("ADMIN".equalsIgnoreCase(roleName)) {
            // Admin -> bỏ qua check department
        } else if ("DIRECTOR".equalsIgnoreCase(roleName)) {
            if (selectingOtherDept) {
                boolean hasAssetOther = employeeAuthorityRepo
                        .existsByEmployee_IdAndAuthority_Name(user.getId(), "assetOther");
                if (!hasAssetOther) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Bạn không có quyền truy cập chi nhánh này");
                }
            }
        } else {
            // Các role còn lại bắt buộc đúng chi nhánh
            if (selectingOtherDept) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không thuộc chi nhánh này");
            }
        }

        // ✅ Lấy authorities
        List<String> authorities = employeeAuthorityRepo.findByEmployee_Id(user.getId()).stream()
                .map(ea -> ea.getAuthority().getName())
                .collect(Collectors.toList());

        // ✅ Sinh token với role chính xác
        String token = jwtUtil.generateToken(user.getEmail(), roleName, authorities);

        return new AuthResponse(token, roleName, authorities, user);
    }

}
