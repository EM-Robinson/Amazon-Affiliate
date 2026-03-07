import React from "react";

export default function Header() {
  return (
    <header className="hero hero-polished">
      <div className="hero-content">
        <span className="hero-badge">Limited-Time Seasonal Picks</span>
        <h1>Top St. Patrick’s Day Amazon Finds 🍀</h1>
        <p>
          Shop festive outfits, party gear, decorations, and last-minute picks
          before they sell out.
        </p>

        <div className="hero-actions">
          <a href="#products" className="hero-primary-button">
            Shop Top Picks
          </a>
          <a href="#featured" className="hero-secondary-button">
            View Featured Finds
          </a>
        </div>
      </div>
    </header>
  );
}