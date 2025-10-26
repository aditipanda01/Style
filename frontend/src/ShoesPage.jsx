import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bgshoes from "./assets/bgshoes.jpeg";
import shoesbg2 from "./assets/shoesbg2.jpg";
import shoesbg3 from "./assets/shoesbg3.jpg";
import shoesbg5 from "./assets/shoesbg5.jpeg";

const sliderImages = [shoesbg2, shoesbg3, shoesbg5];

function ShoesAllureBanner() {
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
      <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: 12, zIndex: 1, marginBottom: 8, color: '#fff' }}>
        Witty & Catchy
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
          color: '#fff',
        }}
      >
        "Good shoes take you places. Great ones take you further."
      </div>
    </div>
  );
}

function DesignerInspirationCard({ design }) {
  const primaryImage = design.images?.find(img => img.isPrimary) || design.images?.[0];
  const designerPhoto = design.designerPhoto;

  return (
    <div style={{
      background: '#8c8c8c',
      borderRadius: 5,
      boxShadow: '0 6px 24px #0001',
      width: 540,
      padding: 32,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      fontFamily: 'Montserrat, Arial, sans-serif',
      position: 'relative',
      margin: 24
    }}>
      <div style={{
        width: 200,
        height: 400,
        borderRadius: 5,
        background: '#e5e1da',
        border: '2px solid #cfc9be',
        overflow: 'hidden',
        position: 'relative',
        marginRight: 32,
        flexShrink: 0
      }}>
        {primaryImage && <img src={primaryImage.url} alt="Shoes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 10,
          background: '#d6d2c8',
          borderRadius: 5
        }} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 36,
          fontWeight: 500,
          color: '#222',
          marginBottom: 18
        }}>
          {design.user?.username || `${design.user?.firstName} ${design.user?.lastName}`}
        </div>

        <div style={{
          background: 'rgba(237, 231, 223, 0.5)',
          borderRadius: 5,
          padding: '18px 18px 18px 140px',
          position: 'relative',
          minHeight: 140,
          marginBottom: 12,
          boxShadow: '0 2px 8px #0001',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: 14,
            top: 18,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(237, 231, 223, 0.5)',
          }}>
            {designerPhoto && (
              <img
                src={designerPhoto.url}
                alt="Designer"
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #fff',
                  boxShadow: '0 1px 4px #0002',
                  background: '#fff',
                }}
              />
            )}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginLeft: 24,
          }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <span style={{ color: '#222', fontSize: 32, fontWeight: 700 }}>♡</span>
              <span style={{ color: '#222', fontSize: 32 }}>🗨️</span>
              <span style={{ color: '#222', fontSize: 32 }}>🔗</span>
            </div>
            <div style={{ fontSize: 15, color: '#222', fontWeight: 400, textAlign: 'left', width: '100%' }}>
              {design.inspiration || design.description || design.tags?.join(', ') || 'Stunning footwear design'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ShoesPage = () => {
  const [current, setCurrent] = useState(0);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShoesDesigns();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchShoesDesigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/designs?category=shoes&limit=100&sortBy=createdAt&sortOrder=desc');
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Fetched shoes designs:', data.data.designs.length);
        setDesigns(data.data.designs);
      }
    } catch (error) {
      console.error('❌ Failed to fetch shoes designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const prevSlide = () => setCurrent((current - 1 + sliderImages.length) % sliderImages.length);
  const nextSlide = () => setCurrent((current + 1) % sliderImages.length);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', position: 'relative', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ background: '#d3d3d3', width: '100vw', height: '60vh', minHeight: '60vh', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 80 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 2, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: 900, maxWidth: '90vw', margin: '0 auto', top: 70, position: 'relative' }}>
            <ShoesAllureBanner />
          </div>
        </div>
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#d3d3d3', borderRadius: 12, boxShadow: '0 2px 12px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={sliderImages[current]} alt="Shoe Slide" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, transition: 'all 0.4s cubic-bezier(.4,2,.6,1)' }} />
          <button onClick={prevSlide} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, boxShadow: '0 2px 8px #0002', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&lt;</button>
          <button onClick={nextSlide} style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, boxShadow: '0 2px 8px #0002', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&gt;</button>
        </div>
      </div>

      <div style={{ position: 'absolute', left: '50%', top: '70vh', transform: 'translate(-50%, -50%)', width: 320, height: 320, borderRadius: '50%', background: '#fff', boxShadow: '0 8px 32px #0004', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '8px solid #d3d3d3', zIndex: 2 }}>
        <img src={bgshoes} alt="Shoe Feature" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40, justifyItems: 'center', width: '100%', marginTop: 120, marginBottom: 80 }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, color: '#fff', fontSize: '1.2rem' }}>
            Loading shoes designs...
          </div>
        ) : designs.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, color: '#fff', fontSize: '1.2rem', flexDirection: 'column', gap: '1rem' }}>
            <div>No shoe designs found yet.</div>
            <Link to="/profile" style={{ color: '#007bff', textDecoration: 'none' }}>
              Submit the first shoe design!
            </Link>
          </div>
        ) : (
          designs.map((design) => (
            <DesignerInspirationCard key={design._id} design={design} />
          ))
        )}
      </div>

      <footer style={{ width: '100%', background: '#222', color: '#fff', textAlign: 'center', padding: '32px 0 20px 0', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 16, letterSpacing: 1, marginTop: 40 }}>
        &copy; {new Date().getFullYear()} Designer Gallery. All rights reserved.
      </footer>
    </div>
  );
};

export default ShoesPage;