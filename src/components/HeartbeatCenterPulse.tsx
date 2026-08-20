import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeartbeatCenterPulseProps {
  isPulsing: boolean;
  className?: string;
}

export const HeartbeatCenterPulse: React.FC<HeartbeatCenterPulseProps> = ({
  isPulsing,
  className = ''
}) => {
  return (
    <div className={`w-full h-full relative overflow-hidden pointer-events-none ${className}`}>
      
      {/* 1. Subtle, Always-Present Faint Baseline */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-700/30" />

      {/* 2. Responsive Vector Heartbeat (P-Q-R-S-T) Centered Pulse */}
      <svg
        viewBox="0 0 800 60"
        preserveAspectRatio="none"
        className="w-full h-full absolute inset-0"
      >
        {/* Defs for gradients & glows */}
        <defs>
          <linearGradient id="ecgPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.05" />
            <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="48%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="52%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#34D399" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.05" />
          </linearGradient>

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Animated Pulse Waveform */}
        <AnimatePresence>
          {isPulsing && (
            <motion.g
              initial={{ opacity: 0, scaleY: 0.3 }}
              animate={{ 
                opacity: [0, 0.85, 0.85, 0],
                scaleY: [0.4, 1.1, 1, 0.2]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.6, 
                ease: "easeOut",
                times: [0, 0.15, 0.65, 1]
              }}
            >
              {/* Crisp Centered Medical ECG Path */}
              {/* Baseline at y=30. Center around x=400 */}
              <path
                d="M 0 30 
                   L 330 30 
                   Q 345 22 355 30 
                   L 375 30 
                   L 385 36 
                   L 400 4 
                   L 415 52 
                   L 425 30 
                   L 445 30 
                   Q 460 20 475 30 
                   L 800 30"
                fill="none"
                stroke="url(#ecgPulseGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowEffect)"
              />

              {/* Apex Highlight Point */}
              <circle
                cx="400"
                cy="4"
                r="3.5"
                fill="#FFFFFF"
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* 3. Central Ambient Radial Pulse Glow */}
      <AnimatePresence>
        {isPulsing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ 
              opacity: [0, 0.35, 0],
              scale: [0.6, 1.4, 1.8]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-radial from-cyan-400/30 via-emerald-400/15 to-transparent rounded-full blur-md pointer-events-none"
          />
        )}
      </AnimatePresence>

    </div>
  );
};
