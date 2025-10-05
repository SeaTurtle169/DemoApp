package com.demoapp.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Roles;

public interface RolesRepository extends JpaRepository<Roles, Integer> {

    List<Roles> findAll();
}
