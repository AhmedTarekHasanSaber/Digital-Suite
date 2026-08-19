import React, { useState, useMemo } from 'react';
import { DemoIdea, Language, KnowledgeGapItem } from '../types';
import { INITIAL_KNOWLEDGE_GAPS } from '../data/demosData';
import { 
  CheckCircle2, 
  Sparkles, 
  BarChart3, 
  Check, 
  Zap, 
  BookOpen, 
  Activity,
  LineChart as LineChartIcon,
  Search,
  Clock,
  TrendingDown,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Users,
  FileText,
  Eye,
  ExternalLink,
  Building2,
  Layers,
  Send,
  X,
  Share2,
  CheckCheck
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

interface DemoTwoViewProps {
  idea: DemoIdea;
  lang: Language;
}

interface LastExecutedGapValue {
  topic: string;
  source: string;
  hoursSavedWeekly: number;
  annualKwdSaved: number;
  annualUsdSaved: number;
  latencyDrop: string;
  expert: string;
  assignedTeam: string;
  assignedJiraTaskKey: string;
  createdArticleTitle: string;
  createdArticleSpace: string;
  strategicImpactEn: string;
  strategicImpactAr: string;
}

export const DemoTwoView: React.FC<DemoTwoViewProps> = ({ idea, lang }) => {
  const isAr = lang === 'ar';
  const [gaps, setGaps] = useState<KnowledgeGapItem[]>(INITIAL_KNOWLEDGE_GAPS);
  const [selectedGap, setSelectedGap] = useState<KnowledgeGapItem | null>(INITIAL_KNOWLEDGE_GAPS[0]);
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [chartVisualType, setChartVisualType] = useState<'spline' | 'bars'>('spline');

  const [lastExecutedValue, setLastExecutedValue] = useState<LastExecutedGapValue | null>(null);
  const [previewArticleGap, setPreviewArticleGap] = useState<KnowledgeGapItem | null>(null);

  const PRESET_QUERIES = [
    {
      labelEn: 'EKYC Biometrics Workflow',
      labelAr: 'واجهة EKYC البيومترية',
      result: {
        similarDone: isAr ? 'Jira Epic #DB-4091 واجتماع المعمارية' : 'Jira Epic #DB-4091 & Arch Board',
        expert: isAr ? 'أحمد العلي (هندسة رقمية - متاح)' : 'Ahmad Al-Ali (Digital Eng - Online)',
        decisionReason: isAr ? 'الاعتماد على معيار 15ms لتقليل وقت انتظار العميل' : '15ms latency ceiling to prevent drop-off',
        processDoc: isAr ? 'Confluence: Onboarding_SLA_v2' : 'Confluence: Onboarding_SLA_v2'
      }
    },
    {
      labelEn: 'KNET Webhook Architecture',
      labelAr: 'بوابات KNET والـ Webhook',
      result: {
        similarDone: isAr ? 'مشروع الربط الموحد لبوابات الدفع #PAY-110' : 'Unified Payment Gateway #PAY-110',
        expert: isAr ? 'سارة الشمري (أنظمة الدفع)' : 'Sara Al-Shammari (Payment SME)',
        decisionReason: isAr ? 'تطبيق التشفير الثنائي وتأكيد العمليات خلال 300ms' : 'End-to-end encryption with 300ms SLA',
        processDoc: isAr ? 'Confluence: KNET_Specs_2025' : 'Confluence: KNET_Specs_2025'
      }
    },
    {
      labelEn: 'Cloud Security & ISO Mandates',
      labelAr: 'أمن السحابة ومعايير ISO',
      result: {
        similarDone: isAr ? 'فريق الامتثال والأمن السيبراني #SEC-882' : 'Compliance & Cyber Defense #SEC-882',
        expert: isAr ? 'فيصل الدوسري (أمن المعلومات)' : 'Faisal Al-Dousari (CISO Office)',
        decisionReason: isAr ? 'حفظ السجلات 7 سنوات بمراكز بيانات الكويت' : 'Kuwait datacenters (7-yr retention)',
        processDoc: isAr ? 'SharePoint: Cloud_Security_v4' : 'SharePoint: Cloud_Security_v4'
      }
    }
  ];

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [initiativeResult, setInitiativeResult] = useState(PRESET_QUERIES[0].result);

  const handleSelectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    setInitiativeResult(PRESET_QUERIES[idx].result);
  };

  // Distinct metric mapping per knowledge gap
  const getGapMetrics = (gapId: string) => {
    switch (gapId) {
      case 'gap-1':
      case 'gap-01':
        return {
          hoursWeekly: 9.4,
          annualKwd: 18200,
          latency: '-92%',
          impactEn: 'Created authoritative Confluence runbook & assigned DIG-4092 to Digital Banking Core Squad.',
          impactAr: 'تم إنشاء مقال SOP معتمد في Confluence وتكليف فريق القنوات الرقمية عبر مهمة DIG-4092.'
        };
      case 'gap-2':
      case 'gap-02':
        return {
          hoursWeekly: 6.8,
          annualKwd: 14500,
          latency: '-84%',
          impactEn: 'Published Kafka replay runbook in Confluence & assigned PAY-1108 to Payments Squad.',
          impactAr: 'تم نشر دليل تشغيل Kafka في Confluence وتكليف فريق المدفوعات عبر مهمة PAY-1108.'
        };
      case 'gap-3':
      case 'gap-03':
        return {
          hoursWeekly: 13.5,
          annualKwd: 27800,
          latency: '-95%',
          impactEn: 'Generated CBK data vault retention checklist & assigned SEC-8820 to Cyber Security Team.',
          impactAr: 'تم نشر لائحة الامتثال السحابي لبنك الكويت المركزي وتكليف فريق الأمن عبر مهمة SEC-8820.'
        };
      case 'gap-4':
      case 'gap-04':
      default:
        return {
          hoursWeekly: 5.2,
          annualKwd: 9800,
          latency: '-80%',
          impactEn: 'Published Swift GPI Webhook specs in Confluence & assigned TRX-5541 to Treasury Squad.',
          impactAr: 'تم نشر مواصفات واجهات Swift GPI في Confluence وتكليف فريق الخزينة عبر مهمة TRX-5541.'
        };
    }
  };

  const handleGenerateSopAndAssign = (gapId: string) => {
    const targetGap = gaps.find(g => g.id === gapId) || selectedGap;
    const isCurrentlyResolved = targetGap?.status === 'Resolved';

    if (isCurrentlyResolved) {
      // Toggle back to Open
      setGaps(prev => prev.map(g => g.id === gapId ? { ...g, status: 'Open' } : g));
      setSelectedGap(prev => prev?.id === gapId ? { ...prev, status: 'Open' } : prev);
      setLastExecutedValue(null);
      return;
    }

    const metrics = getGapMetrics(gapId);

    setGaps(prev => prev.map(g => {
      if (g.id === gapId) return { ...g, status: 'Resolved' };
      return g;
    }));

    const updatedGap = { ...targetGap!, status: 'Resolved' as const };
    setSelectedGap(updatedGap);

    setLastExecutedValue({
      topic: isAr ? (targetGap?.topicAr || '') : (targetGap?.topicEn || ''),
      source: targetGap?.sourceApp || 'Confluence',
      expert: isAr ? (targetGap?.expertNameAr || '') : (targetGap?.expertNameEn || ''),
      assignedTeam: isAr ? (targetGap?.teamAr || 'الفريق المختص') : (targetGap?.teamEn || 'Assigned Squad'),
      assignedJiraTaskKey: targetGap?.assignedJiraTaskKey || 'TASK-100',
      createdArticleTitle: isAr ? (targetGap?.createdArticleTitleAr || '') : (targetGap?.createdArticleTitleEn || ''),
      createdArticleSpace: targetGap?.createdArticleSpace || 'Boubyan Engineering / Wiki',
      hoursSavedWeekly: metrics.hoursWeekly,
      annualKwdSaved: metrics.annualKwd,
      annualUsdSaved: Math.round(metrics.annualKwd * 3.26),
      latencyDrop: metrics.latency,
      strategicImpactEn: metrics.impactEn,
      strategicImpactAr: metrics.impactAr
    });
  };

  const filteredGaps = useMemo(() => {
    return gaps
      .filter(g => {
        if (sourceFilter === 'all') return true;
        return g.sourceApp.toLowerCase().includes(sourceFilter.toLowerCase());
      })
      .sort((a, b) => getGapMetrics(b.id).annualKwd - getGapMetrics(a.id).annualKwd);
  }, [gaps, sourceFilter]);

  const resolvedCount = gaps.filter(g => g.status === 'Resolved').length;

  const totalCumulativeKwdSaved = useMemo(() => {
    return gaps.reduce((acc, g) => {
      if (g.status === 'Resolved') {
        return acc + getGapMetrics(g.id).annualKwd;
      }
      return acc;
    }, 0);
  }, [gaps]);

  const knowledgeFrictionData = useMemo(() => [
    { 
      source: 'Confluence', 
      currentHours: 3.8, 
      expectedHours: gaps.find(g => g.id === 'gap-1' || g.id === 'gap-01')?.status === 'Resolved' ? 0.2 : 3.8, 
      name: isAr ? 'كونفلوينس' : 'Confluence', 
      code: 'confluence' 
    },
    { 
      source: 'Jira', 
      currentHours: 5.2, 
      expectedHours: gaps.find(g => g.id === 'gap-2' || g.id === 'gap-02')?.status === 'Resolved' ? 0.3 : 5.2, 
      name: isAr ? 'جيرا' : 'Jira', 
      code: 'jira' 
    },
    { 
      source: 'SharePoint', 
      currentHours: 4.6, 
      expectedHours: gaps.find(g => g.id === 'gap-3' || g.id === 'gap-03')?.status === 'Resolved' ? 0.2 : 4.6, 
      name: isAr ? 'شيربوينت' : 'SharePoint', 
      code: 'sharepoint' 
    },
    { 
      source: 'Teams', 
      currentHours: 6.4, 
      expectedHours: gaps.find(g => g.id === 'gap-4' || g.id === 'gap-04')?.status === 'Resolved' ? 0.3 : 6.4, 
      name: isAr ? 'تيمز' : 'Teams', 
      code: 'teams' 
    }
  ], [isAr, gaps]);

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full gap-2 font-sans overflow-y-auto lg:overflow-hidden">
      
      {/* TOP EXECUTIVE CIO BAR: CLEAR STRATEGIC OBJECTIVE & 3 KEY PILLARS */}
      <div className="shrink-0 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#0A1931] via-[#0E2A4A] to-[#0A1931] text-white border border-slate-700/80 shadow-md flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 sm:gap-3 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-[#0284C7]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Title & Clear Strategic Objective */}
        <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 w-full xl:w-auto">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shrink-0 shadow-sm border border-white/10">
            <Sparkles className="w-4 h-4 text-[#FFB800]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#0284C7] text-white text-[9px] font-black uppercase tracking-wider">
                {isAr ? 'المبادرة #02' : 'Initiative #02'}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {isAr ? 'مكتشف فجوات المعرفة وتكليف الفرق بإنشاء التوثيق' : 'AI Knowledge Gap Detector & Squad Article Creator'}
              </h2>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5 font-medium">
              <span className="text-[#FFB800] font-bold shrink-0">★ {isAr ? 'الهدف المباشر:' : 'Direct Objective:'}</span>
              <span className="line-clamp-2 sm:line-clamp-1">
                {isAr ? 'الكشف الفوري عن فجوات التوثيق، إنشاء مقالات Confluence وتكليف الفرق المختصة لإغلاقها.' : 'Detect knowledge gaps, auto-create Confluence articles & assign tasks to squads.'}
              </span>
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
              5.2 <span className="text-[8px] sm:text-[9px] text-slate-400 font-sans">hrs</span>
            </div>
          </div>

          <div className="hidden sm:block text-[#FFB800] font-bold px-0.5">➔</div>

          {/* Expected State */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center">
            <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-cyan-400 font-sans block mb-0.5 truncate">
              {isAr ? 'المتوقع بعد AI' : 'EXPECTED'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-cyan-300 truncate">
              0.3 <span className="text-[8px] sm:text-[9px] font-sans">(-94%)</span>
            </div>
          </div>

          {/* Net Realized ROI Gold Pillar */}
          <div className="px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0284C7]/80 to-[#0A1931] border border-cyan-400/50 text-center shadow-sm">
            <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-[#FFB800] font-sans block mb-0.5 truncate">
              {isAr ? 'الوفر المالي' : 'NET SAVINGS'}
            </span>
            <div className="text-[11px] sm:text-xs font-black text-[#FFB800] truncate">
              +{(totalCumulativeKwdSaved > 0 ? totalCumulativeKwdSaved : 69500).toLocaleString()} <span className="text-[8px] sm:text-[9px] font-sans text-amber-200">KD</span>
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
            className="shrink-0 p-2.5 rounded-xl bg-gradient-to-r from-[#0A1931] via-[#0D294D] to-[#0A1931] border border-cyan-400/60 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative overflow-hidden"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0 mt-0.5">
                <FileCheck className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#FFB800]">
                    {isAr ? 'تم إنشاء المقال وتكليف الفريق بنجاح:' : 'Article Created & Dispatched to Squad:'}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[280px]">
                    {lastExecutedValue.createdArticleTitle}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-900/80 text-cyan-200 border border-cyan-400/40 font-mono">
                    Jira #{lastExecutedValue.assignedJiraTaskKey}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#FFB800]" />
                    <span>{lastExecutedValue.assignedTeam}</span>
                  </span>
                  <span className="text-slate-400 mx-1">•</span>
                  <span className="text-amber-200">{isAr ? 'الخبير المسند إليه:' : 'Lead SME:'} {lastExecutedValue.expert}</span>
                </div>
              </div>
            </div>

            {/* Instant Value Metrics Badges & Preview Trigger */}
            <div className="flex items-center gap-2 font-mono shrink-0 w-full md:w-auto justify-end">
              <button
                onClick={() => {
                  const target = gaps.find(g => g.topicEn === lastExecutedValue.topic || g.topicAr === lastExecutedValue.topic) || selectedGap;
                  if (target) setPreviewArticleGap(target);
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#0A1931] font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isAr ? 'معاينة المقال' : 'Preview Article'}</span>
              </button>

              <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-center">
                <span className="text-[9px] text-slate-300 block font-sans">{isAr ? 'وفر أسبوعي' : 'Weekly Saved'}</span>
                <span className="font-black text-cyan-400 text-xs">+{lastExecutedValue.hoursSavedWeekly}h/wk</span>
              </div>
              
              <div className="px-2.5 py-1 rounded-lg bg-[#0284C7]/60 border border-cyan-400/40 text-center">
                <span className="text-[9px] text-slate-200 block font-sans">{isAr ? 'العائد السنوي' : 'Annual ROI'}</span>
                <span className="font-black text-[#FFB800] text-xs">+{lastExecutedValue.annualKwdSaved.toLocaleString()} KWD</span>
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
        
        {/* LEFT COLUMN (6 Cols): Chart + Instant AI Matcher */}
        <div className="lg:col-span-6 flex flex-col h-auto lg:h-full gap-2 min-h-0">
          
          {/* Top Panel: Latency Chart */}
          <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/90 shadow-sm flex flex-col justify-between h-[180px] sm:h-[175px] relative overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1 rounded-lg bg-[#0284C7]/10 text-[#0284C7] shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[#0A1931] shrink-0">
                    {isAr ? 'زمن الوصول للمعلومة (ساعات)' : 'Information Latency (Hours)'}
                  </span>
                  {selectedGap && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#0284C7] bg-[#0284C7]/10 px-2 py-0.5 rounded-md border border-[#0284C7]/20 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse"></span>
                      <span className="truncate">{selectedGap.sourceApp}</span>
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
                  <AreaChart data={knowledgeFrictionData} margin={{ top: 6, right: 10, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gapSplineBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gapSplineAi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity={0.7} />
                        <stop offset="60%" stopColor="#FFB800" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }} tickFormatter={(v) => `${v}h`} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-[#0A1931] text-white p-2 rounded-xl shadow-xl border border-slate-700 text-[10px]">
                              <div className="font-bold text-[#FFB800] pb-0.5 border-b border-white/10">{d.name}</div>
                              <div className="pt-1 space-y-0.5 font-mono">
                                <div className="text-slate-300">الوضع الحالي: {d.currentHours}h</div>
                                <div className="text-cyan-300 font-bold">المتوقع (AI): {d.expectedHours}h (-{Math.round(((d.currentHours - d.expectedHours) / d.currentHours) * 100)}%)</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="currentHours" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" fill="url(#gapSplineBaseline)" name="Current" />
                    <Area type="monotone" dataKey="expectedHours" stroke="#0284C7" strokeWidth={3} fill="url(#gapSplineAi)" name="Expected" dot={{ r: 4, fill: '#FFB800', strokeWidth: 2, stroke: '#0A1931' }} activeDot={{ r: 7, fill: '#FFB800', stroke: '#0A1931', strokeWidth: 3 }} />
                  </AreaChart>
                ) : (
                  <BarChart 
                    data={knowledgeFrictionData} 
                    margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload.length) {
                        const code = e.activePayload[0].payload.code;
                        const match = gaps.find(g => g.sourceApp.toLowerCase().includes(code) || g.id.includes(code));
                        if (match) setSelectedGap(match);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'monospace' }} tickFormatter={(v) => `${v}h`} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(11, 25, 49, 0.04)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-[#0A1931] text-white p-2 rounded-xl shadow-xl border border-slate-700 text-[10px]">
                              <div className="font-bold text-[#FFB800] pb-0.5 border-b border-white/10">{d.name}</div>
                              <div className="pt-1 space-y-0.5 font-mono">
                                <div className="text-slate-300">الوضع الحالي: {d.currentHours}h</div>
                                <div className="text-cyan-300 font-bold">المتوقع (AI): {d.expectedHours}h</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="currentHours" name="Current" radius={[4, 4, 4, 4]} barSize={12}>
                      {knowledgeFrictionData.map((entry, index) => {
                        const isSelected = selectedGap?.sourceApp.toLowerCase().includes(entry.code) || selectedGap?.id.includes(entry.code);
                        return (
                          <Cell 
                            key={`b-${index}`} 
                            fill={isSelected ? '#94A3B8' : '#CBD5E1'} 
                            opacity={isSelected ? 0.9 : 0.35} 
                          />
                        );
                      })}
                    </Bar>
                    <Bar dataKey="expectedHours" name="Expected" radius={[6, 6, 6, 6]} barSize={14}>
                      {knowledgeFrictionData.map((entry, index) => {
                        const isSelected = selectedGap?.sourceApp.toLowerCase().includes(entry.code) || selectedGap?.id.includes(entry.code);
                        return (
                          <Cell 
                            key={`e-${index}`} 
                            fill={isSelected ? '#FFB800' : '#0284C7'} 
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

          {/* Bottom Panel: Live AI Matcher */}
          <div className="flex-1 min-h-0 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
            <div className="shrink-0 flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-xs font-bold text-[#0A1931] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{isAr ? 'مُطابق المعرفة والاستفسارات الفوري' : 'Live AI Knowledge Matcher'}</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 py-1.5 shrink-0">
              {PRESET_QUERIES.map((preset, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPreset(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activePresetIndex === idx
                      ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAr ? preset.labelAr : preset.labelEn}
                </motion.button>
              ))}
            </div>

            {/* Matcher Result Box */}
            <div className="flex-1 min-h-0 overflow-y-auto p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs">
              <div className="flex items-start gap-1 text-[11px]">
                <span className="font-bold text-[#0A1931] shrink-0">{isAr ? 'المعرفة الموثقة:' : 'Authoritative:'}</span>
                <span className="text-slate-700 font-medium truncate">{initiativeResult.similarDone}</span>
              </div>
              <div className="flex items-start gap-1 text-[11px]">
                <span className="font-bold text-[#0A1931] shrink-0">{isAr ? 'الخبير:' : 'SME:'}</span>
                <span className="text-emerald-700 font-bold">{initiativeResult.expert}</span>
              </div>
              <div className="flex items-start gap-1 text-[11px]">
                <span className="font-bold text-[#0A1931] shrink-0">{isAr ? 'سبب القرار:' : 'Rationale:'}</span>
                <span className="text-slate-600 truncate">{initiativeResult.decisionReason}</span>
              </div>
              <div className="flex items-start gap-1 text-[11px] pt-1 border-t border-slate-200">
                <span className="font-bold text-[#0284C7] shrink-0">{isAr ? 'الوثيقة:' : 'SOP:'}</span>
                <span className="text-slate-800 font-mono text-[10px] bg-white px-1.5 py-0.2 rounded border border-slate-200">{initiativeResult.processDoc}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (6 Cols): Gaps Directory & Squad Assignment */}
        <div className="lg:col-span-6 flex flex-col h-auto lg:h-full min-h-[360px] lg:min-h-0 bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm overflow-hidden">
          
          <div className="shrink-0 flex items-center justify-between pb-1.5 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0A1931]">
                {isAr ? 'فجوات المعرفة المكتشفة وإسناد المقالات للفرق' : 'Detected Gaps & Squad Assignment'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-100 text-cyan-800">
                {resolvedCount}/{gaps.length} {isAr ? 'تم الإنشاء' : 'Created'}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[10px]">
              <button
                onClick={() => setSourceFilter('all')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  sourceFilter === 'all' ? 'bg-[#0A1931] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setSourceFilter('confluence')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  sourceFilter === 'confluence' ? 'bg-[#0284C7] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Confluence
              </button>
              <button
                onClick={() => setSourceFilter('jira')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  sourceFilter === 'jira' ? 'bg-sky-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Jira
              </button>
              <button
                onClick={() => setSourceFilter('sharepoint')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  sourceFilter === 'sharepoint' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                SharePoint
              </button>
            </div>
          </div>

          {/* Gaps List with Squad Assignment & Article Creation Action */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 pt-1.5">
            {filteredGaps.map((gap) => {
              const isSelected = selectedGap?.id === gap.id;
              const isResolved = gap.status === 'Resolved';

              return (
                <motion.div
                  key={gap.id}
                  onClick={() => setSelectedGap(gap)}
                  whileHover={{ scale: 1.005 }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#FFB800] bg-sky-50/70 ring-2 ring-[#FFB800] shadow-md'
                      : 'border-slate-100 bg-slate-50/80 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  {/* Top Bar: Source, Squad Badge & Status */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {gap.sourceApp}
                      </span>
                      
                      {/* Assigned Squad Badge */}
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#0A1931] text-white flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#FFB800]" />
                        <span>{isAr ? gap.teamAr : gap.teamEn}</span>
                      </span>

                      {isSelected && (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-[#0A1931] text-[#FFB800] shrink-0 font-sans flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-[#FFB800] animate-pulse"></span>
                          <span>{isAr ? 'محدد بالرسم' : 'Active'}</span>
                        </span>
                      )}
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isResolved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {isResolved ? (
                        <>
                          <CheckCheck className="w-3 h-3 text-emerald-600" />
                          <span>{isAr ? 'تم إنشاء المقال والتكليف' : 'Article Created & Assigned'}</span>
                        </>
                      ) : (
                        <span>{isAr ? 'فجوة معرفية مفتوحة' : 'Knowledge Gap Open'}</span>
                      )}
                    </span>
                  </div>

                  {/* Knowledge Gap Topic Title */}
                  <div className="text-xs font-bold text-[#0A1931] mb-1">
                    {isAr ? gap.topicAr : gap.topicEn}
                  </div>

                  {/* Proposed / Created Confluence Article & Assigned SME */}
                  <div className="p-2 rounded-lg bg-white border border-slate-200/90 shadow-xs space-y-1 mb-2">
                    <div className="flex items-start gap-1.5 text-[10.5px]">
                      <FileText className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 block truncate">
                          {isAr ? gap.createdArticleTitleAr : gap.createdArticleTitleEn}
                        </span>
                        <span className="text-[9.5px] text-slate-500 block truncate">
                          {isAr ? 'المساحة:' : 'Space:'} {gap.createdArticleSpace}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <span className="font-bold text-slate-700">{isAr ? 'المسؤول:' : 'Assignee:'}</span>
                        <span className="text-emerald-700 font-semibold">{isAr ? gap.expertNameAr : gap.expertNameEn}</span>
                      </span>
                      <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                        Jira #{gap.assignedJiraTaskKey}
                      </span>
                    </div>
                  </div>

                  {/* Lower Action Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 gap-2">
                    {/* View Article Preview Button if already resolved */}
                    {isResolved ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewArticleGap(gap);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-50 text-[#0284C7] border border-cyan-300 hover:bg-cyan-100 flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{isAr ? 'معاينة المقال في Confluence' : 'Preview Confluence Article'}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#FFB800]" />
                        <span>{isAr ? gap.impactAr : gap.impactEn}</span>
                      </span>
                    )}

                    {/* The Primary Action Button: Creates Article in Confluence & Dispatches to Squad */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateSopAndAssign(gap.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm ${
                        isResolved
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0A1931] hover:from-[#0369A1] hover:to-[#0284C7] text-white'
                      }`}
                    >
                      {isResolved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>{isAr ? 'تم الإنشاء والتكليف (إلغاء)' : 'Created & Dispatched (Reset)'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-[#FFB800]" />
                          <span>{isAr ? 'إنشاء المقال وتكليف الفريق' : 'Create Article & Assign Squad'}</span>
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

      {/* INTERACTIVE CONFLUENCE ARTICLE & JIRA TASK DISPATCH PREVIEW MODAL */}
      <AnimatePresence>
        {previewArticleGap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
            onClick={() => setPreviewArticleGap(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden font-sans"
            >
              {/* Modal Header: Confluence Branding & Close */}
              <div className="shrink-0 px-4 py-3 bg-[#0A1931] text-white flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#0284C7] text-white">
                    <BookOpen className="w-4 h-4 text-[#FFB800]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#FFB800]">Confluence Enterprise Wiki</span>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {isAr ? 'تم النشر بنجاح' : 'Live & Published'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono">
                      {previewArticleGap.createdArticleSpace}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewArticleGap(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Article Content Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-slate-800 bg-slate-50/50">
                
                {/* Article Title */}
                <div className="pb-3 border-b border-slate-200">
                  <h2 className="text-base sm:text-xl font-bold text-[#0A1931] font-serif leading-tight">
                    {isAr ? previewArticleGap.createdArticleTitleAr : previewArticleGap.createdArticleTitleEn}
                  </h2>
                  
                  {/* Meta Bar */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{isAr ? 'الفريق المكلف:' : 'Assigned Squad:'}</span>
                      <strong className="text-[#0A1931]">{isAr ? previewArticleGap.teamAr : previewArticleGap.teamEn}</strong>
                    </span>

                    <span>•</span>

                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? 'الخبير المسند إليه:' : 'Lead SME:'}</span>
                      <strong className="text-[#0A1931]">{isAr ? previewArticleGap.expertNameAr : previewArticleGap.expertNameEn}</strong>
                    </span>

                    <span>•</span>

                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                      Jira #{previewArticleGap.assignedJiraTaskKey}
                    </span>
                  </div>
                </div>

                {/* Section 1: Executive Summary & Objective */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                  <h3 className="text-xs font-bold text-[#0284C7] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>{isAr ? '1. الغرض والمعايير التشغيلية (SLA)' : '1. Purpose & Service Level Agreement (SLA)'}</span>
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {isAr ? previewArticleGap.articleContentSnippetAr : previewArticleGap.articleContentSnippetEn}
                  </p>
                </div>

                {/* Section 2: Step-by-Step SOP Architecture */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <h3 className="text-xs font-bold text-[#0A1931] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>{isAr ? '2. خطوات التنفيذ والربط الفني المعتمد' : '2. Standard Operating Procedures & Runbook Steps'}</span>
                  </h3>
                  
                  <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                    <li>{isAr ? 'التحقق التلقائي من مفاتيح الأمان والشهادات الرقمية قبل إعادة محاولة الطلب.' : 'Automated TLS verification & token lifecycle handshake prior to retry execution.'}</li>
                    <li>{isAr ? 'تطبيق معيار الـ Idempotency لمنع تكرار القيود المحاسبية أو الخصم المزدوج.' : 'Idempotent request keys enforced to prevent duplicate financial deductions.'}</li>
                    <li>{isAr ? 'إعادة التوجيه إلى مسار الطوارئ في حال تجاوز زمن الاستجابة 300ms.' : 'Circuit breaker fallback triggered if upstream gateway latency exceeds 300ms.'}</li>
                  </ul>
                </div>

                {/* Section 3: Dispatched Jira Task Status */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200 text-xs">
                  <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'حالة التكليف في Jira:' : 'Jira Workflow Status:'}</span>
                  </div>
                  <p className="text-slate-700">
                    {isAr
                      ? `تم إنشاء تذكرة Jira رقم #${previewArticleGap.assignedJiraTaskKey} وإدراجها في سبرنت التطوير الحالي لـ ${previewArticleGap.teamAr} لمراجعة وتحديث الكود وتضمين هذا التوثيق.`
                      : `Jira Task #${previewArticleGap.assignedJiraTaskKey} has been created and queued in the current sprint for ${previewArticleGap.teamEn} to maintain code compliance and documentation.`
                    }
                  </p>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="shrink-0 px-4 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-medium">
                  {isAr ? 'تم الإنشاء والتوزيع عبر وكيل الذكاء الاصطناعي لبنك بوبيان' : 'Generated & Synced via Boubyan Bank AI Agent'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewArticleGap(null)}
                    className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>

                  <button
                    onClick={() => setPreviewArticleGap(null)}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0A1931] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <span>{isAr ? 'فتح في Confluence' : 'Open in Confluence'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
