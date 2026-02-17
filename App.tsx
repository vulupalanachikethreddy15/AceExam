
import React, { useState, useEffect, useCallback } from 'react';
import { 
  DisabilityType, 
  AccessibilityConfig, 
  AppStep, 
  ExamState 
} from './types';
import { 
  DISABILITY_MAPPING, 
  SAMPLE_QUESTIONS, 
  EXAM_DURATION_SECONDS, 
  EXTRA_TIME_MULTIPLIER 
} from './constants';
import { ExamHeader } from './components/ExamHeader';
import { VoiceInput } from './components/VoiceInput';
import { SaveIndicator } from './components/SaveIndicator';
import { ShortcutToast } from './components/ShortcutToast';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('LOGIN');
  const [disability, setDisability] = useState<DisabilityType>(DisabilityType.NONE);
  const [config, setConfig] = useState<AccessibilityConfig>(DISABILITY_MAPPING[DisabilityType.NONE]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeGesture, setActiveGesture] = useState<string | null>(null);
  const [shortcutMessage, setShortcutMessage] = useState('');
  
  const [exam, setExam] = useState<ExamState>({
    answers: {},
    timeLeft: EXAM_DURATION_SECONDS,
    currentQuestionIndex: 0,
    isSubmitted: false
  });

  // Timer logic
  useEffect(() => {
    if (step === 'EXAM' && !exam.isSubmitted && exam.timeLeft > 0) {
      const timer = setInterval(() => {
        setExam(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, exam.isSubmitted, exam.timeLeft]);

  const toggleFeature = useCallback((feature: keyof AccessibilityConfig, label: string) => {
    setConfig(prev => ({ ...prev, [feature]: !prev[feature] }));
    setShortcutMessage(`${label} ${!config[feature] ? 'Enabled' : 'Disabled'}`);
    setTimeout(() => setShortcutMessage(''), 2000);
  }, [config]);

  const handleNext = useCallback(() => {
    if (exam.currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      setExam(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
      setShortcutMessage('Next Question');
    }
  }, [exam.currentQuestionIndex]);

  const handlePrev = useCallback(() => {
    if (exam.currentQuestionIndex > 0) {
      setExam(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
      setShortcutMessage('Previous Question');
    }
  }, [exam.currentQuestionIndex]);

  const submitExam = useCallback(() => {
    setExam(prev => ({ ...prev, isSubmitted: true }));
    setStep('CONFIRMATION');
    setShortcutMessage('Exam Submitted');
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step !== 'EXAM' || exam.isSubmitted) return;

      const key = e.key.toLowerCase();
      
      // Navigation
      if (key === 'n') handleNext();
      if (key === 'p') handlePrev();
      if (key === 's' && exam.currentQuestionIndex === SAMPLE_QUESTIONS.length - 1) submitExam();

      // Accessibility Features
      if (key === 'h') toggleFeature('highContrast', 'High Contrast');
      if (key === 'l') toggleFeature('largeText', 'Large Text');
      if (key === 'u') toggleFeature('simplifiedUI', 'Simplified UI');
      if (key === 'v') toggleFeature('voiceInput', 'Voice Input');
      if (key === 't') toggleFeature('textToSpeech', 'Text to Speech');
      if (key === 'b') toggleFeature('largeButtons', 'Large Buttons');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, exam.isSubmitted, exam.currentQuestionIndex, handleNext, handlePrev, submitExam, toggleFeature]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('DISABILITY_SELECT');
  };

  const selectDisability = (type: DisabilityType) => {
    const selectedConfig = DISABILITY_MAPPING[type];
    setDisability(type);
    setConfig(selectedConfig);
    setExam(prev => ({
      ...prev,
      timeLeft: selectedConfig.extraTime ? Math.round(EXAM_DURATION_SECONDS * EXTRA_TIME_MULTIPLIER) : EXAM_DURATION_SECONDS
    }));
    setStep('EXAM');
  };

  const handleAnswer = (value: string) => {
    const questionId = SAMPLE_QUESTIONS[exam.currentQuestionIndex].id;
    setIsSaving(true);
    setExam(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleVoiceSelection = (text: string) => {
    const currentQ = SAMPLE_QUESTIONS[exam.currentQuestionIndex];
    if (!currentQ.options) return;
    
    const lowerText = text.toLowerCase();
    const match = currentQ.options.find(opt => lowerText.includes(opt.toLowerCase()));
    
    if (match) {
      handleAnswer(match);
      setShortcutMessage(`Selected via Voice: ${match}`);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const simulateGesture = (type: string) => {
    setActiveGesture(type);
    setTimeout(() => setActiveGesture(null), 1000);
    
    if (type === 'next') handleNext();
    else if (type === 'prev') handlePrev();
  };

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Online Examination</h1>
          <p className="text-slate-500 mt-2">Sign in to your candidate account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Candidate ID</label>
            <input 
              type="text" 
              required 
              defaultValue="EXAM-2024-001"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              defaultValue="password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Start Session
          </button>
        </form>
      </div>
    </div>
  );

  const renderDisabilitySelect = () => {
    const options = [
      { id: DisabilityType.NONE, label: 'None / Standard', icon: '👤' },
      { id: DisabilityType.VISUAL_BLIND, label: 'Visual (Blind)', icon: '🦯' },
      { id: DisabilityType.VISUAL_LOW_VISION, label: 'Visual (Low Vision)', icon: '👓' },
      { id: DisabilityType.MOTOR_IMPAIRMENT, label: 'Motor Impairment', icon: '♿' },
      { id: DisabilityType.COGNITIVE_IMPAIRMENT, label: 'Cognitive (ADHD/Dyslexia)', icon: '🧠' },
      { id: DisabilityType.HEARING_IMPAIRMENT, label: 'Hearing Impairment', icon: '🦻' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Accessibility Settings</h1>
          <p className="text-slate-600 mb-8">Please select a disability type to enable relevant accessibility features for your exam.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectDisability(opt.id)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col group"
              >
                <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{opt.icon}</span>
                <h3 className="text-lg font-bold text-slate-800">{opt.label}</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Maps to: {Object.entries(DISABILITY_MAPPING[opt.id])
                    .filter(([_, v]) => v)
                    .map(([k]) => k.replace(/([A-Z])/g, ' $1').toLowerCase())
                    .join(', ') || 'Standard UI'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderExam = () => {
    const currentQ = SAMPLE_QUESTIONS[exam.currentQuestionIndex];
    const currentAns = exam.answers[currentQ.id] || '';

    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-500 ${config.highContrast ? 'bg-black text-yellow-400' : 'bg-slate-50'}`}>
        <ExamHeader 
          timeLeft={exam.timeLeft} 
          config={config} 
          onExit={() => setStep('LOGIN')} 
          isMCQ={true}
        />

        <ShortcutToast message={shortcutMessage} highContrast={config.highContrast} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-12 flex justify-center relative">
          {activeGesture && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
               <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 animate-ping border-4 ${config.highContrast ? 'border-yellow-400 bg-yellow-400/20' : 'border-indigo-500 bg-indigo-500/20'}`}>
                  <span className="text-6xl">{activeGesture === 'next' ? '➡️' : '⬅️'}</span>
               </div>
            </div>
          )}

          <div className={`w-full ${config.simplifiedUI ? 'max-w-2xl' : 'max-w-4xl'} space-y-8`}>
            
            <section className={`rounded-2xl p-8 space-y-6 shadow-sm border transition-all ${config.highContrast ? 'border-yellow-400 bg-black' : 'bg-white border-slate-200'} ${isSaving ? 'opacity-90 grayscale-[0.2]' : ''}`}>
              <div className="flex items-center justify-between">
                <span className={`font-semibold uppercase tracking-wider ${config.largeText ? 'text-2xl' : 'text-sm text-slate-500'}`}>
                  Question {exam.currentQuestionIndex + 1} of {SAMPLE_QUESTIONS.length}
                </span>
                <div className="flex items-center gap-2">
                  {config.textToSpeech && (
                    <button 
                      onClick={() => speakText(currentQ.text)}
                      className={`flex items-center gap-2 p-3 rounded-full ${config.highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                      aria-label="Read question aloud (Shortcut: T)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      {config.largeButtons && <span className="font-bold text-xl">Listen</span>}
                    </button>
                  )}
                </div>
              </div>

              <h2 className={`font-bold leading-tight ${config.largeText ? 'text-4xl' : 'text-2xl'}`}>
                {currentQ.text}
              </h2>

              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  {currentQ.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      className={`text-left p-6 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        currentAns === opt
                          ? (config.highContrast ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.01]')
                          : (config.highContrast ? 'border-yellow-400 hover:bg-yellow-900/20' : 'border-slate-200 hover:border-indigo-300 bg-slate-50')
                      } ${config.largeButtons ? 'text-2xl min-h-[80px]' : 'text-lg'}`}
                    >
                      <span className="font-mono opacity-50">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>

                {config.voiceInput && (
                  <div className={`mt-8 p-6 border-2 border-dashed rounded-xl transition-all ${config.highContrast ? 'border-yellow-400 bg-black' : 'border-indigo-200 bg-indigo-50/50'}`}>
                    <VoiceInput 
                      isLarge={config.largeButtons}
                      onTranscriptionComplete={handleVoiceSelection} 
                    />
                    <p className={`mt-2 text-sm ${config.highContrast ? 'text-yellow-400' : 'text-slate-500'}`}>
                      Tip: Say the name of an option to select it. (Shortcut: V)
                    </p>
                  </div>
                )}
              </div>
            </section>

            {config.gestureSimulation && (
              <div className="p-6 rounded-2xl border-2 border-indigo-500 bg-indigo-50 space-y-4 shadow-inner">
                <div className="flex items-center gap-2 text-indigo-700 font-bold uppercase tracking-wider text-xs">
                   <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                  Gesture Simulation Panel (Prototype Assist)
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => simulateGesture('prev')}
                    className="p-4 bg-white border-2 border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors flex flex-col items-center gap-2 group"
                  >
                    <span className="text-3xl group-hover:-translate-x-2 transition-transform">👈</span>
                    <span className="text-xs font-bold text-slate-600">Swipe Left (Previous)</span>
                  </button>
                  <button 
                    onClick={() => simulateGesture('next')}
                    className="p-4 bg-white border-2 border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors flex flex-col items-center gap-2 group"
                  >
                    <span className="text-3xl group-hover:translate-x-2 transition-transform">👉</span>
                    <span className="text-xs font-bold text-slate-600">Swipe Right (Next)</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pb-12">
              <button
                disabled={exam.currentQuestionIndex === 0}
                onClick={handlePrev}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-30 ${
                  config.highContrast ? 'border-2 border-yellow-400' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                } ${config.largeButtons ? 'text-2xl scale-110' : ''}`}
                title="Shortcut: P"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous (P)
              </button>

              {exam.currentQuestionIndex === SAMPLE_QUESTIONS.length - 1 ? (
                <button
                  onClick={submitExam}
                  className={`flex items-center gap-2 px-12 py-4 rounded-xl font-bold transition-all shadow-lg ${
                    config.highContrast ? 'bg-yellow-400 text-black border-2 border-yellow-400' : 'bg-green-600 text-white hover:bg-green-700'
                  } ${config.largeButtons ? 'text-3xl px-16 py-6' : ''}`}
                  title="Shortcut: S"
                >
                  Submit Exam (S)
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-lg ${
                    config.highContrast ? 'bg-yellow-400 text-black border-2 border-yellow-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } ${config.largeButtons ? 'text-2xl scale-110' : ''}`}
                  title="Shortcut: N"
                >
                  Next (N)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Shortcut Help Legend */}
            <div className={`mt-12 p-6 rounded-2xl border text-sm grid grid-cols-2 md:grid-cols-4 gap-4 ${config.highContrast ? 'border-yellow-400 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
               <div><kbd className="font-bold">N</kbd> Next</div>
               <div><kbd className="font-bold">P</kbd> Previous</div>
               <div><kbd className="font-bold">S</kbd> Submit</div>
               <div><kbd className="font-bold">H</kbd> High Contrast</div>
               <div><kbd className="font-bold">L</kbd> Large Text</div>
               <div><kbd className="font-bold">U</kbd> Simplified UI</div>
               <div><kbd className="font-bold">V</kbd> Voice Input</div>
               <div><kbd className="font-bold">T</kbd> TTS</div>
               <div><kbd className="font-bold">B</kbd> Large Buttons</div>
            </div>
          </div>
        </main>
        
        <SaveIndicator isSaving={isSaving} highContrast={config.highContrast} />
      </div>
    );
  };

  const renderConfirmation = () => (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 space-y-8 border-t-8 border-green-500">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Exam Submitted</h1>
          <p className="text-slate-600 mt-4 text-lg">Your responses have been securely saved. You may now close this window or return to the portal.</p>
        </div>
        <div className="pt-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all"
          >
            Finish Session
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {step === 'LOGIN' && renderLogin()}
      {step === 'DISABILITY_SELECT' && renderDisabilitySelect()}
      {step === 'EXAM' && renderExam()}
      {step === 'CONFIRMATION' && renderConfirmation()}
    </React.Fragment>
  );
};

export default App;
