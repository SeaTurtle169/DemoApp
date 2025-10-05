package com.demoapp.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demoapp.demo.models.Result;
import com.demoapp.demo.repository.ResultRepository;

@Service
public class ResultService {
    @Autowired
    private ResultRepository resultRepository;

    public Result getById(Integer id) {
        return resultRepository.findById(id).orElse(null);
    }
}
