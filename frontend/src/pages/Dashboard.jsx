import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageWrapper from '../components/layout/PageWrapper'
import { Map, Lightbulb, FileText, MessageSquare, ArrowRight, TrendingUp, Send, Clock, Sparkles, Zap } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Hero3D from '../components/shared/Hero3D'
import axios from 'axios'
import PageTransition from '../components/shared/PageTransition'
import AnimatedCounter from '../components/shared/AnimatedCounter'

// ─── Data ───────────────────────────────────────────────────────────────────

const tools = [
  {
    to: '/learning-paths',
    icon: Map,
    title: 'Learning Paths',
    desc: 'Generate a personalised AI roadmap for your career goal.',
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.25)',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(6,182,212,0.08) 100%)',
    border: 'rgba(59,130,246,0.3)',
  },
  {
    to: '/project-ideas',
    icon: Lightbulb,
    title: 'Project Ideas',
    desc: 'Get curated project ideas based on your tech stack.',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.25)',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
    border: 'rgba(245,158,11,0.3)',
  },
  {
    to: '/resume-analyzer',
    icon: FileText,
    title: 'Resume Analyzer',
    desc: 'Upload your resume and receive AI-powered feedback.',
    accent: '#10b981',
    glow: 'rgba(16,185,129,0.25)',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)',
    border: 'rgba(16,185,129,0.3)',
  },
  {
    to: '/interview-prep',
    icon: MessageSquare,
    title: 'Interview Prep',
    desc: 'Practice mock technical interviews with an AI interviewer.',
    accent: '#a855f7',
    glow: 'rgba(168,85,247,0.25)',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(236,72,153,0.08) 100%)',
    border: 'rgba(168,85,247,0.3)',
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

// ─── Floating Orbs Background ───────────────────────────────────────────────

function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {[
        { w: 600, h: 600, x: '-10%', y: '-15%', color: 'rgba(99,102,241,0.07)', delay: 0, dur: 18 },
        { w: 500, h: 500, x: '60%', y: '10%', color: 'rgba(168,85,247,0.06)', delay: 3, dur: 22 },
        { w: 400, h: 400, x: '20%', y: '60%', color: 'rgba(6,182,212,0.05)', delay: 6, dur: 26 },
        { w: 350, h: 350, x: '80%', y: '70%', color: 'rgba(16,185,129,0.05)', delay: 2, dur: 20 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orb.w, height: orb.h,
            left: orb.x, top: orb.y,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.15, 0.95, 1],
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            delay: orb.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Magnetic Tool Card ──────────────────────────────────────────────────────

function MagneticToolCard({ tool, index }) {
  const { to, icon: Icon, title, desc, accent, glow, gradient, border } = tool
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-60, 60], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-60, 60], [-6, 6]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.6, type: 'spring', stiffness: 80 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      <Link
        to={to}
        className="group relative flex flex-col h-full rounded-2xl p-6 overflow-hidden transition-all duration-300"
        style={{
          background: gradient,
          border: `1px solid ${border}`,
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${glow} 50%, transparent 60%)`,
            backgroundSize: '200% 100%',
          }}
          initial={{ backgroundPosition: '-100% 0' }}
          whileHover={{ backgroundPosition: '200% 0' }}
          transition={{ duration: 0.6 }}
        />

        {/* Glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: `inset 0 0 40px ${glow}, 0 0 30px ${glow}` }}
        />

        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 relative z-10"
          style={{ background: `${accent}1a`, border: `1px solid ${accent}30` }}
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon className="w-6 h-6" style={{ color: accent }} />
        </motion.div>

        <h3 className="font-bold text-white text-lg mb-2 relative z-10">{title}</h3>
        <p className="text-slate-400 text-sm flex-1 leading-relaxed relative z-10">{desc}</p>

        <motion.div
          className="flex items-center gap-2 text-sm font-medium mt-5 relative z-10"
          style={{ color: accent }}
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          Launch Tool <ArrowRight className="w-4 h-4" />
        </motion.div>
      </Link>
    </motion.div>
  )
}

// ─── Ultra Stat Card (flip + burst + shimmer + conic border) ─────────────────

function StatCard({ end, label, accent, delay }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [flipped, setFlipped] = useState(false)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), delay * 1000 + 400)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (flipped) {
      const t = setTimeout(() => setBurst(true), 600)
      return () => clearTimeout(t)
    }
  }, [flipped])

  const particles = Array.from({ length: 8 }, (_, i) => ({
    angle: (i / 8) * 360,
    dist: 38 + Math.random() * 18,
    size: 3 + Math.random() * 3,
  }))

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.06, y: -4 }}
      className="relative rounded-2xl overflow-hidden cursor-default"
      style={{ perspective: 1000 }}
    >
      {/* ── Rotating conic border ── */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${accent} 20%, transparent 40%, transparent 60%, ${accent} 80%, transparent 100%)`,
          padding: '1.5px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── 3D flip card ── */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 0 : 180 }}
        initial={{ rotateY: 180 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="p-6 flex flex-col items-center justify-center text-center rounded-2xl min-h-[120px]"
          style={{
            background: `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)`,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `linear-gradient(105deg, transparent 30%, ${accent}30 50%, transparent 70%)`,
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
          />

          {/* Particle burst */}
          <AnimatePresence>
            {burst && particles.map((p, i) => {
              const rad = (p.angle * Math.PI) / 180
              const tx = Math.cos(rad) * p.dist
              const ty = Math.sin(rad) * p.dist
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: p.size, height: p.size,
                    background: accent,
                    left: '50%', top: '50%',
                    marginLeft: -p.size / 2, marginTop: -p.size / 2,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.03 }}
                  onAnimationComplete={() => i === 7 && setBurst(false)}
                />
              )
            })}
          </AnimatePresence>

          {/* Number */}
          <motion.div
            className="text-4xl font-extrabold text-white mb-1 relative z-10 tabular-nums"
            animate={isInView ? { scale: [1, 1.15, 1] } : {}}
            transition={{ delay: delay + 0.8, duration: 0.4 }}
          >
            <AnimatedCounter end={end || 0} />
          </motion.div>

          {/* Label */}
          <div
            className="text-xs font-semibold uppercase tracking-widest relative z-10"
            style={{ color: accent }}
          >
            {label}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Typewriter Greeting ─────────────────────────────────────────────────────

function TypewriterGreeting({ name }) {
  const full = `Welcome back, ${name}.`
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setDisplayed(full.slice(0, i + 1))
      i++
      if (i >= full.length) { clearInterval(timer); setDone(true) }
    }, 45)
    return () => clearInterval(timer)
  }, [full])

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-8 bg-primary-400 ml-1 align-middle"
        />
      )}
    </span>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

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
          headers: { Authorization: `Bearer ${token}` },
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

  const sectionReveal = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <PageTransition>
      <PageWrapper>
        <FloatingOrbs />

        <div className="relative z-10 max-w-7xl mx-auto space-y-14 pb-16 px-4">

          {/* ── Hero ──────────────────────────────────────────── */}
          <motion.section
            variants={sectionReveal}
            initial="hidden"
            animate="visible"
            className="relative rounded-3xl overflow-hidden border border-white/8 shadow-2xl flex flex-col lg:flex-row min-h-[440px]"
            style={{
              background: 'linear-gradient(135deg, rgba(15,15,25,0.95) 0%, rgba(20,10,35,0.95) 100%)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Grid texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Animated gradient border top */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, #6366f1, #a855f7, #06b6d4, transparent)',
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Text side */}
            <div className="relative z-10 w-full lg:w-1/2 p-8 sm:p-14 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-2 mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4 text-primary-400" />
                </motion.div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-400">AI Career Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight"
              >
                <TypewriterGreeting name={firstName} />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="text-slate-400 text-base mb-10 max-w-md leading-relaxed"
              >
                Your AI co-pilot is ready — analyze your resume, chart a learning path, and simulate real interviews.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/learning-paths">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-white/10 transition-colors hover:bg-slate-100"
                  >
                    <Zap className="w-4 h-4" /> Get Started
                  </motion.button>
                </Link>
                <Link to="/history">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3 border border-white/15 text-white font-medium rounded-xl flex items-center gap-2 backdrop-blur-md hover:bg-white/5 transition-all"
                  >
                    <Clock className="w-4 h-4" /> View History
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* 3D side */}
            <div className="relative w-full lg:w-1/2 h-[320px] lg:h-auto border-t lg:border-t-0 lg:border-l border-white/8">
              <Hero3D />
            </div>
          </motion.section>

          {/* ── Stats ─────────────────────────────────────────── */}
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            <StatCard end={stats.paths} label="Roadmaps" accent="#6366f1" delay={0.1} />
            <StatCard end={stats.projects} label="Projects" accent="#f59e0b" delay={0.2} />
            <StatCard end={stats.resumes} label="Resumes" accent="#10b981" delay={0.3} />
            <StatCard end={stats.interviews} label="Interviews" accent="#a855f7" delay={0.4} />
          </motion.div>

          {/* ── Toolkit + Activity ───────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Toolkit */}
            <div className="lg:col-span-2 space-y-6">
              <motion.h2
                variants={sectionReveal}
                initial="hidden"
                animate="visible"
                className="text-xl font-bold text-white tracking-tight"
              >
                Toolkit
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {tools.map((tool, i) => (
                  <MagneticToolCard key={tool.to} tool={tool} index={i} />
                ))}
              </div>
            </div>

            {/* Activity Chart */}
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-4 flex flex-col"
            >
              <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                Activity <TrendingUp className="w-4 h-4 text-primary-400" />
              </h2>

              <motion.div
                className="flex-1 rounded-2xl p-6 flex flex-col min-h-[300px] relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(15,15,25,0.95) 100%)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  backdropFilter: 'blur(16px)',
                }}
                whileHover={{ borderColor: 'rgba(99,102,241,0.45)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Subtle pulse glow */}
                <motion.div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="mb-5 relative z-10">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Growth Index</p>
                  <div className="text-2xl font-bold text-white mt-1">
                    Active{' '}
                    <motion.span
                      className="text-sm font-semibold text-primary-400"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ● Live
                    </motion.span>
                  </div>
                </div>

                <div className="flex-1 min-h-[200px] w-full -ml-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: 12,
                        }}
                        itemStyle={{ color: '#c084fc' }}
                        cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="queries"
                        stroke="#a855f7"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#areaGrad)"
                        dot={false}
                        activeDot={{ r: 5, fill: '#a855f7', strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Feedback ──────────────────────────────────────── */}
          <motion.section
            variants={sectionReveal}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden p-8 sm:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(15,15,25,0.98) 50%, rgba(168,85,247,0.06) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Animated line top */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="max-w-2xl mx-auto text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Need Support?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-slate-400 text-sm"
              >
                Send us a message and our team will get back to you shortly.
              </motion.p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Name', 'Email'].map((ph) => (
                  <motion.input
                    key={ph}
                    type={ph === 'Email' ? 'email' : 'text'}
                    placeholder={ph}
                    whileFocus={{ borderColor: 'rgba(99,102,241,0.7)', boxShadow: '0 0 0 3px rgba(99,102,241,0.1)' }}
                    className="w-full rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                    }}
                  />
                ))}
              </div>
              <motion.textarea
                rows={4}
                placeholder="Message"
                whileFocus={{ borderColor: 'rgba(99,102,241,0.7)', boxShadow: '0 0 0 3px rgba(99,102,241,0.1)' }}
                className="w-full rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none resize-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
              />
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
                >
                  <Send className="w-4 h-4" /> Send Message
                </motion.button>
              </div>
            </div>
          </motion.section>

        </div>
      </PageWrapper>
    </PageTransition>
  )
}
