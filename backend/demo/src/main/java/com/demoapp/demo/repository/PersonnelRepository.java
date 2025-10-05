package com.demoapp.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Personnel;

public interface PersonnelRepository extends JpaRepository<Personnel, Integer> {

    List<Personnel> findAll();

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Integer id);

    List<Personnel> findByDepartment_Id(Integer idDepartment);
}
