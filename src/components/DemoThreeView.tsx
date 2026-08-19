import React, { useState, useMemo } from 'react';
import { DemoIdea, Language, EarlyWarningItem } from '../types';
import { INITIAL_EARLY_WARNINGS } from '../data/demosData';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  BarChart3, 
  Sliders, 
  Check, 
  Zap, 
  Activity, 
  LineChart as LineChartIcon,
  ShieldAlert,
  ShieldCheck,
  Clock,
  DollarSign,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface DemoThreeViewProps {
  idea: DemoIdea;
  lang: Language;
}

interface LastExecutedRiskValue {
  warningId: string;
  squad: string;
  title: string;
  severity: string;
  preventedDowntimeMinutes: number;
  costProtectedKWD: number;
  costProtectedUSD: number;
  leadTimeDays: number;
  playbookLabelEn: string;
  playbookLabelAr: string;
  strategicOutcomeEn: string;
  strategicOutcomeAr: string;
}

export const DemoThreeView: React.FC<DemoThreeViewProps> = ({ idea, lang }) => {
  const isAr = lang === 'ar';
  const [warnings, setWarnings] = useState<EarlyWarningItem[]>(INITIAL_EARLY_WARNINGS);
  const [selectedWarning, setSelectedWarning] = useState<EarlyWarningItem | null>(INITIAL_EARLY_WARNINGS[0]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [sensitivityThreshold, setSensitivityThreshold] = useState<number>(85);
  const [chartVisualType, setChartVisualType] = useState<'spline' | 'bars'>('spline');

  const [lastExecutedValue, setLastExecutedValue] = useState<LastExecutedRiskValue | null>(null);

  // Distinct risk mitigation calculations per early warning item
  const getWarningSpecificMetrics = (warnId: string, sensMult: number) => {
    switch (warnId) {
      case 'warn-1':
        return {
          downtime: 240,
          costKWD: 48000,
          leadDays: +(5.2 * sensMult).toFixed(1),
          playbookEn: 'Auto-scaled Kafka partition brokers & buffered async queue',
          playbookAr: 'توسيع نطاق وسيط Kafka تلقائياً وتفريغ طابور الانتظار',
          outcomeEn: 'Prevented mobile banking login freeze affecting ~45,000 active app users.',
          outcomeAr: 'تفادي تجميد تسجيل دخول تطبيق الموبايل لـ ~45,000 مستخدم نشط.'
        };
      case 'warn-2':
        return {
          downtime: 480,
          costKWD: 96000,
          leadDays: +(4.8 * sensMult).toFixed(1),
          playbookEn: 'Recycled database connection pools & throttled unindexed batch queries',
          playbookAr: 'إعادة تدوير منافذ اتصال قواعد البيانات وكبح الاستعلامات غير المفهرسة',
          outcomeEn: 'Protected Core Banking ledger sync and shielded against CBK regulatory penalty.',
          outcomeAr: 'حماية مزامنة الحسابات المصرفية الأساسية وتفادي غرامات البنك المركزي.'
        };
      case 'warn-3':
        return {
          downtime: 90,
          costKWD: 18500,
          leadDays: +(3.4 * sensMult).toFixed(1),
          playbookEn: 'Synchronized gateway timeout thresholds with KNET 300ms SLA',
          playbookAr: 'مزامنة مهلة استجابة البوابة مع معيار KNET (300ms)',
          outcomeEn: 'Eliminated shopping cart payment drop-offs during peak salary transfer window.',
          outcomeAr: 'منع فشل عمليات الدفع الإلكتروني في أوقات الذروة المصرفية.'
        };
      case 'warn-4':
        return {
          downtime: 150,
          costKWD: 26000,
          leadDays: +(4.1 * sensMult).toFixed(1),
          playbookEn: 'Refreshed expired OAuth certs & verified token rotation pipeline',
          playbookAr: 'تحديث شهادات OAuth والتحقق من آلية تجديد رموز الأمان',
          outcomeEn: 'Maintained 100% uptime for Open Banking third-party fintech integrations.',
          outcomeAr: 'ضمان استمرارية بنسبة 100% لخدمات الربط مع شركات الـ FinTech الشريكة.'
        };
      default:
        return {
          downtime: 180,
          costKWD: 32000,
          leadDays: +(4.5 * sensMult).toFixed(1),
          playbookEn: 'Executed automated remediation playbook',
          playbookAr: 'تنفيذ خطة المعالجة الذكية المؤتمتة',
          outcomeEn: 'Safeguarded delivery pipeline against upstream dependency failures.',
          outcomeAr: 'حماية جدول تسليم الميزات البرمجية من اختناقات الاعتماديات.'
        };
    }
  };

  const handleMitigate = (warningId: string) => {
    const target = warnings.find(w => w.id === warningId) || selectedWarning;
    const isCurrentlyMitigated = target?.status === 'Mitigated';

    if (isCurrentlyMitigated) {
      // Toggle back to Investigating
      setWarnings(prev => prev.map(w => w.id === warningId ? { ...w, status: 'Investigating' } : w));
      setSelectedWarning(prev => prev?.id === warningId ? { ...prev, status: 'Investigating' } : prev);
      setLastExecutedValue(null);
      return;
    }

    const sensMult = sensitivityThreshold / 85;
    const metrics = getWarningSpecificMetrics(warningId, sensMult);
    const costUSD = Math.round(metrics.costKWD * 3.26);

    setWarnings(prev => prev.map(w => {
      if (w.id === warningId) return { ...w, status: 'Mitigated' };
      return w;
    }));

    setSelectedWarning(prev => prev?.id === warningId ? { ...prev, status: 'Mitigated' } : prev);

    setLastExecutedValue({
      warningId,
      squad: isAr ? (target?.affectedSquadAr || '') : (target?.affectedSquadEn || ''),
      title: isAr ? (target?.titleAr || '') : (target?.titleEn || ''),
      severity: target?.severityLevel || 'Warning',
      preventedDowntimeMinutes: metrics.downtime,
      costProtectedKWD: metrics.costKWD,
      costProtectedUSD: costUSD,
      leadTimeDays: metrics.leadDays,
      playbookLabelEn: metrics.playbookEn,
      playbookLabelAr: metrics.playbookAr,
      strategicOutcomeEn: metrics.outcomeEn,
      strategicOutcomeAr: metrics.outcomeAr
    });
  };

  const filteredWarnings = useMemo(() => {
    const sensMult = sensitivityThreshold / 85;
    return warnings
      .filter(w => {
        if (severityFilter !== 'all' && w.severityLevel.toLowerCase() !== severityFilter) return false;
        return true;
      })
      .sort((a, b) => getWarningSpecificMetrics(b.id, sensMult).costKWD - getWarningSpecificMetrics(a.id, sensMult).costKWD);
  }, [warnings, severityFilter, sensitivityThreshold]);

  const activeWarningsCount = warnings.filter(w => w.status !== 'Mitigated').length;
  const mitigatedCount = warnings.filter(w => w.status === 'Mitigated').length;

  const totalProtectedKwd = useMemo(() => {
    const sensMult = sensitivityThreshold / 85;
    return warnings.reduce((acc, w) => {
      if (w.status === 'Mitigated') {
        return acc + getWarningSpecificMetrics(w.id, sensMult).costKWD;
      }
      return acc;
    }, 0);
  }, [warnings, sensitivityThreshold]);

  const leadTimeChartData = useMemo(() => {
    const multiplier = sensitivityThreshold / 85;
    return [
      { 
        squad: isAr ? 'القنوات الرقمية' : 'Digital App', 
        squadCode: 'digital', 
        currentMTTR: 280, 
        expectedMTTR: warnings.find(w => w.id === 'warn-1')?.status === 'Mitigated' ? 5 : Math.max(8, Math.round(18 / multiplier)), 
        leadTimeDays: +(4.2 * multiplier).toFixed(1) 
      },
      { 
        squad: isAr ? 'النظام المصرفي' : 'Core Banking', 
        squadCode: 'core', 
        currentMTTR: 340, 
        expectedMTTR: warnings.find(w => w.id === 'warn-2')?.status === 'Mitigated' ? 8 : Math.max(10, Math.round(25 / multiplier)), 
        leadTimeDays: +(5.1 * multiplier).toFixed(1) 
      },
      { 
        squad: isAr ? 'بوابات KNET' : 'Payments & KNET', 
        squadCode: 'payment', 
        currentMTTR: 190, 
        expectedMTTR: warnings.find(w => w.id === 'warn-3')?.status === 'Mitigated' ? 4 : Math.max(6, Math.round(12 / multiplier)), 
        leadTimeDays: +(3.6 * multiplier).toFixed(1) 
      },
      { 
        squad: isAr ? 'Open Banking' : 'Open Banking APIs', 
        squadCode: 'open', 
        currentMTTR: 220, 
        expectedMTTR: warnings.find(w => w.id === 'warn-4')?.status === 'Mitigated' ? 6 : Math.max(7, Math.round(15 / multiplier)), 
        leadTimeDays: +(4.8 * multiplier).toFixed(1) 
      }
    ];
  }, [isAr, sensitivityThreshold, warnings]);

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full gap-2 font-sans overflow-y-auto lg:overflow-hidden">
      
      {/* TOP EXECUTIVE CIO BAR: CLEAR STRATEGIC OBJECTIVE & 3 KEY PILLARS */}
      <div className="shrink-0 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#0A1931] via-[#092E22] to-[#0A1931] text-white border border-slate-700/80 shadow-md flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 sm:gap-3 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Title & Clear Strategic Objective */}
        <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 w-full xl:w-auto">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shrink-0 shadow-sm border border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[9px] font-black uppercase tracking-wider">
                {isAr ? 'المبادرة #03' : 'Initiative #03'}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {isAr ? 'رادار الإنذار المبكر وحماية موثوقية الأنظمة' : 'AI Early Warning Radar & Risk Shield'}
              </h2>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5 font-medium">
              <span className="text-[#FFB800] font-bold shrink-0">★ {isAr ? 'الهدف المباشر:' : 'Direct Objective:'}</span>
              <span className="line-clamp-2 sm:line-clamp-1">{isAr ? 'الكشف الاستباقي عن تعثر إطلاق الخدمات وحماية 140,000+ دينار من مخاطر التوقف.' : 'Proactively detect release friction & protect 140k+ KWD from production downtime.'}</span>
            </p>
          </div>
        </div>

        {/* 3 Core Executive Figures (Current -> Expected -> Net Saved ROI) */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 font-mono text-xs relative z-10 w-full xl:w-auto justify-end">
          
          {/* Current State */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center">
            <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-slate-400 font-sans block mb-0.5 truncate">
              {isAr ? 'الوضع الحالي' : 'CURRENT'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-white truncate">
              280 <span className="text-[8px] sm:text-[9px] text-slate-400 font-sans">mins</span>
            </div>
          </div>

          <div className="hidden sm:block text-[#FFB800] font-bold px-0.5">➔</div>

          {/* Expected State */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center">
            <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-emerald-400 font-sans block mb-0.5 truncate">
              {isAr ? 'المتوقع بعد AI' : 'EXPECTED'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-emerald-300 truncate">
              6 <span className="text-[8px] sm:text-[9px] font-sans">mins (-97%)</span>
            </div>
          </div>

          {/* Net Realized ROI Gold Pillar */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-900 to-[#0A1931] border border-emerald-400/50 text-center shadow-sm">
            <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-[#FFB800] font-sans block mb-0.5 truncate">
              {isAr ? 'القيمة المحمية' : 'PROTECTED ROI'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-[#FFB800] truncate">
              +{(totalProtectedKwd > 0 ? totalProtectedKwd : 188500).toLocaleString()} <span className="text-[8px] sm:text-[9px] font-sans text-amber-200">KD</span>
            </div>
          </div>

        </div>
      </div>

      {/* DISTINCT CUSTOMIZED REALIZED VALUE BANNER */}
      <AnimatePresence>
        {lastExecutedValue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            className="shrink-0 p-2.5 rounded-xl bg-gradient-to-r from-[#0A1931] via-[#092B20] to-[#0A1931] border border-emerald-400/60 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative overflow-hidden"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#FFB800]">
                    {isAr ? 'الأثر المحقق لتفادي هذا الحادث:' : 'Tailored Outage Prevention Impact:'}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[240px]">{lastExecutedValue.squad}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    lastExecutedValue.severity === 'Critical' ? 'bg-rose-900/70 text-rose-200 border border-rose-500/40' : 'bg-amber-900/70 text-amber-200 border border-amber-500/40'
                  }`}>
                    {lastExecutedValue.severity}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  <span className="text-emerald-300 font-bold">{isAr ? lastExecutedValue.playbookLabelAr : lastExecutedValue.playbookLabelEn}</span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span>{isAr ? lastExecutedValue.strategicOutcomeAr : lastExecutedValue.strategicOutcomeEn}</span>
                </div>
              </div>
            </div>

            {/* Instant Value Metrics Badges */}
            <div className="flex items-center gap-2 font-mono shrink-0 w-full md:w-auto justify-end">
              <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-center">
                <span className="text-[9px] text-slate-300 block font-sans">{isAr ? 'توقف تم تفاديه' : 'Downtime Averted'}</span>
                <span className="font-black text-emerald-400 text-xs">+{lastExecutedValue.preventedDowntimeMinutes} mins</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-400/40 text-center">
                <span className="text-[9px] text-slate-200 block font-sans">{isAr ? 'خسائر وغرامات محجوبة' : 'Protected Capital'}</span>
                <span className="font-black text-[#FFB800] text-xs">+{lastExecutedValue.costProtectedKWD.toLocaleString()} KWD</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-center hidden lg:block">
                <span className="text-[9px] text-emerald-300 block font-sans">{isAr ? 'كشف مسبق' : 'Lead Time'}</span>
                <span className="font-black text-white text-xs">{lastExecutedValue.leadTimeDays} {isAr ? 'أيام' : 'Days'}</span>
              </div>
              <button 
                onClick={() => setLastExecutedValue(null)} 
                className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer text-xs shrink-0"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN SINGLE-SCREEN SPLIT BODY */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT COLUMN (6 Cols): MTTR Chart + Diagnostic */}
        <div className="lg:col-span-6 flex flex-col h-auto lg:h-full gap-2 min-h-0">
          
          {/* Top Panel: MTTR Chart */}
          <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/90 shadow-sm flex flex-col justify-between h-[180px] sm:h-[175px] relative overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[#0A1931] shrink-0">
                    {isAr ? 'زمن حل الحوادث (دقائق MTTR)' : 'Incident Resolution MTTR (Mins)'}
                  </span>
                  {selectedWarning && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse"></span>
                      <span className="truncate">{selectedWarning.affectedSquadEn}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[10px] shrink-0">
                <button
                  onClick={() => setChartVisualType('spline')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    chartVisualType === 'spline' ? 'bg-[#0A1931] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <LineChartIcon className="w-3 h-3" />
                  <span>{isAr ? 'منحنى' : 'Curve'}</span>
                </button>
                <button
                  onClick={() => setChartVisualType('bars')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    chartVisualType === 'bars' ? 'bg-[#0A1931] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>{isAr ? 'أعمدة' : 'Bars'}</span>
                </button>
              </div>
            </div>

            <div className="h-[125px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                {chartVisualType === 'spline' ? (
                  <AreaChart data={leadTimeChartData} margin={{ top: 6, right: 10, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="mttrSplineBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="mttrSplineAi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.7} />
                        <stop offset="60%" stopColor="#FFB800" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="squad" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }} tickFormatter={(v) => `${v}m`} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-[#0A1931] text-white p-2 rounded-xl shadow-xl border border-slate-700 text-[10px]">
                              <div className="font-bold text-[#FFB800] pb-0.5 border-b border-white/10">{d.squad}</div>
                              <div className="space-y-0.5 pt-1 font-mono">
                                <div className="text-slate-300">الوضع الحالي: {d.currentMTTR}m</div>
                                <div className="text-emerald-300 font-bold">المتوقع (AI): {d.expectedMTTR}m (-{Math.round(((d.currentMTTR - d.expectedMTTR) / d.currentMTTR) * 100)}%)</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="currentMTTR" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" fill="url(#mttrSplineBaseline)" name="Current" />
                    <Area type="monotone" dataKey="expectedMTTR" stroke="#10B981" strokeWidth={3} fill="url(#mttrSplineAi)" name="Expected" dot={{ r: 4, fill: '#FFB800', strokeWidth: 2, stroke: '#0A1931' }} activeDot={{ r: 7, fill: '#FFB800', stroke: '#0A1931', strokeWidth: 3 }} />
                  </AreaChart>
                ) : (
                  <BarChart 
                    data={leadTimeChartData} 
                    margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload.length) {
                        const squadName = e.activePayload[0].payload.squad;
                        const match = warnings.find(w => 
                          w.affectedSquadEn.toLowerCase().includes(squadName.toLowerCase()) || 
                          squadName.toLowerCase().includes(w.affectedSquadEn.toLowerCase())
                        );
                        if (match) setSelectedWarning(match);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="squad" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }} tickFormatter={(v) => `${v}m`} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(11, 25, 49, 0.04)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-[#0A1931] text-white p-2 rounded-xl shadow-xl border border-slate-700 text-[10px]">
                              <div className="font-bold text-[#FFB800] pb-0.5 border-b border-white/10">{d.squad}</div>
                              <div className="space-y-0.5 pt-1 font-mono">
                                <div className="text-slate-300">الوضع الحالي: {d.currentMTTR}m</div>
                                <div className="text-emerald-300 font-bold">المتوقع (AI): {d.expectedMTTR}m</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="currentMTTR" name="Current" radius={[4, 4, 4, 4]} barSize={12}>
                      {leadTimeChartData.map((entry, index) => {
                        const isSelected = selectedWarning?.affectedSquadEn.toLowerCase().includes(entry.squad.toLowerCase()) || entry.squad.toLowerCase().includes(selectedWarning?.affectedSquadEn.toLowerCase() || '');
                        return (
                          <Cell 
                            key={`b-${index}`} 
                            fill={isSelected ? '#94A3B8' : '#CBD5E1'} 
                            opacity={isSelected ? 0.9 : 0.35} 
                          />
                        );
                      })}
                    </Bar>
                    <Bar dataKey="expectedMTTR" name="Expected" radius={[6, 6, 6, 6]} barSize={14}>
                      {leadTimeChartData.map((entry, index) => {
                        const isSelected = selectedWarning?.affectedSquadEn.toLowerCase().includes(entry.squad.toLowerCase()) || entry.squad.toLowerCase().includes(selectedWarning?.affectedSquadEn.toLowerCase() || '');
                        return (
                          <Cell 
                            key={`e-${index}`} 
                            fill={isSelected ? '#FFB800' : '#10B981'} 
                            stroke={isSelected ? '#0A1931' : 'none'}
                            strokeWidth={isSelected ? 2.5 : 0}
                            opacity={isSelected ? 1 : 0.45}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Warning Diagnostic Details Box */}
          <div className="flex-1 min-h-0 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
            <div className="shrink-0 flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-xs font-bold text-[#0A1931] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? 'التشخيص الاستباقي ومؤشرات المخاطر' : 'Predictive Risk Telemetry'}</span>
              </span>
            </div>

            {selectedWarning ? (
              <div className="flex-1 min-h-0 overflow-y-auto p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0A1931] truncate">
                    {isAr ? selectedWarning.titleAr : selectedWarning.titleEn}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    selectedWarning.severityLevel === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedWarning.severityLevel}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 line-clamp-2">
                  {isAr ? selectedWarning.forecastImpactAr : selectedWarning.forecastImpactEn}
                </div>

                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="font-bold text-emerald-700 text-[10px] mb-0.5">{isAr ? 'خطة التدخل الاستباقية:' : 'Mitigation Playbook:'}</div>
                  <div className="text-slate-700 text-[11px] line-clamp-2">{isAr ? selectedWarning.mitigationActionAr : selectedWarning.mitigationActionEn}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                {isAr ? 'اختر أي إنذار' : 'Select an alert'}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN (6 Cols): Active Alerts Feed */}
        <div className="lg:col-span-6 flex flex-col h-auto lg:h-full min-h-[360px] lg:min-h-0 bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm overflow-hidden">
          
          <div className="shrink-0 flex items-center justify-between pb-1.5 border-b border-slate-100 gap-2">
            <span className="text-xs font-bold text-[#0A1931]">
              {isAr ? 'رادار الإنذارات المبكرة' : 'Early Warning Radar'}
            </span>

            <div className="flex items-center gap-1 text-[10px]">
              <button
                onClick={() => setSeverityFilter('all')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  severityFilter === 'all' ? 'bg-[#0A1931] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setSeverityFilter('critical')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  severityFilter === 'critical' ? 'bg-rose-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Critical
              </button>
            </div>
          </div>

          {/* Warnings List */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5 pt-1.5">
            {filteredWarnings.map((warning) => {
              const isSelected = selectedWarning?.id === warning.id;
              const isMitigated = warning.status === 'Mitigated';

              return (
                <motion.div
                  key={warning.id}
                  onClick={() => setSelectedWarning(warning)}
                  whileHover={{ scale: 1.005 }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#FFB800] bg-emerald-50/70 ring-2 ring-[#FFB800] shadow-md'
                      : 'border-slate-100 bg-slate-50/80 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {isAr ? warning.affectedSquadAr : warning.affectedSquadEn}
                      </span>
                      {isSelected && (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-[#0A1931] text-[#FFB800] shrink-0 font-sans flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-[#FFB800] animate-pulse"></span>
                          <span>{isAr ? 'محدد بالرسم' : 'Active in Graph'}</span>
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isMitigated ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isMitigated ? (isAr ? 'حُلّت' : 'Mitigated') : (isAr ? 'إنذار' : 'Alert')}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-emerald-700">
                      {warning.preventedDowntimeMinutes}m {isAr ? 'وفر' : 'saved'}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#0A1931] mb-0.5 truncate">
                    {isAr ? warning.titleAr : warning.titleEn}
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-1 mb-1.5">
                    {isAr ? warning.forecastImpactAr : warning.forecastImpactEn}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {isAr ? 'خطة الاستجابة' : 'Playbook Response'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMitigate(warning.id);
                      }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs ${
                        isMitigated
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white shadow-xs'
                      }`}
                    >
                      {isMitigated ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>{isAr ? 'تم التفادي (اضغط للإلغاء)' : 'Mitigated (Reset)'}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-[#FFB800]" />
                          <span>{isAr ? 'تنفيذ وتحديث الرسم' : 'Mitigate & Update'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
