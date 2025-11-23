'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const count = 1000;
  const mesh = useRef<THREE.Points>(null!);

  const { geometry, positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);

    // Distribuir partículas concentradas en el centro
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 8; // Área más pequeña
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 3;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    return { geometry: geom, positions: pos, originalPositions: orig };
  }, []);

  const mouseVec = new THREE.Vector3();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { pointer, viewport } = state;

    // Posición del mouse en coordenadas del mundo
    mouseVec.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Posición original
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      // Flotación suave
      const floatX = Math.sin(time * 0.2 + oy * 0.3) * 0.1;
      const floatY = Math.cos(time * 0.15 + ox * 0.3) * 0.1;

      let targetX = ox + floatX;
      let targetY = oy + floatY;
      let targetZ = oz;

      // Calcular distancia y ángulo desde el mouse a la partícula
      const dx = targetX - mouseVec.x;
      const dy = targetY - mouseVec.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      // Radio del círculo alrededor del mouse
      const circleRadius = 3.5;
      const influenceRadius = 6; // Radio de influencia

      // Solo afectar partículas dentro del radio de influencia
      if (dist < influenceRadius && dist > 0.01) {
        // Calcular ángulo hacia la partícula
        const angle = Math.atan2(dy, dx);

        // Posición en el círculo alrededor del mouse
        const circleX = mouseVec.x + Math.cos(angle) * circleRadius;
        const circleY = mouseVec.y + Math.sin(angle) * circleRadius;

        // Fuerza de atracción al círculo (más fuerte cerca del mouse)
        const influence = 1 - (dist / influenceRadius);
        const attractionStrength = influence * 0.8;

        // Interpolar hacia la posición en el círculo
        targetX = targetX + (circleX - targetX) * attractionStrength;
        targetY = targetY + (circleY - targetY) * attractionStrength;
        targetZ = oz + influence * 1; // Traer al frente
      }

      // Interpolación suave hacia la posición objetivo
      const returnSpeed = 0.1;

      positions[i3] += (targetX - positions[i3]) * returnSpeed;
      positions[i3 + 1] += (targetY - positions[i3 + 1]) * returnSpeed;
      positions[i3 + 2] += (targetZ - positions[i3 + 2]) * returnSpeed;
    }

    const positionAttribute = mesh.current.geometry.getAttribute('position');
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        color="#83A98A"
        sizeAttenuation={true}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

export function TechBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      {/* Canvas 3D */}
      <div className="absolute inset-0">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            className="pointer-events-auto"
            eventSource={document.body}
            eventPrefix="client"
          >
            <ParticleField />
          </Canvas>
        )}
      </div>
    </div>
  );
}
