package com.demoapp.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Competency;

public interface CompetencyRepository extends JpaRepository<Competency, Integer> {

}
