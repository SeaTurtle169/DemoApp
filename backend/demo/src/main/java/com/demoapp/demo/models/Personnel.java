package com.demoapp.demo.models;

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
public class Personnel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", columnDefinition = "NVARCHAR(100)")
    private String name;

    private String avatar;

    private String phone;

    @Column(unique = true)
    private String email;

    private boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "idDepartment")
    private Departments department;

    @ManyToOne
    @JoinColumn(name = "idRole")
    private Roles role;
}
