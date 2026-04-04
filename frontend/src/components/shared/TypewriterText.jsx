import { TypeAnimation } from 'react-type-animation'

export default function TypewriterText() {
  return (
    <TypeAnimation
      sequence={[
        'Your AI Career Guide 🚀',
        2000,
        'Land Your Dream Job 💼',
        2000,
        'Master Any Tech Stack 💻',
        2000,
        'Ace Every Interview 🎯',
        2000,
      ]}
      wrapper="span"
      speed={50}
      repeat={Infinity}
      className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-3xl font-bold"
    />
  )
}
