import React from "react";

export default function AdminProductList({
  products,
  onEdit,
  onToggle,
  onToggleFeatured,
}) {
  return (
    <div className="admin-list">
      <h2>Manage Products ({products.length})</h2>

      {products.length === 0 && <p>No products found.</p>}

      {products.map((product) => (
        <div key={product.id} className="admin-list-item">
          <div>
            <h3>
              {product.title}
              {!product.active && <span> (Inactive)</span>}
              {product.featured && <span> ⭐</span>}
            </h3>
            <p>{product.category}</p>
          </div>

          <div className="admin-actions">
            <button onClick={() => onEdit(product)}>Edit</button>
            <button
              onClick={() => onToggle(product.id)}
              className="secondary-button"
            >
              {product.active ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => onToggleFeatured(product.id)}
              className="secondary-button"
            >
              {product.featured ? "Unfeature" : "Feature"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}