import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Language } from '../types';
import { 
  Cpu, 
  TrendingUp,
  Clock,
  Zap,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RealisticEcgCanvas } from './RealisticEcgCanvas';
import { useExecutiveMetrics } from '../context/ExecutiveMetricsContext';

interface LiveHeartbeatTelemetryBarProps {
  lang: Language;
}

interface TelemetryEvent {
  id: string;
  squadEn: string;
  squadAr: string;
  actionEn: string;
  actionAr: string;
  type: 'jira' | 'confluence' | 'alert' | 'decision';
  latencyMs: number;
}

const TELEMETRY_STREAM_POOL: Omit<TelemetryEvent, 'id' | 'latencyMs'>[] = [
  {
    squadEn: 'Squad Core-Banking',
    squadAr: 'فريق الأنظمة المصرفية المركزية',
    actionEn: 'Ingested 14 Jira issue transitions • Telemetry baseline verified',
    actionAr: 'تم استيعاب 14 انتقال حالة في Jira • التحقق من مؤشرات الأداء',
    type: 'jira'
  },
  {
    squadEn: 'Squad Mobile Banking',
    squadAr: 'فريق تطبيق الموبايل البنكي',
    actionEn: 'Pattern match: Early warning alert synthesized for SLA drift',
    actionAr: 'رصد نمط: توليد إنذار مبكر استباقي لانحراف الـ SLA',
    type: 'alert'
  },
  {
    squadEn: 'Squad Cards & Payments',
    squadAr: 'فريق البطاقات والمدفوعات',
    actionEn: 'Indexed new Confluence RFC • Knowledge friction reduced by 88%',
    actionAr: 'فهرسة وثيقة Confluence جديدة • تقليص احتكاك المعرفة بـ 88%',
    type: 'confluence'
  },
  {
    squadEn: 'Squad Corporate & SME',
    squadAr: 'فريق الشركات والمشاريع',
    actionEn: 'Synthesized 1-Page Decision Pack • 45 min meeting decoupled to async',
    actionAr: 'توليد حزمة قرار من صفحة واحدة • تحويل اجتماع 45 دقيقة لقرار غير متزامن',
    type: 'decision'
  },
  {
    squadEn: 'Squad Digital Onboarding',
    squadAr: 'فريق فتح الحسابات الرقمية',
    actionEn: 'Scanned 18 blocker dependencies • Velocity drift mitigated',
    actionAr: 'فحص 18 اعتمادية حرجة • تحييد أي تعطل في وتيرة الإطلاق',
    type: 'jira'
  },
  {
    squadEn: 'Squad Wealth & Investments',
    squadAr: 'فريق إدارة الثروات والاستثمار',
    actionEn: 'Knowledge graph updated • Cross-silo search response 0.4s',
    actionAr: 'تحديث رسم المعرفة • زمن استرجاع المعلومة عبر الفرق 0.4 ثانية',
    type: 'confluence'
  },
  {
    squadEn: 'Squad Open Banking APIs',
    squadAr: 'فريق واجهات الخدمات المصرفية المفتوحة',
    actionEn: 'API Gateway metrics normalized • 0 false positive anomalies',
    actionAr: 'معايرة مؤشرات بوابة الـ APIs • صفر تنبيهات خاطئة',
    type: 'alert'
  }
];

export const LiveHeartbeatTelemetryBar: React.FC<LiveHeartbeatTelemetryBarProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const { totalHoursSaved, totalUsdSaved, activeDecisionsCount, liveAdditionalHours, liveAdditionalUsd } = useExecutiveMetrics();
  
  // Real-time auto-incrementing counters
  const [totalEventsAnalyzed, setTotalEventsAnalyzed] = useState(2849120);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [activeHeartbeatPulse, setActiveHeartbeatPulse] = useState(false);
  const [recentIncrement, setRecentIncrement] = useState<number | null>(null);
  const [eventFlash, setEventFlash] = useState(false);
  const [triggerSpike, setTriggerSpike] = useState(false);

  // Format dynamic dollar amounts cleanly
  const formattedUsd = useMemo(() => {
    const millions = totalUsdSaved / 1000000;
    return `+$${millions.toFixed(2)}M`;
  }, [totalUsdSaved]);

  const formattedHours = useMemo(() => {
    return `+${totalHoursSaved.toLocaleString()}h`;
  }, [totalHoursSaved]);

  // Subtle telemetry pulse response
  const handlePulsePeak = useCallback(() => {
    setActiveHeartbeatPulse(true);
    setTimeout(() => setActiveHeartbeatPulse(false), 450);
  }, []);

  // NATURAL, NON-UNIFORM EVENT ARRIVAL GENERATOR (Random intervals between 3.8s and 8.2s)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextEvent = () => {
      const naturalDelay = Math.floor(Math.random() * 4400) + 3800;

      timeoutId = setTimeout(() => {
        setCurrentEventIndex(prev => (prev + 1) % TELEMETRY_STREAM_POOL.length);

        setTriggerSpike(true);
        setTimeout(() => setTriggerSpike(false), 200);

        setEventFlash(true);
        setTimeout(() => setEventFlash(false), 1400);

        const delta = Math.floor(Math.random() * 9) + 4;
        setTotalEventsAnalyzed(prev => prev + delta);
        setRecentIncrement(delta);
        setTimeout(() => setRecentIncrement(null), 1200);

        scheduleNextEvent();
      }, naturalDelay);
    };

    scheduleNextEvent();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const activeEvent = TELEMETRY_STREAM_POOL[currentEventIndex];

  return (
    <div className="shrink-0 w-full mb-2 sm:mb-2.5">
      <div className="relative overflow-hidden rounded-2xl bg-[#0A1931] border border-slate-700/80 shadow-md text-white p-2.5 sm:p-3 flex flex-col gap-2 justify-center">
        
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 via-[#FFB800] to-cyan-500" />

        {/* MOBILE TOP ROW (Visible on small screens < md) to showcase high impact ROI numbers */}
        <div className="flex md:hidden items-center justify-between gap-2 border-b border-slate-800 pb-2">
          {/* Beacon + Counter */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-rose-950/80 border border-rose-500/40 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-70 ${
                  activeHeartbeatPulse ? 'scale-150 duration-300' : ''
                }`}></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-[10px] font-bold text-rose-300 font-mono">
                {isAr ? 'بث حي' : 'LIVE'}
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="font-bold text-slate-200">
                {totalEventsAnalyzed.toLocaleString()}
              </span>
              {recentIncrement && (
                <span className="text-[9px] font-bold text-[#FFB800] bg-amber-950/90 px-1 rounded border border-amber-500/30">
                  +{recentIncrement}
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics Badges for Mobile */}
          <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10.5px]">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>{formattedUsd}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-950/80 border border-sky-500/40 text-sky-300 font-bold">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>{formattedHours}</span>
            </div>
          </div>
        </div>

        {/* DESKTOP & FULL RESPONSIVE ROW */}
        <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 sm:gap-3">
          
          {/* DESKTOP LEFT: Real-Time Telemetry Status Badge & Live Counter */}
          <div className="hidden md:flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Pulsing Beacon Pill */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-rose-950/70 border border-rose-500/30 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60 ${
                  activeHeartbeatPulse ? 'scale-150 duration-300' : ''
                }`}></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-rose-300/90 font-mono tracking-wider">
                {isAr ? 'البث والتحليل الحي' : 'LIVE AI TELEMETRY'}
              </span>
            </div>

            {/* Live Counter */}
            <div className="flex items-center gap-1.5 font-mono">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-sans font-bold uppercase tracking-wider">
                  {isAr ? 'البيانات المعالجة' : 'Processed Events'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-black text-white">
                    {totalEventsAnalyzed.toLocaleString()}
                  </span>
                  <AnimatePresence>
                    {recentIncrement && (
                      <motion.span
                        initial={{ opacity: 0, y: 2, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -3 }}
                        className="text-[9px] font-bold text-[#FFB800] bg-amber-950/80 px-1 rounded border border-amber-500/30"
                      >
                        +{recentIncrement}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>

          {/* MIDDLE: Event Stream with Translucent ECG Pulse Wave in the Background ONLY */}
          <div className="relative flex-1 min-w-0 bg-slate-900/90 rounded-xl px-2.5 sm:px-3 py-1.5 border border-slate-700/60 overflow-hidden flex items-center justify-between gap-2 shadow-inner min-h-[36px]">
            
            {/* 1. REAL-TIME TRANSLUCENT ECG CANVAS IN BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
              <RealisticEcgCanvas 
                onPulsePeak={handlePulsePeak} 
                triggerSpike={triggerSpike} 
                isFlashing={eventFlash} 
              />
            </div>

            {/* 2. SUBTLE TRANSLUCENT BACKGROUND WAVE EFFECT */}
            <div 
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out bg-gradient-to-r from-cyan-500/10 via-emerald-500/15 to-transparent z-0 ${
                eventFlash ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* 3. Subtle traveling scan beam on arrival */}
            <div 
              className={`absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none transition-transform duration-1000 ease-out z-0 ${
                eventFlash ? 'translate-x-[600px]' : '-translate-x-full'
              }`}
            />

            {/* 4. HIGH-CONTRAST, SUPER-CLEAR FOREGROUND TEXT LAYER */}
            <div className="relative z-10 flex items-center gap-2 min-w-0 overflow-hidden py-0.5">
              <div className={`p-1 rounded-md transition-colors duration-300 shrink-0 ${
                eventFlash 
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50' 
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}>
                <Cpu className="w-3.5 h-3.5" />
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEventIndex}
                  initial={{ opacity: 0, x: isAr ? 8 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isAr ? -8 : 8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex items-center gap-1.5 sm:gap-2 min-w-0 text-[11px] sm:text-[11.5px]"
                >
                  <span className="font-bold text-[#FFB800] shrink-0 font-mono tracking-tight drop-shadow-xs text-[10px] sm:text-[11px]">
                    [{isAr ? activeEvent.squadAr : activeEvent.squadEn}]
                  </span>
                  <span className="text-slate-100 font-medium truncate drop-shadow-xs">
                    {isAr ? activeEvent.actionAr : activeEvent.actionEn}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-10 shrink-0 flex items-center">
              <span className={`inline-flex items-center gap-1 text-[8.5px] sm:text-[9px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full border transition-all duration-300 ${
                eventFlash 
                  ? 'text-emerald-300 bg-emerald-950 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]' 
                  : 'text-slate-400 bg-slate-800/80 border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  eventFlash ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500/70'
                }`}></span>
                <span className="font-semibold">{isAr ? 'الآن' : 'INGESTED'}</span>
              </span>
            </div>
          </div>

          {/* DESKTOP RIGHT: High-Impact CIO Executive Value Metrics */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3 shrink-0 text-start sm:text-end">
            
            {/* Active Decisions Real-time Indicator */}
            {activeDecisionsCount > 0 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-amber-500/20 border border-[#FFB800]/50 text-[#FFB800] text-[10px] font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#FFB800]" />
                <span>
                  {isAr 
                    ? `${activeDecisionsCount} قرارات مفعلة` 
                    : `${activeDecisionsCount} Active Decisions`}
                </span>
              </motion.div>
            )}

            {/* 01. Total Financial Value Recovered */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/40 shadow-xs relative overflow-hidden group">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] text-emerald-300/80 font-bold uppercase tracking-wider">
                    {isAr ? 'الوفر المالي التراكمي' : 'Cumulative Savings'}
                  </span>
                  {liveAdditionalUsd > 0 && (
                    <span className="text-[8.5px] font-mono font-bold text-amber-300 bg-amber-950/90 px-1 rounded">
                      +${Math.round(liveAdditionalUsd / 1000)}k
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-black font-mono text-emerald-300 flex items-center gap-0.5">
                  {formattedUsd}
                  <span className="text-[10px] text-emerald-400 font-sans font-bold">{isAr ? '/سنة' : '/yr'}</span>
                </span>
              </div>
            </div>

            {/* 02. Total Engineering Hours Saved / Decoupled */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-950/70 border border-sky-500/40 shadow-xs relative overflow-hidden">
              <div className="p-1 rounded-lg bg-sky-500/20 text-sky-300">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] text-sky-300/80 font-bold uppercase tracking-wider">
                    {isAr ? 'ساعات العمل المحررة' : 'Hours Recovered'}
                  </span>
                  {liveAdditionalHours > 0 && (
                    <span className="text-[8.5px] font-mono font-bold text-amber-300 bg-amber-950/90 px-1 rounded">
                      +{liveAdditionalHours.toLocaleString()}h
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-black font-mono text-sky-300 flex items-center gap-0.5">
                  {formattedHours}
                  <span className="text-[10px] text-sky-400 font-sans font-bold">{isAr ? ' سنوياً' : '/yr'}</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
