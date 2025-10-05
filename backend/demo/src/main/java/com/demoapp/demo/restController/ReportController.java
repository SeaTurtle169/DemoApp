package com.demoapp.demo.restController;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.demoapp.demo.models.Competency;
import com.demoapp.demo.models.Criteria;
import com.demoapp.demo.models.Employee;
import com.demoapp.demo.models.Personnel;
import com.demoapp.demo.models.Report;
import com.demoapp.demo.models.ReportsDetail;
import com.demoapp.demo.models.Result;
import com.demoapp.demo.services.CompetencyService;
import com.demoapp.demo.services.CriteriaService;
import com.demoapp.demo.services.EmployeeService;
import com.demoapp.demo.services.PersonnelService;
import com.demoapp.demo.services.ReportService;
import com.demoapp.demo.services.ResultService;

@RestController
@RequestMapping("/api")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private PersonnelService personnelService;

    @Autowired
    private CompetencyService competencyService;

    @Autowired
    private CriteriaService criteriaService;

    @Autowired
    private ResultService resultService;

    // Lấy danh sách báo cáo theo PersonnelId
    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getReportsByPersonnel(@RequestParam Integer personnelId) {
        return ResponseEntity.ok(reportService.getByPersonnel(personnelId));
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Integer id) {
        Report report = reportService.getById(id);
        return report != null ? ResponseEntity.ok(report) : ResponseEntity.notFound().build();
    }

    @PostMapping("/reports")
    public ResponseEntity<Report> createReport(@RequestBody Map<String, Object> body) {
        try {
            Integer personnelId = (Integer) body.get("personnelId");
            Integer competencyId = (Integer) body.get("competencyId");
            Integer employeeId = (Integer) body.get("employeeId");

            Personnel personnel = personnelService.findById(personnelId);
            Competency competency = competencyService.getCompetencyById(competencyId);

            Employee employee = employeeService.getById(employeeId);

            Report report = new Report();
            report.setPersonnel(personnel);
            report.setCompetency(competency);
            report.setEmployeeReported(employee);
            report.setDate(new Date());

            // Lưu Report trước
            Report savedReport = reportService.save(report);

            // Lấy danh sách details từ body
            List<Map<String, Object>> details = (List<Map<String, Object>>) body.get("details");
            for (Map<String, Object> d : details) {
                Integer criteriaId = (Integer) d.get("criteriaId");
                Integer resultId = (Integer) d.get("resultId");

                Criteria criteria = criteriaService.getById(criteriaId);

                Result result = resultService.getById(resultId);

                ReportsDetail rd = new ReportsDetail();
                rd.setReport(savedReport);
                rd.setCriteria(criteria);
                rd.setResult(result);

                reportService.saveDetail(rd);
            }

            return ResponseEntity.ok(savedReport);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}