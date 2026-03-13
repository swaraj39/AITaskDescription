package com.example.demo.Repository;


import com.example.demo.Models.Comments;
import com.example.demo.Models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentsRepo extends JpaRepository<Comments, Long> {
    List<Comments> findAllByTask(Task task);
}
