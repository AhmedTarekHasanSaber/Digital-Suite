import React from 'react';
import { DemoIdea, Language } from '../types';
import { 
  CalendarCheck,
  BrainCircuit,
  Radar,
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Building2,
  TrendingUp,
  Clock,
  Zap,
  ShieldCheck,
  Flame,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface ThreeBigButtonsGridProps {
  ideas: DemoIdea[];
  lang: Language;
  onSelectDemo: (ideaId: string) => void;
  onOpenPresentation: () => void;
  onOpenCustomize: () => void;
}

export const ThreeBigButtonsGrid: React.FC<ThreeBigButtonsGridProps> = ({
  ideas,
  lang,
  onSelectDemo
}) => {
  const isAr = lang === 'ar';

  const getThemeDetails = (idx: number) => {
    switch (idx) {
      case 0:
        return {
          accentText: 'text-[#9A1B38]',
          badgeText: 'text-[#9A1B38]',
          badgeBg: 'bg-rose-50 border-rose-200/80',
          gradientBg: 'from-[#9A1B38]/10 via-[#9A1B38]/5 to-transparent',
          glowHover: 'group-hover:border-[#9A1B38] group-hover:shadow-[0_12px_40px_-10px_rgba(154,27,56,0.25)]',
          btnBg: 'bg-gradient-to-r from-[#9A1B38] via-[#B32446] to-[#80142C] text-white shadow-rose-900/20',
          lineColor: 'from-[#9A1B38] to-[#FFB800]',
          iconBg: 'bg-gradient-to-br from-rose-50 to-rose-100/80 text-[#9A1B38] border-rose-200',
          liveStat: isAr ? 'تحرير 1,260 ساعة' : '1,260h Decoupled'
        };
      case 1:
        return {
          accentText: 'text-[#0284C7]',
          badgeText: 'text-[#0284C7]',
          badgeBg: 'bg-sky-50 border-sky-200/80',
          gradientBg: 'from-[#0284C7]/10 via-[#0284C7]/5 to-transparent',
          glowHover: 'group-hover:border-[#0284C7] group-hover:shadow-[0_12px_40px_-10px_rgba(2,132,199,0.25)]',
          btnBg: 'bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#0369A1] text-white shadow-sky-900/20',
          lineColor: 'from-[#0284C7] to-[#38BDF8]',
          iconBg: 'bg-gradient-to-br from-sky-50 to-sky-100/80 text-[#0284C7] border-sky-200',
          liveStat: isAr ? 'تقليص البحث 88%' : '88% Faster Search'
        };
      case 2:
      default:
        return {
          accentText: 'text-[#059669]',
          badgeText: 'text-[#059669]',
          badgeBg: 'bg-emerald-50 border-emerald-200/80',
          gradientBg: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
          glowHover: 'group-hover:border-emerald-500 group-hover:shadow-[0_12px_40px_-10px_rgba(5,150,105,0.25)]',
          btnBg: 'bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] text-white shadow-emerald-900/20',
          lineColor: 'from-[#059669] to-[#34D399]',
          iconBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/80 text-[#059669] border-emerald-200',
          liveStat: isAr ? 'تفادي 88% أعطال' : '88% Incidents Prevented'
        };
    }
  };

  const getIcon = (iconName: string, accentClass: string, idx: number) => {
    if (iconName === 'BrainCircuit' || idx === 1) {
      return <BrainCircuit className="h-6 w-6 sm:h-7 sm:w-7" />;
    }
    if (iconName === 'Radar' || idx === 2) {
      return <Radar className="h-6 w-6 sm:h-7 sm:w-7" />;
    }
    if (iconName === 'CalendarCheck' || idx === 0) {
      return <CalendarCheck className="h-6 w-6 sm:h-7 sm:w-7" />;
    }
    return <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />;
  };

  // Concise 1-sentence value props
  const getPunchyValue = (idx: number) => {
    if (idx === 0) {
      return isAr 
        ? 'تحويل الاجتماعات المتكررة لقرارات غير متزامنة وتحرير 1,260 ساعة هندسية سنوياً.'
        : 'Automate repetitive standups into async decisions, freeing 1,260+ engineering hours.';
    }
    if (idx === 1) {
      return isAr 
        ? 'توحيد المعرفة المؤسسية من Jira وConfluence لتقليص زمن الوصول للمعلومة بـ 88%.'
        : 'Unify siloed Jira & Confluence knowledge to slash information search time by 88%.';
    }
    return isAr 
      ? 'رادار استباقي يتنبأ بالاختناقات التقنية قبل 4.8 أيام من حدوثها لحماية وتيرة الإطلاق.'
      : 'Proactive AI radar forecasting delivery blockers 4.8 days ahead to safeguard velocity.';
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between h-full font-sans gap-2.5 max-w-7xl mx-auto w-full overflow-hidden">
      
      {/* Top Lively Header Bar */}
      <div className="shrink-0 flex items-center justify-between pb-2 border-b border-slate-200/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#9A1B38]/15 via-[#9A1B38]/5 to-transparent border border-[#9A1B38]/20 text-[#9A1B38] font-bold text-xs shadow-xs">
            <Building2 className="w-4 h-4" />
            <span>{isAr ? 'بنك بوبيان' : 'Boubyan Bank'}</span>
          </div>

          <h1 className="text-base sm:text-lg font-bold text-[#0A1931] tracking-tight font-serif flex items-center gap-2">
            <span>{isAr ? 'المبادرات الرقمية الثلاث للذكاء الاصطناعي' : 'Three Strategic AI Initiatives'}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>{isAr ? 'محاكي تفاعلي فوري' : 'Live Interactive Simulators'}</span>
            </span>
          </h1>
        </div>

        {/* Global Live Ticker Stats */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#FFB800]" />
            <div className="text-end">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{isAr ? 'الوفر الإجمالي' : 'Total ROI'}</span>
              <span className="text-xs font-black text-[#9A1B38] font-mono">$1.49M+</span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-xl bg-white border border-slate-200/80 shadow-xs hidden sm:flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <div className="text-end">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{isAr ? 'وتيرة الإنجاز' : 'Velocity'}</span>
              <span className="text-xs font-black text-emerald-600 font-mono">3.2x</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 INTERACTIVE, VIBRANT, ANIMATED INITIATIVE CARDS */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 overflow-hidden items-stretch">
        {ideas.map((idea, index) => {
          const theme = getThemeDetails(index);
          const numberLabel = isAr ? `مبادرة #0${idea.number}` : `Initiative #0${idea.number}`;
          const title = isAr ? idea.titleAr : idea.titleEn;
          const badge = isAr ? idea.badgeAr : idea.badgeEn;
          const roi = isAr ? idea.roiEstimateAr : idea.roiEstimateEn;
          const timeline = isAr ? idea.implementationTimeAr : idea.implementationTimeEn;
          const punchyValue = getPunchyValue(index);

          return (
            <motion.div
              key={idea.id}
              onClick={() => onSelectDemo(idea.id)}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`group flex flex-col justify-between bg-white border border-slate-200/90 ${theme.glowHover} rounded-2xl p-4 sm:p-4.5 text-start transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-xl cursor-pointer h-full`}
            >
              {/* Dynamic Animated Top Gradient Line */}
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.lineColor}`} />

              {/* Dynamic Gradient Ambient Backing */}
              <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradientBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              {/* UPPER SECTION */}
              <div className="space-y-2.5 relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2.5 rounded-xl border ${theme.iconBg} group-hover:scale-110 group-hover:rotate-1 transition-transform shadow-xs`}>
                    {getIcon(idea.icon, theme.accentText, index)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {numberLabel}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${theme.badgeBg} ${theme.badgeText}`}>
                      {badge}
                    </span>
                  </div>
                </div>

                {/* Title & Live Status Chip */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0A1931] group-hover:text-[#9A1B38] transition-colors font-serif leading-snug">
                      {title}
                    </h3>
                  </div>

                  {/* Live Impact Pill */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100/90 border border-slate-200/80 text-[11px] font-bold text-slate-700">
                    <Zap className="w-3 h-3 text-[#FFB800]" />
                    <span>{theme.liveStat}</span>
                  </div>
                </div>

                {/* Concise Punchy Business Value */}
                <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium group-hover:bg-white/80 transition-colors">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${theme.accentText}`} />
                    <span>{isAr ? 'القيمة التنفيذية للأعمال' : 'Executive Value'}</span>
                  </div>
                  <p className="line-clamp-2">
                    {punchyValue}
                  </p>
                </div>
              </div>

              {/* LOWER SECTION: SEPARATE LINES FOR PROJECT ROI & TIMELINE + LAUNCH BUTTON */}
              <div className="space-y-2 pt-2 border-t border-slate-100 relative z-10">
                
                {/* Metric Line 1: Project ROI (Separate Full Width Line) */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-white transition-colors flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-[#9A1B38]" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {isAr ? 'عائد المشروع (Project ROI)' : 'Project ROI'}
                    </span>
                  </div>
                  <span className="font-bold text-[#9A1B38] font-mono text-xs truncate text-end">
                    {index === 0 && (isAr ? '+18,000 ساعة/سنة (~540 ألف $)' : '+18,000h/yr (~$540K Saved)')}
                    {index === 1 && (isAr ? '+12,000 ساعة/سنة (~360 ألف $)' : '+12,000h/yr (~$360K Saved)')}
                    {index === 2 && (isAr ? 'تفادي 88% أعطال (~590 ألف $)' : '88% Outages Shielded (~$590K)')}
                  </span>
                </div>

                {/* Metric Line 2: Timeline (Separate Full Width Line Under ROI, No Sprints) */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-white transition-colors flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#0A1931]" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {isAr ? 'الجدول الزمني (Timeline)' : 'Timeline'}
                    </span>
                  </div>
                  <span className="font-bold text-[#0A1931] font-mono text-xs truncate text-end">
                    {index === 0 && (isAr ? '4 – 6 أسابيع (ربط التقويم و Jira)' : '4–6 Weeks (Calendar & Jira)')}
                    {index === 1 && (isAr ? '6 – 8 أسابيع (ربط Confluence و Teams)' : '6–8 Weeks (Confluence & Teams)')}
                    {index === 2 && (isAr ? '8 – 10 أسابيع (ربط مؤشرات ومراقبة الأنظمة)' : '8–10 Weeks (Telemetry & APM)')}
                  </span>
                </div>

                {/* Modern Vibrant CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDemo(idea.id);
                  }}
                  className={`w-full py-2.5 px-3.5 rounded-xl ${theme.btnBg} font-bold text-xs flex items-center justify-between shadow-md group-hover:shadow-lg transition-all cursor-pointer mt-1`}
                >
                  <span className="tracking-wide">{isAr ? 'إطلاق المحاكي التفاعلي' : 'Launch Live Simulator'}</span>
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-md text-[11px] font-semibold backdrop-blur-xs">
                    <span>{isAr ? 'تشغيل' : 'Run'}</span>
                    {isAr ? (
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
