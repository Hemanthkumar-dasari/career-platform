export default function Hero3D() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes caOrbit1 { to { transform: rotate(360deg); } }
        @keyframes caOrbit2 { to { transform: rotate(-360deg); } }
        @keyframes caPulse {
          0%,100% { box-shadow: 0 0 28px 10px rgba(168,85,247,0.55), 0 0 60px 20px rgba(99,102,241,0.22); }
          50%      { box-shadow: 0 0 44px 18px rgba(168,85,247,0.85), 0 0 90px 35px rgba(99,102,241,0.38); }
        }
        @keyframes caFloat {
          0%,100% { transform: translate(-50%,-50%) translateY(0px); }
          50%      { transform: translate(-50%,-50%) translateY(-10px); }
        }
        @keyframes caGlow {
          0%,100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 1;   transform: translate(-50%,-50%) scale(1.15); }
        }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
        animation: 'caGlow 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Scene container */}
      <div style={{ position: 'relative', width: 280, height: 280 }}>

        {/* Ring 4 — outermost, pink */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 270, height: 270, marginTop: -135, marginLeft: -135,
          borderRadius: '50%',
          border: '0.5px solid rgba(236,72,153,0)',
          borderTopColor: 'rgba(236,72,153,0.4)',
          borderBottomColor: 'rgba(236,72,153,0.4)',
          animation: 'caOrbit2 20s linear infinite',
        }} />

        {/* Ring 3 — emerald */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 220, height: 220, marginTop: -110, marginLeft: -110,
          borderRadius: '50%',
          border: '1px solid rgba(16,185,129,0)',
          borderTopColor: 'rgba(16,185,129,0.5)',
          borderBottomColor: 'rgba(16,185,129,0.5)',
          animation: 'caOrbit1 12s linear infinite reverse',
        }} />

        {/* Ring 2 — cyan */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 165, height: 165, marginTop: -82, marginLeft: -82,
          borderRadius: '50%',
          border: '1px solid rgba(6,182,212,0)',
          borderTopColor: 'rgba(6,182,212,0.65)',
          borderRightColor: 'rgba(6,182,212,0.15)',
          borderBottomColor: 'rgba(6,182,212,0.65)',
          animation: 'caOrbit2 8s linear infinite',
        }} />

        {/* Ring 1 — indigo, innermost */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 112, height: 112, marginTop: -56, marginLeft: -56,
          borderRadius: '50%',
          border: '1.5px solid rgba(99,102,241,0)',
          borderTopColor: 'rgba(99,102,241,0.8)',
          borderRightColor: 'rgba(99,102,241,0.2)',
          borderBottomColor: 'rgba(99,102,241,0.8)',
          animation: 'caOrbit1 4.5s linear infinite',
          boxShadow: '0 0 8px rgba(99,102,241,0.25)',
        }} />

        {/* Dot on ring 1 — indigo */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 9, height: 9, marginTop: -4, marginLeft: 52,
          borderRadius: '50%',
          background: '#818cf8',
          boxShadow: '0 0 10px 4px rgba(129,140,248,0.9)',
          animation: 'caOrbit1 4.5s linear infinite',
          transformOrigin: '-52px 4px',
        }} />

        {/* Dot on ring 2 — cyan */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 7, height: 7, marginTop: -3, marginLeft: 79,
          borderRadius: '50%',
          background: '#22d3ee',
          boxShadow: '0 0 8px 3px rgba(34,211,238,0.9)',
          animation: 'caOrbit2 8s linear infinite',
          transformOrigin: '-79px 3px',
        }} />

        {/* Dot on ring 3 — emerald */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 7, height: 7, marginTop: -3, marginLeft: 107,
          borderRadius: '50%',
          background: '#34d399',
          boxShadow: '0 0 8px 3px rgba(52,211,153,0.9)',
          animation: 'caOrbit1 12s linear infinite reverse',
          transformOrigin: '-107px 3px',
        }} />

        {/* Dot on ring 4 — pink */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 6, height: 6, marginTop: -3, marginLeft: 132,
          borderRadius: '50%',
          background: '#f472b6',
          boxShadow: '0 0 7px 3px rgba(244,114,182,0.9)',
          animation: 'caOrbit2 20s linear infinite',
          transformOrigin: '-132px 3px',
        }} />

        {/* Core sphere */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 58, height: 58,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 36% 34%, #c084fc, #7c3aed 58%, #3b0764)',
          animation: 'caPulse 3s ease-in-out infinite, caFloat 6s ease-in-out infinite',
        }} />

        {/* Label */}
        <div style={{
          position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)',
          fontSize: 10, letterSpacing: '0.18em',
          color: 'rgba(148,163,184,0.55)',
          fontFamily: 'monospace', whiteSpace: 'nowrap',
        }}>
          AI · CAREER · PLATFORM
        </div>
      </div>
    </div>
  )
}
