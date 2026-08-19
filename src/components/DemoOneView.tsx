import React, { useState, useMemo } from 'react';
import { DemoIdea, Language, MeetingItem, MeetingRecommendation } from '../types';
import { BOUBYAN_MEETING_ITEMS } from '../data/demosData';
import { 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  BarChart3, 
  UserX, 
  Minimize2, 
  GitMerge, 
  ShieldCheck, 
  Check, 
  MousePointerClick, 
  Zap, 
  ChevronRight, 
  Activity,
  LineChart as LineChartIcon,
  Flame,
  TrendingDown,
  DollarSign,
  Clock,
  Rocket,
  ArrowRight,
  ArrowLeft,
  RotateCcw
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

interface DemoOneViewProps {
  idea: DemoIdea;
  lang: Language;
}

interface LastExecutedValue {
  meetingId: string;
  title: string;
  department: string;
  actionLabel: string;
  actionTag: string;
  hoursSaved: number;
  weeklyHoursFreed: number;
  costSavedKWD: number;
  costSavedUSD: number;
  reductionPct: number;
  velocityBoost: string;
  strategicOutcomeEn: string;
  strategicOutcomeAr: string;
}

export const DemoOneView: React.FC<DemoOneViewProps> = ({ idea, lang }) => {
  const isAr = lang === 'ar';
  const [meetings, setMeetings] = useState<MeetingItem[]>(BOUBYAN_MEETING_ITEMS);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(BOUBYAN_MEETING_ITEMS[0]);
  const [issueFilter, setIssueFilter] = useState<string>('all');
  
  const [chartVisualType, setChartVisualType] = useState<'spline' | 'bars'>('spline');
  const [activeChartMetric, setActiveChartMetric] = useState<'hours' | 'cost'>('hours');
  const [targetReductionPercent, setTargetReductionPercent] = useState<number>(45);

  const [lastExecutedValue, setLastExecutedValue] = useState<LastExecutedValue | null>(null);

  // Department-specific hourly rates in KWD for realistic financial precision
  const getDepartmentRate = (dept: string): number => {
    if (dept.toLowerCase().includes('core') || dept.toLowerCase().includes('معمارية')) return 48;
    if (dept.toLowerCase().includes('payment') || dept.toLowerCase().includes('دفع') || dept.toLowerCase().includes('security')) return 44;
    if (dept.toLowerCase().includes('digital') || dept.toLowerCase().includes('رقمية')) return 38;
    return 35;
  };

  const getStrategicOutcome = (iconType: string, recPct: number, attendees: number) => {
    switch (iconType) {
      case 'async':
        return {
          en: `Replaced live sync with async AI digests, releasing ${(attendees * 0.8).toFixed(0)} team members to uninterrupted deep work.`,
          ar: `استبدال الاجتماع بملخص ذكي غير متزامن، مما حرر ${(attendees * 0.8).toFixed(0)} مهندسين للتركيز البرمجي المباشر.`
        };
      case 'quorum':
        return {
          en: `Decoupled ${Math.max(1, attendees - 3)} passive observers from attendance while maintaining 100% decision transparency.`,
          ar: `إعفاء ${Math.max(1, attendees - 3)} مستمعين غير مشاركين مع ضمان شفافية القرارات عبر المحاضر الفورية.`
        };
      case 'compress':
        return {
          en: `Compressed meeting cycle to 15 mins with AI pre-reads, eliminating 70% of presentation overhead.`,
          ar: `تقليص الاجتماع إلى 15 دقيقة مع موجز استباقي، مما أزال 70% من وقت العرض التقديمي.`
        };
      case 'merge':
        return {
          en: `Consolidated redundant squad reviews into unified cross-functional checkpoints.`,
          ar: `دمج مراجعات الفرق المتكررة في نقطة اعتماد موحدة لمنع التشتت.`
        };
      case 'approve':
      default:
        return {
          en: `Instant executive sign-off automatically synced to Jira Epics without convening any live meeting.`,
          ar: `اعتماد تنفيذي فوري وترحيل تلقائي لمهام Jira بدون عقد أي اجتماع.`
        };
    }
  };

  const handleApplyRecommendation = (meetingId: string, rec: MeetingRecommendation) => {
    const targetMeeting = meetings.find(m => m.id === meetingId) || selectedMeeting;
    const isCurrentlyApplied = targetMeeting?.appliedDecisionEn === rec.labelEn;

    if (isCurrentlyApplied) {
      // Toggle off / reset back to un-optimized baseline
      setMeetings(prev => prev.map(m => {
        if (m.id === meetingId) {
          const original = BOUBYAN_MEETING_ITEMS.find(o => o.id === meetingId);
          return {
            ...m,
            statusTypeEn: original?.statusTypeEn || 'Status Update',
            statusTypeAr: original?.statusTypeAr || 'تحديث حالة',
            redundancyScore: original?.redundancyScore || 40,
            appliedDecisionEn: undefined,
            appliedDecisionAr: undefined,
            appliedReductionPct: undefined,
            summaryEn: original?.summaryEn || '',
            summaryAr: original?.summaryAr || ''
          };
        }
        return m;
      }));

      setSelectedMeeting(prev => prev?.id === meetingId ? {
        ...prev,
        appliedDecisionEn: undefined,
        appliedDecisionAr: undefined,
        appliedReductionPct: undefined
      } : prev);

      setLastExecutedValue(null);
      return;
    }

    const origHours = targetMeeting ? (BOUBYAN_MEETING_ITEMS.find(o => o.id === targetMeeting.id)?.annualPersonHours || targetMeeting.annualPersonHours) : 100;
    const rate = targetMeeting ? getDepartmentRate(targetMeeting.departmentEn) : 38;
    
    const hoursSaved = Math.round(origHours * (rec.reductionPct / 100));
    const weeklyHoursFreed = +(hoursSaved / 52).toFixed(1);
    const costSavedKWD = Math.round(hoursSaved * rate);
    const costSavedUSD = Math.round(costSavedKWD * 3.26);
    const velocityMultiplier = `+${(1 + (rec.reductionPct / 40)).toFixed(1)}x`;
    const attendees = targetMeeting?.attendeesCount || 10;
    const outcomes = getStrategicOutcome(rec.iconType, rec.reductionPct, attendees);

    setMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          statusTypeEn: 'Optimized',
          statusTypeAr: 'تم التحسين',
          redundancyScore: Math.round(m.redundancyScore * (1 - rec.reductionPct / 100)),
          appliedDecisionEn: rec.labelEn,
          appliedDecisionAr: rec.labelAr,
          appliedReductionPct: rec.reductionPct,
          summaryEn: `Decision applied: "${rec.labelEn}".`,
          summaryAr: `تم تطبيق: "${rec.labelAr}".`
        };
      }
      return m;
    }));

    setSelectedMeeting(prev => prev?.id === meetingId ? {
      ...prev,
      statusTypeEn: 'Optimized',
      statusTypeAr: 'تم التحسين',
      redundancyScore: Math.round(prev.redundancyScore * (1 - rec.reductionPct / 100)),
      appliedDecisionEn: rec.labelEn,
      appliedDecisionAr: rec.labelAr,
      appliedReductionPct: rec.reductionPct,
      summaryEn: `Decision applied: "${rec.labelEn}".`,
      summaryAr: `تم تطبيق: "${rec.labelAr}".`
    } : prev);

    setLastExecutedValue({
      meetingId,
      title: isAr ? (targetMeeting?.titleAr || '') : (targetMeeting?.titleEn || ''),
      department: isAr ? (targetMeeting?.departmentAr || '') : (targetMeeting?.departmentEn || ''),
      actionLabel: isAr ? rec.labelAr : rec.labelEn,
      actionTag: isAr ? rec.tagAr : rec.tagEn,
      hoursSaved,
      weeklyHoursFreed,
      costSavedKWD,
      costSavedUSD,
      reductionPct: rec.reductionPct,
      velocityBoost: velocityMultiplier,
      strategicOutcomeEn: outcomes.en,
      strategicOutcomeAr: outcomes.ar
    });
  };

  const handleRunBatchOptimization = () => {
    setMeetings(prev => prev.map(m => ({
      ...m,
      statusTypeEn: 'Optimized',
      statusTypeAr: 'تم التحسين',
      appliedDecisionEn: `AI Batch Detox (-${targetReductionPercent}%)`,
      appliedDecisionAr: `تطهير شامل بالذكاء الاصطناعي (-${targetReductionPercent}%)`,
      appliedReductionPct: targetReductionPercent,
      redundancyScore: Math.min(m.redundancyScore, 10)
    })));

    const totalBatchHoursSaved = Math.round(totalOriginalHours * (targetReductionPercent / 100));
    const totalBatchCostKWD = Math.round(totalBatchHoursSaved * 40);
    const totalBatchCostUSD = Math.round(totalBatchCostKWD * 3.26);

    setLastExecutedValue({
      meetingId: 'all',
      title: isAr ? 'كافة اجتماعات الفرق الهندسية لبنك بوبيان' : 'All Boubyan Engineering Meetings',
      department: isAr ? 'بنك بوبيان - التحول الرقمي' : 'Boubyan Bank - Digital Transformation',
      actionLabel: isAr ? `تطهير ذكي شامل بكافة الفرق (-${targetReductionPercent}%)` : `Full AI Batch Detox (-${targetReductionPercent}%)`,
      actionTag: isAr ? 'وفر شامل للمؤسسة' : 'Enterprise Optimization',
      hoursSaved: totalBatchHoursSaved,
      weeklyHoursFreed: +(totalBatchHoursSaved / 52).toFixed(1),
      costSavedKWD: totalBatchCostKWD,
      costSavedUSD: totalBatchCostUSD,
      reductionPct: targetReductionPercent,
      velocityBoost: `+${(1 + (targetReductionPercent / 30)).toFixed(1)}x`,
      strategicOutcomeEn: `Applied holistic AI detox rules across all 6 engineering squads, unblocking sprint velocity and eliminating recurring presentation overhead.`,
      strategicOutcomeAr: `تطبيق قواعد التطهير الذكي على كافة الفرق الـ 6، مما أزال الهدر الزمني وضاعف سرعة إنجاز المهام.`
    });
  };

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      if (issueFilter === 'bloat' && m.attendeesCount < 10) return false;
      if (issueFilter === 'optimized' && m.statusTypeEn !== 'Optimized' && m.statusTypeEn !== 'Decision Ready') return false;
      return true;
    });
  }, [meetings, issueFilter]);

  const sortedRecommendations = useMemo(() => {
    if (!selectedMeeting?.recommendations) return [];
    return [...selectedMeeting.recommendations].sort((a, b) => b.reductionPct - a.reductionPct);
  }, [selectedMeeting]);

  const totalOriginalHours = useMemo(() => {
    return BOUBYAN_MEETING_ITEMS.reduce((acc, m) => acc + m.annualPersonHours, 0);
  }, []);

  const currentTotalHours = useMemo(() => {
    return meetings.reduce((acc, m) => {
      const orig = BOUBYAN_MEETING_ITEMS.find(o => o.id === m.id)?.annualPersonHours || m.annualPersonHours;
      const effectiveReduction = m.appliedReductionPct !== undefined 
        ? m.appliedReductionPct 
        : (m.statusTypeEn === 'Decision Ready' ? 75 : targetReductionPercent);
      return acc + Math.round(orig * (1 - effectiveReduction / 100));
    }, 0);
  }, [meetings, targetReductionPercent]);

  const savedHours = Math.max(0, totalOriginalHours - currentTotalHours);
  const calculatedSavingsKWD = Math.round(savedHours * 40);
  const currentSavingsPercent = Math.round((savedHours / totalOriginalHours) * 100);

  const comparativeChartData = useMemo(() => {
    return filteredMeetings.map(m => {
      const original = BOUBYAN_MEETING_ITEMS.find(orig => orig.id === m.id)?.annualPersonHours || m.annualPersonHours;
      const rate = getDepartmentRate(m.departmentEn);
      const effectiveReduction = m.appliedReductionPct !== undefined 
        ? m.appliedReductionPct 
        : (m.statusTypeEn === 'Decision Ready' ? 75 : targetReductionPercent);
      
      const optimized = Math.round(original * (1 - effectiveReduction / 100));
      const hoursSaved = Math.max(0, original - optimized);
      const costBefore = original * rate;
      const costAfter = optimized * rate;
      const costSaved = hoursSaved * rate;

      return {
        id: m.id,
        name: isAr ? (m.titleAr.length > 12 ? m.titleAr.substring(0, 10) + '..' : m.titleAr) : (m.titleEn.length > 14 ? m.titleEn.substring(0, 12) + '..' : m.titleEn),
        fullName: isAr ? m.titleAr : m.titleEn,
        originalHours: original,
        optimizedHours: optimized,
        hoursSaved: hoursSaved,
        costBefore: costBefore,
        costAfter: costAfter,
        costSaved: costSaved,
        appliedReductionPct: effectiveReduction,
        department: isAr ? m.departmentAr : m.departmentEn,
        isSelected: selectedMeeting?.id === m.id,
        hasDecision: !!m.appliedDecisionEn
      };
    });
  }, [filteredMeetings, isAr, selectedMeeting, targetReductionPercent]);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'async':
        return <Zap className="w-3.5 h-3.5 text-[#FFB800]" />;
      case 'quorum':
        return <UserX className="w-3.5 h-3.5 text-sky-400" />;
      case 'compress':
        return <Minimize2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'merge':
        return <GitMerge className="w-3.5 h-3.5 text-indigo-400" />;
      case 'approve':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />;
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full gap-2 font-sans overflow-hidden">
      
      {/* TOP EXECUTIVE CIO BAR: CLEAR STRATEGIC OBJECTIVE & 3 KEY PILLARS */}
      <div className="shrink-0 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#0A1931] via-[#121B2F] to-[#0A1931] text-white border border-slate-700/80 shadow-md flex flex-col xl:flex-row items-center justify-between gap-3 relative overflow-hidden">
        
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-[#FFB800]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-[#8B263E]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Title & Clear Objective */}
        <div className="flex items-center gap-3 relative z-10 w-full xl:w-auto">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#8B263E] to-[#6E1226] text-white shrink-0 shadow-sm border border-white/10">
            <Rocket className="w-4 h-4 text-[#FFB800]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#8B263E] text-white text-[9px] font-black uppercase tracking-wider">
                {isAr ? 'المبادرة #01' : 'Initiative #01'}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {isAr ? 'ديتوكس الاجتماعات وتسريع دورة اتخاذ القرار' : 'AI Meeting Detox & Decision Velocity'}
              </h2>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5 font-medium">
              <span className="text-[#FFB800] font-bold">★ {isAr ? 'الهدف المباشر:' : 'Direct Objective:'}</span>
              <span>{isAr ? 'تحرير 2,400+ ساعة عمل سنوية للمهندسين وتحويل الاجتماعات المعطلة إلى قرارات فورية.' : 'Free 2,400+ dev hours annually & turn sync overhead into 1-click async decisions.'}</span>
            </p>
          </div>
        </div>

        {/* The 3 Core Executive Figures (Current -> Expected -> Net Saved ROI) */}
        <div className="flex items-center gap-2 font-mono text-xs relative z-10 w-full xl:w-auto justify-end">
          
          {/* Current State */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center min-w-[110px]">
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 font-sans block mb-0.5">
              {isAr ? 'الوضع الحالي' : 'CURRENT'}
            </span>
            <div className="text-xs font-black text-white">
              {totalOriginalHours.toLocaleString()} <span className="text-[9px] text-slate-400 font-sans">hrs/yr</span>
            </div>
          </div>

          <div className="text-[#FFB800] font-bold px-0.5">➔</div>

          {/* Expected State */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center min-w-[125px]">
            <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 font-sans block mb-0.5">
              {isAr ? 'المتوقع بعد AI' : 'EXPECTED'}
            </span>
            <div className="text-xs font-black text-emerald-300">
              {currentTotalHours.toLocaleString()} <span className="text-[9px] font-sans">hrs (-{currentSavingsPercent}%)</span>
            </div>
          </div>

          {/* Net Realized ROI Gold Pillar */}
          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B263E] to-[#0A1931] border border-[#FFB800]/50 text-center min-w-[135px] shadow-sm">
            <span className="text-[8px] font-black uppercase tracking-wider text-[#FFB800] font-sans block mb-0.5">
              {isAr ? 'الوفر المالي السنوي' : 'NET SAVINGS ROI'}
            </span>
            <div className="text-xs font-black text-[#FFB800]">
              +{calculatedSavingsKWD.toLocaleString()} <span className="text-[9px] font-sans text-amber-200">KD/yr</span>
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
            className="shrink-0 p-2.5 rounded-xl bg-gradient-to-r from-[#0A1931] via-[#10294C] to-[#0A1931] border border-[#FFB800]/60 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative overflow-hidden"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#FFB800]">
                    {isAr ? 'الأثر المحقق لهذا القرار:' : 'Tailored Decision Impact:'}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[240px]">{lastExecutedValue.title}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-900/60 text-rose-200 border border-rose-500/30 font-mono">
                    {lastExecutedValue.actionTag}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  <span className="text-emerald-300 font-bold">{lastExecutedValue.actionLabel}</span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span>{isAr ? lastExecutedValue.strategicOutcomeAr : lastExecutedValue.strategicOutcomeEn}</span>
                </div>
              </div>
            </div>

            {/* Instant Value Metrics Badges */}
            <div className="flex items-center gap-2 font-mono shrink-0 w-full md:w-auto justify-end">
              <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-center">
                <span className="text-[9px] text-slate-300 block font-sans">{isAr ? 'وفر أسبوعي' : 'Weekly Capacity'}</span>
                <span className="font-black text-cyan-300 text-xs">+{lastExecutedValue.weeklyHoursFreed}h/wk</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-400/40 text-center">
                <span className="text-[9px] text-slate-300 block font-sans">{isAr ? 'وفر سنوي' : 'Annual Time'}</span>
                <span className="font-black text-emerald-400 text-xs">+{lastExecutedValue.hoursSaved}h/yr</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-[#9A1B38]/70 border border-rose-400/40 text-center">
                <span className="text-[9px] text-slate-200 block font-sans">{isAr ? 'الوفر المالي' : 'ROI Value'}</span>
                <span className="font-black text-[#FFB800] text-xs">+{lastExecutedValue.costSavedKWD.toLocaleString()} KWD</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-center hidden lg:block">
                <span className="text-[9px] text-emerald-300 block font-sans">{isAr ? 'مضاعف السرعة' : 'Velocity'}</span>
                <span className="font-black text-white text-xs">{lastExecutedValue.velocityBoost}</span>
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
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-hidden">
        
        {/* LEFT COLUMN (7 Cols): Dynamic Chart (Top) + Clean Meeting Directory (Bottom) */}
        <div className="lg:col-span-7 flex flex-col h-full gap-2 min-h-0 overflow-hidden">
          
          {/* Top Panel: Dynamic Chart Card */}
          <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/90 shadow-sm flex flex-col justify-between h-[175px] relative overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 rounded-lg bg-[#9A1B38]/10 text-[#9A1B38] shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[#0A1931] shrink-0">
                    {isAr ? 'المقارنة البيانية' : 'Comparative Graph'}
                  </span>
                  {selectedMeeting && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#8B263E] bg-[#8B263E]/10 px-2 py-0.5 rounded-md border border-[#8B263E]/20 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse"></span>
                      <span className="truncate">{isAr ? selectedMeeting.titleAr : selectedMeeting.titleEn}</span>
                    </span>
                  )}
                </div>
              </div>
              
              {/* Style Switcher & Metric Switcher */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[10px]">
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

                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[10px]">
                  <button
                    onClick={() => setActiveChartMetric('hours')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      activeChartMetric === 'hours' ? 'bg-[#8B263E] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {isAr ? 'ساعات' : 'Hrs'}
                  </button>
                  <button
                    onClick={() => setActiveChartMetric('cost')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      activeChartMetric === 'cost' ? 'bg-[#8B263E] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {isAr ? 'دينار' : 'KWD'}
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="h-[125px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                {chartVisualType === 'spline' ? (
                  <AreaChart
                    data={comparativeChartData}
                    margin={{ top: 6, right: 10, left: -25, bottom: 5 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload.length) {
                        const clickedId = e.activePayload[0].payload.id;
                        const found = meetings.find(m => m.id === clickedId);
                        if (found) setSelectedMeeting(found);
                      }
                    }}
                  >
                    <defs>
                      <linearGradient id="splineBaselineGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="splineAiGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B263E" stopOpacity={0.7} />
                        <stop offset="60%" stopColor="#FFB800" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#8B263E" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }}
                      tickFormatter={(val) => activeChartMetric === 'cost' ? `${val}` : `${val}h`}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#0A1931] text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-[10px] min-w-[170px]">
                              <div className="font-bold text-[#FFB800] pb-1 border-b border-white/10 flex items-center justify-between">
                                <span>{data.fullName}</span>
                                <span className="text-[9px] text-slate-300 font-normal">{data.department}</span>
                              </div>
                              <div className="space-y-1 pt-1.5 font-mono">
                                <div className="flex justify-between text-slate-300">
                                  <span>{isAr ? 'الوضع الحالي:' : 'Current:'}</span>
                                  <span className="font-bold text-white">{data.originalHours}h</span>
                                </div>
                                <div className="flex justify-between text-emerald-300">
                                  <span>{isAr ? 'المتوقع (AI):' : 'Expected:'}</span>
                                  <span className="font-bold">{data.optimizedHours}h (-{data.appliedReductionPct}%)</span>
                                </div>
                                <div className="flex justify-between text-[#FFB800] pt-1 border-t border-white/10 font-bold">
                                  <span>{isAr ? 'الوفر:' : 'Saved:'}</span>
                                  <span>-{data.hoursSaved}h ({data.costSaved.toLocaleString()} KWD)</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={activeChartMetric === 'cost' ? 'costBefore' : 'originalHours'}
                      stroke="#94A3B8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fill="url(#splineBaselineGlow)"
                      name="Current"
                    />
                    <Area
                      type="monotone"
                      dataKey={activeChartMetric === 'cost' ? 'costAfter' : 'optimizedHours'}
                      stroke="#8B263E"
                      strokeWidth={3}
                      fill="url(#splineAiGlow)"
                      name="Expected"
                      dot={{ r: 4, fill: '#FFB800', strokeWidth: 2, stroke: '#0A1931' }}
                      activeDot={{ r: 7, fill: '#FFB800', stroke: '#0A1931', strokeWidth: 3 }}
                    />
                  </AreaChart>
                ) : (
                  <BarChart 
                    data={comparativeChartData} 
                    margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload.length) {
                        const clickedId = e.activePayload[0].payload.id;
                        const found = meetings.find(m => m.id === clickedId);
                        if (found) setSelectedMeeting(found);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }}
                      tickFormatter={(val) => activeChartMetric === 'cost' ? `${val}` : `${val}h`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(11, 25, 49, 0.04)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#0A1931] text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-[10px] min-w-[170px]">
                              <div className="font-bold text-[#FFB800] pb-1 border-b border-white/10 flex items-center justify-between">
                                <span>{data.fullName}</span>
                                <span className="text-[9px] text-slate-300">{data.department}</span>
                              </div>
                              <div className="space-y-1 pt-1.5 font-mono">
                                <div className="flex justify-between text-slate-300">
                                  <span>{isAr ? 'الوضع الحالي:' : 'Current:'}</span>
                                  <span className="font-bold text-white">{data.originalHours}h</span>
                                </div>
                                <div className="flex justify-between text-emerald-300">
                                  <span>{isAr ? 'المتوقع (AI):' : 'Expected:'}</span>
                                  <span className="font-bold">{data.optimizedHours}h (-{data.appliedReductionPct}%)</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {/* Baseline Bar */}
                    <Bar 
                      dataKey={activeChartMetric === 'cost' ? 'costBefore' : 'originalHours'} 
                      radius={[4, 4, 4, 4]}
                      barSize={12}
                    >
                      {comparativeChartData.map((entry, index) => (
                        <Cell 
                          key={`before-${index}`} 
                          fill={entry.isSelected ? '#94A3B8' : '#CBD5E1'} 
                          opacity={entry.isSelected ? 0.9 : 0.35}
                        />
                      ))}
                    </Bar>
                    {/* Expected AI Bar - Selected Bar Pops Out with High Contrast Gold */}
                    <Bar 
                      dataKey={activeChartMetric === 'cost' ? 'costAfter' : 'optimizedHours'} 
                      radius={[6, 6, 6, 6]}
                      barSize={14}
                    >
                      {comparativeChartData.map((entry, index) => {
                        const isSelected = entry.isSelected;
                        const hasDecision = entry.hasDecision;
                        
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              isSelected 
                                ? '#FFB800' 
                                : hasDecision 
                                  ? '#10B981' 
                                  : '#8B263E'
                            }
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

          {/* Bottom Panel: Meeting Directory */}
          <div className="flex-1 min-h-0 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
            <div className="shrink-0 flex items-center justify-between pb-1.5 border-b border-slate-100 gap-2">
              <span className="text-xs font-bold text-[#0A1931] flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5 text-[#9A1B38]" />
                <span>{isAr ? 'قائمة الاجتماعات (اضغط للتشخيص والتنفيذ)' : 'Meeting Audit Directory'}</span>
              </span>

              {/* Instant Filter Pills */}
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setIssueFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    issueFilter === 'all' ? 'bg-[#0A1931] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
                <button
                  onClick={() => setIssueFilter('bloat')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    issueFilter === 'bloat' ? 'bg-sky-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isAr ? 'تضخم' : 'Bloat'}
                </button>
                <button
                  onClick={() => setIssueFilter('optimized')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    issueFilter === 'optimized' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isAr ? 'محسّن' : 'Optimized'}
                </button>
              </div>
            </div>

            {/* Scrollable Meeting Cards List */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5 pt-1.5">
              {filteredMeetings.map((meeting) => {
                const isSelected = selectedMeeting?.id === meeting.id;
                const origHours = BOUBYAN_MEETING_ITEMS.find(o => o.id === meeting.id)?.annualPersonHours || meeting.annualPersonHours;
                const effectiveRed = meeting.appliedReductionPct !== undefined 
                  ? meeting.appliedReductionPct 
                  : (meeting.statusTypeEn === 'Decision Ready' ? 75 : targetReductionPercent);
                const liveHours = Math.round(origHours * (1 - effectiveRed / 100));

                return (
                  <motion.div
                    key={meeting.id}
                    onClick={() => setSelectedMeeting(meeting)}
                    whileHover={{ scale: 1.005 }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'border-[#FFB800] bg-amber-50/40 ring-2 ring-[#FFB800] shadow-md'
                        : 'border-slate-100 bg-slate-50/80 hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="text-[9px] font-bold text-[#8B263E] bg-rose-100/80 px-1.5 py-0.2 rounded">
                          {isAr ? meeting.departmentAr : meeting.departmentEn}
                        </span>
                        {isSelected && (
                          <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-[#0A1931] text-[#FFB800] shrink-0 font-sans flex items-center gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-[#FFB800] animate-pulse"></span>
                            <span>{isAr ? 'محدد بالرسم' : 'Active in Graph'}</span>
                          </span>
                        )}
                        {meeting.appliedDecisionEn ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[120px]">{isAr ? meeting.appliedDecisionAr : meeting.appliedDecisionEn}</span>
                            <span className="text-[8px] bg-emerald-200 px-1 rounded font-mono">-{meeting.appliedReductionPct}%</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            {isAr ? meeting.statusTypeAr : meeting.statusTypeEn}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-[#0A1931] truncate">
                        {isAr ? meeting.titleAr : meeting.titleEn}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 text-[11px] font-mono">
                      <span className="text-slate-500 flex items-center gap-0.5">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{meeting.attendeesCount}</span>
                      </span>
                      <span className={`font-black ${isSelected ? 'text-[#8B263E]' : 'text-slate-700'}`}>
                        {liveHours}h
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSelected ? 'text-[#8B263E] translate-x-0.5' : ''}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): AI Diagnostic & Action Console */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-0 bg-gradient-to-br from-[#0A1931] via-[#10223f] to-[#1a1c36] text-white rounded-2xl p-3 border border-slate-700/80 shadow-lg overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFB800]/5 rounded-full blur-xl pointer-events-none" />

          {selectedMeeting ? (
            <div className="flex flex-col h-full min-h-0 overflow-hidden relative z-10">
              
              {/* Meeting Header */}
              <div className="shrink-0 pb-2 border-b border-white/10">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#9A1B38] text-white text-[10px] font-black uppercase">
                    {isAr ? selectedMeeting.departmentAr : selectedMeeting.departmentEn}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
                    <span>{selectedMeeting.durationMinutes}m</span>
                    <span className="text-[#FFB800] font-black">{selectedMeeting.annualPersonHours}h/yr</span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-white font-serif leading-snug">
                  {isAr ? selectedMeeting.titleAr : selectedMeeting.titleEn}
                </h3>
              </div>

              {/* Attendee Quorum Summary */}
              <div className="shrink-0 py-2 border-b border-white/10 space-y-1">
                {selectedMeeting.attendeeBreakdown && (
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                      <span className="font-semibold">{isAr ? 'صناع القرار:' : 'Deciders:'}</span>
                      <span className="font-black font-mono text-xs text-white">{selectedMeeting.attendeeBreakdown.coreDeciders}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 flex items-center justify-between">
                      <span className="font-semibold">{isAr ? 'مستمعين:' : 'Observers:'}</span>
                      <span className="font-black font-mono text-xs text-white">{selectedMeeting.attendeeBreakdown.passiveListeners}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Playbooks */}
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-1.5">
                <div className="shrink-0 flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FFB800]" />
                    <span>{isAr ? 'توصيات القرار (مرتبة من الأكثر وفراً للأقل)' : 'Decision Playbooks (Highest Savings First)'}</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#FFB800] bg-white/10 px-1.5 py-0.2 rounded">
                    {isAr ? 'ترتيب تنازلي حسب الوفر' : 'Sorted by ROI'}
                  </span>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5">
                  {sortedRecommendations.map((rec, index) => {
                    const isApplied = selectedMeeting.appliedDecisionEn === rec.labelEn;
                    const hoursSaved = Math.round(selectedMeeting.annualPersonHours * (rec.reductionPct / 100));
                    const rate = getDepartmentRate(selectedMeeting.departmentEn);
                    const kwdSaved = Math.round(hoursSaved * rate);
                    const isTopSaver = index === 0;

                    return (
                      <motion.div
                        key={rec.id}
                        whileHover={{ scale: 1.01 }}
                        className={`p-2 rounded-xl border transition-all relative ${
                          isApplied
                            ? 'bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                            : isTopSaver 
                              ? 'bg-gradient-to-r from-amber-950/40 via-white/5 to-white/5 border-[#FFB800]/50 hover:bg-white/10 shadow-sm'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="p-1 rounded-md bg-white/10 shrink-0">
                              {getRecommendationIcon(rec.iconType)}
                            </div>
                            <span className="text-xs font-bold text-white truncate">
                              {isAr ? rec.labelAr : rec.labelEn}
                            </span>
                            {isTopSaver && (
                              <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-gradient-to-r from-[#FFB800] to-amber-500 text-[#0A1931] shrink-0 font-sans shadow-xs flex items-center gap-0.5">
                                <span>★</span>
                                <span>{isAr ? 'الخيار الأفضل' : '#1 Best Saver'}</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-[#FFB800] shrink-0">
                            -{rec.reductionPct}% ({hoursSaved}h | {kwdSaved.toLocaleString()} KD)
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-300 line-clamp-1 mb-1.5">
                          {isAr ? rec.descriptionAr : rec.descriptionEn}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-white/10">
                          <span className="text-[9px] text-[#FFB800] font-semibold">
                            {isAr ? rec.tagAr : rec.tagEn}
                          </span>

                          <button
                            onClick={() => handleApplyRecommendation(selectedMeeting.id, rec)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs ${
                              isApplied
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : isTopSaver
                                  ? 'bg-gradient-to-r from-[#FFB800] via-amber-400 to-[#FFB800] text-[#0A1931] hover:brightness-105 font-black'
                                  : 'bg-gradient-to-r from-white via-slate-100 to-white text-[#0A1931] hover:bg-[#FFB800] hover:text-[#0A1931]'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <Check className="w-3 h-3 text-white" />
                                <span>{isAr ? 'مُطبّق (اضغط للإلغاء)' : 'Applied (Click to Reset)'}</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3 h-3 text-[#9A1B38]" />
                                <span>{isAr ? 'تطبيق وتحديث الرسم' : 'Execute & Update'}</span>
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
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              {isAr ? 'اختر أي اجتماع للمعاينة' : 'Select an item to inspect'}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
