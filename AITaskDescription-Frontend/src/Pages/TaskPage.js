import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TasksPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    status: "TODO",
    assignee: "",
    projectid: id
  });

  useEffect(() => {
    loadTasks();
  }, [id]);

  const loadTasks = () => {
    setLoading(true);

    fetch(`http://localhost:8090/get/taskbyproject/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const createTask = () => {
    setCreating(true);

    fetch("http://localhost:8090/add/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    })
      .then(() => {
        setShowModal(false);
        setNewTask({
          title: "",
          status: "TODO",
          assignee: "",
          projectid: id
        });
        loadTasks();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to create task");
      })
      .finally(() => setCreating(false));
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "TODO":
        return "#ff9d00";
      case "IN_PROGRESS":
        return "#0099ff";
      case "DONE":
        return "#00c853";
      default:
        return "#7f8c8d";
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
        <h2>Loading Tasks...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Tasks for Project {id}</h1>
        <button style={styles.createBtn} onClick={() => setShowModal(true)}>
          + Create Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p style={styles.noTasks}>No tasks found</p>
      ) : (
        <div style={styles.grid}>
          {tasks.map((task) => (
            <div key={task.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.taskTitle}>{task.title}</h2>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(task.status)
                  }}
                >
                  {task.status}
                </span>
              </div>

              <p style={styles.description}>{task.description}</p>

              <div style={styles.footer}>
                <button
                  style={styles.viewBtn}
                  onClick={() => navigate(`/get/commentbytask/${task.id}`)}
                >
                  View Comments
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Create Task</h2>

            <input
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              style={styles.input}
              disabled={creating}
            />

            <input
              placeholder="Assignee"
              value={newTask.assignee}
              onChange={(e) =>
                setNewTask({ ...newTask, assignee: e.target.value })
              }
              style={styles.input}
              disabled={creating}
            />

            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
              style={styles.input}
              disabled={creating}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>

            <div style={styles.modalButtons}>
              <button
                style={styles.createBtn}
                onClick={createTask}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create"}
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "40px", backgroundColor: "#f5f7fb", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  noTasks: { textAlign: "center", color: "#7f8c8d", fontSize: "18px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px" },
  card: { backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 6px 12px rgba(0,0,0,0.1)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  taskTitle: { margin: 0, fontSize: "20px" },
  statusBadge: { padding: "5px 10px", borderRadius: "8px", color: "white", fontWeight: "bold", fontSize: "12px" },
  description: { color: "#7f8c8d", marginBottom: "15px" },
  footer: { textAlign: "right" },
  viewBtn: { padding: "8px 16px", border: "none", borderRadius: "6px", backgroundColor: "#000", color: "white", cursor: "pointer" },
  createBtn: { padding: "10px 15px", border: "none", background: "#4f46e5", color: "white", borderRadius: "8px", cursor: "pointer" },
  cancelBtn: { padding: "10px 15px", border: "none", background: "#ef4444", color: "white", borderRadius: "8px", cursor: "pointer" },
  center: { height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" },
  spinner: { width: "40px", height: "40px", border: "4px solid #ddd", borderTop: "4px solid #4f46e5", borderRadius: "50%", animation: "spin 1s linear infinite" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "white", padding: "30px", borderRadius: "10px", width: "400px", display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "6px" },
  modalButtons: { display: "flex", gap: "10px" }
};

export default TasksPage;