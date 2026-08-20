import React, { useEffect, useRef } from 'react';

interface RealisticEcgCanvasProps {
  onPulsePeak?: () => void;
  className?: string;
  triggerSpike?: boolean;
}

export const RealisticEcgCanvas: React.FC<RealisticEcgCanvasProps> = ({ 
  onPulsePeak,
  className = '',
  triggerSpike = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onPulsePeakRef = useRef(onPulsePeak);
  onPulsePeakRef.current = onPulsePeak;

  const animStateRef = useRef({
    progress: 0, // 0 = idle/flat, 0 -> 1 = active pulse animation
    isPulsing: false,
    startTime: 0
  });

  // When triggerSpike becomes true, initiate a single crisp pulse centered in the container
  useEffect(() => {
    if (triggerSpike) {
      animStateRef.current = {
        progress: 0,
        isPulsing: true,
        startTime: performance.now()
      };
      if (onPulsePeakRef.current) {
        onPulsePeakRef.current();
      }
    }
  }, [triggerSpike]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || 400;
    let height = canvas.parentElement?.clientHeight || 36;

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);
    };

    resize();
    window.addEventListener('resize', resize);

    const DURATION_MS = 1100; // Duration of single heartbeat pulse wave

    const render = (time: number) => {
      const state = animStateRef.current;
      
      if (state.isPulsing) {
        const elapsed = time - state.startTime;
        state.progress = Math.min(1, elapsed / DURATION_MS);
        if (state.progress >= 1) {
          state.isPulsing = false;
        }
      }

      ctx.clearRect(0, 0, width, height);

      const midY = height / 2;

      // When pulsing, draw a single powerful & crisp medical heartbeat wave centered right in the middle
      if (state.isPulsing) {
        const p = state.progress; // 0 to 1
        
        // Opacity curve: fast rise (0 -> 0.15), strong sustain, gentle fade out (0.6 -> 1.0)
        let alpha = 0;
        if (p < 0.15) {
          alpha = p / 0.15;
        } else if (p < 0.65) {
          alpha = 1;
        } else {
          alpha = Math.max(0, 1 - (p - 0.65) / 0.35);
        }

        const centerX = width * 0.5;
        const pulseSpan = Math.min(width * 0.45, 180); // Width of the heartbeat complex in the center
        const startX = centerX - pulseSpan / 2;
        const endX = centerX + pulseSpan / 2;

        ctx.save();

        // 1. Subtle soft glow baseline across whole container
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.08})`;
        ctx.lineWidth = 1;
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY);
        ctx.stroke();

        // 2. Draw the prominent centered Heartbeat (P-Q-R-S-T) Spike
        ctx.beginPath();
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.65})`;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
        ctx.shadowBlur = 6;

        ctx.moveTo(0, midY);
        ctx.lineTo(startX, midY);

        // Sample points across the centered pulse span
        const numSteps = 70;
        for (let i = 0; i <= numSteps; i++) {
          const t = i / numSteps; // 0 to 1 across the pulse zone
          const x = startX + t * pulseSpan;
          let y = midY;

          // P-wave (small bump at 0.15 - 0.28)
          if (t >= 0.15 && t < 0.28) {
            const pt = (t - 0.15) / 0.13;
            y -= Math.sin(pt * Math.PI) * (height * 0.18);
          }
          // Q-wave (small dip at 0.38 - 0.44)
          else if (t >= 0.38 && t < 0.44) {
            const qt = (t - 0.38) / 0.06;
            y += Math.sin(qt * Math.PI) * (height * 0.16);
          }
          // R-wave (Sharp, powerful high spike in the exact center at 0.44 - 0.54)
          else if (t >= 0.44 && t < 0.54) {
            const rt = (t - 0.44) / 0.10;
            y -= Math.sin(rt * Math.PI) * (height * 0.44);
          }
          // S-wave (deep dip at 0.54 - 0.62)
          else if (t >= 0.54 && t < 0.62) {
            const st = (t - 0.54) / 0.08;
            y += Math.sin(st * Math.PI) * (height * 0.22);
          }
          // T-wave (smooth rounded recovery bump at 0.68 - 0.86)
          else if (t >= 0.68 && t < 0.86) {
            const tt = (t - 0.68) / 0.18;
            y -= Math.sin(tt * Math.PI) * (height * 0.26);
          }

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, midY);
        ctx.stroke();

        // 3. Central light crest point at apex of R-wave
        const apexY = midY - (height * 0.44);
        const apexX = startX + (0.49 * pulseSpan);
        ctx.beginPath();
        ctx.arc(apexX, apexY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full block pointer-events-none ${className}`}
    />
  );
};
