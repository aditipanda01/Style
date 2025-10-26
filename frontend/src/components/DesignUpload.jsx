import React, { useState, useCallback } from 'react';

const DesignUpload = ({ onClose, onSuccess }) => {
  const [designData, setDesignData] = useState({
    title: '',
    description: '',
    category: 'dress',
    tags: [],
    isPublic: true,
    isAvailableForCollab: false
  });
  const [images, setImages] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0
    }));

    setImages(prev => [...prev, ...newImages]);
    setError('');
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (newImages.length > 0 && prev[index].isPrimary) {
        newImages[0].isPrimary = true;
      }
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].preview);
      return newImages;
    });
  };

  const setPrimaryImage = (index) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !designData.tags.includes(trimmedTag)) {
      setDesignData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setDesignData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!designData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (images.length === 0) {
      setError('At least one image is required');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload images to Cloudinary first
      const uploadedImages = [];
      
      for (const img of images) {
        const formData = new FormData();
        formData.append('file', img.file);
        formData.append('upload_preset', 'runway_designs'); // You'll need to create this in Cloudinary
        
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { 
            method: 'POST', 
            body: formData 
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error('Image upload failed');
        }
        
        const cloudinaryData = await cloudinaryResponse.json();
        uploadedImages.push({
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          isPrimary: img.isPrimary
        });
      }

      // Create design with uploaded images
      const token = localStorage.getItem('token');
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...designData,
          title: designData.title.trim(),
          description: designData.description.trim(),
          images: uploadedImages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to create design');
      }

      console.log('✅ Design uploaded successfully!');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#181818', margin: 0 }}>Upload New Design</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>×</button>
        </div>

        {/* Image Upload Area */}
        <div style={{ border: '2px dashed #ddd', borderRadius: 8, padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', background: '#f9f9f9', cursor: 'pointer' }}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#181818' }}>
              Click to Upload Images
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              Maximum 5 images, 5MB each (JPG, PNG, WEBP)
            </div>
          </label>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {images.map((img, index) => (
              <div key={index} style={{ position: 'relative', paddingTop: '100%', borderRadius: 8, overflow: 'hidden', border: img.isPrimary ? '3px solid #28a745' : '1px solid #ddd' }}>
                <img src={img.preview} alt={`Preview ${index + 1}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: '4px', flexDirection: 'column' }}>
                  {!img.isPrimary && (
                    <button onClick={() => setPrimaryImage(index)} style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }}>
                      Set Primary
                    </button>
                  )}
                  <button onClick={() => removeImage(index)} style={{ background: 'rgba(220,53,69,0.9)', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
                {img.isPrimary && (
                  <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(40,167,69,0.9)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600 }}>
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <input
          type="text"
          placeholder="Design Title *"
          value={designData.title}
          onChange={(e) => setDesignData(prev => ({ ...prev, title: e.target.value }))}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
        />

        {/* Category */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#181818' }}>Category *</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['dress', 'jewellery', 'shoes'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setDesignData(prev => ({ ...prev, category: cat }))}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  border: designData.category === cat ? '2px solid #181818' : '2px solid #ddd',
                  background: designData.category === cat ? '#181818' : '#fff',
                  color: designData.category === cat ? '#fff' : '#181818',
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

        {/* Description */}
        <textarea
          placeholder="Description (optional)"
          value={designData.description}
          onChange={(e) => setDesignData(prev => ({ ...prev, description: e.target.value }))}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: 8, border: '2px solid #ddd', fontSize: '1rem', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box' }}
        />

        {/* Tags */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#181818' }}>Tags</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              style={{ flex: 1, padding: '0.5rem', borderRadius: 6, border: '2px solid #ddd', fontSize: '0.9rem' }}
            />
            <button type="button" onClick={addTag} style={{ padding: '0.5rem 1rem', borderRadius: 6, border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {designData.tags.map(tag => (
              <span key={tag} style={{ background: '#f0f0f0', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: 0, color: '#666' }}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Options */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={designData.isPublic}
              onChange={(e) => setDesignData(prev => ({ ...prev, isPublic: e.target.checked }))}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <span style={{ color: '#181818' }}>Make design public</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={designData.isAvailableForCollab}
              onChange={(e) => setDesignData(prev => ({ ...prev, isAvailableForCollab: e.target.checked }))}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <span style={{ color: '#181818' }}>Available for collaboration</span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ color: '#dc3545', marginBottom: '1rem', padding: '0.75rem', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 4, fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '2px solid #ddd', background: '#fff', color: '#181818', fontWeight: 600, fontSize: '1rem', cursor: uploading ? 'not-allowed' : 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading}
            style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: 'none', background: uploading ? '#ccc' : '#28a745', color: '#fff', fontWeight: 600, fontSize: '1rem', cursor: uploading ? 'not-allowed' : 'pointer' }}
          >
            {uploading ? 'Uploading...' : 'Publish Design'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignUpload;