import React, { useState, useMemo, useEffect } from 'react';
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
import { useExecutiveMetrics } from '../context/ExecutiveMetricsContext';
import { AppEmblemIcon } from './AppEmblemIcons';

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
  const { appliedMeetingDecisions, applyMeetingDecision, removeMeetingDecision } = useExecutiveMetrics();

  // Initialize meetings with any persisted applied decisions
  const [meetings, setMeetings] = useState<MeetingItem[]>(() => {
    return BOUBYAN_MEETING_ITEMS.map(m => {
      const persisted = appliedMeetingDecisions[m.id];
      if (persisted) {
        return {
          ...m,
          statusTypeEn: 'Optimized',
          statusTypeAr: 'تم التحسين',
          redundancyScore: Math.round(m.redundancyScore * (1 - persisted.reductionPct / 100)),
          appliedDecisionEn: persisted.labelEn,
          appliedDecisionAr: persisted.labelAr,
          appliedReductionPct: persisted.reductionPct,
          summaryEn: `Decision applied: "${persisted.labelEn}".`,
          summaryAr: `تم تطبيق: "${persisted.labelAr}".`
        };
      }
      return m;
    });
  });

  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(() => {
    const first = BOUBYAN_MEETING_ITEMS[0];
    const persisted = appliedMeetingDecisions[first.id];
    if (persisted) {
      return {
        ...first,
        statusTypeEn: 'Optimized',
        statusTypeAr: 'تم التحسين',
        redundancyScore: Math.round(first.redundancyScore * (1 - persisted.reductionPct / 100)),
        appliedDecisionEn: persisted.labelEn,
        appliedDecisionAr: persisted.labelAr,
        appliedReductionPct: persisted.reductionPct,
        summaryEn: `Decision applied: "${persisted.labelEn}".`,
        summaryAr: `تم تطبيق: "${persisted.labelAr}".`
      };
    }
    return first;
  });
  const [issueFilter, setIssueFilter] = useState<string>('all');
  
  const [chartVisualType, setChartVisualType] = useState<'spline' | 'bars'>('spline');
  const [activeChartMetric, setActiveChartMetric] = useState<'hours' | 'cost'>('hours');
  const [targetReductionPercent, setTargetReductionPercent] = useState<number>(45);
  const [mobileTab, setMobileTab] = useState<'list' | 'diagnostic'>('list');

  const [lastExecutedValue, setLastExecutedValue] = useState<LastExecutedValue | null>(null);

  useEffect(() => {
    if (lastExecutedValue) {
      const timer = setTimeout(() => {
        setLastExecutedValue(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastExecutedValue]);

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
      removeMeetingDecision(meetingId);

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

    // Dispatch to global context
    applyMeetingDecision(meetingId, {
      meetingId,
      recId: rec.id,
      labelEn: rec.labelEn,
      labelAr: rec.labelAr,
      reductionPct: rec.reductionPct,
      hoursSaved,
      kwdSaved: costSavedKWD,
      usdSaved: costSavedUSD
    });

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
    <div className="flex-1 min-h-0 flex flex-col h-full gap-2 font-sans overflow-y-auto lg:overflow-hidden">
      
      {/* TOP EXECUTIVE CIO BAR: CLEAR STRATEGIC OBJECTIVE & 3 KEY PILLARS */}
      <div className="shrink-0 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#0A1931] via-[#121B2F] to-[#0A1931] text-white border border-slate-700/80 shadow-md flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 sm:gap-3 relative overflow-hidden min-h-[66px]">
        
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-[#FFB800]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-[#8B263E]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Title & Clear Objective */}
        <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 w-full xl:w-auto">
          <AppEmblemIcon type="meeting-detox" size="md" />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#8B263E] text-white text-[9px] font-black uppercase tracking-wider">
                {isAr ? 'المبادرة #01' : 'Initiative #01'}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {isAr ? 'ديتوكس الاجتماعات وتسريع دورة اتخاذ القرار' : 'AI Meeting Detox & Decision Velocity'}
              </h2>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5 font-medium">
              <span className="text-[#FFB800] font-bold shrink-0">★ {isAr ? 'الهدف المباشر:' : 'Direct Objective:'}</span>
              <span className="line-clamp-2 sm:line-clamp-1">{isAr ? 'تحرير 2,400+ ساعة عمل سنوية للمهندسين وتحويل الاجتماعات المعطلة إلى قرارات فورية.' : 'Free 2,400+ dev hours annually & turn sync overhead into 1-click async decisions.'}</span>
            </p>
          </div>
        </div>

        {/* The 3 Core Executive Figures (Current -> Expected -> Net Saved ROI) */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 font-mono text-xs relative z-10 w-full xl:w-auto justify-end">
          
          {/* Current State */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center">
            <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-slate-400 font-sans block mb-0.5 truncate">
              {isAr ? 'الوضع الحالي' : 'CURRENT'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-white truncate">
              {totalOriginalHours.toLocaleString()} <span className="text-[8px] sm:text-[9px] text-slate-400 font-sans">hrs</span>
            </div>
          </div>

          <div className="hidden sm:block text-[#FFB800] font-bold px-0.5">➔</div>

          {/* Expected State */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center">
            <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-emerald-400 font-sans block mb-0.5 truncate">
              {isAr ? 'المتوقع بعد AI' : 'EXPECTED'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-emerald-300 truncate">
              {currentTotalHours.toLocaleString()} <span className="text-[8px] sm:text-[9px] font-sans">(-{currentSavingsPercent}%)</span>
            </div>
          </div>

          {/* Net Realized ROI Gold Pillar */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B263E] to-[#0A1931] border border-[#FFB800]/50 text-center shadow-sm">
            <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-[#FFB800] font-sans block mb-0.5 truncate">
              {isAr ? 'الوفر المالي' : 'NET SAVINGS'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-[#FFB800] truncate">
              +{calculatedSavingsKWD.toLocaleString()} <span className="text-[8px] sm:text-[9px] font-sans text-amber-200">KD</span>
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
            className="fixed bottom-4 end-4 z-50 p-3 rounded-xl bg-[#0A1931]/95 text-white border border-[#FFB800]/50 shadow-2xl backdrop-blur-md max-w-sm flex items-start gap-2.5 font-sans"
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[9.5px] uppercase tracking-wider font-bold text-[#FFB800]">
                  {isAr ? 'تم تطبيق القرار بنجاح' : 'Decision Applied'}
                </span>
                <button 
                  onClick={() => setLastExecutedValue(null)} 
                  className="text-slate-400 hover:text-white font-bold p-0.5 cursor-pointer text-xs leading-none"
                >
                  ✕
                </button>
              </div>
              <div className="text-[11px] font-bold text-white truncate mt-0.5">
                {lastExecutedValue.title}
              </div>
              <div className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                <span className="text-emerald-300 font-bold">{lastExecutedValue.actionLabel}: </span>
                <span>{isAr ? lastExecutedValue.strategicOutcomeAr : lastExecutedValue.strategicOutcomeEn}</span>
              </div>
              
              {/* Compact Metrics Chips */}
              <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-white/10 text-[9px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/30">
                  +{lastExecutedValue.hoursSaved}h/yr
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-[#FFB800] font-bold border border-amber-500/30">
                  +{lastExecutedValue.costSavedKWD.toLocaleString()} KD
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-cyan-300 font-bold border border-cyan-500/30">
                  {lastExecutedValue.velocityBoost}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE SEGMENTED TABS (Visible only on screens < lg) */}
      <div className="lg:hidden shrink-0 flex items-center p-1 rounded-xl bg-slate-200/90 border border-slate-300 shadow-xs font-bold text-xs">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === 'list'
              ? 'bg-[#0A1931] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>{isAr ? 'قائمة الاجتماعات والرسم' : 'Meetings List & Chart'}</span>
        </button>
        <button
          onClick={() => setMobileTab('diagnostic')}
          className={`flex-1 py-2 px-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === 'diagnostic'
              ? 'bg-[#8B263E] text-white shadow-xs'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>{isAr ? 'توصيات الذكاء الاصطناعي' : 'AI Decision Console'}</span>
          {selectedMeeting && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* MAIN SPLIT BODY (Single Screen on Desktop, Tabbed / Responsive on Mobile) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT COLUMN (7 Cols): Dynamic Chart (Top) + Clean Meeting Directory (Bottom) */}
        <div className={`lg:col-span-7 flex-col h-auto lg:h-full gap-2 min-h-0 ${
          mobileTab === 'list' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* Top Panel: Dynamic Chart Card */}
          <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/90 shadow-sm flex flex-col justify-between h-[180px] sm:h-[175px] relative overflow-hidden">
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
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      if (window.innerWidth < 1024) {
                        setMobileTab('diagnostic');
                      }
                    }}
                    whileHover={{ scale: 1.005 }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 min-h-[50px] ${
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
        <div className={`lg:col-span-5 flex-col h-auto lg:h-full min-h-[360px] lg:min-h-0 bg-white text-slate-800 rounded-2xl p-3 border border-slate-200/90 shadow-sm overflow-hidden relative ${
          mobileTab === 'diagnostic' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#8B263E]/5 rounded-full blur-xl pointer-events-none" />

          {/* Mobile Back to List Button (visible on mobile only) */}
          <div className="lg:hidden shrink-0 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setMobileTab('list')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? 'العودة لقائمة الاجتماعات' : 'Back to Meetings'}</span>
            </button>
            <span className="text-[10px] font-mono font-bold text-emerald-700">
              {isAr ? 'التشخيص المباشر' : 'Live Diagnosis'}
            </span>
          </div>

          {selectedMeeting ? (
            <div className="flex flex-col h-full min-h-0 overflow-hidden relative z-10">
              
              {/* Meeting Header */}
              <div className="shrink-0 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#8B263E] text-white text-[10px] font-black uppercase">
                    {isAr ? selectedMeeting.departmentAr : selectedMeeting.departmentEn}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 font-bold">
                    <span>{selectedMeeting.durationMinutes}m</span>
                    <span className="text-[#8B263E] font-black">{selectedMeeting.annualPersonHours}h/yr</span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-[#0A1931] font-sans leading-snug">
                  {isAr ? selectedMeeting.titleAr : selectedMeeting.titleEn}
                </h3>
              </div>

              {/* Attendee Quorum Summary */}
              <div className="shrink-0 py-2 border-b border-slate-100 space-y-1">
                {selectedMeeting.attendeeBreakdown && (
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
                      <span className="font-semibold">{isAr ? 'صناع القرار:' : 'Deciders:'}</span>
                      <span className="font-black font-mono text-xs text-emerald-950">{selectedMeeting.attendeeBreakdown.coreDeciders}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
                      <span className="font-semibold">{isAr ? 'مستمعين:' : 'Observers:'}</span>
                      <span className="font-black font-mono text-xs text-rose-950">{selectedMeeting.attendeeBreakdown.passiveListeners}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Playbooks */}
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-1.5">
                <div className="shrink-0 flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#0A1931] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#8B263E]" />
                    <span>{isAr ? 'توصيات القرار (مرتبة حسب الوفر)' : 'Decision Playbooks (Highest ROI)'}</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#8B263E] bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded">
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
                        whileHover={{ scale: 1.005 }}
                        className={`p-2.5 rounded-xl border transition-all relative ${
                          isApplied
                            ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400 shadow-sm'
                            : isTopSaver 
                              ? 'bg-gradient-to-r from-amber-50/70 via-white to-white border-amber-300/90 hover:border-amber-400 shadow-xs'
                              : 'bg-slate-50/90 border-slate-200/90 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="p-1 rounded-md bg-white border border-slate-200 shrink-0 text-[#8B263E]">
                              {getRecommendationIcon(rec.iconType)}
                            </div>
                            <span className="text-xs font-bold text-[#0A1931] truncate">
                              {isAr ? rec.labelAr : rec.labelEn}
                            </span>
                            {isTopSaver && (
                              <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200 shrink-0 font-sans shadow-xs flex items-center gap-0.5">
                                <span>★</span>
                                <span>{isAr ? 'الخيار الأفضل' : '#1 Best Saver'}</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-[#8B263E] shrink-0">
                            -{rec.reductionPct}% ({hoursSaved}h | {kwdSaved.toLocaleString()} KD)
                          </span>
                        </div>

                        <p className="text-[10.5px] text-slate-600 line-clamp-1 mb-1.5">
                          {isAr ? rec.descriptionAr : rec.descriptionEn}
                        </p>

                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70">
                          <span className="text-[9.5px] text-[#8B263E] font-bold">
                            {isAr ? rec.tagAr : rec.tagEn}
                          </span>

                          <button
                            onClick={() => handleApplyRecommendation(selectedMeeting.id, rec)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs ${
                              isApplied
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : isTopSaver
                                  ? 'bg-gradient-to-r from-[#8B263E] to-[#0A1931] text-white hover:opacity-95 font-bold'
                                  : 'bg-[#0A1931] hover:bg-slate-800 text-white'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <Check className="w-3 h-3 text-white" />
                                <span>{isAr ? 'مُطبّق (اضغط للإلغاء)' : 'Applied (Click to Reset)'}</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3 h-3 text-[#FFB800]" />
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
