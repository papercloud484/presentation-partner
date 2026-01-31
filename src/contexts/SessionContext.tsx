import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SessionState, PracticeMode, EvaluationConfig, PracticeContext, SessionPhase, EvaluationAspect } from '@/types';

interface SessionContextType {
  session: SessionState;
  setPracticeMode: (mode: PracticeMode) => void;
  setEvaluationConfig: (config: EvaluationConfig) => void;
  setContext: (context: PracticeContext) => void;
  setPreparationTime: (minutes: number) => void;
  setPhase: (phase: SessionPhase) => void;
  startSession: () => void;
  endSession: () => void;
  resetSession: () => void;
}

const defaultEvaluationAspects: EvaluationAspect[] = [
  'speechFluency',
  'confidence',
  'posture',
  'eyeContact',
  'outfitPresence',
  'contentRelativity',
];

const initialSession: SessionState = {
  practiceMode: null,
  evaluationConfig: {
    mode: 'default',
    aspects: defaultEvaluationAspects,
  },
  context: null,
  preparationTime: 3,
  currentPhase: 'preparation',
  startTime: null,
  endTime: null,
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(initialSession);

  const setPracticeMode = (mode: PracticeMode) => {
    setSession(prev => ({ ...prev, practiceMode: mode }));
  };

  const setEvaluationConfig = (config: EvaluationConfig) => {
    setSession(prev => ({ ...prev, evaluationConfig: config }));
  };

  const setContext = (context: PracticeContext) => {
    setSession(prev => ({ ...prev, context }));
  };

  const setPreparationTime = (minutes: number) => {
    setSession(prev => ({ ...prev, preparationTime: minutes }));
  };

  const setPhase = (phase: SessionPhase) => {
    setSession(prev => ({ ...prev, currentPhase: phase }));
  };

  const startSession = () => {
    setSession(prev => ({ ...prev, startTime: new Date().toISOString() }));
  };

  const endSession = () => {
    setSession(prev => ({ 
      ...prev, 
      endTime: new Date().toISOString(),
      currentPhase: 'complete' 
    }));
  };

  const resetSession = () => {
    setSession(initialSession);
  };

  return (
    <SessionContext.Provider value={{
      session,
      setPracticeMode,
      setEvaluationConfig,
      setContext,
      setPreparationTime,
      setPhase,
      startSession,
      endSession,
      resetSession,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
