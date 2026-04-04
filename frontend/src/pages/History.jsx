import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { useSession } from '../context/SessionContext'
import { Clock, Map, FileText, Lightbulb, MessageSquare, ChevronRight, Search, Trash2, ArrowUpAz, ArrowDownZa } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import PageTransition from '../components/shared/PageTransition'
import Loader from '../components/shared/Loader'

const TAB_CONFIG = [
  { id: 'paths', label: 'Learning Paths', icon: Map, color: 'text-blue-400', bg: 'bg-blue-500/10', endpoint: '/api/paths' },
  { id: 'resumes', label: 'Resume Analyses', icon: FileText, color: 'text-green-400', bg: 'bg-green-500/10', endpoint: '/api/resumes' },
  { id: 'projects', label: 'Project Ideas', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10', endpoint: '/api/projects' },
  { id: 'interviews', label: 'Interview Prep', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10', endpoint: '/api/interviews' },
]

export default function History() {
  const [activeTab, setActiveTab] = useState('paths')
  const [data, setData] = useState({ paths: [], resumes: [], projects: [], interviews: [] })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('desc') // 'desc' or 'asc'
  const { setLearningPathData, setResumeData, setProjectIdeasData, setInterviewData } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    const token = localStorage.getItem('access_token')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    try {
      const [paths, resumes, projects, interviews] = await Promise.all([
        axios.get(`${api}/api/paths/`, config),
        axios.get(`${api}/api/resumes/`, config),
        axios.get(`${api}/api/projects/`, config),
        axios.get(`${api}/api/interviews/`, config),
      ])

      setData({
        paths: paths.data,
        resumes: resumes.data,
        projects: projects.data,
        interviews: interviews.data,
      })
    } catch (err) {
      toast.error('Failed to load history items.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (e, item) => {
    e.stopPropagation()
    if (!window.confirm('Delete this record forever?')) return

    const tab = TAB_CONFIG.find(t => t.id === activeTab)
    const token = localStorage.getItem('access_token')
    const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    
    try {
      await axios.delete(`${api}${tab.endpoint}/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Record deleted.')
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(i => i.id !== item.id)
      }))
    } catch (err) {
      toast.error('Failed to delete record.')
    }
  }

  const handleRevisit = (item) => {
    if (activeTab === 'paths') {
      setLearningPathData(item.milestones?.markdown || '')
      navigate('/learning-paths')
    } else if (activeTab === 'resumes') {
      setResumeData(item.feedback?.markdown || '')
      navigate('/resume-analyzer')
    } else if (activeTab === 'projects') {
      setProjectIdeasData(item.content || '')
      navigate('/project-ideas')
    } else if (activeTab === 'interviews') {
      setInterviewData(item)
      navigate('/interview-prep')
    }
  }

  const filteredAndSortedItems = useMemo(() => {
    let items = [...data[activeTab]]
    
    // Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(item => 
        (item.title || item.target_role || item.topic || item.filename || '').toLowerCase().includes(q)
      )
    }

    // Sort
    items.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

    return items
  }, [data, activeTab, searchQuery, sortOrder])

  return (
    <PageTransition>
      <PageWrapper>
      <div className="max-w-5xl mx-auto pb-12 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
              <Clock className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Your History</h1>
              <p className="text-slate-400 text-sm mt-1">Manage your past AI insights.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400" />
              <input 
                type="text" 
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-card/50 border border-surface-border rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition-all w-[200px] md:w-[250px]"
              />
            </div>
            <button 
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-2 bg-surface-card/50 border border-surface-border rounded-xl text-slate-400 hover:text-white transition-all"
              title={sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            >
              {sortOrder === 'desc' ? <ArrowDownZa className="w-5 h-5" /> : <ArrowUpAz className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-surface-card/50 border border-surface-border rounded-2xl w-fit">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery('') }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
              {tab.label}
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-surface text-slate-500'
              }`}>
                {data[tab.id].length}
              </span>
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-4">
          {loading && <Loader />}
          {!loading && filteredAndSortedItems.length === 0 ? (
            <div className="glass-card text-center py-20 border-dashed bg-transparent border-surface-border">
              <div className="w-16 h-16 rounded-full bg-surface-card flex items-center justify-center mx-auto mb-4 border border-surface-border">
                {(() => {
                  const Icon = TAB_CONFIG.find(t => t.id === activeTab).icon
                  return <Icon className="w-8 h-8 text-slate-600" />
                })()}
              </div>
              <h3 className="text-lg font-semibold text-slate-200">No items found</h3>
              <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                {searchQuery ? `No records match "${searchQuery}"` : `You haven't generated any ${TAB_CONFIG.find(t => t.id === activeTab).label.toLowerCase()} yet.`}
              </p>
            </div>
          ) : (
            filteredAndSortedItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleRevisit(item)}
                className="group card p-5 flex items-center justify-between border border-surface-border hover:border-primary-500/50 hover:bg-surface-card/80 transition-all cursor-pointer animate-fade-in relative overflow-hidden"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 shadow-inner ${TAB_CONFIG.find(t => t.id === activeTab).bg}`}>
                     {(() => {
                        const Icon = TAB_CONFIG.find(t => t.id === activeTab).icon
                        return <Icon className={`w-6 h-6 ${TAB_CONFIG.find(t => t.id === activeTab).color}`} />
                     })()}
                  </div>
                  <div>
                    <h4 className="text-white font-bold tracking-tight text-lg group-hover:text-primary-400 transition-colors">
                      {item.title || item.target_role || item.topic || item.filename || 'Untitled Record'}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-slate-500 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {item.difficulty && <span className="uppercase tracking-widest text-[9px] px-1.5 py-0.5 rounded bg-surface border border-surface-border">{item.difficulty}</span>}
                      {item.target_job && <span className="truncate max-w-[150px]">Target: {item.target_job}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => handleDeleteItem(e, item)}
                    className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-primary-500 transition-all group-hover:translate-x-1" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </PageWrapper>
    </PageTransition>
  )
}
