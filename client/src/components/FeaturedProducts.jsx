import React from "react";
import ProductCard from "./ProductCard";

export default function FeaturedProducts({
  products,
  redirectBaseUrl,
  source,
}) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="featured-section" id="featured">
      <div className="section-heading">
        <h2>Featured Party Favorites</h2>
        <p>Our best seasonal picks for outfits, hosting, and party vibes.</p>
      </div>

      <div className="featured-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            redirectBaseUrl={redirectBaseUrl}
            source={source}
            featured={true}
          />
        ))}
      </div>
    </section>
  );
}