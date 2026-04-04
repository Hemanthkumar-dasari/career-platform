import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, MessageCircle, Trash2, Bot, User, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import PageWrapper from '../components/layout/PageWrapper'
import PageTransition from '../components/shared/PageTransition'
import ResponseRenderer from '../components/shared/ResponseRenderer'
import Loader from '../components/shared/Loader'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Chat() {
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const bottomRef = useRef()
  const inputRef = useRef()

  const token = localStorage.getItem('access_token')
  const headers = { Authorization: `Bearer ${token}` }

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load sessions on mount
  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true)
      const { data } = await axios.get(`${API}/api/chat/`, { headers })
      setSessions(data)
    } catch (err) {
      console.error('Failed to load chat sessions', err)
    } finally {
      setLoadingSessions(false)
    }
  }

  const loadSession = async (sessionId) => {
    try {
      const { data } = await axios.get(`${API}/api/chat/${sessionId}`, { headers })
      setActiveSessionId(data.id)
      setMessages(data.messages || [])
    } catch {
      toast.error('Failed to load conversation')
    }
  }

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation()
    try {
      await axios.delete(`${API}/api/chat/${sessionId}`, { headers })
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (activeSessionId === sessionId) {
        setActiveSessionId(null)
        setMessages([])
      }
      toast.success('Chat deleted')
    } catch {
      toast.error('Failed to delete chat')
    }
  }

  const startNewChat = () => {
    setActiveSessionId(null)
    setMessages([])
    inputRef.current?.focus()
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setStreaming(true)

    // Add placeholder for AI response
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch(`${API}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: activeSessionId || null,
          message: text,
        }),
      })

      if (!res.ok) {
        throw new Error('Chat request failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let sessionIdSet = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        // Extract session ID from first line
        if (!sessionIdSet && chunk.includes('__SESSION_ID__:')) {
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('__SESSION_ID__:')) {
              const sid = parseInt(line.split(':')[1])
              if (!isNaN(sid)) {
                setActiveSessionId(sid)
                sessionIdSet = true
              }
            } else {
              accumulated += line
            }
          }
        } else {
          accumulated += chunk
        }

        // Update the last message (AI response)
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: accumulated }
          return updated
        })
      }

      // Refresh sessions list to show new/updated session
      fetchSessions()

    } catch (err) {
      toast.error(err.message || 'Failed to send message')
      // Remove the empty AI message on error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <PageTransition>
      <PageWrapper>
        <div className="max-w-7xl mx-auto flex h-[calc(100vh-4rem)] gap-0 overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

          {/* ── Sidebar: Chat Sessions ── */}
          <div
            className="w-72 shrink-0 flex flex-col border-r border-white/8 overflow-hidden"
            style={{ background: 'rgba(8,6,18,0.6)', backdropFilter: 'blur(16px)' }}
          >
            {/* New Chat Button */}
            <div className="p-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startNewChat}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.15) 100%)',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}
              >
                <Plus className="w-4 h-4" /> New Chat
              </motion.button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
              {loadingSessions ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-slate-600 text-xs text-center py-8">No conversations yet</p>
              ) : (
                sessions.map(s => (
                  <motion.div
                    key={s.id}
                    onClick={() => loadSession(s.id)}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      activeSessionId === s.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-sm text-slate-300 truncate flex-1">{s.title}</span>
                    <button
                      onClick={(e) => deleteSession(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* ── Main Chat Area ── */}
          <div className="flex-1 flex flex-col min-w-0" style={{ background: 'rgba(5,4,14,0.4)' }}>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <Sparkles className="w-9 h-9 text-primary-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">CareerAI Chat</h2>
                    <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                      Ask me anything about careers, tech skills, resume tips, interview prep, or just chat. I'm here to help.
                    </p>

                    {/* Suggestion chips */}
                    <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-lg">
                      {[
                        'How do I switch to a tech career?',
                        'Best skills to learn in 2026?',
                        'Tips for my first dev interview',
                        'Compare frontend vs backend roles',
                      ].map(q => (
                        <motion.button
                          key={q}
                          whileHover={{ scale: 1.03, borderColor: 'rgba(99,102,241,0.5)' }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => { setInput(q); inputRef.current?.focus() }}
                          className="px-4 py-2 rounded-xl text-xs text-slate-400 transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          {q}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <>
                  <AnimatePresence>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex w-full mb-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 ${
                            msg.role === 'user'
                              ? 'bg-primary-500/15 border border-primary-500/25 text-primary-400'
                              : 'bg-purple-500/15 border border-purple-500/25 text-purple-400'
                          }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>

                          {/* Bubble */}
                          <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-primary-500/12 border border-primary-500/20 text-white rounded-tr-sm'
                              : 'border border-white/8 text-slate-200 rounded-tl-sm'
                          }`}
                          style={msg.role === 'assistant' ? { background: 'rgba(255,255,255,0.04)' } : {}}
                          >
                            {msg.role === 'assistant' ? (
                              msg.content ? (
                                <ResponseRenderer content={msg.content} />
                              ) : (
                                <div className="flex items-center gap-2 text-slate-500">
                                  <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                  </div>
                                  Thinking...
                                </div>
                              )
                            ) : (
                              <span className="whitespace-pre-wrap">{msg.content}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* ── Input Bar ── */}
            <div className="shrink-0 px-6 pb-5 pt-2">
              <div
                className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask CareerAI anything..."
                  rows={1}
                  disabled={streaming}
                  className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 resize-none outline-none max-h-32"
                  style={{ minHeight: '24px' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleSend}
                  disabled={!input.trim() || streaming}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
                  style={{
                    background: input.trim() ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.06)',
                  }}
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              <p className="text-[10px] text-slate-700 text-center mt-2">
                CareerAI can make mistakes. Verify important information.
              </p>
            </div>
          </div>

        </div>
      </PageWrapper>
    </PageTransition>
  )
}
