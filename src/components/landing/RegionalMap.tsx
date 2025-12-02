'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

export function RegionalMap() {
    const sectionRef = useRef<HTMLElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calcular el progreso del scroll
            // Cuando la sección entra en el viewport (top < windowHeight), empezamos el zoom
            // Cuando la sección sale del viewport (top + height < 0), terminamos el zoom
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            
            // Rango de scroll donde ocurre el efecto
            const startPoint = windowHeight; // Cuando la parte superior de la sección está en la parte inferior del viewport
            const endPoint = -sectionHeight; // Cuando la parte inferior de la sección sale del viewport
            
            // Calcular progreso (0 a 1)
            let progress = 0;
            if (sectionTop <= startPoint && sectionTop >= endPoint) {
                // La sección está en el rango de scroll
                progress = 1 - ((sectionTop - endPoint) / (startPoint - endPoint));
            } else if (sectionTop < endPoint) {
                // Ya pasó completamente, zoom máximo
                progress = 1;
            }
            
            // Suavizar el progreso con easing
            progress = Math.min(1, Math.max(0, progress));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Llamar una vez al montar

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calcular zoom y transformación
    // Zoom: de 1 a 1.15 (15% más grande) para efecto sutil y limpio
    // Transform origin: centro inferior (50% horizontal, 100% vertical)
    const zoom = 1 + (scrollProgress * 0.15); // De 1x a 1.15x
    const transformOrigin = '50% 100%'; // Centro horizontal, parte inferior vertical

    return (
        <section 
            ref={sectionRef}
            className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex flex-col items-center justify-center bg-white overflow-hidden" 
            id="presencia"
        >
            {/* Contenedor del mapa con efecto 3D y zoom en scroll */}
            <CardContainer className="inter-var w-full h-full max-w-6xl" containerClassName="w-full h-full py-0">
                <CardBody className="bg-transparent relative group/card w-full h-full rounded-xl border-none">
                    <CardItem translateZ="50" className="w-full h-full flex items-center justify-center">
                        {/* Tarjeta del mapa mundial con efecto de zoom */}
                        <div 
                            className="relative w-full max-w-5xl aspect-square transition-transform duration-500 ease-out"
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: transformOrigin,
                            }}
                        >
                            <Image
                                src="/media/images/world_map.png"
                                alt="World map"
                                fill
                                className="object-contain drop-shadow-2xl"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                                priority
                            />
                        </div>
                    </CardItem>
                </CardBody>
            </CardContainer>
        </section>
    );
}
