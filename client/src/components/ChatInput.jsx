import { useState, useRef } from 'react'
import { Send, Square } from 'lucide-react'
import clsx from 'clsx'

export default function ChatInput({ onSend, isLoading, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleInput(e) {
    setValue(e.target.value)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
    }
  }

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div className={clsx(
          'flex items-end gap-3 bg-gray-800 border rounded-2xl px-4 py-3 transition-colors',
          disabled ? 'border-gray-700 opacity-60' : 'border-gray-700 focus-within:border-sand-600'
        )}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            placeholder="Ask anything about sustainable travel in Kutch…"
            rows={1}
            className={clsx(
              'flex-1 bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none text-sm leading-relaxed',
              'min-h-[24px] max-h-[200px]'
            )}
          />
          <div className="flex items-center gap-2 flex-shrink-0 pb-0.5">
            {value.length > 200 && (
              <span className={clsx(
                'text-xs',
                value.length > 3800 ? 'text-red-400' : 'text-gray-500'
              )}>
                {value.length}/4000
              </span>
            )}
            <button
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              className={clsx(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                value.trim() && !disabled && !isLoading
                  ? 'bg-sand-600 hover:bg-sand-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <Square size={14} className="fill-current" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-700 mt-2">
          Rann Mitra AI uses demo/estimated data for planning purposes only. Not official government data.
        </p>
      </div>
    </div>
  )
}
