/**
 * Vercel Serverless Function Entry Point
 * This file imports the Express app and exports it as a Vercel handler.
 * All /api/* routes are proxied here by vercel.json.
 */

require("dotenv").config({ path: __dirname + "/../server/.env" });
const app = require("../server/server");

module.exports = app;
