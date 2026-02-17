
import React, { useState, useEffect } from 'react';

interface ShortcutToastProps {
  message: string;
  highContrast?: boolean;
}

export const ShortcutToast: React.FC<ShortcutToastProps> = ({ message, highContrast }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl font-bold transition-all transform animate-bounce ${
      highContrast 
        ? 'bg-yellow-400 text-black border-4 border-black' 
        : 'bg-slate-800 text-white'
    }`}>
      <span className="flex items-center gap-2">
        <kbd className={`px-2 py-0.5 rounded text-xs ${highContrast ? 'bg-black text-yellow-400' : 'bg-slate-700 text-slate-300'}`}>Shortcut</kbd>
        {message}
      </span>
    </div>
  );
};
