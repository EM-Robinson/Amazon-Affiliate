import React, { useEffect, useState } from "react";
import ProductImage from "./ProductImage";

const emptyForm = {
  title: "",
  description: "",
  image: "",
  affiliateUrl: "",
  category: "",
  active: true,
  featured: false,
};

export default function ProductForm({ onSubmit, editingProduct, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData(emptyForm);
    }
  }, [editingProduct]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);

    if (!editingProduct) {
      setFormData(emptyForm);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <input
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
      />

      <input
        name="affiliateUrl"
        placeholder="Affiliate URL"
        value={formData.affiliateUrl}
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />

      <label className="checkbox-row">
        <input
          type="checkbox"
          name="active"
          checked={formData.active}
          onChange={handleChange}
        />
        Active
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
        />
        Featured
      </label>
      
      <div className="image-preview-panel">
        <p className="field-label">Image Preview</p>
        <div className="image-preview-card">
          <ProductImage
            src={formData.image}
            alt={formData.title || "Product preview"}
            featured={formData.featured}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>

        {editingProduct && (
          <button type="button" onClick={onCancel} className="secondary-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}