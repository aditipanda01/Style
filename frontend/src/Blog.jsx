import React from "react";
import "./App.css";
import img1 from "./assets/pic1.jpeg";
import img2 from "./assets/pic2.png";
import img3 from "./assets/pic3.jpeg";
import b1 from "./assets/b1.jpeg";
import b2 from "./assets/b2.jpeg";
import b3 from "./assets/b3.jpeg";
import b4 from "./assets/b4.jpeg";
import b5 from "./assets/b5.jpeg";
import back1 from "./assets/back1.jpeg";
import t1 from "./assets/t1.jpeg";
import t2 from "./assets/t2.jpeg";
import t3 from "./assets/t3.jpeg";

const Blog = () => {
  return (
    <div className="blog-landing">
      {/* Hero Section */}
      <section className="blog-hero-mono-exact">
        <img src={back1} alt="Hero" className="blog-hero-bg-exact" />
        <div className="blog-hero-overlay-exact" />
        <div className="blog-hero-content-exact">
          <h1 className="blog-hero-title-exact">
            IT'S TIME TO<br />
            START LIVING
            <span className="blog-hero-sub-exact">your dream life</span>
          </h1>
          
        </div>
      </section>

      {/* Intro Section */}
      <section className="blog-intro-dark-exact">
        <div className="blog-intro-content-exact">
          <h2 className="blog-intro-title-exact">HI, I'M <span className="blog-intro-name-exact">Kayla Skye</span></h2>
          <div className="blog-intro-grid-exact">
            <img src={t1} alt="Kayla Skye left" className="blog-intro-img-exact small" />
            <img src={t3} alt="Kayla Skye main" className="blog-intro-img-exact main" />
            <img src={t2} alt="Kayla Skye right" className="blog-intro-img-exact small" />
          </div>
          <div className="blog-intro-bio-exact">
            Photographer, Educator, Canada<br />
            Living: Entrepreneur & Mamma
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="blog-advantages-section-fixed">
        <h2 className="blog-advantages-title-fixed">THEIR STORIES,OUR INSPIRATION</h2>
        <div className="blog-advantages-rows">
          {/* Row 1: Aanya Verma */}
          <div className="blog-adv-row">
            <div className="blog-adv-card-fixed dark">
              <div className="designer-quote-bold">"From scraps to style — I stitched my dream into reality."</div>
              <div className="designer-name">Aanya Verma</div>
              <div className="designer-story">Raised in Jaipur, Aanya learned to sew using leftover fabric from her mother’s tailoring shop. With no formal training, she turned passion into purpose. Her vibrant, hand-detailed designs now reflect the journey of a self-taught artist who turned limitations into creative liberation.</div>
            </div>
            <img src={b1} alt="Aanya Verma" className="blog-adv-img-fixed" />
          </div>
          {/* Row 2: Meher Kapoor */}
          <div className="blog-adv-row">
            <img src={b2} alt="Meher Kapoor" className="blog-adv-img-fixed" />
            <div className="blog-adv-card-fixed dark">
              <div className="designer-quote-bold">"Every thread tells a story I once lived."</div>
              <div className="designer-name">Meher Kapoor</div>
              <div className="designer-story">Meher left behind a stable corporate job to pursue design full-time. Inspired by vintage Indian craftsmanship and her grandmother’s saris, she now blends nostalgia with minimal modern silhouettes. Her pieces celebrate heritage with a fresh, feminine touch.</div>
            </div>
          </div>
          {/* Row 3: Liyana Sheikh */}
          <div className="blog-adv-row">
            <div className="blog-adv-card-fixed dark">
              <div className="designer-quote-bold">"I design dreams stitched in silence."</div>
              <div className="designer-name">Liyana Sheikh</div>
              <div className="designer-story">Growing up in a conservative household in Lucknow, Liyana sketched in secret. Fashion was her form of rebellion — and healing. When she finally uploaded her designs, they resonated deeply with others. Today, her modest yet modern style is a voice for those still waiting to be heard.</div>
            </div>
            <img src={b3} alt="Liyana Sheikh" className="blog-adv-img-fixed" />
          </div>
          {/* Row 4: Tara Mehta */}
          <div className="blog-adv-row">
            <img src={b4} alt="Tara Mehta" className="blog-adv-img-fixed" />
            <div className="blog-adv-card-fixed dark">
              <div className="designer-quote-bold">"Bold colors, bold heart — my designs speak before I do."</div>
              <div className="designer-name">Tara Mehta</div>
              <div className="designer-story">Tara, a Fine Arts graduate from Delhi, uses fashion to paint personality. Known for her fearless color choices and dramatic silhouettes, her work reflects individuality and power. Her debut on the platform was a celebration of confidence — and quickly made her a fan favorite.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="blog-footer">
        © {new Date().getFullYear()} Designers Blog. All rights reserved.
      </footer>
    </div>
  );
};

export default Blog; 