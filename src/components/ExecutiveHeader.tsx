import React from 'react';
import { Language } from '../types';
import { Globe, Presentation, ArrowRight, ArrowLeft } from 'lucide-react';
import { BoubyanOfficialLogo } from './BoubyanOfficialLogo';
import { AppEmblemIcon } from './AppEmblemIcons';
import { DeviceModeSwitcher } from './DeviceModeSwitcher';

interface ExecutiveHeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenPresentation: () => void;
  onOpenCustomize?: () => void;
  activeDemoId: string | null;
  onBackToHome: () => void;
  activeDemoTitle?: string;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  lang,
  onToggleLang,
  onOpenPresentation,
  activeDemoId,
  onBackToHome,
  activeDemoTitle
}) => {
  const isAr = lang === 'ar';

  const getEmblemType = (demoId: string) => {
    if (demoId === 'idea-3') return 'early-warning' as const;
    if (demoId === 'idea-2') return 'knowledge-intelligence' as const;
    return 'meeting-detox' as const;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Boubyan Official Logo Mark & Status */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
          {activeDemoId ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all group cursor-pointer border border-slate-200 active:scale-95 shrink-0 shadow-2xs"
              >
                {isAr ? <ArrowRight className="w-4 h-4 text-[#8B263E]" /> : <ArrowLeft className="w-4 h-4 text-[#8B263E]" />}
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>

              <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

              {/* Exact Bank Boubyan Official SVG Logo */}
              <div className="hidden sm:flex items-center cursor-pointer transition-transform hover:scale-102" onClick={onBackToHome}>
                <BoubyanOfficialLogo className="h-7 sm:h-8 w-auto" textColor="#0A1931" />
              </div>

              {/* Active Demo High-Def Icon Badge */}
              <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-3">
                <AppEmblemIcon type={getEmblemType(activeDemoId)} size="sm" />
                <span className="font-bold text-xs text-[#0A1931] truncate max-w-xs">{activeDemoTitle}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={onBackToHome}>
              {/* Exact Bank Boubyan Official SVG Logo */}
              <div className="flex items-center transition-transform group-hover:scale-102">
                <BoubyanOfficialLogo className="h-8 sm:h-9 w-auto" textColor="#0A1931" />
              </div>

              <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

              <div className="hidden sm:block">
                <span className="text-xs font-bold text-[#0A1931] tracking-tight block">
                  {isAr ? 'المبادرات الرقمية التنفيذية' : 'Executive Digital Suite'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{isAr ? 'مباشر وتفاعلي' : 'Live Interactive Portal'}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Functional Executive Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Automatic Platform & Device Mode Switcher */}
          <DeviceModeSwitcher lang={lang} />

          {/* Presentation Deck Modal Button */}
          <button
            onClick={onOpenPresentation}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B263E] to-[#721f33] hover:from-[#721f33] hover:to-[#5c1929] transition-all shadow-xs cursor-pointer active:scale-95"
            title={isAr ? 'عرض المبادرات' : 'Executive Deck'}
          >
            <Presentation className="w-3.5 h-3.5 text-[#FFB800]" />
            <span className="text-[11px] sm:text-xs tracking-wide">{isAr ? 'عرض المبادرات' : 'Executive Deck'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer active:scale-95"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#8B263E]" />
            <span className="text-[11px] sm:text-xs">{isAr ? 'English' : 'عربي'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};

