import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductForm from "../components/ProductForm";
import AdminProductList from "../components/AdminProductList";
import StatsCard from "../components/StatsCard";
import StatsList from "../components/StatsList";
import RecentClicks from "../components/RecentClicks";
import CampaignLinkBuilder from "../components/CampaignLinkBuilder";
import ProductFilters from "../components/ProductFilters";
import AnalyticsBarChart from "../components/AnalyticsBarChart";
import Leaderboard from "../components/Leaderboard";
import "../styles.css";

import { API_BASE_URL } from "../config";

export default function AdminPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClicks: 0,
    clicksBySource: {},
    clicksByPlatform: {},
    clicksByCampaign: {},
    clicksByProduct: {},
    clicksByCategory: {},
    clicksByDay: {},
    topCampaigns: [],
    topProducts: [],
    clicksByDayChart: [],
    clicksByPlatformChart: [],
    recentClicks: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title-asc");

  async function fetchProducts() {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    setProducts(data);
  }

  async function fetchStats() {
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    const data = await response.json();
    setStats(data);
  }

  async function loadAdminData() {
    try {
      await Promise.all([fetchProducts(), fetchStats()]);
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function handleAddOrUpdateProduct(productData) {
    try {
      const isEditing = Boolean(editingProduct);
      const url = isEditing
        ? `${API_BASE_URL}/api/products/${editingProduct.id}`
        : `${API_BASE_URL}/api/products`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      await loadAdminData();
      setEditingProduct(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save product.");
    }
  }

  async function handleToggleProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/toggle`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle product");
      }

      await loadAdminData();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update product status.");
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  async function handleToggleFeatured(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}/feature`, {
      method: "PATCH",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle featured status");
    }

    await loadAdminData();
  } catch (error) {
    console.error(error);
    setErrorMessage("Failed to update featured status.");
  }
}

  const categories = React.useMemo(() => {
    return [...new Set(products.map((product) => product.category))].sort();
  }, [products]);

  const filteredProducts = React.useMemo(() => {
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

    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    if (statusFilter === "active") {
      result = result.filter((product) => product.active);
    } else if (statusFilter === "inactive") {
      result = result.filter((product) => !product.active);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "category-asc":
          return a.category.localeCompare(b.category);
        case "category-desc":
          return b.category.localeCompare(a.category);
        case "status":
          return Number(b.active) - Number(a.active);
        case "title-asc":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [products, searchTerm, categoryFilter, statusFilter, sortBy]);

  return (
    <div className="page admin-page">
      <div className="admin-topbar">
        <p>Logged in as {user?.username}</p>
        <button onClick={handleLogout} className="secondary-button">
          Logout
        </button>
      </div>

      <section className="admin-dashboard">
        <StatsCard label="Total Clicks" value={stats.totalClicks} />
        <StatsCard label="Active Products" value={products.filter((p) => p.active).length} />
        <StatsCard label="Inactive Products" value={products.filter((p) => !p.active).length} />
      </section>

      <section className="link-builder-section">
        <CampaignLinkBuilder
          products={products}
          redirectBaseUrl={API_BASE_URL}
        />
      </section>

      {errorMessage && <p>{errorMessage}</p>}
      {loading && <p>Loading admin data...</p>}

      {!loading && (
        <>
          <section className="stats-grid">
            <AnalyticsBarChart
              title="Clicks by Platform"
              data={stats.clicksByPlatformChart}
              xKey="platform"
            />
            <AnalyticsBarChart
              title="Clicks by Day"
              data={stats.clicksByDayChart}
              xKey="date"
            />
            <Leaderboard title="Top Campaigns" items={stats.topCampaigns} />
            <Leaderboard title="Top Products" items={stats.topProducts} />
            <StatsList title="Clicks by Platform" data={stats.clicksByPlatform} />
            <StatsList title="Clicks by Category" data={stats.clicksByCategory} />
            <StatsList title="Clicks by Campaign" data={stats.clicksByCampaign} />
            <RecentClicks clicks={stats.recentClicks} />
          </section>

          <section className="filters-section">
            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              category={categoryFilter}
              onCategoryChange={setCategoryFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categories={categories}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              showStatusFilter={true}
            />
          </section>

          <section className="admin-section">
            <ProductForm
              onSubmit={handleAddOrUpdateProduct}
              editingProduct={editingProduct}
              onCancel={() => setEditingProduct(null)}
            />

            <AdminProductList
              products={filteredProducts}
              onEdit={setEditingProduct}
              onToggle={handleToggleProduct}
              onToggleFeatured={handleToggleFeatured}
            />
          </section>
        </>
      )}
    </div>
  );
}