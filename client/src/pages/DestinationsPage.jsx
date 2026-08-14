import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Filter, MessageSquare } from 'lucide-react'
import { fetchDestinations } from '../services/api'
import { getSustainabilityLabel, getCrowdLabel, getCapacityLabel } from '../utils/helpers'
import clsx from 'clsx'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'eco-tourism', label: '🌿 Eco-Tourism' },
  { value: 'culture', label: '🏛️ Culture' },
  { value: 'community tourism', label: '🏘️ Community' },
  { value: 'wildlife', label: '🦩 Wildlife' },
  { value: 'beach', label: '🌊 Beach' },
  { value: 'adventure', label: '⛰️ Adventure' },
  { value: 'heritage', label: '🏺 Heritage' },
  { value: 'spiritual', label: '🕍 Spiritual' },
]

const SORT_OPTIONS = [
  { value: 'sustainability', label: 'Sustainability Score ↓' },
  { value: 'crowd', label: 'Crowd Level ↑ (Low First)' },
  { value: 'capacity', label: 'Carrying Capacity ↑ (Low First)' },
]

function ScoreBar({ value, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all', color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-6 text-right">{value}</span>
    </div>
  )
}

function DestinationCard({ dest, onChat }) {
  const [expanded, setExpanded] = useState(false)
  const sustain = getSustainabilityLabel(dest.sustainabilityScore)
  const crowd = getCrowdLabel(dest.crowdLevel)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{dest.imageEmoji}</span>
          <div>
            <h3 className="font-semibold text-gray-100 text-sm">{dest.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{dest.region}</p>
          </div>
        </div>
        <div className={clsx(
          'text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0',
          sustain.bg, sustain.color
        )}>
          {sustain.label}
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mb-4">{dest.description}</p>

      {/* Scores */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Sustainability</span>
            <span className={sustain.color}>{dest.sustainabilityScore}</span>
          </div>
          <ScoreBar value={dest.sustainabilityScore} color={dest.sustainabilityScore >= 70 ? 'bg-eco-500' : dest.sustainabilityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'} />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Crowd Level</span>
            <span className={crowd.color}>{crowd.label}</span>
          </div>
          <ScoreBar value={dest.crowdLevel} color={dest.crowdLevel >= 76 ? 'bg-red-500' : dest.crowdLevel >= 56 ? 'bg-orange-500' : dest.crowdLevel >= 31 ? 'bg-yellow-500' : 'bg-eco-500'} />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {dest.tourismType.map(t => (
          <span key={t} className="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full capitalize">
            {t}
          </span>
        ))}
      </div>

      {/* Expand */}
      {expanded && (
        <div className="border-t border-gray-800 pt-4 mt-1 space-y-3 animate-fade-in">
          <div>
            <p className="text-xs font-semibold text-sand-400 mb-1">✨ Why Visit</p>
            <p className="text-xs text-gray-400">{dest.whyVisit}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-sand-400 mb-1">📅 Best Time</p>
            <p className="text-xs text-gray-400">{dest.recommendedVisitPeriod}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-eco-400 mb-1">🌿 Responsible Travel Tip</p>
            <p className="text-xs text-gray-400">{dest.responsibleTip}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1">🔄 Alternatives</p>
            <p className="text-xs text-gray-500">{dest.alternatives?.join(', ')}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { label: 'Water Stress', value: dest.waterStress, high: 70, mid: 50 },
              { label: 'Eco Sensitivity', value: dest.ecologicalSensitivity, high: 70, mid: 50 },
              { label: 'Community', value: dest.communityBenefit, high: 70, mid: 50, invert: true },
            ].map(m => (
              <div key={m.label} className="bg-gray-800/50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-600 mb-1">{m.label}</p>
                <p className={clsx(
                  'text-sm font-bold',
                  m.invert
                    ? (m.value >= m.high ? 'text-eco-400' : m.value >= m.mid ? 'text-yellow-400' : 'text-red-400')
                    : (m.value >= m.high ? 'text-red-400' : m.value >= m.mid ? 'text-yellow-400' : 'text-eco-400')
                )}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-4">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-1 text-xs text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-600 rounded-lg py-2 transition-colors"
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
        <button
          onClick={() => onChat(`Tell me about ${dest.name} — crowd levels, sustainability, and best way to visit.`)}
          className="flex items-center gap-1.5 text-xs text-sand-300 bg-sand-900/40 hover:bg-sand-900/70 border border-sand-800 rounded-lg px-3 py-2 transition-colors"
        >
          <MessageSquare size={12} />
          Ask AI
        </button>
      </div>
    </div>
  )
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('sustainability')
  const navigate = useNavigate()

  useEffect(() => {
    fetchDestinations()
      .then(d => setDestinations(d.destinations || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = destinations
    .filter(d => filter === 'all' || d.tourismType.includes(filter))
    .sort((a, b) => {
      if (sort === 'sustainability') return b.sustainabilityScore - a.sustainabilityScore
      if (sort === 'crowd') return a.crowdLevel - b.crowdLevel
      if (sort === 'capacity') return a.carryingCapacityScore - b.carryingCapacityScore
      return 0
    })

  function handleAskAI(prompt) {
    // Store prompt and navigate to chat
    sessionStorage.setItem('rannmitra_prompt', prompt)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex flex-wrap items-center gap-4">
        <Link to="/" className="text-gray-500 hover:text-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-100">Explore Kutch</h1>
          <p className="text-xs text-gray-500">Sustainable Destinations of Kutch, Gujarat</p>
        </div>
        <div className="ml-auto">
          <span className="text-xs text-yellow-500 bg-yellow-900/30 border border-yellow-800/40 px-3 py-1.5 rounded-full">
            Demo Data
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-gray-500" />
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={clsx(
                  'text-xs px-3 py-1.5 rounded-full border transition-colors',
                  filter === opt.value
                    ? 'bg-sand-700 border-sand-600 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-xs bg-gray-900 border border-gray-700 text-gray-400 rounded-lg px-3 py-1.5 outline-none"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500 text-sm py-20 animate-pulse">
            Loading destinations…
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 text-sm py-20">
            Failed to load destinations: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-xs text-gray-600 mb-4">{filtered.length} destination{filtered.length !== 1 ? 's' : ''} shown</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(dest => (
                <DestinationCard key={dest.id} dest={dest} onChat={handleAskAI} />
              ))}
            </div>
          </>
        )}

        <footer className="text-center text-xs text-gray-700 py-8 mt-8 border-t border-gray-800">
          All scores and data are demo/estimated for project purposes only. Not official measurements.
        </footer>
      </div>
    </div>
  )
}
