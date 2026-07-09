

export const LogoSVG = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Page Backgrounds */}
    <path d="M 50 15 L 15 85 C 25 92 40 92 50 88 Z" fill="var(--color-paper)" />
    <path d="M 50 15 C 90 15 90 85 50 88 Z" fill="var(--color-primary)" />
    
    {/* Thick Outlines */}
    {/* Left diagonal for A */}
    <path d="M 50 15 L 15 85" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" />
    {/* Bottom curve for A */}
    <path d="M 15 85 C 25 92 40 92 50 88" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" />
    
    {/* Top/Right curve for D */}
    <path d="M 50 15 C 90 15 90 85 50 88" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" />
    
    {/* Spine (Right leg of A, Left leg of D) */}
    <path d="M 50 15 V 88" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" />
    
    {/* A crossbar */}
    <path d="M 28 60 L 50 60" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" />
    
    {/* D inner hole (Page details) */}
    <path d="M 50 35 C 72 35 72 68 50 68" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" />
    
    {/* Small decorative action lines (comic style) */}
    <path d="M 12 30 L 22 40" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
    <path d="M 88 20 L 78 30" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const InkBurstSVG = ({ className = "w-6 h-6", filled = true }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 5C55 25 70 30 90 35C70 45 65 60 70 85C55 75 40 75 25 90C30 65 20 50 5 45C25 40 35 25 50 5Z" 
          fill={filled ? "var(--color-ink)" : "transparent"} 
          stroke="var(--color-ink)" strokeWidth="5" strokeLinejoin="round"/>
  </svg>
);

export const LightningSVG = ({ className = "w-6 h-6", filled = true }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M45 10L15 55H50L40 90L85 45H45L45 10Z" 
          fill={filled ? "var(--color-primary)" : "transparent"} 
          stroke="var(--color-ink)" strokeWidth="5" strokeLinejoin="round"/>
  </svg>
);

export const BookOpenSVG = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 20C20 20 40 10 50 20C60 10 80 20 80 20V80C80 80 60 70 50 80C40 70 20 80 20 80V20Z" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M50 20V80" stroke="var(--color-ink)" strokeWidth="5" strokeLinecap="round"/>
    <path d="M30 40H40" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round"/>
    <path d="M60 40H70" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

export const CheckSVG = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 50L40 70L80 30" fill="none" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CrossSVG = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 25L75 75M75 25L25 75" fill="none" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowRightSVG = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 50H80M60 30L80 50L60 70" fill="none" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowLeftSVG = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M80 50H20M40 30L20 50L40 70" fill="none" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SearchSVG = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="45" cy="45" r="25" fill="none" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round"/>
    <path d="M65 65L85 85" fill="none" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);
