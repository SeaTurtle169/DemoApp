package com.demoapp.demo.restController;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.demoapp.demo.models.Employee;
import com.demoapp.demo.services.EmployeeService;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/getEmployeeList")
    public List<Employee> getEmployeeList() {
        return employeeService.getList();
    }

    private static final String UPLOAD_DIR = "D:/img/avatar/";

    @PostMapping("/employee")
    public ResponseEntity<Employee> createEmployee(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("department") Integer deptId,
            @RequestParam("role") Integer roleId,
            @RequestParam(value = "birthday", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date birthday,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam("isActive") boolean isActive,
            @RequestParam("password") String password,
            @RequestParam(value = "hasAuthority", required = false) boolean assetOther
    ) throws IOException {
        Employee newEmp = new Employee();
        newEmp.setName(name);
        newEmp.setEmail(email);
        newEmp.setPhone(phone);
        newEmp.setActive(isActive);
        newEmp.setPassword(password);
        newEmp.setBirthday(birthday);

        if (avatar != null && !avatar.isEmpty()) {
            String filePath = saveAvatarFile(avatar);
            newEmp.setAvatar(filePath);
        }

        Employee emp = employeeService.saveEmployee(null, newEmp, deptId, roleId, assetOther);
        return ResponseEntity.ok(emp);
    }

    @PostMapping("/employee/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Integer id,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("department") Integer deptId,
            @RequestParam("role") Integer roleId,
            @RequestParam(value = "birthday", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date birthday,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam("isActive") boolean isActive,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "hasAuthority", required = false) boolean assetOther
    ) throws IOException {

        Employee updated = new Employee();
        updated.setName(name);
        updated.setEmail(email);
        updated.setPhone(phone);
        updated.setActive(isActive);
        updated.setPassword(password);
        updated.setBirthday(birthday);
        if (avatar != null && !avatar.isEmpty()) {
            String filePath = saveAvatarFile(avatar);
            updated.setAvatar(filePath);
        }
        Employee emp = employeeService.saveEmployee(id, updated, deptId, roleId, assetOther);
        return ResponseEntity.ok(emp);
    }

    // ✅ Xoá nhân viên
    @DeleteMapping("/employee/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    // 📂 Hàm xử lý lưu file avatar
    private String saveAvatarFile(MultipartFile file) throws IOException {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // tạo tên file mới với UUID tránh trùng
        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }
        String uniqueName = UUID.randomUUID().toString() + ext;

        String fullPath = UPLOAD_DIR + uniqueName;
        file.transferTo(new File(fullPath));

        // Trả về đường dẫn tương đối (có thể dùng để hiển thị ảnh sau này)
        return uniqueName;
    }

}
