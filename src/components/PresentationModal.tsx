import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: DemoIdea[];
  lang: Language;
  onLaunchDemo: (id: string) => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  ideas,
  lang,
  onLaunchDemo
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide 0: Executive Overview; Slides 1..3: Idea 1, 2, 3; Slide 4: Strategic Roadmap Summary
  const totalSlides = 5;

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[720px] rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Top Presentation Bar with Boubyan Corporate Look */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#0A1931] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8B263E] border border-white/20 flex items-center justify-center">
              <Presentation className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {isAr ? 'عرض الإدارة التنفيذية — بنك بوبيان' : 'Boubyan Executive Strategic Presentation'}
              </div>
              <div className="text-xs text-slate-300 font-mono">
                {isAr ? `شريحة ${currentSlide + 1} من ${totalSlides}` : `Slide ${currentSlide + 1} of ${totalSlides}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Area */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto flex flex-col justify-center bg-[#F8FAFC]">
          
          {/* SLIDE 0: EXECUTIVE SUMMARY */}
          {currentSlide === 0 && (
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#8B263E]/10 text-[#8B263E] border border-[#8B263E]/20">
                {isAr ? 'الملخص الاستراتيجي التنفيذي' : 'Executive Strategic Overview'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1931] leading-tight">
                {isAr ? (
                  <>تسريع وتيرة الإنجاز <span className="text-[#8B263E]">وتقليص الهدر التشغيلي</span></>
                ) : (
                  <>Accelerating Delivery <span className="text-[#8B263E]">Velocity</span> & Operational Resilience</>
                )}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {isAr
                  ? 'رؤية رقمية تنفيذية لبنك بوبيان تتضمن ٣ مبادرات استراتيجية قائمة على الذكاء الاصطناعي، تضمن تقليص وقت الاجتماعات، وتحويل المعرفة الفردية لأصول مؤسسية، وحماية سرعة إطلاق المنتجات الرقمية.'
                  : 'A targeted strategic framework for Boubyan Bank covering 3 high-impact AI initiatives: Meeting Detox, Knowledge Gap Resolution, and Proactive Early Warning Systems.'}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl sm:text-2xl font-black text-[#8B263E] font-mono">1,840+ hrs</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">{isAr ? 'وفر سنوي في الوقت' : 'Annual Time Saved'}</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">3.4x</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">{isAr ? 'تسريع وتيرة القرار' : 'Decision Velocity'}</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl sm:text-2xl font-black text-[#0A1931] font-mono">2-3 {isAr ? 'أسابيع' : 'Weeks'}</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">{isAr ? 'سرعة الإطلاق' : 'Time-to-Value'}</div>
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
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between">
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
