import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import PageWrapper from '../components/layout/PageWrapper'
import { UserCircle, Mail, Shield, Trash2, Download, LogOut, Edit2, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import PageTransition from '../components/shared/PageTransition'
import Loader from '../components/shared/Loader'

export default function Profile() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('access_token')
    const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    
    try {
      await axios.patch(`${api}/api/auth/profile?full_name=${encodeURIComponent(fullName)}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      // Update local storage to reflect changes
      const updatedUser = { ...user, full_name: fullName }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      window.location.reload() // Simple way to refresh context
    } catch (err) {
      toast.error('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    setExportLoading(true)
    const token = localStorage.getItem('access_token')
    const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    
    try {
      const response = await axios.get(`${api}/api/auth/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'career_data_export.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Data exported successfully!')
    } catch (err) {
      toast.error('Failed to export data.')
    } finally {
      setExportLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure? This will permanently delete your account and all history. This action cannot be undone.')) return
    
    setDeleteLoading(true)
    const token = localStorage.getItem('access_token')
    const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    
    try {
      await axios.delete(`${api}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Account deleted. Goodbye!')
      logout()
    } catch (err) {
      toast.error('Failed to delete account.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <PageTransition>
      <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4 mb-2">
           <UserCircle className="w-10 h-10 text-primary-400" />
           <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 space-y-8"
            >
              {/* Name Field */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-widest">Full Name</label>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-primary-400 hover:text-primary-300 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="flex gap-2">
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="flex-1 bg-surface/50 border border-surface-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      autoFocus
                    />
                    <button type="submit" disabled={loading} className="p-2 bg-primary-600 rounded-xl text-white hover:bg-primary-500 disabled:opacity-50">
                      {loading && <Loader />}
                      {!loading && <Check className="w-5 h-5" />}
                    </button>
                    <button type="button" onClick={() => { setIsEditing(false); setFullName(user?.full_name || '') }} className="p-2 bg-slate-700 rounded-xl text-white hover:bg-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </form>
                ) : (
                  <div className="text-2xl font-bold text-white">{user?.full_name || 'Guest User'}</div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-widest">Email Address</label>
                <div className="flex items-center gap-3 text-xl text-slate-200">
                  <Mail className="w-5 h-5 text-slate-500" />
                  {user?.email}
                </div>
              </div>

              {/* Account Security Info */}
              <div className="pt-6 border-t border-surface-border flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Shield className="w-4 h-4 text-green-500/50" />
                  <span>Account secured via {user?.hashed_password ? 'Password' : 'Google OAuth'}</span>
                </div>
                <button onClick={logout} className="text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </motion.div>

            {/* Data Management Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 border-white/5"
            >
              <h3 className="text-xl font-bold text-white mb-6">Data Management</h3>
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-white">Export your data</h4>
                    <p className="text-sm text-slate-400 mt-1">Download all your career roadmap details and resume analysis history as a CSV file.</p>
                  </div>
                  <button 
                    onClick={handleExportData}
                    disabled={exportLoading}
                    className="btn-secondary whitespace-nowrap flex items-center gap-2"
                  >
                    {exportLoading && <Loader />}
                    {!exportLoading && <Download className="w-4 h-4" />}
                    Export CSV
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Danger Zone */}
          <div className="md:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 border-red-500/10 bg-red-500/5"
            >
              <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Danger Zone
              </h3>
              <p className="text-xs text-red-500/70 mb-6 leading-relaxed">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button 
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold flex items-center justify-center gap-2"
              >
                {deleteLoading && <Loader />}
                {!deleteLoading && 'Delete Account'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      </PageWrapper>
    </PageTransition>
  )
}
