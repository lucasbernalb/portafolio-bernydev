"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

/**
 * Fondo 3D fijo para toda la página: una "espina" de energía que serpentea
 * detrás de las secciones y reacciona al scroll (dirección, velocidad y
 * posición). Reemplaza al canvas local que antes vivía solo en AboutSection.
 *
 * Paleta: violeta/púrpura como base (coherente con el resto del sitio) +
 * cian/magenta como acento nuevo en el hilo interior.
 */

const POINT_COUNT = 14;

function interpolateColor(color1: string, color2: string, t: number): string {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  return "#" + c1.lerp(c2, Math.max(0, Math.min(1, t))).getHexString();
}

function useBasePoints() {
  return useMemo(() => {
    const pts: { y: number; amp: number }[] = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      const t = i / (POINT_COUNT - 1);
      pts.push({ y: THREE.MathUtils.lerp(9, -9, t), amp: 1.3 + Math.sin(t * Math.PI) * 2.1 });
    }
    return pts;
  }, []);
}

function buildCurve(
  basePoints: { y: number; amp: number }[],
  scrollP: number,
  time: number,
  motionScale: number
) {
  const points = basePoints.map((bp, i) => {
    const phase = i * 0.55 - scrollP * 10 - time * 0.18 * motionScale;
    const x = Math.sin(phase) * bp.amp;
    const z = Math.cos(phase * 0.7) * bp.amp * 0.7;
    return new THREE.Vector3(x, bp.y, z);
  });
  return new THREE.CatmullRomCurve3(points);
}

function NeonSpine() {
  const reduceMotion = !!useReducedMotion();
  const motionScale = reduceMotion ? 0 : 1;
  const basePoints = useBasePoints();

  const group = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const accentRef = useRef<THREE.Mesh>(null);
  const accentMat = useRef<THREE.MeshBasicMaterial>(null);

  const scrollState = useRef({ target: 0, smooth: 0, last: 0, kick: 0 });
  const frame = useRef(0);

  // Curva inicial válida para el primer render (antes de que corra useFrame)
  const initialCurve = useMemo(() => buildCurve(basePoints, 0, 0, 0), [basePoints]);

  useEffect(() => {
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.current.target = max > 0 ? window.scrollY / max : 0;
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    return () => {
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
    };
  }, []);

  useFrame((state) => {
    const s = scrollState.current;
    s.smooth += (s.target - s.smooth) * 0.07;
    s.kick += ((s.target - s.last) * 14 - s.kick) * 0.1;
    s.last = s.target;

    // Recalcular la geometría cada 2 frames alcanza para que se vea fluido
    // con bastante menos costo que hacerlo en cada frame.
    frame.current++;
    if (frame.current % 2 === 0) {
      const curve = buildCurve(basePoints, s.smooth, state.clock.elapsedTime, motionScale);
      if (glowRef.current) {
        glowRef.current.geometry.dispose();
        glowRef.current.geometry = new THREE.TubeGeometry(curve, 100, 0.85, 10, false);
      }
      if (coreRef.current) {
        coreRef.current.geometry.dispose();
        coreRef.current.geometry = new THREE.TubeGeometry(curve, 100, 0.3, 8, false);
      }
      if (accentRef.current) {
        accentRef.current.geometry.dispose();
        accentRef.current.geometry = new THREE.TubeGeometry(curve, 36, 0.95, 6, false);
      }
    }

    if (accentMat.current) {
      const t = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2;
      accentMat.current.color.set(interpolateColor("#ff2fd6", "#00fff2", t));
    }

    if (group.current) {
      group.current.position.y = s.smooth * 11 - 1.5;
      group.current.rotation.y = s.smooth * 1.3 + Math.sin(state.clock.elapsedTime * 0.12) * 0.15;
      group.current.rotation.z = s.kick * 0.04;
    }
  });

  return (
    <group ref={group}>
      {/* Glow exterior violeta, coherente con la paleta de marca */}
      <mesh ref={glowRef}>
        <tubeGeometry args={[initialCurve, 100, 0.85, 10, false]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Núcleo brillante */}
      <mesh ref={coreRef}>
        <tubeGeometry args={[initialCurve, 100, 0.3, 8, false]} />
        <meshBasicMaterial
          color="#e9d5ff"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Hilo de acento cian/magenta: lo nuevo que suma esta pasada de diseño */}
      <mesh ref={accentRef}>
        <tubeGeometry args={[initialCurve, 36, 0.95, 6, false]} />
        <meshBasicMaterial
          ref={accentMat}
          wireframe
          color="#ff2fd6"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Pseudo-aleatorio determinístico: mismo resultado siempre, sin efectos
// secundarios (evita el warning de pureza de hooks y desajustes de hidratación).
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 600;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 34;
      arr[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 50;
      arr[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 22 - 4;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c9b8ff"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function SceneBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 10], fov: 55 }}
      >
        <fog attach="fog" args={["#0a0a0f", 9, 27]} />
        <NeonSpine />
        <Particles />
      </Canvas>
    </div>
  );
}
