import React from 'react';

interface GridBackgroundProps {
    className?: string;
}

export function GridBackground({ className = '' }: GridBackgroundProps) {
    return (
        <div
            className={`absolute inset-0 -z-20 bg-white dark:bg-[#020617] ${className}`}
            style={{
                backgroundImage: `
          linear-gradient(to right, #f0f0f0 1px, transparent 1px),
          linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
          radial-gradient(circle 500px at 0% 20%, rgba(131,169,138,0.05), transparent),
          radial-gradient(circle 500px at 100% 0%, rgba(109,143,117,0.08), transparent)
        `,
                backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
            }}
        >
            <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] dark:bg-[size:48px_48px] pointer-events-none opacity-0 dark:opacity-100" />
        </div>
    );
}
