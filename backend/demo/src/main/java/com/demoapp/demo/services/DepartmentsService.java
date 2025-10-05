package com.demoapp.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demoapp.demo.models.Departments;
import com.demoapp.demo.repository.DepartmentsRepository;

@Service
public class DepartmentsService {

    @Autowired
    private DepartmentsRepository departmentRepository;

    public List<Departments> getList() {
        return departmentRepository.findAll();
    }

    public Departments getById(Integer id) {
        return departmentRepository.findById(id).orElse(null);
    }
}
