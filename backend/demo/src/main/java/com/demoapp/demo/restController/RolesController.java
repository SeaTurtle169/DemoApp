package com.demoapp.demo.restController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demoapp.demo.models.Roles;
import com.demoapp.demo.services.RolesService;

@RestController
@RequestMapping("/api")
public class RolesController {

    @Autowired
    private RolesService rolesService;

    @GetMapping("/getRoles")
    public List<Roles> getList() {
        return rolesService.getList();
    }
}
