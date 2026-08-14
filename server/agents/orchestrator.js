/**
 * Agent Orchestrator
 * Routes user queries to appropriate specialist agents.
 * Can combine multiple agents for complex queries.
 */

const touristLoadAgent = require("./touristLoadAgent");
const itineraryAgent = require("./itineraryAgent");
const carryingCapacityAgent = require("./carryingCapacityAgent");
const communityAgent = require("./communityAgent");
const tourismImpactAgent = require("./tourismImpactAgent");
const groqService = require("../services/groqService");

const AGENT_PATTERNS = {
  touristLoad: [
    /crowd/i, /crowded/i, /busy/i, /tourists.*many/i, /how.*many.*people/i,
    /peak.*time/i, /peak.*season/i, /avoid.*crowd/i, /less.*crowd/i,
    /tourist.*pressure/i, /high.*traffic/i, /tourist.*load/i,
    /when.*visit/i, /best.*time/i, /off.*peak/i
  ],
  itinerary: [
    /itinerary/i, /plan.*trip/i, /trip.*plan/i, /day.*trip/i,
    /\d+.*day/i, /day.*\d+/i, /travel.*plan/i, /schedule/i,
    /what.*see/i, /places.*visit/i, /visit.*places/i, /where.*go/i,
    /tour.*plan/i, /plan.*visit/i, /explore.*kutch/i
  ],
  carryingCapacity: [
    /ecological/i, /carrying capacity/i, /environment/i, /ecosystem/i,
    /sensitive/i, /impact/i, /ecological.*impact/i, /environmental.*impact/i,
    /water.*stress/i, /water.*scarcity/i, /waste/i, /pollution/i,
    /sustainability.*score/i, /ecological.*risk/i, /habitat/i, /wildlife/i
  ],
  community: [
    /artisan/i, /craft/i, /handicraft/i, /local.*community/i,
    /embroidery/i, /bandhani/i, /ajrakh/i, /rogan/i, /pottery/i,
    /village/i, /local.*experience/i, /community.*tourism/i,
    /local.*food/i, /buy.*local/i, /support.*local/i, /textile/i,
    /souvenirs/i, /shopping/i, /cultural.*experience/i, /local.*art/i
  ],
  dashboard: [
    /dashboard/i, /analytics/i, /statistics/i, /data/i,
    /highest.*pressure/i, /lowest.*sustainability/i, /most.*crowded/i,
    /overview/i, /report/i, /metrics/i, /trend/i, /comparison/i
  ]
};

function detectAgents(message) {
  const agentsNeeded = new Set();

  for (const [agent, patterns] of Object.entries(AGENT_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(message))) {
      agentsNeeded.add(agent);
    }
  }

  // Default to itinerary agent if no match and it sounds like a general trip query
  if (agentsNeeded.size === 0) {
    agentsNeeded.add("itinerary");
  }

  // Complex queries that mention planning + avoidance → add tourist load
  if (
    agentsNeeded.has("itinerary") &&
    /avoid|less.*crowd|alternative|sustainable|eco.*friend/i.test(message)
  ) {
    agentsNeeded.add("touristLoad");
    agentsNeeded.add("carryingCapacity");
  }

  // Queries about sustainability → always include carrying capacity
  if (
    agentsNeeded.has("itinerary") &&
    /sustainab|eco|environment|responsible/i.test(message)
  ) {
    agentsNeeded.add("carryingCapacity");
  }

  return Array.from(agentsNeeded);
}

function buildAgentContext(agentsNeeded) {
  const contexts = [];

  if (agentsNeeded.includes("touristLoad")) {
    contexts.push(`=== TOURIST LOAD AGENT DATA ===\n${touristLoadAgent.getAgentContext()}`);
  }
  if (agentsNeeded.includes("itinerary")) {
    contexts.push(`=== ITINERARY AGENT DATA ===\n${itineraryAgent.getAgentContext()}`);
  }
  if (agentsNeeded.includes("carryingCapacity")) {
    contexts.push(`=== CARRYING CAPACITY AGENT DATA ===\n${carryingCapacityAgent.getAgentContext()}`);
  }
  if (agentsNeeded.includes("community")) {
    contexts.push(`=== COMMUNITY & ARTISAN AGENT DATA ===\n${communityAgent.getAgentContext()}`);
  }
  if (agentsNeeded.includes("dashboard")) {
    contexts.push(`=== TOURISM IMPACT DASHBOARD AGENT DATA ===\n${tourismImpactAgent.getAgentContext()}`);
  }

  return contexts.join("\n\n");
}

const AGENT_LABELS = {
  touristLoad: "Tourist Load Forecasting Agent",
  itinerary: "Sustainable Itinerary Agent",
  carryingCapacity: "Ecological Carrying Capacity Agent",
  community: "Local Community & Artisan Agent",
  dashboard: "Tourism Impact Dashboard Agent"
};

async function orchestrate(message, conversationHistory = []) {
  const agentsNeeded = detectAgents(message);
  const agentContext = buildAgentContext(agentsNeeded);

  const response = await groqService.generateResponse(
    message,
    conversationHistory,
    agentContext
  );

  return {
    response,
    agents: agentsNeeded.map(a => AGENT_LABELS[a] || a)
  };
}

module.exports = { orchestrate, detectAgents, AGENT_LABELS };
