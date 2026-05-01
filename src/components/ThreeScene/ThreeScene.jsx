import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './ThreeScene.css';

/* ─── Animated Icosahedron with Distortion ─── */
function CoreShape({ mouse }) {
  const meshRef = useRef();
  const wireRef = useRef();
  const originalPositions = useRef(null);

  // Store original vertex positions for distortion
  useEffect(() => {
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      originalPositions.current = new Float32Array(geo.attributes.position.array);
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Slow auto-rotation
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.08;

    // Mouse influence (lerp towards mouse)
    const targetX = mouse.current.y * 0.3;
    const targetY = mouse.current.x * 0.3;
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.01;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.01;

    // Vertex distortion (organic breathing)
    if (originalPositions.current) {
      const pos = meshRef.current.geometry.attributes.position;
      const orig = originalPositions.current;
      for (let i = 0; i < pos.count; i++) {
        const ox = orig[i * 3];
        const oy = orig[i * 3 + 1];
        const oz = orig[i * 3 + 2];
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const noise = Math.sin(time * 1.5 + ox * 2) * Math.cos(time * 1.2 + oy * 2) * 0.15;
        const scale = 1 + noise;
        pos.setXYZ(i, ox * scale, oy * scale, oz * scale);
      }
      pos.needsUpdate = true;
    }

    // Wire follows mesh rotation  
    if (wireRef.current) {
      wireRef.current.rotation.copy(meshRef.current.rotation);
      wireRef.current.rotation.y += 0.3;
    }
  });

  return (
    <group>
      {/* Solid distorted core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.2, 4]} />
        <meshStandardMaterial
          color="#1a0a3e"
          emissive="#2a0f5e"
          emissiveIntensity={0.4}
          roughness={0.6}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[2.6, 2]} />
        <meshBasicMaterial color="#5227FF" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.4, 0.008, 16, 100]} />
        <meshBasicMaterial color="#FF9FFC" transparent opacity={0.06} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[3.0, 0.005, 16, 80]} />
        <meshBasicMaterial color="#B19EEF" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

/* ─── Floating Particles ─── */
function Particles({ count = 500 }) {
  const meshRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.08;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#B19EEF"
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Mouse Tracker ─── */
function MouseTracker({ mouse }) {
  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouse]);
  return null;
}

/* ─── Main Scene ─── */
export default function ThreeScene() {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <div className="three-scene-container">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0f' }}
      >
        <MouseTracker mouse={mouse} />
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#5227FF" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#FF9FFC" />
        <pointLight position={[0, 0, -5]} intensity={0.3} color="#B19EEF" />
        <CoreShape mouse={mouse} />
        <Particles count={600} />
        <fog attach="fog" args={['#0a0a0f', 8, 20]} />
      </Canvas>
    </div>
  );
}
