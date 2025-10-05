package com.demoapp.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demoapp.demo.models.Competency;
import com.demoapp.demo.models.Criteria;

public interface CriteriaRepository extends JpaRepository<Criteria, Integer> {

    public void deleteAllByCompetency(Competency competency);

    public List<Criteria> findByCompetency(Competency competency);
}
