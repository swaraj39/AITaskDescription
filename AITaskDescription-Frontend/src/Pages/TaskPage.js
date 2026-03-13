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
      .catch((err) => {
        console.error(err);
        alert("Failed to create task");
      })
      .finally(() => setCreating(false));
  };
const updateStatus = (task, newStatus) => {
  fetch(`http://localhost:8090/update/task/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: task.title,
      status: newStatus,
      assignee: task.assignee,
      projectid: id
    }),
  })
    .then(() => loadTasks())
    .catch((err) => {
      console.error(err);
      alert("Failed to update status");
    });
};
  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "TODO":
        return "#f97316"; // Warm orange
      case "IN_PROGRESS":
        return "#3b82f6"; // Bright blue
      case "DONE":
        return "#10b981"; // Emerald green
      default:
        return "#94a3b8"; // Slate gray
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#ef4444"; // Red
      case "medium":
        return "#f59e0b"; // Amber
      case "low":
        return "#10b981"; // Emerald green
      default:
        return "#8b5cf6"; // Purple for default
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
        <h2 style={styles.loadingText}>Loading your tasks...</h2>
        <p style={styles.loadingSubtext}>Please wait a moment</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Decorative Header */}
      <div style={styles.headerDecoration}>
        <div style={styles.headerPattern}></div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>📋</span>
            Tasks for Project {id}
          </h1>
          <p style={styles.subtitle}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in this project
          </p>
        </div>
        <button 
          style={styles.createBtn} 
          onClick={() => setShowModal(true)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={styles.btnIcon}>+</span>
          Create New Task
        </button>
      </div>

      {/* Task Grid */}
      {tasks.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>No tasks yet</h3>
          <p style={styles.emptyText}>Get started by creating your first task for this project</p>
          <button 
            style={styles.emptyBtn}
            onClick={() => setShowModal(true)}
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {tasks.map((task, index) => (
            <div
              key={task.id}
              style={{
                ...styles.card,
                animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)";
              }}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <div style={styles.badges}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(task.status),
                    }}
                  >
                    <span style={styles.badgeDot}>●</span>
                    {task.status.replace('_', ' ')}
                  </span>
                  {task.priority && (
                    <span
                      style={{
                        ...styles.priorityBadge,
                        backgroundColor: getPriorityColor(task.priority),
                      }}
                    >
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>
              
              {task.description && (
                <p style={styles.description}>{task.description}</p>
              )}
              
              <div style={styles.taskMeta}>
                {task.assignee && (
                  <div style={styles.assignee}>
                    <span style={styles.assigneeIcon}>👤</span>
                    {task.assignee}
                  </div>
                )}
                <div style={styles.taskId}>ID: {task.id}</div>
              </div>

              <div style={styles.footer}>
                <select
    value={task.status}
    onChange={(e) => updateStatus(task, e.target.value)}
    style={styles.statusDropdown}
  >
    <option value="TODO">📝 TODO</option>
    <option value="IN_PROGRESS">🔄 IN PROGRESS</option>
    <option value="DONE">✅ DONE</option>
  </select>

                <button
                  style={styles.viewBtn}
                  onClick={() => navigate(`/get/commentbytask/${task.id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
                >
                  <span style={styles.btnIcon}>💬</span>
                  View Comments
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => !creating && setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                <span style={styles.modalIcon}>✨</span>
                Create New Task
              </h2>
              <button 
                style={styles.modalClose}
                onClick={() => setShowModal(false)}
                disabled={creating}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Task Title</label>
                <input
                  placeholder="e.g., Implement login feature"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  style={styles.input}
                  disabled={creating}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Assignee</label>
                <input
                  placeholder="e.g., John Doe"
                  value={newTask.assignee}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignee: e.target.value })
                  }
                  style={styles.input}
                  disabled={creating}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                  style={styles.input}
                  disabled={creating}
                >
                  <option value="TODO">📝 To Do</option>
                  <option value="IN_PROGRESS">🔄 In Progress</option>
                  <option value="DONE">✅ Done</option>
                </select>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
                disabled={creating}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.createBtn,
                  ...(creating && styles.disabledBtn)
                }}
                onClick={createTask}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <span style={styles.spinnerSmall}></span>
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animation keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

// Enhanced Styles with lighter, more attractive colors
const styles = {
  container: { 
    padding: "40px", 
    backgroundColor: "#f8fafc", 
    minHeight: "100vh",
    position: "relative",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  statusDropdown: {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "0.85rem",
  cursor: "pointer",
  marginRight: "10px"
},
  headerDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "200px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    zIndex: 0,
    overflow: "hidden"
  },
  headerPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
    opacity: 0.3
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-end", 
    marginBottom: "40px",
    position: "relative",
    zIndex: 1
  },
  headerLeft: {
    flex: 1
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    margin: "0 0 8px 0",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  titleIcon: {
    fontSize: "2rem"
  },
  subtitle: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.8)",
    margin: 0
  },
  createBtn: {
    padding: "12px 24px",
    border: "none",
    background: "white",
    color: "#4f46e5",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  btnIcon: {
    fontSize: "1.2rem",
    lineHeight: 1
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 40px",
    background: "white",
    borderRadius: "24px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "40px auto",
    position: "relative",
    zIndex: 1
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "16px"
  },
  emptyTitle: {
    fontSize: "1.5rem",
    color: "#1e293b",
    margin: "0 0 8px 0"
  },
  emptyText: {
    color: "#64748b",
    margin: "0 0 24px 0"
  },
  emptyBtn: {
    padding: "10px 20px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500"
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
    gap: "24px",
    position: "relative",
    zIndex: 1
  },
  card: { 
    backgroundColor: "white", 
    borderRadius: "20px", 
    padding: "24px", 
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)", 
    transition: "all 0.2s ease",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)"
  },
  cardHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-start", 
    marginBottom: "16px",
    gap: "12px"
  },
  taskTitle: { 
    margin: 0, 
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
    flex: 1
  },
  badges: { 
    display: "flex", 
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-end"
  },
  statusBadge: { 
    padding: "6px 12px", 
    borderRadius: "30px", 
    color: "white", 
    fontWeight: "500", 
    fontSize: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    letterSpacing: "0.3px"
  },
  priorityBadge: { 
    padding: "4px 10px", 
    borderRadius: "30px", 
    color: "white", 
    fontWeight: "500", 
    fontSize: "0.7rem",
    textTransform: "capitalize"
  },
  badgeDot: {
    fontSize: "0.8rem",
    opacity: 0.8
  },
  description: { 
    color: "#475569", 
    marginBottom: "16px",
    fontSize: "0.95rem",
    lineHeight: "1.5"
  },
  taskMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    fontSize: "0.85rem",
    color: "#64748b"
  },
  assignee: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  assigneeIcon: {
    fontSize: "1rem"
  },
  taskId: {
    fontFamily: "monospace",
    fontSize: "0.8rem",
    color: "#94a3b8"
  },
  footer: { 
    textAlign: "right",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "16px",
    marginTop: "8px"
  },
  viewBtn: { 
    padding: "8px 16px", 
    border: "none", 
    borderRadius: "10px", 
    backgroundColor: "#6366f1", 
    color: "white", 
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px"
  },
  center: { 
    height: "100vh", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: "16px",
    background: "linear-gradient(135deg, #000000 0%, #000000 100%)"
  },
  loadingText: {
    color: "white",
    margin: 0
  },
  loadingSubtext: {
    color: "rgba(255,255,255,0.8)",
    margin: 0,
    fontSize: "0.9rem"
  },
  spinner: { 
    width: "48px", 
    height: "48px", 
    border: "3px solid rgba(255,255,255,0.3)", 
    borderTop: "3px solid white", 
    borderRadius: "50%", 
    animation: "spin 1s linear infinite" 
  },
  spinnerSmall: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block",
    marginRight: "8px"
  },
  modalOverlay: { 
    position: "fixed", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    background: "rgba(0,0,0,0.5)", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)"
  },
  modal: { 
    background: "white", 
    borderRadius: "24px", 
    width: "480px", 
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    overflow: "hidden"
  },
  modalHeader: {
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  modalIcon: {
    fontSize: "1.5rem"
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: "2rem",
    lineHeight: 1,
    cursor: "pointer",
    color: "#64748b",
    padding: "0 8px",
    transition: "color 0.2s ease"
  },
  modalBody: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  modalFooter: {
    padding: "24px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    background: "#f8fafc"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  inputLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#334155"
  },
  input: { 
    padding: "12px 16px", 
    border: "1px solid #e2e8f0", 
    borderRadius: "12px",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    outline: "none",
    ":focus": {
      borderColor: "#6366f1",
      boxShadow: "0 0 0 3px rgba(99,102,241,0.1)"
    }
  },
  cancelBtn: { 
    padding: "10px 20px", 
    border: "1px solid #e2e8f0", 
    background: "white", 
    color: "#475569", 
    borderRadius: "10px", 
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.95rem"
  },
  disabledBtn: {
    opacity: 0.7,
    cursor: "not-allowed"
  }
};

export default TasksPage;