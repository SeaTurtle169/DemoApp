package com.demoapp.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.demoapp.demo.models.Competency;
import com.demoapp.demo.repository.CompetencyRepository;

import jakarta.transaction.Transactional;

@Service
public class CompetencyService {

    @Autowired
    private CompetencyRepository competencyRepository;

    @Autowired
    private CriteriaService criteriaService;

    public List<Competency> getList() {
        return competencyRepository.findAll();
    }

    public Competency getCompetencyById(Integer id) {
        return competencyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy Competency với id: " + id));
    }

    public Competency updateCompetency(Integer id, Competency updated) {
        Competency comp = competencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại đánh giá với id: " + id));

        comp.setName(updated.getName());
        return competencyRepository.save(comp);
    }

    public Competency saveCompetency(Competency competency) {
        if (competency == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Competency không hợp lệ");
        }
        return competencyRepository.save(competency);
    }

    @Transactional
    public void deleteCompetency(Competency competency) {
        criteriaService.deleteByCompetency(competency);
        competencyRepository.delete(competency);
    }
}
