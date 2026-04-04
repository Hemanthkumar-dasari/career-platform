import { useCallback } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function ParticlesBackground() {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine)
    }, [])

    return (
        <Particles
            init={particlesInit}
            options={{
                background: { color: { value: 'transparent' } },
                particles: {
                    number: { value: 80 },
                    color: { value: ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'] },
                    links: {
                        enable: true,
                        color: '#6366f1',
                        opacity: 0.2,
                    },
                    move: { enable: true, speed: 1.2 },
                    opacity: { value: 0.5 },
                    size: { value: { min: 1, max: 3 } },
                },
            }}
            className="fixed inset-0 -z-10"
        />
    )
}