package com.demoapp.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.demoapp.demo.models.Competency;
import com.demoapp.demo.models.Criteria;
import com.demoapp.demo.repository.CriteriaRepository;

import jakarta.transaction.Transactional;

@Service
public class CriteriaService {

    @Autowired
    private CriteriaRepository criteriaRepository;

    public List<Criteria> getList() {
        return criteriaRepository.findAll();
    }

    public Criteria getById(Integer id) {
        return criteriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy Criteria với id: " + id));
    }

    @Transactional
    public void deleteByCompetency(Competency competency) {
        if (competency == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Competency không hợp lệ");
        }
        criteriaRepository.deleteAllByCompetency(competency);
    }

    public void deleteCriteria(Criteria criteria) {
        if (criteria == null || criteria.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Criteria không hợp lệ");
        }
        if (!criteriaRepository.existsById(criteria.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Không tìm thấy Criteria với id: " + criteria.getId());
        }
        criteriaRepository.delete(criteria);
    }

    public Criteria getCriteriaById(Integer id) {
        return criteriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy Criteria với id: " + id));
    }

    public Criteria updateCriteria(Integer id, Criteria updated) {
        Criteria c = criteriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tiêu chí với id: " + id));

        c.setName(updated.getName());
        c.setCompetency(updated.getCompetency());
        return criteriaRepository.save(c);
    }

    public List<Criteria> getListByCompetency(Competency competency) {
        if (competency == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Competency không hợp lệ");
        }
        return criteriaRepository.findByCompetency(competency);
    }

    public Criteria saveCriteria(Criteria criteria) {
        if (criteria == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Criteria không hợp lệ");
        }
        return criteriaRepository.save(criteria);
    }
}
