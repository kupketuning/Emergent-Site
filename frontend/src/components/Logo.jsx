import React from 'react';
import { Link } from 'react-router-dom';

// Kupke Tuning Logo — zwei ineinandergreifende Rauten (Rot/Türkis) mit
// "KUPKE" als fette, kursive Wortmarke und "Tuning" als handgeschriebener Schriftzug.
const LogoMark = ({ textColor }) => (
  <svg viewBox="0 0 320 130" style={{ height: '100%' }} aria-hidden="true" data-testid="logo-mark">
    <path
      d="M18,30 C25,10 32,42 40,20 C46,4 53,24 58,12"
      fill="none"
      stroke={textColor}
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.85"
    />
    <rect x="26" y="41" width="68" height="68" rx="6" fill="var(--kt-red)" transform="rotate(45 60 75)" />
    <rect x="66" y="41" width="68" height="68" rx="6" fill="var(--kt-teal)" transform="rotate(45 100 75)" />
    <text
      x="6"
      y="97"
      fontFamily="'Oswald', sans-serif"
      fontWeight="800"
      fontStyle="italic"
      fontSize="42"
      letterSpacing="-1"
      fill={textColor}
    >
      KUPKE
    </text>
    <text
      x="182"
      y="46"
      fontFamily="'Permanent Marker', cursive"
      fontSize="26"
      fill={textColor}
      transform="rotate(-8 210 40)"
    >
      Tuning
    </text>
  </svg>
);

const Logo = ({ variant = 'dark', showSlogan = true, size = 48, to = '/' }) => {
  const textColor = variant === 'dark' ? '#17191d' : '#ffffff';
  const content = (
    <div className="flex flex-col leading-none" data-testid="logo-lockup">
      <div style={{ height: size, width: size * (320 / 130) }}>
        <LogoMark textColor={textColor} />
      </div>
      {showSlogan && (
        <div className="text-[10px] tracking-[0.14em] font-semibold uppercase mt-1 text-[#2EC4B6]" data-testid="logo-slogan">
          Vom Motorsport auf die Straße
        </div>
      )}
    </div>
  );
  return to ? <Link to={to} className="inline-block">{content}</Link> : content;
};

export default Logo;
