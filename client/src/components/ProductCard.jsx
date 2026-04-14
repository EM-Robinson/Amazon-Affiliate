import React from "react";
import ProductImage from "./ProductImage";

export default function ProductCard({
  product,
  redirectBaseUrl,
  source,
  featured = false,
}) {
  const redirectUrl = `${redirectBaseUrl}/out/${product.id}?src=${encodeURIComponent(source)}`;

  return (
    <article className={featured ? "product-card featured-card" : "product-card"}>
      <ProductImage
        src={product.image}
        alt={product.title}
        featured={featured}
      />

      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-badge">{product.category}</span>
        </div>

        <h3>{product.title}</h3>
        <p>{product.description}</p>

        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="product-cta"
        >
          View Gear
        </a>
      </div>
    </article>
  );
}