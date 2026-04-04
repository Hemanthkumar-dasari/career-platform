import { useEffect, useRef } from 'react'

export default function AuroraBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const bands = [
      { y: 0.25, amp: 0.10, freq: 0.0008, speed: 0.0004, color: [99,102,241],  alpha: 0.18, blur: 120, thickness: 0.22 },
      { y: 0.35, amp: 0.08, freq: 0.0012, speed: 0.0006, color: [168,85,247],  alpha: 0.15, blur: 100, thickness: 0.18 },
      { y: 0.20, amp: 0.12, freq: 0.0006, speed: 0.0003, color: [6,182,212],   alpha: 0.12, blur: 130, thickness: 0.20 },
      { y: 0.45, amp: 0.07, freq: 0.0015, speed: 0.0008, color: [16,185,129],  alpha: 0.10, blur: 110, thickness: 0.16 },
      { y: 0.15, amp: 0.09, freq: 0.0010, speed: 0.0005, color: [236,72,153],  alpha: 0.08, blur: 140, thickness: 0.14 },
      { y: 0.55, amp: 0.06, freq: 0.0018, speed: 0.0007, color: [139,92,246],  alpha: 0.09, blur: 90,  thickness: 0.12 },
    ]

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }))

    const drawBand = (band, time) => {
      const W = canvas.width
      const H = canvas.height
      const points = []
      const steps = 80

      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * W
        const w1 = Math.sin(x * band.freq + time * band.speed * 1000) * band.amp * H
        const w2 = Math.sin(x * band.freq * 1.7 + time * band.speed * 800 + 1.2) * band.amp * 0.5 * H
        const w3 = Math.cos(x * band.freq * 0.8 + time * band.speed * 600 + 2.4) * band.amp * 0.3 * H
        points.push({ x, y: band.y * H + w1 + w2 + w3 })
      }

      const thickness = band.thickness * H

      for (let layer = 3; layer >= 0; layer--) {
        const lt = thickness * (1 + layer * 0.6)
        const la = band.alpha * (1 - layer * 0.22)
        const [r, g, b] = band.color

        ctx.save()
        ctx.filter = `blur(${band.blur * (1 + layer * 0.5)}px)`

        const grad = ctx.createLinearGradient(0, 0, 0, H)
        grad.addColorStop(0,   `rgba(${r},${g},${b},0)`)
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${la})`)
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${la * 1.4})`)
        grad.addColorStop(0.7, `rgba(${r},${g},${b},${la})`)
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`)

        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y - lt / 2)
        for (let i = 1; i < points.length; i++) {
          const p = points[i - 1], c = points[i]
          const mx = (p.x + c.x) / 2, my = (p.y + c.y) / 2
          ctx.quadraticCurveTo(p.x, p.y - lt / 2, mx, my - lt / 2)
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y + lt / 2)
        for (let i = points.length - 2; i >= 0; i--) {
          const p = points[i + 1], c = points[i]
          const mx = (p.x + c.x) / 2, my = (p.y + c.y) / 2
          ctx.quadraticCurveTo(p.x, p.y + lt / 2, mx, my + lt / 2)
        }
        ctx.closePath()
        ctx.fillStyle = grad
        ctx.fill()
        ctx.restore()
      }
    }

    const drawStars = (time) => {
      stars.forEach(s => {
        const twinkle = Math.sin(time * s.twinkleSpeed * 1000 + s.twinkleOffset)
        const alpha = s.alpha * (0.5 + 0.5 * twinkle)
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      })
    }

    const draw = (timestamp) => {
      t = timestamp * 0.001
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Deep space base
      const bg = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      )
      bg.addColorStop(0, 'rgba(8,6,18,1)')
      bg.addColorStop(0.4, 'rgba(5,4,14,1)')
      bg.addColorStop(1, 'rgba(2,2,8,1)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawStars(t)
      bands.forEach(band => drawBand(band, t))

      // Vignette
      const vig = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.85
      )
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,0,0.5)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
