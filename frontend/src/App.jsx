import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { SessionProvider } from './context/SessionContext'
import PrivateRoute from './components/shared/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LearningPaths from './pages/LearningPaths'
import ProjectIdeas from './pages/ProjectIdeas'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import InterviewPrep from './pages/InterviewPrep'
import History from './pages/History'
import Profile from './pages/Profile'
import ParticlesBackground from './components/shared/ParticlesBackground'

export default function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <ParticlesBackground />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute><Dashboard /></PrivateRoute>}
            />
            <Route
              path="/learning-paths"
              element={<PrivateRoute><LearningPaths /></PrivateRoute>}
            />
            <Route
              path="/project-ideas"
              element={<PrivateRoute><ProjectIdeas /></PrivateRoute>}
            />
            <Route
              path="/resume-analyzer"
              element={<PrivateRoute><ResumeAnalyzer /></PrivateRoute>}
            />
            <Route
              path="/interview-prep"
              element={<PrivateRoute><InterviewPrep /></PrivateRoute>}
            />
            <Route
              path="/history"
              element={<PrivateRoute><History /></PrivateRoute>}
            />
            <Route
              path="/profile"
              element={<PrivateRoute><Profile /></PrivateRoute>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </SessionProvider>
    </AuthProvider>
  )
}
