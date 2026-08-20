import React, { useState } from 'react';
import { DemoIdea, Language } from '../types';
import { X, Save, Edit3, RotateCcw, Check, Sparkles, Building2 } from 'lucide-react';
import { INITIAL_DEMO_IDEAS } from '../data/demosData';

interface CustomizeIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: DemoIdea[];
  onSaveIdeas: (updated: DemoIdea[]) => void;
  lang: Language;
}

export const CustomizeIdeasModal: React.FC<CustomizeIdeasModalProps> = ({
  isOpen,
  onClose,
  ideas,
  onSaveIdeas,
  lang
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [editableIdeas, setEditableIdeas] = useState<DemoIdea[]>(ideas);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFieldChange = (index: number, field: keyof DemoIdea, value: any) => {
    setEditableIdeas(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = () => {
    onSaveIdeas(editableIdeas);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetToDefaults = () => {
    setEditableIdeas(INITIAL_DEMO_IDEAS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#0A1931] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8B263E] border border-white/20 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'تخصيص المبادرات الرقمية — بنك بوبيان' : 'Customize Boubyan Strategic Initiatives'}
              </h3>
              <p className="text-xs text-slate-300">
                {isAr ? 'عدّل نصوص وعناوين وعائد كل فكرة لتناسب عرضك المباشر للإدارة التنفيذية' : 'Edit titles, descriptions, and metrics for your executive presentation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form Area */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 bg-[#F8FAFC]">
          {editableIdeas.map((idea, idx) => (
            <div key={idea.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#8B263E] text-white">
                  {isAr ? `المبادرة رقم 0${idea.number}` : `Initiative #0${idea.number}`}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {idea.id}</span>
              </div>

              {/* Title Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? 'عنوان الفكرة (عربي)' : 'Idea Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={idea.titleAr}
                    onChange={(e) => handleFieldChange(idx, 'titleAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#8B263E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? 'عنوان الفكرة (إنجليزي)' : 'Idea Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={idea.titleEn}
                    onChange={(e) => handleFieldChange(idx, 'titleEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#8B263E]"
                  />
                </div>
              </div>

              {/* Subtitle Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? 'الوصف الفرعي (عربي)' : 'Subtitle (Arabic)'}
                  </label>
                  <textarea
                    rows={2}
                    value={idea.subtitleAr}
                    onChange={(e) => handleFieldChange(idx, 'subtitleAr', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#8B263E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? 'الوصف الفرعي (إنجليزي)' : 'Subtitle (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={idea.subtitleEn}
                    onChange={(e) => handleFieldChange(idx, 'subtitleEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#8B263E]"
                  />
                </div>
              </div>

              {/* ROI & Timeline Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? 'تقدير العائد (ROI)' : 'ROI Estimate'}
                  </label>
                  <input
                    type="text"
                    value={isAr ? idea.roiEstimateAr : idea.roiEstimateEn}
                    onChange={(e) => handleFieldChange(idx, isAr ? 'roiEstimateAr' : 'roiEstimateEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#8B263E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isAr ? 'زمن الإطلاق المقدر' : 'Implementation Timeline'}
                  </label>
                  <input
                    type="text"
                    value={isAr ? idea.implementationTimeAr : idea.implementationTimeEn}
                    onChange={(e) => handleFieldChange(idx, isAr ? 'implementationTimeAr' : 'implementationTimeEn', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#8B263E]"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة للقيم الافتراضية' : 'Reset to Defaults'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-[#8B263E] hover:bg-[#721f33] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-[#FFB800]" /> : <Save className="w-4 h-4 text-[#FFB800]" />}
              <span>{savedSuccess ? (isAr ? 'تم الحفظ بنجاح!' : 'Saved!') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
