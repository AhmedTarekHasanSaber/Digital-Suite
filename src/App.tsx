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

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('boubyan_initiatives_lang_v14') as Language) || 'en';
  });

  const [ideas, setIdeas] = useState<DemoIdea[]>(() => {
    const saved = localStorage.getItem('boubyan_initiatives_ideas_v14');
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
    localStorage.setItem('boubyan_initiatives_ideas_v14', JSON.stringify(updatedIdeas));
  };

  const isAr = lang === 'ar';
  const activeIdea = ideas.find(i => i.id === activeDemoId);
  const activeIdeaTitle = activeIdea ? (lang === 'ar' ? activeIdea.titleAr : activeIdea.titleEn) : undefined;

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F4F7FA] text-slate-900 flex flex-col font-sans selection:bg-[#FFB800] selection:text-[#0A1931]">
      
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

      {/* Main Content Area - Strictly Single Screen (No Page Scroll) */}
      <main className="flex-1 min-h-0 w-full max-w-[1600px] mx-auto px-3 sm:px-5 py-2.5 flex flex-col overflow-hidden">
        
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
      <footer className="shrink-0 border-t border-slate-200 bg-[#0A1931] text-white py-2 px-4 sm:px-6 text-[10px] uppercase tracking-[0.15em] font-sans">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
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
