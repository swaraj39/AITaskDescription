package com.example.demo.Conrollers;


import com.example.demo.Annotations.LogTime;
import com.example.demo.DTOs.CommentsDTO;
import com.example.demo.DTOs.ProjectDTO;
import com.example.demo.DTOs.TaskDTO;
import com.example.demo.Models.Comments;
import com.example.demo.Models.Projects;
import com.example.demo.Models.Task;
import com.example.demo.Repository.CommentsRepo;
import com.example.demo.Repository.ProjectRepo;
import com.example.demo.Repository.TaskRepo;
import com.example.demo.Service.AIService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
public class FrontController {


    private final ProjectRepo projectRepo;
    private final TaskRepo taskRepo;
    private final CommentsRepo commentsRepo;

    @Autowired
    private AIService aiService;

    public FrontController(ProjectRepo projectRepo, TaskRepo taskRepo, CommentsRepo commentsRepo) {
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
        this.commentsRepo = commentsRepo;
    }
//todo All related projects
    @PostMapping("/add/project")
    public Projects addProject(@RequestBody ProjectDTO project) {
        return projectRepo.save(Projects.builder()
                .name(project.getProjectName())
                .description(project.getProjectDescription())
                .build());
    }
    @PutMapping("/update/project/{id}")
    public Projects updateProject(@RequestBody ProjectDTO project, @PathVariable Long id) {
        Projects projects = projectRepo.findById(id).orElseThrow();
        projects.setName(project.getProjectName());
        projects.setDescription(project.getProjectDescription());
        projectRepo.save(projects);
        return projects;
    }
    @DeleteMapping("/delete/project/{id}")
    public String deleteProject(@PathVariable Long id) {
        Projects projects = projectRepo.findById(id).orElseThrow();
        projectRepo.delete(projects);
        return "Project has been deleted";
    }
    @GetMapping("/get/project/{id}")
    public Projects getProject(@PathVariable Long id) {
        return projectRepo.findById(id).orElseThrow();
    }

    @LogTime("HIGH")
    @GetMapping("/get/all/project")
    public List<Projects> getAllProject() {
        return projectRepo.findAll();
    }

    // todo all related tasks
    @PostMapping("/add/task")
    public String addTask(@RequestBody TaskDTO taskDTO) {
        String prompt = taskDTO.getTitle();
        String name = projectRepo.findById(taskDTO.getProjectid()).get().getName();
        Projects projects = projectRepo.findById(taskDTO.getProjectid()).get();
        String description = projectRepo.findById(taskDTO.getProjectid()).get().getDescription();
        // String result = aiService.generateText(prompt);
        String result = aiService.generateTextByTitle(prompt,name,projects.getDescription());
        System.out.println(result);
        List<String> list = Arrays.stream(result.split(":")).toList();
        Task build = Task.builder().title(taskDTO.getTitle())
                .assignee(taskDTO.getAssignee())
                .status(taskDTO.getStatus())
                .description(list.get(0))
                .priority(list.get(1))
                .project(projectRepo.findById(taskDTO.getProjectid()).get())
                .build();
        taskRepo.save(build);
        return "saved";
    }
    @PutMapping("/update/task/{id}")
    public Task updateTask(@RequestBody TaskDTO taskDTO, @PathVariable Long id) {
        Projects projects = projectRepo.findById(id).orElseThrow();
        Task task = taskRepo.findById(id).get();
        String result = aiService.generateText(taskDTO.getTitle());
        System.out.println(result);
        List<String> list = Arrays.stream(result.split(":")).toList();
        task.setTitle(taskDTO.getTitle());
        task.setAssignee(taskDTO.getAssignee());
        task.setStatus(taskDTO.getStatus());
        task.setDescription(list.get(0));
        task.setPriority(list.get(1));
        taskRepo.save(task);
        return task;
    }
    @Transactional
    @DeleteMapping("/delete/task/{id}")
    public String deleteTask(@PathVariable Long id) {
//        Projects projects = projectRepo.findById(id).orElseThrow();
        Task task = taskRepo.findById(id).get();
        taskRepo.delete(task);
        return "task has been deleted";
    }
    @GetMapping("/get/task/{id}")
    public Task getTask(@PathVariable Long id) {
        return taskRepo.findById(id).orElseThrow();
    }
    @GetMapping("/get/taskbyproject/{id}")
    public List<Task> getTaskByProject(@PathVariable Long id) {
        return taskRepo.findByProject(projectRepo.findById(id).get());
    }
    @GetMapping("/get/all/task")
    public List<Task> getAllTask() {
        return taskRepo.findAll();
    }

    // todo all related comments
    @PostMapping("/add/comment")
    public String addComment(@RequestBody CommentsDTO commentsDTO) {
        System.out.println(commentsDTO.getTaskid());
        Task task = taskRepo.findById(commentsDTO.getTaskid()).get();
        Projects projects = projectRepo.findById(task.getProject().getId()).get();
        Comments build = Comments.builder().comment(commentsDTO.getComment())
                .user(commentsDTO.getUser())
                .task(task).build();
        commentsRepo.save(build);
        return "saved";
    }
    @PutMapping("/update/comment/{id}")
    public Comments updateComment(@RequestBody CommentsDTO commentsDTO, @PathVariable Long id) {
        Comments comments = commentsRepo.findById(id).orElseThrow();
        comments.setComment(commentsDTO.getComment());
        comments.setUser(commentsDTO.getUser());
        commentsRepo.save(comments);
        return comments;
    }

    @DeleteMapping("/delete/comment/{id}")
    public String deleteComment(@PathVariable Long id) {
        commentsRepo.deleteById(id);
        return "comment has been deleted";
    }
    @GetMapping("/get/comment/{id}")
    public Comments getComment(@PathVariable Long id) {
        return commentsRepo.findById(id).orElseThrow();
    }
    @GetMapping("/get/all/comment")
    public List<Comments> getAllComment() {
        return commentsRepo.findAll();
    }
    @GetMapping("/get/allbytask/{id}")
    public List<Comments> getAllByTask(@PathVariable Long id) {
        return commentsRepo.findAllByTask(taskRepo.findById(id).get());
    }
    @PostMapping("/generate")
    public Map<String, String> generate(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String result = aiService.generateText(prompt);

        Map<String, String> response = new HashMap<>();
        response.put("prompt", prompt);
        response.put("response", result);
        return response;
    }




}
