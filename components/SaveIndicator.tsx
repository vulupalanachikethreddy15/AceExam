
import React, { useState, useEffect } from 'react';

interface SaveIndicatorProps {
  isSaving: boolean;
  highContrast?: boolean;
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({ isSaving, highContrast }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isSaving) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving]);

  if (!show) return null;

  return (
    <div className={`fixed bottom-8 right-8 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all transform animate-bounce ${
      highContrast 
        ? 'bg-yellow-400 text-black border-2 border-black' 
        : 'bg-green-600 text-white'
    }`}>
      {isSaving ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span className="text-sm font-bold uppercase tracking-wider">
        {isSaving ? 'Auto-saving...' : 'Saved'}
      </span>
    </div>
  );
};
