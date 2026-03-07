import React, { useState } from "react";
import fallbackImage from "../assets/product-fallback.png";

export default function ProductImage({ src, alt, featured = false }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="card-image-wrap">
      <img
        src={imageError || !src ? fallbackImage : src}
        alt={alt}
        className="card-image"
        onError={() => setImageError(true)}
      />
      {featured && <span className="featured-tag">Featured</span>}
    </div>
  );
}