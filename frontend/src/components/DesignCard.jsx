import React, { useState } from 'react';

const DesignCard = ({ design, onUpdate, showCollaborate = false, onCollaborate }) => {
  const [isLiked, setIsLiked] = useState(design.isLiked || false);
  const [isSaved, setIsSaved] = useState(design.isSaved || false);
  const [likesCount, setLikesCount] = useState(design.likesCount || 0);
  const [savesCount, setSavesCount] = useState(design.savesCount || 0);
  const [sharesCount, setSharesCount] = useState(design.shares || 0);

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to like designs');
      return;
    }

    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/designs/${design._id}/like`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(!isLiked);
        setLikesCount(data.data.likesCount);
        onUpdate?.();
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save designs');
      return;
    }

    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const response = await fetch(`/api/designs/${design._id}/save`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setIsSaved(!isSaved);
        setSavesCount(data.data.savesCount);
        onUpdate?.();
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleShare = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch(`/api/designs/${design._id}/share`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      setSharesCount(prev => prev + 1);

      // Copy link to clipboard
      const shareUrl = `${window.location.origin}/design/${design._id}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
      onUpdate?.();
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const primaryImage = design.images?.find(img => img.isPrimary) || design.images?.[0];

  return (
    <div style={{ background: '#232323', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
      {/* Image */}
      <div style={{ height: 250, background: primaryImage ? `url(${primaryImage.url})` : '#444', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        {/* Category Badge */}
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
          {design.category}
        </div>

        {/* Collaboration Badge */}
        {design.isAvailableForCollab && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(40,167,69,0.9)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
            🤝 Available
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        {/* Designer Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
              {design.user?.username || design.user?.firstName || 'Designer'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
              {design.createdAt ? new Date(design.createdAt).toLocaleDateString() : 'Recently'}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {design.title}
        </h3>

        {/* Description */}
        {design.description && (
          <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {design.description}
          </p>
        )}

        {/* Tags */}
        {design.tags && design.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {design.tags.slice(0, 3).map((tag, index) => (
              <span key={index} style={{ background: '#333', color: '#ccc', padding: '0.25rem 0.5rem', borderRadius: 12, fontSize: '0.7rem', fontWeight: 500 }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Engagement Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #333' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleLike}
              style={{ background: 'none', border: 'none', color: isLiked ? '#ff6b6b' : '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}>
              {isLiked ? '❤️' : '🤍'} {likesCount}
            </button>

            <button
              onClick={handleSave}
              style={{ background: 'none', border: 'none', color: isSaved ? '#4ecdc4' : '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}>
              {isSaved ? '💾' : '🔖'} {savesCount}
            </button>

            <button
              onClick={handleShare}
              style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}>
              📤 {sharesCount}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#888' }}>
            👁️ {design.views || 0}
          </div>
        </div>

        {/* Collaborate Button */}
        {showCollaborate && design.isAvailableForCollab && onCollaborate && (
          <button
            onClick={() => onCollaborate(design)}
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: 8, border: 'none', background: '#28a745', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            🤝 Send Collaboration Request
          </button>
        )}
      </div>
    </div>
  );
};

export default DesignCard;