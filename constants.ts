
import { DisabilityType, AccessibilityConfig, Question } from './types';

export const DISABILITY_MAPPING: Record<DisabilityType, AccessibilityConfig> = {
  [DisabilityType.NONE]: {
    voiceInput: false,
    textToSpeech: false,
    largeText: false,
    highContrast: false,
    extraTime: false,
    largeButtons: false,
    simplifiedUI: false,
    gestureSimulation: false
  },
  [DisabilityType.VISUAL_BLIND]: {
    voiceInput: true,
    textToSpeech: true,
    largeText: false,
    highContrast: false,
    extraTime: true,
    largeButtons: true,
    simplifiedUI: true,
    gestureSimulation: false
  },
  [DisabilityType.VISUAL_LOW_VISION]: {
    voiceInput: false,
    textToSpeech: true,
    largeText: true,
    highContrast: true,
    extraTime: true,
    largeButtons: true,
    simplifiedUI: false,
    gestureSimulation: false
  },
  [DisabilityType.MOTOR_IMPAIRMENT]: {
    voiceInput: true,
    textToSpeech: false,
    largeText: false,
    highContrast: false,
    extraTime: true,
    largeButtons: true,
    simplifiedUI: true,
    gestureSimulation: true
  },
  [DisabilityType.COGNITIVE_IMPAIRMENT]: {
    voiceInput: false,
    textToSpeech: true,
    largeText: false,
    highContrast: false,
    extraTime: true,
    largeButtons: false,
    simplifiedUI: true,
    gestureSimulation: false
  },
  [DisabilityType.HEARING_IMPAIRMENT]: {
    voiceInput: false,
    textToSpeech: false,
    largeText: false,
    highContrast: false,
    extraTime: false,
    largeButtons: false,
    simplifiedUI: false,
    gestureSimulation: false
  }
};

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the primary goal of Web Content Accessibility Guidelines (WCAG)?",
    type: "multiple_choice",
    options: [
      "To make web content faster to load",
      "To make web content more accessible to people with disabilities",
      "To improve SEO rankings",
      "To reduce server costs"
    ]
  },
  {
    id: 2,
    text: "Which assistive technology is most essential for a student who is completely blind?",
    type: "multiple_choice",
    options: [
      "Screen Magnifier",
      "High Contrast Mode",
      "Screen Reader",
      "Color Filters"
    ]
  },
  {
    id: 3,
    text: "Which of the following is an example of an 'Operable' design principle?",
    type: "multiple_choice",
    options: [
      "Providing text alternatives for images",
      "Ensuring all functionality is available from a keyboard",
      "Using simple language",
      "Making sure the UI is robust"
    ]
  }
];

export const EXAM_DURATION_SECONDS = 3600; // 1 hour
export const EXTRA_TIME_MULTIPLIER = 1.5;
