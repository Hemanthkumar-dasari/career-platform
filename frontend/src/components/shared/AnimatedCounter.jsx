import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

export default function AnimatedCounter({ end, label, suffix = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        {inView ? <CountUp end={end} duration={2.5} suffix={suffix} /> : '0'}
      </div>
      <div className="text-slate-400 text-sm mt-1">{label}</div>
    </div>
  )
}
