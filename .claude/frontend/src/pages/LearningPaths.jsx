import { useState, useEffect } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import { useSession } from '../context/SessionContext'
import { consumeStream } from '../utils/useStream'
import toast from 'react-hot-toast'
import { Map, Loader2 } from 'lucide-react'
import ResponseRenderer from '../components/shared/ResponseRenderer'

export default function LearningPaths() {
  const { learningPathData, setLearningPathData } = useSession() // the global session
  const [form, setForm] = useState({ current_skills: '', target_job: '' })
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLearningPathData('') // clear context before starting new one
    try {
      const token = localStorage.getItem('access_token') 
      await consumeStream(
        `${import.meta.env.VITE_API_URL}/api/paths/generate/stream`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
          body: JSON.stringify(form),
        },
        // We accumulate the stream directly into Context
        (chunk) => setLearningPathData((prev) => (prev ? prev + chunk : chunk))
      )
      toast.success('Roadmap generated!')
    } catch (err) {
      toast.error(err.message || 'Failed to generate path.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Map className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Learning Path Generator</h1>
            <p className="text-slate-400 text-sm mt-1">Get an AI-generated roadmap to hit your career goals.</p>
          </div>
        </div>

        <div className="card mb-8 border border-surface-border bg-surface-card/50 backdrop-blur-xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 ml-1 mb-2 block">Current Skills</label>
              <textarea
                className="w-full bg-surface/50 border border-surface-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
                rows={3}
                placeholder="e.g. HTML, CSS, basic JavaScript, some React..."
                value={form.current_skills}
                onChange={(e) => setForm({ ...form, current_skills: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 ml-1 mb-2 block">Target Job Role</label>
              <input
                type="text"
                className="w-full bg-surface/50 border border-surface-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                placeholder="e.g. Senior Full-Stack Engineer at a SaaS startup"
                value={form.target_job}
                onChange={(e) => setForm({ ...form, target_job: e.target.value })}
                required
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Consulting AI...' : 'Generate Roadmap'}
            </button>
          </form>
        </div>

        {/* Live Streaming or Restored Content */}
        {(learningPathData || loading) && (
          <div className="card p-8 border border-surface-border bg-surface-card/60 backdrop-blur-xl animate-slide-up-1 shadow-2xl">
            {loading && !learningPathData && (
              <div className="flex items-center gap-3 text-primary-400 mb-6 font-mono text-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary-400" />
                Planning your career trajectory...
              </div>
            )}
            
            <div className="prose prose-invert prose-blue max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-p:text-slate-300 prose-li:text-slate-300 prose-a:text-blue-400">
              <ResponseRenderer content={learningPathData} />
            </div>
            
            {loading && learningPathData && (
              <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm italic">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping" />
                Generating...
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
