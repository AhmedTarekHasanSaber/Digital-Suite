import React from 'react';

interface AppEmblemProps {
  type: 'meeting-detox' | 'knowledge-intelligence' | 'early-warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const AppEmblemIcon: React.FC<AppEmblemProps> = ({
  type,
  size = 'md',
  className = '',
  animated = true
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // APP 1: AI Meeting Detox & Strategic Velocity Emblem
  if (type === 'meeting-detox') {
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${currentSize} ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(154,27,56,0.25)]"
        >
          <defs>
            {/* Background Squircle Gradient */}
            <linearGradient id="detoxBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9A1B38" />
              <stop offset="50%" stopColor="#7E152D" />
              <stop offset="100%" stopColor="#4A0B1A" />
            </linearGradient>

            {/* Inner Sheen Gradient */}
            <linearGradient id="detoxSheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>

            {/* Gold Accent Gradient */}
            <linearGradient id="detoxGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="50%" stopColor="#FFB800" />
              <stop offset="100%" stopColor="#D48800" />
            </linearGradient>

            {/* Cyan Lightning Speed Bolt */}
            <linearGradient id="detoxSpeed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Squircle Base with Soft Outer Rim */}
          <rect
            x="3"
            y="3"
            width="58"
            height="58"
            rx="17"
            fill="url(#detoxBg)"
            stroke="url(#detoxGold)"
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />

          {/* Top Glass Highlight Reflection */}
          <path
            d="M 5 20 C 5 11 11 5 20 5 L 44 5 C 53 5 59 11 59 20 C 45 23 20 23 5 20 Z"
            fill="url(#detoxSheen)"
          />

          {/* Precision Chronos Dial Arc */}
          <circle
            cx="32"
            cy="33"
            r="19"
            stroke="#FFFFFF"
            strokeOpacity="0.15"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />

          {/* Speed Recovery Circular Glow Track */}
          <circle
            cx="32"
            cy="33"
            r="15"
            stroke="url(#detoxGold)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="60 30"
            className={animated ? 'animate-[spin_8s_linear_infinite] origin-center' : ''}
          />

          {/* Center Dynamic Time-Release Calendar / Async Hourglass Core */}
          {/* Calendar top bar */}
          <rect x="20" y="21" width="24" height="6" rx="2" fill="url(#detoxGold)" />
          <line x1="26" y1="18" x2="26" y2="23" stroke="#FFE066" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="38" y1="18" x2="38" y2="23" stroke="#FFE066" strokeWidth="2.2" strokeLinecap="round" />

          {/* Calendar Body */}
          <rect
            x="20"
            y="25"
            width="24"
            height="18"
            rx="2.5"
            fill="#FFFFFF"
            fillOpacity="0.12"
            stroke="#FFFFFF"
            strokeOpacity="0.3"
            strokeWidth="1"
          />

          {/* Central Lightning Bolt: Instant Async Fast-Track Decision */}
          <path
            d="M33 26 L26 35 H32 L30 43 L38 33 H32 L34 26 Z"
            fill="url(#detoxSpeed)"
            filter="drop-shadow(0 2px 4px rgba(56,189,248,0.5))"
          />

          {/* Mini Sparkling Executive Star */}
          <path
            d="M48 14 L49.5 17.5 L53 19 L49.5 20.5 L48 24 L46.5 20.5 L43 19 L46.5 17.5 Z"
            fill="url(#detoxGold)"
            className={animated ? 'animate-pulse' : ''}
          />
        </svg>
      </div>
    );
  }

  // APP 2: Institutional Knowledge & SOP Intelligence Core Emblem
  if (type === 'knowledge-intelligence') {
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${currentSize} ${className}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(2,132,199,0.25)]"
        >
          <defs>
            {/* Azure / Sapphire Cyber Gradient */}
            <linearGradient id="knowBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#082F49" />
            </linearGradient>

            {/* Sheen */}
            <linearGradient id="knowSheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>

            {/* Electric Cyan Neon Accent */}
            <linearGradient id="knowNeon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Neural Synapse Gold Glow */}
            <linearGradient id="knowSpark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Squircle Base */}
          <rect
            x="3"
            y="3"
            width="58"
            height="58"
            rx="17"
            fill="url(#knowBg)"
            stroke="url(#knowNeon)"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />

          {/* Top Glass Highlight */}
          <path
            d="M 5 20 C 5 11 11 5 20 5 L 44 5 C 53 5 59 11 59 20 C 45 23 20 23 5 20 Z"
            fill="url(#knowSheen)"
          />

          {/* Concentric Knowledge Lattice Network Grid */}
          <circle
            cx="32"
            cy="32"
            r="20"
            stroke="#38BDF8"
            strokeOpacity="0.2"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />

          {/* Neural Synapse Interconnect Paths */}
          <path
            d="M20 22 L32 17 L44 22 L47 34 L38 46 L26 46 L17 34 Z"
            stroke="url(#knowNeon)"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="#38BDF8"
            fillOpacity="0.06"
          />

          {/* 3D Knowledge Core Prism / Brain Synapse Cortex */}
          {/* Left Cortex Lobe */}
          <path
            d="M30 23 C26 23 22 26 22 30 C22 32 23 34 25 35 C23 37 23 40 25 42 C27 44 30 44 31 43"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Cortex Lobe */}
          <path
            d="M34 23 C38 23 42 26 42 30 C42 32 41 34 39 35 C41 37 41 40 39 42 C37 44 34 44 33 43"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central AI Synapse Power Axis */}
          <line x1="32" y1="21" x2="32" y2="44" stroke="url(#knowNeon)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Glowing Neural Synapse Nodes */}
          <circle cx="20" cy="22" r="2.5" fill="#38BDF8" />
          <circle cx="44" cy="22" r="2.5" fill="#38BDF8" />
          <circle cx="47" cy="34" r="2.5" fill="url(#knowSpark)" />
          <circle cx="17" cy="34" r="2.5" fill="url(#knowSpark)" />
          <circle cx="32" cy="32" r="3.5" fill="url(#knowSpark)" filter="drop-shadow(0 0 6px rgba(245,158,11,0.8))" />

          {/* Mini AI Intelligence Diamond */}
          <path
            d="M49 13 L51 17 L55 19 L51 21 L49 25 L47 21 L43 19 L47 17 Z"
            fill="#FFFFFF"
            className={animated ? 'animate-pulse' : ''}
          />
        </svg>
      </div>
    );
  }

  // APP 3: Delivery Risk & Early Warning Radar Shield Emblem
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${currentSize} ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(5,150,105,0.25)]"
      >
        <defs>
          {/* Emerald / Mint Tactical Shield Gradient */}
          <linearGradient id="radarBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Sheen */}
          <linearGradient id="radarSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>

          {/* Radiant Mint Neon */}
          <linearGradient id="radarMint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Warning Red Alert Signal */}
          <linearGradient id="radarAlert" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Squircle Base */}
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="17"
          fill="url(#radarBg)"
          stroke="url(#radarMint)"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />

        {/* Top Glass Highlight */}
        <path
          d="M 5 20 C 5 11 11 5 20 5 L 44 5 C 53 5 59 11 59 20 C 45 23 20 23 5 20 Z"
          fill="url(#radarSheen)"
        />

        {/* Concentric Sonar Rings */}
        <circle cx="32" cy="33" r="21" stroke="#34D399" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="32" cy="33" r="14" stroke="#34D399" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="32" cy="33" r="7" stroke="#34D399" strokeOpacity="0.4" strokeWidth="1" />

        {/* Tactical Crosshair Axes */}
        <line x1="32" y1="12" x2="32" y2="54" stroke="#34D399" strokeOpacity="0.35" strokeWidth="1.2" />
        <line x1="11" y1="33" x2="53" y2="33" stroke="#34D399" strokeOpacity="0.35" strokeWidth="1.2" />

        {/* Rotating Sonar Radar Sweep Beam */}
        <path
          d="M32 33 L47 18 A 21 21 0 0 1 53 33 Z"
          fill="url(#radarMint)"
          fillOpacity="0.3"
          className={animated ? 'animate-[spin_4s_linear_infinite] origin-[32px_33px]' : ''}
        />

        {/* Armored Defense Perimeter Shield Vector */}
        <path
          d="M32 19 L44 24 V34 C44 42 38 47 32 49 C26 47 20 42 20 34 V24 Z"
          fill="#064E3B"
          fillOpacity="0.65"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinejoin="round"
          filter="drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
        />

        {/* Shield Internal Glowing Verification Checkmark */}
        <path
          d="M27 34 L31 38 L38 29"
          stroke="url(#radarMint)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Detected Threat Target Ping Point (Safely Neutralized) */}
        <circle
          cx="44"
          cy="22"
          r="2.5"
          fill="url(#radarAlert)"
          className={animated ? 'animate-ping' : ''}
        />
        <circle cx="44" cy="22" r="2" fill="#EF4444" />
      </svg>
    </div>
  );
};
