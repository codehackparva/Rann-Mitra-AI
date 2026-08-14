import { useEffect, useRef } from 'react'
import { Trash2, Menu } from 'lucide-react'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import WelcomeScreen from './WelcomeScreen'
import ChatInput from './ChatInput'
import clsx from 'clsx'

export default function ChatArea({
  messages,
  isLoading,
  error,
  onSend,
  onClear,
  onRegenerate,
  onOpenSidebar,
  onDismissError,
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const showWelcome = messages.length === 0 && !isLoading

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        style={{ flexShrink: 0 }}
        className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-gray-100 leading-tight">Rann Mitra AI</h1>
            <p className="text-xs text-gray-500">Smart Kutch Eco-Tourism Planner</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-900 px-2.5 py-1 rounded-full border border-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
            Demo Data
          </span>
          {messages.length > 0 && (
            <button
              onClick={onClear}
              className="text-gray-600 hover:text-gray-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
              title="Clear conversation"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </header>

      {/* ── Messages ───────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {showWelcome ? (
          <WelcomeScreen onSelectPrompt={onSend} />
        ) : (
          <div style={{ maxWidth: '768px', margin: '0 auto', paddingBottom: '16px' }}>
            {messages.map((msg, i) => (
              <Message
                key={msg.id || i}
                message={msg}
                onRegenerate={
                  i === messages.length - 1 && msg.role === 'assistant'
                    ? onRegenerate
                    : null
                }
                isLast={i === messages.length - 1}
              />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div style={{ maxWidth: '768px', margin: '0 auto', padding: '8px 16px' }}>
            <div className="flex items-start gap-3 bg-red-950/60 border border-red-800/60 text-red-300 rounded-xl px-4 py-3 text-sm animate-fade-in">
              <span className="text-red-400 mt-0.5 text-base">⚠️</span>
              <div className="flex-1">
                {error.split('\n').map((line, i) => (
                  <p key={i} className={i === 0 ? 'font-semibold' : 'text-red-400 text-xs mt-1 font-mono'}>
                    {line}
                  </p>
                ))}
              </div>
              <button
                onClick={onDismissError}
                className="text-red-600 hover:text-red-400 flex-shrink-0 ml-2 text-base leading-none"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ──────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0 }}>
        <ChatInput onSend={onSend} isLoading={isLoading} disabled={false} />
      </div>
    </div>
  )
}
