import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [discoverDesigns, setDiscoverDesigns] = useState([]);
  const [activeCollaborations, setActiveCollaborations] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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

      // Load designs available for collaboration
      const designsResponse = await axios.get('/designs?limit=12&sortBy=createdAt&sortOrder=desc');
      const availableDesigns = designsResponse.data.data.designs.filter(design => 
        design.isAvailableForCollab && design.userId._id !== user._id
      );
      setDiscoverDesigns(availableDesigns);

      // Load active collaborations
      const activeCollabsResponse = await axios.get('/collaborations?type=sent&status=accepted&limit=5');
      setActiveCollaborations(activeCollabsResponse.data.data.collaborations);

      // Load sent requests
      const sentRequestsResponse = await axios.get('/collaborations?type=sent&status=pending&limit=5');
      setSentRequests(sentRequestsResponse.data.data.collaborations);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCollaborationRequest = async (designId, designTitle, designerName) => {
    const message = `Hi ${designerName}! We love your design "${designTitle}" and would like to explore a collaboration opportunity. We believe your creative vision aligns perfectly with our brand values. Let's discuss how we can work together!`;
    
    try {
      await axios.post('/collaborations', {
        designId,
        message,
        proposedTerms: {
          budget: 3000,
          timeline: '3-4 weeks',
          deliverables: [
            'Design sketches and concepts',
            'Technical specifications',
            '3D mockups and renderings',
            'Material recommendations'
          ],
          additionalNotes: 'We are looking for sustainable and innovative design solutions.'
        }
      });
      
      toast.success('Collaboration request sent successfully!');
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to send collaboration request:', error);
      toast.error('Failed to send collaboration request');
    }
  };

  const searchDesigns = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('limit', '12');
      
      const response = await axios.get(`/designs?${params.toString()}`);
      const availableDesigns = response.data.data.designs.filter(design => 
        design.isAvailableForCollab && design.userId._id !== user._id
      );
      setDiscoverDesigns(availableDesigns);
    } catch (error) {
      console.error('Failed to search designs:', error);
      toast.error('Failed to search designs');
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
          background: user.companyLogo ? `url(${user.companyLogo})` : '#444',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}>
          {!user.companyLogo && '🏢'}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '0.5rem',
            fontFamily: "'Cormorant Garamond', serif"
          }}>
            {user.companyName}
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#ccc', 
            marginBottom: '0.5rem' 
          }}>
            Est. {user.establishedYear || 'N/A'} • Premium Fashion Brand
          </p>
          <p style={{ 
            fontSize: '1rem', 
            color: '#aaa' 
          }}>
            📍 {user.companyAddress?.city}, {user.companyAddress?.country} • 🌐 {user.website || 'No website'}
          </p>
          {user.companyDescription && (
            <p style={{ 
              fontSize: '1rem', 
              color: '#ddd', 
              marginTop: '1rem',
              fontStyle: 'italic'
            }}>
              "{user.companyDescription}"
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
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4ecdc4' }}>
            {sentRequests.length + activeCollaborations.length}
          </div>
          <div style={{ color: '#ccc' }}>Requests Sent</div>
        </div>
        <div style={{ 
          background: '#232323', 
          borderRadius: 8, 
          padding: '1.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f9ca24' }}>
            {activeCollaborations.length}
          </div>
          <div style={{ color: '#ccc' }}>Active Projects</div>
        </div>
        <div style={{ 
          background: '#232323', 
          borderRadius: 8, 
          padding: '1.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#45b7d1' }}>
            {stats?.completedCollaborationsCount || 0}
          </div>
          <div style={{ color: '#ccc' }}>Completed</div>
        </div>
        <div style={{ 
          background: '#232323', 
          borderRadius: 8, 
          padding: '1.5rem', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ff6b6b' }}>
            {discoverDesigns.length}
          </div>
          <div style={{ color: '#ccc' }}>Available Designs</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Discover Designs */}
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
              Discover Designs
            </h3>
          </div>

          {/* Search and Filter */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1.5rem' 
          }}>
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: 6,
                border: '1px solid #444',
                background: '#333',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.75rem',
                borderRadius: 6,
                border: '1px solid #444',
                background: '#333',
                color: '#fff',
                fontSize: '1rem'
              }}
            >
              <option value="">All Categories</option>
              <option value="dress">Dress</option>
              <option value="jewellery">Jewellery</option>
              <option value="shoes">Shoes</option>
            </select>
            <button
              onClick={searchDesigns}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: 6,
                border: 'none',
                background: '#007bff',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Search
            </button>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '1rem',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {discoverDesigns.map((design) => (
              <div key={design._id} style={{ 
                background: '#333', 
                borderRadius: 8, 
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <div style={{ 
                  height: 150, 
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
                    fontSize: '0.8rem',
                    color: '#ccc',
                    marginBottom: '0.5rem'
                  }}>
                    by {design.user.username || `${design.user.firstName} ${design.user.lastName}`}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: '#ccc',
                    marginBottom: '0.75rem'
                  }}>
                    <span>💖 {design.likesCount}</span>
                    <span>👁️ {design.views}</span>
                  </div>
                  <button
                    onClick={() => handleSendCollaborationRequest(
                      design._id, 
                      design.title, 
                      design.user.username || `${design.user.firstName} ${design.user.lastName}`
                    )}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: 4,
                      border: 'none',
                      background: '#28a745',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    🤝 Collaborate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Collaborations */}
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
            Active Collaborations
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {activeCollaborations.length > 0 ? (
              activeCollaborations.map((collaboration) => (
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
                      background: collaboration.designerId.profilePicture ? `url(${collaboration.designerId.profilePicture})` : '#444',
                      backgroundSize: 'cover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {!collaboration.designerId.profilePicture && '👤'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>
                        {collaboration.designerId.username || `${collaboration.designerId.firstName} ${collaboration.designerId.lastName}`}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                        "{collaboration.designId.title}"
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#aaa', 
                    marginBottom: '0.5rem' 
                  }}>
                    Status: In Progress • Started {new Date(collaboration.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{
                      background: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}>
                      💬 Chat
                    </button>
                    <button style={{
                      background: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}>
                      📋 Details
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
                No active collaborations
              </div>
            )}
          </div>

          <h3 style={{ 
            fontSize: '1.3rem', 
            marginTop: '2rem',
            marginBottom: '1rem',
            color: '#fff'
          }}>
            Pending Requests
          </h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {sentRequests.length > 0 ? (
              sentRequests.map((request) => (
                <div key={request._id} style={{ 
                  padding: '0.75rem', 
                  borderBottom: '1px solid #333',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {request.designerId.username || `${request.designerId.firstName} ${request.designerId.lastName}`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                    "{request.designId.title}"
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>
                    Sent {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                padding: '1rem' 
              }}>
                No pending requests
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;