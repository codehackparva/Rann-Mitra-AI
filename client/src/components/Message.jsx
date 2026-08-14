import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'
import { Copy, Check, RefreshCw, Bot, User } from 'lucide-react'
import clsx from 'clsx'

function AgentBadge({ agents }) {
  if (!agents || agents.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1 mb-2">
      {agents.map(agent => (
        <span
          key={agent}
          className="text-xs bg-sand-900/60 text-sand-400 border border-sand-800 px-2 py-0.5 rounded-full"
        >
          {agent}
        </span>
      ))}
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-gray-600 hover:text-gray-400 transition-colors p-1 rounded"
      title="Copy response"
    >
      {copied ? <Check size={14} className="text-eco-400" /> : <Copy size={14} />}
    </button>
  )
}

export default function Message({ message, onRegenerate, isLast }) {
  const isUser = message.role === 'user'

  return (
    <div className={clsx(
      'flex gap-3 px-4 py-4 animate-fade-in',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sand-700 flex items-center justify-center mt-0.5">
          <Bot size={14} className="text-white" />
        </div>
      )}

      <div className={clsx(
        'max-w-3xl',
        isUser ? 'max-w-xl' : 'flex-1'
      )}>
        {isUser ? (
          <div className="bg-sand-700/30 border border-sand-800/50 text-gray-100 rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div>
            <AgentBadge agents={message.agents} />
            <div className="prose-chat text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-3">
                      <table {...props} />
                    </div>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <CopyButton text={message.content} />
              {isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="text-gray-600 hover:text-gray-400 transition-colors p-1 rounded flex items-center gap-1 text-xs"
                  title="Regenerate response"
                >
                  <RefreshCw size={13} />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mt-0.5">
          <User size={14} className="text-gray-300" />
        </div>
      )}
    </div>
  )
}
