import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProjectsPage() {

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newProject, setNewProject] = useState({
    projectName: "",
    projectDescription: ""
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await axios.get("https://aitaskdescription.onrender.com/get/all/project");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    try {

      await axios.post("https://aitaskdescription.onrender.com/add/project", newProject);

      setShowModal(false);

      setNewProject({
        projectName: "",
        projectDescription: ""
      });

      loadProjects();

    } catch (err) {

      console.error(err);
      alert("Failed to create project");

    }
  };

  if (loading) {
    return <div style={styles.center}>Loading projects...</div>;
  }

  return (

    <div style={styles.container}>

      <div style={styles.header}>

        <h2>Projects ({projects.length})</h2>

        <button
          style={styles.primaryBtn}
          onClick={() => setShowModal(true)}
        >
          + Create Project
        </button>

      </div>


      {projects.length === 0 ? (
        <p style={styles.empty}>No projects yet</p>
      ) : (

        <div style={styles.grid}>

          {projects.map((project) => (

            <div key={project.id} style={styles.card}>

              <h3>{project.name}</h3>

              <p style={styles.description}>
                {project.description || "No description"}
              </p>
              <br></br>
              <button
                style={styles.secondaryBtn}
                onClick={() => navigate(`/get/taskbyproject/${project.id}`)}
              >
                View Tasks
              </button>

            </div>

          ))}

        </div>

      )}


      {/* Modal */}

      {showModal && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <h3>Create Project</h3>

            <input
              placeholder="Project name"
              value={newProject.projectName}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  projectName: e.target.value
                })
              }
              style={styles.input}
            />

            <textarea
              placeholder="Project description"
              value={newProject.projectDescription}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  projectDescription: e.target.value
                })
              }
              style={styles.textarea}
            />

            <div style={styles.actions}>

              <button
                style={styles.secondaryBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                style={styles.primaryBtn}
                onClick={createProject}
                disabled={!newProject.projectName.trim()}
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


const styles = {

  container: {
    padding: 40,
    fontFamily: "Arial"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: 20
  },

  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 20,
    background: "white"
  },

  description: {
    color: "#64748b",
    margin: "10px 0"
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer"
  },

  secondaryBtn: {
    background: "#f1f5f9",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer"
  },

  empty: {
    color: "#64748b"
  },

  center: {
    padding: 40,
    textAlign: "center"
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "white",
    padding: 25,
    borderRadius: 8,
    width: 350,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  input: {
    padding: 8,
    border: "1px solid #d1d5db",
    borderRadius: 6
  },

  textarea: {
    padding: 8,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    minHeight: 80
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10
  }

};

export default ProjectsPage;