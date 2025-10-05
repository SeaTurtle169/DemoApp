package com.demoapp.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByEmail(String email);

    List<Employee> findAll();

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Integer id);
}
