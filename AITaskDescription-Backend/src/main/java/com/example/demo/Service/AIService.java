package com.example.demo.Service;


import com.example.demo.Repository.CommentsRepo;
import com.example.demo.Repository.ProjectRepo;
import com.example.demo.Repository.TaskRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {
    private final ProjectRepo projectRepo;
    private final TaskRepo taskRepo;
    private final CommentsRepo commentsRepo;

    public AIService(ProjectRepo projectRepo, TaskRepo taskRepo, CommentsRepo commentsRepo) {
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
        this.commentsRepo = commentsRepo;
    }

    private final RestTemplate restTemplate = new RestTemplate();
    private final String HF_API_URL = "https://openrouter.ai/api/v1/completions";
    private final String HF_API_KEY = ""; // replace
    // with
    // real
    // key
    private final ObjectMapper mapper = new ObjectMapper();

    public String generateText(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + HF_API_KEY);

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "arcee-ai/trinity-large-preview:free");
        payload.put("prompt", """
                You are an assistant that converts a task into a short employee-friendly description and assigns a priority.
                
                Instructions:
                - Read the TASK provided below.
                - Rewrite it into a clear and long description for an employee.
                - Assign a priority based on urgency and importance.
                - Priority must be ONLY one of these values: "low", "medium", or "high".
                - Do NOT explain the priority.
                - Return ONLY valid JSON.
                
                TASK:
                \"\"\"%s\"\"\"
                
                Output format:
                {
                  "description": "Brief explanation of the task for the employee",
                  "priority": "low | medium | high"
                }
                """.formatted(prompt));
        payload.put("max_tokens", 200);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(HF_API_URL, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");

                if (choices != null && !choices.isEmpty()) {
                    Object textObject = choices.get(0).get("text");

                    Map<String, Object> textMap;

                    if (textObject instanceof Map) {
                        // Already a map
                        textMap = (Map<String, Object>) textObject;
                    } else if (textObject instanceof String) {
                        // JSON string → parse into map
                        textMap = mapper.readValue((String) textObject, Map.class);
                    } else {
                        return "Unexpected text format";
                    }

                    String description = (String) textMap.get("description");
                    String priority = (String) textMap.get("priority");

                    System.out.println("Description: " + description);
                    System.out.println("Priority: " + priority);

                    return description + ":" + priority; // or return both as needed
                } else {
                    return "No text returned in choices";
                }
            }

            return "Empty or invalid response from OpenRouter";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to generate text due to exception";
        }

    }

    public String generateTextByTitle(String prompt, String name, String description) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + HF_API_KEY);

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "arcee-ai/trinity-large-preview:free");
        payload.put("prompt", prompt + " -This is task. "+ name + " -This is project name." 
        + description +" -This is project description " + """
                You are an assistant that converts a task into a short employee-friendly description and assigns a priority.
                
                Instructions:
                - Read the TASK provided below.
                - Rewrite it into a clear and long description for an employee.
                - Assign a priority based on urgency and importance.
                - Priority must be ONLY one of these values: "low", "medium", or "high".
                - Do NOT explain the priority.
                - Return ONLY valid JSON.
                
                TASK:
                \"\"\"%s\"\"\"
                
                Output format:
                {
                  "description": "Brief explanation of the task for the employee",
                  "priority": "low | medium | high"
                }
                """.formatted(prompt));
        payload.put("max_tokens", 200);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(HF_API_URL, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");

                if (choices != null && !choices.isEmpty()) {
                    Object textObject = choices.get(0).get("text");

                    Map<String, Object> textMap;

                    if (textObject instanceof Map) {
                        // Already a map
                        textMap = (Map<String, Object>) textObject;
                    } else if (textObject instanceof String) {
                        // JSON string → parse into map
                        textMap = mapper.readValue((String) textObject, Map.class);
                    } else {
                        return "Unexpected text format";
                    }

                    String description1 = (String) textMap.get("description");
                    String priority = (String) textMap.get("priority");

                    System.out.println("Description: " + description1);
                    System.out.println("Priority: " + priority);

                    return description1 + ":" + priority; // or return both as needed
                } else {
                    return "No text returned in choices";
                }
            }

            return "Empty or invalid response from OpenRouter";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to generate text due to exception";
        }
    }
}
