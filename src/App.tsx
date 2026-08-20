import React, { useState, useEffect } from 'react';
import { Language, DemoIdea } from './types';
import { INITIAL_DEMO_IDEAS } from './data/demosData';
import { ExecutiveHeader } from './components/ExecutiveHeader';
import { ThreeBigButtonsGrid } from './components/ThreeBigButtonsGrid';
import { DemoOneView } from './components/DemoOneView';
import { DemoTwoView } from './components/DemoTwoView';
import { DemoThreeView } from './components/DemoThreeView';
import { PresentationModal } from './components/PresentationModal';
import { CustomizeIdeasModal } from './components/CustomizeIdeasModal';
import { BoubyanOfficialLogo } from './components/BoubyanOfficialLogo';
import { APP_VERSION } from './version';
import { ExecutiveMetricsProvider } from './context/ExecutiveMetricsContext';

export default function App() {
  return (
    <ExecutiveMetricsProvider>
      <MainApp />
    </ExecutiveMetricsProvider>
  );
}

function MainApp() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('boubyan_initiatives_lang_v14') as Language) || 'en';
  });

  const [ideas, setIdeas] = useState<DemoIdea[]>(() => {
    const saved = localStorage.getItem('boubyan_initiatives_ideas_v15');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved ideas', e);
      }
    }
    return INITIAL_DEMO_IDEAS;
  });

  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('boubyan_initiatives_lang_v14', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleToggleLang = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleSaveIdeas = (updatedIdeas: DemoIdea[]) => {
    setIdeas(updatedIdeas);
    localStorage.setItem('boubyan_initiatives_ideas_v15', JSON.stringify(updatedIdeas));
  };

  const isAr = lang === 'ar';
  const activeIdea = ideas.find(i => i.id === activeDemoId);
  const activeIdeaTitle = activeIdea ? (lang === 'ar' ? activeIdea.titleAr : activeIdea.titleEn) : undefined;

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden bg-[#F4F7FA] text-slate-900 flex flex-col font-sans selection:bg-[#FFB800] selection:text-[#0A1931]">
      
      {/* Top Executive Header (Compact Fixed Bar) */}
      <ExecutiveHeader
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        activeDemoId={activeDemoId}
        onBackToHome={() => setActiveDemoId(null)}
        activeDemoTitle={activeIdeaTitle}
      />

      {/* Main Content Area - Responsive Scroll on Mobile, Single Screen on Desktop */}
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 flex flex-col overflow-y-auto lg:overflow-hidden">
        
        {/* Mobile Fast-Switcher Bar when inside a Tool (Visible on mobile/tablet screens < lg) */}
        {activeDemoId !== null && (
          <div className="lg:hidden shrink-0 mb-2 p-1 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto text-[11px] font-bold">
            <button
              onClick={() => setActiveDemoId('idea-3')}
              className={`px-2.5 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDemoId === 'idea-3'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"></span>
              <span>{isAr ? '01. رادار الإنذار' : '01. Early Shield'}</span>
            </button>
            <button
              onClick={() => setActiveDemoId('idea-2')}
              className={`px-2.5 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDemoId === 'idea-2'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
              <span>{isAr ? '02. المعرفة SOPs' : '02. Knowledge'}</span>
            </button>
            <button
              onClick={() => setActiveDemoId('idea-1')}
              className={`px-2.5 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDemoId === 'idea-1'
                  ? 'bg-[#9A1B38] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
              <span>{isAr ? '03. الاجتماعات' : '03. Meetings'}</span>
            </button>
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="px-2.5 py-1.5 rounded-lg shrink-0 bg-amber-50 text-amber-900 border border-amber-200 transition-all cursor-pointer flex items-center gap-1 hover:bg-amber-100"
            >
              <span>{isAr ? '📊 العرض' : '📊 Deck'}</span>
            </button>
          </div>
        )}

        {/* VIEW 1: HOME PAGE WITH 3 BIG BUTTONS */}
        {activeDemoId === null && (
          <ThreeBigButtonsGrid
            ideas={ideas}
            lang={lang}
            onSelectDemo={(id) => setActiveDemoId(id)}
            onOpenPresentation={() => setIsPresentationOpen(true)}
            onOpenCustomize={() => setIsCustomizeOpen(true)}
          />
        )}

        {/* VIEW 2: DEMO #01 */}
        {activeDemoId === 'idea-1' && activeIdea && (
          <DemoOneView idea={activeIdea} lang={lang} />
        )}

        {/* VIEW 3: DEMO #02 */}
        {activeDemoId === 'idea-2' && activeIdea && (
          <DemoTwoView idea={activeIdea} lang={lang} />
        )}

        {/* VIEW 4: DEMO #03 */}
        {activeDemoId === 'idea-3' && activeIdea && (
          <DemoThreeView idea={activeIdea} lang={lang} />
        )}

      </main>

      {/* Executive Slim Footer */}
      <footer className="shrink-0 border-t border-slate-200 bg-[#0A1931] text-white py-2 text-[10px] uppercase tracking-[0.15em] font-sans">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BoubyanOfficialLogo className="h-4.5 w-auto" textColor="#FFFFFF" />
            <span className="font-semibold text-[#FFB800] hidden sm:inline">
              {isAr ? 'بنك بوبيان — Digital Suite' : 'Boubyan Bank — Digital Suite'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{isAr ? 'المحرك نشط' : 'Live Engine Active'}</span>
            </span>
            <span className="hidden md:inline text-slate-400">
              {isAr ? 'شاشة موحدة تفاعلية' : 'Single-Screen Viewport'}
            </span>
            <span className="font-mono font-bold text-[#FFB800] bg-white/10 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#FFB800]"></span>
              <span>Digital Suite {APP_VERSION}</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Presentation Deck Modal */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        ideas={ideas}
        lang={lang}
        onLaunchDemo={(id) => {
          setActiveDemoId(id);
          setIsPresentationOpen(false);
        }}
      />

      {/* Customize 3 Ideas Modal */}
      <CustomizeIdeasModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        ideas={ideas}
        onSaveIdeas={handleSaveIdeas}
        lang={lang}
      />

    </div>
  );
}
