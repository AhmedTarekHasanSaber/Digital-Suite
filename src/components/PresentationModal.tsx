import React, { useState, useMemo } from 'react';
import { DemoIdea, Language } from '../types';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Presentation, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Bot, 
  DollarSign, 
  Clock, 
  ArrowRight,
  ArrowLeft,
  Layers,
  Building2,
  BarChart3,
  LineChart as LineChartIcon,
  Calendar,
  Zap,
  Activity,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { 
  useExecutiveMetrics, 
  AppliedMeetingDecision, 
  ResolvedKnowledgeGap, 
  MitigatedWarningItem 
} from '../context/ExecutiveMetricsContext';
import { AppEmblemIcon } from './AppEmblemIcons';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: DemoIdea[];
  lang: Language;
  onLaunchDemo: (id: string) => void;
}

type TimeframeMode = 'weeks' | 'years';
type MetricMode = 'hours' | 'money_kwd' | 'money_usd';

// Tool 1 (Meeting Detox) Dataset: Previous State vs Current (AI)
const TOOL1_WEEKS = [
  { period: 'W2', labelEn: 'W2', labelAr: 'أ 2', previousHours: 65, currentHours: 20, previousKWD: 2600, currentKWD: 800, previousUSD: 8476, currentUSD: 2608 },
  { period: 'W4', labelEn: 'W4', labelAr: 'أ 4', previousHours: 160, currentHours: 50, previousKWD: 6400, currentKWD: 2000, previousUSD: 20864, currentUSD: 6520 },
  { period: 'W6', labelEn: 'W6', labelAr: 'أ 6', previousHours: 360, currentHours: 120, previousKWD: 14400, currentKWD: 4800, previousUSD: 46944, currentUSD: 15648 },
  { period: 'W8', labelEn: 'W8', labelAr: 'أ 8', previousHours: 630, currentHours: 210, previousKWD: 25200, currentKWD: 8400, previousUSD: 82152, currentUSD: 27384 },
  { period: 'W10', labelEn: 'W10', labelAr: 'أ 10', previousHours: 975, currentHours: 325, previousKWD: 39000, currentKWD: 13000, previousUSD: 127140, currentUSD: 42380 },
  { period: 'W12', labelEn: 'W12', labelAr: 'أ 12', previousHours: 1380, currentHours: 460, previousKWD: 55200, currentKWD: 18400, previousUSD: 179952, currentUSD: 59984 },
];

const TOOL1_YEARS = [
  { period: 'Y1', labelEn: 'Year 1', labelAr: 'السنة 1', previousHours: 3060, currentHours: 1220, previousKWD: 122400, currentKWD: 48800, previousUSD: 399024, currentUSD: 159088 },
  { period: 'Y2', labelEn: 'Year 2', labelAr: 'السنة 2', previousHours: 6120, currentHours: 2440, previousKWD: 244800, currentKWD: 97600, previousUSD: 798048, currentUSD: 318176 },
  { period: 'Y3', labelEn: 'Year 3', labelAr: 'السنة 3', previousHours: 9000, currentHours: 3600, previousKWD: 360000, currentKWD: 144000, previousUSD: 1173600, currentUSD: 469440 },
];

// Tool 2 (Knowledge Gap SOPs) Dataset: Previous State vs Current (AI)
const TOOL2_WEEKS = [
  { period: 'W2', labelEn: 'W2', labelAr: 'أ 2', previousHours: 25, currentHours: 5, previousKWD: 1000, currentKWD: 200, previousUSD: 3260, currentUSD: 652 },
  { period: 'W4', labelEn: 'W4', labelAr: 'أ 4', previousHours: 75, currentHours: 10, previousKWD: 3000, currentKWD: 400, previousUSD: 9780, currentUSD: 1304 },
  { period: 'W6', labelEn: 'W6', labelAr: 'أ 6', previousHours: 175, currentHours: 25, previousKWD: 7000, currentKWD: 1000, previousUSD: 22820, currentUSD: 3260 },
  { period: 'W8', labelEn: 'W8', labelAr: 'أ 8', previousHours: 320, currentHours: 40, previousKWD: 12800, currentKWD: 1600, previousUSD: 41728, currentUSD: 5216 },
  { period: 'W10', labelEn: 'W10', labelAr: 'أ 10', previousHours: 490, currentHours: 60, previousKWD: 19600, currentKWD: 2400, previousUSD: 63896, currentUSD: 7824 },
  { period: 'W12', labelEn: 'W12', labelAr: 'أ 12', previousHours: 700, currentHours: 80, previousKWD: 28000, currentKWD: 3200, previousUSD: 91280, currentUSD: 10432 },
];

const TOOL2_YEARS = [
  { period: 'Y1', labelEn: 'Year 1', labelAr: 'السنة 1', previousHours: 1450, currentHours: 170, previousKWD: 58000, currentKWD: 6800, previousUSD: 189080, currentUSD: 22168 },
  { period: 'Y2', labelEn: 'Year 2', labelAr: 'السنة 2', previousHours: 3200, currentHours: 350, previousKWD: 128000, currentKWD: 14000, previousUSD: 417280, currentUSD: 45640 },
  { period: 'Y3', labelEn: 'Year 3', labelAr: 'السنة 3', previousHours: 5150, currentHours: 550, previousKWD: 206000, currentKWD: 22000, previousUSD: 671560, currentUSD: 71720 },
];

// Tool 3 (Early Warning Shield) Dataset: Previous State vs Current (AI)
const TOOL3_WEEKS = [
  { period: 'W2', labelEn: 'W2', labelAr: 'أ 2', previousHours: 35, currentHours: 5, previousKWD: 4000, currentKWD: 500, previousUSD: 13040, currentUSD: 1630 },
  { period: 'W4', labelEn: 'W4', labelAr: 'أ 4', previousHours: 110, currentHours: 15, previousKWD: 14000, currentKWD: 2000, previousUSD: 45640, currentUSD: 6520 },
  { period: 'W6', labelEn: 'W6', labelAr: 'أ 6', previousHours: 245, currentHours: 35, previousKWD: 33000, currentKWD: 4500, previousUSD: 107580, currentUSD: 14670 },
  { period: 'W8', labelEn: 'W8', labelAr: 'أ 8', previousHours: 440, currentHours: 60, previousKWD: 60000, currentKWD: 8000, previousUSD: 195600, currentUSD: 26080 },
  { period: 'W10', labelEn: 'W10', labelAr: 'أ 10', previousHours: 685, currentHours: 95, previousKWD: 95000, currentKWD: 13000, previousUSD: 309700, currentUSD: 42380 },
  { period: 'W12', labelEn: 'W12', labelAr: 'أ 12', previousHours: 975, currentHours: 135, previousKWD: 137500, currentKWD: 19000, previousUSD: 448250, currentUSD: 61940 },
];

const TOOL3_YEARS = [
  { period: 'Y1', labelEn: 'Year 1', labelAr: 'السنة 1', previousHours: 2250, currentHours: 300, previousKWD: 226500, currentKWD: 30000, previousUSD: 738390, currentUSD: 97800 },
  { period: 'Y2', labelEn: 'Year 2', labelAr: 'السنة 2', previousHours: 4750, currentHours: 650, previousKWD: 485000, currentKWD: 65000, previousUSD: 1581100, currentUSD: 211900 },
  { period: 'Y3', labelEn: 'Year 3', labelAr: 'السنة 3', previousHours: 7900, currentHours: 1100, previousKWD: 820000, currentKWD: 110000, previousUSD: 2673200, currentUSD: 358600 },
];

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  ideas,
  lang,
  onLaunchDemo
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const { 
    appliedMeetingDecisions, 
    resolvedKnowledgeGaps, 
    mitigatedWarnings,
    totalHoursSaved,
    totalUsdSaved,
    totalKwdSaved,
    liveAdditionalHours,
    liveAdditionalUsd,
    liveAdditionalKwd,
    activeDecisionsCount
  } = useExecutiveMetrics();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Chart Interactive Filters on Slide 0
  const [timeframe, setTimeframe] = useState<TimeframeMode>('years');
  const [metric, setMetric] = useState<MetricMode>('hours');

  // Slide 0: Executive Overview (3 Graphs); Slides 1..3: Idea 1, 2, 3; Slide 4: Strategic Roadmap Summary
  const totalSlides = 5;

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  // Tool 1 Dynamic Dataset
  const t1LiveAdditionalHours = useMemo(() => {
    return Object.values(appliedMeetingDecisions).reduce((acc: number, curr: AppliedMeetingDecision) => acc + (curr?.hoursSaved || 0), 0);
  }, [appliedMeetingDecisions]);

  const t1LiveAdditionalKwd = useMemo(() => {
    return Object.values(appliedMeetingDecisions).reduce((acc: number, curr: AppliedMeetingDecision) => acc + (curr?.kwdSaved || 0), 0);
  }, [appliedMeetingDecisions]);

  const t1Data = useMemo(() => {
    const raw = timeframe === 'weeks' ? TOOL1_WEEKS : TOOL1_YEARS;
    if (t1LiveAdditionalHours === 0) return raw;

    const count = Object.keys(appliedMeetingDecisions).length;
    const impactFactor = Math.min(0.45, count * 0.09);

    return raw.map(pt => ({
      ...pt,
      currentHours: Math.max(1, Math.round(pt.currentHours * (1 - impactFactor))),
      currentKWD: Math.max(10, Math.round(pt.currentKWD * (1 - impactFactor))),
      currentUSD: Math.max(30, Math.round(pt.currentUSD * (1 - impactFactor))),
    }));
  }, [timeframe, t1LiveAdditionalHours, appliedMeetingDecisions]);

  // Tool 2 Dynamic Dataset
  const t2LiveAdditionalHours = useMemo(() => {
    return Object.values(resolvedKnowledgeGaps).reduce((acc: number, curr: ResolvedKnowledgeGap) => acc + (curr?.hoursSaved || 0), 0);
  }, [resolvedKnowledgeGaps]);

  const t2LiveAdditionalKwd = useMemo(() => {
    return Object.values(resolvedKnowledgeGaps).reduce((acc: number, curr: ResolvedKnowledgeGap) => acc + (curr?.kwdSaved || 0), 0);
  }, [resolvedKnowledgeGaps]);

  const t2Data = useMemo(() => {
    const raw = timeframe === 'weeks' ? TOOL2_WEEKS : TOOL2_YEARS;
    if (t2LiveAdditionalHours === 0) return raw;

    const count = Object.keys(resolvedKnowledgeGaps).length;
    const impactFactor = Math.min(0.40, count * 0.10);

    return raw.map(pt => ({
      ...pt,
      currentHours: Math.max(1, Math.round(pt.currentHours * (1 - impactFactor))),
      currentKWD: Math.max(10, Math.round(pt.currentKWD * (1 - impactFactor))),
      currentUSD: Math.max(30, Math.round(pt.currentUSD * (1 - impactFactor))),
    }));
  }, [timeframe, t2LiveAdditionalHours, resolvedKnowledgeGaps]);

  // Tool 3 Dynamic Dataset
  const t3LiveAdditionalKwd = useMemo(() => {
    return Object.values(mitigatedWarnings).reduce((acc: number, curr: MitigatedWarningItem) => acc + (curr?.kwdProtected || 0), 0);
  }, [mitigatedWarnings]);

  const t3LiveAdditionalHours = useMemo(() => {
    return Object.values(mitigatedWarnings).reduce((acc: number, curr: MitigatedWarningItem) => acc + (curr?.hoursSaved || 0), 0);
  }, [mitigatedWarnings]);

  const t3Data = useMemo(() => {
    const raw = timeframe === 'weeks' ? TOOL3_WEEKS : TOOL3_YEARS;
    if (t3LiveAdditionalKwd === 0) return raw;

    const count = Object.keys(mitigatedWarnings).length;
    const impactFactor = Math.min(0.50, count * 0.12);

    return raw.map(pt => ({
      ...pt,
      currentHours: Math.max(1, Math.round(pt.currentHours * (1 - impactFactor))),
      currentKWD: Math.max(10, Math.round(pt.currentKWD * (1 - impactFactor))),
      currentUSD: Math.max(30, Math.round(pt.currentUSD * (1 - impactFactor))),
    }));
  }, [timeframe, t3LiveAdditionalKwd, mitigatedWarnings]);

  const t1ReductionPct = useMemo(() => {
    const count = Object.keys(appliedMeetingDecisions).length;
    return Math.min(88, 60 + count * 6);
  }, [appliedMeetingDecisions]);

  const t2ReductionPct = useMemo(() => {
    const count = Object.keys(resolvedKnowledgeGaps).length;
    return Math.min(96, 89 + count * 2);
  }, [resolvedKnowledgeGaps]);

  const t3ReductionPct = useMemo(() => {
    const count = Object.keys(mitigatedWarnings).length;
    return Math.min(95, 86 + count * 3);
  }, [mitigatedWarnings]);

  const prevKey = metric === 'hours' ? 'previousHours' : (metric === 'money_kwd' ? 'previousKWD' : 'previousUSD');
  const currKey = metric === 'hours' ? 'currentHours' : (metric === 'money_kwd' ? 'currentKWD' : 'currentUSD');
  const unitSuffix = metric === 'hours' ? 'h' : (metric === 'money_kwd' ? ' KD' : ' $');

  const formatYAxis = (v: number) => {
    if (metric === 'hours') return `${v}h`;
    if (metric === 'money_kwd') return `${Math.round(v / 1000)}k KD`;
    return `$${Math.round(v / 1000)}k`;
  };

  const formatTooltipVal = (v: number) => {
    if (metric === 'hours') return `${v.toLocaleString()} hrs`;
    if (metric === 'money_kwd') return `${v.toLocaleString()} KD`;
    return `$${v.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-900/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-5xl h-full sm:h-[92vh] sm:max-h-[750px] rounded-none sm:rounded-2xl bg-white border-0 sm:border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Top Presentation Bar with Boubyan Corporate Look */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-[#0A1931] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#8B263E] border border-white/20 flex items-center justify-center shrink-0">
              <Presentation className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 truncate">
                <span className="truncate">{isAr ? 'عرض الإدارة التنفيذية — بنك بوبيان' : 'Boubyan Executive Strategic Deck'}</span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                  {isAr ? 'مقارنة الأثر المباشر (3 أدوات)' : 'Live 3-Tool Impact Shift'}
                </span>
              </div>
              <div className="text-[10.5px] sm:text-xs text-slate-300 font-mono">
                {isAr ? `شريحة ${currentSlide + 1} من ${totalSlides}` : `Slide ${currentSlide + 1} of ${totalSlides}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Area */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto flex flex-col justify-between bg-[#F8FAFC]">
          
          {/* SLIDE 0: 3 GRAPHS WITH 2 LINES (PREVIOUS VS CURRENT SHIFT) */}
          {currentSlide === 0 && (
            <div className="flex flex-col h-full justify-between gap-2.5">
              
              {/* Header Title & Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8B263E]/10 text-[#8B263E] border border-[#8B263E]/20">
                      {isAr ? 'تحليل التحول العملي' : 'Live Action Shift Analysis'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono font-medium">
                      {isAr ? 'الوضع السابق (بدون AI) مقابل الوضع الحالي (بالذكاء الاصطناعي)' : 'Previous Baseline vs. AI Current State'}
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-black text-[#0A1931] tracking-tight mt-0.5">
                    {isAr 
                      ? 'أثر النقلة النوعية لكل أداة (توفير الساعات والأثر المالي عبر الزمن)'
                      : 'Comparative Shift Trajectory Across All 3 AI Initiatives'}
                  </h2>
                </div>

                {/* Interactive Toggles */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                  
                  {/* Timeframe Toggle */}
                  <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 border border-slate-300 text-[10px] font-bold font-mono">
                    <button
                      onClick={() => setTimeframe('weeks')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        timeframe === 'weeks' ? 'bg-[#0A1931] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Calendar className="w-3 h-3 text-[#FFB800]" />
                      <span>{isAr ? '12 أسبوع' : '12 Weeks'}</span>
                    </button>
                    <button
                      onClick={() => setTimeframe('years')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        timeframe === 'years' ? 'bg-[#0A1931] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>{isAr ? '3 سنوات' : '3 Years'}</span>
                    </button>
                  </div>

                  {/* Metric Toggle */}
                  <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 border border-slate-300 text-[10px] font-bold font-mono">
                    <button
                      onClick={() => setMetric('hours')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        metric === 'hours' ? 'bg-[#8B263E] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{isAr ? 'ساعات' : 'Hours'}</span>
                    </button>
                    <button
                      onClick={() => setMetric('money_kwd')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        metric === 'money_kwd' ? 'bg-[#8B263E] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{isAr ? 'د.ك' : 'KWD'}</span>
                    </button>
                    <button
                      onClick={() => setMetric('money_usd')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        metric === 'money_usd' ? 'bg-[#8B263E] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <DollarSign className="w-3 h-3" />
                      <span>USD</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* 3 COMPARATIVE GRAPHS (GRID OF 3) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
                
                {/* GRAPH 1: TOOL #1 (AI MEETING DETOX) */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-[#8B263E]/40 transition-colors">
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <AppEmblemIcon type="meeting-detox" size="sm" />
                        <h3 className="text-xs font-bold text-[#0A1931] truncate">
                          {isAr ? 'تقليص الاجتماعات' : 'Meeting Detox'}
                        </h3>
                      </div>
                      <span className="text-[9.5px] font-mono font-bold text-[#8B263E] bg-[#8B263E]/10 px-1.5 py-0.5 rounded shrink-0">
                        -{t1ReductionPct}% {isAr ? 'هدر' : 'Overhead'}
                      </span>
                    </div>

                    {/* Subtitle & Legend */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-0.5 border-t-2 border-dashed border-slate-400 inline-block"></span>
                        <span>{isAr ? 'سابقاً (بدون AI)' : 'Previous'}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#8B263E] font-bold">
                        <span className="w-2.5 h-1 bg-[#8B263E] rounded-full inline-block"></span>
                        <span>{isAr ? 'حالياً (مع AI)' : 'Current AI'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Recharts Canvas */}
                  <div className="h-[125px] sm:h-[135px] w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={t1Data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradPrev1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="gradCurr1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B263E" stopOpacity={0.7} />
                            <stop offset="100%" stopColor="#8B263E" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey={isAr ? 'labelAr' : 'labelEn'} tick={{ fill: '#475569', fontSize: 9, fontWeight: 600 }} />
                        <YAxis tick={{ fill: '#64748B', fontSize: 8.5, fontFamily: 'monospace' }} tickFormatter={formatYAxis} />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              const pVal = (d as any)[prevKey];
                              const cVal = (d as any)[currKey];
                              const saved = pVal - cVal;
                              return (
                                <div className="bg-[#0A1931] text-white p-2 rounded-xl shadow-xl border border-slate-700 text-[10px]">
                                  <div className="font-bold text-[#FFB800] pb-0.5 border-b border-white/10">{isAr ? d.labelAr : d.labelEn} — {isAr ? 'تقليص الاجتماعات' : 'Meeting Detox'}</div>
                                  <div className="space-y-0.5 pt-1 font-mono">
                                    <div className="text-slate-300">{isAr ? 'السابق (بدون AI):' : 'Previous:'} {formatTooltipVal(pVal)}</div>
                                    <div className="text-rose-300 font-bold">{isAr ? 'الحالي (مع AI):' : 'Current AI:'} {formatTooltipVal(cVal)}</div>
                                    <div className="text-emerald-400 font-bold border-t border-white/10 pt-0.5">{isAr ? 'الوفر المحقق:' : 'Net Saved:'} +{formatTooltipVal(saved)}</div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey={prevKey} stroke="#94A3B8" strokeWidth={2} strokeDasharray="3 3" fill="url(#gradPrev1)" name="Previous" />
                        <Area type="monotone" dataKey={currKey} stroke="#8B263E" strokeWidth={2.5} fill="url(#gradCurr1)" name="Current" dot={{ r: 3, fill: '#FFB800', strokeWidth: 1.5, stroke: '#8B263E' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Shift KPI Footer */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-mono">
                    <span className="text-slate-500 font-sans">{isAr ? 'إجمالي الوفر:' : 'Total Saved:'}</span>
                    <span className="font-bold text-[#8B263E]">
                      {timeframe === 'weeks' 
                        ? `+${920 + Math.round(t1LiveAdditionalHours * 0.25)} hrs (${((36800 + t1LiveAdditionalKwd * 0.25) / 1000).toFixed(1)}k KD)` 
                        : `+${(1840 + t1LiveAdditionalHours).toLocaleString()} hrs/yr (${((73600 + t1LiveAdditionalKwd) / 1000).toFixed(1)}k KD)`}
                    </span>
                  </div>
                </div>

                {/* GRAPH 2: TOOL #2 (KNOWLEDGE GAP RESOLUTION) */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-[#0284C7]/40 transition-colors">
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <AppEmblemIcon type="knowledge-intelligence" size="sm" />
                        <h3 className="text-xs font-bold text-[#0A1931] truncate">
                          {isAr ? 'فجوات المعرفة و SOPs' : 'Knowledge SOPs'}
                        </h3>
                      </div>
                      <span className="text-[9.5px] font-mono font-bold text-[#0284C7] bg-[#0284C7]/10 px-1.5 py-0.5 rounded shrink-0">
                        -{t2ReductionPct}% {isAr ? 'زمن بحث' : 'Latency'}
                      </span>
                    </div>

                    {/* Subtitle & Legend */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-0.5 border-t-2 border-dashed border-slate-400 inline-block"></span>
                        <span>{isAr ? 'سابقاً (بدون AI)' : 'Previous'}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#0284C7] font-bold">
                        <span className="w-2.5 h-1 bg-[#0284C7] rounded-full inline-block"></span>
                        <span>{isAr ? 'حالياً (مع AI)' : 'Current AI'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Recharts Canvas */}
                  <div className="h-[125px] sm:h-[135px] w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={t2Data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradPrev2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="gradCurr2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0284C7" stopOpacity={0.7} />
                            <stop offset="100%" stopColor="#0284C7" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey={isAr ? 'labelAr' : 'labelEn'} tick={{ fill: '#475569', fontSize: 9, fontWeight: 600 }} />
                        <YAxis tick={{ fill: '#64748B', fontSize: 8.5, fontFamily: 'monospace' }} tickFormatter={formatYAxis} />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              const pVal = (d as any)[prevKey];
                              const cVal = (d as any)[currKey];
                              const saved = pVal - cVal;
                              return (
                                <div className="bg-[#0A1931] text-white p-2 rounded-xl shadow-xl border border-slate-700 text-[10px]">
                                  <div className="font-bold text-[#FFB800] pb-0.5 border-b border-white/10">{isAr ? d.labelAr : d.labelEn} — {isAr ? 'فجوات المعرفة' : 'Knowledge SOPs'}</div>
                                  <div className="space-y-0.5 pt-1 font-mono">
                                    <div className="text-slate-300">{isAr ? 'السابق (بدون AI):' : 'Previous:'} {formatTooltipVal(pVal)}</div>
                                    <div className="text-sky-300 font-bold">{isAr ? 'الحالي (مع AI):' : 'Current AI:'} {formatTooltipVal(cVal)}</div>
                                    <div className="text-emerald-400 font-bold border-t border-white/10 pt-0.5">{isAr ? 'الوفر المحقق:' : 'Net Saved:'} +{formatTooltipVal(saved)}</div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey={prevKey} stroke="#94A3B8" strokeWidth={2} strokeDasharray="3 3" fill="url(#gradPrev2)" name="Previous" />
                        <Area type="monotone" dataKey={currKey} stroke="#0284C7" strokeWidth={2.5} fill="url(#gradCurr2)" name="Current" dot={{ r: 3, fill: '#FFB800', strokeWidth: 1.5, stroke: '#0284C7' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Shift KPI Footer */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-mono">
                    <span className="text-slate-500 font-sans">{isAr ? 'إجمالي الوفر:' : 'Total Saved:'}</span>
                    <span className="font-bold text-[#0284C7]">
                      {timeframe === 'weeks' 
                        ? `+${620 + Math.round(t2LiveAdditionalHours * 0.25)} hrs (${((24800 + t2LiveAdditionalKwd * 0.25) / 1000).toFixed(1)}k KD)` 
                        : `+${(1280 + t2LiveAdditionalHours).toLocaleString()} hrs/yr (${((51200 + t2LiveAdditionalKwd) / 1000).toFixed(1)}k KD)`}
                    </span>
                  </div>
                </div>

                {/* GRAPH 3: TOOL #3 (EARLY WARNING SHIELD) */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-[#10B981]/40 transition-colors">
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <AppEmblemIcon type="early-warning" size="sm" />
                        <h3 className="text-xs font-bold text-[#0A1931] truncate">
                          {isAr ? 'درع الإنذار المبكر' : 'Early Warning Shield'}
                        </h3>
                      </div>
                      <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                        -{t3ReductionPct}% {isAr ? 'تأخير/تعطل' : 'Downtime'}
                      </span>
                    </div>

                    {/* Subtitle & Legend */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-0.5 border-t-2 border-dashed border-slate-400 inline-block"></span>
                        <span>{isAr ? 'سابقاً (بدون AI)' : 'Previous'}</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <span className="w-2.5 h-1 bg-[#10B981] rounded-full inline-block"></span>
                        <span>{isAr ? 'حالياً (مع AI)' : 'Current AI'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Recharts Canvas */}
                  <div className="h-[125px] sm:h-[135px] w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={t3Data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradPrev3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="gradCurr3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.7} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey={isAr ? 'labelAr' : 'labelEn'} tick={{ fill: '#475569', fontSize: 9, fontWeight: 600 }} />
                        <YAxis tick={{ fill: '#64748B', fontSize: 8.5, fontFamily: 'monospace' }} tickFormatter={formatYAxis} />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              const pVal = (d as any)[prevKey];
                              const cVal = (d as any)[currKey];
                              const saved = pVal - cVal;
                              return (
                                <div className="bg-[#0A1931] text-white p-2 rounded-xl shadow-xl border border-slate-700 text-[10px]">
                                  <div className="font-bold text-[#FFB800] pb-0.5 border-b border-white/10">{isAr ? d.labelAr : d.labelEn} — {isAr ? 'الإنذار المبكر' : 'Early Warning'}</div>
                                  <div className="space-y-0.5 pt-1 font-mono">
                                    <div className="text-slate-300">{isAr ? 'السابق (بدون AI):' : 'Previous:'} {formatTooltipVal(pVal)}</div>
                                    <div className="text-emerald-300 font-bold">{isAr ? 'الحالي (مع AI):' : 'Current AI:'} {formatTooltipVal(cVal)}</div>
                                    <div className="text-emerald-400 font-bold border-t border-white/10 pt-0.5">{isAr ? 'الوفر المحقق:' : 'Net Saved:'} +{formatTooltipVal(saved)}</div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey={prevKey} stroke="#94A3B8" strokeWidth={2} strokeDasharray="3 3" fill="url(#gradPrev3)" name="Previous" />
                        <Area type="monotone" dataKey={currKey} stroke="#10B981" strokeWidth={2.5} fill="url(#gradCurr3)" name="Current" dot={{ r: 3, fill: '#FFB800', strokeWidth: 1.5, stroke: '#10B981' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Shift KPI Footer */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-mono">
                    <span className="text-slate-500 font-sans">{isAr ? 'إجمالي الوفر:' : 'Total Saved:'}</span>
                    <span className="font-bold text-emerald-700">
                      {timeframe === 'weeks' 
                        ? `+${840 + Math.round(t3LiveAdditionalHours * 0.25)} hrs (${((118500 + t3LiveAdditionalKwd * 0.25) / 1000).toFixed(1)}k KD)` 
                        : `+${(1950 + t3LiveAdditionalHours).toLocaleString()} hrs/yr (${((196500 + t3LiveAdditionalKwd) / 1000).toFixed(1)}k KD)`}
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom Executive Cumulative Strip */}
              <div className="p-2.5 rounded-xl bg-[#0A1931] text-white border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-[#8B263E] text-[#FFB800]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-bold text-slate-200">
                    {isAr 
                      ? 'إجمالي الأثر التراكمي للـ 3 أدوات مجتمعة:' 
                      : 'Combined Multi-Tool Executive Realization:'}
                  </span>
                  {activeDecisionsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{isAr ? `${activeDecisionsCount} قرارات نشطة مطبقة` : `${activeDecisionsCount} Live Decisions Active`}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-emerald-300 font-black">
                    +{timeframe === 'weeks' 
                      ? `${(2380 + Math.round(liveAdditionalHours * 0.25)).toLocaleString()} hrs (12 Wks)` 
                      : `${totalHoursSaved.toLocaleString()} hrs/yr`}
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-[#FFB800] font-black">
                    +{timeframe === 'weeks' 
                      ? `${(180100 + Math.round(liveAdditionalKwd * 0.25)).toLocaleString()} KD ($${Math.round((180100 + Math.round(liveAdditionalKwd * 0.25)) * 3.26).toLocaleString()})` 
                      : `${totalKwdSaved.toLocaleString()} KD ($${(Math.round(totalUsdSaved / 1000)).toLocaleString()}k)`}
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-cyan-300 font-bold">
                    +{(3.4 + Math.min(1.8, activeDecisionsCount * 0.4)).toFixed(1)}x Velocity Boost
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* SLIDES 1, 2, 3: INDIVIDUAL IDEAS */}
          {currentSlide >= 1 && currentSlide <= 3 && (() => {
            const idea = ideas[currentSlide - 1];
            const title = isAr ? idea.titleAr : idea.titleEn;
            const subtitle = isAr ? idea.subtitleAr : idea.subtitleEn;
            const value = isAr ? idea.executiveValueAr : idea.executiveValueEn;
            const roi = isAr ? idea.roiEstimateAr : idea.roiEstimateEn;
            const timeline = isAr ? idea.implementationTimeAr : idea.implementationTimeEn;
            const points = (isAr ? idea.talkingPointsAr : idea.talkingPointsEn) || [];

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#8B263E] text-white">
                      {isAr ? `المبادرة الاستراتيجية رقم 0${idea.number}` : `Strategic Initiative #0${idea.number}`}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0A1931] mt-2">
                      {title}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onLaunchDemo(idea.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#8B263E] hover:bg-[#721f33] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <span>{isAr ? 'فتح النموذج التفاعلي المباشر' : 'Launch Interactive Demo'}</span>
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 text-[#FFB800]" />}
                  </button>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {subtitle}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="text-xs font-bold text-[#8B263E] uppercase tracking-wider">
                      {isAr ? 'القيمة التنفيذية المضافة للأعمال' : 'Executive Strategic Value Driver'}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{value}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0A1931]">
                      <span>{roi}</span>
                      <span className="text-[#8B263E] font-mono">{timeline}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="text-xs font-bold text-[#0A1931] uppercase tracking-wider">
                      {isAr ? 'نقاط الحديث الرئيسية في الاجتماع' : 'Key Executive Talking Points'}
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#8B263E] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* SLIDE 4: STRATEGIC ROADMAP SUMMARY */}
          {currentSlide === 4 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#8B263E]/10 text-[#8B263E] border border-[#8B263E]/20">
                  {isAr ? 'خطة التنفيذ والجاهزية' : 'Execution & Rollout Roadmap'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0A1931]">
                  {isAr ? 'التكامل السلس مع البنية التحتية الحالية لبنك بوبيان' : 'Zero-Disruption Integration with Boubyan Stack'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ideas.map((idea) => (
                  <div key={idea.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="text-xs font-bold text-[#8B263E]">
                      {isAr ? `المبادرة 0${idea.number}` : `Initiative #0${idea.number}`}
                    </div>
                    <h4 className="text-sm font-bold text-[#0A1931]">
                      {isAr ? idea.titleAr : idea.titleEn}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {isAr ? idea.roiEstimateAr : idea.roiEstimateEn}
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchDemo(idea.id);
                      }}
                      className="w-full mt-2 py-1.5 rounded-lg bg-[#0A1931] hover:bg-[#8B263E] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isAr ? 'تجربة النموذج' : 'Explore Demo'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Slide Controller */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-[#8B263E]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 transition-colors cursor-pointer"
            >
              {isAr ? 'السابق' : 'Previous'}
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#8B263E] hover:bg-[#721f33] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isAr ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
