'use client';

import { ChevronDown } from 'lucide-react';

interface ScrollArrowProps {
  targetId: string;
  label?: string;
}

export function ScrollArrow({ targetId, label = 'Ver más' }: ScrollArrowProps) {
  const handleScroll = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex justify-center py-8 lg:py-12">
      <button
        onClick={handleScroll}
        className="group flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-lg p-4"
        aria-label={label}
      >
        <span className="text-sm font-medium text-gray-600 group-hover:text-[#83A98A] transition-colors duration-300">
          {label}
        </span>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#83A98A] to-[#6D8F75] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-bounce">
          <ChevronDown className="text-white" size={24} strokeWidth={2.5} />
        </div>
      </button>
    </div>
  );
}

