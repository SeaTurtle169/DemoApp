package com.demoapp.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demoapp.demo.repository.ReportsDetailRepository;
@Service
public class ReportsDetailService {
    @Autowired
    private ReportsDetailRepository reportsDetailRepository;
}
