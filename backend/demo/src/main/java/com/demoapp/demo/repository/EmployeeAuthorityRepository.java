package com.demoapp.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Employee;
import com.demoapp.demo.models.EmployeeAuthority;

public interface EmployeeAuthorityRepository extends JpaRepository<EmployeeAuthority, Integer> {

    List<EmployeeAuthority> findByEmployee_Id(Integer employeeId);

    boolean existsByEmployee_IdAndAuthority_Name(Integer employeeId, String authorityName);

    EmployeeAuthority findByEmployee(Employee employee);
}
