package com.demoapp.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demoapp.demo.models.Roles;
import com.demoapp.demo.repository.RolesRepository;

@Service
public class RolesService {

    @Autowired
    private RolesRepository rolesRepository;

    public List<Roles> getList() {
        return rolesRepository.findAll();
    }

    public Roles getById(Integer id) {
        return rolesRepository.findById(id).orElse(null);
    }
}
