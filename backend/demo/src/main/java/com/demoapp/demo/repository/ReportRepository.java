package com.demoapp.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Personnel;
import com.demoapp.demo.models.Report;

public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findByPersonnel(Personnel personnel);
}
