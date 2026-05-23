import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points for the atmospheric particles
const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 40;     // x
  positions[i * 3 + 1] = (Math.random() - 0.5) * 40; // y
  positions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
}

function FloatingGeometry() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.05;
    meshRef.current.rotation.y += delta * 0.08;
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, -10]}>
        <icosahedronGeometry args={[8, 1]} />
        <meshPhysicalMaterial 
          color="#1a1a2e"
          wireframe={true}
          transparent={true}
          opacity={0.1}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function AtmosphericParticles() {
  const pointsRef = useRef();

  useFrame((state, delta) => {
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.01;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent 
        color="#ffffff" 
        size={0.05} 
        sizeAttenuation={true} 
        depthWrite={false} 
        opacity={0.3} 
      />
    </Points>
  );
}

export default function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none bg-[#030303]">
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] opacity-80 mix-blend-overlay"></div>
      
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none mix-blend-screen" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <fog attach="fog" args={['#030303', 10, 40]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <FloatingGeometry />
        <AtmosphericParticles />
      </Canvas>
    </div>
  );
}
