const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const { readJson, writeJson } = require("./utils/fileDb");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

const PRODUCTS_PATH = "data/products.json";
const CLICKS_PATH = "data/clicks.json";

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: isProduction
      ? true
      : process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: "stpadmin.sid",
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "lax" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

function requireAuth(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized" });
}

app.get("/", (req, res) => {
  res.send("Affiliate server is running");
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAuthenticated = true;
    req.session.username = username;

    return res.json({
      isAuthenticated: true,
      username,
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ error: "Failed to logout" });
    }

    res.clearCookie("connect.sid");
    return res.json({ success: true });
  });
});

app.get("/api/me", (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.json({
      isAuthenticated: true,
      username: req.session.username,
    });
  }

  return res.status(401).json({ isAuthenticated: false });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await readJson(PRODUCTS_PATH);
    res.json(products);
  } catch (error) {
    console.error("Failed to load products:", error);
    res.status(500).json({ error: "Failed to load products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const products = await readJson(PRODUCTS_PATH);
    const product = products.find((item) => Number(item.id) === productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Failed to load product:", error);
    res.status(500).json({ error: "Failed to load product" });
  }
});

app.post("/api/products", requireAuth, async (req, res) => {
  try {
    const products = await readJson(PRODUCTS_PATH);
    const { title, description, image, affiliateUrl, category, active, featured } = req.body;

    if (!title || !description || !image || !affiliateUrl || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const nextId =
      products.length > 0 ? Math.max(...products.map((product) => Number(product.id))) + 1 : 1;

const newProduct = {
  id: nextId,
  title,
  description,
  image,
  affiliateUrl,
  category,
  active: active ?? true,
  featured: featured ?? false,
};

    products.push(newProduct);
    await writeJson(PRODUCTS_PATH, products);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", requireAuth, async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const products = await readJson(PRODUCTS_PATH);
    const productIndex = products.findIndex((item) => Number(item.id) === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { title, description, image, affiliateUrl, category, active, featured } = req.body;

    if (!title || !description || !image || !affiliateUrl || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

const updatedProduct = {
  ...products[productIndex],
  title,
  description,
  image,
  affiliateUrl,
  category,
  active: active ?? products[productIndex].active,
  featured: featured ?? products[productIndex].featured ?? false,
};

    products[productIndex] = updatedProduct;
    await writeJson(PRODUCTS_PATH, products);

    res.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.patch("/api/products/:id/toggle", requireAuth, async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const products = await readJson(PRODUCTS_PATH);
    const productIndex = products.findIndex((item) => Number(item.id) === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    products[productIndex].active = !products[productIndex].active;
    await writeJson(PRODUCTS_PATH, products);

    res.json(products[productIndex]);
  } catch (error) {
    console.error("Failed to toggle product:", error);
    res.status(500).json({ error: "Failed to toggle product" });
  }
});

app.get("/api/stats", requireAuth, async (req, res) => {
  try {
    const clicks = await readJson(CLICKS_PATH);

    function getPlatform(source) {
      if (!source || typeof source !== "string") {
        return "unknown";
      }

      const [platform] = source.split("-");
      return platform || "unknown";
    }

    function getCampaign(source) {
      if (!source || typeof source !== "string") {
        return "unknown";
      }

      const parts = source.split("-");
      if (parts.length <= 1) {
        return source;
      }

      return parts.slice(1).join("-");
    }

    function getDay(timestamp) {
      if (!timestamp) {
        return "unknown";
      }

      return new Date(timestamp).toISOString().slice(0, 10);
    }

    const totalClicks = clicks.length;

    const clicksBySource = {};
    const clicksByPlatform = {};
    const clicksByCampaign = {};
    const clicksByProduct = {};
    const clicksByCategory = {};
    const clicksByDay = {};

    for (const click of clicks) {
      const source = click.source || "unknown";
      const platform = getPlatform(source);
      const campaign = getCampaign(source);
      const day = getDay(click.timestamp);
      const productTitle = click.productTitle || "Unknown Product";
      const category = click.category || "Unknown Category";

      clicksBySource[source] = (clicksBySource[source] || 0) + 1;
      clicksByPlatform[platform] = (clicksByPlatform[platform] || 0) + 1;
      clicksByCampaign[campaign] = (clicksByCampaign[campaign] || 0) + 1;
      clicksByProduct[productTitle] = (clicksByProduct[productTitle] || 0) + 1;
      clicksByCategory[category] = (clicksByCategory[category] || 0) + 1;
      clicksByDay[day] = (clicksByDay[day] || 0) + 1;
    }

    const topCampaigns = Object.entries(clicksByCampaign)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, clicks]) => ({ name, clicks }));

    const topProducts = Object.entries(clicksByProduct)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, clicks]) => ({ name, clicks }));

    const clicksByDayChart = Object.entries(clicksByDay)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, clicks]) => ({ date, clicks }));

    const clicksByPlatformChart = Object.entries(clicksByPlatform)
      .sort((a, b) => b[1] - a[1])
      .map(([platform, clicks]) => ({ platform, clicks }));

    res.json({
      totalClicks,
      clicksBySource,
      clicksByPlatform,
      clicksByCampaign,
      clicksByProduct,
      clicksByCategory,
      clicksByDay,
      topCampaigns,
      topProducts,
      clicksByDayChart,
      clicksByPlatformChart,
      recentClicks: clicks.slice(-10).reverse(),
    });
  } catch (error) {
    console.error("Failed to load stats:", error);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

app.get("/out/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const source = req.query.src || "unknown";

    const products = await readJson(PRODUCTS_PATH);
    const clicks = await readJson(CLICKS_PATH);

    const product = products.find((item) => Number(item.id) === productId && item.active);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const clickRecord = {
      id: clicks.length + 1,
      productId: product.id,
      productTitle: product.title,
      category: product.category,
      source,
      timestamp: new Date().toISOString(),
      userAgent: req.get("user-agent") || "unknown",
      referer: req.get("referer") || "direct",
    };

    clicks.push(clickRecord);
    await writeJson(CLICKS_PATH, clicks);

    return res.redirect(product.affiliateUrl);
  } catch (error) {
    console.error("Redirect tracking failed:", error);
    res.status(500).send("Something went wrong");
  }
});

if (isProduction) {
  const clientDistPath = path.join(__dirname, "..", "client", "dist");

  app.use(express.static(clientDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.patch("/api/products/:id/feature", requireAuth, async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const products = await readJson(PRODUCTS_PATH);
    const productIndex = products.findIndex((item) => Number(item.id) === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    products[productIndex].featured = !products[productIndex].featured;
    await writeJson(PRODUCTS_PATH, products);

    res.json(products[productIndex]);
  } catch (error) {
    console.error("Failed to toggle featured status:", error);
    res.status(500).json({ error: "Failed to toggle featured status" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});