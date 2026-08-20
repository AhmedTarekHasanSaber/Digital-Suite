import React, { useEffect, useRef } from 'react';

interface RealisticEcgCanvasProps {
  onPulsePeak?: () => void;
  className?: string;
  triggerSpike?: boolean;
  isFlashing?: boolean;
}

export const RealisticEcgCanvas: React.FC<RealisticEcgCanvasProps> = ({ 
  onPulsePeak,
  className = '',
  triggerSpike = false,
  isFlashing = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onPulsePeakRef = useRef(onPulsePeak);
  onPulsePeakRef.current = onPulsePeak;

  const triggerSpikeRef = useRef(triggerSpike);
  triggerSpikeRef.current = triggerSpike;

  const isFlashingRef = useRef(isFlashing);
  isFlashingRef.current = isFlashing;

  const pendingSpikeRef = useRef(false);

  useEffect(() => {
    if (triggerSpike) {
      pendingSpikeRef.current = true;
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

    const midY = height / 2;
    let points: number[] = new Array(width).fill(midY);
    
    let xCursor = 0;
    let cyclePhase = 0;
    let lastPeakFired = false;
    let isSpikeActive = false;

    // Responsive ECG sample generator
    const getEcgSample = (phase: number, allowPeak: boolean, currentHeight: number): number => {
      const mid = currentHeight / 2;
      if (!allowPeak) {
        // Very quiet baseline
        return mid + (Math.sin(phase * Math.PI * 2) * 0.4) + (Math.random() * 0.2 - 0.1);
      }

      // P wave (at 0.15 - 0.28)
      if (phase >= 0.15 && phase < 0.28) {
        const pPhase = (phase - 0.15) / 0.13;
        return mid - Math.sin(pPhase * Math.PI) * (currentHeight * 0.18);
      }
      // Q dip (at 0.38 - 0.42)
      if (phase >= 0.38 && phase < 0.42) {
        const qPhase = (phase - 0.38) / 0.04;
        return mid + Math.sin(qPhase * Math.PI) * (currentHeight * 0.14);
      }
      // R sharp high spike (at 0.42 - 0.48)
      if (phase >= 0.42 && phase < 0.48) {
        const rPhase = (phase - 0.42) / 0.06;
        if (!lastPeakFired && rPhase > 0.4 && rPhase < 0.6) {
          lastPeakFired = true;
          if (onPulsePeakRef.current) onPulsePeakRef.current();
        }
        return mid - Math.sin(rPhase * Math.PI) * (currentHeight * 0.42);
      }
      // S dip (at 0.48 - 0.54)
      if (phase >= 0.48 && phase < 0.54) {
        const sPhase = (phase - 0.48) / 0.06;
        return mid + Math.sin(sPhase * Math.PI) * (currentHeight * 0.22);
      }
      // T wave (at 0.62 - 0.80)
      if (phase >= 0.62 && phase < 0.80) {
        const tPhase = (phase - 0.62) / 0.18;
        return mid - Math.sin(tPhase * Math.PI) * (currentHeight * 0.25);
      }
      // Reset peak trigger for next cycle
      if (phase >= 0.9) {
        lastPeakFired = false;
        isSpikeActive = false;
      }
      // Baseline
      return mid + (Math.random() * 0.3 - 0.15);
    };

    let lastTime = performance.now();
    const speed = 0.45; // Smooth ambient speed

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (points.length !== width) {
        points = new Array(width).fill(height / 2);
        xCursor = 0;
      }

      const stepPixels = Math.max(1, Math.round(dt * speed * 120));
      for (let s = 0; s < stepPixels; s++) {
        xCursor = (xCursor + 1) % width;
        const prevPhase = cyclePhase;
        cyclePhase = (cyclePhase + 0.005) % 1.0;

        if (cyclePhase < prevPhase) {
          if (pendingSpikeRef.current) {
            isSpikeActive = true;
            pendingSpikeRef.current = false;
          }
        }

        points[xCursor] = getEcgSample(cyclePhase, isSpikeActive, height);
      }

      ctx.clearRect(0, 0, width, height);

      // Translucent, elegant trace behind content
      const isCurrentlyFlashing = isFlashingRef.current || isSpikeActive;
      ctx.lineWidth = isCurrentlyFlashing ? 1.6 : 1.1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const eraseGap = 16;

      for (let i = 0; i < width - 1; i++) {
        let distBehind = (xCursor - i + width) % width;
        if (distBehind > width - eraseGap) continue;

        const decay = Math.max(0.05, 1 - (distBehind / width) * 0.85);

        ctx.beginPath();
        if (isCurrentlyFlashing) {
          // Soft cyan/emerald ambient wave when active
          ctx.strokeStyle = `rgba(56, 189, 248, ${decay * 0.45})`;
        } else {
          // Very gentle, almost invisible ambient baseline
          ctx.strokeStyle = `rgba(148, 163, 184, ${decay * 0.12})`;
        }
        ctx.moveTo(i, points[i]);
        ctx.lineTo(i + 1, points[i + 1]);
        ctx.stroke();
      }

      // Sweep blip head (faint and unobtrusive)
      const curY = points[xCursor];
      ctx.beginPath();
      ctx.arc(xCursor, curY, isCurrentlyFlashing ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = isCurrentlyFlashing ? 'rgba(56, 189, 248, 0.6)' : 'rgba(148, 163, 184, 0.25)';
      ctx.fill();

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
