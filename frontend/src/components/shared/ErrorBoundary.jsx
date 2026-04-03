import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-8">
            <span className="text-3xl text-red-500">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
            The application encountered an unexpected error. We've been notified and are looking into it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white text-surface font-bold rounded-xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
          >
            Reload Application
          </button>
          
          {import.meta.env.DEV && (
            <div className="mt-12 p-4 bg-surface-card border border-surface-border rounded-xl text-left w-full max-w-2xl overflow-auto">
              <p className="text-red-400 font-mono text-sm uppercase mb-2">Debug Info:</p>
              <pre className="text-slate-500 text-xs font-mono">{this.state.error?.toString()}</pre>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
