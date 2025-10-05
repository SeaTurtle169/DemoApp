package com.demoapp.demo.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demoapp.demo.models.Authorities;
import com.demoapp.demo.models.Employee;
import com.demoapp.demo.models.EmployeeAuthority;
import com.demoapp.demo.repository.AuthoritiesRepository;
import com.demoapp.demo.repository.EmployeeAuthorityRepository;

@Service
public class EmployeeAuthorityService {

    @Autowired
    private EmployeeAuthorityRepository employeeAuthorityRepository;

    @Autowired
    private AuthoritiesRepository authoritiesRepository;

    public boolean ifAssetOther(int employeeId) {
        return employeeAuthorityRepository.existsByEmployee_IdAndAuthority_Name(employeeId, "assetOther");
    }

    public void grantAssetOther(Employee employee) {
        EmployeeAuthority employeeAuthority = new EmployeeAuthority();
        employeeAuthority.setEmployee(employee);
        Optional<Authorities> authority = authoritiesRepository.findById(1);
        employeeAuthority.setAuthority(authority.get());
        employeeAuthorityRepository.save(employeeAuthority);
        System.out.println("Granted assetOther to employee: " + employee.toString());
    }

    public void revokeAssetOther(Employee employee) {
        EmployeeAuthority empAuth = employeeAuthorityRepository.findByEmployee(employee);
        if (empAuth != null) {
            employeeAuthorityRepository.delete(empAuth);
        }
    }

    public void deleteByEmployeeId(Integer employeeId) {
        var empAuthList = employeeAuthorityRepository.findByEmployee_Id(employeeId);
        if (empAuthList != null && !empAuthList.isEmpty()) {
            employeeAuthorityRepository.deleteAll(empAuthList);
        }
    }
}
