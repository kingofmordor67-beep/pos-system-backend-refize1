const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Tambah garis untuk tes koneksi
require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE (The Gatekeepers)
// ==========================================

// 1. CORS: Mengizinkan Frontend (Vite) dapat berinteraksi dengan API ini
// Jika Vite berjalan di port 5173, stp disini juga harus diizinkan.
// untuk development, kita mengizinkan semua (*).
app.use(cors());

// 2. Body Parser: Accept JSON data from React
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================================
// TEST ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.json({
    message: "API Service is Running 🚀",
    role: "Backend",
    status: "Ready for React",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    serverTime: new Date().toISOString(),
    database: "MySQL (Connected)", // Asumsi koneksi aman
  });
});

// ==========================================
// IMPORT ROUTES (Routes disimpan disini)
// ==========================================
// const productRoutes = require('./routes/productRoutes');
// app.use('/api/products', productRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const transaksiRoutes = require("./routes/transaksiRoutes");
app.use("/api/checkout", transaksiRoutes);
// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`\n🚀 SERVER RUNNING on http://localhost:${PORT}`);
  console.log(`👉 Waiting for Frontend requests...`);
});
