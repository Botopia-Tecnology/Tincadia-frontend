'use client';

import { useState, useEffect } from 'react';
import {
  Eye,
  Moon,
  Sun,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export function AccessibilityButton() {
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
        <div className="fixed top-1/3 right-3 z-50 font-sans">
            <div className="w-12 bg-[#1E4DD8] rounded-full py-3 px-1.5 shadow-2xl flex flex-col items-center gap-1.5 text-white">
                <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        highContrast ? 'bg-white text-[#1E4DD8]' : 'bg-white/25 hover:bg-white/40'
                    }`}
                    aria-pressed={highContrast}
                    aria-label="Activar alto contraste"
                >
                    <Sun size={18} />
                </button>
                <button
                    onClick={() => setInverted(!inverted)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        inverted ? 'bg-white text-[#1E4DD8]' : 'bg-white/25 hover:bg-white/40'
                    }`}
                    aria-pressed={inverted}
                    aria-label="Invertir colores"
                >
                    <Moon size={18} />
                </button>
                <button
                    onClick={() => setGrayscale(!grayscale)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        grayscale ? 'bg-white text-[#1E4DD8]' : 'bg-white/25 hover:bg-white/40'
                    }`}
                    aria-pressed={grayscale}
                    aria-label="Activar escala de grises"
                >
                    <Eye size={18} />
                </button>
                <div className="w-7 h-px bg-white/40 my-1" aria-hidden="true" />
                <button
                    onClick={decreaseZoom}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/25 hover:bg-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Disminuir tamaño de texto"
                    disabled={zoomLevel <= 70}
                >
                    <ZoomOut size={18} />
                </button>
                <button
                    onClick={() => setZoomLevel(100)}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/25 hover:bg-white/40 transition-colors"
                    aria-label="Restablecer tamaño de texto"
                >
                    <RotateCcw size={18} />
                </button>
                <button
                    onClick={increaseZoom}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/25 hover:bg-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Aumentar tamaño de texto"
                    disabled={zoomLevel >= 200}
                >
                    <ZoomIn size={18} />
                </button>
            </div>
        </div>
    );
}
