import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';
import { API_ENDPOINTS } from './config/api';
import dressFeature from './assets/dresslogo.jpeg';
import slider1 from './assets/slider1.png';
import slider2 from './assets/slider2.png';
import slider3 from './assets/slider3.webp';
import slider4 from './assets/slider4.png';

// ─────────────────────────────────────────────
// AllureBanner
// ─────────────────────────────────────────────
function AllureBanner() {
  return (
    <div
      style={{
        width: '100%',
        height: 180,
        background: 'rgba(30,30,30,0.3)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#fff',
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: 6,
        marginBottom: 0,
      }}
    >
      {/* Top line */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: '10%',
          width: '80%',
          height: 1,
          background: 'rgba(255,255,255,0.4)',
        }}
      />
      {/* Bottom line */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '10%',
          width: '80%',
          height: 1,
          background: 'rgba(255,255,255,0.4)',
        }}
      />
      <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: 12, zIndex: 1, marginBottom: 8 }}>
        ALLURE
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: 2,
          zIndex: 1,
          textAlign: 'center',
          fontFamily: 'Montserrat, Arial, sans-serif',
          marginTop: 0,
        }}
      >
        Effortless charm, stitched to perfection.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DressSlider
// ─────────────────────────────────────────────
function DressSlider() {
  const slides = [slider1, slider2, slider3, slider4];
  const [current, setCurrent] = React.useState(0);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((current + 1) % slides.length);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      position: 'relative',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#d3d3d3',
        borderRadius: 12,
        boxShadow: '0 2px 12px #0001',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img
          src={slides[current]}
          alt={`Slide ${current + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 8,
            transition: 'all 0.4s cubic-bezier(.4,2,.6,1)',
          }}
        />
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
            background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36,
            boxShadow: '0 2px 8px #0002', cursor: 'pointer', fontSize: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
            background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36,
            boxShadow: '0 2px 8px #0002', cursor: 'pointer', fontSize: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          &gt;
        </button>
      </div>
      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {slides.map((_, idx) => (
          <span
            key={idx}
            style={{
              width: 10, height: 10, borderRadius: '50%',
              background: idx === current ? '#222' : '#bbb',
              display: 'inline-block', transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FollowButton
// ─────────────────────────────────────────────
function FollowButton({ userId }) {
  const { isAuthenticated, token, user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.following) {
      setIsFollowing(
        user.following.some(
          (id) => id === userId || (typeof id === 'object' && id._id === userId)
        )
      );
    }
  }, [user, userId]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      alert('Please login to follow users');
      return;
    }
    try {
      setLoading(true);
      const method = isFollowing ? 'DELETE' : 'POST';
      const response = await fetch(API_ENDPOINTS.USER_FOLLOW(userId), {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to follow/unfollow user');
      }
    } catch (error) {
      console.error('Follow error:', error);
      alert('Failed to follow/unfollow user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      style={{
        background: isFollowing ? '#666' : '#222',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '8px 16px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: 14,
        fontWeight: 600,
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? '...' : isFollowing ? 'Following' : '+ Follow'}
    </button>
  );
}

// ─────────────────────────────────────────────
// DressDesignCard
// ─────────────────────────────────────────────
function DressDesignCard({ design, onUpdate }) {
  const { isAuthenticated, token, user } = useAuth();
  const primaryImage = design.images?.find((img) => img.isPrimary) || design.images?.[0];
  const designerPhoto = design.designerPhoto;

  const [isLiked, setIsLiked] = useState(design.isLiked || false);
  const [likesCount, setLikesCount] = useState(design.likesCount || 0);
  const [sharesCount, setSharesCount] = useState(design.shares || 0);
  const [commentsCount, setCommentsCount] = useState(design.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // ✅ ADD THIS HERE (your new states)
  const [collabSent, setCollabSent] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [collabMessage, setCollabMessage] = useState('');

  // ✅ ADD THIS LOGIC
  const canCollaborate =
    user?.userType === 'company' &&
    design.user?._id !== user?._id &&
    !collabSent;

  const handleLike = async () => {
    if (!isAuthenticated) { alert('Please login to like designs'); return; }
    try {
      setLoading(true);
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(API_ENDPOINTS.DESIGN_LIKE(design._id), {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setIsLiked(!isLiked);
        setLikesCount(data.data.likesCount);
        onUpdate?.();
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to like design');
      }
    } catch (error) {
      console.error('Like error:', error);
      alert('Failed to like design');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!isAuthenticated) { alert('Please login to share designs'); return; }
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.DESIGN_SHARE(design._id), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setSharesCount(data.data.sharesCount);
        if (navigator.share) {
          try {
            await navigator.share({
              title: design.title,
              text: design.description || 'Check out this amazing design!',
              url: window.location.href,
            });
          } catch (_) {}
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
        }
        onUpdate?.();
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to share design');
      }
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to share design');
    } finally {
      setLoading(false);
    }
  };

  // ✅ OPTIONAL: handle collaboration request
  const handleSendCollab = async () => {
    if (!collabMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.SEND_COLLAB_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          designId: design._id,
          message: collabMessage,
        }),
      });

      if (response.ok) {
        setCollabSent(true);
        setShowCollabModal(false);
        setCollabMessage('');
        alert("Collaboration request sent!");
      } else {
        alert("Failed to send request");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending request");
    }
  };

  return (
    <div className="design-card-container">
      {/* Image */}
      <div className="design-card-image">
        {primaryImage && (
          <img src={primaryImage.url} alt="Dress" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      {/* Content */}
      <div className="design-card-content-wrapper">
        <div className="design-card-header">
          <div className="design-card-designer-name">
            {design.user?.username || `${design.user?.firstName} ${design.user?.lastName}`}
          </div>

          {design.user?._id && design.user._id !== user?._id && (
            <FollowButton userId={design.user._id} />
          )}
        </div>

        <div className="design-card-content">
          <div className="design-card-avatar">
            {designerPhoto && <img src={designerPhoto.url} alt="Designer" />}
          </div>

          <div className="design-card-interactions">
            <div className="design-card-icons">

              {/* LIKE */}
              <button onClick={handleLike} disabled={loading} className={`design-card-icon-btn ${isLiked ? 'liked' : ''}`}>
                {isLiked ? '❤️' : '♡'}
              </button>

              {/* COMMENT */}
              <button className="design-card-icon-btn">
                🗨️
              </button>

              {/* SHARE */}
              <button onClick={handleShare} disabled={loading} className="design-card-icon-btn">
                🔗
              </button>

              {/* ✅ COLLAB BUTTON (INSERTED HERE) */}
              {canCollaborate && (
                <button
                  onClick={() => setShowCollabModal(true)}
                  className="design-card-icon-btn"
                  title="Send collaboration request"
                  style={{ color: '#28a745', fontSize: 20 }}
                >
                  🤝
                </button>
              )}
            </div>

            <div className="design-card-inspiration">
              {design.inspiration || design.description || 'Elegant design'}
            </div>
          </div>
        </div>

        {/* ✅ COLLAB MODAL */}
        {showCollabModal && (
          <div className="design-card-comments-modal">
            <div className="design-card-comments-header">
              <h3>Send Collaboration Request</h3>
              <button onClick={() => setShowCollabModal(false)}>×</button>
            </div>

            <div style={{ padding: 16 }}>
              <textarea
                value={collabMessage}
                onChange={(e) => setCollabMessage(e.target.value)}
                placeholder="Write your message..."
                style={{ width: '100%', height: 80, padding: 10 }}
              />

              <button
                onClick={handleSendCollab}
                style={{
                  marginTop: 10,
                  padding: '8px 16px',
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Send Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────
// DressPage (default export)
// ─────────────────────────────────────────────
function DressPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDressDesigns();
  }, []);

  const fetchDressDesigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_ENDPOINTS.DESIGNS}?category=dress&limit=100&sortBy=createdAt&sortOrder=desc`
      );
      const data = await response.json();
      if (data.success) {
        console.log('✅ Fetched dress designs:', data.data.designs.length);
        setDesigns(data.data.designs);
      }
    } catch (error) {
      console.error('❌ Failed to fetch dress designs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── HERO ── */}
      <div
        style={{
          background: '#d3d3d3',
          width: '100vw',
          height: '60vh',
          minHeight: '60vh',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 80,
        }}
      >
        {/* Banner overlay */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%',
            zIndex: 2, display: 'flex', justifyContent: 'center', pointerEvents: 'none',
          }}
        >
          <div style={{ width: 900, maxWidth: '90vw', margin: '0 auto', top: 70, position: 'relative' }}>
            <AllureBanner />
          </div>
        </div>

        {/* Slider */}
        <div
          style={{
            position: 'relative', width: '100%', height: '100%',
            background: '#d3d3d3', borderRadius: 12,
            boxShadow: '0 2px 12px #0001', display: 'flex',
            alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}
        >
          <DressSlider />
        </div>
      </div>

      {/* ── FEATURE CIRCLE ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '70vh',
          transform: 'translate(-50%, -50%)',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 8px 32px #0004',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '8px solid #d3d3d3',
          zIndex: 2,
        }}
      >
        <img src={dressFeature} alt="Dress Feature" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* ── DESIGN GRID ── */}
      <div className="design-cards-container" style={{ marginTop: 120, marginBottom: 80 }}>
        {loading ? (
          <div
            style={{
              gridColumn: '1 / -1', display: 'flex', justifyContent: 'center',
              alignItems: 'center', minHeight: 400, color: '#fff', fontSize: '1.2rem',
            }}
          >
            Loading dress designs...
          </div>
        ) : designs.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1', display: 'flex', justifyContent: 'center',
              alignItems: 'center', minHeight: 400, color: '#fff', fontSize: '1.2rem',
              flexDirection: 'column', gap: '1rem',
            }}
          >
            <div>No dress designs found yet.</div>
            <Link to="/profile" style={{ color: '#007bff', textDecoration: 'none' }}>
              Submit your first design here
            </Link>
          </div>
        ) : (
          designs.map((design) => (
            <DressDesignCard key={design._id} design={design} onUpdate={fetchDressDesigns} />
          ))
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer
        style={{
          width: '100%', background: '#222', color: '#fff', textAlign: 'center',
          padding: '32px 0 20px 0', fontFamily: 'Montserrat, Arial, sans-serif',
          fontSize: 16, letterSpacing: 1, marginTop: 40,
        }}
      >
        &copy; {new Date().getFullYear()} Designer Gallery. All rights reserved.
      </footer>
    </div>
  );
}

export default DressPage;