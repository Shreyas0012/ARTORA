import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FrozenMonolith() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.05;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <octahedronGeometry args={[2.5, 0]} />
      <meshStandardMaterial
        color="#e2e8f0"
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.8}
        wireframe={true}
      />
      <mesh>
        <octahedronGeometry args={[2.4, 1]} />
        <meshBasicMaterial color="#020813" opacity={0.9} transparent />
      </mesh>
    </mesh>
  );
}

function AtmosphericParticles() {
  const count = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  }, [count]);

  const pointsRef = useRef();

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#94a3b8" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function SphereBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: '#020305',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#020305']} />
        <fogExp2 attach="fog" args={['#020305', 0.08]} />
        
        <ambientLight intensity={0.2} color="#64748b" />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#f8fafc" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#020813" />

        <FrozenMonolith />
        <AtmosphericParticles />
      </Canvas>

      {/* Heavy noise overlay for filmic feel */}
      <div
        className="noise-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
