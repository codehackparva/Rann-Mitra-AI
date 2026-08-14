const SUGGESTED_PROMPTS = [
  {
    icon: "🗺️",
    label: "Plan a sustainable 3-day Kutch trip",
    prompt: "Plan a sustainable 3-day Kutch trip for a couple who love nature and local culture."
  },
  {
    icon: "👥",
    label: "What are the less crowded places in Kutch?",
    prompt: "What are the less crowded places in Kutch that are still worth visiting?"
  },
  {
    icon: "⏰",
    label: "Which places to avoid during peak hours?",
    prompt: "Which places in Kutch should I avoid during peak hours and when is the best time to visit them?"
  },
  {
    icon: "🌿",
    label: "Suggest eco-friendly places near the Rann",
    prompt: "Suggest eco-friendly and sustainable places to visit near the White Rann of Kutch."
  },
  {
    icon: "🎨",
    label: "Help me explore local artisans",
    prompt: "Help me explore local artisan crafts and community tourism experiences in Kutch."
  },
  {
    icon: "🌍",
    label: "What is the ecological impact of Rann Utsav?",
    prompt: "What is the ecological impact of Rann Utsav on the White Rann ecosystem? How can tourists minimize their impact?"
  },
  {
    icon: "👨‍👩‍👧",
    label: "Create a low-impact itinerary for my family",
    prompt: "Create a low-impact, family-friendly itinerary for Kutch for 4 days with kids."
  },
  {
    icon: "📊",
    label: "Which destinations have high tourist pressure?",
    prompt: "Which destinations in Kutch have the highest tourist pressure and what are their low-pressure alternatives?"
  }
]

export default function WelcomeScreen({ onSelectPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-sand-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🌵</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">
          How can Rann Mitra help you?
        </h1>
        <p className="text-gray-400 text-sm max-w-md">
          Your AI-powered sustainable tourism companion for Kutch, Gujarat.
          Ask about itineraries, crowd levels, ecology, crafts, and more.
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-yellow-900/30 border border-yellow-700/40 text-yellow-500 text-xs px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block"></span>
          Demo Data Mode Active
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {SUGGESTED_PROMPTS.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectPrompt(item.prompt)}
            className="flex items-start gap-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl px-4 py-3 text-left transition-all group"
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
            <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors leading-relaxed">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
