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
    <div className={featured ? "card featured-card" : "card"}>
      <ProductImage
        src={product.image}
        alt={product.title}
        featured={featured}
      />

      <div className="card-body">
        <span className="badge">{product.category}</span>
        <h3>{product.title}</h3>
        <p>{product.description}</p>

        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="buy-button-link"
        >
          Shop on Amazon
        </a>
      </div>
    </div>
  );
}