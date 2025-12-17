const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = 3000;
const JWT_SECRET = "refize-studio-2025-key"; // Ganti sesuka hati

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection - Sesuaikan sama Laragon lu
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "pos_db",
  waitForConnections: true,
  connectionLimit: 10,
});

// Auth Route untuk Login.jsx
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(`Log: Mencoba login untuk user: ${username}`);

  try {
    // Query sesuai kolom di screenshot lu: id, username, password, role
    const [users] = await db.query(
      "SELECT id, username, password, role FROM user WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Username tidak ditemukan" });
    }

    const user = users[0];

    // Cek password (plain text sesuai skenario development lu)
    if (password !== user.password) {
      return res.status(401).json({ error: "Password salah" });
    }

    // Bikin Token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // RESPONSE: Harus ada 'token' dan 'user' (beserta 'role') supaya Login.jsx ga crash
    res.json({
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role, // Ini yang dipake navigate() di frontend
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// Endpoint untuk ambil produk (biar frontend bisa jualan)
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produk");
    // Mapping supaya frontend dapet key 'name' dan 'price'
    const products = rows.map((p) => ({
      id: p.id,
      _id: p.id,
      name: p.nama_produk,
      price: parseFloat(p.harga),
      stock: p.stok,
      sku: p.sku,
    }));
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server Refize Studio Running on Port ${PORT}`);
  console.log(`📡 Kasih IP ini ke temen lu: http://[IP_LAPTOP_LU]:${PORT}`);
  // Tambahin ini di bawah "const app = express();"
app.use((req, res, next) => {
    console.log(`[RADAR] 📡 Menerima Request: ${req.method} ${req.originalUrl}`);
    console.log(`[DATA]  📦 Isi Paket:`, req.body);
    next();
});
});
