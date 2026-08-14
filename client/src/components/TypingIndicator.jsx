export default function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sand-700 flex items-center justify-center">
        <span className="text-xs text-white">🌵</span>
      </div>
      <div className="flex items-center gap-1 bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
        <span className="text-xs text-gray-500 mr-1">Rann Mitra is thinking</span>
        <span className="inline-flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-sand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-sand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    </div>
  )
}
