import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EnhancedDesignCard = ({ design, onUpdate }) => {
  const { user, isAuthenticated, isCompany } = useAuth();
  const [isLiked, setIsLiked] = useState(design.isLiked || false);
  const [isSaved, setIsSaved] = useState(design.isSaved || false);
  const [likesCount, setLikesCount] = useState(design.likesCount || 0);
  const [savesCount, setSavesCount] = useState(design.savesCount || 0);
  const [sharesCount, setSharesCount] = useState(design.shares || 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to like designs');
      return;
    }

    try {
      setLoading(true);
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await axios({
        method,
        url: `/designs/${design._id}/like`
      });

      setIsLiked(!isLiked);
      setLikesCount(response.data.data.likesCount);
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to like/unlike design:', error);
      toast.error('Failed to update like status');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to save designs');
      return;
    }

    try {
      setLoading(true);
      const method = isSaved ? 'DELETE' : 'POST';
      const response = await axios({
        method,
        url: `/designs/${design._id}/save`
      });

      setIsSaved(!isSaved);
      setSavesCount(response.data.data.savesCount);
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to save/unsave design:', error);
      toast.error('Failed to update save status');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    
    try {
      // Update share count
      await axios.post(`/designs/${design._id}/share`);
      setSharesCount(prev => prev + 1);
      
      // Copy link to clipboard
      const shareUrl = `${window.location.origin}/designs/${design._id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to share design:', error);
      toast.error('Failed to share design');
    }
  };

  const handleCollaborate = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to send collaboration requests');
      return;
    }

    if (!isCompany) {
      toast.error('Only companies can send collaboration requests');
      return;
    }

    try {
      const designerName = design.user.username || `${design.user.firstName} ${design.user.lastName}`;
      
      await axios.post('/collaborations', {
        designId: design._id,
        message: `Hi ${designerName}! We love your design "${design.title}" and would like to explore a collaboration opportunity. Let's discuss how we can work together!`,
        proposedTerms: {
          budget: 3000,
          timeline: '3-4 weeks',
          deliverables: [
            'Design sketches and concepts',
            'Technical specifications',
            '3D mockups and renderings'
          ]
        }
      });
      
      toast.success('Collaboration request sent successfully!');
    } catch (error) {
      console.error('Failed to send collaboration request:', error);
      const errorMessage = error.response?.data?.error?.message || 'Failed to send collaboration request';
      toast.error(errorMessage);
    }
  };

  const primaryImage = design.images?.find(img => img.isPrimary) || design.images?.[0];

  return (
    <div style={{
      background: '#232323',
      borderRadius: 12,
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}>
      
      {/* Image */}
      <div style={{
        height: 250,
        background: primaryImage ? `url(${primaryImage.url})` : '#444',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Category Badge */}
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

        {/* Collaboration Badge */}
        {design.isAvailableForCollab && (
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(40, 167, 69, 0.9)',
            color: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: 20,
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            🤝 Available
          </div>
        )}

        {/* Hover Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
          {isCompany && design.isAvailableForCollab && design.userId._id !== user?._id && (
            <button
              onClick={handleCollaborate}
              style={{
                background: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              🤝 Collaborate
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        {/* Designer Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: design.user.profilePicture ? `url(${design.user.profilePicture})` : '#444',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem'
          }}>
            {!design.user.profilePicture && '👤'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#fff'
            }}>
              {design.user.username || `${design.user.firstName} ${design.user.lastName}`}
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: '#aaa'
            }}>
              {new Date(design.createdAt).toLocaleDateString()}
            </div>
          </div>
          {design.user.userType === 'individual' && (
            <div style={{
              background: '#007bff',
              color: '#fff',
              padding: '0.25rem 0.5rem',
              borderRadius: 4,
              fontSize: '0.7rem',
              fontWeight: 600
            }}>
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Title and Description */}
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '0.5rem',
          lineHeight: 1.3
        }}>
          {design.title}
        </h3>

        {design.description && (
          <p style={{
            fontSize: '0.9rem',
            color: '#ccc',
            marginBottom: '1rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {design.description}
          </p>
        )}

        {/* Tags */}
        {design.tags && design.tags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {design.tags.slice(0, 3).map((tag, index) => (
              <span key={index} style={{
                background: '#333',
                color: '#ccc',
                padding: '0.25rem 0.5rem',
                borderRadius: 12,
                fontSize: '0.7rem',
                fontWeight: 500
              }}>
                #{tag}
              </span>
            ))}
            {design.tags.length > 3 && (
              <span style={{
                color: '#888',
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem'
              }}>
                +{design.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #333'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleLike}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: isLiked ? '#ff6b6b' : '#ccc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'color 0.2s ease'
              }}
            >
              {isLiked ? '❤️' : '🤍'} {likesCount}
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: isSaved ? '#4ecdc4' : '#ccc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'color 0.2s ease'
              }}
            >
              {isSaved ? '💾' : '🔖'} {savesCount}
            </button>

            <button
              onClick={handleShare}
              style={{
                background: 'none',
                border: 'none',
                color: '#ccc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'color 0.2s ease'
              }}
            >
              📤 {sharesCount}
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.8rem',
            color: '#888'
          }}>
            👁️ {design.views || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDesignCard;