package com.demoapp.demo.restController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demoapp.demo.services.EmployeeService;

@RestController
@RequestMapping("/api")
public class Test {

    @Autowired
    private EmployeeService employeeService;

}
