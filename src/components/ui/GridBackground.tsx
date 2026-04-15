import React from 'react';

interface GridBackgroundProps {
    className?: string;
}

export function GridBackground({ className = '' }: GridBackgroundProps) {
    return (
        <div
            className={`absolute inset-0 -z-20 bg-white dark:bg-slate-900 ${className}`}
            style={{
                backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px),
          radial-gradient(circle 500px at 0% 20%, rgba(131,169,138,0.1), transparent),
          radial-gradient(circle 500px at 100% 0%, rgba(109,143,117,0.12), transparent)
        `,
                backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
            }}
        >
            <div className="absolute inset-0 text-slate-200/50 dark:text-slate-800/50 pointer-events-none" />
        </div>
    );
}
