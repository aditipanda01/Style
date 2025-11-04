import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

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

  // -------------------- FILE HANDLERS --------------------
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

    const oversized = validFiles.some(file => file.size > 5 * 1024 * 1024);
    if (oversized) {
      setError('Each file must be under 5MB');
      return;
    }

    setSelectedFiles(validFiles);
    setPreviewUrls(validFiles.map(file => file.type.startsWith('image/') ? URL.createObjectURL(file) : null));
    setError('');
  };

  const handleDesignerPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return setError('Designer photo must be an image');
    if (file.size > 5 * 1024 * 1024) return setError('Designer photo must be under 5MB');

    setDesignerPhoto(file);
    setDesignerPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  // -------------------- INPUT HANDLER --------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // -------------------- CLOUDINARY UPLOAD --------------------
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'RunwayDesigns');
    data.append('folder', 'Runway');

    const res = await fetch(`https://api.cloudinary.com/v1_1/dp6rkyhgn/auto/upload`, {
      method: 'POST',
      body: data,
    });

    if (!res.ok) throw new Error('Cloudinary upload failed');
    const uploaded = await res.json();
    return {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      resourceType: uploaded.resource_type
    };
  };

  // -------------------- SUBMIT HANDLER --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!formData.title.trim()) return setError("Title is required");
    if (selectedFiles.length === 0) return setError("Please select at least one design file");
    if (!designerPhoto) return setError("Please upload your designer photo");
    if (!formData.inspiration.trim()) return setError("Inspiration/Tags are required");

    setUploading(true);
    setError('');

    try {
      // 🔹 Upload designer photo
      console.log("📸 Uploading designer photo...");
      const designerPhotoData = await uploadToCloudinary(designerPhoto);

      // 🔹 Upload all design files
      console.log("🎨 Uploading design files...");
      const uploadedFiles = await Promise.all(selectedFiles.map(file => uploadToCloudinary(file)));

      const token = localStorage.getItem('token');
      if (!token) throw new Error("You must be logged in to submit designs");

      // ✅ Prepare submission payload (correct schema)
      const submissionData = {
        userId: user?._id, // REQUIRED by backend
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        category: formData.category,
        inspiration: formData.inspiration.trim(),
        tags: formData.inspiration.split(",").map(tag => tag.trim()).filter(Boolean),
        isPublic: true,
        isAvailableForCollab: false,
        designerPhoto: {
          url: designerPhotoData.url,
          publicId: designerPhotoData.publicId,
        },
        images: uploadedFiles.map((file, i) => ({
          url: file.url,
          publicId: file.publicId,
          isPrimary: i === 0,
          resourceType: file.resourceType || "image",
        })),
      };

      console.log("📦 Final submission data:", submissionData);

      // 🔹 Send POST request
      const res = await fetch(API_ENDPOINTS.DESIGNS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      console.log("📨 Server response:", data);

      if (!res.ok) throw new Error(data.error?.message || "Failed to submit design");

      alert("🎉 Design submitted successfully!");
      if (onSuccess) onSuccess(data.data);
      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Submission error:", err);
      setError(err.message || "Failed to submit design. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', overflowY: 'auto'
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '2rem',
        maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#181818', margin: 0 }}>Submit Your Design</h2>
          <button onClick={onClose} disabled={uploading} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: uploading ? 'not-allowed' : 'pointer', color: '#666' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* --- Designer Photo Upload --- */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Your Designer Photo *</label>
            <div style={{
              border: '2px dashed #ddd', borderRadius: 8, padding: '1.5rem',
              textAlign: 'center', background: '#f9f9f9', cursor: 'pointer'
            }}>
              <input type="file" accept="image/*" onChange={handleDesignerPhotoChange} style={{ display: 'none' }} id="designer-photo-upload" />
              <label htmlFor="designer-photo-upload" style={{ cursor: 'pointer', display: 'block' }}>
                {designerPhotoPreview ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: 120, height: 120, borderRadius: '50%', overflow: 'hidden',
                      border: '2px solid #181818'
                    }}>
                      <img src={designerPhotoPreview} alt="Designer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#28a745', fontWeight: 600 }}>✓ Photo uploaded</div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>Upload Your Photo</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>This will appear with your design</div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* --- Title, Category, Files, Inspiration, Description --- */}
          {/* (unchanged UI from your original code) */}

          {/* Error Message */}
          {error && (
            <div style={{
              color: '#dc3545', marginBottom: '1rem',
              padding: '0.75rem', background: '#f8d7da',
              border: '1px solid #f5c6cb', borderRadius: 4, fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={onClose} disabled={uploading} style={{
              flex: 1, padding: '0.75rem', borderRadius: 8,
              border: '2px solid #ddd', background: '#fff',
              color: '#181818', fontWeight: 600, fontSize: '1rem',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}>Cancel</button>
            <button type="submit" disabled={uploading} style={{
              flex: 1, padding: '0.75rem', borderRadius: 8,
              border: 'none', background: uploading ? '#ccc' : '#28a745',
              color: '#fff', fontWeight: 600, fontSize: '1rem',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}>
              {uploading ? 'Uploading...' : 'Submit Design'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DesignSubmissionForm;
