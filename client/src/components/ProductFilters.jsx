import React from "react";

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
  status,
  onStatusChange,
  showStatusFilter = false,
}) {
  return (
    <div className="filters-panel">
      <div className="filters-grid">
        <div>
          <label className="field-label">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
          />
        </div>

        <div>
          <label className="field-label">Category</label>
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {categoryOption}
              </option>
            ))}
          </select>
        </div>

        {showStatusFilter && (
          <div>
            <label className="field-label">Status</label>
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>
        )}

        <div>
          <label className="field-label">Sort</label>
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="category-asc">Category (A-Z)</option>
            <option value="category-desc">Category (Z-A)</option>
            {showStatusFilter && <option value="status">Status</option>}
          </select>
        </div>
      </div>
    </div>
  );
}