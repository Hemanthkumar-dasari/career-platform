import { createContext, useContext, useState } from 'react'

const ResultsContext = createContext(null)

export function ResultsProvider({ children }) {
  const [learningPath, setLearningPath] = useState(null)
  const [projectIdeas, setProjectIdeas] = useState([])
  const [resumeAnalysis, setResumeAnalysis] = useState(null)
  const [interviewSession, setInterviewSession] = useState(null)

  return (
    <ResultsContext.Provider value={{
      learningPath, setLearningPath,
      projectIdeas, setProjectIdeas,
      resumeAnalysis, setResumeAnalysis,
      interviewSession, setInterviewSession,
    }}>
      {children}
    </ResultsContext.Provider>
  )
}

export function useResults() {
  return useContext(ResultsContext)
}
