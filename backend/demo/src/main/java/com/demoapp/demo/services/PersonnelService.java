package com.demoapp.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.demoapp.demo.models.Personnel;
import com.demoapp.demo.repository.PersonnelRepository;

@Service
public class PersonnelService {

    @Autowired
    private PersonnelRepository personnelRepository;

    @Autowired
    private RolesService rolesService;

    @Autowired
    private DepartmentsService departmentService;

    public List<Personnel> getList() {
        return personnelRepository.findAll();
    }

    public List<Personnel> getByDepartment(Integer departmentId) {
        return personnelRepository.findByDepartment_Id(departmentId);
    }

    public Personnel findById(Integer id) {
        return personnelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy Personnel với id: " + id));
    }

    public Personnel savePersonnel(Integer id, Personnel personnelData, Integer deptId, Integer roleId,
            boolean hasAuthority) {
        Personnel emp;

        if (id == null) {
            // Trường hợp tạo mới
            if (personnelRepository.existsByEmail(personnelData.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại!");
            }
            emp = new Personnel();
        } else {
            // Trường hợp cập nhật
            emp = personnelRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Không tìm thấy Personnel với id: " + id));

            if (!emp.getEmail().equals(personnelData.getEmail())
                    && personnelRepository.existsByEmailAndIdNot(personnelData.getEmail(), id)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại!");
            }
        }

        // Gán dữ liệu chung
        emp.setName(personnelData.getName());
        emp.setPhone(personnelData.getPhone());
        emp.setAvatar(personnelData.getAvatar());
        emp.setActive(personnelData.isActive());
        emp.setEmail(personnelData.getEmail());
        emp.setRole(rolesService.getById(roleId));
        emp.setDepartment(departmentService.getById(deptId));
        return personnelRepository.save(emp);
    }

    // Xoá personnel
    public void deletePersonnel(Integer id) {
        Personnel emp = personnelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy Personnel với id: " + id));
        personnelRepository.delete(emp);
    }
}
