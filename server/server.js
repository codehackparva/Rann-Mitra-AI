require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const chatRoutes = require("./routes/chat");
const { chatLimiter, generalLimiter } = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false // Allow frontend to load maps/charts
}));

// ─── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
  // Vercel deployments — allow all *.vercel.app subdomains
  /\.vercel\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ─── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── Rate Limiting ──────────────────────────────────────────────────────────
app.use("/api/", generalLimiter);
app.use("/api/chat", chatLimiter);

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use("/api", chatRoutes);

// ─── Validate Environment ───────────────────────────────────────────────────
if (!process.env.GROQ_API_KEY) {
  console.warn(
    "\n⚠️  WARNING: GROQ_API_KEY is not set in .env\n" +
    "   The AI chat functionality will not work until this is configured.\n" +
    "   See .env.example for setup instructions.\n"
  );
}

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error." });
});

// ─── Start Server (local dev only) ──────────────────────────────────────────
// When running on Vercel, the app is exported as a serverless function.
// `VERCEL` env variable is automatically set by Vercel's runtime.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🌵 Rann Mitra AI — Server running on http://localhost:${PORT}`);
    console.log(`   AI Provider: ${process.env.AI_PROVIDER || "groq"}`);
    console.log(`   Model: ${process.env.GROQ_MODEL || "llama3-8b-8192"}`);
    console.log(`   Data Mode: Demo\n`);
  });
}

// ─── Export for Vercel Serverless ────────────────────────────────────────────
module.exports = app;
