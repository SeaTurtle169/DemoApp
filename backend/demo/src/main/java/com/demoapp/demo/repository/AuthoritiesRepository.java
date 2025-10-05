package com.demoapp.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Authorities;

public interface AuthoritiesRepository extends JpaRepository<Authorities, Integer>{
    
    List<Authorities> findAll();
    
}
