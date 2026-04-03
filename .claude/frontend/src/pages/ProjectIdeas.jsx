import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import { useSession } from '../context/SessionContext'
import { consumeStream } from '../utils/useStream'
import toast from 'react-hot-toast'
import { Lightbulb, Loader2 } from 'lucide-react'
import ResponseRenderer from '../components/shared/ResponseRenderer'

export default function ProjectIdeas() {
  const { projectIdeasData, setProjectIdeasData } = useSession() 
  const [form, setForm] = useState({ tech_stack: '', difficulty: 'intermediate' })
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setProjectIdeasData('') 
    try {
      await consumeStream(
        `${import.meta.env.VITE_API_URL}/api/projects/generate/stream`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
        // We accumulate the stream directly into Context
        (chunk) => setProjectIdeasData((prev) => (prev ? prev + chunk : chunk))
      )
      toast.success('Project ideas generated!')
    } catch (err) {
      toast.error(err.message || 'Failed to generate projects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Project Ideas Generator</h1>
            <p className="text-slate-400 text-sm mt-1">Get custom portfolio project ideas based on your stack.</p>
          </div>
        </div>

        <div className="card mb-8 border border-surface-border bg-surface-card/50 backdrop-blur-xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 ml-1 mb-2 block">Tech Stack</label>
              <input
                type="text"
                className="w-full bg-surface/50 border border-surface-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                placeholder="e.g. React, Node.js, MongoDB"
                value={form.tech_stack}
                onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 ml-1 mb-2 block">Difficulty</label>
              <select
                className="w-full bg-surface/50 border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Brainstorming...' : 'Generate Projects'}
            </button>
          </form>
        </div>

        {/* Live Streaming or Restored Content */}
        {(projectIdeasData || loading) && (
          <div className="card p-8 border border-surface-border bg-surface-card/60 backdrop-blur-xl animate-slide-up-1 shadow-2xl">
            {loading && !projectIdeasData && (
              <div className="flex items-center gap-3 text-primary-400 mb-6 font-mono text-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary-400" />
                Thinking of awesome projects...
              </div>
            )}
            
            <div className="prose prose-invert prose-yellow max-w-none prose-headings:font-bold prose-p:text-slate-300 prose-li:text-slate-300 prose-a:text-yellow-400">
              <ResponseRenderer content={projectIdeasData} />
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
