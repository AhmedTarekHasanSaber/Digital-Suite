import React from 'react';
import { Language } from '../types';
import { Home, ShieldAlert, Sparkles, Rocket, Presentation, Globe, Smartphone, Laptop } from 'lucide-react';
import { useDeviceMode } from '../context/DeviceModeContext';
import { AppEmblemIcon } from './AppEmblemIcons';

interface MobileBottomDockProps {
  lang: Language;
  activeDemoId: string | null;
  onSelectDemo: (id: string | null) => void;
  onOpenPresentation: () => void;
  onToggleLang: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  lang,
  activeDemoId,
  onSelectDemo,
  onOpenPresentation,
  onToggleLang
}) => {
  const { effectiveMode, cycleMode } = useDeviceMode();
  const isAr = lang === 'ar';

  return (
    <div className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 font-sans">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1">
        
        {/* HOME */}
        <button
          onClick={() => onSelectDemo(null)}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer min-h-[44px] ${
            activeDemoId === null
              ? 'bg-[#0A1931] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Home className={`w-4 h-4 ${activeDemoId === null ? 'text-[#FFB800]' : 'text-slate-500'}`} />
          <span className="text-[9.5px] font-bold">{isAr ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* APP 3: EARLY WARNING */}
        <button
          onClick={() => onSelectDemo('idea-3')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer min-h-[44px] ${
            activeDemoId === 'idea-3'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className={`w-4 h-4 ${activeDemoId === 'idea-3' ? 'text-[#FFB800]' : 'text-emerald-600'}`} />
          <span className="text-[9.5px] font-bold truncate max-w-[55px]">{isAr ? 'الإنذار' : 'Warning'}</span>
        </button>

        {/* APP 2: KNOWLEDGE */}
        <button
          onClick={() => onSelectDemo('idea-2')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer min-h-[44px] ${
            activeDemoId === 'idea-2'
              ? 'bg-[#0284C7] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeDemoId === 'idea-2' ? 'text-[#FFB800]' : 'text-[#0284C7]'}`} />
          <span className="text-[9.5px] font-bold truncate max-w-[55px]">{isAr ? 'المعرفة' : 'Knowledge'}</span>
        </button>

        {/* APP 1: MEETINGS */}
        <button
          onClick={() => onSelectDemo('idea-1')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer min-h-[44px] ${
            activeDemoId === 'idea-1'
              ? 'bg-[#8B263E] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Rocket className={`w-4 h-4 ${activeDemoId === 'idea-1' ? 'text-[#FFB800]' : 'text-[#8B263E]'}`} />
          <span className="text-[9.5px] font-bold truncate max-w-[55px]">{isAr ? 'الاجتماع' : 'Detox'}</span>
        </button>

        {/* DECK */}
        <button
          onClick={onOpenPresentation}
          className="flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer min-h-[44px] bg-amber-500/10 text-amber-900 border border-amber-300/60 active:scale-95"
        >
          <Presentation className="w-4 h-4 text-amber-700" />
          <span className="text-[9.5px] font-bold">{isAr ? 'العرض' : 'Deck'}</span>
        </button>

        {/* LANG TOGGLE */}
        <button
          onClick={onToggleLang}
          className="py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-slate-700 hover:bg-slate-100 cursor-pointer min-h-[44px]"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-[#8B263E]" />
          <span className="text-[9px] font-bold">{isAr ? 'EN' : 'عربي'}</span>
        </button>

      </div>
    </div>
  );
};
