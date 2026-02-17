
export enum DisabilityType {
  NONE = 'NONE',
  VISUAL_BLIND = 'VISUAL_BLIND',
  VISUAL_LOW_VISION = 'VISUAL_LOW_VISION',
  MOTOR_IMPAIRMENT = 'MOTOR_IMPAIRMENT',
  COGNITIVE_IMPAIRMENT = 'COGNITIVE_IMPAIRMENT',
  HEARING_IMPAIRMENT = 'HEARING_IMPAIRMENT'
}

export interface AccessibilityConfig {
  voiceInput: boolean;
  textToSpeech: boolean;
  largeText: boolean;
  highContrast: boolean;
  extraTime: boolean;
  largeButtons: boolean;
  simplifiedUI: boolean;
  gestureSimulation: boolean;
}

export interface Question {
  id: number;
  text: string;
  type: 'multiple_choice' | 'open_ended';
  options?: string[];
}

export interface ExamState {
  answers: Record<number, string>;
  timeLeft: number;
  currentQuestionIndex: number;
  isSubmitted: boolean;
}

export type AppStep = 'LOGIN' | 'DISABILITY_SELECT' | 'EXAM' | 'CONFIRMATION';
