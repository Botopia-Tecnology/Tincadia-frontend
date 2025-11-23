'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- AJUSTES BALANCEADOS ---
const PARTICLE_COLOR = '#83A98A';
const PARTICLE_COUNT = 60;
const REPULSION_RADIUS = 3;     // Radio medio
const REPULSION_FORCE = 0.02;   // Fuerza balanceada
const SWIRL_FORCE = 0.04;       // Rotación perceptible pero suave
const RETURN_SPEED = 0.02;      // Retorno lento y suave
const IDLE_SPEED = 0.2;         // Movimiento idle visible
const IDLE_RADIUS = 0.15;       // Radio de flotación idle

function ParticleSystem() {
    const { viewport, mouse } = useThree();
    const pointsRef = useRef<THREE.Points>(null);

    // Generar posiciones y velocidades aleatorias para el movimiento "idle"
    const [positions, originalPositions, randomOffsets] = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        const orig = new Float32Array(PARTICLE_COUNT * 3);
        const rnd = new Float32Array(PARTICLE_COUNT); // Para que cada una se mueva distinto

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const x = (Math.random() - 0.5) * viewport.width;
            const y = (Math.random() - 0.5) * viewport.height;
            const z = 0;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            orig[i * 3] = x;
            orig[i * 3 + 1] = y;
            orig[i * 3 + 2] = z;

            rnd[i] = Math.random() * Math.PI * 2; // Fase aleatoria
        }
        return [pos, orig, rnd];
    }, [viewport]);

    useFrame((state) => {
        if (!pointsRef.current) return;

        const time = state.clock.getElapsedTime();
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;

        const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            let px = currentPositions[i3];
            let py = currentPositions[i3 + 1];
            const ox = originalPositions[i3];
            const oy = originalPositions[i3 + 1];

            // 1. MOVIMIENTO IDLE (Circular suave cuando no haces nada)
            // Hacemos que floten en pequeños círculos naturales
            const floatX = Math.cos(time * IDLE_SPEED + randomOffsets[i]) * IDLE_RADIUS;
            const floatY = Math.sin(time * IDLE_SPEED + randomOffsets[i]) * IDLE_RADIUS;

            // Meta: Posición original + flotación
            const targetX = ox + floatX;
            const targetY = oy + floatY;

            // Calcular distancia al mouse
            const dx = px - mouseX;
            const dy = py - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 2. FÍSICA DE INTERACCIÓN (VÓRTICE)
            if (dist < REPULSION_RADIUS) {
                // Cálculo del ángulo
                const angle = Math.atan2(dy, dx);

                // Factor de fuerza (más fuerte en el centro, suave en los bordes)
                const forceMultiplier = (REPULSION_RADIUS - dist) / REPULSION_RADIUS;

                // Vector Radial (Empuje hacia afuera)
                const pushX = Math.cos(angle) * REPULSION_FORCE * forceMultiplier;
                const pushY = Math.sin(angle) * REPULSION_FORCE * forceMultiplier;

                // Vector Tangencial (Rotación/Circular) - Aquí está el truco
                // Sumamos 90 grados (PI/2) al ángulo para obtener la tangente
                const swirlX = Math.cos(angle + Math.PI / 2) * SWIRL_FORCE * forceMultiplier;
                const swirlY = Math.sin(angle + Math.PI / 2) * SWIRL_FORCE * forceMultiplier;

                // Aplicamos ambos movimientos
                px += pushX + swirlX;
                py += pushY + swirlY;
            }

            // 3. RETORNO SUAVE (Lerp)
            // Hacemos que vuelvan a su "target" (que incluye la flotación)
            px += (targetX - px) * RETURN_SPEED;
            py += (targetY - py) * RETURN_SPEED;

            currentPositions[i3] = px;
            currentPositions[i3 + 1] = py;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={PARTICLE_COUNT}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15} // Puntos un poco más grandes para mejor visibilidad
                color={PARTICLE_COLOR}
                transparent
                opacity={0.65} // Opacidad más visible
                sizeAttenuation={true}
            />
        </points>
    );
}

export function ThreeBackground() {
    return (
        <div className="absolute inset-0 -z-10 bg-transparent">
            {/* Capas estáticas sutiles */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#d4d4d4_1px,_transparent_0)] [background-size:24px_24px] bg-white opacity-60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-[#83A98A]/5 pointer-events-none" />

            {/* Canvas 3D */}
            <div className="absolute inset-0 pointer-events-auto">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 75 }}
                    style={{ width: '100%', height: '100%' }}
                    dpr={[1, 2]}
                    gl={{ alpha: true, antialias: true }}
                >
                    <ParticleSystem />
                </Canvas>
            </div>
        </div>
    );
}
