package com.example.demo.DTOs;


import lombok.Data;

@Data
public class CommentsDTO {
    private String comment;
    private String user;
    private Long taskid;
}
