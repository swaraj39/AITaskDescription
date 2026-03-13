import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CommentsPage() {
  const navigate = useNavigate();
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
      setShowModal(false);
      setNewComment({ user: "", comment: "", taskid: taskId });
      loadComments();
    } catch (err) {
      console.error(err);
      alert("Failed to create comment");
    } finally {
      setCreating(false);
    }
  };

  // Get initials from username
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate consistent color based on username
  const getUserColor = (user) => {
    const colors = [
      '#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'
    ];
    let hash = 0;
    for (let i = 0; i < user.length; i++) {
      hash = user.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
        <h2 style={styles.loadingText}>Loading comments...</h2>
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

      {/* Header with Back Button */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button
            style={styles.backBtn}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <span style={styles.backIcon}>←</span>
            Back
          </button>
        </div>
        <div style={styles.headerContent}>
  
          <button
            style={styles.createBtn}
            onClick={() => setShowModal(true)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={styles.btnIcon}>+</span>
            Add Comment
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {comments.length === 0 ? (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyTitle}>No comments yet</h3>
          <button
            style={styles.emptyBtn}
            onClick={() => setShowModal(true)}
          >
            Start 
          </button>
        </div>
      ) : (
        <div style={styles.commentsContainer}>
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              style={{
                ...styles.commentCard,
                animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
              }}
            >
              <div style={styles.commentAvatar}>
                <div style={{
                  ...styles.avatarCircle,
                  backgroundColor: getUserColor(comment.user)
                }}>
                  {getInitials(comment.user)}
                </div>
              </div>
              <div style={styles.commentContent}>
                <div style={styles.commentHeader}>
                  <div style={styles.userInfo}>
                    <span style={styles.userName}>{comment.user}</span>
                    <span style={styles.userBadge}>commenter</span>
                  </div>
                  <span style={styles.commentDate}>
                    {new Date(comment.creationDate).toLocaleString()}
                  </span>
                </div>
                <p style={styles.commentText}>{comment.comment}</p>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE COMMENT MODAL */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => !creating && setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                <span style={styles.modalIcon}>💭</span>
                Add Your Comment
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
                <label style={styles.inputLabel}>
                  <span style={styles.labelIcon}>👤</span>
                  Your Name
                </label>
                <input
                  placeholder="e.g., John Doe"
                  value={newComment.user}
                  onChange={(e) => setNewComment({ ...newComment, user: e.target.value })}
                  style={styles.input}
                  disabled={creating}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>
                  <span style={styles.labelIcon}>💬</span>
                  Your Comment
                </label>
                <textarea
                  placeholder="Write your thoughts here..."
                  value={newComment.comment}
                  onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                  style={styles.textarea}
                  rows={4}
                  disabled={creating}
                />
                <div style={styles.textareaHint}>
                  {newComment.comment.length} characters
                </div>
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
                  ...(creating && styles.disabledBtn),
                  ...(!newComment.user.trim() || !newComment.comment.trim() ? styles.disabledBtn : {})
                }}
                onClick={createComment}
                disabled={creating || !newComment.user.trim() || !newComment.comment.trim()}
              >
                {creating ? (
                  <>
                    <span style={styles.spinnerSmall}></span>
                    Adding...
                  </>
                ) : (
                  'Post Comment'
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
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

// Enhanced Styles
const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    position: "relative",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  headerDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "200px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    zIndex: 0,
    overflow: "hidden"
  },
  headerPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
    opacity: 0.3
  },
  header: {
    position: "relative",
    zIndex: 1,
    marginBottom: "40px"
  },
  headerTop: {
    marginBottom: "20px"
  },
  backBtn: {
    padding: "8px 16px",
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "0.9rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)"
  },
  backIcon: {
    fontSize: "1.2rem",
    lineHeight: 1
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  headerLeft: {
    flex: 1
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px"
  },
  titleIcon: {
    fontSize: "2rem"
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    margin: 0,
    color: "white"
  },
  taskBadge: {
    display: "inline-block",
    padding: "4px 12px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "20px",
    color: "white",
    fontSize: "0.85rem",
    fontWeight: "500",
    marginBottom: "8px",
    backdropFilter: "blur(10px)"
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
    color: "#3b82f6",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
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
    background: "#3b82f6",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500"
  },
  commentsContainer: {
    position: "relative",
    zIndex: 1,
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  commentCard: {
    display: "flex",
    gap: "16px",
    padding: "24px",
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)"
  },
  commentAvatar: {
    flexShrink: 0
  },
  avatarCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "1rem",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
  },
  commentContent: {
    flex: 1
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  userName: {
    fontWeight: "600",
    color: "#1e293b",
    fontSize: "1rem"
  },
  userBadge: {
    padding: "2px 8px",
    background: "#e2e8f0",
    borderRadius: "12px",
    fontSize: "0.7rem",
    color: "#475569",
    fontWeight: "500"
  },
  commentDate: {
    fontSize: "0.8rem",
    color: "#94a3b8"
  },
  commentText: {
    margin: "0 0 12px 0",
    color: "#334155",
    fontSize: "0.95rem",
    lineHeight: "1.6"
  },
  commentActions: {
    display: "flex",
    gap: "12px"
  },
  actionBtn: {
    padding: "4px 12px",
    border: "none",
    background: "#f1f5f9",
    borderRadius: "20px",
    color: "#475569",
    fontSize: "0.85rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease",
    opacity: 0.7
  },
  actionIcon: {
    fontSize: "1rem"
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
    backdropFilter: "blur(4px)",
    animation: "fadeIn 0.2s ease"
  },
  modal: {
    background: "white",
    borderRadius: "24px",
    width: "520px",
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
    gap: "8px"
  },
  inputLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  labelIcon: {
    fontSize: "1.1rem"
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    outline: "none",
    ":focus": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.1)"
    }
  },
  textarea: {
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "100px",
    outline: "none",
    transition: "all 0.2s ease",
    ":focus": {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.1)"
    }
  },
  textareaHint: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    textAlign: "right"
  },
  cancelBtn: {
    padding: "10px 20px",
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#475569",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.95rem",
    transition: "all 0.2s ease"
  },
  disabledBtn: {
    opacity: 0.5,
    cursor: "not-allowed",
    pointerEvents: "none"
  }
};

export default CommentsPage;