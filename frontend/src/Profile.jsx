import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DesignSubmissionForm from "./components/DesignSubmissionForm";

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    designsCount: 0,
    totalLikes: 0,
    totalSaved: 0,
    totalShared: 0,
    followers: 0,
  });
  const [myDesigns, setMyDesigns] = useState([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load data when component mounts or user changes
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login-signup");
    } else if (user) {
      loadProfileData();
    }
  }, [isAuthenticated, user?._id]);

  const loadProfileData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([loadStats(), loadMyDesigns()]);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        console.log('📊 Stats loaded:', data.data.stats);
        setStats(data.data.stats || stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadMyDesigns = async () => {
    if (!user) {
      console.log('❌ No user found');
      return;
    }
    const token = localStorage.getItem("token");
    console.log('🔍 Fetching designs for user:', user._id);
    try {
      const url = `http://localhost:5000/api/designs?userId=${user._id}&limit=100&sortBy=createdAt&sortOrder=desc`;
      console.log('📡 API URL:', url);
      
      const response = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('📨 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);
      
     if (data.success) {
  const designs = Array.isArray(data.data)
    ? data.data
    : data.data?.designs || [];
  setMyDesigns(designs);
} else {
  setMyDesigns([]);
}

    } catch (error) {
      console.error("❌ Failed to load designs:", error);
      setMyDesigns([]);
    }
  };

  const handleDesignSuccess = async (newDesign) => {
    console.log('✅ New design submitted:', newDesign);
    
    // Reload all data
    await loadProfileData();
    
    // Close the form
    setShowSubmitForm(false);
    
    // Show success message
    alert('🎉 Design submitted successfully! Your design is now visible in your profile and category page.');
  };

  if (!user) return null;

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
    <div
      style={{
        minHeight: "100vh",
        background: "#181818",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 60,
        paddingBottom: 60,
      }}
    >
      {/* Profile Dashboard */}
      <div
        style={{
          background: "#232323",
          borderRadius: 12,
          boxShadow: "0 2px 12px #0004",
          padding: 40,
          minWidth: 400,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              margin: 0,
            }}
          >
            Profile Dashboard
          </h2>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
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
          <strong>Type:</strong>{" "}
          {user.userType === "individual" ? "Individual Designer" : "Company"}
        </div>
        {user.username && (
          <div style={{ marginBottom: 18 }}>
            <strong>Username:</strong> @{user.username}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 32,
            marginTop: 32,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "#333",
              borderRadius: 8,
              padding: 24,
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.designsCount}</div>
            <div>Designs Submitted</div>
          </div>
          <div
            style={{
              background: "#333",
              borderRadius: 8,
              padding: 24,
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.totalLikes}</div>
            <div>Total Likes</div>
          </div>
          <div
            style={{
              background: "#333",
              borderRadius: 8,
              padding: 24,
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.totalSaved}</div>
            <div>Saved</div>
          </div>
          <div
            style={{
              background: "#333",
              borderRadius: 8,
              padding: 24,
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.totalShared}</div>
            <div>Shared</div>
          </div>
          <div
            style={{
              background: "#333",
              borderRadius: 8,
              padding: 24,
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.followers}</div>
            <div>Followers</div>
          </div>
        </div>
      </div>

      {/* Submit New Design Button */}
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

      {/* My Submitted Designs */}
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
            <div style={{ fontSize: '0.9rem' }}>Click "Submit New Design" to upload your first design!</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {myDesigns.map((design) => {
              const primaryImage = design.images?.find(img => img.isPrimary) || design.images?.[0];
              
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
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div
                    style={{
                      height: 250,
                      background: primaryImage?.url
                        ? `url(${primaryImage.url})`
                        : "#444",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: 'relative'
                    }}
                  >
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
                    <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: '1.1rem' }}>
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
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#ccc",
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #444'
                      }}
                    >
                      <span>💖 {design.likesCount || 0}</span>
                      <span>💾 {design.savesCount || 0}</span>
                      <span>👁️ {design.views || 0}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Design Submission Modal */}
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