import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Disclosure from "../components/Disclosure";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import ProductFilters from "../components/ProductFilters";
import CategoryChips from "../components/CategoryChips";
import FeaturedProducts from "../components/FeaturedProducts";
import "../styles.css";

import { API_BASE_URL } from "../config";

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title-asc");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.filter((product) => product.active));
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.category))].sort();
  }, [products]);

  const featuredProducts = useMemo(() => {
    const explicitlyFeatured = products.filter(
      (product) => product.featured && product.active,
    );

    if (explicitlyFeatured.length > 0) {
      return explicitlyFeatured.slice(0, 3);
    }

    return products.slice(0, 3);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const searchValue = searchTerm.toLowerCase();
      result = result.filter((product) => {
        return (
          product.title.toLowerCase().includes(searchValue) ||
          product.description.toLowerCase().includes(searchValue) ||
          product.category.toLowerCase().includes(searchValue)
        );
      });
    }

    if (category !== "all") {
      result = result.filter((product) => product.category === category);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "category-asc":
          return a.category.localeCompare(b.category);
        case "category-desc":
          return b.category.localeCompare(a.category);
        case "title-asc":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [products, searchTerm, category, sortBy]);

  return (
    <div className="page">
      <Header />
      <Disclosure />

      <FeaturedProducts
        products={featuredProducts}
        redirectBaseUrl={API_BASE_URL}
        source="featured-section"
      />

      <section className="chips-section">
        <div className="section-heading">
          <h2>Browse by Category</h2>
          <p>
            Quickly jump to outfits, accessories, decor, and party essentials.
          </p>
        </div>

        <CategoryChips
          categories={categories}
          selectedCategory={category}
          onSelectCategory={setCategory}
        />
      </section>

      <section className="filters-section">
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
          status="all"
          onStatusChange={() => {}}
        />
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <h2>Shop All Products</h2>
          <p>Hand-picked festive finds for parties, hosting, and going out.</p>
        </div>

        <main className="grid">
          {loading && <p>Loading products...</p>}
          {errorMessage && <p>{errorMessage}</p>}
          {!loading && !errorMessage && filteredProducts.length === 0 && (
            <div className="empty-state">
              <h3>No matching products found</h3>
              <p>Try a different search or category filter.</p>
            </div>
          )}

          {!loading &&
            !errorMessage &&
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                redirectBaseUrl={API_BASE_URL}
                source="landing-page"
              />
            ))}
        </main>
      </section>

      <Footer />
    </div>
  );
}
