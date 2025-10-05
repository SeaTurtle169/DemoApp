package com.demoapp.demo.restController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demoapp.demo.models.Departments;
import com.demoapp.demo.services.DepartmentsService;


@RestController
@RequestMapping("/api")
public class DepartmentsController {
    @Autowired
    private DepartmentsService departmentService;
    
    @GetMapping("/getDepartments")
    public List<Departments> getMethodName() {
        return departmentService.getList();
    }
    
}
