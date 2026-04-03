import { createContext, useContext, useState } from 'react'

const SessionContext = createContext()

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }) {
  // Store results as strings (markdown streamed from backend) or structured data if needed
  const [learningPathData, setLearningPathData] = useState(null)
  const [projectIdeasData, setProjectIdeasData] = useState(null)
  const [resumeData, setResumeData] = useState(null)
  
  // Interview data might need more complex state (history array)
  const [interviewData, setInterviewData] = useState(null)

  const value = {
    learningPathData,
    setLearningPathData,
    projectIdeasData,
    setProjectIdeasData,
    resumeData,
    setResumeData,
    interviewData,
    setInterviewData,
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}
