import React from 'react';

interface GridBackgroundProps {
    className?: string;
}

export function GridBackground({ className = '' }: GridBackgroundProps) {
    return (
        <div
            className={`absolute inset-0 -z-20 ${className}`}
            style={{
                backgroundImage: `
          linear-gradient(to right, rgba(229,231,235,0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(229,231,235,0.2) 1px, transparent 1px),
          radial-gradient(circle 500px at 0% 20%, rgba(131,169,138,0.08), transparent),
          radial-gradient(circle 500px at 100% 0%, rgba(109,143,117,0.1), transparent)
        `,
                backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
                backgroundColor: "white",
            }}
        />
    );
}
