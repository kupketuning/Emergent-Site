import React from 'react';
import { Link } from 'react-router-dom';

// Kupke Tuning Logo — zwei ineinandergreifende Rauten (Rot/Türkis) mit
// "KUPKE" als fette, kursive Wortmarke und "Tuning" als handgeschriebener Schriftzug oben rechts.
const LogoMark = () => (
  <svg viewBox="0 0 210 150" style={{ height: '100%' }} aria-hidden="true" data-testid="logo-mark">
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
      fill="#ffffff"
      stroke="#17191d"
      strokeWidth="2.4"
      paintOrder="stroke"
      style={{ strokeLinejoin: 'round' }}
    >
      KUPKE
    </text>
    <text
      x="118"
      y="38"
      fontFamily="'Permanent Marker', cursive"
      fontSize="26"
      fill="#17191d"
      transform="rotate(-8 150 30)"
      data-testid="logo-tuning-text"
    >
      Tuning
    </text>
  </svg>
);

const Logo = ({ showSlogan = true, size = 48, to = '/' }) => {
  const content = (
    <div className="flex flex-col leading-none" data-testid="logo-lockup">
      <div style={{ height: size, width: size * (210 / 150) }}>
        <LogoMark />
      </div>
      {showSlogan && (
        <div className="text-[10px] tracking-[0.14em] font-semibold uppercase mt-1 text-[#148F81]" data-testid="logo-slogan">
          Vom Motorsport auf die Straße
        </div>
      )}
    </div>
  );
  return to ? <Link to={to} className="inline-block">{content}</Link> : content;
};

export default Logo;
