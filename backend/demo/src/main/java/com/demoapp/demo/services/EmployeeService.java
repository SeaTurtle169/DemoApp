package com.demoapp.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.demoapp.demo.models.Employee;
import com.demoapp.demo.repository.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeAuthorityService employeeAuthorityService;

    @Autowired
    private DepartmentsService departmentService;

    @Autowired
    private RolesService rolesService;

    // Lấy danh sách employee
    public List<Employee> getList() {
        return employeeRepository.findAll();
    }

    public Employee getById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy Employee với id: " + id));
    }

    public Employee saveEmployee(Integer id, Employee employeeData, Integer deptId, Integer roleId,
            boolean hasAuthority) {
        Employee emp;

        if (id == null) {
            // Trường hợp tạo mới
            if (employeeRepository.existsByEmail(employeeData.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại!");
            }
            emp = new Employee();
        } else {
            // Trường hợp cập nhật
            emp = employeeRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Không tìm thấy Employee với id: " + id));

            if (!emp.getEmail().equals(employeeData.getEmail())
                    && employeeRepository.existsByEmailAndIdNot(employeeData.getEmail(), id)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại!");
            }
        }

        // Gán dữ liệu chung
        emp.setName(employeeData.getName());
        emp.setPhone(employeeData.getPhone());
        emp.setAvatar(employeeData.getAvatar());
        emp.setActive(employeeData.isActive());
        emp.setEmail(employeeData.getEmail());
        emp.setRole(rolesService.getById(roleId));
        emp.setBirthday(employeeData.getBirthday());
        emp.setDepartment(departmentService.getById(deptId));
        if (roleId != null) {
            emp.getRole().setId(roleId);
            if (hasAuthority && roleId == 2 && !employeeAuthorityService.ifAssetOther(emp.getId())) {
                employeeAuthorityService.grantAssetOther(emp);
            } else if (hasAuthority && roleId == 2 && employeeAuthorityService.ifAssetOther(emp.getId())) {
                // đã có quyền rồi, không làm gì
            } else if (!hasAuthority && roleId == 2 && employeeAuthorityService.ifAssetOther(emp.getId())) {
                // Xoá quyền
                employeeAuthorityService.revokeAssetOther(emp);
            }
        }
        return employeeRepository.save(emp);
    }

    // Xoá employee
    public void deleteEmployee(Integer id) {
        employeeAuthorityService.deleteByEmployeeId(id);
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy Employee với id: " + id));
        employeeRepository.delete(emp);
    }
}
