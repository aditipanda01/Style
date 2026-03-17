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

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await fetch(API_ENDPOINTS.DESIGN_COMMENT(design._id));
      if (response.ok) {
        const data = await response.json();
        setComments(data.data.comments || []);
        setCommentsCount(data.data.commentsCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentClick = () => {
    if (!isAuthenticated) { alert('Please login to view and add comments'); return; }
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) fetchComments();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated) return;
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.DESIGN_COMMENT(design._id), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.data.comment]);
        setCommentsCount(data.data.commentsCount);
        setCommentText('');
        onUpdate?.();
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Comment error:', error);
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="design-card-container">
      {/* Design image */}
      <div className="design-card-image">
        {primaryImage && (
          <img src={primaryImage.url} alt="Dress" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      {/* Right content */}
      <div className="design-card-content-wrapper">
        {/* Header: name + follow */}
        <div className="design-card-header">
          <div className="design-card-designer-name">
            {design.user?.username || `${design.user?.firstName} ${design.user?.lastName}`}
          </div>
          {design.user?._id && design.user._id !== user?._id && (
            <FollowButton userId={design.user._id} />
          )}
        </div>

        {/* Interaction box */}
        <div className="design-card-content">
          <div className="design-card-avatar">
            {designerPhoto && (
              <img src={designerPhoto.url} alt="Designer" />
            )}
          </div>

          <div className="design-card-interactions">
            <div className="design-card-icons">
              <button
                onClick={handleLike}
                disabled={loading}
                className={`design-card-icon-btn ${isLiked ? 'liked' : ''}`}
                title={`${likesCount} likes`}
              >
                {isLiked ? '❤️' : '♡'}
                {likesCount > 0 && <span className="design-card-icon-count">{likesCount}</span>}
              </button>

              <button
                onClick={handleCommentClick}
                className="design-card-icon-btn"
                title={`${commentsCount} comments`}
              >
                🗨️
                {commentsCount > 0 && <span className="design-card-icon-count">{commentsCount}</span>}
              </button>

              <button
                onClick={handleShare}
                disabled={loading}
                className="design-card-icon-btn"
                title={`${sharesCount} shares`}
              >
                🔗
                {sharesCount > 0 && <span className="design-card-icon-count">{sharesCount}</span>}
              </button>
            </div>

            <div className="design-card-inspiration">
              {design.inspiration || design.description || design.tags?.join(', ') || 'Elegant dress design'}
            </div>
          </div>
        </div>

        {/* Comments Modal */}
        {showComments && (
          <div className="design-card-comments-modal">
            <div className="design-card-comments-header">
              <h3 className="design-card-comments-title">Comments ({commentsCount})</h3>
              <button onClick={() => setShowComments(false)} className="design-card-comments-close">×</button>
            </div>

            <div className="design-card-comments-list">
              {loadingComments ? (
                <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>Loading comments...</div>
              ) : comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>No comments yet. Be the first!</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="design-card-comment-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <strong className="design-card-comment-author">
                        {comment.userId?.username ||
                          (comment.userId?.userType === 'company'
                            ? comment.userId?.companyName
                            : `${comment.userId?.firstName} ${comment.userId?.lastName}`)}
                      </strong>
                      <span className="design-card-comment-time">{formatDate(comment.createdAt)}</span>
                    </div>
                    <div className="design-card-comment-text">{comment.text}</div>
                  </div>
                ))
              )}
            </div>

            {isAuthenticated && (
              <form
                onSubmit={handleAddComment}
                style={{ padding: 16, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  maxLength={500}
                  disabled={loading}
                  style={{
                    flex: 1, padding: '8px 12px', border: '1px solid #ddd',
                    borderRadius: 4, fontSize: 14,
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !commentText.trim()}
                  style={{
                    padding: '8px 16px',
                    background: loading || !commentText.trim() ? '#ccc' : '#222',
                    color: '#fff', border: 'none', borderRadius: 4,
                    cursor: loading || !commentText.trim() ? 'not-allowed' : 'pointer',
                    fontSize: 14, fontWeight: 600,
                  }}
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </form>
            )}
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