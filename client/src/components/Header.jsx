import React from "react";

export default function Header() {
  return (
    <>
      <header className="site-nav">
        <div className="site-nav-inner">
          <a href="/" className="brand-mark">
            Sunday League Essentials
          </a>

          <nav className="nav-links">
            <a href="#featured">Featured</a>
            <a href="#products">Shop</a>
            <a href="#products">Training</a>
            <a href="#products">Recovery</a>
          </nav>
        </div>
      </header>

      <section className="hero hero-pro">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-badge">Adult Footy Picks</span>
          <h1>Sunday League Essentials</h1>
          <p>
            Training gear, match-day picks and recovery tools for the weekend
            warriors.
          </p>
          <div className="hero-actions">
            <a href="#products" className="hero-primary-button">
              Shop Top Picks
            </a>
            <a href="#featured" className="hero-secondary-button">
              View Featured Gear
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
