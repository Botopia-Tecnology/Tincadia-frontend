'use client';

import { Info, X } from 'lucide-react';
import React from 'react';

interface AnnouncementBannerProps {
  onClose: () => void;
}

export function AnnouncementBanner({ onClose }: AnnouncementBannerProps) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 fixed top-0 left-0 right-0 z-[60] h-12 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center min-w-0">
            <span className="flex p-1.5 rounded-lg bg-amber-100/80 mr-3">
              <Info className="h-4 w-4 text-amber-700" aria-hidden="true" />
            </span>
            <p className="font-medium text-amber-900 text-xs sm:text-sm truncate">
              <span className="md:hidden font-bold">Registro requerido:</span>
              <span className="hidden md:inline font-bold">V-BETA:</span>
              <span className="ml-1">
                Se solicita a los usuarios antiguos realizar su registro nuevamente; su información será restaurada.
              </span>
            </p>
          </div>
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={onClose}
              type="button"
              className="flex p-1.5 rounded-md hover:bg-amber-100 focus:outline-none transition-colors group"
              aria-label="Cerrar anuncio"
            >
              <X className="h-4 w-4 text-amber-500 group-hover:text-amber-700" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
