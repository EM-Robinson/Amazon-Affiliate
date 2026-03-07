import React from "react";

export default function CategoryChips({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="category-chips">
      <button
        className={selectedCategory === "all" ? "chip active-chip" : "chip"}
        onClick={() => onSelectCategory("all")}
        type="button"
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          className={selectedCategory === category ? "chip active-chip" : "chip"}
          onClick={() => onSelectCategory(category)}
          type="button"
        >
          {category}
        </button>
      ))}
    </div>
  );
}