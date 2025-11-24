'use client';

import { useState, useEffect } from 'react';
import { Accessibility, Eye, Moon, Sun, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';

export function AccessibilityButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [inverted, setInverted] = useState(false);
    const [grayscale, setGrayscale] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);

    useEffect(() => {
        // Apply filters to html tag
        const filters = [];
        if (highContrast) filters.push('contrast(150%)');
        if (inverted) filters.push('invert(1) hue-rotate(180deg)'); // Smart invert
        if (grayscale) filters.push('grayscale(100%)');

        document.documentElement.style.filter = filters.join(' ') || 'none';

        // Apply zoom to html tag (font-size percentage)
        // Default is usually 16px (100%). Tailwind uses rems, so changing root font-size scales everything.
        document.documentElement.style.fontSize = `${zoomLevel}%`;

        // Cleanup
        return () => {
            document.documentElement.style.filter = 'none';
            document.documentElement.style.fontSize = '100%';
        };
    }, [highContrast, inverted, grayscale, zoomLevel]);

    const reset = () => {
        setHighContrast(false);
        setInverted(false);
        setGrayscale(false);
        setZoomLevel(100);
    };

    const increaseZoom = () => {
        if (zoomLevel < 200) {
            setZoomLevel(prev => Math.min(prev + 10, 200));
        }
    };

    const decreaseZoom = () => {
        if (zoomLevel > 70) {
            setZoomLevel(prev => Math.max(prev - 10, 70));
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Menu */}
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">Accesibilidad</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Cerrar menú de accesibilidad"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Zoom Controls */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="block text-sm font-bold text-gray-700 mb-2">Tamaño de texto ({zoomLevel}%)</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={decreaseZoom}
                                    disabled={zoomLevel <= 70}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-[#83A98A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Disminuir tamaño de texto"
                                >
                                    <ZoomOut size={18} />
                                    <span className="text-sm font-medium">-</span>
                                </button>
                                <button
                                    onClick={increaseZoom}
                                    disabled={zoomLevel >= 200}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-[#83A98A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Aumentar tamaño de texto"
                                >
                                    <ZoomIn size={18} />
                                    <span className="text-sm font-medium">+</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setInverted(!inverted)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${inverted ? 'bg-[#83A98A] text-white border-[#83A98A]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#83A98A] hover:bg-gray-50'}`}
                            aria-pressed={inverted}
                        >
                            <Moon size={20} />
                            <div className="text-left">
                                <span className="block text-sm font-bold">Modo Invertido</span>
                                <span className="block text-xs opacity-80">Invierte los colores (Modo Oscuro)</span>
                            </div>
                        </button>

                        <button
                            onClick={() => setHighContrast(!highContrast)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${highContrast ? 'bg-[#83A98A] text-white border-[#83A98A]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#83A98A] hover:bg-gray-50'}`}
                            aria-pressed={highContrast}
                        >
                            <Eye size={20} />
                            <div className="text-left">
                                <span className="block text-sm font-bold">Alto Contraste</span>
                                <span className="block text-xs opacity-80">Aumenta la diferencia de colores</span>
                            </div>
                        </button>

                        <button
                            onClick={() => setGrayscale(!grayscale)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${grayscale ? 'bg-[#83A98A] text-white border-[#83A98A]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#83A98A] hover:bg-gray-50'}`}
                            aria-pressed={grayscale}
                        >
                            <Sun size={20} />
                            <div className="text-left">
                                <span className="block text-sm font-bold">Escala de Grises</span>
                                <span className="block text-xs opacity-80">Elimina el color</span>
                            </div>
                        </button>

                        <div className="h-px bg-gray-100 my-2" />

                        <button
                            onClick={reset}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                            <RotateCcw size={16} />
                            Restablecer ajustes
                        </button>
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-[#83A98A] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#6D8F75] hover:scale-110 transition-all focus:outline-none focus:ring-4 focus:ring-[#83A98A]/50 z-50"
                aria-label="Opciones de accesibilidad"
                aria-expanded={isOpen}
                title="Accesibilidad"
            >
                <Accessibility size={28} strokeWidth={1.5} />
            </button>
        </div>
    );
}
