import heroImg from '../../assets/hero_career_path.png'

export default function Hero3D() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
    }}>
      {/* Main hero image */}
      <img
        src={heroImg}
        alt="AI Career Path"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />

      {/* Subtle label */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        right: 16,
        fontSize: 9,
        letterSpacing: '0.18em',
        color: 'rgba(148,163,184,0.45)',
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
      }}>
        AI · CAREER · PLATFORM
      </div>

      {/* Left fade — wider to fully eliminate seam */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0,
        width: '50%',
        background: 'linear-gradient(to right, rgba(10,8,20,0.95) 0%, rgba(10,8,20,0.4) 60%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
