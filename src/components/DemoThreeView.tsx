import React, { useState, useMemo, useEffect } from 'react';
import { DemoIdea, Language, EarlyWarningItem } from '../types';
import { INITIAL_EARLY_WARNINGS } from '../data/demosData';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  BarChart3, 
  Check, 
  Zap, 
  Activity, 
  LineChart as LineChartIcon,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  ArrowLeft,
  History,
  TrendingUp,
  Layers,
  Workflow,
  Target,
  FileQuestion,
  HelpCircle,
  TrendingDown,
  GitBranch,
  Timer,
  ChevronRight,
  Eye,
  Flame,
  FileText,
  X,
  ExternalLink,
  Database,
  MessageSquare
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
import { useExecutiveMetrics } from '../context/ExecutiveMetricsContext';
import { AppEmblemIcon } from './AppEmblemIcons';

interface DemoThreeViewProps {
  idea: DemoIdea;
  lang: Language;
}

interface LastExecutedRiskValue {
  warningId: string;
  category: 'incident_risk' | 'delivery_risk';
  squad: string;
  title: string;
  severity: string;
  preventedDowntimeMinutes: number;
  costProtectedKWD: number;
  costProtectedUSD: number;
  leadTimeToImpact: string;
  playbookLabel: string;
  strategicOutcome: string;
}

export const DemoThreeView: React.FC<DemoThreeViewProps> = ({ idea, lang }) => {
  const isAr = lang === 'ar';
  const { mitigatedWarnings, applyWarningMitigation, removeWarningMitigation } = useExecutiveMetrics();

  const [warnings, setWarnings] = useState<EarlyWarningItem[]>(() => {
    return INITIAL_EARLY_WARNINGS.map(w => {
      if (mitigatedWarnings[w.id]) {
        return { ...w, status: 'Mitigated' as const };
      }
      return w;
    });
  });

  const [selectedWarning, setSelectedWarning] = useState<EarlyWarningItem | null>(() => {
    const first = INITIAL_EARLY_WARNINGS[0];
    if (mitigatedWarnings[first.id]) {
      return { ...first, status: 'Mitigated' as const };
    }
    return first;
  });
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'incident_risk' | 'delivery_risk'>('all');
  const [activeDiagnosticTab, setActiveDiagnosticTab] = useState<'whatChanged' | 'signals' | 'historical' | 'impact' | 'action'>('whatChanged');
  const [chartVisualType, setChartVisualType] = useState<'spline' | 'bars'>('spline');
  const [chartMetricMode, setChartMetricMode] = useState<'mttr' | 'cost'>('mttr');
  const [mobileTab, setMobileTab] = useState<'feed' | 'diagnostic'>('feed');
  const [lastExecutedValue, setLastExecutedValue] = useState<LastExecutedRiskValue | null>(null);
  const [previewJiraTelemetryWarning, setPreviewJiraTelemetryWarning] = useState<EarlyWarningItem | null>(null);

  useEffect(() => {
    if (lastExecutedValue) {
      const timer = setTimeout(() => {
        setLastExecutedValue(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastExecutedValue]);

  // Helper to extract metric calculations
  const getMetricsForWarning = (warn: EarlyWarningItem) => {
    const costKWD = warn.costProtectedKWD || 35000;
    const downtime = warn.downtimeRiskMinutes || 180;
    const leadTime = isAr ? warn.leadTimeToImpactAr : warn.leadTimeToImpactEn;
    const playbook = isAr ? warn.recommendedActionAr : warn.recommendedActionEn;
    const outcome = isAr 
      ? `تم تحييد خطر تعطل (${warn.affectedService}) وتوفير ${downtime} دقيقة تشغيلية.`
      : `Mitigated risk on (${warn.affectedService}) and safeguarded ${downtime} operational minutes.`;

    return {
      costKWD,
      downtime,
      leadTime,
      playbook,
      outcome
    };
  };

  const handleToggleMitigate = (warningId: string) => {
    const target = warnings.find(w => w.id === warningId) || selectedWarning;
    if (!target) return;

    const isCurrentlyMitigated = target.status === 'Mitigated';

    if (isCurrentlyMitigated) {
      // Toggle back to Investigating
      removeWarningMitigation(warningId);
      setWarnings(prev => prev.map(w => w.id === warningId ? { ...w, status: 'Investigating' } : w));
      if (selectedWarning?.id === warningId) {
        setSelectedWarning(prev => prev ? { ...prev, status: 'Investigating' } : prev);
      }
      setLastExecutedValue(null);
      return;
    }

    const metrics = getMetricsForWarning(target);
    const costUSD = Math.round(metrics.costKWD * 3.26);
    const downtimeHoursSaved = Math.round(metrics.downtime / 60 * 12); // Extrapolated annual outage avoidance

    // Dispatch to global context
    applyWarningMitigation(warningId, {
      warningId,
      titleEn: target.titleEn,
      titleAr: target.titleAr,
      category: target.category,
      downtimeMinutesSaved: metrics.downtime,
      kwdProtected: metrics.costKWD,
      usdProtected: costUSD,
      hoursSaved: downtimeHoursSaved
    });

    setWarnings(prev => prev.map(w => {
      if (w.id === warningId) return { ...w, status: 'Mitigated' };
      return w;
    }));

    if (selectedWarning?.id === warningId) {
      setSelectedWarning(prev => prev ? { ...prev, status: 'Mitigated' } : prev);
    }

    setLastExecutedValue({
      warningId,
      category: target.category,
      squad: isAr ? target.affectedSquadAr : target.affectedSquadEn,
      title: isAr ? target.titleAr : target.titleEn,
      severity: target.severityLevel,
      preventedDowntimeMinutes: metrics.downtime,
      costProtectedKWD: metrics.costKWD,
      costProtectedUSD: costUSD,
      leadTimeToImpact: metrics.leadTime,
      playbookLabel: metrics.playbook,
      strategicOutcome: metrics.outcome
    });
  };

  const handleMitigateAll = () => {
    const areAllMitigated = warnings.every(w => w.status === 'Mitigated');
    if (areAllMitigated) {
      // Reset all to Investigating
      setWarnings(INITIAL_EARLY_WARNINGS);
      if (selectedWarning) {
        const resetSelected = INITIAL_EARLY_WARNINGS.find(w => w.id === selectedWarning.id) || INITIAL_EARLY_WARNINGS[0];
        setSelectedWarning(resetSelected);
      }
      setLastExecutedValue(null);
    } else {
      // Mitigate all warnings
      setWarnings(prev => prev.map(w => ({ ...w, status: 'Mitigated' as const })));
      if (selectedWarning) {
        setSelectedWarning(prev => prev ? { ...prev, status: 'Mitigated' as const } : null);
      }
      setLastExecutedValue({
        warningId: 'all',
        category: 'incident_risk',
        squad: isAr ? 'كافة الفرق الهندسية' : 'All Engineering Squads',
        title: isAr ? 'تفعيل الحماية الشاملة بالذكاء الاصطناعي لكافة الأنظمة' : 'Enterprise AI Early Shield & Full Mitigation',
        severity: 'Critical',
        preventedDowntimeMinutes: 890,
        costProtectedKWD: 196500,
        costProtectedUSD: 640000,
        leadTimeToImpact: isAr ? 'فوري لكافة الفرق' : 'Instant Across All',
        playbookLabel: isAr ? 'تطبيق خطط المعالجة الاستباقية' : 'Automated Preventive Playbooks',
        strategicOutcome: isAr 
          ? 'تم تفعيل الحماية الاستباقية لكافة الفرق وتحييد 890 دقيقة تعطل وتوفير 196,500 د.ك.'
          : 'Activated proactive shield across all squads, eliminating 890 downtime mins and safeguarding 196,500 KD.'
      });
    }
  };

  const filteredWarnings = useMemo(() => {
    return warnings.filter(w => {
      if (categoryFilter === 'all') return true;
      return w.category === categoryFilter;
    });
  }, [warnings, categoryFilter]);

  const totalProtectedKwd = useMemo(() => {
    return warnings.reduce((acc, w) => {
      if (w.status === 'Mitigated') {
        return acc + (w.costProtectedKWD || 0);
      }
      return acc;
    }, 0);
  }, [warnings]);

  const activeAlertsCount = warnings.filter(w => w.status !== 'Mitigated').length;
  const mitigatedCount = warnings.filter(w => w.status === 'Mitigated').length;

  // Chart Data showing Current Baseline vs AI Live Action Shift per Squad
  const leadTimeChartData = useMemo(() => {
    const isW1Mitigated = warnings.find(w => w.id === 'warn-01')?.status === 'Mitigated';
    const isW2Mitigated = warnings.find(w => w.id === 'warn-02')?.status === 'Mitigated';
    const isW3Mitigated = warnings.find(w => w.id === 'warn-03')?.status === 'Mitigated';
    const isW4Mitigated = warnings.find(w => w.id === 'warn-04')?.status === 'Mitigated';

    return [
      { 
        squad: isAr ? 'القنوات الرقمية' : 'Digital App Core', 
        squadCode: 'digital',
        warningId: 'warn-01',
        // Unmitigated baseline
        currentMTTR: 280, 
        currentCost: 48500,
        // Live action shift: drops to 14 mins / 1,800 KD when mitigated, stays at 280 / 48,500 when open
        expectedMTTR: isW1Mitigated ? 14 : 280,
        expectedCost: isW1Mitigated ? 1800 : 48500,
        leadDays: '3.8d',
        isMitigated: isW1Mitigated,
        status: warnings.find(w => w.id === 'warn-01')?.status || 'Investigating'
      },
      { 
        squad: isAr ? 'الصيرفة المفتوحة' : 'Open Banking APIs', 
        squadCode: 'open',
        warningId: 'warn-02',
        currentMTTR: 340, 
        currentCost: 62000,
        expectedMTTR: isW2Mitigated ? 18 : 340,
        expectedCost: isW2Mitigated ? 2400 : 62000,
        leadDays: '4.5d',
        isMitigated: isW2Mitigated,
        status: warnings.find(w => w.id === 'warn-02')?.status || 'Investigating'
      },
      { 
        squad: isAr ? 'بوابات KNET' : 'Payments & KNET', 
        squadCode: 'payment',
        warningId: 'warn-03',
        currentMTTR: 190, 
        currentCost: 38000,
        expectedMTTR: isW3Mitigated ? 10 : 190,
        expectedCost: isW3Mitigated ? 1200 : 38000,
        leadDays: '2.6d',
        isMitigated: isW3Mitigated,
        status: warnings.find(w => w.id === 'warn-03')?.status || 'Investigating'
      },
      { 
        squad: isAr ? 'إدارة الثروات' : 'Wealth Management', 
        squadCode: 'wealth',
        warningId: 'warn-04',
        currentMTTR: 220, 
        currentCost: 48000,
        expectedMTTR: isW4Mitigated ? 12 : 220,
        expectedCost: isW4Mitigated ? 1600 : 48000,
        leadDays: '5.1d',
        isMitigated: isW4Mitigated,
        status: warnings.find(w => w.id === 'warn-04')?.status || 'Monitoring'
      }
    ];
  }, [isAr, warnings]);

  // Overall Live Shift % for the active metric
  const totalCurrentMetric = useMemo(() => {
    return leadTimeChartData.reduce((acc, d) => acc + (chartMetricMode === 'mttr' ? d.currentMTTR : d.currentCost), 0);
  }, [leadTimeChartData, chartMetricMode]);

  const totalExpectedMetric = useMemo(() => {
    return leadTimeChartData.reduce((acc, d) => acc + (chartMetricMode === 'mttr' ? d.expectedMTTR : d.expectedCost), 0);
  }, [leadTimeChartData, chartMetricMode]);

  const liveReductionPct = Math.round(((totalCurrentMetric - totalExpectedMetric) / totalCurrentMetric) * 100);

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full gap-2 font-sans overflow-y-auto lg:overflow-hidden">
      
      {/* TOP EXECUTIVE CIO BAR: CORE PHILOSOPHY & GOLDEN FORMULA */}
      <div className="shrink-0 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#0A1931] via-[#08281E] to-[#0A1931] text-white border border-slate-700/80 shadow-md flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 sm:gap-3 relative overflow-hidden min-h-[66px]">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Title & The Golden Formula Banner */}
        <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 w-full xl:w-auto">
          <AppEmblemIcon type="early-warning" size="md" />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[9px] font-black uppercase tracking-wider">
                {isAr ? 'المبادرة #03' : 'Initiative #03'}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {isAr ? 'نظام الإنذار المبكر الذكي (AI Early Warning System)' : 'AI Early Warning & Delivery Risk Shield'}
              </h2>
            </div>
            
            {/* The Golden Formula */}
            <div className="mt-1 flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium text-slate-200 flex-wrap">
              <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-[#FFB800] font-bold text-[9px] border border-amber-400/30">
                {isAr ? 'المعادلة الذهبية' : 'Golden Formula'}
              </span>
              <span className="text-[#FFB800] font-bold">
                {isAr ? 'إشارة مبكرة' : 'Early Signal'}
              </span>
              <span className="text-slate-400">➔</span>
              <span className="text-emerald-300 font-bold">
                {isAr ? 'تدخل مبكر' : 'Early Action'}
              </span>
              <span className="text-slate-400">➔</span>
              <span className="text-cyan-300 font-bold">
                {isAr ? 'أثر أقل وتأخير أقل' : 'Less Impact & Less Delay'}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Executive PoC Evaluation Figures */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 font-mono text-xs relative z-10 w-full xl:w-auto justify-end">
          
          {/* Lead Time to Detection */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center">
            <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-slate-400 font-sans block mb-0.5 truncate">
              {isAr ? 'السبق الزمني للاكتشاف' : 'LEAD TIME GAIN'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-cyan-300 truncate">
              +4.2 <span className="text-[8px] sm:text-[9px] text-slate-300 font-sans">{isAr ? 'أيام قبل التعطل' : 'Days Ahead'}</span>
            </div>
          </div>

          <div className="hidden sm:block text-[#FFB800] font-bold px-0.5">➔</div>

          {/* Alert Precision & Correlation Accuracy */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center">
            <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-emerald-400 font-sans block mb-0.5 truncate">
              {isAr ? 'دقة ربط الأنماط' : 'ALERT PRECISION'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-emerald-300 truncate">
              96.4% <span className="text-[8px] sm:text-[9px] font-sans text-slate-400">(Jira Correlated)</span>
            </div>
          </div>

          {/* Protected Capital & Prevented Delays */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950 to-[#0A1931] border border-emerald-400/50 text-center shadow-sm">
            <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-[#FFB800] font-sans block mb-0.5 truncate">
              {isAr ? 'العائد المحمي' : 'PROTECTED ROI'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-[#FFB800] truncate">
              +{(totalProtectedKwd > 0 ? totalProtectedKwd : 196500).toLocaleString()} <span className="text-[8px] sm:text-[9px] font-sans text-amber-200">KD</span>
            </div>
          </div>

        </div>
      </div>

      {/* COMPACT FLOATING TOAST NOTIFICATION (Does not shift screen size) */}
      <AnimatePresence>
        {lastExecutedValue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="fixed bottom-4 end-4 z-50 p-3 rounded-xl bg-[#0A1931]/95 text-white border border-emerald-400/50 shadow-2xl backdrop-blur-md max-w-sm flex items-start gap-2.5 font-sans"
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[9.5px] uppercase tracking-wider font-bold text-[#FFB800]">
                  {lastExecutedValue.category === 'incident_risk' 
                    ? (isAr ? 'تم التدخل وتفادي المشكلة' : 'Incident Prevented') 
                    : (isAr ? 'تم فك اختناق التسليم' : 'Bottleneck Resolved')
                  }
                </span>
                <button 
                  onClick={() => setLastExecutedValue(null)} 
                  className="text-slate-400 hover:text-white font-bold p-0.5 cursor-pointer text-xs leading-none"
                >
                  ✕
                </button>
              </div>
              <div className="text-[11px] font-bold text-white truncate mt-0.5">
                {lastExecutedValue.squad}
              </div>
              <div className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                <span className="text-emerald-300 font-bold">{lastExecutedValue.playbookLabel}: </span>
                <span>{lastExecutedValue.strategicOutcome}</span>
              </div>
              
              {/* Compact Metrics Chips */}
              <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-white/10 text-[9px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/30">
                  +{lastExecutedValue.preventedDowntimeMinutes}m Saved
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-[#FFB800] font-bold border border-amber-500/30">
                  +{lastExecutedValue.costProtectedKWD.toLocaleString()} KD
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-cyan-300 font-bold border border-cyan-500/30">
                  {lastExecutedValue.leadTimeToImpact}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE SEGMENTED TABS (Visible only on screens < lg) */}
      <div className="lg:hidden shrink-0 flex items-center p-1 rounded-xl bg-slate-200/90 border border-slate-300 shadow-xs font-bold text-xs">
        <button
          onClick={() => setMobileTab('feed')}
          className={`flex-1 py-2 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === 'feed'
              ? 'bg-[#0A1931] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>{isAr ? 'رادار الإنذارات ومخاطر التسليم' : 'Risk Radar & Feed'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-800 text-[9px]">
            {activeAlertsCount}
          </span>
        </button>
        <button
          onClick={() => setMobileTab('diagnostic')}
          className={`flex-1 py-2 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === 'diagnostic'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>{isAr ? 'التشخيص ورسم التحول' : 'AI Diagnostic & Shift'}</span>
          {mitigatedCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* MAIN SINGLE-SCREEN SPLIT BODY */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT COLUMN (6 Cols): MTTR Chart + 5-Questions AI Telemetry Diagnostic */}
        <div className={`lg:col-span-6 flex-col h-auto lg:h-full gap-2 min-h-0 ${
          mobileTab === 'diagnostic' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* Mobile Back to Alerts Button */}
          <div className="lg:hidden shrink-0 pb-1.5 mb-0.5 border-b border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setMobileTab('feed')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? 'العودة لقائمة الإنذارات' : 'Back to Risk Feed'}</span>
            </button>
            <span className="text-[10px] font-mono font-bold text-emerald-700">
              {isAr ? 'التشخيص الذكي الحي' : 'Live AI Diagnostic'}
            </span>
          </div>
          
          {/* Top Panel: Incident MTTR / Cost Live Action Shift Chart */}
          <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/90 shadow-sm flex flex-col justify-between h-[185px] sm:h-[180px] relative overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[#0A1931] shrink-0">
                    {chartMetricMode === 'mttr'
                      ? (isAr ? 'زمن الاستجابة وحل المشاكل (دقائق MTTR)' : 'Resolution Velocity MTTR (Minutes)')
                      : (isAr ? 'حجم الخسائر والأثر المالي المتفادى (د.ك)' : 'Averted Loss & Delay Capital (KD)')
                    }
                  </span>
                  {mitigatedCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 animate-pulse">
                      <Sparkles className="w-3 h-3 text-[#FFB800]" />
                      <span>{isAr ? `انخفاض حي: -${liveReductionPct}%` : `Live Shift: -${liveReductionPct}%`}</span>
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      <span>{isAr ? 'اضغط إجراء لرؤية التحول' : 'Click action to see shift'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Chart Controls: Metric Mode + Visual Type */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Metric Selector (MTTR vs KD) */}
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[10px]">
                  <button
                    onClick={() => setChartMetricMode('mttr')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      chartMetricMode === 'mttr' ? 'bg-[#0A1931] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{isAr ? 'دقائق' : 'MTTR'}</span>
                  </button>
                  <button
                    onClick={() => setChartMetricMode('cost')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      chartMetricMode === 'cost' ? 'bg-[#0A1931] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{isAr ? 'د.ك' : 'KWD'}</span>
                  </button>
                </div>

                {/* Visual Type (Spline vs Bars) */}
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[10px]">
                  <button
                    onClick={() => setChartVisualType('spline')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      chartVisualType === 'spline' ? 'bg-[#0A1931] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <LineChartIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">{isAr ? 'منحنى' : 'Curve'}</span>
                  </button>
                  <button
                    onClick={() => setChartVisualType('bars')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      chartVisualType === 'bars' ? 'bg-[#0A1931] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <BarChart3 className="w-3 h-3" />
                    <span className="hidden sm:inline">{isAr ? 'أعمدة' : 'Bars'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Canvas */}
            <div className="h-[125px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                {chartVisualType === 'spline' ? (
                  <AreaChart 
                    data={leadTimeChartData} 
                    margin={{ top: 6, right: 10, left: -20, bottom: 5 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload.length) {
                        const wId = e.activePayload[0].payload.warningId;
                        const match = warnings.find(w => w.id === wId);
                        if (match) setSelectedWarning(match);
                      }
                    }}
                  >
                    <defs>
                      <linearGradient id="mttrSplineBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="mttrSplineAi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="60%" stopColor="#FFB800" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="squad" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                    <YAxis 
                      tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }} 
                      tickFormatter={(v) => chartMetricMode === 'mttr' ? `${v}m` : `${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} 
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          const currentVal = chartMetricMode === 'mttr' ? d.currentMTTR : d.currentCost;
                          const expectedVal = chartMetricMode === 'mttr' ? d.expectedMTTR : d.expectedCost;
                          const unit = chartMetricMode === 'mttr' ? 'm' : ' KD';
                          const pctDrop = Math.round(((currentVal - expectedVal) / currentVal) * 100);

                          return (
                            <div className="bg-[#0A1931] text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-[10.5px] max-w-xs">
                              <div className="flex items-center justify-between pb-1 border-b border-white/10 gap-2">
                                <span className="font-bold text-[#FFB800] truncate">{d.squad}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                  d.isMitigated ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}>
                                  {d.isMitigated ? (isAr ? 'محمي بالذكاء الاصطناعي ✅' : 'Protected by AI ✅') : (isAr ? 'خطر قائم ⚠️' : 'Active Risk ⚠️')}
                                </span>
                              </div>
                              <div className="space-y-1 pt-1.5 font-mono text-[10px]">
                                <div className="text-slate-300 flex items-center justify-between">
                                  <span>{isAr ? 'بدون AI (خط الأساس):' : 'Baseline (Without AI):'}</span>
                                  <strong className="text-slate-200">{currentVal.toLocaleString()}{unit}</strong>
                                </div>
                                <div className="text-emerald-300 font-bold flex items-center justify-between">
                                  <span>{isAr ? 'مع التدخل المبكر (AI):' : 'With Early Shield:'}</span>
                                  <span>{expectedVal.toLocaleString()}{unit}</span>
                                </div>
                                {d.isMitigated && (
                                  <div className="text-[#FFB800] pt-1 border-t border-white/10 flex items-center justify-between font-sans text-[10px] font-bold">
                                    <span>{isAr ? 'الأثر المحقق مباشرة:' : 'Live Shift Impact:'}</span>
                                    <span>-{pctDrop}% (-{(currentVal - expectedVal).toLocaleString()}{unit})</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={chartMetricMode === 'mttr' ? 'currentMTTR' : 'currentCost'} 
                      stroke="#94A3B8" 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      fill="url(#mttrSplineBaseline)" 
                      name="Current Baseline" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey={chartMetricMode === 'mttr' ? 'expectedMTTR' : 'expectedCost'} 
                      stroke="#10B981" 
                      strokeWidth={3} 
                      fill="url(#mttrSplineAi)" 
                      name="AI Shift" 
                      dot={{ r: 4, fill: '#FFB800', strokeWidth: 2, stroke: '#0A1931' }} 
                      activeDot={{ r: 7, fill: '#FFB800', stroke: '#0A1931', strokeWidth: 3 }} 
                    />
                  </AreaChart>
                ) : (
                  <BarChart 
                    data={leadTimeChartData} 
                    margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload.length) {
                        const wId = e.activePayload[0].payload.warningId;
                        const match = warnings.find(w => w.id === wId);
                        if (match) setSelectedWarning(match);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="squad" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                    <YAxis 
                      tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }} 
                      tickFormatter={(v) => chartMetricMode === 'mttr' ? `${v}m` : `${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(11, 25, 49, 0.04)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          const currentVal = chartMetricMode === 'mttr' ? d.currentMTTR : d.currentCost;
                          const expectedVal = chartMetricMode === 'mttr' ? d.expectedMTTR : d.expectedCost;
                          const unit = chartMetricMode === 'mttr' ? 'm' : ' KD';

                          return (
                            <div className="bg-[#0A1931] text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-[10px]">
                              <div className="font-bold text-[#FFB800] pb-0.5 border-b border-white/10">{d.squad}</div>
                              <div className="space-y-0.5 pt-1 font-mono">
                                <div className="text-slate-300">{isAr ? 'الوضع الحالي:' : 'Current:'} {currentVal.toLocaleString()}{unit}</div>
                                <div className="text-emerald-300 font-bold">{isAr ? 'المتوقع مع AI:' : 'Expected (AI):'} {expectedVal.toLocaleString()}{unit}</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey={chartMetricMode === 'mttr' ? 'currentMTTR' : 'currentCost'} 
                      name="Current" 
                      radius={[4, 4, 4, 4]} 
                      barSize={12}
                    >
                      {leadTimeChartData.map((entry, index) => {
                        const isSelected = selectedWarning?.id === entry.warningId;
                        return (
                          <Cell 
                            key={`b-${index}`} 
                            fill={isSelected ? '#94A3B8' : '#CBD5E1'} 
                            opacity={isSelected ? 0.9 : 0.4} 
                          />
                        );
                      })}
                    </Bar>
                    <Bar 
                      dataKey={chartMetricMode === 'mttr' ? 'expectedMTTR' : 'expectedCost'} 
                      name="Expected" 
                      radius={[6, 6, 6, 6]} 
                      barSize={14}
                    >
                      {leadTimeChartData.map((entry, index) => {
                        const isSelected = selectedWarning?.id === entry.warningId;
                        return (
                          <Cell 
                            key={`e-${index}`} 
                            fill={entry.isMitigated ? '#10B981' : '#F59E0B'} 
                            stroke={isSelected ? '#0A1931' : 'none'}
                            strokeWidth={isSelected ? 2.5 : 0}
                            opacity={entry.isMitigated ? 1 : 0.55}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Panel: The 5-Questions AI Pattern Diagnostic */}
          <div className="flex-1 min-h-0 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
            
            {/* Header with Selected Alert Badge */}
            <div className="shrink-0 flex items-center justify-between pb-2 border-b border-slate-100 gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
                <span className="text-xs font-bold text-[#0A1931]">
                  {isAr ? 'التحليل التشخيصي للذكاء الاصطناعي (5 محاور)' : 'AI Diagnostic Pattern Breakdown (5 Pillars)'}
                </span>
              </div>

              {selectedWarning && (
                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                  selectedWarning.category === 'incident_risk'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  {isAr ? selectedWarning.categoryBadgeAr : selectedWarning.categoryBadgeEn}
                </span>
              )}
            </div>

            {/* 5-Questions Diagnostic Navigation Bar */}
            <div className="shrink-0 flex items-center gap-1 overflow-x-auto py-1.5 border-b border-slate-100 text-[10px]">
              <button
                onClick={() => setActiveDiagnosticTab('whatChanged')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  activeDiagnosticTab === 'whatChanged'
                    ? 'bg-[#0A1931] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>1. {isAr ? 'إيه اللي اتغير؟' : 'What Changed?'}</span>
              </button>

              <button
                onClick={() => setActiveDiagnosticTab('signals')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  activeDiagnosticTab === 'signals'
                    ? 'bg-[#0A1931] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>2. {isAr ? 'إشارات القلق' : 'Warning Signals'}</span>
              </button>

              <button
                onClick={() => setActiveDiagnosticTab('historical')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  activeDiagnosticTab === 'historical'
                    ? 'bg-[#0A1931] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>3. {isAr ? 'تطابق تاريخي' : 'Past Precedent'}</span>
              </button>

              <button
                onClick={() => setActiveDiagnosticTab('impact')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  activeDiagnosticTab === 'impact'
                    ? 'bg-[#0A1931] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>4. {isAr ? 'نطاق الأثر' : 'Blast Radius'}</span>
              </button>

              <button
                onClick={() => setActiveDiagnosticTab('action')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  activeDiagnosticTab === 'action'
                    ? 'bg-[#0A1931] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>5. {isAr ? 'المطلوب مراجعته' : 'Action / Review'}</span>
              </button>
            </div>

            {/* Diagnostic Details Container */}
            {selectedWarning ? (
              <div className="flex-1 min-h-0 overflow-y-auto p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 mt-1.5 space-y-2 text-xs">
                
                {/* 1. What Changed? */}
                {activeDiagnosticTab === 'whatChanged' && (
                  <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <div className="font-bold text-[#0A1931] flex items-center gap-1.5 text-xs">
                      <History className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isAr ? '1. إيه اللي اتغير في المؤشرات والأنظمة؟' : '1. What Changed Across Systems & Workflows?'}</span>
                    </div>
                    
                    <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                      {isAr ? selectedWarning.whatChangedAr : selectedWarning.whatChangedEn}
                    </p>

                    {/* Jira Delta Telemetry Box */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                        <span className="text-[9px] text-slate-500 block font-sans">{isAr ? 'تغير حجم تذاكر TT' : 'TT Volume Spike'}</span>
                        <span className="text-xs font-mono font-bold text-rose-700">{selectedWarning.jiraSourceData.ttVolumeChange}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                        <span className="text-[9px] text-slate-500 block font-sans">{isAr ? 'استطالة زمن الحل' : 'Resolution Time'}</span>
                        <span className="text-xs font-mono font-bold text-amber-700">{selectedWarning.jiraSourceData.resolutionTimeDelta}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                        <span className="text-[9px] text-slate-500 block font-sans">{isAr ? 'تنقل التذاكر' : 'Reassignments'}</span>
                        <span className="text-xs font-mono font-bold text-slate-800">{selectedWarning.jiraSourceData.reassignmentHops}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                        <span className="text-[9px] text-slate-500 block font-sans">{isAr ? 'خطر الـ SLA' : 'SLA Breach Risk'}</span>
                        <span className="text-xs font-mono font-bold text-rose-800">{selectedWarning.jiraSourceData.slaRiskLevel}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Warning Signals that Raised Concern */}
                {activeDiagnosticTab === 'signals' && (
                  <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <div className="font-bold text-[#0A1931] flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isAr ? '2. إيه الإشارات اللي خلتنا نقلق؟ (ربط Jira بالذكاء الاصطناعي)' : '2. Signals That Triggered Concern (Jira + AI Correlation)'}</span>
                    </div>

                    <div className="space-y-1.5">
                      {(isAr ? selectedWarning.signalsAr : selectedWarning.signals).map((sig, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                          <span className="font-medium text-slate-800 text-[11px]">{sig}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[10.5px] text-emerald-900 font-medium">
                      💡 {isAr 
                        ? 'كل إشارة لوحدها ممكن متبقاش مقلقة، لكن الـ AI ربطهم ببعض واكتشف نمط خروج عن الطبيعي قبل تحوله لكارثة.' 
                        : 'Individually, each signal seemed minor, but the AI pattern correlation flagged a systemic deviation before outage escalation.'}
                    </div>
                  </motion.div>
                )}

                {/* 3. Historical Pattern Match */}
                {activeDiagnosticTab === 'historical' && (
                  <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <div className="font-bold text-[#0A1931] flex items-center gap-1.5 text-xs">
                      <Workflow className="w-3.5 h-3.5 text-purple-600" />
                      <span>{isAr ? '3. هل حصل Pattern مشابه قبل كده؟ (مطابقة السجلات التاريخية)' : '3. Has a Similar Pattern Occurred Before? (Historical Match)'}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-purple-200 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
                          {isAr ? 'مطابقة السجلات السابقة لـ Jira & Confluence' : 'Jira & Incident Post-Mortem Match'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold text-[10px]">
                          {selectedWarning.confidence}% {isAr ? 'تطابق' : 'Correlation'}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {isAr ? selectedWarning.historicalPatternAr : selectedWarning.historicalPatternEn}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 4. Blast Radius / What Might be Impacted */}
                {activeDiagnosticTab === 'impact' && (
                  <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <div className="font-bold text-[#0A1931] flex items-center gap-1.5 text-xs">
                      <Target className="w-3.5 h-3.5 text-rose-600" />
                      <span>{isAr ? '4. إيه اللي ممكن يتأثر؟ (نطاق الضرر وحجم التأثير)' : '4. What Might Be Impacted? (Blast Radius & Customers)'}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-rose-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-bold">{isAr ? 'الخدمة المتأثرة:' : 'Impacted Service:'}</span>
                        <strong className="text-[#0A1931]">{selectedWarning.affectedService}</strong>
                      </div>

                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {isAr ? selectedWarning.impactedSystemsAr : selectedWarning.impactedSystemsEn}
                      </p>

                      <div className="flex items-center gap-3 pt-1 border-t border-slate-100 font-mono text-[10px] text-slate-600">
                        <span>{isAr ? 'وقت التعطل المحتمل:' : 'Potential Downtime:'} <strong className="text-rose-700">{selectedWarning.downtimeRiskMinutes}m</strong></span>
                        <span>•</span>
                        <span>{isAr ? 'الخسائر التقديرية:' : 'Capital at Risk:'} <strong className="text-[#FFB800] bg-slate-900 px-1 rounded">{selectedWarning.costProtectedKWD.toLocaleString()} KD</strong></span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. Recommended Action & Review */}
                {activeDiagnosticTab === 'action' && (
                  <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <div className="font-bold text-[#0A1931] flex items-center gap-1.5 text-xs">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? '5. وإيه اللي محتاج يتراجع؟ (خطة المعالجة والتدخل الفوري)' : '5. What Needs Immediate Review / Mitigation Playbook?'}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-emerald-300 shadow-xs space-y-2">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        {isAr ? 'خطة التدخل الاستباقية المقترحة من AI:' : 'AI Recommended Intervention Playbook:'}
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {isAr ? selectedWarning.recommendedActionAr : selectedWarning.recommendedActionEn}
                      </p>
                    </div>

                    <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={() => setPreviewJiraTelemetryWarning(selectedWarning)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#0A1931] border border-slate-300 shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isAr ? 'عرض أدلة Jira والإشارات المتعددة' : 'View Jira Telemetry & Evidence'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleMitigate(selectedWarning.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 ${
                          selectedWarning.status === 'Mitigated'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#0A1931] hover:from-emerald-700 hover:to-emerald-900 text-white'
                        }`}
                      >
                        {selectedWarning.status === 'Mitigated' ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>{isAr ? 'تم التدخل والتفادي (إعادة فتح)' : 'Mitigated & Unblocked (Reset)'}</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-[#FFB800]" />
                            <span>{isAr ? 'تنفيذ خطة المعالجة والتدخل المبكر' : 'Execute Early Mitigation Playbook'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                {isAr ? 'اختر أي إنذار للاطلاع على التشخيص الكامل' : 'Select an alert to view full diagnostic'}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN (6 Cols): Dual-Category Early Warning Feed */}
        <div className={`lg:col-span-6 flex-col h-auto lg:h-full min-h-[380px] lg:min-h-0 bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm overflow-hidden ${
          mobileTab === 'feed' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* Header & Dual Category Filter */}
          <div className="shrink-0 flex items-center justify-between pb-2 border-b border-slate-100 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0A1931]">
                {isAr ? 'رادار رصد المشاكل ومخاطر التسليم' : 'Early Warning Radar & Risk Feed'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                {activeAlertsCount} {isAr ? 'نشط' : 'Active'}
              </span>
            </div>

            {/* Actions: One-Click Shield All + Category Filter Tabs */}
            <div className="flex items-center gap-1.5 text-[10px] flex-wrap">
              {/* Batch Action: Shield All / Reset All */}
              <button
                onClick={handleMitigateAll}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95 ${
                  mitigatedCount === warnings.length
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-gradient-to-r from-emerald-600 to-[#0A1931] text-white hover:from-emerald-700 hover:to-slate-900'
                }`}
                title={isAr ? 'تطبيق الحماية لكافة الفرق ورؤية التحول الحي' : 'Mitigate all to see full live shift'}
              >
                <Sparkles className="w-3 h-3 text-[#FFB800]" />
                <span>
                  {mitigatedCount === warnings.length
                    ? (isAr ? 'إعادة ضبط الكل' : 'Reset All')
                    : (isAr ? 'حماية شاملة للكل' : 'Shield All (Live Shift)')
                  }
                </span>
              </button>

              <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>

              {/* Category Filter Tabs: All vs Incidents vs Delivery */}
              <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    categoryFilter === 'all' ? 'bg-[#0A1931] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
                <button
                  onClick={() => setCategoryFilter('incident_risk')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    categoryFilter === 'incident_risk' ? 'bg-rose-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>{isAr ? 'مشاكل' : 'Incidents'}</span>
                </button>
                <button
                  onClick={() => setCategoryFilter('delivery_risk')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    categoryFilter === 'delivery_risk' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GitBranch className="w-3 h-3 text-amber-500" />
                  <span>{isAr ? 'تسليم' : 'Delivery'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Warnings List Feed */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 pt-2">
            {filteredWarnings.map((warning) => {
              const isSelected = selectedWarning?.id === warning.id;
              const isMitigated = warning.status === 'Mitigated';
              const isIncident = warning.category === 'incident_risk';

              return (
                <motion.div
                  key={warning.id}
                  onClick={() => {
                    setSelectedWarning(warning);
                    if (window.innerWidth < 1024) {
                      setMobileTab('diagnostic');
                    }
                  }}
                  whileHover={{ scale: 1.005 }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#FFB800] bg-emerald-50/60 ring-2 ring-[#FFB800] shadow-md'
                      : 'border-slate-200/90 bg-slate-50/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      
                      {/* Category Badge */}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isIncident ? 'bg-rose-100 text-rose-900 border border-rose-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {isIncident ? <Flame className="w-3 h-3 text-rose-600" /> : <GitBranch className="w-3 h-3 text-amber-600" />}
                        <span>{isAr ? warning.categoryBadgeAr : warning.categoryBadgeEn}</span>
                      </span>

                      {/* Squad Badge */}
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#0A1931] text-white">
                        {isAr ? warning.affectedSquadAr : warning.affectedSquadEn}
                      </span>

                      {isSelected && (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-[#0A1931] text-[#FFB800] shrink-0 font-sans flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-[#FFB800] animate-pulse"></span>
                          <span>{isAr ? 'محدد' : 'Active'}</span>
                        </span>
                      )}
                    </div>

                    {/* Status Pill */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isMitigated ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {isMitigated ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{isAr ? 'تم التفادي والمعالجة' : 'Mitigated & Safe'}</span>
                        </>
                      ) : (
                        <>
                          <Timer className="w-3 h-3 text-rose-600" />
                          <span>{isAr ? 'قيد التحليل والرصد' : 'Active Monitoring'}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Warning Title */}
                  <div className="text-xs font-bold text-[#0A1931] mb-1">
                    {isAr ? warning.titleAr : warning.titleEn}
                  </div>

                  {/* Summary of What Changed / Key Signals */}
                  <div className="p-2 rounded-lg bg-white border border-slate-200/90 shadow-xs mb-2 text-[10.5px] text-slate-700 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">⚡ {isAr ? 'إشارة الذكاء الاصطناعي:' : 'AI Signal:'}</span>
                      <span className="line-clamp-1">{isAr ? warning.whatChangedAr : warning.whatChangedEn}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                      <span>{isAr ? 'السبق الزمني:' : 'Lead Time:'} <strong className="text-[#0A1931]">{isAr ? warning.leadTimeToImpactAr : warning.leadTimeToImpactEn}</strong></span>
                      <span>{isAr ? 'الموثوقية:' : 'Confidence:'} <strong className="text-emerald-700">{warning.confidence}%</strong></span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono font-bold">
                        <span className="text-emerald-700">+{warning.downtimeRiskMinutes}m {isAr ? 'توفير' : 'Averted'}</span>
                        <span>•</span>
                        <span className="text-[#FFB800] bg-slate-900 px-1 py-0.2 rounded font-sans">{warning.costProtectedKWD.toLocaleString()} KD</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewJiraTelemetryWarning(warning);
                        }}
                        className="text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-0.5 underline cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{isAr ? 'أدلة Jira' : 'Evidence'}</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMitigate(warning.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm ${
                        isMitigated
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#0A1931] hover:from-emerald-700 hover:to-emerald-900 text-white'
                      }`}
                    >
                      {isMitigated ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>{isAr ? 'تم التدخل (إعادة تعيين)' : 'Mitigated (Reset)'}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-[#FFB800]" />
                          <span>{isAr ? 'تدخل وتطبيق خطة المعالجة' : 'Mitigate & Protect'}</span>
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

      {/* JIRA MULTI-SIGNAL TELEMETRY & EVIDENCE MODAL */}
      <AnimatePresence>
        {previewJiraTelemetryWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-lg max-h-[75vh] flex flex-col overflow-hidden text-slate-800 font-sans"
            >
              {/* Modal Header */}
              <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#0A1931] via-[#0D2447] to-[#0A1931] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-400/30 shrink-0">
                    <Database className="w-3.5 h-3.5 text-[#FFB800]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-700 text-white">
                        Jira Live Telemetry
                      </span>
                      <span className="text-[9.5px] text-slate-300 font-mono">
                        {previewJiraTelemetryWarning.id.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-0.5 truncate">
                      {isAr ? previewJiraTelemetryWarning.titleAr : previewJiraTelemetryWarning.titleEn}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewJiraTelemetryWarning(null)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-3.5 overflow-y-auto space-y-2.5 text-xs">
                
                {/* Jira Telemetry Signals Grid */}
                <div>
                  <div className="text-[10.5px] font-bold text-[#0A1931] mb-1.5 flex items-center justify-between">
                    <span>{isAr ? 'بيانات تذاكر Jira والإشارات المرصودة' : 'Correlated Jira Telemetry Streams:'}</span>
                    <span className="text-[9px] text-slate-500 font-normal">{isAr ? 'TTs + SLA + تعليقات الفرق' : 'TTs + SLA + Comments'}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[8.5px] text-slate-500 font-semibold block">{isAr ? 'ارتفاع حجم التذاكر (TT)' : 'TT Volume Surge'}</span>
                      <span className="text-xs font-black font-mono text-rose-700 mt-0.5 block">{previewJiraTelemetryWarning.jiraSourceData.ttVolumeChange}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[8.5px] text-slate-500 font-semibold block">{isAr ? 'زمن الاستجابة (MTTR)' : 'MTTR Drift'}</span>
                      <span className="text-xs font-black font-mono text-amber-700 mt-0.5 block">{previewJiraTelemetryWarning.jiraSourceData.resolutionTimeDelta}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[8.5px] text-slate-500 font-semibold block">{isAr ? 'تنقل التذاكر' : 'Reassignment Hops'}</span>
                      <span className="text-xs font-black font-mono text-[#0A1931] mt-0.5 block">{previewJiraTelemetryWarning.jiraSourceData.reassignmentHops}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[8.5px] text-slate-500 font-semibold block">{isAr ? 'مستوى خطر الـ SLA' : 'SLA Risk Assessment'}</span>
                      <span className="text-[11px] font-bold text-rose-800 mt-0.5 block truncate">{previewJiraTelemetryWarning.jiraSourceData.slaRiskLevel}</span>
                    </div>

                    {previewJiraTelemetryWarning.jiraSourceData.overdueDependenciesCount !== undefined && (
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[8.5px] text-slate-500 font-semibold block">{isAr ? 'الاعتماديات المعلقة' : 'Overdue Dependencies'}</span>
                        <span className="text-xs font-black font-mono text-rose-700 mt-0.5 block">{previewJiraTelemetryWarning.jiraSourceData.overdueDependenciesCount} {isAr ? 'مهام' : 'Tasks'}</span>
                      </div>
                    )}

                    {previewJiraTelemetryWarning.jiraSourceData.reworkRateIncrease && (
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[8.5px] text-slate-500 font-semibold block">{isAr ? 'معدل إعادة العمل' : 'Rework Surge'}</span>
                        <span className="text-xs font-black font-mono text-amber-700 mt-0.5 block">{previewJiraTelemetryWarning.jiraSourceData.reworkRateIncrease}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5 Core Questions Detailed Card */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-[#0A1931] text-[10.5px] pb-1 border-b border-slate-200 flex items-center justify-between">
                    <span>{isAr ? 'ملخص الإجابات الخمسة لنظام الإنذار المبكر' : '5-Pillars AI Diagnostic Summary'}</span>
                    <span className="text-[9.5px] text-emerald-800 font-mono font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      {previewJiraTelemetryWarning.confidence}% Match
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 text-[10px] block mb-0.5">1. {isAr ? 'إيه اللي اتغير؟ (What Changed?)' : 'What Changed?'}</span>
                    <p className="text-slate-600 text-[10.5px] leading-relaxed pl-2 border-l-2 border-blue-500">
                      {isAr ? previewJiraTelemetryWarning.whatChangedAr : previewJiraTelemetryWarning.whatChangedEn}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 text-[10px] block mb-0.5">2. {isAr ? 'الإشارات المساهمة (Contributing Signals):' : 'Contributing Signals:'}</span>
                    <div className="space-y-0.5 pl-2 border-l-2 border-amber-500">
                      {(isAr ? previewJiraTelemetryWarning.signalsAr : previewJiraTelemetryWarning.signals).map((s, i) => (
                        <div key={i} className="text-[10px] text-slate-700 font-medium">⚡ {s}</div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 text-[10px] block mb-0.5">3. {isAr ? 'النمط التاريخي السابق (Historical Pattern Match):' : 'Historical Pattern Match:'}</span>
                    <p className="text-slate-600 text-[10.5px] leading-relaxed pl-2 border-l-2 border-purple-500">
                      {isAr ? previewJiraTelemetryWarning.historicalPatternAr : previewJiraTelemetryWarning.historicalPatternEn}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 text-[10px] block mb-0.5">4. {isAr ? 'الأنظمة والفرق المتأثرة (Impacted Systems):' : 'Impacted Systems:'}</span>
                    <p className="text-slate-600 text-[10.5px] leading-relaxed pl-2 border-l-2 border-rose-500">
                      {isAr ? previewJiraTelemetryWarning.impactedSystemsAr : previewJiraTelemetryWarning.impactedSystemsEn}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 text-[10px] block mb-0.5">5. {isAr ? 'المطلوب مراجعته والتدخل فيه (Recommended Action):' : 'Recommended Action:'}</span>
                    <p className="text-emerald-800 font-medium text-[10.5px] leading-relaxed pl-2 border-l-2 border-emerald-500 bg-emerald-50 p-1.5 rounded">
                      {isAr ? previewJiraTelemetryWarning.recommendedActionAr : previewJiraTelemetryWarning.recommendedActionEn}
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-3.5 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
                <div className="text-[9.5px] text-slate-500 font-mono">
                  {isAr ? 'السبق الزمني:' : 'Lead Time:'} <strong className="text-[#0A1931]">{isAr ? previewJiraTelemetryWarning.leadTimeToImpactAr : previewJiraTelemetryWarning.leadTimeToImpactEn}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewJiraTelemetryWarning(null)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>

                  <button
                    onClick={() => {
                      handleToggleMitigate(previewJiraTelemetryWarning.id);
                      setPreviewJiraTelemetryWarning(null);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-[#0A1931] text-white hover:from-emerald-700 hover:to-emerald-900 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Zap className="w-3 h-3 text-[#FFB800]" />
                    <span>{isAr ? 'اعتماد التدخل المبكر' : 'Execute Early Action'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
