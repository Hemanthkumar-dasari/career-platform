import { useState, useRef } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import { useSession } from '../context/SessionContext'
import { consumeStream } from '../utils/useStream'
import toast from 'react-hot-toast'
import { FileText, Upload, Zap, Loader2 } from 'lucide-react'
import ResponseRenderer from '../components/shared/ResponseRenderer'

export default function ResumeAnalyzer() {
  const { resumeData, setResumeData } = useSession()
  const [file, setFile] = useState(null)
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (f?.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted.')
      return
    }
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Please upload a PDF resume.')
    setLoading(true)
    setResumeData('') // Clear old analysis

    const fd = new FormData()
    fd.append('file', file)
    fd.append('target_role', targetRole)

    try {
      await consumeStream(
        `${import.meta.env.VITE_API_URL}/api/resumes/analyze/stream`,
        { method: 'POST', body: fd },
        (chunk) => setResumeData((prev) => (prev ? prev + chunk : chunk))
      )
      toast.success('Analysis complete!')
    } catch (err) {
      toast.error(err.message || 'Analysis failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <FileText className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Resume Analyzer</h1>
            <p className="text-slate-400 text-sm mt-1">AI-powered critique specific to your target job role.</p>
          </div>
        </div>

        <div className="card mb-8 border border-surface-border bg-surface-card/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors border-surface-border hover:border-primary-500/50 ${
                dragging ? 'bg-primary-500/5 border-primary-500' : 'bg-surface/50'
              }`}
            >
              <input ref={inputRef} type="file" accept=".pdf" className="hidden"
                onChange={(e) => handleFile(e.target.files[0])} />
              <Upload className="w-10 h-10 mx-auto mb-3 text-slate-500" />
              {file ? (
                <p className="text-green-400 font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="text-slate-300 font-medium">Drag & drop your PDF resume here</p>
                  <p className="text-slate-500 text-sm mt-1">or click to browse — max 5 MB</p>
                </>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 ml-1 mb-2 block">Target Role</label>
              <input 
                type="text" 
                className="w-full bg-surface/50 border border-surface-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" 
                placeholder="e.g. Senior Backend Engineer"
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)} 
                required 
              />
            </div>

            <button 
              type="submit" 
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              disabled={loading || !file}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? 'Analyzing your profile...' : 'Analyze Resume'}
            </button>
          </form>
        </div>

        {/* Live Streaming or Restoring Content */}
        {(resumeData || loading) && (
          <div className="card p-8 border border-surface-border bg-surface-card/60 backdrop-blur-xl animate-slide-up-1 shadow-2xl">
            {loading && !resumeData && (
              <div className="flex items-center gap-3 text-primary-400 mb-6 font-mono text-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Extracting and evaluating skills...
              </div>
            )}
            
            <div className="prose prose-invert prose-green max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-p:text-slate-300 prose-li:text-slate-300 prose-a:text-green-400">
              <ResponseRenderer content={resumeData} />
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
