// User and Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Practice Mode Types
export type PracticeMode = 'interview' | 'presentation';

export type EvaluationAspect = 
  | 'speechFluency'
  | 'confidence'
  | 'posture'
  | 'eyeContact'
  | 'outfitPresence'
  | 'clothingAssessment'
  | 'contentRelativity';

export interface EvaluationConfig {
  mode: 'default' | 'custom';
  aspects: EvaluationAspect[];
}

// Context Types
export type ContextType = 'interview' | 'article' | 'case-study';

export interface PracticeContext {
  id: string;
  type: ContextType;
  title: string;
  content: string;
  questions: string[];
}

// Session Types
export type SessionPhase = 
  | 'preparation'
  | 'reading'
  | 'transition'
  | 'interview'
  | 'complete';

export interface SessionState {
  practiceMode: PracticeMode | null;
  evaluationConfig: EvaluationConfig;
  context: PracticeContext | null;
  preparationTime: number; // in minutes
  currentPhase: SessionPhase;
  startTime: string | null;
  endTime: string | null;
}

// Evaluation Scores
export interface EvaluationScore {
  aspect: EvaluationAspect;
  score: number; // 0-100
  details: string;
  tips: string[];
}

export interface SessionResult {
  sessionId: string;
  practiceMode: PracticeMode;
  context: PracticeContext;
  scores: EvaluationScore[];
  overallScore: number;
  duration: number; // in seconds
  completedAt: string;
}

// Speech Analysis Types
export interface SpeechAnalysis {
  fillerWords: { word: string; count: number }[];
  totalWords: number;
  speakingPace: number; // words per minute
  pauseCount: number;
  longPauses: number; // pauses > 3 seconds
}

// Posture Analysis Types
export interface PostureAnalysis {
  headTilt: number; // degrees from center
  shoulderAlignment: number; // 0-100
  faceInFrame: boolean;
  faceCentered: boolean;
  lookingAtCamera: boolean;
}

// Outfit Analysis Types
export interface OutfitAnalysis {
  colorContrast: number; // 0-100
  patternDensity: 'low' | 'medium' | 'high';
  formality: 'casual' | 'business-casual' | 'formal';
  neatness: number; // 0-100
}
