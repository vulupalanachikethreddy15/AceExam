
import React from 'react';
import { AccessibilityConfig } from '../types';

interface ExamHeaderProps {
  timeLeft: number;
  config: AccessibilityConfig;
  onExit: () => void;
  isMCQ?: boolean;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ timeLeft, config, onExit, isMCQ }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className={`w-full py-4 px-6 border-b flex items-center justify-between sticky top-0 z-10 transition-colors ${config.highContrast ? 'bg-black border-yellow-400 text-yellow-400' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-4">
        <h1 className={`font-bold tracking-tight ${config.largeText ? 'text-3xl' : 'text-xl'}`}>InclusiveExam</h1>
        {config.simplifiedUI && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-100 text-indigo-700'}`}>
            Simplified Mode
          </span>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-mono font-bold ${config.largeText ? 'text-3xl' : 'text-lg'} ${timeLeft < 300 ? 'text-red-500 animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          
          {config.extraTime && isMCQ && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border animate-pulse ${
              config.highContrast 
                ? 'bg-yellow-400 text-black border-black font-bold' 
                : 'bg-green-50 text-green-700 border-green-200 text-sm font-medium'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Extra Time Active (MCQ)</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={onExit}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            config.highContrast 
              ? 'border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black' 
              : 'text-slate-600 hover:bg-slate-100'
          } ${config.largeButtons ? 'text-xl px-8 py-4' : ''}`}
        >
          Exit Exam
        </button>
      </div>
    </header>
  );
};
