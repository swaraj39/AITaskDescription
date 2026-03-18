import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CommentsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newComment, setNewComment] = useState({
    user: "",
    comment: "",
    taskid: taskId,
  });

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const loadComments = async () => {
    try {
      const res = await axios.get(
        `https://aitaskdescription.onrender.com/get/allbytask/${taskId}`
      );
      setComments(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const createComment = async () => {
    try {
      await axios.post("https://aitaskdescription.onrender.com/add/comment", newComment);
      setShowModal(false);
      setNewComment({ user: "", comment: "", taskid: taskId });
      loadComments();
    } catch (err) {
      console.error(err);
      alert("Failed to create comment");
    }
  };

  if (loading) return <div style={styles.center}>Loading comments...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>Task Comments</h2>

        <button style={styles.primaryBtn} onClick={() => setShowModal(true)}>
          + Add Comment
        </button>
      </div>

      {comments.length === 0 ? (
        <p style={styles.empty}>No comments yet</p>
      ) : (
        <div style={styles.list}>
          {comments.map((c) => (
            <div key={c.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <strong>{c.user}</strong>
                <span style={styles.date}>
                  {new Date(c.creationDate).toLocaleString()}
                </span>
              </div>

              <p style={styles.comment}>{c.comment}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Add Comment</h3>

            <input
              placeholder="Your name"
              value={newComment.user}
              onChange={(e) =>
                setNewComment({ ...newComment, user: e.target.value })
              }
              style={styles.input}
            />

            <textarea
              placeholder="Write comment..."
              value={newComment.comment}
              onChange={(e) =>
                setNewComment({ ...newComment, comment: e.target.value })
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

              <button style={styles.primaryBtn} onClick={createComment}>
                Post
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
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 15,
    background: "white",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  comment: {
    color: "#334155",
  },

  date: {
    fontSize: 12,
    color: "#64748b",
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },

  secondaryBtn: {
    background: "#f1f5f9",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },

  backBtn: {
    background: "#f1f5f9",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },

  empty: {
    color: "#64748b",
  },

  center: {
    padding: 40,
    textAlign: "center",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "white",
    padding: 25,
    borderRadius: 10,
    width: 350,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  input: {
    padding: 8,
    border: "1px solid #d1d5db",
    borderRadius: 6,
  },

  textarea: {
    padding: 8,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    minHeight: 80,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
};

export default CommentsPage;