import React from 'react';

interface FlagProps {
  className?: string;
}

export const ColombiaFlag = ({ className = "w-5 h-5" }: FlagProps) => (
  <svg
    viewBox="0 0 3 2"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="3" height="1" fill="#FFCD00" />
    <rect width="3" height="0.5" y="1" fill="#003087" />
    <rect width="3" height="0.5" y="1.5" fill="#C8102E" />
  </svg>
);

export const USAFlag = ({ className = "w-5 h-5" }: FlagProps) => (
  <svg
    viewBox="0 0 7410 3900"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="7410" height="3900" fill="#B22234" />
    <path
      d="M0,300H7410M0,900H7410M0,1500H7410M0,2100H7410M0,2700H7410M0,3300H7410"
      stroke="#fff"
      strokeWidth="300"
    />
    <rect width="2964" height="2100" fill="#3C3B6E" />
    <g fill="#fff">
      <g id="s18">
        <g id="s9">
          <g id="s5">
            <g id="s">
              <polygon id="star" points="0,-123 72,99 -117,-40 117,-40 -72,99" />
            </g>
            <use xlinkHref="#s" y="420" />
            <use xlinkHref="#s" y="840" />
            <use xlinkHref="#s" y="1260" />
            <use xlinkHref="#s" y="1680" />
          </g>
          <use xlinkHref="#s5" x="247" y="210" />
        </g>
        <use xlinkHref="#s9" x="494" />
      </g>
      <use xlinkHref="#s18" x="988" />
      <use xlinkHref="#s9" x="1976" />
      <use xlinkHref="#s5" x="2470" />
    </g>
  </svg>
);

export const BrazilFlag = ({ className = "w-5 h-5" }: FlagProps) => (
  <svg
    viewBox="0 0 720 504"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="720" height="504" fill="#009739" />
    <path d="M72,252 360,72 648,252 360,432z" fill="#FEDD00" />
    <circle cx="360" cy="252" r="126" fill="#012169" />
    <path
      d="M234,252a126,126 0 0 1 252,0"
      fill="none"
      stroke="#fff"
      strokeWidth="8"
    />
  </svg>
);
