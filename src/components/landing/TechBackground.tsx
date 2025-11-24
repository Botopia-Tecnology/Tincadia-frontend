'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container, Engine } from '@tsparticles/engine';

export function TechBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // console.log(container);
  };

  if (!init) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={{
          background: {
            color: { value: "transparent" },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "grab" },
              resize: { enable: true },
            },
            modes: {
              push: { quantity: 4 },
              grab: { distance: 140, links: { opacity: 0.2 } },
            },
          },
          particles: {
            color: { value: "#83A98A" },
            links: {
              color: "#83A98A",
              distance: 150,
              enable: true,
              opacity: 0.4, // Reducida opacidad para que no estorben
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: { enable: true },
              value: 80,
            },
            opacity: { value: 0.3 }, // Reducida opacidad para que no estorben
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0"
      />
    </div>
  );
}
