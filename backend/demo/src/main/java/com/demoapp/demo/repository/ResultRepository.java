package com.demoapp.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Result;

public interface ResultRepository extends JpaRepository<Result, Integer>{
    
}
