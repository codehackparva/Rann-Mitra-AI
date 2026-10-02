/**
 * Vercel Serverless Function Entry Point
 * This file imports the Express app and exports it as a Vercel handler.
 * All /api/* routes are proxied here by vercel.json.
 *
 * On Vercel: env vars are injected via the Vercel dashboard (no .env file).
 * Locally: dotenv loads from server/.env via server.js itself.
 */

const app = require("../server/server");

module.exports = app;
