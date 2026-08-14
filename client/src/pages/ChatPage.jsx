import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import { useChat } from '../hooks/useChat'

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const {
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
  } = useChat()

  // Handle prompts forwarded from other pages (e.g. Destinations → Chat)
  useEffect(() => {
    const pending = sessionStorage.getItem('rannmitra_prompt')
    if (pending) {
      sessionStorage.removeItem('rannmitra_prompt')
      sendUserMessage(pending)
    }
  }, [])

  // Dynamically compute sidebar width for main content offset
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024
  const sidebarWidth = isDesktop ? (sidebarCollapsed ? 64 : 256) : 0

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', background: '#030712' }}>
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={setActiveId}
        onNewConversation={newConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={setSidebarCollapsed}
      />

      {/* Main content — offset for sidebar on desktop */}
      <main
        style={{
          marginLeft: sidebarWidth,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100%',
          transition: 'margin-left 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSend={sendUserMessage}
          onClear={clearMessages}
          onRegenerate={regenerateLastResponse}
          onOpenSidebar={() => setSidebarOpen(true)}
          onDismissError={() => setError(null)}
        />
      </main>
    </div>
  )
}
