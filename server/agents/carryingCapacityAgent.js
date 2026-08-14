/**
 * Ecological Carrying Capacity Agent
 * Estimates tourism pressure relative to ecological capacity.
 * IMPORTANT: Scores are planning/demo indicators, NOT official government assessments.
 */

const { destinations } = require("../data/destinations");

function getCarryingCapacityRisk(score) {
  if (score <= 30) return { level: "Low Pressure", color: "green", action: "Encourage visits — excellent for sustainable tourism" };
  if (score <= 60) return { level: "Moderate Pressure", color: "yellow", action: "Monitor visitor numbers. Avoid peak hour visits." };
  if (score <= 80) return { level: "High Pressure", color: "orange", action: "Limit groups. Prefer off-peak. Consider alternatives." };
  return { level: "Critical Pressure", color: "red", action: "Strongly recommend visiting alternatives. Ecosystem at risk." };
}

const carryingCapacityData = destinations.map(d => ({
  ...d,
  riskAssessment: getCarryingCapacityRisk(d.carryingCapacityScore),
  mainPressureFactors: [
    d.crowdLevel > 70 ? "Very high visitor numbers" : d.crowdLevel > 50 ? "Elevated visitor numbers" : null,
    d.waterStress > 70 ? "Severe water scarcity" : d.waterStress > 50 ? "Water stress" : null,
    d.ecologicalSensitivity > 80 ? "Extremely sensitive ecosystem" : d.ecologicalSensitivity > 60 ? "Sensitive ecosystem" : null,
    d.wasteRisk > 60 ? "High waste generation risk" : null,
    d.infrastructurePressure > 70 ? "Infrastructure strain" : null,
  ].filter(Boolean)
}));

const AGENT_CONTEXT = `
You are the Ecological Carrying Capacity Agent for Rann Mitra AI.

Your job is to help users understand whether tourism pressure may exceed the ecological capacity of Kutch destinations.

IMPORTANT DISCLAIMER: All carrying capacity scores below are DEMO/PLANNING INDICATORS only. They are NOT official government ecological assessments.

Carrying Capacity Score Scale:
- 0–30 = Low Pressure ✅ (Encourage visits)
- 31–60 = Moderate Pressure 🟡 (Monitor & manage)
- 61–80 = High Pressure 🟠 (Limit & redirect)
- 81–100 = Critical Pressure 🔴 (Strongly redirect visitors)

Demo Carrying Capacity Data for Kutch Destinations:
${JSON.stringify(carryingCapacityData.map(d => ({
  name: d.name,
  carryingCapacityScore: d.carryingCapacityScore,
  riskLevel: d.riskAssessment.level,
  recommendedAction: d.riskAssessment.action,
  mainPressureFactors: d.mainPressureFactors,
  ecologicalSensitivity: d.ecologicalSensitivity,
  waterStress: d.waterStress,
  wasteRisk: d.wasteRisk,
  alternatives: d.alternatives
})), null, 2)}

When explaining carrying capacity:
1. Always display the score and risk level
2. List the main pressure factors
3. Explain what exceeding capacity means for that ecosystem type
4. Recommend concrete actions tourists and planners can take
5. Compare with lower-pressure alternatives
6. Explain the specific ecological context (salt flats, wetlands, village, coastal, heritage site)
7. Always remind users these are demo/estimated indicators
`;

function getAgentContext() {
  return AGENT_CONTEXT;
}

function getDestinationCapacity(destinationName) {
  return carryingCapacityData.find(
    d => d.name.toLowerCase().includes(destinationName.toLowerCase())
  );
}

function getAllCapacityData() {
  return carryingCapacityData;
}

module.exports = { getAgentContext, getDestinationCapacity, getAllCapacityData };
