'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// ─── Configuration ──────────────────────────────────────────────
const TOTAL_FRAMES = 140;
const FRAME_PATH = '/frames/frame_';
const FRAME_EXT = '.jpg';
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 720;

/** Lerp factor: 0.08 = very smooth, 0.15 = snappy */
const LERP_FACTOR = 0.08;

function getFrameSrc(index: number): string {
  const num = String(Math.min(Math.max(index, 1), TOTAL_FRAMES)).padStart(4, '0');
  return `${FRAME_PATH}${num}${FRAME_EXT}`;
}

/** Ease-out cubic for smooth deceleration */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Ease-in-out cubic for Apple-like smooth S-curve transitions */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface ScrollAnimationProps {
  className?: string;
  /** Render prop: receives scroll progress (0–1) */
  children?: (progress: number) => React.ReactNode;
}

export function ScrollAnimation({ className = '', children }: ScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Lerp state
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const drawnFrameRef = useRef(-1);
  const progressRef = useRef(0);
  const lerpRafRef = useRef<number | null>(null);

  // ─── Preload ───────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    let loaded = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const onLoad = () => {
      loaded++;
      if (mounted) setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
      if (loaded === TOTAL_FRAMES && mounted) setIsLoaded(true);
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i + 1);
      img.onload = onLoad;
      img.onerror = onLoad;
      images[i] = img;
    }
    imagesRef.current = images;
    return () => { mounted = false; };
  }, []);

  // ─── Draw frame with dynamic scale & position ─────────────
  // Instead of CSS transform (pixelates!), we scale the image
  // INSIDE the canvas draw call for crisp rendering at any size.
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.clientWidth * dpr;
    const displayH = canvas.clientHeight * dpr;

    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    }

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, displayW, displayH);

    // ─── Scale-in animation tied to actual frame ─────────
    const p = frameIndex / (TOTAL_FRAMES - 1);
    const growPhase = Math.min(1, p / 0.50);  // Growth over first 50% of scroll
    const eased = easeInOutCubic(growPhase);

    const isVertical = displayW < displayH;
    const isMobile = displayW < 1024;

    // Scale to COVER the canvas (prevents letterboxing cuts on taller screens)
    const scaleX = displayW / FRAME_WIDTH;
    const scaleY = displayH / FRAME_HEIGHT;
    const coverScale = isVertical ? scaleX : Math.max(scaleX, scaleY);

    // Scale animation: 50% of full size -> 100% of full size (no extra margin)
    const currentScale = coverScale * (0.50 + 0.50 * eased);

    const drawW = FRAME_WIDTH * currentScale;
    const drawH = FRAME_HEIGHT * currentScale;

    // Position X: Desktop starts right (65%) -> moves to center (50%); Mobile: centered
    const offsetX = isMobile ? 0.50 : (0.65 - 0.15 * eased);

    // Position Y: centered (50%) -> slightly lower (58%)
    const startY = isMobile ? 0.70 : 0.50;
    const endY   = isMobile ? 0.85 : 0.58;
    const offsetY = startY + (endY - startY) * eased;

    const drawX = displayW * offsetX - drawW / 2;
    const drawY = displayH * offsetY - drawH / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // ─── Scroll → target frame + progress ──────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScrollable = rect.height - windowH;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScrollable));

      targetFrameRef.current = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(p * (TOTAL_FRAMES - 1)))
      );
      progressRef.current = p;
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded]);

  // ─── Lerp loop ─────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    drawFrame(0);
    drawnFrameRef.current = 0;

    const animate = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.1) {
        currentFrameRef.current += diff * LERP_FACTOR;
      } else {
        currentFrameRef.current = target;
      }

      const frameInt = Math.round(currentFrameRef.current);
      // Always redraw to update scale/position even if frame didn't change
      drawnFrameRef.current = frameInt;
      drawFrame(frameInt);

      lerpRafRef.current = requestAnimationFrame(animate);
    };

    lerpRafRef.current = requestAnimationFrame(animate);
    return () => { if (lerpRafRef.current !== null) cancelAnimationFrame(lerpRafRef.current); };
  }, [isLoaded, drawFrame]);

  // ─── Resize ────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    const handleResize = () => drawFrame(Math.round(currentFrameRef.current));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, drawFrame]);

  return (
    <div ref={containerRef} className={`relative h-[250vh] ${className}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        {/* Loading */}
        {!isLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white">
            <div className="relative w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#83A98A] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="mt-3 text-sm text-gray-400 font-medium tracking-wide">
              {loadProgress}%
            </span>
          </div>
        )}

        {/* Canvas — no CSS transform, scaling is done inside drawImage */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* Overlay content */}
        {children && (
          <div className="absolute inset-0 z-10">
            {children(progress)}
          </div>
        )}
      </div>
    </div>
  );
}
