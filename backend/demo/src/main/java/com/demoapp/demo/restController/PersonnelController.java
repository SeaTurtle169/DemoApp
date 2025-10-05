package com.demoapp.demo.restController;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.demoapp.demo.models.Personnel;
import com.demoapp.demo.repository.PersonnelRepository;
import com.demoapp.demo.services.DepartmentsService;
import com.demoapp.demo.services.PersonnelService;
import com.demoapp.demo.services.RolesService;

@RestController
@RequestMapping("/api")
public class PersonnelController {

    @Autowired
    private PersonnelService personnelService;

    @Autowired
    private DepartmentsService departmentService;

    @Autowired
    private RolesService roleService;

    @Autowired
    private PersonnelRepository personnelRepository;

    // ✅ Lấy toàn bộ danh sách
    @GetMapping("/getPersonnelList")
    public List<Personnel> getPersonnelList() {
        return personnelService.getList();
    }

    // ✅ Lấy danh sách Personnel theo idDepartment
    @GetMapping("/getPersonnelByDepartment")
    public List<Personnel> getPersonnelByDepartment(@RequestParam Integer departmentId) {
        System.out.println(personnelService.getByDepartment(departmentId).size());
        return personnelService.getByDepartment(departmentId);
    }

    // ✅ Lấy chi tiết Personnel theo id
    @GetMapping("/personnel/{id}")
    public ResponseEntity<Personnel> getPersonnelById(@PathVariable Integer id) {
        return personnelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Tạo Personnel
    @PostMapping("/personnel")
    public ResponseEntity<Personnel> createPersonnel(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("department") Integer deptId,
            @RequestParam("role") Integer roleId,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam("isActive") boolean isActive) throws IOException {
        Personnel newPersonnel = new Personnel();
        newPersonnel.setName(name);
        newPersonnel.setEmail(email);
        newPersonnel.setPhone(phone);
        newPersonnel.setActive(isActive);

        if (avatar != null && !avatar.isEmpty()) {
            String filePath = saveAvatarFile(avatar);
            newPersonnel.setAvatar(filePath);
        }

        newPersonnel.setDepartment(departmentService.getById(deptId));
        newPersonnel.setRole(roleService.getById(roleId));

        Personnel saved = personnelRepository.save(newPersonnel);
        return ResponseEntity.ok(saved);
    }

    // ✅ Cập nhật Personnel
    @PostMapping("/personnel/{id}")
    public ResponseEntity<Personnel> updatePersonnel(
            @PathVariable Integer id,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("department") Integer deptId,
            @RequestParam("role") Integer roleId,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam("isActive") boolean isActive) throws IOException {
        Personnel personnel = personnelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy Personnel với id: " + id));

        personnel.setName(name);
        personnel.setEmail(email);
        personnel.setPhone(phone);
        personnel.setActive(isActive);

        if (avatar != null && !avatar.isEmpty()) {
            String filePath = saveAvatarFile(avatar);
            personnel.setAvatar(filePath);
        }

        personnel.setDepartment(departmentService.getById(deptId));
        personnel.setRole(roleService.getById(roleId));

        Personnel updated = personnelRepository.save(personnel);
        return ResponseEntity.ok(updated);
    }

    // ✅ Xoá Personnel
    @DeleteMapping("/personnel/{id}")
    public ResponseEntity<Void> deletePersonnel(@PathVariable Integer id) {
        personnelRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 📂 Lưu file avatar
    private String saveAvatarFile(MultipartFile file) throws IOException {
        File dir = new File("D:/img/avatar/");
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }
        String uniqueName = UUID.randomUUID().toString() + ext;

        String fullPath = "D:/img/avatar/" + uniqueName;
        file.transferTo(new File(fullPath));

        return uniqueName;
    }
}
