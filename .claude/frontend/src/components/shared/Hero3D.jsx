import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, ContactShadows, Stars } from '@react-three/drei'

// A glowing, slowly distorting sphere representing the "AI Brain" / "Core"
function AiCore() {
  const sphereRef = useRef()

  // Slowly rotate the sphere over time
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.2
      sphereRef.current.rotation.x = t * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={sphereRef} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#8b5cf6" // Purple-500
          emissive="#6d28d9" // Purple-700
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
          wireframe={false}
        />
      </mesh>
      
      {/* Add a wireframe cage around it for a techy look */}
      <mesh scale={2.2}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#38bdf8" wireframe={true} transparent opacity={0.15} />
      </mesh>
      
      {/* Outer subtle glow sphere */}
      <mesh scale={2.5}>
         <sphereGeometry args={[1, 32, 32]} />
         <meshBasicMaterial color="#a78bfa" transparent opacity={0.05} />
      </mesh>
    </Float>
  )
}

export default function Hero3D() {
  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#38bdf8" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#c084fc" />
        
        {/* Environment reflection */}
        <Environment preset="city" />
        
        {/* Background stars for depth */}
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

        {/* The Main Object */}
        <AiCore />
        
        {/* Soft shadow underneath */}
        <ContactShadows
          position={[0, -3.5, 0]}
          opacity={0.6}
          scale={15}
          blur={2.5}
          far={10}
        />
      </Canvas>
      
      {/* Overlay gradient to blend bottom edge into background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-card/40 to-transparent pointer-events-none" />
    </div>
  )
}
