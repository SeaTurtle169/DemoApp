package com.demoapp.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Departments;

public interface DepartmentsRepository extends JpaRepository<Departments, Integer>{
    @Override
    List<Departments> findAll();
}
