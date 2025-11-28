'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface GooeyNavProps {
    items: { label: string; href: string }[];
    particleCount?: number;
    particleDistances?: [number, number];
    particleR?: number;
    initialActiveIndex?: number;
    animationTime?: number;
    timeVariance?: number;
    colors?: number[];
}

export default function GooeyNav({
    items,
    particleCount = 15,
    particleDistances = [90, 10],
    particleR = 100,
    initialActiveIndex = 0,
    animationTime = 600,
    timeVariance = 300,
    colors = [1, 2, 3, 1, 2, 3, 1, 4],
}: GooeyNavProps) {
    const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
    const [particles, setParticles] = useState<{ x: number; y: number; color: string; size: number; duration: number; delay: number; startX: number; startY: number }[]>([]);
    const navRef = useRef<HTMLDivElement>(null);

    // Map numeric colors to Tincadia palette (dark/black theme requested)
    const colorMap: Record<number, string> = {
        1: '#000000', // Black
        2: '#1F2937', // Gray-800
        3: '#374151', // Gray-700
        4: '#83A98A', // Tincadia Green (accent)
    };

    const triggerExplosion = (x: number, y: number) => {
        const newParticles = [];
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (particleDistances[0] - particleDistances[1]) + particleDistances[1];
            const duration = animationTime + Math.random() * timeVariance;
            const colorKey = colors[Math.floor(Math.random() * colors.length)];

            newParticles.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                color: colorMap[colorKey] || '#000000',
                size: Math.random() * 15 + 10,
                duration: duration,
                delay: Math.random() * 100,
                startX: x,
                startY: y,
            });
        }
        setParticles(newParticles);

        // Clear particles after animation
        setTimeout(() => {
            setParticles([]);
        }, animationTime + timeVariance);
    };

    const handleItemClick = (index: number, e: React.MouseEvent) => {
        setActiveIndex(index);
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const navRect = navRef.current?.getBoundingClientRect();

        if (navRect) {
            const x = rect.left - navRect.left + rect.width / 2;
            const y = rect.top - navRect.top + rect.height / 2;
            triggerExplosion(x, y);
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* SVG Filter for Gooey Effect */}
            <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            <div
                ref={navRef}
                className="relative flex gap-8 p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
                style={{ filter: "url('#goo')" }}
            >
                {/* Particles */}
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            left: p.startX,
                            top: p.startY,
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            transform: 'translate(-50%, -50%)',
                            animation: `particle-${i} ${p.duration}ms ease-out forwards`,
                        }}
                    />
                ))}

                {/* Dynamic Styles for Particles */}
                <style jsx>{`
          ${particles.map((p, i) => `
            @keyframes particle-${i} {
              0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
                left: ${p.startX}px;
                top: ${p.startY}px;
              }
              100% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
                left: ${p.x}px;
                top: ${p.y}px;
              }
            }
          `).join('')}
        `}</style>

                {/* Nav Items */}
                {items.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        onClick={(e) => handleItemClick(index, e)}
                        className={`relative z-10 px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-300 ${activeIndex === index
                            ? 'text-white bg-black'
                            : 'text-gray-600 hover:text-black'
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
