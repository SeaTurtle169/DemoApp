package com.demoapp.demo.restController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.demoapp.demo.models.Competency;
import com.demoapp.demo.models.Criteria;
import com.demoapp.demo.services.CompetencyService;
import com.demoapp.demo.services.CriteriaService;

@RestController
@RequestMapping("/api")
public class CompetencyController {

    @Autowired
    private CompetencyService competencyService;

    @Autowired
    private CriteriaService criteriaService;

    // 🔹 Lấy danh sách competency
    @GetMapping("/getCompetencyList")
    public List<Competency> getCompetencyList() {
        return competencyService.getList();
    }

    // 🔹 Lấy danh sách criteria
    @GetMapping("/getCriteriaList")
    public List<Criteria> getCriteriaList() {
        return criteriaService.getList();
    }

    // 🔹 Thêm competency
    @PostMapping("/addCompetency")
    public ResponseEntity<Competency> addCompetency(@RequestBody Competency competency) {
        Competency savedCompetency = competencyService.saveCompetency(competency);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCompetency);
    }

    // 🔹 Cập nhật competency
    @PutMapping("/updateCompetency/{id}")
    public ResponseEntity<Competency> updateCompetency(
            @PathVariable Integer id,
            @RequestBody Competency competency) {
        Competency updated = competencyService.updateCompetency(id, competency);
        return ResponseEntity.ok(updated);
    }

    // 🔹 Xóa competency
    @DeleteMapping("/deleteCompetency/{id}")
    public ResponseEntity<Void> deleteCompetency(@PathVariable Integer id) {
        Competency comp = competencyService.getCompetencyById(id);
        if (comp == null) {
            return ResponseEntity.notFound().build();
        }
        criteriaService.deleteByCompetency(comp);
        competencyService.deleteCompetency(comp);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Thêm criteria
    @PostMapping("/addCriteria")
    public ResponseEntity<Criteria> addCriteria(@RequestBody Criteria criteria) {
        Criteria savedCriteria = criteriaService.saveCriteria(criteria);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCriteria);
    }

    // 🔹 Cập nhật criteria
    @PutMapping("/updateCriteria/{id}")
    public ResponseEntity<Criteria> updateCriteria(
            @PathVariable Integer id,
            @RequestBody Criteria criteria) {
        Criteria updated = criteriaService.updateCriteria(id, criteria);
        return ResponseEntity.ok(updated);
    }

    // 🔹 Xóa criteria
    @DeleteMapping("/deleteCriteria/{id}")
    public ResponseEntity<Void> deleteCriteria(@PathVariable Integer id) {
        Criteria criteria = criteriaService.getCriteriaById(id);
        if (criteria == null) {
            return ResponseEntity.notFound().build();
        }
        criteriaService.deleteCriteria(criteria);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getCriteriaByCompetency")
    public List<Criteria> getCriteriaByCompetency(@RequestParam Integer competencyId) {
        Competency competency = competencyService.getCompetencyById(competencyId);
        if (competency == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy competency id=" + competencyId);
        }
        return criteriaService.getListByCompetency(competency);
    }
}
