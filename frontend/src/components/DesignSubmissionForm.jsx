import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DesignSubmissionForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'dress',
    inspiration: '',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [designerPhoto, setDesignerPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [designerPhotoPreview, setDesignerPhotoPreview] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      return isImage || isPdf;
    });

    if (validFiles.length !== files.length) {
      setError('Only images (JPG, PNG, WEBP) and PDF files are allowed');
      return;
    }

    const oversizedFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Each file must be under 5MB');
      return;
    }

    setSelectedFiles(validFiles);
    setError('');

    const previews = validFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null;
    });
    setPreviewUrls(previews);
  };

  const handleDesignerPhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Designer photo must be an image');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Designer photo must be under 5MB');
      return;
    }
    
    setDesignerPhoto(file);
    setDesignerPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'RunwayDesigns');
    formData.append('folder', 'Runway');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dp6rkyhgn/auto/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
        resourceType: data.resource_type
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title.trim()) return setError("Title is required");
  if (selectedFiles.length === 0) return setError("Please select at least one design file");
  if (!designerPhoto) return setError("Please upload your designer photo");
  if (!formData.inspiration.trim()) return setError("Inspiration/Tags are required");

  setUploading(true);
  setError("");

  try {
    const designerPhotoData = await uploadToCloudinary(designerPhoto);

    const uploadPromises = selectedFiles.map(file => uploadToCloudinary(file));
    const uploadedFiles = await Promise.all(uploadPromises);

    const token = localStorage.getItem("token");
    if (!token) throw new Error("You must be logged in to submit designs");

    const response = await fetch("http://localhost:5000/api/designs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tags: formData.inspiration.split(",").map(tag => tag.trim()).filter(Boolean),
        isPublic: true,
        isAvailableForCollab: false,
        images: uploadedFiles.map((file, index) => ({
          url: file.url,
          publicId: file.publicId,
          isPrimary: index === 0,
          resourceType: file.resourceType,
        })),
        inspiration: formData.inspiration.trim(),
        designerPhoto: {
          url: designerPhotoData.url,
          publicId: designerPhotoData.publicId,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "Failed to submit design");

    alert("Design submitted successfully! 🎉");
    if (onSuccess) onSuccess(data.data);
    if (onClose) onClose();
  } catch (err) {
    console.error("Submission error:", err);
    setError(err.message || "Failed to submit design. Please try again.");
  } finally {
    setUploading(false);
  }
};


  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '2rem',
        maxWidth: 600,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#181818',
            margin: 0
          }}>
            Submit Your Design
          </h2>
          <button
            onClick={onClose}
            disabled={uploading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: uploading ? 'not-allowed' : 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Designer Photo Upload */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#181818'
            }}>
              Your Designer Photo *
            </label>
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: 8,
              padding: '1.5rem',
              textAlign: 'center',
              background: '#f9f9f9',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleDesignerPhotoChange}
                style={{ display: 'none' }}
                id="designer-photo-upload"
              />
              <label htmlFor="designer-photo-upload" style={{ cursor: 'pointer', display: 'block' }}>
                {designerPhotoPreview ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #181818'
                    }}>
                      <img src={designerPhotoPreview} alt="Designer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#28a745', fontWeight: 600 }}>
                      ✓ Photo uploaded
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem', color: '#181818' }}>
                      Upload Your Photo
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      This will appear with your design
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#181818'
            }}>
              Design Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter design title"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 8,
                border: '2px solid #ddd',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#181818'
            }}>
              Category *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['dress', 'jewellery', 'shoes'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: 8,
                    border: formData.category === cat ? '2px solid #181818' : '2px solid #ddd',
                    background: formData.category === cat ? '#181818' : '#fff',
                    color: formData.category === cat ? '#fff' : '#181818',
                    cursor: 'pointer',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#181818'
            }}>
              Design Files (Images/PDF) *
            </label>
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: 8,
              padding: '2rem',
              textAlign: 'center',
              background: '#f9f9f9',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem', color: '#181818' }}>
                  Click to Upload Files
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Images (JPG, PNG, WEBP) or PDF • Max 5MB each
                </div>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#181818' }}>
                  Selected Files ({selectedFiles.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedFiles.map((file, index) => (
                    <div key={index} style={{
                      padding: '0.5rem',
                      background: '#f0f0f0',
                      borderRadius: 4,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {file.type.startsWith('image/') ? '🖼️' : '📄'}
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewUrls.some(url => url !== null) && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.5rem',
                marginTop: '1rem'
              }}>
                {previewUrls.map((url, index) => url && (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Inspiration */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#181818'
            }}>
              Inspiration/Tags *
            </label>
            <input
              type="text"
              name="inspiration"
              value={formData.inspiration}
              onChange={handleInputChange}
              placeholder="e.g., bohemian, summer, sustainable (comma-separated)"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 8,
                border: '2px solid #ddd',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#181818'
            }}>
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your design..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 8,
                border: '2px solid #ddd',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#dc3545',
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: 4,
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: 8,
                border: '2px solid #ddd',
                background: '#fff',
                color: '#181818',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: 8,
                border: 'none',
                background: uploading ? '#ccc' : '#28a745',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? 'Uploading...' : 'Submit Design'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DesignSubmissionForm;