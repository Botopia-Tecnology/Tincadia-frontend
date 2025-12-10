import { useState, useEffect, useRef } from 'react';

export type TextColor = 'none' | 'yellow' | 'blue' | 'red';

const ZOOM_CONFIG = {
    MIN: 70,
    MAX: 200,
    DEFAULT: 100,
    STEP: 10,
} as const;

interface UseAccessibilityProps {
    disableAnimations?: boolean;
    setDisableAnimations?: (value: boolean) => void;
}

export function useAccessibility({
    disableAnimations: propDisableAnimations,
    setDisableAnimations: propSetDisableAnimations
}: UseAccessibilityProps = {}) {
    const [highContrast, setHighContrast] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [inverted, setInverted] = useState(false);
    const [grayscale, setGrayscale] = useState(false);
    const [largeCursor, setLargeCursor] = useState(false);
    const [zoomLevel, setZoomLevel] = useState<number>(ZOOM_CONFIG.DEFAULT);
    const [textColor, setTextColor] = useState<TextColor>('none');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Estado local para cuando no se pasan props
    const [localDisableAnimations, setLocalDisableAnimations] = useState(false);

    // Determinar el valor efectivo y la función de actualización
    const disableAnimations = propDisableAnimations ?? localDisableAnimations;
    const setDisableAnimations = (value: boolean) => {
        if (propSetDisableAnimations) {
            propSetDisableAnimations(value);
        } else {
            setLocalDisableAnimations(value);
        }
    };

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setShowColorPicker(true);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setShowColorPicker(false);
        }, 300);
    };

    const handleSetTextColor = (color: TextColor) => {
        // Si seleccionamos un color y no estamos en modo oscuro, lo activamos
        if (color !== 'none' && !darkMode) {
            setDarkMode(true);
        }
        setTextColor(color);
    };

    const handleSetInverted = (value: boolean) => {
        setInverted(value);
        // Si desactivamos el modo invertido, reseteamos el color
        if (!value) {
            setTextColor('none');
        }
    };

    // Aplicar filtros de accesibilidad al documento
    useEffect(() => {
        const filters: string[] = [];

        if (highContrast) filters.push('contrast(150%)');
        if (inverted) filters.push('invert(1) hue-rotate(180deg)');
        if (grayscale) filters.push('grayscale(100%)');

        document.documentElement.style.filter = filters.join(' ') || 'none';
        document.documentElement.style.fontSize = `${zoomLevel}%`;

        // Aplicar o quitar clase de modo invertido
        if (inverted) {
            document.documentElement.classList.add('accessibility-inverted');
        } else {
            document.documentElement.classList.remove('accessibility-inverted');
        }

        // Aplicar color de texto - Usamos colores brillantes directamente
        // Ya no dependemos del modo invertido, funcionan con modo oscuro
        const colorMap: Record<TextColor, string> = {
            none: '',
            yellow: '#FAEE00',  // Amarillo Neón Chillón exacto
            blue: '#00BFFF',    // Azul Cielo Brillante
            red: '#FF0000',     // Rojo Brillante
        };

        // Limpiar clases de colores anteriores
        document.documentElement.classList.remove(
            'accessibility-text-color',
            'accessibility-text-yellow',
            'accessibility-text-blue',
            'accessibility-text-red'
        );
        document.documentElement.style.removeProperty('--accessibility-text-color');

        if (textColor !== 'none') {
            // Aplicar variable CSS y clases
            document.documentElement.style.setProperty('--accessibility-text-color', colorMap[textColor]);
            document.documentElement.classList.add('accessibility-text-color');
            document.documentElement.classList.add(`accessibility-text-${textColor}`);
        }

        // Cursor grande
        if (largeCursor) {
            document.documentElement.classList.add('accessibility-large-cursor');
        } else {
            document.documentElement.classList.remove('accessibility-large-cursor');
        }

        if (disableAnimations) {
            document.documentElement.classList.add('accessibility-no-animations');
        } else {
            document.documentElement.classList.remove('accessibility-no-animations');
        }

        if (darkMode) {
            document.documentElement.classList.add('accessibility-dark-mode');
        } else {
            document.documentElement.classList.remove('accessibility-dark-mode');
        }

        return () => {
            document.documentElement.style.filter = 'none';
            document.documentElement.style.fontSize = '100%';
            document.documentElement.classList.remove('accessibility-large-cursor');
            document.documentElement.classList.remove('accessibility-no-animations');
            document.documentElement.classList.remove('accessibility-dark-mode');
            document.documentElement.classList.remove('accessibility-inverted');
            document.documentElement.style.removeProperty('--accessibility-text-color');
            document.documentElement.classList.remove('accessibility-text-color');
            document.documentElement.classList.remove('accessibility-text-yellow');
            document.documentElement.classList.remove('accessibility-text-blue');
            document.documentElement.classList.remove('accessibility-text-red');
        };
    }, [highContrast, darkMode, inverted, grayscale, zoomLevel, largeCursor, disableAnimations, textColor]);

    // Funciones de control de zoom
    const increaseZoom = () => {
        setZoomLevel((prev) => Math.min(prev + ZOOM_CONFIG.STEP, ZOOM_CONFIG.MAX));
    };

    const decreaseZoom = () => {
        setZoomLevel((prev) => Math.max(prev - ZOOM_CONFIG.STEP, ZOOM_CONFIG.MIN));
    };

    const resetZoom = () => {
        setZoomLevel(ZOOM_CONFIG.DEFAULT);
    };

    return {
        state: {
            highContrast,
            darkMode,
            inverted,
            grayscale,
            largeCursor,
            zoomLevel,
            textColor,
            showColorPicker,
            disableAnimations,
        },
        actions: {
            setHighContrast,
            setDarkMode,
            setInverted: handleSetInverted,
            setGrayscale,
            setLargeCursor,
            setDisableAnimations,
            setTextColor: handleSetTextColor,
            increaseZoom,
            decreaseZoom,
            resetZoom,
            handleMouseEnter,
            handleMouseLeave,
        },
        config: {
            ZOOM_CONFIG,
        },
    };
}
