import { useState, useEffect } from 'react'
import ReactConfetti from 'react-confetti'

export default function SuccessConfetti({ trigger }) {
  const [show, setShow] = useState(false)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    if (trigger) {
      setShow(true)
      setTimeout(() => setShow(false), 4000)
    }
  }, [trigger])

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!show) return null

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={300}
      colors={['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b']}
    />
  )
}
