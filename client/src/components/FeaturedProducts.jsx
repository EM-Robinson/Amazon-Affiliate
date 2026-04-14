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
        <span className="section-kicker">Editor’s Picks</span>
        <h2>Featured Player Picks</h2>
        <p>
          A few of the strongest training, match-day, and recovery picks on the
          page right now.
        </p>
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