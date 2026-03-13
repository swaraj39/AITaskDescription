package com.example.demo.DTOs;


import lombok.Data;

@Data
public class TaskDTO {
    private String title;
    private String status;
    private String assignee;
    private Long projectid;
}
