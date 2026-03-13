import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CommentsPage() {
  const { taskId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newComment, setNewComment] = useState({
    user: "",
    comment: "",
    taskid: taskId
  });

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8090/get/allbytask/${taskId}`);
      setComments(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const createComment = async () => {
    setCreating(true);
    try {
      await axios.post("http://localhost:8090/add/comment", newComment);
      console.log(newComment);
      setShowModal(false);
      setNewComment({ user: "", comment: "", taskid: taskId });
      loadComments();
    } catch (err) {
      console.error(newComment);
      alert("Failed to create comment");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
        <h2>Loading Comments...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Comments for Task {taskId}</h1>
        <button style={styles.createBtn} onClick={() => setShowModal(true)}>
          + Add Comment
        </button>
      </div>

      {comments.length === 0 ? (
        <p style={styles.noComments}>No comments yet</p>
      ) : (
        <div style={styles.grid}>
          {comments.map((comment) => (
            <div key={comment.id} style={styles.card}>
              <div style={styles.commentHeader}>
                <span style={styles.user}>{comment.user}</span>
                <span style={styles.date}>
                  {new Date(comment.creationDate).toLocaleString()}
                </span>
              </div>
              <p style={styles.commentText}>{comment.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* CREATE COMMENT MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Add Comment</h2>

            <input
              placeholder="Your Name"
              value={newComment.user}
              onChange={(e) => setNewComment({ ...newComment, user: e.target.value })}
              style={styles.input}
              disabled={creating}
            />

            <textarea
              placeholder="Comment"
              value={newComment.comment}
              onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
              style={{ ...styles.input, height: "80px" }}
              disabled={creating}
            />

            <div style={styles.modalButtons}>
              <button style={styles.createBtn} onClick={createComment} disabled={creating}>
                {creating ? "Adding..." : "Add"}
              </button>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)} disabled={creating}>
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
  container: { padding: "30px", backgroundColor: "#f5f7fb", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  noComments: { textAlign: "center", color: "#7f8c8d", fontSize: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "15px" },
  card: { backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 6px 12px rgba(0,0,0,0.1)" },
  commentHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  user: { fontWeight: "bold", color: "#34495e" },
  date: { fontSize: "12px", color: "#7f8c8d" },
  commentText: { color: "#2c3e50", fontSize: "14px" },
  center: { height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "15px" },
  spinner: { width: "40px", height: "40px", border: "4px solid #ddd", borderTop: "4px solid #4f46e5", borderRadius: "50%", animation: "spin 1s linear infinite" },
  createBtn: { padding: "10px 15px", border: "none", background: "#4f46e5", color: "white", borderRadius: "8px", cursor: "pointer" },
  cancelBtn: { padding: "10px 15px", border: "none", background: "#ef4444", color: "white", borderRadius: "8px", cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "white", padding: "30px", borderRadius: "10px", width: "400px", display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "6px" },
  modalButtons: { display: "flex", gap: "10px" }
};

export default CommentsPage;