# AITaskDescription

AI-Assisted Mini Project Management Tool

This application enables teams to efficiently create and manage projects, tasks, and comments with AI-powered assistance. It intelligently generates clear task descriptions and suggests priority levels from brief task inputs, improving clarity and workflow efficiency. The system features REST APIs supporting full CRUD operations, task filtering, and status grouping, along with a simple frontend to demonstrate core functionalities. Emphasis is placed on clean backend architecture, well-defined data relationships, and seamless AI integration.

#DataBase Schema
| Table Name   | Field Name    | Data Type    | Description                                                |
| ------------ | ------------- | ------------ | ---------------------------------------------------------- |
| **projects** | id            | bigint       | Primary key, unique project identifier                     |
|              | name          | varchar(255) | Project name                                               |
|              | description   | varchar(255) | Brief description of the project                           |
|              | start_date    | datetime(6)  | Project start date and time                                |
| **task**     | id            | bigint       | Primary key, unique task identifier                        |
|              | project_id    | bigint       | Foreign key referencing `projects.id`                      |
|              | title         | varchar(255) | Title of the task                                          |
|              | description   | varchar(255) | Detailed description of the task                           |
|              | assignee      | varchar(255) | Name or identifier of the person assigned to the task      |
|              | created_at    | datetime(6)  | Timestamp when the task was created                        |
|              | status        | varchar(255) | Current status of the task (e.g., TODO, IN_PROGRESS, DONE) |
|              | priority      | varchar(255) | Priority level of the task (e.g., low, medium, high)       |
| **comments** | id            | bigint       | Primary key, unique comment identifier                     |
|              | task_id       | bigint       | Foreign key referencing `task.id`                          |
|              | comment       | varchar(255) | Text content of the comment                                |
|              | user          | varchar(255) | Name or identifier of the user who posted the comment      |
|              | creation_date | datetime(6)  | Timestamp when the comment was created                     |
