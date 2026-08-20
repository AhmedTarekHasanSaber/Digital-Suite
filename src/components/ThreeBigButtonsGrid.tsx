import React from 'react';
import { DemoIdea, Language } from '../types';
import { 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Clock, 
  Zap, 
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { LiveHeartbeatTelemetryBar } from './LiveHeartbeatTelemetryBar';
import { AppEmblemIcon } from './AppEmblemIcons';

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

  const getThemeDetails = (idea: DemoIdea) => {
    if (idea.id === 'idea-3' || idea.icon === 'Radar') {
      return {
        emblemType: 'early-warning' as const,
        accentText: 'text-[#059669]',
        badgeText: 'text-[#059669]',
        badgeBg: 'bg-emerald-50 border-emerald-200/80',
        gradientBg: 'from-emerald-500/8 via-emerald-500/3 to-transparent',
        glowHover: 'hover:border-emerald-500 hover:shadow-[0_16px_36px_-10px_rgba(5,150,105,0.22)]',
        btnBg: 'bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] hover:from-[#047857] hover:to-[#065F46] text-white shadow-emerald-900/20',
        lineColor: 'from-[#059669] via-[#34D399] to-[#059669]',
        liveStat: isAr ? 'تفادي 88% أعطال' : '88% Incidents Prevented',
        timelineText: isAr ? '8 – 10 أسابيع (ربط APM & Jira)' : '8–10 Weeks (APM & Jira)',
        telemetryFeed: isAr ? 'تحليل 14 إشارة Jira / دقيقة' : '14 Jira signals / min analyzing'
      };
    }
    if (idea.id === 'idea-2' || idea.icon === 'BrainCircuit') {
      return {
        emblemType: 'knowledge-intelligence' as const,
        accentText: 'text-[#0284C7]',
        badgeText: 'text-[#0284C7]',
        badgeBg: 'bg-sky-50 border-sky-200/80',
        gradientBg: 'from-[#0284C7]/8 via-[#0284C7]/3 to-transparent',
        glowHover: 'hover:border-[#0284C7] hover:shadow-[0_16px_36px_-10px_rgba(2,132,199,0.22)]',
        btnBg: 'bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white shadow-sky-900/20',
        lineColor: 'from-[#0284C7] via-[#38BDF8] to-[#0284C7]',
        liveStat: isAr ? 'تقليص البحث 88%' : '88% Faster Search',
        timelineText: isAr ? '6 – 8 أسابيع (Confluence & Teams)' : '6–8 Weeks (Confluence & Teams)',
        telemetryFeed: isAr ? 'فهرسة مستمرة لـ SOPs' : 'Live SOPs & Docs Indexing'
      };
    }
    // idea-1 default (Meeting Detox)
    return {
      emblemType: 'meeting-detox' as const,
      accentText: 'text-[#9A1B38]',
      badgeText: 'text-[#9A1B38]',
      badgeBg: 'bg-rose-50 border-rose-200/80',
      gradientBg: 'from-[#9A1B38]/8 via-[#9A1B38]/3 to-transparent',
      glowHover: 'hover:border-[#9A1B38] hover:shadow-[0_16px_36px_-10px_rgba(154,27,56,0.22)]',
      btnBg: 'bg-gradient-to-r from-[#9A1B38] via-[#B32446] to-[#80142C] hover:from-[#80142C] hover:to-[#670E22] text-white shadow-rose-900/20',
      lineColor: 'from-[#9A1B38] via-[#FFB800] to-[#9A1B38]',
      liveStat: isAr ? 'تحرير 1,260 ساعة' : '1,260h Decoupled',
      timelineText: isAr ? '4 – 6 أسابيع (Calendar & Jira)' : '4–6 Weeks (Calendar & Jira)',
      telemetryFeed: isAr ? 'توليد تلقائي لحزم القرارات' : 'Auto Decision-Ready Active'
    };
  };

  // Concise 1-sentence value props
  const getPunchyValue = (idea: DemoIdea) => {
    if (idea.id === 'idea-3') {
      return isAr 
        ? 'رادار استباقي يتنبأ بالاختناقات التقنية ومخاطر تسليم المشاريع قبل 4.8 أيام من حدوثها.'
        : 'Proactive AI radar forecasting delivery blockers 4.8 days ahead to safeguard release velocity.';
    }
    if (idea.id === 'idea-2') {
      return isAr 
        ? 'توحيد المعرفة المؤسسية من Jira وConfluence لتقليص زمن الوصول للمعلومة بـ 88%.'
        : 'Unify siloed Jira & Confluence knowledge to slash information search time by 88%.';
    }
    return isAr 
      ? 'تحويل الاجتماعات المتكررة لقرارات غير متزامنة وتحرير 1,260 ساعة هندسية سنوياً.'
      : 'Automate repetitive standups into async decisions, freeing 1,260+ engineering hours.';
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between h-auto lg:h-full font-sans gap-2 w-full overflow-y-auto lg:overflow-hidden">
      
      {/* REAL-TIME HEARTBEAT TELEMETRY INGESTION BANNER */}
      <LiveHeartbeatTelemetryBar lang={lang} />

      {/* 3 INTERACTIVE, ULTRA-PREMIUM INITIATIVE CARDS */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 overflow-y-auto lg:overflow-hidden items-stretch">
        {ideas.map((idea) => {
          const theme = getThemeDetails(idea);
          const title = isAr ? idea.titleAr : idea.titleEn;
          const badge = isAr ? idea.badgeAr : idea.badgeEn;
          const punchyValue = getPunchyValue(idea);

          return (
            <motion.div
              key={idea.id}
              onClick={() => onSelectDemo(idea.id)}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`group flex flex-col justify-between bg-white border border-slate-200/90 ${theme.glowHover} rounded-2xl p-4 sm:p-4.5 text-start transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-xl cursor-pointer h-full`}
            >
              {/* Dynamic Animated Top Gradient Line */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.lineColor}`} />

              {/* Dynamic Gradient Ambient Backing */}
              <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradientBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              {/* UPPER SECTION */}
              <div className="space-y-3 relative z-10">
                {/* Header Row: High-Definition Emblem Icon + Category Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="transition-transform duration-300 group-hover:scale-105">
                    <AppEmblemIcon type={theme.emblemType} size="md" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${theme.badgeBg} ${theme.badgeText} shadow-2xs`}>
                      {badge}
                    </span>
                  </div>
                </div>

                {/* Title & Live Status Chip */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#0A1931] group-hover:text-[#9A1B38] transition-colors font-serif leading-snug">
                      {title}
                    </h3>
                  </div>

                  {/* Live Impact Pill & Real-time micro heartbeat */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100/90 border border-slate-200/80 text-[10.5px] font-bold text-slate-700">
                      <Zap className="w-3 h-3 text-[#FFB800]" />
                      <span>{theme.liveStat}</span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-[10px] font-mono font-bold text-emerald-800">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span>{theme.telemetryFeed}</span>
                    </div>
                  </div>
                </div>

                {/* Concise Punchy Business Value */}
                <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium group-hover:bg-white/90 group-hover:border-slate-300 transition-colors shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${theme.accentText}`} />
                    <span>{isAr ? 'القيمة التنفيذية للأعمال' : 'Executive Value'}</span>
                  </div>
                  <p className="line-clamp-2 text-slate-600">
                    {punchyValue}
                  </p>
                </div>
              </div>

              {/* LOWER SECTION: TIMELINE + LAUNCH BUTTON */}
              <div className="space-y-2 pt-2.5 border-t border-slate-100 relative z-10">
                
                {/* Metric Line: Timeline */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-white transition-colors flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#0A1931]" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {isAr ? 'الجدول الزمني (Timeline)' : 'Timeline'}
                    </span>
                  </div>
                  <span className="font-bold text-[#0A1931] font-mono text-xs truncate text-end">
                    {theme.timelineText}
                  </span>
                </div>

                {/* Modern Vibrant CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDemo(idea.id);
                  }}
                  className={`w-full py-2.5 px-3.5 rounded-xl ${theme.btnBg} font-bold text-xs flex items-center justify-between shadow-sm group-hover:shadow-md transition-all cursor-pointer mt-1 active:scale-[0.98]`}
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


