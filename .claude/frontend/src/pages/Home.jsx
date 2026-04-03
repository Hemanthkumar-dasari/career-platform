import { Link } from 'react-router-dom'
import { Sparkles, Map, Lightbulb, FileText, MessageSquare, ChevronRight, CheckCircle2, ShieldCheck, Globe, Star } from 'lucide-react'

const features = [
  {
    icon: Map,
    title: 'Precision Roadmaps',
    desc: 'Bespoke weekly learning paths that bridge the gap from your current skills to senior-level expertise.',
    color: 'text-blue-400',
    border: 'hover:border-blue-500/50',
    bg: 'bg-blue-500/5'
  },
  {
    icon: Lightbulb,
    title: 'Project Blueprints',
    desc: 'Architectural-level project ideas tailored to your specific tech stack and portfolio goals.',
    color: 'text-yellow-400',
    border: 'hover:border-yellow-500/50',
    bg: 'bg-yellow-500/5'
  },
  {
    icon: FileText,
    title: 'Resume Intelligence',
    desc: 'Deep-scan resume analysis with actionable feedback on keywords, impact, and formatting.',
    color: 'text-green-400',
    border: 'hover:border-green-500/50',
    bg: 'bg-green-500/5'
  },
  {
    icon: MessageSquare,
    title: 'Interview Simulator',
    desc: 'Immersive, real-time mock interviews with an AI recruiter that adapts to your performance.',
    color: 'text-purple-400',
    border: 'hover:border-purple-500/50',
    bg: 'bg-purple-500/5'
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-xl bg-surface/50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-1.5 rounded-lg bg-primary-600/10 border border-primary-500/20 group-hover:scale-110 transition-transform">
             <Sparkles className="w-6 h-6 text-primary-500" />
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">Career<span className="text-primary-500">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Sign in</Link>
          <Link to="/register" className="px-6 py-2.5 bg-white text-surface hover:bg-slate-200 font-bold rounded-xl text-sm transition-all shadow-xl shadow-white/10 flex items-center gap-2">
            Get started
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full mb-8 animate-fade-in">
          <Star className="w-3 h-3 fill-primary-400" /> 
          The Future of Professional Growth
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-bold text-white mb-8 max-w-4xl tracking-tight leading-[1.1] animate-slide-up">
          Engineering your <span className="gradient-text italic">Dream Career</span> with AI precision.
        </h1>
        
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-12 animate-slide-up-1 leading-relaxed">
          The all-in-one intelligence layer for your professional journey. From hyper-personalized roadmaps to real-time interview sims.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up-2">
          <Link to="/register" className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl text-lg transition-all shadow-2xl shadow-primary-500/40 hover:scale-105 active:scale-95">
            Initialize Journey
          </Link>
          <Link to="/login" className="px-10 py-4 glass-card border-white/10 hover:border-white/20 text-white font-bold rounded-2xl text-lg transition-all hover:bg-white/5 active:scale-95">
            Access Dashboard
          </Link>
        </div>

        {/* Status Badges */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 animate-fade-in-slow">
           <div className="flex items-center gap-2"><Globe className="w-5 h-5" /> <span className="font-bold text-sm">GLOBAL ACCESS</span></div>
           <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> <span className="font-bold text-sm">ENCRYPTED DATA</span></div>
           <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> <span className="font-bold text-sm">EXPERT VERIFIED</span></div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color, border, bg }) => (
              <div 
                key={title} 
                className={`group glass-card p-8 border-white/5 ${border} transition-all duration-500 hover:-translate-y-2`}
              >
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
           <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span>&copy; 2026 CareerAI. All rights reserved.</span>
           </div>
           <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Status</a>
           </div>
        </div>
      </footer>
    </div>
  )
}
