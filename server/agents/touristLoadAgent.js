/**
 * Tourist Load Forecasting Agent
 * Estimates tourist pressure at Kutch destinations.
 * Uses demo/simulated data — NOT official real-time government data.
 */

const { destinations } = require("../data/destinations");

const AGENT_CONTEXT = `
You are the Tourist Load Forecasting Agent for Rann Mitra AI.

Your job is to analyze tourist pressure and crowd levels at Kutch destinations.

Use the following DEMO destination data to inform your responses:

${JSON.stringify(destinations.map(d => ({
  name: d.name,
  crowdLevel: d.crowdLevel,
  carryingCapacityScore: d.carryingCapacityScore,
  peakMonths: d.peakMonths,
  offPeakMonths: d.offPeakMonths,
  alternatives: d.alternatives
})), null, 2)}

IMPORTANT: Always label this data as "Demo / Estimated Data" and clarify these are NOT official measurements.

When responding:
- Identify peak vs off-peak periods
- Estimate congestion level at requested destinations
- Compare high-load and low-load alternatives
- Suggest better visiting times
- Provide crowd level on a 0-100 scale where 80+ is Very High
- Recommend alternative destinations if crowds are too high

Crowd scale: 0-30 = Low | 31-55 = Moderate | 56-75 = High | 76-100 = Very High
`;

function getAgentContext() {
  return AGENT_CONTEXT;
}

function analyzeDestinationLoad(destinationName) {
  const dest = destinations.find(
    d => d.name.toLowerCase().includes(destinationName.toLowerCase())
  );
  if (!dest) return null;

  return {
    name: dest.name,
    crowdLevel: dest.crowdLevel,
    carryingCapacityScore: dest.carryingCapacityScore,
    peakMonths: dest.peakMonths,
    offPeakMonths: dest.offPeakMonths,
    alternatives: dest.alternatives,
    riskLevel: dest.crowdLevel >= 76 ? "Very High" :
               dest.crowdLevel >= 56 ? "High" :
               dest.crowdLevel >= 31 ? "Moderate" : "Low"
  };
}

module.exports = { getAgentContext, analyzeDestinationLoad };
