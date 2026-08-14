import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell, Legend
} from 'recharts'
import { fetchDashboard } from '../services/api'
import { ArrowLeft, Users, AlertTriangle, Leaf, DropletIcon } from 'lucide-react'
import clsx from 'clsx'

const COLORS = ['#e3a84e', '#22c55e', '#f97316', '#ef4444', '#6366f1', '#14b8a6', '#ec4899', '#a3a3a3']

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-1">{title}</p>
          <p className={clsx('text-2xl font-bold', color || 'text-gray-100')}>{value}</p>
          {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )
}

function AlertCard({ message, type }) {
  const styles = {
    warning: 'bg-yellow-950/40 border-yellow-800/50 text-yellow-300',
    danger: 'bg-red-950/40 border-red-800/50 text-red-300',
    info: 'bg-blue-950/40 border-blue-800/50 text-blue-300',
  }
  return (
    <div className={clsx('border rounded-lg px-4 py-3 text-sm flex items-center gap-3', styles[type] || styles.info)}>
      <AlertTriangle size={15} className="flex-shrink-0" />
      {message}
    </div>
  )
}

const customTooltipStyle = {
  backgroundColor: '#1f2937',
  border: '1px solid #374151',
  borderRadius: '8px',
  color: '#e5e7eb',
  fontSize: '12px',
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400 text-sm animate-pulse">Loading dashboard…</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-red-400 text-sm">Failed to load dashboard: {error}</div>
    </div>
  )

  const { destinations = [], touristLoadTrend = [], overview = {} } = data || {}

  const crowdData = destinations.map(d => ({
    name: d.name.split(' ').slice(0, 2).join(' '),
    crowd: d.crowdLevel,
    sustainability: d.sustainabilityScore,
    capacity: d.carryingCapacityScore,
  }))

  const waterWasteData = destinations.map(d => ({
    name: d.name.split(' ').slice(0, 2).join(' '),
    water: d.waterStress,
    waste: d.wasteRisk,
    infra: d.infrastructurePressure,
  }))

  const radarData = destinations.slice(0, 5).map(d => ({
    subject: d.name.split(' ')[0],
    Crowd: d.crowdLevel,
    Ecological: d.ecologicalSensitivity,
    Water: d.waterStress,
    Community: d.communityBenefit,
  }))

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-gray-500 hover:text-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-100">Tourism Impact Dashboard</h1>
          <p className="text-xs text-gray-500">Smart Rann of Kutch — Eco-Tourism Analytics</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-yellow-500 bg-yellow-900/30 border border-yellow-800/40 px-3 py-1.5 rounded-full">
            ⚠️ Demo / Estimated Data — Not official government statistics
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Overview Cards */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Est. Annual Visitors"
              value={(overview.totalEstimatedAnnualVisitors || 0).toLocaleString()}
              subtitle="Region-wide estimate (Demo)"
              icon="👥"
              color="text-sand-300"
            />
            <StatCard
              title="High Pressure Sites"
              value={overview.highPressureDestinations || 0}
              subtitle="Carrying capacity score > 60"
              icon="⚠️"
              color="text-orange-400"
            />
            <StatCard
              title="Avg Sustainability Score"
              value={`${overview.averageSustainabilityScore || 0}/100`}
              subtitle="Across all demo destinations"
              icon="🌿"
              color="text-eco-400"
            />
            <StatCard
              title="Critical Ecological Risk"
              value={overview.criticalEcologicalRiskCount || 0}
              subtitle="Sites with sensitivity ≥ 80"
              icon="🔴"
              color="text-red-400"
            />
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Alerts</h2>
          <div className="space-y-3">
            <AlertCard message="Demo: White Rann carrying capacity score is 82 — Critical Pressure during Rann Utsav season." type="danger" />
            <AlertCard message="Demo: Chhari Dhand Wetlands has ecological sensitivity of 95 — flamingo colonies vulnerable to noise disturbance." type="danger" />
            <AlertCard message="Demo: Mandvi Beach waste risk at 60 — consider redirecting visitors to Narayan Sarovar." type="warning" />
            <AlertCard message="Demo: January–February peak season projected to concentrate 40% of annual visitors at White Rann." type="warning" />
          </div>
        </section>

        {/* Tourist Load Trend */}
        <section>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Monthly Tourist Load Trend</h2>
            <p className="text-xs text-gray-600 mb-4">Estimated regional visitor volume — Demo Data 2024</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={touristLoadTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={v => [v.toLocaleString(), 'Visitors']}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#e3a84e"
                  strokeWidth={2.5}
                  dot={{ fill: '#e3a84e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Destination Pressure Bar Chart */}
        <section>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Destination Pressure vs Sustainability</h2>
            <p className="text-xs text-gray-600 mb-4">Crowd Level vs Sustainability Score — Demo Data</p>
            <div className="overflow-x-auto">
              <div style={{ minWidth: 600 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={crowdData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <Tooltip contentStyle={customTooltipStyle} />
                    <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                    <Bar dataKey="crowd" name="Crowd Level" fill="#e3a84e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sustainability" name="Sustainability Score" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="capacity" name="Carrying Capacity Score" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Water & Waste Pressure */}
        <section>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Water, Waste & Infrastructure Pressure</h2>
            <p className="text-xs text-gray-600 mb-4">Demo Stress Indicators by Destination</p>
            <div className="overflow-x-auto">
              <div style={{ minWidth: 600 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={waterWasteData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <Tooltip contentStyle={customTooltipStyle} />
                    <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                    <Bar dataKey="water" name="Water Stress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="waste" name="Waste Risk" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="infra" name="Infrastructure" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Destination Table */}
        <section>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">All Destinations — Impact Matrix</h2>
            <p className="text-xs text-gray-600 mb-4">Demo / Estimated Data — Not official measurements</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-xs text-gray-500 font-medium py-3 pr-4">Destination</th>
                    <th className="text-center text-xs text-gray-500 font-medium py-3 px-3">Crowd</th>
                    <th className="text-center text-xs text-gray-500 font-medium py-3 px-3">Sustainability</th>
                    <th className="text-center text-xs text-gray-500 font-medium py-3 px-3">Capacity</th>
                    <th className="text-center text-xs text-gray-500 font-medium py-3 px-3">Eco Risk</th>
                    <th className="text-center text-xs text-gray-500 font-medium py-3 px-3">Community</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((d, i) => (
                    <tr key={d.id} className={clsx('border-b border-gray-800/50', i % 2 === 0 ? '' : 'bg-gray-800/20')}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span>{d.imageEmoji}</span>
                          <div>
                            <p className="text-gray-200 font-medium text-xs">{d.name}</p>
                            <p className="text-gray-600 text-xs">{d.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={clsx(
                          'text-xs font-medium px-2 py-0.5 rounded-full',
                          d.crowdLevel >= 76 ? 'bg-red-950 text-red-400' :
                          d.crowdLevel >= 56 ? 'bg-orange-950 text-orange-400' :
                          d.crowdLevel >= 31 ? 'bg-yellow-950 text-yellow-400' :
                          'bg-eco-950 text-eco-400'
                        )}>
                          {d.crowdLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={clsx(
                          'text-xs font-medium',
                          d.sustainabilityScore >= 75 ? 'text-eco-400' :
                          d.sustainabilityScore >= 50 ? 'text-yellow-400' :
                          'text-red-400'
                        )}>
                          {d.sustainabilityScore}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={clsx(
                          'text-xs font-medium',
                          d.carryingCapacityScore >= 81 ? 'text-red-400' :
                          d.carryingCapacityScore >= 61 ? 'text-orange-400' :
                          d.carryingCapacityScore >= 31 ? 'text-yellow-400' :
                          'text-eco-400'
                        )}>
                          {d.carryingCapacityScore}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={clsx(
                          'text-xs font-medium',
                          d.ecologicalSensitivity >= 80 ? 'text-red-400' :
                          d.ecologicalSensitivity >= 60 ? 'text-orange-400' :
                          'text-eco-400'
                        )}>
                          {d.ecologicalSensitivity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={clsx(
                          'text-xs font-medium',
                          d.communityBenefit >= 75 ? 'text-eco-400' :
                          d.communityBenefit >= 50 ? 'text-yellow-400' :
                          'text-red-400'
                        )}>
                          {d.communityBenefit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-700 py-4 border-t border-gray-800">
          Rann Mitra AI — All dashboard data is demo/estimated for project purposes only.
          Not official government or scientific measurements.
        </footer>
      </div>
    </div>
  )
}
