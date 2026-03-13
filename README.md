# 🤖 AI Task Description Generator

AI-Assisted Mini Project Management Tool

This application enables teams to efficiently **create and manage projects, tasks, and comments with AI-powered assistance**.
It intelligently generates **clear task descriptions and suggests priority levels** from brief task inputs, improving clarity and workflow efficiency.

The system provides:

* REST APIs for **full CRUD operations**
* **Task filtering and status grouping**
* **AI-generated task descriptions and priorities**
* A **simple frontend UI** demonstrating core functionality
* Clean **layered backend architecture**
* Proper **database relationships**

---

# 🛠 Tech Stack

| Technology  | Type                 | Description                                                     |
| ----------- | -------------------- | --------------------------------------------------------------- |
| Java        | Programming Language | Core backend language used to build application logic           |
| Spring Boot | Framework            | Simplifies building and configuring Java-based web applications |
| React JS    | Frontend Library     | Builds the user interface with reusable components              |
| SQL         | Database Language    | Used for relational database management                         |
| AOP         | Programming Paradigm | Handles cross-cutting concerns like logging                     |
| JPA         | Persistence API      | ORM framework for database interaction                          |
| Maven       | Build Tool           | Manages project dependencies and build lifecycle                |
| Lombok      | Java Library         | Reduces boilerplate code                                        |
| Swagger     | API Documentation    | Interactive REST API documentation                              |

---

# 🗄 Database Schema

## Projects Table

| Field       | Type         | Description         |
| ----------- | ------------ | ------------------- |
| id          | bigint       | Primary key         |
| name        | varchar(255) | Project name        |
| description | varchar(255) | Project description |
| start_date  | datetime     | Project start date  |

---

## Task Table

| Field       | Type         | Description               |
| ----------- | ------------ | ------------------------- |
| id          | bigint       | Primary key               |
| project_id  | bigint       | Foreign key → projects.id |
| title       | varchar(255) | Task title                |
| description | varchar(255) | AI generated description  |
| assignee    | varchar(255) | Assigned user             |
| created_at  | datetime     | Task creation timestamp   |
| status      | varchar(255) | TODO / IN_PROGRESS / DONE |
| priority    | varchar(255) | low / medium / high       |

---

## Comments Table

| Field         | Type         | Description                |
| ------------- | ------------ | -------------------------- |
| id            | bigint       | Primary key                |
| task_id       | bigint       | Foreign key → task.id      |
| comment       | varchar(255) | Comment text               |
| user          | varchar(255) | Comment author             |
| creation_date | datetime     | Comment creation timestamp |

---

# 🔗 REST API Endpoints

## 📁 Project APIs

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| POST   | `/add/project`         | Create project    |
| PUT    | `/update/project/{id}` | Update project    |
| DELETE | `/delete/project/{id}` | Delete project    |
| GET    | `/get/project/{id}`    | Get project by ID |
| GET    | `/get/all/project`     | Get all projects  |

---

## 📋 Task APIs

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/add/task`               | Create task with AI description |
| PUT    | `/update/task/{id}`       | Update task                     |
| DELETE | `/delete/task/{id}`       | Delete task                     |
| GET    | `/get/task/{id}`          | Get task by ID                  |
| GET    | `/get/taskbyproject/{id}` | Get tasks by project            |
| GET    | `/get/all/task`           | Get all tasks                   |

---

## 💬 Comment APIs

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| POST   | `/add/comment`         | Add comment          |
| PUT    | `/update/comment/{id}` | Update comment       |
| DELETE | `/delete/comment/{id}` | Delete comment       |
| GET    | `/get/comment/{id}`    | Get comment          |
| GET    | `/get/all/comment`     | Get all comments     |
| GET    | `/get/allbytask/{id}`  | Get comments by task |

---

# 🏗 Backend Project Structure

```text
src
└── main
    └── java
        └── com
            └── example
                └── demo
                    ├── Annotations
                    │   └── LogTime.java
                    │
                    ├── Aspects
                    │   └── LoggingAspects.java
                    │
                    ├── Controllers
                    │   └── FrontController.java
                    │
                    ├── DTOs
                    │   ├── CommentsDTO.java
                    │   ├── ProjectDTO.java
                    │   └── TaskDTO.java
                    │
                    ├── Models
                    │   ├── Comments.java
                    │   ├── Projects.java
                    │   └── Task.java
                    │
                    ├── Repository
                    │   ├── CommentsRepo.java
                    │   ├── ProjectRepo.java
                    │   └── TaskRepo.java
                    │
                    ├── Service
                    │   └── AIService.java
                    │
                    └── TaskGenerationAiApplication.java
```

---

# ⚙ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/swaraj39/AITaskDescription.git
```

Navigate to project folders:

```bash
cd AITaskDescription-Backend
```

or

```bash
cd AITaskDescription-Frontend
```

---

# 🗄 Configure Database

Edit:

```
src/main/resources/application.properties
```

Add your database credentials:

```
spring.datasource.url=jdbc:mysql://localhost:3306/your_db
spring.datasource.username=root
spring.datasource.password=password
```

---

# ▶ Run Backend

Using Maven:

```bash
mvn spring-boot:run
```

Or run the main class:

```
TaskGenerationAiApplication.java
```

---

# ▶ Run Frontend

Navigate to frontend folder and run:

```bash
npm install
npm start
```

---

# 📄 API Documentation (Swagger)

After running the backend, open:

```
http://localhost:8090/swagger-ui/index.html#
```

This provides **interactive API documentation** where you can test endpoints directly.

---

# ✨ Features

✔ AI-generated task descriptions
✔ Automatic priority suggestion
✔ CRUD operations for projects, tasks, comments
✔ REST API architecture
✔ Clean layered backend structure
✔ Swagger API documentation
✔ Logging using AOP

---
