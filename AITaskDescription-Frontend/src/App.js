import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import ProjectsPage from "./Pages/ProjectPage";
import TasksPage from "./Pages/TaskPage";
import CommentPage from "./Pages/CommentPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/get/taskbyproject/:id" element={<TasksPage/>} />
        <Route path="/get/commentbytask/:taskId" element={<CommentPage/>} />
      </Routes>
    </BrowserRouter>
  );
}export default App;
