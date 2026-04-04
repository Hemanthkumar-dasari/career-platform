import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Sparkles } from 'lucide-react'
import GoogleLoginButton from '../components/auth/GoogleLoginButton'
import PageTransition from '../components/shared/PageTransition'
import Loader from '../components/shared/Loader'
import SuccessConfetti from '../components/shared/SuccessConfetti'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return
    setLoading(true)

    try {
      await register(form.email, form.full_name, form.password)
      setRegistered(true)
      toast.success("Account created successfully!")
      setTimeout(() => navigate('/dashboard'), 3000)
    } catch (err) {
      let errorMsg = err.response?.data?.detail || 'Registration failed.'
      if (Array.isArray(errorMsg)) {
        errorMsg = errorMsg[0].msg || 'Invalid input.'
      }
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <SuccessConfetti trigger={registered} />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-primary-500" />
          <span className="text-2xl font-bold text-white">CareerAI</span>
        </div>

        {/* Card */}
        <div className="glass-card gradient-border">
          <div className="gradient-border-inner">
          <h1 className="text-xl font-bold text-white mb-6">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input"
                placeholder="Jane Doe"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                minLength={6}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-105"
            >
              {loading && <Loader />}
              {!loading && 'Create account'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-slate-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login */}
            <GoogleLoginButton />

          </form>

          {/* Login Link */}
          <p className="text-sm text-slate-400 text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:underline">
              Sign in
            </Link>
          </p>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  )
}