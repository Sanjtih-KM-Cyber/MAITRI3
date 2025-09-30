import { RefObject } from 'react';

export type View = 'dashboard' | 'chat' | 'guardian' | 'coPilot' | 'storyteller' | 'playmate';
export type Role = 'guardian' | 'coPilot' | 'storyteller' | 'playmate' | 'companion';

export interface Workout {
  id: string;
  name: string;
  duration: number; // in minutes
}

export interface MissionData {
  workoutPlan: Workout[];
}

export interface AppStateContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  videoRef: RefObject<HTMLVideoElement>;
  navigateToChatWithPrompt: (prompt: string) => void;
}

export interface ThemeContextType {
  accentColor: string;
  changeAccentColor: (newColor: string) => void;
  isSanctuaryActive: boolean;
  setSanctuaryActive: (isActive: boolean, memory?: string) => void;
  sanctuaryMemory: string | null;
}

// FIX: Add global type definitions for the Web Speech API to fix compilation errors across the project.
declare global {
  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
    readonly resultIndex: number;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    start(): void;
    stop(): void;
  }

  interface Window {
    SpeechRecognition?: { new (): SpeechRecognition };
    webkitSpeechRecognition?: { new (): SpeechRecognition };
  }
}
