package com.demoapp.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demoapp.demo.models.Personnel;
import com.demoapp.demo.models.Report;
import com.demoapp.demo.models.ReportsDetail;
import com.demoapp.demo.repository.PersonnelRepository;
import com.demoapp.demo.repository.ReportRepository;
import com.demoapp.demo.repository.ReportsDetailRepository;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private ReportsDetailRepository reportsDetailRepository;
    @Autowired
    private PersonnelRepository personnelRepository;

    public List<Report> getByPersonnel(Integer personnelId) {
        Personnel p = personnelRepository.findById(personnelId).orElse(null);
        return p == null ? List.of() : reportRepository.findByPersonnel(p);
    }

    public Report getById(Integer id) {
        return reportRepository.findById(id).orElse(null);
    }

    public Report save(Report report) {
        return reportRepository.save(report);
    }

    public ReportsDetail saveDetail(ReportsDetail detail) {
        return reportsDetailRepository.save(detail);
    }
}
