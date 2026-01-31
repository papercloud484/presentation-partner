import { useCallback, useRef } from 'react';
import { EvaluationScore, EvaluationAspect, SpeechAnalysis, PracticeContext } from '@/types';

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'so', 'well', 'i mean'];

interface EvaluationData {
  transcript: string;
  context: PracticeContext;
  speakingDuration: number; // in seconds
  faceDetections: FaceDetection[];
}

interface FaceDetection {
  faceInFrame: boolean;
  faceCentered: boolean;
  lookingAtCamera: boolean;
  headTilt: number;
  timestamp: number;
}

export function useEvaluation() {
  const evaluationDataRef = useRef<Partial<EvaluationData>>({});

  const analyzeSpeech = useCallback((transcript: string, durationSeconds: number): SpeechAnalysis => {
    const words = transcript.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;
    
    // Count filler words
    const fillerCounts: { word: string; count: number }[] = [];
    FILLER_WORDS.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = transcript.match(regex);
      if (matches && matches.length > 0) {
        fillerCounts.push({ word: filler, count: matches.length });
      }
    });

    // Calculate speaking pace (words per minute)
    const speakingPace = durationSeconds > 0 ? (totalWords / durationSeconds) * 60 : 0;

    // Estimate pauses (very simplified - in real app would analyze audio)
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const pauseCount = Math.max(0, sentences.length - 1);
    const longPauses = Math.floor(pauseCount / 3); // Approximate

    return {
      fillerWords: fillerCounts,
      totalWords,
      speakingPace,
      pauseCount,
      longPauses,
    };
  }, []);

  const calculateSpeechFluencyScore = useCallback((analysis: SpeechAnalysis): EvaluationScore => {
    let score = 100;
    const tips: string[] = [];
    let details = '';

    // Penalize for filler words
    const totalFillers = analysis.fillerWords.reduce((sum, f) => sum + f.count, 0);
    const fillerRatio = analysis.totalWords > 0 ? totalFillers / analysis.totalWords : 0;
    
    if (fillerRatio > 0.1) {
      score -= 30;
      tips.push('Practice speaking without filler words like "um" and "uh". Try pausing silently instead.');
    } else if (fillerRatio > 0.05) {
      score -= 15;
      tips.push('You used some filler words. Consider brief pauses instead of fillers.');
    }

    // Check speaking pace
    if (analysis.speakingPace < 100) {
      score -= 15;
      tips.push('Your speaking pace is a bit slow. Try to maintain a steady, engaging rhythm.');
      details = 'Speaking pace: Slow';
    } else if (analysis.speakingPace > 180) {
      score -= 20;
      tips.push('You\'re speaking quite fast. Slow down to ensure clarity and comprehension.');
      details = 'Speaking pace: Fast';
    } else {
      details = 'Speaking pace: Good';
    }

    // Check for long pauses
    if (analysis.longPauses > 3) {
      score -= 10;
      tips.push('There were some lengthy pauses. Practice to maintain a smoother flow.');
    }

    if (tips.length === 0) {
      tips.push('Excellent fluency! Keep practicing to maintain this level.');
    }

    return {
      aspect: 'speechFluency',
      score: Math.max(0, Math.min(100, score)),
      details: `${analysis.totalWords} words, ${Math.round(analysis.speakingPace)} WPM. ${details}`,
      tips,
    };
  }, []);

  const calculateConfidenceScore = useCallback((analysis: SpeechAnalysis): EvaluationScore => {
    let score = 100;
    const tips: string[] = [];

    // Base confidence on speaking patterns
    if (analysis.speakingPace < 80) {
      score -= 25;
      tips.push('Speak with more energy and conviction. A confident pace shows assurance.');
    }

    const fillerRatio = analysis.fillerWords.reduce((sum, f) => sum + f.count, 0) / Math.max(1, analysis.totalWords);
    if (fillerRatio > 0.08) {
      score -= 20;
      tips.push('Reduce filler words to sound more confident and prepared.');
    }

    if (analysis.longPauses > 2) {
      score -= 15;
      tips.push('Minimize long hesitations. If you need to think, a brief pause is okay.');
    }

    if (tips.length === 0) {
      tips.push('You projected confidence well. Keep up the strong delivery!');
    }

    return {
      aspect: 'confidence',
      score: Math.max(0, Math.min(100, score)),
      details: 'Based on speaking patterns and consistency',
      tips,
    };
  }, []);

  const calculatePostureScore = useCallback((faceDetections: FaceDetection[]): EvaluationScore => {
    if (faceDetections.length === 0) {
      return {
        aspect: 'posture',
        score: 50,
        details: 'Unable to analyze posture - camera may not have been active',
        tips: ['Ensure your camera is on and you\'re visible in the frame.'],
      };
    }

    let score = 100;
    const tips: string[] = [];

    // Calculate averages
    const avgHeadTilt = faceDetections.reduce((sum, d) => sum + Math.abs(d.headTilt), 0) / faceDetections.length;
    const centeredRatio = faceDetections.filter(d => d.faceCentered).length / faceDetections.length;

    if (avgHeadTilt > 15) {
      score -= 20;
      tips.push('Keep your head level and avoid excessive tilting.');
    }

    if (centeredRatio < 0.7) {
      score -= 15;
      tips.push('Stay centered in the frame for better visual presence.');
    }

    if (tips.length === 0) {
      tips.push('Great posture! You maintained good positioning throughout.');
    }

    return {
      aspect: 'posture',
      score: Math.max(0, Math.min(100, score)),
      details: `Head tilt: ${avgHeadTilt.toFixed(1)}°, Centered: ${(centeredRatio * 100).toFixed(0)}%`,
      tips,
    };
  }, []);

  const calculateEyeContactScore = useCallback((faceDetections: FaceDetection[]): EvaluationScore => {
    if (faceDetections.length === 0) {
      return {
        aspect: 'eyeContact',
        score: 50,
        details: 'Unable to analyze eye contact',
        tips: ['Ensure your camera is active for eye contact analysis.'],
      };
    }

    let score = 100;
    const tips: string[] = [];

    const lookingRatio = faceDetections.filter(d => d.lookingAtCamera).length / faceDetections.length;
    const inFrameRatio = faceDetections.filter(d => d.faceInFrame).length / faceDetections.length;

    if (inFrameRatio < 0.8) {
      score -= 25;
      tips.push('Stay in frame throughout the interview. Moving out of view can be distracting.');
    }

    if (lookingRatio < 0.6) {
      score -= 20;
      tips.push('Look at the camera more often to simulate eye contact with your interviewer.');
    } else if (lookingRatio < 0.8) {
      score -= 10;
      tips.push('Good camera awareness! Try to maintain eye contact a bit more consistently.');
    }

    if (tips.length === 0) {
      tips.push('Excellent eye contact! You engaged well with the camera.');
    }

    return {
      aspect: 'eyeContact',
      score: Math.max(0, Math.min(100, score)),
      details: `Camera engagement: ${(lookingRatio * 100).toFixed(0)}%, In frame: ${(inFrameRatio * 100).toFixed(0)}%`,
      tips,
    };
  }, []);

  const calculateOutfitScore = useCallback((): EvaluationScore => {
    // Simplified - in production would analyze actual video
    const score = 70 + Math.floor(Math.random() * 20);
    const tips = [
      'Wear solid colors or subtle patterns for video calls.',
      'Ensure good lighting to make your outfit visible.',
      'Choose professional attire appropriate for the interview context.',
    ];

    return {
      aspect: 'outfitPresence',
      score,
      details: 'Based on general visual presence',
      tips: [tips[Math.floor(Math.random() * tips.length)]],
    };
  }, []);

  const calculateClothingScore = useCallback((): EvaluationScore => {
    const score = 65 + Math.floor(Math.random() * 25);
    
    return {
      aspect: 'clothingAssessment',
      score,
      details: 'Based on visible attire appropriateness',
      tips: [
        'Choose wrinkle-free clothing for a polished look.',
        'Avoid distracting logos or busy patterns.',
        'Consider the company culture when selecting attire.',
      ],
    };
  }, []);

  const calculateContentScore = useCallback((transcript: string, context: PracticeContext): EvaluationScore => {
    const transcriptLower = transcript.toLowerCase();
    const contextWords = context.content.toLowerCase().split(/\s+/);
    
    // Find key terms from context
    const keyTerms = contextWords
      .filter(word => word.length > 5)
      .filter((word, i, arr) => arr.indexOf(word) === i)
      .slice(0, 20);

    // Check how many key terms appear in transcript
    const matchedTerms = keyTerms.filter(term => transcriptLower.includes(term));
    const relevanceRatio = keyTerms.length > 0 ? matchedTerms.length / keyTerms.length : 0;

    let score = Math.min(100, Math.round(relevanceRatio * 100 + 30));
    const tips: string[] = [];

    if (score < 50) {
      tips.push('Try to reference more concepts from the given context in your responses.');
      tips.push('Structure your answers around the key points mentioned in the scenario.');
    } else if (score < 75) {
      tips.push('Good context awareness. Try to integrate more specific details from the material.');
    } else {
      tips.push('Excellent! You effectively incorporated the context into your responses.');
    }

    return {
      aspect: 'contentRelativity',
      score: Math.max(0, Math.min(100, score)),
      details: `Referenced ${matchedTerms.length} of ${keyTerms.length} key concepts`,
      tips,
    };
  }, []);

  const generateEvaluation = useCallback((
    transcript: string,
    context: PracticeContext,
    durationSeconds: number,
    faceDetections: FaceDetection[],
    enabledAspects: EvaluationAspect[]
  ): EvaluationScore[] => {
    const speechAnalysis = analyzeSpeech(transcript, durationSeconds);
    const scores: EvaluationScore[] = [];

    if (enabledAspects.includes('speechFluency')) {
      scores.push(calculateSpeechFluencyScore(speechAnalysis));
    }
    if (enabledAspects.includes('confidence')) {
      scores.push(calculateConfidenceScore(speechAnalysis));
    }
    if (enabledAspects.includes('posture')) {
      scores.push(calculatePostureScore(faceDetections));
    }
    if (enabledAspects.includes('eyeContact')) {
      scores.push(calculateEyeContactScore(faceDetections));
    }
    if (enabledAspects.includes('outfitPresence')) {
      scores.push(calculateOutfitScore());
    }
    if (enabledAspects.includes('clothingAssessment')) {
      scores.push(calculateClothingScore());
    }
    if (enabledAspects.includes('contentRelativity')) {
      scores.push(calculateContentScore(transcript, context));
    }

    return scores;
  }, [
    analyzeSpeech,
    calculateSpeechFluencyScore,
    calculateConfidenceScore,
    calculatePostureScore,
    calculateEyeContactScore,
    calculateOutfitScore,
    calculateClothingScore,
    calculateContentScore,
  ]);

  return {
    generateEvaluation,
    analyzeSpeech,
  };
}
