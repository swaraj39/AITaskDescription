import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, FolderOpen, AlertCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProjectsPage() {

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

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

      setLoading(true);

      const res = await axios.get("http://localhost:8090/get/all/project");

      setProjects(res.data);
      setError("");

    } catch (err) {

      console.error(err);
      setError("Failed to load projects");

    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {

    try {

      await axios.post("http://localhost:8090/add/project", newProject);
//hello
      setShowModal(false);
      console.log(newProject);
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

  const getRandomGradient = (index) => {

    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    ];

    return gradients[index % gradients.length];
  };

  const formatDate = (dateString) => {

    if (!dateString) return "No date";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {

    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
        <h2>Loading Projects...</h2>
      </div>
    );
  }

  if (error) {

    return (
      <div style={styles.center}>
        <AlertCircle size={40} color="red" />
        <h2>{error}</h2>

        <button onClick={loadProjects} style={styles.button}>
          Retry
        </button>
      </div>
    );
  }

  return (

    <div style={styles.container}>

      {/* Header */}

      <div style={styles.header}>

        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <FolderOpen size={28} />
          <h1>Projects ({projects.length})</h1>
        </div>

        <button
          style={styles.createButton}
          onClick={() => setShowModal(true)}
        >
          <Plus size={16}/> Create Project
        </button>

      </div>


      {/* Grid */}

      <div style={styles.grid}>

        {projects.map((project, index) => (

          <div
            key={project.id}
            style={{
              ...styles.card,
              ...(hoveredCard === project.id && styles.cardHover)
            }}
            onMouseEnter={() => setHoveredCard(project.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >

            <div
              style={{
                ...styles.cardHeader,
                background: getRandomGradient(index)
              }}
            >
              <h3>{project.name}</h3>
            </div>

            <div style={styles.cardBody}>

              <p>{project.description || "No description available"}</p>

              <div style={styles.meta}>
                <Calendar size={14} />
                <span>{formatDate(project.startDate)}</span>
              </div>

              <button
                style={styles.button}
                onClick={() => navigate(`/get/taskbyproject/${project.id}`)}
              >
                View Tasks
              </button>

            </div>

          </div>

        ))}

      </div>


      {/* CREATE PROJECT MODAL */}

      {showModal && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h2>Create New Project</h2>

            <input
              placeholder="Project Name"
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
              placeholder="Project Description"
              value={newProject.projectDescription}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  projectDescription: e.target.value
                })
              }
              style={styles.textarea}
            />

            <div style={styles.modalButtons}>

              <button
                style={styles.button}
                onClick={createProject}
              >
                Create
              </button>

              <button
                style={styles.cancelButton}
                onClick={() => setShowModal(false)}
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

  container:{
    padding:"40px",
    minHeight:"100vh",
    background:"#f1f5f9"
  },

  header:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"30px"
  },

  createButton:{
    padding:"10px 15px",
    border:"none",
    background:"#10b981",
    color:"white",
    borderRadius:"8px",
    cursor:"pointer",
    display:"flex",
    gap:"6px",
    alignItems:"center"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
    gap:"20px"
  },

  card:{
    background:"white",
    borderRadius:"15px",
    overflow:"hidden",
    boxShadow:"0 10px 20px rgba(0,0,0,0.05)",
    transition:"0.3s"
  },

  cardHover:{
    transform:"translateY(-6px)"
  },

  cardHeader:{
    padding:"20px",
    color:"white",
    fontWeight:"600"
  },

  cardBody:{
    padding:"20px",
    display:"flex",
    flexDirection:"column",
    gap:"10px"
  },

  meta:{
    display:"flex",
    alignItems:"center",
    gap:"6px",
    color:"#64748b",
    fontSize:"14px"
  },

  button:{
    marginTop:"10px",
    padding:"10px",
    border:"none",
    background:"#4f46e5",
    color:"white",
    borderRadius:"8px",
    cursor:"pointer"
  },

  cancelButton:{
    padding:"10px",
    border:"none",
    background:"#ef4444",
    color:"white",
    borderRadius:"8px",
    cursor:"pointer"
  },

  center:{
    height:"100vh",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    gap:"15px"
  },

  spinner:{
    width:"40px",
    height:"40px",
    border:"4px solid #ddd",
    borderTop:"4px solid #4f46e5",
    borderRadius:"50%"
  },

  modalOverlay:{
    position:"fixed",
    top:0,
    left:0,
    right:0,
    bottom:0,
    background:"rgba(0,0,0,0.5)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },

  modal:{
    background:"white",
    padding:"30px",
    borderRadius:"10px",
    width:"400px",
    display:"flex",
    flexDirection:"column",
    gap:"15px"
  },

  input:{
    padding:"10px",
    border:"1px solid #ddd",
    borderRadius:"6px"
  },

  textarea:{
    padding:"10px",
    border:"1px solid #ddd",
    borderRadius:"6px",
    minHeight:"80px"
  },

  modalButtons:{
    display:"flex",
    gap:"10px"
  }

};

export default ProjectsPage;