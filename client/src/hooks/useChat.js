import { useState, useCallback, useRef } from 'react'
import { sendMessage } from '../services/api'

let conversationIdCounter = 0

function createConversation(title = 'New Chat') {
  return {
    id: ++conversationIdCounter,
    title,
    messages: [],
    createdAt: new Date().toISOString(),
  }
}

export function useChat() {
  const [conversations, setConversations] = useState(() => {
    const first = createConversation('New Chat')
    return [first]
  })
  const [activeId, setActiveId] = useState(() => conversations[0]?.id)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const activeConversation = conversations.find(c => c.id === activeId)
  const messages = activeConversation?.messages || []

  const updateConversation = useCallback((id, updater) => {
    setConversations(prev =>
      prev.map(c => c.id === id ? updater(c) : c)
    )
  }, [])

  const sendUserMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return
    setError(null)

    const userMsg = { role: 'user', content: text.trim(), id: Date.now() }
    let currentId = activeId

    // Auto-title first message
    updateConversation(currentId, conv => ({
      ...conv,
      title: conv.messages.length === 0
        ? text.trim().slice(0, 40) + (text.length > 40 ? '…' : '')
        : conv.title,
      messages: [...conv.messages, userMsg],
    }))

    setIsLoading(true)

    const history = (activeConversation?.messages || []).map(m => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const data = await sendMessage(text.trim(), history)
      const aiMsg = {
        role: 'assistant',
        content: data.response,
        agents: data.agents || [],
        id: Date.now() + 1,
      }
      updateConversation(currentId, conv => ({
        ...conv,
        messages: [...conv.messages, aiMsg],
      }))
    } catch (err) {
      setError(err.message || 'Failed to get a response. Please try again.')
      // Remove the user message on error for clean UX
      updateConversation(currentId, conv => ({
        ...conv,
        messages: conv.messages.filter(m => m.id !== userMsg.id),
      }))
    } finally {
      setIsLoading(false)
    }
  }, [activeId, activeConversation, isLoading, updateConversation])

  const newConversation = useCallback(() => {
    const conv = createConversation('New Chat')
    setConversations(prev => [conv, ...prev])
    setActiveId(conv.id)
    setError(null)
  }, [])

  const deleteConversation = useCallback((id) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id)
      if (filtered.length === 0) {
        const fresh = createConversation('New Chat')
        setActiveId(fresh.id)
        return [fresh]
      }
      if (activeId === id) setActiveId(filtered[0].id)
      return filtered
    })
  }, [activeId])

  const clearMessages = useCallback(() => {
    updateConversation(activeId, conv => ({ ...conv, messages: [] }))
    setError(null)
  }, [activeId, updateConversation])

  const regenerateLastResponse = useCallback(async () => {
    const msgs = activeConversation?.messages || []
    if (msgs.length < 2) return
    const lastUser = [...msgs].reverse().find(m => m.role === 'user')
    if (!lastUser) return
    // Remove last assistant message
    updateConversation(activeId, conv => ({
      ...conv,
      messages: conv.messages.filter(m => m !== msgs[msgs.length - 1]),
    }))
    await sendUserMessage(lastUser.content)
  }, [activeConversation, activeId, updateConversation, sendUserMessage])

  return {
    conversations,
    activeId,
    messages,
    isLoading,
    error,
    setActiveId,
    sendUserMessage,
    newConversation,
    deleteConversation,
    clearMessages,
    regenerateLastResponse,
    setError,
  }
}
