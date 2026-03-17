import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DesignSubmissionForm from "./components/DesignSubmissionForm";
import { API_ENDPOINTS } from './config/api';
import CompanyDashboard from "./CompanyDashboard";

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    designsCount: 0,
    totalLikes: 0,
    followersCount: 0,
    followingCount: 0,
  });
  const [myDesigns, setMyDesigns] = useState([]);
  const [collabRequests, setCollabRequests] = useState([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collabLoading, setCollabLoading] = useState({});

  const loadProfileData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await Promise.all([loadStats(), loadMyDesigns(), loadCollabRequests()]);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login-signup");
    } else if (user) {
      loadProfileData();
    }
  }, [isAuthenticated, user?._id]);

  const loadStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats || stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadMyDesigns = async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) { setMyDesigns([]); return; }

    try {
      const response = await fetch(
        `${API_ENDPOINTS.DESIGNS}?userId=${user._id}&limit=100&sortBy=createdAt&sortOrder=desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (!response.ok) { setMyDesigns([]); return; }

      const data = await response.json();
      if (data.success && data.data) {
        const designs = data.data.designs || [];
        setMyDesigns(designs);
        setStats(prev => ({ ...prev, designsCount: designs.length }));
      } else {
        setMyDesigns([]);
      }
    } catch (error) {
      console.error("Failed to load designs:", error);
      setMyDesigns([]);
    }
  };

  const loadCollabRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `${API_ENDPOINTS.COLLABORATIONS}?type=received&status=pending&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setCollabRequests(data.data.collaborations || []);
      }
    } catch (error) {
      console.error("Failed to load collaboration requests:", error);
    }
  };

  const respondToCollab = async (id, action) => {
    const token = localStorage.getItem("token");
    setCollabLoading(prev => ({ ...prev, [id]: action }));
    try {
      const response = await fetch(API_ENDPOINTS.COLLABORATION_RESPOND(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCollabRequests(prev => prev.filter(r => r._id !== id));
        alert(`Collaboration request ${action}ed successfully!`);
      } else {
        alert(data.error?.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Failed to ${action} collab:`, error);
      alert('Network error. Please try again.');
    } finally {
      setCollabLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleDesignSuccess = async (newDesign) => {
    await Promise.all([loadStats(), loadMyDesigns()]);
    setShowSubmitForm(false);
    alert('🎉 Design submitted successfully!');
  };

  const handleDeleteDesign = async (designId) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_ENDPOINTS.DESIGN_DELETE(designId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMyDesigns(prev => prev.filter(d => d._id !== designId));
        await loadStats();
        alert('✅ Deleted successfully');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  // Company users go to company dashboard
  if (user.userType === "company") {
    return <CompanyDashboard />;
  }

  if (loading && myDesigns.length === 0) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#181818",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ fontSize: '1.2rem' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#181818",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 60,
      paddingBottom: 60,
    }}>

      {/* ── PROFILE CARD ── */}
      <div style={{
        background: "#232323",
        borderRadius: 12,
        boxShadow: "0 2px 12px #0004",
        padding: 40,
        minWidth: 400,
        marginBottom: 40,
        width: '100%',
        maxWidth: 900,
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32,
            margin: 0,
          }}>
            Profile Dashboard
          </h2>
          <button
            onClick={() => { logout(); navigate("/"); }}
            style={{
              background: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <strong>Name:</strong>{" "}
          {user.firstName ? `${user.firstName} ${user.lastName}` : user.companyName}
        </div>
        <div style={{ marginBottom: 18 }}>
          <strong>Email:</strong> {user.email}
        </div>
        <div style={{ marginBottom: 18 }}>
          <strong>Type:</strong> Individual Designer
        </div>
        {user.username && (
          <div style={{ marginBottom: 18 }}>
            <strong>Username:</strong> @{user.username}
          </div>
        )}

        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: 32,
          marginTop: 32,
          flexWrap: "wrap",
        }}>
          {[
            { value: stats.designsCount, label: "Designs Submitted" },
            { value: stats.totalLikes, label: "Total Likes" },
            { value: stats.followersCount || 0, label: "Followers" },
            { value: stats.followingCount || 0, label: "Following" },
          ].map(({ value, label }) => (
            <div key={label} style={{
              background: "#333",
              borderRadius: 8,
              padding: 24,
              minWidth: 120,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
              <div style={{ color: '#ccc', fontSize: 13, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── COLLABORATION REQUESTS SECTION ── */}
      {collabRequests.length > 0 && (
        <div style={{
          width: '100%',
          maxWidth: 900,
          marginBottom: 40,
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              color: '#fff',
              fontFamily: "'Cormorant Garamond', serif",
            }}>
              Collaboration Requests
            </h3>
            <span style={{
              background: '#28a745',
              color: '#fff',
              borderRadius: 20,
              padding: '2px 10px',
              fontSize: 13,
              fontWeight: 700,
            }}>
              {collabRequests.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {collabRequests.map(req => (
              <div key={req._id} style={{
                background: '#232323',
                borderRadius: 10,
                padding: 24,
                border: '1px solid #2e2e2e',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 20,
                flexWrap: 'wrap',
              }}>
                {/* Left: info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Company name + badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 6,
                  }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: req.companyId?.companyLogo
                        ? `url(${req.companyId.companyLogo}) center/cover`
                        : '#444',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}>
                      {!req.companyId?.companyLogo && '🏢'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                        {req.companyId?.companyName || 'A company'}
                      </div>
                      <div style={{ fontSize: 12, color: '#888' }}>
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })
                          : ''}
                      </div>
                    </div>
                  </div>

                  {/* Design title */}
                  <div style={{
                    fontSize: 13,
                    color: '#aaa',
                    marginBottom: 10,
                  }}>
                    For your design:{' '}
                    <span style={{ color: '#ddd', fontWeight: 600 }}>
                      "{req.designId?.title || 'Untitled'}"
                    </span>
                  </div>

                  {/* Message */}
                  <div style={{
                    fontSize: 14,
                    color: '#ccc',
                    fontStyle: 'italic',
                    borderLeft: '3px solid #444',
                    paddingLeft: 12,
                    lineHeight: 1.5,
                  }}>
                    "{req.message}"
                  </div>

                  {/* Proposed terms if any */}
                  {req.proposedTerms && (req.proposedTerms.budget || req.proposedTerms.timeline) && (
                    <div style={{
                      marginTop: 10,
                      display: 'flex',
                      gap: 16,
                      flexWrap: 'wrap',
                    }}>
                      {req.proposedTerms.budget > 0 && (
                        <span style={{
                          background: '#1a3a1a',
                          color: '#6ab04c',
                          border: '1px solid #2a5a2a',
                          borderRadius: 6,
                          padding: '3px 10px',
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          💰 Budget: ${req.proposedTerms.budget}
                        </span>
                      )}
                      {req.proposedTerms.timeline && (
                        <span style={{
                          background: '#1a2a3a',
                          color: '#4ecdc4',
                          border: '1px solid #1a4a5a',
                          borderRadius: 6,
                          padding: '3px 10px',
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          ⏱ Timeline: {req.proposedTerms.timeline}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: buttons */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  flexShrink: 0,
                  minWidth: 130,
                }}>
                  <button
                    onClick={() => respondToCollab(req._id, 'accept')}
                    disabled={!!collabLoading[req._id]}
                    style={{
                      background: collabLoading[req._id] === 'accept' ? '#1a5e2a' : '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 20px',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: collabLoading[req._id] ? 'not-allowed' : 'pointer',
                      opacity: collabLoading[req._id] && collabLoading[req._id] !== 'accept' ? 0.5 : 1,
                      transition: 'background 0.2s',
                    }}
                  >
                    {collabLoading[req._id] === 'accept' ? 'Accepting...' : '✓ Accept'}
                  </button>
                  <button
                    onClick={() => respondToCollab(req._id, 'decline')}
                    disabled={!!collabLoading[req._id]}
                    style={{
                      background: 'transparent',
                      color: '#dc3545',
                      border: '1px solid #dc3545',
                      borderRadius: 8,
                      padding: '10px 20px',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: collabLoading[req._id] ? 'not-allowed' : 'pointer',
                      opacity: collabLoading[req._id] && collabLoading[req._id] !== 'decline' ? 0.5 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (!collabLoading[req._id]) {
                        e.currentTarget.style.background = '#dc3545';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#dc3545';
                    }}
                  >
                    {collabLoading[req._id] === 'decline' ? 'Declining...' : '✕ Decline'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for collab requests (only shown after load, no requests) */}
      {!loading && collabRequests.length === 0 && (
        <div style={{
          width: '100%',
          maxWidth: 900,
          marginBottom: 24,
          boxSizing: 'border-box',
        }}>
          {/* intentionally empty — no clutter when no requests */}
        </div>
      )}

      {/* ── SUBMIT BUTTON ── */}
      <button
        onClick={() => setShowSubmitForm(true)}
        style={{
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "0.75rem 1.5rem",
          cursor: "pointer",
          fontWeight: 600,
          marginBottom: "2rem",
          fontSize: '1.1rem'
        }}
      >
        + Submit New Design
      </button>

      {/* ── MY DESIGNS GRID ── */}
      <div style={{ width: "100%", maxWidth: 1200 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1.5rem' }}>
          My Submitted Designs ({myDesigns.length})
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>
            Loading designs...
          </div>
        ) : myDesigns.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: '#232323',
            borderRadius: 12,
            color: '#ccc'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No designs yet</div>
            <div style={{ fontSize: '0.9rem' }}>
              Click "Submit New Design" to upload your first design!
            </div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}>
            {myDesigns.map((design) => {
              const primaryImage =
                design.images?.find(img => img.isPrimary) || design.images?.[0];

              return (
                <div
                  key={design._id}
                  style={{
                    background: "#333",
                    borderRadius: 8,
                    overflow: "hidden",
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    height: 250,
                    background: primaryImage?.url
                      ? `url(${primaryImage.url})`
                      : "#444",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 20,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {design.category}
                    </div>
                  </div>

                  <div style={{ padding: "1.25rem" }}>
                    <div style={{
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      fontSize: '1.1rem'
                    }}>
                      {design.title}
                    </div>

                    {design.description && (
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#ccc',
                        marginBottom: '0.75rem',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {design.description}
                      </div>
                    )}

                    {design.tags && design.tags.length > 0 && (
                      <div style={{
                        fontSize: "0.8rem",
                        color: "#aaa",
                        marginBottom: "0.75rem",
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        {design.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} style={{
                            background: '#444',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 12
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{
                      fontSize: "0.9rem",
                      color: "#ccc",
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #444'
                    }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <span>💖 {design.likesCount || 0}</span>
                        <span>💾 {design.savesCount || 0}</span>
                        <span>👁️ {design.views || 0}</span>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteDesign(design._id);
                        }}
                        style={{
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#c82333'}
                        onMouseLeave={e => e.currentTarget.style.background = '#dc3545'}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── DESIGN SUBMISSION MODAL ── */}
      {showSubmitForm && (
        <DesignSubmissionForm
          onClose={() => setShowSubmitForm(false)}
          onSuccess={handleDesignSuccess}
        />
      )}
    </div>
  );
};

export default Profile;