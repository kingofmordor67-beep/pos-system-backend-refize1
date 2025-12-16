const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Add this line to test the DB connection immediately
require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE (The Gatekeepers)
// ==========================================

// 1. CORS: Allow the Frontend (Vite) to talk to us
// If their Vite runs on port 5173, we can restrict it here,
// but for development, we allow all origin (*).
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

// ==========================================
// IMPORT ROUTES (We will create these later)
// ==========================================
// const productRoutes = require('./routes/productRoutes');
// app.use('/api/products', productRoutes);

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`\n🚀 SERVER RUNNING on http://localhost:${PORT}`);
  console.log(`👉 Waiting for Frontend requests...`);
});
