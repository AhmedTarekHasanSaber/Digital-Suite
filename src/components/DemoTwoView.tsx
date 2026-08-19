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
        return {
          hoursWeekly: 9.4,
          annualKwd: 18200,
          latency: '-92%',
          impactEn: 'Eliminated 14 recurring SME interruptions regarding facial liveness matching.',
          impactAr: 'إلغاء 14 مقاطعة أسبوعية متكررة للخبراء بخصوص مطابقة البصمة الحيوية.'
        };
      case 'gap-2':
        return {
          hoursWeekly: 6.8,
          annualKwd: 14500,
          latency: '-84%',
          impactEn: 'Published unified Kafka replay SOP, cutting dev debugging friction across 3 squads.',
          impactAr: 'نشر دليل إعادة تشغيل رسائل Kafka، مما قلص زمن التحقق من الأخطاء عبر 3 فرق.'
        };
      case 'gap-3':
        return {
          hoursWeekly: 13.5,
          annualKwd: 27800,
          latency: '-95%',
          impactEn: 'Automated CBK data retention guidelines, saving 2 full days per quarterly audit cycle.',
          impactAr: 'أتمتة إرشادات البنك المركزي لحفظ البيانات، مما وفر يومي عمل في كل تدقيق ربع سنوي.'
        };
      case 'gap-4':
        return {
          hoursWeekly: 5.2,
          annualKwd: 9800,
          latency: '-80%',
          impactEn: 'Synchronized cross-border settlement retry specs into shared API catalog.',
          impactAr: 'توحيد مواصفات إعادة محاولة التحويلات الدولية في دليل الـ API المشترك.'
        };
      default:
        return {
          hoursWeekly: 7.5,
          annualKwd: 13500,
          latency: '-86%',
          impactEn: 'Generated authoritative engineering runbook from historical incident patterns.',
          impactAr: 'توليد دليل تشغيلي معتمد مستند إلى سجلات الحوادث التاريخية.'
        };
    }
  };

  const handleGenerateSop = (gapId: string) => {
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

    setSelectedGap(prev => prev?.id === gapId ? { ...prev, status: 'Resolved' } : prev);

    setLastExecutedValue({
      topic: isAr ? (targetGap?.topicAr || '') : (targetGap?.topicEn || ''),
      source: targetGap?.sourceApp || 'Confluence',
      expert: isAr ? (targetGap?.expertNameAr || '') : (targetGap?.expertNameEn || ''),
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
      expectedHours: gaps.find(g => g.id === 'gap-1')?.status === 'Resolved' ? 0.2 : 3.8, 
      name: isAr ? 'كونفلوينس' : 'Confluence', 
      code: 'confluence' 
    },
    { 
      source: 'Jira', 
      currentHours: 5.2, 
      expectedHours: gaps.find(g => g.id === 'gap-2')?.status === 'Resolved' ? 0.3 : 5.2, 
      name: isAr ? 'جيرا' : 'Jira', 
      code: 'jira' 
    },
    { 
      source: 'SharePoint', 
      currentHours: 4.6, 
      expectedHours: gaps.find(g => g.id === 'gap-3')?.status === 'Resolved' ? 0.2 : 4.6, 
      name: isAr ? 'شيربوينت' : 'SharePoint', 
      code: 'sharepoint' 
    },
    { 
      source: 'Teams', 
      currentHours: 6.4, 
      expectedHours: gaps.find(g => g.id === 'gap-4')?.status === 'Resolved' ? 0.3 : 6.4, 
      name: isAr ? 'تيمز' : 'Teams', 
      code: 'teams' 
    }
  ], [isAr, gaps]);

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full gap-2 font-sans overflow-hidden">
      
      {/* TOP EXECUTIVE CIO BAR: CLEAR STRATEGIC OBJECTIVE & 3 KEY PILLARS */}
      <div className="shrink-0 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#0A1931] via-[#0E2A4A] to-[#0A1931] text-white border border-slate-700/80 shadow-md flex flex-col xl:flex-row items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-[#0284C7]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Title & Clear Strategic Objective */}
        <div className="flex items-center gap-3 relative z-10 w-full xl:w-auto">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shrink-0 shadow-sm border border-white/10">
            <Sparkles className="w-4 h-4 text-[#FFB800]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#0284C7] text-white text-[9px] font-black uppercase tracking-wider">
                {isAr ? 'المبادرة #02' : 'Initiative #02'}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {isAr ? 'مكتشف فجوات المعرفة وقمرة السياق الهندسي' : 'AI Knowledge Gap Detector & Context Cockpit'}
              </h2>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5 font-medium">
              <span className="text-[#FFB800] font-bold">★ {isAr ? 'الهدف المباشر:' : 'Direct Objective:'}</span>
              <span>{isAr ? 'القضاء على صوامع المعرفة وتقليص وقت البحث عن التوثيق من ساعات إلى ثوانٍ معدودة.' : 'Eliminate knowledge silos & slash doc search latency from hours to seconds.'}</span>
            </p>
          </div>
        </div>

        {/* 3 Core Executive Figures (Current -> Expected -> Net Saved ROI) */}
        <div className="flex items-center gap-2 font-mono text-xs relative z-10 w-full xl:w-auto justify-end">
          
          {/* Current State */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center min-w-[110px]">
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 font-sans block mb-0.5">
              {isAr ? 'الوضع الحالي' : 'CURRENT'}
            </span>
            <div className="text-xs font-black text-white">
              5.2 <span className="text-[9px] text-slate-400 font-sans">hrs/query</span>
            </div>
          </div>

          <div className="text-[#FFB800] font-bold px-0.5">➔</div>

          {/* Expected State */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-600 text-center min-w-[125px]">
            <span className="text-[8px] font-bold uppercase tracking-wider text-cyan-400 font-sans block mb-0.5">
              {isAr ? 'المتوقع بعد AI' : 'EXPECTED'}
            </span>
            <div className="text-xs font-black text-cyan-300">
              0.3 <span className="text-[9px] font-sans">hrs (-94%)</span>
            </div>
          </div>

          {/* Net Realized ROI Gold Pillar */}
          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0284C7]/80 to-[#0A1931] border border-cyan-400/50 text-center min-w-[135px] shadow-sm">
            <span className="text-[8px] font-black uppercase tracking-wider text-[#FFB800] font-sans block mb-0.5">
              {isAr ? 'الوفر المالي السنوي' : 'NET SAVINGS ROI'}
            </span>
            <div className="text-xs font-black text-[#FFB800]">
              +{(totalCumulativeKwdSaved > 0 ? totalCumulativeKwdSaved : 69500).toLocaleString()} <span className="text-[9px] font-sans text-amber-200">KD/yr</span>
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
                    {isAr ? 'الأثر المحقق لهذه الوثيقة:' : 'Tailored Knowledge SOP Value:'}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[240px]">{lastExecutedValue.topic}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-500/30 font-mono">
                    {lastExecutedValue.source}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  <span className="text-cyan-300 font-bold">{isAr ? 'الخبير:' : 'SME:'} {lastExecutedValue.expert}</span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span>{isAr ? lastExecutedValue.strategicImpactAr : lastExecutedValue.strategicImpactEn}</span>
                </div>
              </div>
            </div>

            {/* Instant Value Metrics Badges */}
            <div className="flex items-center gap-2 font-mono shrink-0 w-full md:w-auto justify-end">
              <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-center">
                <span className="text-[9px] text-slate-300 block font-sans">{isAr ? 'وفر أسبوعي لكل مهندس' : 'Weekly Time Saved'}</span>
                <span className="font-black text-cyan-400 text-xs">+{lastExecutedValue.hoursSavedWeekly}h/wk</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-[#0284C7]/60 border border-cyan-400/40 text-center">
                <span className="text-[9px] text-slate-200 block font-sans">{isAr ? 'العائد المالي السنوي' : 'Annual ROI'}</span>
                <span className="font-black text-[#FFB800] text-xs">+{lastExecutedValue.annualKwdSaved.toLocaleString()} KWD</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-400/40 text-center hidden lg:block">
                <span className="text-[9px] text-emerald-300 block font-sans">{isAr ? 'سرعة الاستجابة' : 'Latency'}</span>
                <span className="font-black text-emerald-300 text-xs">{lastExecutedValue.latencyDrop}</span>
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
        
        {/* LEFT COLUMN (6 Cols): Chart + Instant AI Matcher */}
        <div className="lg:col-span-6 flex flex-col h-full gap-2 min-h-0 overflow-hidden">
          
          {/* Top Panel: Latency Chart */}
          <div className="shrink-0 p-3 rounded-2xl bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/90 shadow-sm flex flex-col justify-between h-[175px] relative overflow-hidden">
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
                      <span className="truncate">{selectedGap.source}</span>
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
                        const match = gaps.find(g => g.source.toLowerCase().includes(code) || g.id.includes(code));
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
                        const isSelected = selectedGap?.source.toLowerCase().includes(entry.code) || selectedGap?.id.includes(entry.code);
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
                        const isSelected = selectedGap?.source.toLowerCase().includes(entry.code) || selectedGap?.id.includes(entry.code);
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

        {/* RIGHT COLUMN (6 Cols): Gaps Directory */}
        <div className="lg:col-span-6 flex flex-col h-full min-h-0 bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm overflow-hidden">
          
          <div className="shrink-0 flex items-center justify-between pb-1.5 border-b border-slate-100 gap-2">
            <span className="text-xs font-bold text-[#0A1931]">
              {isAr ? 'فجوات المعرفة المكتشفة' : 'Detected Knowledge Gaps'}
            </span>

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
                onClick={() => setSourceFilter('teams')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  sourceFilter === 'teams' ? 'bg-[#9A1B38] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Teams
              </button>
            </div>
          </div>

          {/* Gaps List */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5 pt-1.5">
            {filteredGaps.map((gap) => {
              const isSelected = selectedGap?.id === gap.id;
              const isResolved = gap.status === 'Resolved';

              return (
                <motion.div
                  key={gap.id}
                  onClick={() => setSelectedGap(gap)}
                  whileHover={{ scale: 1.005 }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#FFB800] bg-sky-50/70 ring-2 ring-[#FFB800] shadow-md'
                      : 'border-slate-100 bg-slate-50/80 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {gap.sourceApp}
                      </span>
                      {isSelected && (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-[#0A1931] text-[#FFB800] shrink-0 font-sans flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-[#FFB800] animate-pulse"></span>
                          <span>{isAr ? 'محدد بالرسم' : 'Active in Graph'}</span>
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isResolved ? (isAr ? 'حُلّت' : 'Resolved') : (isAr ? 'فجوة' : 'Open')}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      {isAr ? gap.expertNameAr : gap.expertNameEn}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#0A1931] mb-0.5 truncate">
                    {isAr ? gap.topicAr : gap.topicEn}
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-1 mb-1.5">
                    {isAr ? gap.impactAr : gap.impactEn}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
                    <span className="text-[10px] text-[#0284C7] font-bold flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{isAr ? 'وثيقة مقترحة: SOP' : 'Auto-SOP'}</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateSop(gap.id);
                      }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs ${
                        isResolved
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#0284C7] text-white shadow-xs'
                      }`}
                    >
                      {isResolved ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>{isAr ? 'مُعتمد (اضغط للإلغاء)' : 'Published (Reset)'}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-[#FFB800]" />
                          <span>{isAr ? 'نشر وتحديث الرسم' : 'Publish & Update'}</span>
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
