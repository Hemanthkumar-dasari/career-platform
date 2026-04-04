/**
 * Pure CSS Aurora Background — zero canvas, zero JS loops.
 * All animation runs on the GPU via transform/opacity only.
 * blur() is applied once as a static property, never inside a keyframe.
 */
export default function AuroraBackground() {
  return (
    <>
      <style>{`
        @keyframes aurora-drift-1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(60px, -40px) scale(1.08); }
          66%  { transform: translate(-30px, 50px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes aurora-drift-2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          40%  { transform: translate(-70px, 30px) scale(1.12); }
          75%  { transform: translate(40px, -60px) scale(0.92); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes aurora-drift-3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(50px, 70px) scale(1.06); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes aurora-drift-4 {
          0%   { transform: translate(0px, 0px) scale(1.05); }
          45%  { transform: translate(-50px, -30px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1.05); }
        }
        @keyframes aurora-drift-5 {
          0%   { transform: translate(0px, 0px) scale(1); }
          30%  { transform: translate(80px, -20px) scale(1.1); }
          70%  { transform: translate(-20px, 60px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* Deep space base */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 30%, #09071a 0%, #050310 50%, #020208 100%)',
        }}
      />

      {/* CSS star field — pure background, no JS */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 60%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 40% 10%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 80%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 35%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 80% 70%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 62% 55%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 33% 30%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 75% 90%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 5% 50%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 42%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 20% 5%, rgba(255,255,255,0.6) 0%, transparent 100%)
          `,
          animation: 'star-twinkle 4s ease-in-out infinite',
        }}
      />

      {/* Aurora band 1 — indigo */}
      <div
        style={{
          position: 'fixed',
          top: '10%',
          left: '-10%',
          width: '60%',
          height: '45%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'aurora-drift-1 22s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Aurora band 2 — purple */}
      <div
        style={{
          position: 'fixed',
          top: '5%',
          right: '-5%',
          width: '55%',
          height: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.18) 0%, rgba(168,85,247,0.05) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'aurora-drift-2 28s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Aurora band 3 — cyan */}
      <div
        style={{
          position: 'fixed',
          bottom: '5%',
          left: '15%',
          width: '50%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.14) 0%, rgba(6,182,212,0.04) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-drift-3 32s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Aurora band 4 — emerald */}
      <div
        style={{
          position: 'fixed',
          bottom: '15%',
          right: '5%',
          width: '45%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 50%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'aurora-drift-4 26s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Aurora band 5 — pink accent, upper right */}
      <div
        style={{
          position: 'fixed',
          top: '30%',
          right: '20%',
          width: '40%',
          height: '35%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(236,72,153,0.10) 0%, rgba(236,72,153,0.03) 50%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-drift-5 35s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Vignette overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </>
  )
}
