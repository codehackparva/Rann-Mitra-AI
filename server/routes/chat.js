const express = require("express");
const router = express.Router();
const { orchestrate } = require("../agents/orchestrator");
const { getDashboardData } = require("../agents/tourismImpactAgent");
const { destinations } = require("../data/destinations");

// POST /api/chat — main conversational endpoint
router.post("/chat", async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required and must be a non-empty string." });
  }

  if (message.trim().length > 4000) {
    return res.status(400).json({ error: "Message exceeds maximum length of 4000 characters." });
  }

  const history = Array.isArray(conversationHistory) ? conversationHistory : [];

  try {
    const result = await orchestrate(message.trim(), history);
    res.json({
      response: result.response,
      agents: result.agents,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Chat error [%d]: %s", err.status || 500, err.message);

    const msg = err.message || "";
    const status = err.status || 500;

    if (status === 401 || msg.includes("API key") || msg.includes("api_key")) {
      return res.status(401).json({
        error: "AI service authentication failed. Please check your GROQ_API_KEY in server/.env."
      });
    }
    if (status === 400 && msg.includes("decommissioned")) {
      return res.status(400).json({
        error: `Model decommissioned. Please update GROQ_MODEL in server/.env. Current: ${process.env.GROQ_MODEL}`
      });
    }
    if (status === 400 && msg.includes("model")) {
      return res.status(400).json({
        error: `Invalid model name. Please update GROQ_MODEL in server/.env. Current: ${process.env.GROQ_MODEL}`
      });
    }
    if (status === 429 || msg.includes("rate limit")) {
      return res.status(429).json({
        error: "Too many requests. Please wait a moment before trying again."
      });
    }

    res.status(500).json({
      error: "An error occurred processing your request. Please try again."
    });
  }
});

// GET /api/dashboard — dashboard data
router.get("/dashboard", (req, res) => {
  try {
    const data = getDashboardData();
    res.json({ ...data, dataMode: "demo" });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.status(500).json({ error: "Could not load dashboard data." });
  }
});

// GET /api/destinations — all destinations
router.get("/destinations", (req, res) => {
  res.json({ destinations, dataMode: "demo" });
});

// GET /api/destinations/:id — single destination
router.get("/destinations/:id", (req, res) => {
  const dest = destinations.find(d => d.id === parseInt(req.params.id));
  if (!dest) return res.status(404).json({ error: "Destination not found." });
  res.json({ destination: dest, dataMode: "demo" });
});

// GET /api/health — health check
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Rann Mitra AI",
    aiProvider: process.env.AI_PROVIDER || "groq",
    model: process.env.GROQ_MODEL || "llama3-8b-8192",
    dataMode: "demo"
  });
});

module.exports = router;
