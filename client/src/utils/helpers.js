export function getSustainabilityLabel(score) {
  if (score >= 90) return { label: 'Excellent', color: 'text-eco-400', bg: 'bg-eco-900/40' }
  if (score >= 75) return { label: 'Good', color: 'text-eco-400', bg: 'bg-eco-900/30' }
  if (score >= 50) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-900/30' }
  if (score >= 30) return { label: 'Needs Improvement', color: 'text-orange-400', bg: 'bg-orange-900/30' }
  return { label: 'High Impact', color: 'text-red-400', bg: 'bg-red-900/30' }
}

export function getCrowdLabel(level) {
  if (level >= 76) return { label: 'Very High', color: 'text-red-400' }
  if (level >= 56) return { label: 'High', color: 'text-orange-400' }
  if (level >= 31) return { label: 'Moderate', color: 'text-yellow-400' }
  return { label: 'Low', color: 'text-eco-400' }
}

export function getCapacityLabel(score) {
  if (score >= 81) return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-950' }
  if (score >= 61) return { label: 'High Pressure', color: 'text-orange-400', bg: 'bg-orange-950' }
  if (score >= 31) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-950' }
  return { label: 'Low Pressure', color: 'text-eco-400', bg: 'bg-eco-950' }
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}
