'use client';

import { useState, useEffect, useRef } from 'react';
import { Video, Loader2 } from 'lucide-react';

export function SignLanguageTooltip() {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [label, setLabel] = useState('');
    const [loading, setLoading] = useState(false);

    // Referencia para el timeout de debounce
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Buscar si el elemento o sus padres son interactivos y tienen la clase específica
            const interactiveElement = target.closest('.sign-language-target');

            if (interactiveElement) {
                const text = interactiveElement.textContent?.trim() || interactiveElement.getAttribute('aria-label') || '';

                if (text) {
                    setLabel(text.substring(0, 30) + (text.length > 30 ? '...' : '')); // Limitar longitud

                    // Posicionar cerca del mouse pero sin estorbar
                    // Ajustamos para que aparezca abajo a la derecha del cursor
                    setPosition({ x: e.clientX + 15, y: e.clientY + 15 });

                    // Pequeño delay para evitar parpadeos rápidos
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => {
                        setVisible(true);
                        setLoading(true); // Simular carga de video
                    }, 300);
                }
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactiveElement = target.closest('.sign-language-target');

            if (interactiveElement) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setVisible(false);
                setLoading(false);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (visible) {
                setPosition({ x: e.clientX + 15, y: e.clientY + 15 });
            }
        }

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('mousemove', handleMouseMove);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            className="fixed z-[100] pointer-events-none bg-white rounded-lg shadow-2xl border border-gray-200 p-2 w-48 animate-in fade-in zoom-in-95 duration-200"
            style={{
                left: position.x,
                top: position.y,
                // Asegurar que no se salga de la pantalla (básico)
                transform: position.y > window.innerHeight - 200 ? 'translateY(-100%)' : 'none'
            }}
        >
            <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center mb-2">
                {/* Placeholder de Video */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    {loading ? (
                        <Video size={24} className="mb-1 opacity-50" />
                    ) : (
                        <Video size={24} className="mb-1" />
                    )}
                    <span className="text-[10px] font-medium uppercase tracking-wider">LENGUA DE SEÑAS</span>
                </div>

                {/* Simulación de loading */}
                {loading && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#83A98A] animate-spin" />
                    </div>
                )}
            </div>

            <div className="px-1">
                <p className="text-xs font-semibold text-gray-900 truncate">
                    {label}
                </p>
                <p className="text-[10px] text-gray-500">
                    Traducción automática
                </p>
            </div>
        </div>
    );
}
