import { useState, useRef, useEffect } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import { useSession } from '../context/SessionContext'
import { startInterview } from '../api/interviews' // Assuming this is still used for initialization
import { consumeStream } from '../utils/useStream'
import toast from 'react-hot-toast'
import { MessageSquare, Send, Bot, ChevronRight, Sparkles } from 'lucide-react'
import ResponseRenderer from '../components/shared/ResponseRenderer'
import ChatMessage from '../components/shared/ChatMessage'
import PageTransition from '../components/shared/PageTransition'
import Loader from '../components/shared/Loader'
import SuccessConfetti from '../components/shared/SuccessConfetti'

export default function InterviewPrep() {
  const { interviewData: interviewSession, setInterviewData: setInterviewSession } = useSession()
  const [topic, setTopic] = useState(interviewSession?.topic || '')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState('')
  const [evaluationComplete, setEvaluationComplete] = useState(false)
  const bottomRef = useRef()

  const messages = interviewSession?.messages || []
  const sessionId = interviewSession?.id || null
  const started = !!interviewSession

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleStart = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await startInterview({ topic })
      setInterviewSession(data)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to start interview.')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!answer.trim()) return
    const userMsg = answer.trim()
    setAnswer('')
    
    // Optimistically add user message and an empty placeholder for the bot
    setInterviewSession(prev => ({
      ...prev,
      messages: [
        ...(prev.messages || []), 
        { role: 'user', content: userMsg },
        { role: 'assistant', content: '' }
      ]
    }))
    setLoading(true)
    
    try {
      await consumeStream(
        `${import.meta.env.VITE_API_URL}/api/interviews/answer/stream`,
        { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, user_answer: userMsg })
        },
        // We accumulate the stream directly into the last item
        (chunk) => {
          setInterviewSession(prev => {
            const newMessages = [...prev.messages];
            const lastMessageIndex = newMessages.length - 1;
            newMessages[lastMessageIndex] = {
              ...newMessages[lastMessageIndex],
              content: (newMessages[lastMessageIndex].content || '') + chunk
            }
            return { ...prev, messages: newMessages }
          })
        }
      )
    } catch (err) {
      toast.error(err.message || 'Failed to submit answer.')
      // Remove the broken bot placeholder
      setInterviewSession(prev => ({
        ...prev,
        messages: prev.messages.slice(0, -1)
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setInterviewSession(null)
    setTopic('')
    setEvaluation('')
    setIsEvaluating(false)
    setEvaluationComplete(false)
  }

  const handleEndAndEvaluate = async () => {
    if (messages.length < 2) {
      handleReset()
      return
    }
    setIsEvaluating(true)
    setEvaluation('')
    
    try {
      await consumeStream(
        `${import.meta.env.VITE_API_URL}/api/interviews/${sessionId}/evaluate/stream`,
        { method: 'POST' },
        (chunk) => setEvaluation(prev => (prev + chunk))
      )
      setEvaluationComplete(true)
    } catch (err) {
      toast.error(err.message || 'Evaluation failed.')
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <PageTransition>
      <SuccessConfetti trigger={evaluationComplete} />
      <PageWrapper>
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-6rem)] relative">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Interview Simulator</h1>
              <p className="text-slate-400 text-sm mt-1">Real-time mock interviews with an AI technical recruiter.</p>
            </div>
          </div>
          {started && !evaluation && (
            <div className="flex gap-2">
              <button 
                onClick={handleEndAndEvaluate} 
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors"
                disabled={isEvaluating}
              >
                {isEvaluating ? 'Evaluating...' : 'End & Evaluate'}
              </button>
            </div>
          )}
          {evaluation && (
            <button onClick={handleReset} className="px-4 py-2 border border-surface-border hover:bg-surface-card rounded-lg text-sm text-slate-300 transition-colors">
              New Session
            </button>
          )}
        </div>

        {!started ? (
          <div className="glass-card border border-surface-border bg-surface-card/50 backdrop-blur-xl animate-fade-in">
            <p className="text-slate-300 mb-6">
              Choose a topic. The AI will ask you questions one by one and evaluate your answers.
            </p>
            <form onSubmit={handleStart} className="flex gap-4 flex-col sm:flex-row">
              <input
                type="text"
                className="flex-1 bg-surface/50 border border-surface-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                placeholder="e.g. Python backend, React, System Design..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/25 shrink-0 flex items-center justify-center gap-2" 
                disabled={loading}
              >
                {loading && <Loader />}
                {!loading && 'Start Interview'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 relative z-10">
            <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar scroll-smooth">
              {messages.map((m, i) => (
                <ChatMessage 
                  key={i} 
                  role={m.role === 'user' ? 'candidate' : 'interviewer'} 
                  content={m.content}
                  isLatest={i === messages.length - 1} 
                />
              ))}
              <div ref={bottomRef} className="h-4" />
            </div>

            <form onSubmit={handleSend} className="pt-4 flex gap-3 shrink-0 relative bg-surface mt-auto">
              {/* Fade out mask for scrolling text */}
              <div className="absolute top-0 left-0 right-0 h-6 -mt-6 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
              
              <input
                type="text"
                className="flex-1 bg-surface-card/80 border border-surface-border rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all backdrop-blur-md shadow-lg"
                placeholder="Type your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading && !answer.trim()}
              />
              <button 
                type="submit" 
                className="w-14 h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center shrink-0"
                disabled={loading || !answer.trim()}
              >
                {!loading ? <Send className="w-5 h-5 ml-1" /> : <Loader />}
              </button>
            </form>

            {/* Evaluation Result Area */}
            {(evaluation || isEvaluating) && (
              <div className="mt-8 mb-12 animate-slide-up-1">
                <div className="glass-card p-8 border border-purple-500/30 bg-surface-card/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <MessageSquare className="w-24 h-24" />
                   </div>
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Bot className="w-6 h-6 text-purple-400" />
                      Final Performance Review
                   </h2>
                   
                   {isEvaluating && !evaluation && (
                     <div className="flex items-center gap-3 text-purple-400 mb-6 font-mono text-sm animate-pulse">
                        <Loader />
                        Analyzing conversation and generating feedback...
                     </div>
                   )}

                    <div className="prose prose-invert prose-purple max-w-none">
                       <ResponseRenderer content={evaluation} />
                    </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </PageWrapper>
    </PageTransition>
  )
}
