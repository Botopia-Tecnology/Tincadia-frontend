'use client';

import { useMemo } from 'react';
import {
  Eye,
  Moon,
  Sun,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Pause,
  Droplet,
  Palette,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUI } from '@/contexts/UIContext';
import { useAccessibilityContext } from '@/contexts/AccessibilityContext';

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

interface AccessibilityFeature {
  id: string;
  icon: React.ComponentType<{ size: number }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

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

export function AccessibilityButton() {
  const t = useTranslation();
  const { isRegistrationPanelOpen } = useUI();
  const { state, actions, config } = useAccessibilityContext();

  const {
    highContrast,
    darkMode,
    inverted,
    grayscale,
    largeCursor,
    zoomLevel,
    textColor,
    showColorPicker,
    disableAnimations: effectiveDisableAnimations,
  } = state;

  const {
    setHighContrast,
    setDarkMode,
    setInverted,
    setGrayscale,
    setLargeCursor,
    setDisableAnimations: setEffectiveDisableAnimations,
    setTextColor,
    increaseZoom,
    decreaseZoom,
    resetZoom,
    handleMouseEnter,
    handleMouseLeave,
  } = actions;

  const { ZOOM_CONFIG } = config;

  // Configuración de tamaños según el estado del panel
  // Mobile sizes are handled via CSS responsive classes
  const sizes = useMemo(
    () => (isRegistrationPanelOpen ? SIZE_CONFIG.COMPACT : SIZE_CONFIG.COMPACT),
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
      id: 'darkMode',
      icon: Moon,
      label: t('accessibility.darkMode'),
      isActive: darkMode,
      onClick: () => setDarkMode(!darkMode),
    },
    {
      id: 'inverted',
      icon: Palette,
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
      isActive: effectiveDisableAnimations,
      onClick: () => setEffectiveDisableAnimations(!effectiveDisableAnimations),
    },
  ], [t, highContrast, darkMode, inverted, grayscale, largeCursor, effectiveDisableAnimations, setHighContrast, setDarkMode, setInverted, setGrayscale, setLargeCursor, setEffectiveDisableAnimations]);


  return (
    <div
      className={`fixed top-1/3 right-3 z-50 font-sans transition-all duration-300 ${positionClass}`}
    >
      <div className="relative flex items-center gap-3">
        {/* Main Accessibility Bar */}
        <div
          className={`${sizes.barWidth} bg-[#1E4DD8] rounded-full ${sizes.padding} shadow-2xl flex flex-col items-center ${sizes.gap} text-white transition-all duration-300`}
        >
          {/* Características de accesibilidad */}
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative flex items-center justify-center"
              onMouseEnter={() => {
                if (feature.id === 'inverted') {
                  handleMouseEnter();
                }
              }}
              onMouseLeave={() => {
                if (feature.id === 'inverted') {
                  handleMouseLeave();
                }
              }}
            >
              {/* Color Picker Popup - Positioned next to the inverted button */}
              {feature.id === 'inverted' && showColorPicker && (
                <div
                  className="absolute right-full mr-3 bg-white rounded-lg shadow-xl p-1.5 flex gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200 z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ marginRight: '12px' }}
                >
                  <button
                    onClick={() => setTextColor('yellow')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${textColor === 'yellow' ? 'scale-110 ring-2 ring-offset-1 ring-yellow-500' : 'hover:scale-105'
                      }`}
                    style={{ backgroundColor: '#FFFF00' }}
                    aria-label="Texto amarillo brillante"
                    title="Texto amarillo brillante"
                  >
                    <Droplet size={16} className="text-black" fill="currentColor" />
                  </button>
                  <button
                    onClick={() => setTextColor('blue')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${textColor === 'blue' ? 'bg-blue-500 scale-110 ring-2 ring-offset-1 ring-blue-500' : 'bg-blue-500/80 hover:bg-blue-500'
                      }`}
                    aria-label="Texto azul brillante"
                    title="Texto azul brillante"
                  >
                    <Droplet size={16} className="text-white" fill="currentColor" />
                  </button>
                  <button
                    onClick={() => setTextColor('red')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${textColor === 'red' ? 'bg-red-500 scale-110 ring-2 ring-offset-1 ring-red-500' : 'bg-red-500/80 hover:bg-red-500'
                      }`}
                    aria-label="Texto rojo brillante"
                    title="Texto rojo brillante"
                  >
                    <Droplet size={16} className="text-white" fill="currentColor" />
                  </button>
                  {textColor !== 'none' && (
                    <button
                      onClick={() => setTextColor('none')}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-gray-600"
                      aria-label="Restablecer color"
                      title="Restablecer color"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              )}
              <FeatureButton feature={feature} sizes={sizes} />
            </div>
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
    </div>
  );
}
