import React, { useState } from 'react';
import { useDeviceMode } from '../context/DeviceModeContext';
import { Laptop, Smartphone, Tablet, Monitor, Sparkles, Check, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DeviceModeSwitcherProps {
  lang: Language;
  compact?: boolean;
}

export const DeviceModeSwitcher: React.FC<DeviceModeSwitcherProps> = ({ lang, compact = false }) => {
  const { modeSetting, effectiveMode, detectedOS, setModeSetting, isTouch, screenWidth } = useDeviceMode();
  const [isOpen, setIsOpen] = useState(false);
  const isAr = lang === 'ar';

  const getDeviceIcon = () => {
    if (effectiveMode === 'mobile') {
      return <Smartphone className="w-3.5 h-3.5 text-[#0284C7]" />;
    }
    return <Laptop className="w-3.5 h-3.5 text-[#8B263E]" />;
  };

  const getModeLabel = () => {
    if (modeSetting === 'auto') {
      return effectiveMode === 'pc' 
        ? (isAr ? 'كمبيوتر (تلقائي)' : 'PC (Auto)') 
        : (isAr ? 'موبايل (تلقائي)' : 'Mobile (Auto)');
    }
    if (modeSetting === 'pc') return isAr ? 'كمبيوتر (مُثبّت)' : 'PC Mode';
    return isAr ? 'موبايل (مُثبّت)' : 'Mobile Mode';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 shadow-2xs ${
          modeSetting === 'auto'
            ? 'bg-slate-100/95 hover:bg-slate-200 text-slate-800 border-slate-300/80'
            : 'bg-[#0A1931] text-white border-slate-700 hover:bg-[#14284b]'
        }`}
        title={isAr ? 'التبديل بين وضع الكمبيوتر والموبايل' : 'Device Mode Switcher'}
      >
        {getDeviceIcon()}
        {!compact && (
          <span className="hidden sm:inline text-[11px] font-mono tracking-tight font-bold">
            {getModeLabel()}
          </span>
        )}
        <ChevronDown className="w-3 h-3 text-slate-400 opacity-70" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click closer */}
            <div 
              className="fixed inset-0 z-50" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`absolute top-full mt-1.5 z-50 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 text-slate-800 font-sans ${
                isAr ? 'left-0' : 'right-0'
              }`}
            >
              <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-600 block tracking-wider">
                  {isAr ? 'كشف المنصة والجهاز' : 'Platform & Device Engine'}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold">{detectedOS}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-mono text-[10px] text-slate-500">{screenWidth}px</span>
                </div>
              </div>

              <div className="space-y-1">
                {/* AUTO MODE */}
                <button
                  onClick={() => {
                    setModeSetting('auto');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-start cursor-pointer ${
                    modeSetting === 'auto'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <div>
                      <div className="font-bold">{isAr ? 'كشف تلقائي (مستحسن)' : 'Automatic Detection'}</div>
                      <div className="text-[9.5px] text-slate-600 font-normal">
                        {isAr ? `الحالي: ${effectiveMode === 'pc' ? 'شاشة كمبيوتر' : 'شاشة موبايل'}` : `Active: ${effectiveMode.toUpperCase()}`}
                      </div>
                    </div>
                  </div>
                  {modeSetting === 'auto' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>

                {/* PC MODE */}
                <button
                  onClick={() => {
                    setModeSetting('pc');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-start cursor-pointer ${
                    modeSetting === 'pc'
                      ? 'bg-[#8B263E]/10 text-[#8B263E] border border-[#8B263E]/30'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5 text-[#8B263E]" />
                    <div>
                      <div className="font-bold">{isAr ? 'وضع الكمبيوتر (PC)' : 'Force PC Mode'}</div>
                      <div className="text-[9.5px] text-slate-600 font-normal">
                        {isAr ? 'لوحة تحكم شاشة واحدة عريضة' : 'Single-screen widescreen'}
                      </div>
                    </div>
                  </div>
                  {modeSetting === 'pc' && <Check className="w-3.5 h-3.5 text-[#8B263E]" />}
                </button>

                {/* MOBILE MODE */}
                <button
                  onClick={() => {
                    setModeSetting('mobile');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-start cursor-pointer ${
                    modeSetting === 'mobile'
                      ? 'bg-sky-50 text-sky-900 border border-sky-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-[#0284C7]" />
                    <div>
                      <div className="font-bold">{isAr ? 'وضع الموبايل (Mobile)' : 'Force Mobile Mode'}</div>
                      <div className="text-[9.5px] text-slate-600 font-normal">
                        {isAr ? 'تمرير مرن وأزرار لمس كبيرة' : 'Fluid scroll & touch dock'}
                      </div>
                    </div>
                  </div>
                  {modeSetting === 'mobile' && <Check className="w-3.5 h-3.5 text-[#0284C7]" />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
