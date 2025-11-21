'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  priority?: boolean;
  onClick?: () => void;
}

export function Logo({
  href = '/',
  className = '',
  imageClassName = '',
  showText = false,
  priority = false,
  onClick,
}: LogoProps) {
  const logoImage = (
    <div className={`relative w-32 h-10 lg:w-40 lg:h-12 flex-shrink-0 ${imageClassName}`}>
      <Image
        src="/media/images/main_logo.png"
        alt="Logo Tincadia"
        fill
        sizes="(max-width: 1024px) 128px, 160px"
        className="object-contain object-left"
        priority={priority}
      />
    </div>
  );

  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      {logoImage}
      {showText && (
        <span className="text-xl font-bold text-gray-900">Tincadia</span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="-m-1.5 p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-md"
        aria-label="Tincadia - Inicio"
      >
        <span className="sr-only">Tincadia</span>
        {logoContent}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className="-m-1.5 p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83A98A] rounded-md"
      aria-label="Tincadia - Inicio"
    >
      <span className="sr-only">Tincadia</span>
      {logoContent}
    </Link>
  );
}

