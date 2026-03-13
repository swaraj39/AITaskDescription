package com.example.demo.Models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
//    @Column(length = 2000)
    private String description;
    @CreationTimestamp
    private Date createdAt;
    private String status;
    private String priority;
    private String assignee;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Projects project;

    @OneToMany(mappedBy = "task",  cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comments> comments;
}
