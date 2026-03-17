import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "./config/api";

// ─────────────────────────────────────────────
// Small reusable stat card
// ─────────────────────────────────────────────
function StatCard({ value, label, accent }) {
  return (
    <div style={{
      background: "#1a1a1a",
      border: `1px solid ${accent || "#333"}`,
      borderRadius: 10,
      padding: "20px 16px",
      textAlign: "center",
      minWidth: 110,
      flex: "1 1 110px",
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent || "#fff", lineHeight: 1 }}>
        {value ?? 0}
      </div>
      <div style={{ fontSize: 12, color: "#888", marginTop: 6, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section header with optional action button
// ─────────────────────────────────────────────
function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#fff", letterSpacing: 1 }}>
        {title}
      </h3>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "1px solid #555", color: "#ccc",
          borderRadius: 6, padding: "4px 12px", fontSize: 12,
          cursor: "pointer", letterSpacing: 0.5,
        }}>
          {action}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Requirement card (mirrors design card style)
// ─────────────────────────────────────────────
function RequirementCard({ req, onDelete }) {
  return (
    <div style={{
      background: "#1e1e1e",
      borderRadius: 10,
      overflow: "hidden",
      border: "1px solid #2a2a2a",
      transition: "transform 0.2s",
      cursor: "pointer",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{
        height: 180,
        background: req.imageUrl ? `url(${req.imageUrl}) center/cover` : "#2a2a2a",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {!req.imageUrl && <span style={{ fontSize: 36 }}>📋</span>}
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "rgba(0,0,0,0.7)", color: "#fff",
          padding: "2px 10px", borderRadius: 20,
          fontSize: 11, fontWeight: 600, textTransform: "capitalize",
        }}>
          {req.category || "General"}
        </div>
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6, color: "#fff" }}>
          {req.title || "Untitled Requirement"}
        </div>
        {req.description && (
          <div style={{
            fontSize: 13, color: "#999", lineHeight: 1.4, marginBottom: 10,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {req.description}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #2a2a2a" }}>
          <span style={{ fontSize: 12, color: "#666" }}>
            {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ""}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onDelete?.(req._id); }}
            style={{
              background: "#3a1515", border: "none", color: "#ff6b6b",
              borderRadius: 6, padding: "4px 10px", fontSize: 12,
              cursor: "pointer", fontWeight: 600,
            }}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Collaboration row card
// ─────────────────────────────────────────────
function CollabCard({ collab, onAccept, onDecline }) {
  const isReceived = collab._type === "received";
  const isPending = collab.status === "pending";
  const isAccepted = collab.status === "accepted";

  const statusColor = {
    pending: "#f9ca24",
    accepted: "#6ab04c",
    declined: "#e55039",
    completed: "#4ecdc4",
  }[collab.status] || "#888";

  return (
    <div style={{
      background: "#1e1e1e", border: "1px solid #2a2a2a",
      borderRadius: 10, padding: "16px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: "#fff", marginBottom: 4 }}>
            {collab.designId?.title || "Design Collaboration"}
          </div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
            {isReceived
              ? `From: ${collab.designerId?.username || collab.designerId?.firstName || "Designer"}`
              : `To: ${collab.designerId?.username || collab.designerId?.firstName || "Designer"}`
            }
          </div>
          {collab.message && (
            <div style={{
              fontSize: 12, color: "#777", fontStyle: "italic",
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              "{collab.message}"
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          <span style={{
            background: `${statusColor}22`, color: statusColor,
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
          }}>
            {collab.status}
          </span>
          {isPending && isReceived && (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => onAccept?.(collab._id)} style={{
                background: "#1a3a1a", border: "1px solid #6ab04c",
                color: "#6ab04c", borderRadius: 6, padding: "4px 10px",
                fontSize: 11, cursor: "pointer", fontWeight: 600,
              }}>✓ Accept</button>
              <button onClick={() => onDecline?.(collab._id)} style={{
                background: "#3a1515", border: "1px solid #e55039",
                color: "#e55039", borderRadius: 6, padding: "4px 10px",
                fontSize: 11, cursor: "pointer", fontWeight: 600,
              }}>✕ Decline</button>
            </div>
          )}
          {isAccepted && (
            <button style={{
              background: "#1a2a3a", border: "1px solid #4ecdc4",
              color: "#4ecdc4", borderRadius: 6, padding: "4px 10px",
              fontSize: 11, cursor: "pointer", fontWeight: 600,
            }}>💬 Message</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shortlisted / Liked design mini-card
// ─────────────────────────────────────────────
function SavedDesignCard({ design }) {
  const primaryImage = design.images?.find(img => img.isPrimary) || design.images?.[0];
  return (
    <div style={{
      background: "#1e1e1e", border: "1px solid #2a2a2a",
      borderRadius: 10, overflow: "hidden",
    }}>
      <div style={{
        height: 140,
        background: primaryImage?.url ? `url(${primaryImage.url}) center/cover` : "#2a2a2a",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {!primaryImage?.url && <span style={{ fontSize: 28 }}>🎨</span>}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#fff", marginBottom: 4,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {design.title}
        </div>
        <div style={{ fontSize: 11, color: "#666" }}>
          by {design.user?.username || design.user?.firstName || "Designer"}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Following designer mini-card
// ─────────────────────────────────────────────
function FollowingCard({ designer }) {
  return (
    <div style={{
      background: "#1e1e1e", border: "1px solid #2a2a2a",
      borderRadius: 10, padding: "14px", display: "flex",
      alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: "50%",
        background: designer.profilePicture
          ? `url(${designer.profilePicture}) center/cover`
          : "#333",
        flexShrink: 0, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 18,
      }}>
        {!designer.profilePicture && "👤"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#fff",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {designer.username || `${designer.firstName} ${designer.lastName}`}
        </div>
        {designer.bio && (
          <div style={{ fontSize: 11, color: "#666", marginTop: 2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {designer.bio}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Post Requirement Modal
// ─────────────────────────────────────────────
function PostRequirementModal({ onClose, onSuccess }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: "", category: "dress", description: "", budget: "", timeline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    setLoading(true);
    setError("");
    try {
      // Posts as a design with isAvailableForCollab:true to signal it's a requirement
      // You can adjust this to a dedicated requirements endpoint if you build one
      const body = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        isPublic: true,
        isAvailableForCollab: true,
        images: [{ url: "https://via.placeholder.com/400x500?text=Requirement", publicId: "placeholder", isPrimary: true }],
        designerPhoto: { url: "https://via.placeholder.com/100?text=Co", publicId: "placeholder" },
        inspiration: form.budget ? `Budget: ${form.budget} | Timeline: ${form.timeline}` : form.timeline || "Open",
        tags: ["requirement"],
      };
      const res = await fetch(API_ENDPOINTS.DESIGNS, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess?.(data.data);
        onClose?.();
      } else {
        setError(data.error?.message || "Failed to post requirement");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000, padding: "20px",
    }}>
      <div style={{
        background: "#1a1a1a", borderRadius: 14, padding: "28px",
        width: "100%", maxWidth: 520, maxHeight: "90vh",
        overflowY: "auto", border: "1px solid #333",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: "#fff", fontSize: "1.3rem" }}>Post New Requirement</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Title *", name: "title", placeholder: "e.g. Need a bridal gown design" },
            { label: "Budget (optional)", name: "budget", placeholder: "e.g. $500 – $1000" },
            { label: "Timeline (optional)", name: "timeline", placeholder: "e.g. 2 weeks" },
          ].map(({ label, name, placeholder }) => (
            <div key={name} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 6 }}>{label}</label>
              <input
                type="text" value={form[name]} placeholder={placeholder}
                onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 12px", background: "#111",
                  border: "1px solid #333", borderRadius: 8, color: "#fff",
                  fontSize: 14, boxSizing: "border-box",
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 6 }}>Category *</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["dress", "jewellery", "shoes"].map(cat => (
                <button key={cat} type="button"
                  onClick={() => setForm(p => ({ ...p, category: cat }))}
                  style={{
                    flex: 1, padding: "8px", borderRadius: 8,
                    border: `1px solid ${form.category === cat ? "#fff" : "#333"}`,
                    background: form.category === cat ? "#fff" : "#111",
                    color: form.category === cat ? "#000" : "#888",
                    cursor: "pointer", fontWeight: 600, textTransform: "capitalize", fontSize: 13,
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 6 }}>Description (optional)</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe what you're looking for..."
              rows={3}
              style={{
                width: "100%", padding: "10px 12px", background: "#111",
                border: "1px solid #333", borderRadius: 8, color: "#fff",
                fontSize: 14, boxSizing: "border-box", resize: "vertical",
              }}
            />
          </div>

          {error && (
            <div style={{ color: "#ff6b6b", background: "#2a1515", border: "1px solid #5a2020",
              borderRadius: 6, padding: "8px 12px", marginBottom: 16, fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #333",
              background: "none", color: "#888", cursor: "pointer", fontSize: 14,
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "none",
              background: loading ? "#333" : "#fff", color: loading ? "#888" : "#000",
              cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700,
            }}>
              {loading ? "Posting..." : "Post Requirement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN: CompanyDashboard
// ─────────────────────────────────────────────
const CompanyDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("requirements");
  const [collabFilter, setCollabFilter] = useState("all");
  const [showPostModal, setShowPostModal] = useState(false);

  const [requirements, setRequirements] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [liked, setLiked] = useState([]);
  const [following, setFollowing] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, [user?._id]);

  const loadAll = async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      await Promise.all([
        loadRequirements(),
        loadCollaborations(),
        loadStats(),
      ]);
      // Following comes from user profile
      setFollowing(user.following || []);
    } catch (e) {
      console.error("Dashboard load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadRequirements = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINTS.DESIGNS}?userId=${user._id}&limit=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) setRequirements(data.data.designs || []);
    } catch (e) { console.error(e); }
  };

  const loadCollaborations = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINTS.COLLABORATIONS}?limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) setCollaborations(data.data.collaborations || []);
    } catch (e) { console.error(e); }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setStats(data.data.stats || {});
    } catch (e) { console.error(e); }
  };

  const handleDeleteRequirement = async (id) => {
    if (!window.confirm("Delete this requirement?")) return;
    try {
      const res = await fetch(API_ENDPOINTS.DESIGN_DELETE(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setRequirements(prev => prev.filter(r => r._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleCollabAction = async (id, action) => {
    try {
      const res = await fetch(API_ENDPOINTS.COLLABORATION_RESPOND(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      if (res.ok) loadCollaborations();
    } catch (e) { console.error(e); }
  };

  const filteredCollabs = collaborations.filter(c => {
    if (collabFilter === "all") return true;
    if (collabFilter === "pending") return c.status === "pending";
    if (collabFilter === "active") return c.status === "accepted";
    return true;
  });

  const tabs = [
    { key: "requirements", label: "📋 Requirements", count: requirements.length },
    { key: "collaborations", label: "🤝 Collaborations", count: collaborations.length },
    { key: "shortlisted", label: "⭐ Shortlisted", count: shortlisted.length },
    { key: "liked", label: "❤️ Liked", count: liked.length },
    { key: "following", label: "👥 Following", count: following.length },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#fff", fontSize: "1.1rem" }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .company-dash {
          min-height: 100vh;
          background: #111;
          color: #fff;
          font-family: 'Montserrat', Arial, sans-serif;
          padding: 40px 32px 60px 32px;
          box-sizing: border-box;
        }
        .company-tab-btn {
          background: none;
          border: 1px solid #2a2a2a;
          color: #888;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .company-tab-btn.active {
          background: #fff;
          color: #000;
          border-color: #fff;
        }
        .company-tab-btn:hover:not(.active) {
          border-color: #555;
          color: #ccc;
        }
        .collab-filter-btn {
          background: none;
          border: 1px solid #2a2a2a;
          color: #888;
          border-radius: 20px;
          padding: 5px 14px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.15s;
        }
        .collab-filter-btn.active {
          background: #333;
          color: #fff;
          border-color: #555;
        }
        @media (max-width: 767px) {
          .company-dash {
            padding: 20px 16px 40px 16px;
          }
          .company-stats-row {
            flex-wrap: wrap;
          }
          .company-tabs-row {
            overflow-x: auto;
            padding-bottom: 4px;
          }
          .company-grid-2 {
            grid-template-columns: 1fr !important;
          }
          .company-grid-3 {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>

      <div className="company-dash">

        {/* ── TOP INFO ── */}
        <div style={{
          background: "#1a1a1a", borderRadius: 14, padding: "24px 28px",
          marginBottom: 24, display: "flex",
          justifyContent: "space-between", alignItems: "flex-start",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 6, fontFamily: "'Cormorant Garamond', serif" }}>
              {user.companyName}
            </div>
            <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>📧 {user.email}</div>
            <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>🏢 Company Account</div>
            {user.website && (
              <div style={{ color: "#4ecdc4", fontSize: 13 }}>🌐 {user.website}</div>
            )}
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            style={{
              background: "#2a1515", color: "#ff6b6b", border: "1px solid #5a2020",
              borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: 13,
            }}
          >
            Logout
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="company-stats-row" style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <StatCard value={requirements.length} label="Requirements Posted" accent="#f9ca24" />
          <StatCard value={collaborations.length} label="Collaborations" accent="#4ecdc4" />
          <StatCard value={shortlisted.length} label="Shortlisted Designs" accent="#a29bfe" />
          <StatCard value={following.length} label="Designers Following" accent="#fd79a8" />
        </div>

        {/* ── MAIN ACTION BUTTON ── */}
        <button
          onClick={() => setShowPostModal(true)}
          style={{
            background: "#fff", color: "#000", border: "none",
            borderRadius: 10, padding: "12px 28px", fontWeight: 700,
            fontSize: "1rem", cursor: "pointer", marginBottom: 28,
            letterSpacing: 0.5,
          }}
        >
          + Post New Requirement
        </button>

        {/* ── TABS ── */}
        <div className="company-tabs-row" style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              className={`company-tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              {t.count > 0 && (
                <span style={{
                  marginLeft: 6, background: activeTab === t.key ? "#000" : "#333",
                  color: activeTab === t.key ? "#fff" : "#aaa",
                  borderRadius: 20, padding: "1px 7px", fontSize: 11,
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}

        {/* Requirements */}
        {activeTab === "requirements" && (
          <div>
            <SectionHeader
              title="My Posted Requirements"
              action="+ Post New"
              onAction={() => setShowPostModal(true)}
            />
            {requirements.length === 0 ? (
              <div style={{ textAlign: "center", color: "#555", padding: "60px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <div>No requirements posted yet.</div>
                <button onClick={() => setShowPostModal(true)} style={{
                  marginTop: 16, background: "#fff", color: "#000", border: "none",
                  borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontWeight: 700,
                }}>
                  Post Your First Requirement
                </button>
              </div>
            ) : (
              <div className="company-grid-2" style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20,
              }}>
                {requirements.map(req => (
                  <RequirementCard key={req._id} req={req} onDelete={handleDeleteRequirement} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collaborations */}
        {activeTab === "collaborations" && (
          <div>
            <SectionHeader title="Collaborations" />
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["all", "pending", "active"].map(f => (
                <button
                  key={f}
                  className={`collab-filter-btn ${collabFilter === f ? "active" : ""}`}
                  onClick={() => setCollabFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {filteredCollabs.length === 0 ? (
              <div style={{ textAlign: "center", color: "#555", padding: "60px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
                <div>No collaborations yet.</div>
              </div>
            ) : (
              filteredCollabs.map(c => (
                <CollabCard
                  key={c._id}
                  collab={c}
                  onAccept={id => handleCollabAction(id, "accept")}
                  onDecline={id => handleCollabAction(id, "decline")}
                />
              ))
            )}
          </div>
        )}

        {/* Shortlisted */}
        {activeTab === "shortlisted" && (
          <div>
            <SectionHeader title="Shortlisted Designs" />
            {shortlisted.length === 0 ? (
              <div style={{ textAlign: "center", color: "#555", padding: "60px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
                <div>No shortlisted designs yet.</div>
                <div style={{ fontSize: 13, color: "#444", marginTop: 8 }}>
                  Save designs from the category pages to shortlist them here.
                </div>
              </div>
            ) : (
              <div className="company-grid-3" style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16,
              }}>
                {shortlisted.map(d => <SavedDesignCard key={d._id} design={d} />)}
              </div>
            )}
          </div>
        )}

        {/* Liked */}
        {activeTab === "liked" && (
          <div>
            <SectionHeader title="Liked Designs" />
            {liked.length === 0 ? (
              <div style={{ textAlign: "center", color: "#555", padding: "60px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>❤️</div>
                <div>No liked designs yet.</div>
              </div>
            ) : (
              <div className="company-grid-3" style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16,
              }}>
                {liked.map(d => <SavedDesignCard key={d._id} design={d} />)}
              </div>
            )}
          </div>
        )}

        {/* Following */}
        {activeTab === "following" && (
          <div>
            <SectionHeader title="Designers You Follow" />
            {following.length === 0 ? (
              <div style={{ textAlign: "center", color: "#555", padding: "60px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                <div>Not following any designers yet.</div>
                <div style={{ fontSize: 13, color: "#444", marginTop: 8 }}>
                  Follow designers from the Dress, Jewellery or Shoes pages.
                </div>
              </div>
            ) : (
              <div className="company-grid-2" style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12,
              }}>
                {following.map((d, i) => (
                  <FollowingCard key={d._id || i} designer={d} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Post Requirement Modal */}
      {showPostModal && (
        <PostRequirementModal
          onClose={() => setShowPostModal(false)}
          onSuccess={() => { loadRequirements(); }}
        />
      )}
    </>
  );
};

export default CompanyDashboard;