import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import pic1 from './assets/pic1.jpeg';
import pic2 from './assets/pic2.png';
import pic3 from './assets/pic3.jpeg';
import blob from './assets/blob.svg';
import "../node_modules/slick-carousel/slick/slick.css";
import "../node_modules/slick-carousel/slick/slick-theme.css"; // if used

import Slider from "react-slick";

import fashionBg from './assets/fashion-bg.jpeg';
import jewe from './assets/jewe.jpeg';
import dress from './assets/dress.jpeg';
import shoes from './assets/shoes.jpeg';
import designer from './assets/designer.jpeg';
import i1 from './assets/i1.png';
import i2 from './assets/i2.png';
import i3 from './assets/i3.png';
import i4 from './assets/i4.png';
import logo1 from './assets/logo1.jpeg';
import logo2 from './assets/logo2.jpeg';
import logo3 from './assets/logo3.jpeg';
import logo4 from './assets/logo4.jpeg';
import logo5 from './assets/logo5.jpeg';
import logo6 from './assets/logo6.jpeg';
import logo7 from './assets/logo7.jpeg';
import dressFeature from './assets/dresslogo.jpeg';
import ball1 from './assets/ball1.jpeg';
import bg1 from './assets/bg1.jpeg';
import d1 from './assets/dress-photos/dress/d1.jpeg';
import d2 from './assets/dress-photos/dress/d2.jpeg';
import d3 from './assets/dress-photos/dress/d3.jpeg';
import d4 from './assets/dress-photos/dress/d4.jpeg';
import d5 from './assets/dress-photos/dress/d5.jpeg';
import d6 from './assets/dress-photos/dress/d6.jpeg';
import d7 from './assets/dress-photos/dress/d7.jpeg';
import d8 from './assets/dress-photos/dress/d8.jpeg';
import d9 from './assets/dress-photos/dress/d9.jpeg';
import d10 from './assets/dress-photos/dress/d10.jpeg';
import d11 from './assets/dress-photos/dress/d11.jpeg';
import d12 from './assets/dress-photos/dress/d12.jpeg';
import d13 from './assets/dress-photos/dress/d13.jpeg';
import d14 from './assets/dress-photos/dress/d14.jpeg';
import d15 from './assets/dress-photos/dress/d15.jpeg';
import d16 from './assets/dress-photos/dress/d16.jpeg';
import d17 from './assets/dress-photos/dress/d17.jpeg';
import d18 from './assets/dress-photos/dress/d18.jpeg';
import d19 from './assets/dress-photos/dress/d19.jpeg';
import d20 from './assets/dress-photos/dress/d20.jpeg';
import d21 from './assets/dress-photos/dress/d21.jpeg';
import d22 from './assets/dress-photos/dress/d22.jpeg';
import d23 from './assets/dress-photos/dress/d23.jpeg';
import d24 from './assets/dress-photos/dress/d24.jpeg';
import d25 from './assets/dress-photos/dress/d25.jpeg';
import d26 from './assets/dress-photos/dress/d26.jpeg';
import d27 from './assets/dress-photos/dress/d27.jpeg';
import d28 from './assets/dress-photos/dress/d28.jpeg';
import d29 from './assets/dress-photos/dress/d29.jpeg';
import d30 from './assets/dress-photos/dress/d30.jpeg';
import d31 from './assets/dress-photos/dress/d31.jpeg';
import d32 from './assets/dress-photos/dress/d32.jpeg';
import d33 from './assets/dress-photos/dress/d33.jpeg';
import d34 from './assets/dress-photos/dress/d34.jpeg';
import d35 from './assets/dress-photos/dress/d35.jpeg';
import d36 from './assets/dress-photos/dress/d36.jpeg';
import d37 from './assets/dress-photos/dress/d37.jpeg';
import d38 from './assets/dress-photos/dress/d38.jpeg';
import d39 from './assets/dress-photos/dress/d39.jpeg';
import d40 from './assets/dress-photos/dress/d40.jpeg';
import d41 from './assets/dress-photos/dress/d41.jpeg';
import d42 from './assets/dress-photos/dress/d42.jpeg';
import d43 from './assets/dress-photos/dress/d43.jpeg';
import d44 from './assets/dress-photos/dress/d44.jpeg';
import d45 from './assets/dress-photos/dress/d45.jpeg';
import d46 from './assets/dress-photos/dress/d46.jpeg';
import d47 from './assets/dress-photos/dress/d47.jpeg';
import d48 from './assets/dress-photos/dress/d48.jpeg';
import d49 from './assets/dress-photos/dress/d49.jpeg';
import d50 from './assets/dress-photos/dress/d50.jpeg';
import d51 from './assets/dress-photos/dress/d51.jpeg';
import d52 from './assets/dress-photos/dress/d52.jpeg';
import d53 from './assets/dress-photos/dress/d53.jpeg';
import slider1 from './assets/slider1.png';
import slider2 from './assets/slider2.png';
import slider3 from './assets/slider3.webp';
import slider4 from './assets/slider4.png';
import Blog from "./Blog";

import a1 from './assets/a1.jpeg';
import a2 from './assets/a2.jpeg';
import a3 from './assets/a3.jpeg';
import a4 from './assets/a4.jpeg';
import a5 from './assets/a5.jpeg';
import a6 from './assets/a6.jpeg';
import a7 from './assets/a7.jpeg';
import a8 from './assets/a8.jpeg';
import a9 from './assets/a9.jpeg';
import ShoesPage from "./ShoesPage";
import JewelleryPage from "./Jewellery";
import Profile from './Profile';
import LoginSignup from './LoginSignup';
import { useState } from "react";
import DesignSubmissionForm from './components/DesignSubmissionForm';
import { useAuth } from './contexts/AuthContext';




function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header style={{
      width: '100%',
      background: '#ede7df',
      color: '#181818',
      display: 'flex',
      marginLeft: -100,
      gap: 100,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '2.5rem 2vw 1.5rem 2vw',
      fontFamily: 'Montserrat, Arial, sans-serif',
      letterSpacing: 2
    }}>
      <div
        style={{
          fontFamily: "'Bebas Neue', Arial, sans-serif",
          fontWeight: 700,
          fontSize: '2.2rem',
          letterSpacing: 2,
          marginLeft: 200,
          marginRight: 0
        }}
      >
        THE RUNWAY
      </div>

      <nav style={{
        display: 'flex',
        gap: 12,
        fontWeight: 600,
        fontSize: '1.1rem',
        textTransform: 'uppercase'
      }}>
        <Link to="/" style={{ color: '#181818', textDecoration: 'none' }}>Home</Link>
        <Link to="/blog" style={{ color: '#181818', textDecoration: 'none' }}>Blog</Link>
        {isAuthenticated ? (
          <Link to="/profile" style={{ color: '#181818', textDecoration: 'none' }}>
            {user?.name || 'Profile'}
          </Link>
        ) : (
          <Link to="/login-signup" style={{ color: '#181818', textDecoration: 'none' }}>
            Login/Signup
          </Link>
        )}
      </nav>
    </header>
  );
}
function Hero() {
  return (
    <section
      style={{
        width: '100vw',
        background: '#ede7df',
        height: 350, // <-- Fixed height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 0
      }}
    >
      {/* Top grid: Pic 1 (with Pic 3 overlapping) | SKETCH TO STYLE | Pic 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', width: '100%', maxWidth: 1200, margin: '0 auto', alignItems: 'center', gap: 32, marginTop: 0 }}>
        {/* Pic 1 with Pic 3 overlapping */}
        <div style={{ position: 'relative', width: 300, height: 350, display: 'flex', justifyContent: 'flex-start' }}>
          {/* Pic 1 */}
          <img
            src={pic1}
            alt="Pic 1"
            style={{
              width: 300,
              height: 450,
              marginTop:50,
              objectFit: 'cover',
              borderRadius: 10,
              boxShadow: '0 4px 24px #0002',
              filter: 'grayscale(100%)',
              background: '#fff',
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 1
            }}
          />
          {/* Pic 3 overlapping Pic 1, starting from Pic 1's mid */}
          <img
            src={pic3}
            alt="Pic 3"
            style={{
              width: 220,
              height: 280,
              objectFit: 'cover',
              borderRadius: 10,
              boxShadow: '0 2px 12px #0002',
              filter: 'grayscale(100%)',
              background: '#181818',
              position: 'absolute',
              left: '120%',
              top: '77%',
              transform: 'translateX(-50%)',
              zIndex: 2
            }}
          />
        </div>
        {/* Center: SKETCH TO STYLE */}
        <div style={{ textAlign: 'center', position: 'relative', minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className="great-vibes-regular"
            style={{
              fontSize: '8.5rem',
              color: '#b89c7d',
              fontWeight: 700,
              letterSpacing: 2,
              lineHeight: 1,
              marginBottom: 0,
              marginLeft: -40 // Try -40, -60, etc. for more overlap
            }}
          >
            Sketch
          </div>
          <div
            style={{
              fontWeight: 900,
              fontSize: '2.2rem',
              letterSpacing: 1,
              color: '#181818',
              marginTop: 0,
              
              lineHeight: 1,
              marginBottom: 8,
              fontFamily: 'Montserrat, Arial, sans-serif' // or omit for default
            }}
          >
            TO
          </div>
          <div className="great-vibes-regular" style={{ fontWeight: 900, fontSize: '5.1rem', letterSpacing: 1, color: '#181818', marginTop: 24, lineHeight: 1, marginBottom: 0 }}>
            Style
          </div>
        </div>
        {/* Pic 2 with blob layer (restored to right column) */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', alignItems: 'center' }}>
          {/* Blob layer as image */}
          <img src={blob} alt="Blob" style={{ position: 'absolute', left: '50%', top: '50%', width: 550, height: 600, transform: 'translate(-50%, -50%)', zIndex: 1, opacity: 1, pointerEvents: 'none' }} />
          {/* Pic 2 */}
          <img src={pic2} alt="Pic 2" style={{ width: 300, height: 450, objectFit: 'cover', filter: 'grayscale(100%)', position: 'relative', zIndex: 2 }} />
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  return (
    <section
      style={{
        width: '100%',
        background: '#000',
        color: '#fff',
        textAlign: 'center',
        padding: '0 0 2rem 0',
        marginTop: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="quote-section">
        <div
          className="main-quote"
          style={{
            fontFamily: "'Bebas Neue', Arial, sans-serif",
            fontWeight: 'bold',
            fontSize: '4.5rem',
            whiteSpace: 'nowrap',
            marginBottom: '1rem',
            overflowX: 'auto',
            textOverflow: 'ellipsis',
            maxWidth: '100vw',
            display: 'block'
          }}
        >
          Your style. Your stage. Their choice.
        </div>

        <div
          className="great-vibes-regular"
          style={{
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            color: '#fff',
            textAlign: 'center',
            maxWidth: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Every sketch begins with passion.<br />
          Here, raw ideas meet real voices — where<br />
          designers rise, and talent gets the chance to shine.
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={() => setShowSubmitForm(true)}
        style={{
          background: '#444',
          color: '#fff',
          border: 'none',
          borderRadius: 30,
          padding: '14px 36px',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: 1,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0004',
          textTransform: 'uppercase'
        }}
      >
        Submit a Design
      </button>

      {/* Modal */}
      {showSubmitForm && (
        <DesignSubmissionForm
          onClose={() => setShowSubmitForm(false)}
          onSuccess={() => {
            // Optional: reload or refresh designs if needed
            console.log("Design submitted successfully!");
          }}
        />
      )}
    </section>
  );
}

// PhoneFrame component for category images
function PhoneFrame({ img, alt }) {
  return (
    <div style={{
      background: '#181818', // black
      borderRadius: '20px',
      border: '1px solid #e0ded9',
      width: 260,
      height: 400,
      boxShadow: '0 8px 32px #0003',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      margin: '0 auto',
      overflow: 'hidden',
    }}>
      {/* Notch */}
      <div style={{
        width: 36,
        height: 7,
        background: '#d1d0cb',
        borderRadius: 5,
        position: 'absolute',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
      }} />
      {/* Image inside phone - fill most of the phone */}
      <div style={{
        width: '92%',
        height: '87%',
        background: '#222', // darker background for image area
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 24,
        marginBottom: 0,
        boxShadow: '0 2px 8px #0002',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img src={img} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
}

function CategoriesSection() {
  // Use local images for carousel
  const categories = [
    { name: 'Jewellery', img: jewe },
    { name: 'Dress', img: dress },
    { name: 'Shoes', img: shoes },
  ];
  const settings = {
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    arrows: true,
    infinite: true,
    focusOnSelect: true,
  };
  // Background image URL (user-provided)
  const bgImg = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'; // Replace with your uploaded image path if local
  return (
    <section style={{ width: '100%', background: '#000', color: '#fff', textAlign: 'center', padding: '3rem 0 2rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background image with opacity */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        backgroundImage: `url(${fashionBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: "'Bebas Neue', Arial, sans-serif", fontWeight: 900, fontSize: '2.8rem', marginBottom: 32, letterSpacing: 2 }}>
          Categories
        </div>
        <Slider {...settings}>
          {categories.map(cat => (
            <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {cat.name === 'Dress' ? (
                <Link to="/dress" style={{ textDecoration: 'none' }}>
                  <PhoneFrame img={cat.img} alt={cat.name} />
                </Link>
              ) : cat.name === 'Shoes' ? (
                <Link to="/shoes" style={{ textDecoration: 'none' }}>
                  <PhoneFrame img={cat.img} alt={cat.name} />
                </Link>
              ) : cat.name === 'Jewellery' ? (
                <Link to="/jewellery" style={{ textDecoration: 'none' }}>
                  <PhoneFrame img={cat.img} alt={cat.name} />
                </Link>
              ) : (
                <PhoneFrame img={cat.img} alt={cat.name} />
              )}
              <div style={{ textAlign: 'center', color: '#fff', marginTop: 18, fontWeight: 600, fontSize: '1.2rem', letterSpacing: 1 }}>{cat.name}</div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

function DesignerOfTheWeekSection() {
  return (
    <section style={{
      width: '100%',
      background: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '520px',
      padding: '4rem 0',
      gap: 64,
      maxWidth: 1400,
      margin: '0 auto',
    }}>
      {/* Text on the left */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        maxWidth: 520,
      }}>
        <div style={{ fontWeight: 1200, fontSize: '3.8rem', marginBottom: 24, letterSpacing: 2, textAlign: 'right', color: '#FFD600' }} className="great-vibes-regular">
          Designer of the Week
        </div>
        <div style={{ fontSize: '1.35rem', color: '#ccc', textAlign: 'right', lineHeight: 1.6 }}>
          Meet our featured designer of the month, whose vision and creativity are setting new trends in the world of fashion. Discover their story and signature style.
        </div>
      </div>
      {/* 2x2 Image grid on the right */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 16,
        maxWidth: 420,
        minWidth: 320,
        alignItems: 'center',
        justifyItems: 'center',
      }}>
        <img src={i1} alt="Designer" style={{ width: 200, height: 260, objectFit: 'cover', borderRadius: 0, background: '#fff' }} />
        <img src={i2} alt="Designer" style={{ width: 200, height: 260, objectFit: 'cover', borderRadius: 0, background: '#fff' }} />
        <img src={i3} alt="Designer" style={{ width: 200, height: 260, objectFit: 'cover', borderRadius: 0, background: '#fff', gridColumn: '1 / 2', gridRow: '2 / 3' }} />
        <img src={i4} alt="Designer" style={{ width: 200, height: 260, objectFit: 'cover', borderRadius: 0, background: '#fff', gridColumn: '2 / 3', gridRow: '2 / 3' }} />
      </div>
    </section>
  );
}

function PartneredCompaniesSection() {
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];
  return (
    <section style={{ width: '100%', background: '#000', color: '#fff', textAlign: 'center', padding: '3rem 0 2rem 0' }}>
      <div style={{ fontFamily: "'Bebas Neue', Arial, sans-serif", fontWeight: 900, fontSize: '2.8rem', letterSpacing: 2, marginBottom: 32 }}>
        Partnered Companies
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginBottom: 16 }}>
        {/* First row: 3 logos */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
          {logos.slice(0, 3).map((logo, i) => (
            <div key={i} style={{ width: 180, height: 180, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0003', overflow: 'hidden' }}>
              <img src={logo} alt={`Logo ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
        {/* Second row: 4 logos */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
          {logos.slice(3, 7).map((logo, i) => (
            <div key={i+3} style={{ width: 180, height: 180, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0003', overflow: 'hidden' }}>
              <img src={logo} alt={`Logo ${i+4}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer style={{ width: '100%', background: '#000', color: '#fff', textAlign: 'center', padding: '2rem 0 1rem 0', fontSize: '1rem', borderTop: '1px solid #222' }}>
      <div style={{ marginBottom: 8 }}>
        <a href="#" style={{ color: '#fff', marginRight: 16, textDecoration: 'none', fontWeight: 600 }}>Home</a>
        <a href="#" style={{ color: '#fff', marginRight: 16, textDecoration: 'none', fontWeight: 600 }}>Submit</a>
        <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Profile</a>
      </div>
      <div>© {new Date().getFullYear()} Designers Corner by Aditi. All rights reserved.</div>
    </footer>
  );
}

function Home() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <Header />
      <Hero />
      <QuoteSection />
      <CategoriesSection />
      {/* <DesignerSpotlightSection /> */}
      <DesignerOfTheWeekSection />
      <PartneredCompaniesSection />
      <FooterSection />
    </div>
  );
}

function SubmitDesign() { return null; }
function DesignDetail() { return null; }
function Login() { return null; }

// Dynamically import all JPEGs in the dress-photos/dress folder using Vite's import.meta.glob
const imageModules = import.meta.glob('./assets/dress-photos/dress/*.jpeg', { eager: true });
// Sort keys to ensure images are in filename order
const sortedKeys = Object.keys(imageModules).sort();
const dressImages = sortedKeys.map(key => imageModules[key].default);

// Dynamically import all JPEGs in the jewellery-photos/jewellery folder using Vite's import.meta.glob
const jewelleryImageModules = import.meta.glob('./assets/jewellery-photos/jewellery/*.jpeg', { eager: true });
const jewellerySortedKeys = Object.keys(jewelleryImageModules).sort();
const jewelleryImages = jewellerySortedKeys.map(key => jewelleryImageModules[key].default);

// DesignerInspirationCard component
function DesignerInspirationCard({ designerName, mainImage, avatarImage, inspirationText, instagramHandle }) {
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
      {/* Phone frame with main image */}
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
        <img src={mainImage} alt="Designer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* Notch */}
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
      {/* Right side: Designer name and box */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 36,
          fontWeight: 500,
          color: '#222',
          marginBottom: 18
        }}>
          {designerName}
        </div>
        {/* Box with image and inspiration */}
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
          {/* Avatar in a circle */}
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
            <img
              src={avatarImage}
              alt="Avatar"
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
          </div>
          {/* Emojis and inspiration text vertically aligned */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginLeft: 24,
          }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <span style={{ color: '#222', fontSize: 32, fontWeight: 700 }}>♡</span>
              <span style={{ color: '#222', fontSize: 32 }}>🗨️</span>
              <span style={{ color: '#222', fontSize: 32 }}>🔗</span>
            </div>
            <div style={{
              fontSize: 15,
              color: '#222',
              fontWeight: 400,
              textAlign: 'left',
            }}>
              {inspirationText}
            </div>
          </div>
        </div>
        {/* Instagram or info */}
        {instagramHandle && (
          <div style={{
            fontSize: 13,
            color: '#888',
            marginTop: 8
          }}>
            @{instagramHandle}
          </div>
        )}
      </div>
    </div>
  );
}

// Add a grid of DesignerInspirationCard for all images
function DesignerInspirationGrid({ images }) {
  const avatarImages = [a1, a2, a3, a4, a5, a6, a7, a8, a9];
  const designerData = [
    { name: 'Aanya Verma', quote: 'Jaipur bazaars. Leftover fabric. Street color alchemy. I turn scraps into statement silhouettes that prove sustainability can be loud and joyful.' },
    { name: 'Meher Kapoor', quote: 'Grandma’s heirloom saris meet clean, modern lines. I design nostalgia you can wear to boardrooms and brunch.' },
    { name: 'Liyana Sheikh', quote: 'Soft drapes, quiet power. Inspired by women who lead without volume. Modest fashion, modern edge.' },
    { name: 'Tara Mehta', quote: 'Bold pigments + architectural pleats. I paint feelings in fabric so you can wear your mood unapologetically.' },
    { name: 'Neha Bansal', quote: 'Wildflowers after monsoon. Pastels, threadwork, weightless layers. Clothes that bloom with you.' },
    { name: 'Ira D’Souza', quote: 'Street, skate, and gender-fluid ease. Designed for movement, music, and moments between rules.' },
    { name: 'Roshni Patel', quote: 'Kutch mirror work remixed for city nights. Folk craft, future shapes.' },
    { name: 'Zara Khan', quote: 'Urban grids, subway steel, evening breeze. Structured comfort for on-the-go lives.' },
    { name: 'Ishita Rao', quote: 'Ink sketches to digital prints. Tech meets textile in wearable art drops.' },
    { name: 'Freya Menon', quote: 'Kerala backwaters, coconut bark textures, ivory + green palettes. Slow resortwear with roots.' },
    { name: 'Simran Gill', quote: 'Punjab phulkari reimagined in power suits. Tradition stitched into ambition.' },
    { name: 'Devika Iyer', quote: 'Bharatanatyam costume geometry inspires pleated eveningwear that moves like rhythm.' },
    { name: 'Chhavi Deshpande', quote: 'Handwoven cotton from Vidarbha. Climate-kind layers that breathe and belong.' },
    { name: 'Mitali Shah', quote: 'Mid-century prints + Mumbai nostalgia. Retro without the costume.' },
    { name: 'Arpita Bose', quote: 'Durga Puja pandal textures, festival reds, celebratory volume. Seasonal joywear.' },
    { name: 'Saanvi Kulkarni', quote: 'Activewear fused with sari drape logic. Ath-ethnic for hybrid days.' },
    { name: 'Pia Thomas', quote: 'Coastal salt air + linen ease. Resort dresses built for repeat summers.' },
    { name: 'Rhea Oberoi', quote: 'Cocktail tailoring in jewel tones. Evening looks that actually have pockets.' },
    { name: 'Naina Bhattacharya', quote: 'Hand-painted story panels on fabric. Wearable graphic novels.' },
    { name: 'Suhani Chawla', quote: 'Monochrome minimalism, sharp seams, zero clutter. Let you be the color.' },
    { name: 'Gayatri Pillai', quote: 'Temple architecture lines carved into jacquard weaves. Sacred geometry, everyday wear.' },
    { name: 'Kavya Sood', quote: 'Upcycled denim patch mosaics. Every panel has a past life.' },
    { name: 'Jia Kamat', quote: 'Goa rave energy + eco mesh layers. Nightlife with a conscience.' },
    { name: 'Nusrath Ali', quote: 'Chikankari cloud textures on sheer overlays. Light as memory.' },
    { name: 'Vandana Reddy', quote: 'Ikat disrupts stripes. South Indian loom craft for global streetwear.' },
    { name: 'Elina Bhutani', quote: 'Corporate-to-casual convertibles: zip, flip, re-style. Clothes that work double shifts.' },
    { name: 'Mahira Ansari', quote: 'Desert dunes, wind-shaped silhouettes, neutral palettes. Serenity wear.' },
    { name: 'Trisha Lall', quote: 'Candy colors + cartoon embroidery. Fashion that doesn’t take itself too seriously.' },
    { name: 'Ritika Gaur', quote: 'Metallic foils over khadi. Party meets grassroots.' },
    { name: 'Anushka Jain', quote: 'Adaptive closures for seated bodies. Beauty includes accessibility.' },
    { name: 'Bhavna Chopra', quote: 'Sculpted pleats inspired by origami. Fold, unfold, transform.' },
    { name: 'Sana Pathan', quote: 'Poetry calligraphy turned into flowing print repeats. Wear your words.' },
    { name: 'Eesha Venkatesh', quote: 'Monsoon cloud grays, storm blues, quick-dry tech fabrics. Weather-ready style.' },
    { name: 'Krisha Dholakia', quote: 'Garba spin movement studied in 3D drape. Festival kinetic couture.' },
    { name: 'Aarohi Nand', quote: 'Hand-felted textures + raw hems. Imperfection as design language.' },
    { name: 'Leah Fernandes', quote: 'Surf culture + Catholic lace heritage. Chill edges, delicate cores.' },
    { name: 'Gargi Mishra', quote: 'Block prints mapped like constellations. Astrology for your wardrobe.' },
    { name: 'Nivedita Paul', quote: 'Zero-waste pattern puzzles. Every cut accounted for.' },
    { name: 'Shreya Bedi', quote: 'Metal hardware + soft knits. Industrial romance.' },
    { name: 'Akira Bose', quote: 'Anime energy, neon trims, cosplay-casual crossovers. Everyday fantasy mode.' },
    { name: 'Diya Kapoor', quote: 'Festival confetti sequins you can machine-wash. Practical sparkle.' },
    { name: 'Harini Subramanian', quote: 'Filter coffee browns, brass tones, sari borders reborn as trims. South home nostalgia.' },
    { name: 'Ishleen Kaur', quote: 'Military surplus re-cut into feminine layers. Soft rebellion.' },
    { name: 'Maya Rozario', quote: 'Choir robes, cathedral light, stained-glass color blocking. Sacred street.' },
    { name: 'Purnima Das', quote: 'Hand-dyed indigo gradations. Sky at dusk, every shade in between.' },
    { name: 'Reetika Sen', quote: 'Paper collage artworks scanned to silk prints. Mixed-media fashion lab.' },
    { name: 'Tanvi Arora', quote: 'Yoga stretch fabrics in dress silhouettes. Mindful movement, mindful making.' },
    { name: 'Urmi Ghosh', quote: 'Shantiniketan leather craft translated into appliqué panels on fabric. Art school heritage.' },
    { name: 'Vidya Nair', quote: 'Mangrove greens, eco dyes, reclaimed trims. Wetland conservation through clothing stories.' },
    { name: 'Zehra Siddiqui', quote: 'Night sky beadwork on matte black bases. Minimal drama, maximum depth.' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 40,
      justifyItems: 'center',
      width: '100%',
      marginTop: 120,
      marginBottom: 80
    }}>
      {images.map((img, idx) => (
        <DesignerInspirationCard
          key={idx}
          designerName={designerData[idx]?.name || `Designer ${idx + 1}`}
          mainImage={img}
          avatarImage={avatarImages[idx % avatarImages.length]}
          inspirationText={designerData[idx]?.quote || "Inspiration for this image goes here."}
        />
      ))}
    </div>
  );
}

function DressSlider() {
  const slides = [slider1, slider2, slider3, slider4];
  const [current, setCurrent] = React.useState(0);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((current + 1) % slides.length);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', background: '#d3d3d3', borderRadius: 12, boxShadow: '0 2px 12px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img src={slides[current]} alt={`Slide ${current+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, transition: 'all 0.4s cubic-bezier(.4,2,.6,1)' }} />
        {/* Left arrow */}
        <button onClick={prevSlide} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, boxShadow: '0 2px 8px #0002', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&lt;</button>
        {/* Right arrow */}
        <button onClick={nextSlide} style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, boxShadow: '0 2px 8px #0002', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&gt;</button>
      </div>
      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {slides.map((_, idx) => (
          <span key={idx} style={{ width: 10, height: 10, borderRadius: '50%', background: idx === current ? '#222' : '#bbb', display: 'inline-block', transition: 'background 0.2s' }} />
        ))}
      </div>
    </div>
  );
}

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
      {/* Main text */}
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

function JewelleryAllureBanner() {
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
      {/* Main text */}
      <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: 12, zIndex: 1, marginBottom: 8 }}>
        JEWELLERY ALLURE
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
        Sparkle, elegance, and timeless beauty.
      </div>
    </div>
  );
}

function DressPage() {
  // Use all images from dressImages array
  return (
    <>
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Beige section (top, 60%) with AllureBanner overlay */}
        <div style={{ background: '#d3d3d3', width: '100vw', height: '60vh', minHeight: '60vh', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 80 }}>
          {/* AllureBanner as overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 2, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: 900, maxWidth: '90vw', margin: '0 auto', top: 70, position: 'relative' }}>
              <AllureBanner />
            </div>
          </div>
          <DressSlider />
        </div>
        {/* Black section (bottom, 40%) */}
        {/* (Removed previous grid of normal photos) */}
        {/* Circle at the partition with image */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '70vh', // moved further down
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
        }}>
          <img src={dressFeature} alt="Dress Feature" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Designer Inspiration Grid */}
        <DesignerInspirationGrid images={dressImages} />
        {/* Footer */}
        <footer style={{ width: '100%', background: '#222', color: '#fff', textAlign: 'center', padding: '32px 0 20px 0', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 16, letterSpacing: 1, marginTop: 40 }}>
          &copy; {new Date().getFullYear()} Designer Gallery. All rights reserved.
        </footer>
      </div>
    </>
  );
}



import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitDesign />} />
        <Route path="/design/:id" element={<DesignDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-signup" element={<LoginSignup />} />
        <Route path="/dress" element={<DressPage />} />
        <Route path="/jewellery" element={<JewelleryPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/shoes" element={<ShoesPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
