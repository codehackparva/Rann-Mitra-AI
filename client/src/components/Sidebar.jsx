import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  MessageSquare, Plus, Trash2, Search, LayoutDashboard,
  Map, ChevronLeft, ChevronRight, Leaf, X
} from 'lucide-react'
import clsx from 'clsx'

export default function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onClose,
  collapsed,
  onToggleCollapsed,
}) {
  const [search, setSearch] = useState('')

  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const sidebarWidth = collapsed ? 64 : 256

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: sidebarWidth }}
        className={clsx(
          'fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 z-40 flex flex-col transition-all duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Header */}
        <div className={clsx(
          'flex items-center gap-3 p-4 border-b border-gray-800 flex-shrink-0',
          collapsed && 'justify-center px-2'
        )}>
          <div className="flex-shrink-0 w-8 h-8 bg-sand-600 rounded-lg flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sand-300 text-sm leading-tight">Rann Mitra AI</div>
              <div className="text-xs text-gray-500 truncate">Kutch Eco-Tourism Planner</div>
            </div>
          )}
          {/* Desktop collapse toggle */}
          <button
            onClick={() => onToggleCollapsed?.(!collapsed)}
            className="hidden lg:flex text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-300 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* New Chat */}
        <div className={clsx('p-3 border-b border-gray-800 flex-shrink-0', collapsed ? 'flex justify-center' : '')}>
          <button
            onClick={() => { onNewConversation(); onClose?.() }}
            className={clsx(
              'flex items-center gap-2 bg-sand-700 hover:bg-sand-600 text-white rounded-lg transition-colors text-sm font-medium',
              collapsed ? 'p-2' : 'w-full px-3 py-2'
            )}
            title="New Chat"
          >
            <Plus size={16} className="flex-shrink-0" />
            {!collapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Search — only when expanded */}
        {!collapsed && (
          <div className="px-3 py-2 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none flex-1 min-w-0"
              />
            </div>
          </div>
        )}

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto py-2">
          {!collapsed ? (
            <>
              {filtered.length > 0 && (
                <div className="px-3 py-1">
                  <p className="text-xs text-gray-600 uppercase font-medium tracking-wider">Recent</p>
                </div>
              )}
              {filtered.map(conv => (
                <div
                  key={conv.id}
                  className={clsx(
                    'group flex items-center gap-2 mx-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm',
                    activeId === conv.id
                      ? 'bg-gray-800 text-gray-100'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                  )}
                  onClick={() => { onSelectConversation(conv.id); onClose?.() }}
                >
                  <MessageSquare size={14} className="flex-shrink-0" />
                  <span className="flex-1 truncate">{conv.title}</span>
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteConversation(conv.id) }}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all flex-shrink-0"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {filtered.length === 0 && search && (
                <p className="text-xs text-gray-600 text-center py-4">No conversations found</p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 px-1 py-2">
              {conversations.slice(0, 8).map(conv => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  title={conv.title}
                  className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                    activeId === conv.id ? 'bg-gray-800 text-gray-100' : 'text-gray-500 hover:bg-gray-800'
                  )}
                >
                  <MessageSquare size={14} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <div className="border-t border-gray-800 p-2 flex-shrink-0">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive ? 'bg-gray-800 text-sand-300' : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200',
              collapsed && 'justify-center'
            )}
            title="Dashboard"
          >
            <LayoutDashboard size={15} className="flex-shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink
            to="/destinations"
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive ? 'bg-gray-800 text-sand-300' : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200',
              collapsed && 'justify-center'
            )}
            title="Explore Kutch"
          >
            <Map size={15} className="flex-shrink-0" />
            {!collapsed && <span>Explore Kutch</span>}
          </NavLink>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-gray-800 px-3 py-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-sand-700 flex items-center justify-center text-xs text-white flex-shrink-0">
                🌵
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 truncate">Rann Mitra AI v1.0</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-eco-500"></span>
                  Demo Mode Active
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
