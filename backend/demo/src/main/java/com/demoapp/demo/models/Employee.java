package com.demoapp.demo.models;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthday = new Date();

    private String avatar;

    private String phone;

    private boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "idDepartment")
    private Departments department;

    @ManyToOne
    @JoinColumn(name = "idRole")
    private Roles role;
}
