import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const IndividualDashboard = () => {
  const { user, refreshProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [myDesigns, setMyDesigns] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user profile with stats
      const profileResponse = await axios.get('/users/profile');
      const userData = profileResponse.data.data;
      setStats(userData.stats);

      // Load collaboration requests
      const collaborationsResponse = await axios.get('/collaborations?type=received&status=pending&limit=5');
      setCollaborationRequests(collaborationsResponse.data.data.collaborations);

      // Load user's designs
      const designsResponse = await axios.get(`/designs?userId=${user._id}&limit=6`);
      setMyDesigns(designsResponse.data.data.designs);

      // Load notifications
      const notificationsResponse = await axios.get('/notifications?limit=5');
      setNotifications(notificationsResponse.data.data.notifications);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCollaborationResponse = async (collaborationId, action, message = '') => {
    try {
      await axios.put(`/collaborations/${collaborationId}/respond`, {
        action,
        message
      });
      
      toast.success(`Collaboration request ${action}ed successfully`);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to respond to collaboration:', error);
      toast.error('Failed to respond to collaboration request');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#181818', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: '#fff', fontSize: '1.2rem' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#181818', 
      color: '#fff', 
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{ 
        background: '#232323', 
        borderRadius: 12, 
        padding: '2rem', 
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          background: user.profilePicture ? `url(${user.profilePicture})` : '#444',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}>
          {!user.profilePicture && '👤'}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '0.5rem',
            fontFamily: "'Cormorant Garamond', serif"
          }}>
            {user.firstName} {user.lastName}
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#ccc', 
            marginBottom: '0.5rem' 
          }}>
            @{user.username} • Fashion Designer
          </p>
          <p style={{ 
            fontSize: '1rem', 
            color: '#aaa' 
          }}>
            📍 {user.location || 'Location not set'} • ✨ {stats?.followersCount || 0} followers
          </p>
          {user.bio && (
            <p style={{ 
              fontSize: '1rem', 
              color: '#ddd', 
              marginTop: '1rem',
              fontStyle: 'italic'
            }}>
              "{user.bio}"
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          background: '#232323', 
          borderRadius: 8, 
          padding: '1.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
            {stats?.designsCount || 0}
          </div>
          <div style={{ color: '#ccc' }}>Designs Posted</div>
        </div>
        <div style={{ 
          background: '#232323', 
          borderRadius: 8, 
          padding: '1.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ff6b6b' }}>
            {stats?.totalLikes || 0}
          </div>
          <div style={{ color: '#ccc' }}>Total Likes</div>
        </div>
        <div style={{ 
          background: '#232323', 
          borderRadius: 8, 
          padding: '1.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4ecdc4' }}>
            {stats?.totalSaves || 0}
          </div>
          <div style={{ color: '#ccc' }}>Saves</div>
        </div>
        <div style={{ 
          background: '#232323', 
          borderRadius: 8, 
          padding: '1.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#45b7d1' }}>
            {stats?.totalShares || 0}
          </div>
          <div style={{ color: '#ccc' }}>Shares</div>
        </div>
        <div style={{ 
          background: '#232323', 
          borderRadius: 8, 
          padding: '1.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f9ca24' }}>
            {stats?.collaborationsCount || 0}
          </div>
          <div style={{ color: '#ccc' }}>Collaborations</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Recent Activity */}
        <div style={{ 
          background: '#232323', 
          borderRadius: 12, 
          padding: '1.5rem' 
        }}>
          <h3 style={{ 
            fontSize: '1.3rem', 
            marginBottom: '1rem',
            color: '#fff'
          }}>
            Recent Activity
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '1.5rem' }}>
                    {notification.type === 'design_liked' && '💖'}
                    {notification.type === 'collaboration_request' && '🤝'}
                    {notification.type === 'new_follower' && '👥'}
                    {notification.type === 'design_saved' && '💾'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {notification.title}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                      {notification.message}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
                      {notification.timeAgo}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                padding: '2rem' 
              }}>
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Collaboration Requests */}
        <div style={{ 
          background: '#232323', 
          borderRadius: 12, 
          padding: '1.5rem' 
        }}>
          <h3 style={{ 
            fontSize: '1.3rem', 
            marginBottom: '1rem',
            color: '#fff'
          }}>
            Collaboration Requests
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {collaborationRequests.length > 0 ? (
              collaborationRequests.map((collaboration) => (
                <div key={collaboration._id} style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #333',
                  marginBottom: '1rem'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      background: collaboration.companyId.companyLogo ? `url(${collaboration.companyId.companyLogo})` : '#444',
                      backgroundSize: 'cover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {!collaboration.companyId.companyLogo && '🏢'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>
                        {collaboration.companyId.companyName}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                        "{collaboration.designId.title}"
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#ddd', 
                    marginBottom: '1rem' 
                  }}>
                    {collaboration.message}
                  </div>
                  {collaboration.proposedTerms && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#aaa', 
                      marginBottom: '1rem' 
                    }}>
                      Budget: ${collaboration.proposedTerms.budget} • Timeline: {collaboration.proposedTerms.timeline}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleCollaborationResponse(collaboration._id, 'accept', 'Thank you for the opportunity! I\'m excited to work together.')}
                      style={{
                        background: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleCollaborationResponse(collaboration._id, 'decline', 'Thank you for your interest, but I\'m not available at this time.')}
                      style={{
                        background: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                padding: '2rem' 
              }}>
                No pending collaboration requests
              </div>
            )}
          </div>
        </div>
      </div>

      {/* My Designs */}
      <div style={{ 
        background: '#232323', 
        borderRadius: 12, 
        padding: '1.5rem' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ 
            fontSize: '1.3rem', 
            color: '#fff',
            margin: 0
          }}>
            My Designs
          </h3>
          <button style={{
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}>
            + Upload Design
          </button>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          {myDesigns.map((design) => (
            <div key={design._id} style={{ 
              background: '#333', 
              borderRadius: 8, 
              overflow: 'hidden',
              cursor: 'pointer'
            }}>
              <div style={{ 
                height: 200, 
                background: design.primaryImage ? `url(${design.primaryImage.url})` : '#444',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              <div style={{ padding: '1rem' }}>
                <div style={{ 
                  fontWeight: 600, 
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  {design.title}
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: '#ccc'
                }}>
                  <span>💖 {design.likesCount}</span>
                  <span>💾 {design.savesCount}</span>
                  <span>👁️ {design.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualDashboard;