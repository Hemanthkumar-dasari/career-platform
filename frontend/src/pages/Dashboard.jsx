import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageWrapper from '../components/layout/PageWrapper'
import { Map, Lightbulb, FileText, MessageSquare, ArrowRight, TrendingUp, Send, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Hero3D from '../components/shared/Hero3D'
import axios from 'axios'
import PageTransition from '../components/shared/PageTransition'
import Loader from '../components/shared/Loader'
import AnimatedCounter from '../components/shared/AnimatedCounter'

const tools = [
  {
    to: '/learning-paths',
    id: 'paths',
    icon: Map,
    title: 'Learning Paths',
    desc: 'Generate a personalised AI roadmap for your career goal.',
    gradient: 'from-blue-600/20 to-cyan-500/20',
    border: 'hover:border-blue-500/50',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10'
  },
  {
    to: '/project-ideas',
    id: 'projects',
    icon: Lightbulb,
    title: 'Project Ideas',
    desc: 'Get curated project ideas based on your tech stack.',
    gradient: 'from-yellow-600/20 to-orange-500/20',
    border: 'hover:border-yellow-500/50',
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10'
  },
  {
    to: '/resume-analyzer',
    id: 'resumes',
    icon: FileText,
    title: 'Resume Analyzer',
    desc: 'Upload your resume and receive AI-powered feedback.',
    gradient: 'from-green-600/20 to-emerald-500/20',
    border: 'hover:border-green-500/50',
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/10'
  },
  {
    to: '/interview-prep',
    id: 'interviews',
    icon: MessageSquare,
    title: 'Interview Prep',
    desc: 'Practice mock technical interviews with an AI interviewer.',
    gradient: 'from-purple-600/20 to-fuchsia-500/20',
    border: 'hover:border-purple-500/50',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10'
  },
]

const activityData = [
  { name: 'Mon', queries: 2 },
  { name: 'Tue', queries: 5 },
  { name: 'Wed', queries: 3 },
  { name: 'Thu', queries: 8 },
  { name: 'Fri', queries: 6 },
  { name: 'Sat', queries: 12 },
  { name: 'Sun', queries: 15 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 15 }
  }
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ paths: 0, resumes: 0, interviews: 0, projects: 0 })
  const [loading, setLoading] = useState(true)
  const firstName = user?.full_name?.split(' ')[0] || 'Guest'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const { data } = await axios.get(`${api}/api/stats/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <PageTransition>
      <PageWrapper>
      <motion.div 
        className="max-w-7xl mx-auto space-y-12 pb-12 overflow-hidden px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* --- Hero Section --- */}
        <motion.section 
          variants={itemVariants}
          className="relative rounded-3xl overflow-hidden border border-surface-border bg-surface-card/40 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row min-h-[450px]"
        >
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 drop-shadow-sm leading-tight">
              Elevate your career trajectory, <br/>
              <span className="bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">{firstName}.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-md">
              Your intelligent AI co-pilot is ready to analyze your resume, plot a customized learning path, and simulate technical interviews.
            </p>
            <div className="flex flex-wrap gap-4">
               <Link to="/learning-paths" className="px-8 py-3 bg-white text-surface hover:bg-slate-200 font-bold rounded-xl shadow-lg shadow-white/10 transition-all flex items-center justify-center">
                 Get Started
               </Link>
               <Link to="/history" className="px-8 py-3 bg-surface/50 border border-surface-border hover:bg-surface text-white font-medium rounded-xl backdrop-blur-md transition-all flex items-center gap-2">
                 <Clock className="w-4 h-4" /> View History
               </Link>
            </div>
          </div>

          <div className="relative w-full lg:w-1/2 h-[350px] lg:h-auto border-t lg:border-t-0 lg:border-l border-surface-border/50 bg-black/20">
             <Hero3D />
          </div>
        </motion.section>

        {/* --- Stats Overview --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div variants={itemVariants} className="glass-card p-6 flex items-center justify-center">
            <AnimatedCounter end={stats.paths || 0} label="Roadmaps Generated" />
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card p-6 flex items-center justify-center">
            <AnimatedCounter end={stats.projects || 0} label="Project Ideas" />
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card p-6 flex items-center justify-center">
            <AnimatedCounter end={stats.resumes || 0} label="Resumes Analyzed" />
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card p-6 flex items-center justify-center">
            <AnimatedCounter end={stats.interviews || 0} label="Interviews Done" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Tools Grid --- */}
          <div className="lg:col-span-2 space-y-6">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white flex items-center gap-2">
              Toolkit
            </motion.h2>
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tools.map(({ to, icon: Icon, title, desc, gradient, border, iconColor, iconBg }) => (
                <Link
                  key={to}
                  to={to}
                  className={`group relative overflow-hidden rounded-2xl p-6 border border-surface-border bg-gradient-to-br ${gradient} backdrop-blur-md transition-all duration-300 ${border} hover:-translate-y-1 hover:shadow-2xl hover:shadow-${iconColor.split('-')[1]}-500/20 flex flex-col h-full bg-surface-card/60`}
                >
                  <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10`}>
                    <Icon className={`w-7 h-7 ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <h2 className="font-bold text-white text-xl mb-2">{title}</h2>
                  <p className="text-slate-400 text-sm flex-1 leading-relaxed">{desc}</p>
                  <div className={`flex items-center gap-2 ${iconColor} text-sm font-medium mt-6 group-hover:gap-3 transition-all`}>
                    Launch Tool <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>

          {/* --- Analytics --- */}
          <motion.div id="activity" variants={itemVariants} className="lg:col-span-1 space-y-6 flex flex-col">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
               Activity <TrendingUp className="w-5 h-5 text-primary-400" />
            </h2>
            <div className="flex-1 rounded-3xl border border-surface-border bg-surface-card/40 backdrop-blur-xl p-6 flex flex-col shadow-xl min-h-[300px]">
               <div className="mb-6">
                 <h3 className="text-slate-400 text-sm font-medium">Growth Index</h3>
                 <div className="text-3xl font-bold text-white mt-1">Ready <span className="text-primary-400 text-sm font-semibold ml-2">to scale</span></div>
               </div>
               
               <div className="flex-1 min-h-[200px] w-full -ml-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }}
                         itemStyle={{ color: '#c084fc' }}
                      />
                      <Area type="monotone" dataKey="queries" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </motion.div>
        </div>

        {/* --- Feedback --- */}
        <motion.section variants={itemVariants} className="border border-surface-border bg-surface-card/30 backdrop-blur-xl rounded-3xl p-8 sm:p-12 mt-12 shadow-xl">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Need Support?</h2>
            <p className="text-slate-400 text-sm">Send us a message and our team will get back to you shortly.</p>
          </div>
          <form className="max-w-2xl mx-auto space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input 
                type="text" 
                className="w-full bg-surface/50 border border-surface-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all"
                placeholder="Name"
              />
              <input 
                type="email" 
                className="w-full bg-surface/50 border border-surface-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all"
                placeholder="Email"
              />
            </div>
            <textarea 
              rows="4" 
              className="w-full bg-surface/50 border border-surface-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all resize-none"
              placeholder="Message"
            ></textarea>
            <button 
              type="submit" 
              className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 ml-auto shadow-lg shadow-primary-500/25"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </motion.section>
      </motion.div>
      </PageWrapper>
    </PageTransition>
  )
}
