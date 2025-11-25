'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  Moon,
  Sun,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Pause,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface AccessibilityButtonProps {
  isRegistrationPanelOpen?: boolean;
  disableAnimations?: boolean;
  setDisableAnimations?: (value: boolean) => void;
}

// Constantes de configuración
const ZOOM_CONFIG = {
  MIN: 70,
  MAX: 200,
  DEFAULT: 100,
  STEP: 10,
} as const;

const ACCESSIBILITY_COLORS = {
  BAR: '#1E4DD8',
  BUTTON_ACTIVE: 'bg-white text-[#1E4DD8]',
  BUTTON_INACTIVE: 'bg-white/25 hover:bg-white/40',
} as const;

const SIZE_CONFIG = {
  NORMAL: {
    barWidth: 'w-12',
    buttonSize: 'w-9 h-9',
    iconSize: 18,
    gap: 'gap-1.5',
    padding: 'py-3 px-1.5',
    dividerWidth: 'w-7',
    dividerMargin: 'my-1',
  },
  COMPACT: {
    barWidth: 'w-9',
    buttonSize: 'w-7 h-7',
    iconSize: 14,
    gap: 'gap-1',
    padding: 'py-2 px-1',
    dividerWidth: 'w-5',
    dividerMargin: 'my-0.5',
  },
} as const;

// Tipo para los tamaños
type SizeConfig = typeof SIZE_CONFIG.NORMAL | typeof SIZE_CONFIG.COMPACT;

// Componente de botón de característica reutilizable
interface FeatureButtonProps {
  feature: AccessibilityFeature;
  sizes: SizeConfig;
}

const FeatureButton = ({ feature, sizes }: FeatureButtonProps) => {
  const Icon = feature.icon;
  return (
    <button
      onClick={feature.onClick}
      className={`${sizes.buttonSize} rounded-full flex items-center justify-center transition-all duration-300 ${feature.isActive ? ACCESSIBILITY_COLORS.BUTTON_ACTIVE : ACCESSIBILITY_COLORS.BUTTON_INACTIVE
        }`}
      aria-pressed={feature.isActive}
      aria-label={feature.label}
    >
      <Icon size={sizes.iconSize} />
    </button>
  );
};

// Componente de botón de zoom reutilizable
interface ZoomButtonProps {
  icon: React.ComponentType<{ size: number }>;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  sizes: SizeConfig;
}

const ZoomButton = ({ icon: Icon, onClick, label, disabled = false, sizes }: ZoomButtonProps) => (
  <button
    onClick={onClick}
    className={`${sizes.buttonSize} rounded-full flex items-center justify-center ${ACCESSIBILITY_COLORS.BUTTON_INACTIVE} transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
    aria-label={label}
    disabled={disabled}
  >
    <Icon size={sizes.iconSize} />
  </button>
);

interface AccessibilityFeature {
  id: string;
  icon: React.ComponentType<{ size: number }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function AccessibilityButton({
  isRegistrationPanelOpen = false,
  disableAnimations: propDisableAnimations,
  setDisableAnimations: propSetDisableAnimations
}: AccessibilityButtonProps) {
  const t = useTranslation();
  const [highContrast, setHighContrast] = useState(false);
  const [inverted, setInverted] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [largeCursor, setLargeCursor] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(ZOOM_CONFIG.DEFAULT);

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

  // Aplicar filtros de accesibilidad al documento
  useEffect(() => {
    const filters: string[] = [];

    if (highContrast) filters.push('contrast(150%)');
    if (inverted) filters.push('invert(1) hue-rotate(180deg)');
    if (grayscale) filters.push('grayscale(100%)');

    document.documentElement.style.filter = filters.join(' ') || 'none';
    document.documentElement.style.fontSize = `${zoomLevel}%`;

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

    return () => {
      document.documentElement.style.filter = 'none';
      document.documentElement.style.fontSize = '100%';
      document.documentElement.classList.remove('accessibility-large-cursor');
      document.documentElement.classList.remove('accessibility-no-animations');
    };
  }, [highContrast, inverted, grayscale, zoomLevel, largeCursor, disableAnimations]);

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

  // Configuración de tamaños según el estado del panel
  const sizes = useMemo(
    () => (isRegistrationPanelOpen ? SIZE_CONFIG.COMPACT : SIZE_CONFIG.NORMAL),
    [isRegistrationPanelOpen]
  );

  // Configuración de posición cuando el panel está abierto
  const positionClass = useMemo(
    () => (isRegistrationPanelOpen ? 'lg:right-[calc(33.333%+0.75rem)]' : ''),
    [isRegistrationPanelOpen]
  );

  // Características de accesibilidad
  const features: AccessibilityFeature[] = useMemo(() => [
    {
      id: 'highContrast',
      icon: Sun,
      label: t('accessibility.highContrast'),
      isActive: highContrast,
      onClick: () => setHighContrast(!highContrast),
    },
    {
      id: 'inverted',
      icon: Moon,
      label: t('accessibility.invertColors'),
      isActive: inverted,
      onClick: () => setInverted(!inverted),
    },
    {
      id: 'grayscale',
      icon: Eye,
      label: t('accessibility.grayscale'),
      isActive: grayscale,
      onClick: () => setGrayscale(!grayscale),
    },
    {
      id: 'largeCursor',
      icon: MousePointer2,
      label: t('accessibility.largeCursor'),
      isActive: largeCursor,
      onClick: () => setLargeCursor(!largeCursor),
    },
    {
      id: 'disableAnimations',
      icon: Pause,
      label: t('accessibility.disableAnimations'),
      isActive: disableAnimations,
      onClick: () => setDisableAnimations(!disableAnimations),
    },
  ], [t, highContrast, inverted, grayscale, largeCursor, disableAnimations]);


  return (
    <div
      className={`fixed top-1/3 right-3 z-50 font-sans transition-all duration-300 ${positionClass}`}
    >
      <div
        className={`${sizes.barWidth} bg-[#1E4DD8] rounded-full ${sizes.padding} shadow-2xl flex flex-col items-center ${sizes.gap} text-white transition-all duration-300`}
      >
        {/* Características de accesibilidad */}
        {features.map((feature) => (
          <FeatureButton key={feature.id} feature={feature} sizes={sizes} />
        ))}

        {/* Divisor */}
        <div
          className={`${sizes.dividerWidth} h-px bg-white/40 ${sizes.dividerMargin}`}
          aria-hidden="true"
        />

        {/* Controles de zoom */}
        <ZoomButton
          icon={ZoomOut}
          onClick={decreaseZoom}
          label={t('accessibility.decreaseText')}
          disabled={zoomLevel <= ZOOM_CONFIG.MIN}
          sizes={sizes}
        />
        <ZoomButton
          icon={RotateCcw}
          onClick={resetZoom}
          label={t('accessibility.resetText')}
          sizes={sizes}
        />
        <ZoomButton
          icon={ZoomIn}
          onClick={increaseZoom}
          label={t('accessibility.increaseText')}
          disabled={zoomLevel >= ZOOM_CONFIG.MAX}
          sizes={sizes}
        />
      </div>
    </div>
  );
}
