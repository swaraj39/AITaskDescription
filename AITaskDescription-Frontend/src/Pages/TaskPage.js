import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TasksPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    status: "TODO",
    assignee: "",
    projectid: id,
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
      });
  };

  const createTask = () => {
    setCreating(true);

    fetch("http://localhost:8090/add/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then(() => {
        setShowModal(false);
        setNewTask({
          title: "",
          status: "TODO",
          assignee: "",
          projectid: id,
        });
        loadTasks();
      })
      .finally(() => setCreating(false));
  };

  const updateStatus = (task, status) => {
    fetch(`http://localhost:8090/update/task/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        status,
        assignee: task.assignee,
        projectid: id,
      }),
    }).then(loadTasks);
  };

  const statusColor = (status) => {
    if (status === "TODO") return "#f59e0b";
    if (status === "IN_PROGRESS") return "#3b82f6";
    if (status === "DONE") return "#10b981";
    return "#64748b";
  };

  const priorityColor = (priority) => {
    if (priority === "high") return "#ef4444";
    if (priority === "medium") return "#f59e0b";
    if (priority === "low") return "#10b981";
    return "#64748b";
  };

  /* ---------- SEARCH FILTER ---------- */

  const filteredTasks = tasks.filter((task) => {
    const text = search.toLowerCase();

    return (
      task.title?.toLowerCase().includes(text) ||
      task.description?.toLowerCase().includes(text) ||
      task.assignee?.toLowerCase().includes(text) ||
      task.status?.toLowerCase().includes(text) ||
      task.priority?.toLowerCase().includes(text)
    );
  });

  if (loading) return <div style={styles.center}>Loading tasks...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Project {id} Tasks</h2>

        <button style={styles.primaryBtn} onClick={() => setShowModal(true)}>
          + New Task
        </button>
      </div>

      {/* SEARCH BAR */}

      <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {filteredTasks.length === 0 ? (
        <p style={styles.empty}>No tasks found</p>
      ) : (
        <div style={styles.grid}>
          {filteredTasks.map((task) => (
            <div key={task.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>{task.title}</h3>

                <div style={styles.badges}>
                  <span
                    style={{
                      ...styles.badge,
                      background: statusColor(task.status),
                    }}
                  >
                    {task.status}
                  </span>

                  {task.priority && (
                    <span
                      style={{
                        ...styles.badge,
                        background: priorityColor(task.priority),
                      }}
                    >
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>

              {task.description && (
                <p style={styles.desc}>{task.description}</p>
              )}

              <div style={styles.meta}>
                <span>{task.assignee}</span>

                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task, e.target.value)}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <button
                style={styles.secondaryBtn}
                onClick={() => navigate(`/get/commentbytask/${task.id}`)}
              >
                View Comments
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Create Task</h3>

            <input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              style={styles.input}
            />

            <input
              placeholder="Assignee"
              value={newTask.assignee}
              onChange={(e) =>
                setNewTask({ ...newTask, assignee: e.target.value })
              }
              style={styles.input}
            />

            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
              style={styles.input}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>

            <div style={styles.modalActions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button style={styles.primaryBtn} onClick={createTask}>
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 40, fontFamily: "Arial" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  search: {
    width: "100%",
    padding: 10,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    marginBottom: 25,
  },
 backBtn: {
    background: "#f1f5f9",
    border: "none",
    padding: "8px 9px",
    borderRadius: 6,
    cursor: "pointer",
    height: "fit-content"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: 20,
  },

  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 20,
    background: "white",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
  },

  badges: {
    display: "flex",
    gap: 6
  },
badge: {
  color: "white",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
  display: "inline-block",
  height: "fit-content"
},

  desc: {
    margin: "10px 0",
    color: "#475569",
  },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },

  primaryBtn: {
    background: "black",
    color: "white",
    border: "none",
    padding: 8,
    borderRadius: 6,
    cursor: "pointer",
    height: "fit-content"
  },

  secondaryBtn: {
    marginTop: 10,
    background: "#f1f5f9",
    border: "none",
    padding: 8,
    borderRadius: 6,
    cursor: "pointer",
  },

  empty: { color: "#64748b" },

  center: {
    display: "flex",
    justifyContent: "center",
    padding: 50,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "white",
    padding: 30,
    borderRadius: 10,
    width: 350,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },

  input: {
    padding: 8,
    border: "1px solid #d1d5db",
    borderRadius: 6,
  },
};

export default TasksPage;