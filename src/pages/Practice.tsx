import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { useCamera } from '@/hooks/useCamera';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useEvaluation } from '@/hooks/useEvaluation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, MicOff, Video, VideoOff, Volume2, 
  ChevronRight, CheckCircle, AlertCircle 
} from 'lucide-react';
import { EvaluationScore, SessionPhase } from '@/types';

interface FaceDetection {
  faceInFrame: boolean;
  faceCentered: boolean;
  lookingAtCamera: boolean;
  headTilt: number;
  timestamp: number;
}

export default function Practice() {
  const navigate = useNavigate();
  const { session, setPhase, endSession } = useSession();
  const { videoRef, isActive: cameraActive, error: cameraError, startCamera, stopCamera } = useCamera();
  const { isListening, transcript, interimTranscript, startListening, stopListening, isSupported: speechSupported } = useSpeechRecognition();
  const { speak, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const { generateEvaluation } = useEvaluation();

  const [currentPhase, setCurrentPhase] = useState<'reading' | 'transition' | 'interview' | 'answering'>('reading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [sessionStartTime] = useState(Date.now());
  const [faceDetections, setFaceDetections] = useState<FaceDetection[]>([]);
  const [evaluationScores, setEvaluationScores] = useState<EvaluationScore[]>([]);
  
  const faceDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate face detection (in production would use MediaPipe)
  const simulateFaceDetection = useCallback(() => {
    const detection: FaceDetection = {
      faceInFrame: Math.random() > 0.1,
      faceCentered: Math.random() > 0.2,
      lookingAtCamera: Math.random() > 0.3,
      headTilt: (Math.random() - 0.5) * 30,
      timestamp: Date.now(),
    };
    setFaceDetections(prev => [...prev, detection]);
  }, []);

  // Start camera and face detection on mount
  useEffect(() => {
    startCamera();
    faceDetectionIntervalRef.current = setInterval(simulateFaceDetection, 2000);

    return () => {
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
      }
    };
  }, [startCamera, simulateFaceDetection]);

  // Handle phase transitions
  const handleStartReading = useCallback(() => {
    startListening();
    setIsRecording(true);
  }, [startListening]);

  const handleFinishReading = useCallback(() => {
    stopListening();
    setIsRecording(false);
    setCurrentPhase('transition');
    
    // Brief transition then start interview
    setTimeout(() => {
      setCurrentPhase('interview');
    }, 2000);
  }, [stopListening]);

  // Speak current question when entering interview phase
  useEffect(() => {
    if (currentPhase === 'interview' && session.context && ttsSupported) {
      const question = session.context.questions[currentQuestionIndex];
      speak(question);
      
      // After speaking, transition to answering
      const speakDuration = question.length * 60; // Rough estimate
      setTimeout(() => {
        setCurrentPhase('answering');
        startListening();
        setIsRecording(true);
      }, Math.max(3000, speakDuration));
    }
  }, [currentPhase, currentQuestionIndex, session.context, speak, ttsSupported, startListening]);

  const handleNextQuestion = useCallback(() => {
    stopListening();
    setIsRecording(false);

    if (session.context && currentQuestionIndex < session.context.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentPhase('interview');
    } else {
      // All questions answered - generate evaluation
      const duration = (Date.now() - sessionStartTime) / 1000;
      const scores = generateEvaluation(
        transcript,
        session.context!,
        duration,
        faceDetections,
        session.evaluationConfig.aspects
      );
      
      setEvaluationScores(scores);
      
      // Store in session storage for results page
      sessionStorage.setItem('evaluationScores', JSON.stringify(scores));
      sessionStorage.setItem('sessionData', JSON.stringify({
        transcript,
        context: session.context,
        duration,
        practiceMode: session.practiceMode,
      }));
      
      stopCamera();
      endSession();
      navigate('/results');
    }
  }, [
    stopListening, session.context, currentQuestionIndex, 
    sessionStartTime, generateEvaluation, transcript, 
    faceDetections, session.evaluationConfig.aspects,
    session.practiceMode, stopCamera, endSession, navigate
  ]);

  if (!session.context) {
    navigate('/context-display');
    return null;
  }

  const currentQuestion = session.context.questions[currentQuestionIndex];
  const totalQuestions = session.context.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge variant={isRecording ? 'destructive' : 'secondary'} className="gap-1">
              {isRecording ? <Mic className="w-3 h-3 animate-pulse" /> : <MicOff className="w-3 h-3" />}
              {isRecording ? 'Recording' : 'Not Recording'}
            </Badge>
            <Badge variant={cameraActive ? 'default' : 'secondary'} className="gap-1">
              {cameraActive ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
              {cameraActive ? 'Camera On' : 'Camera Off'}
            </Badge>
            {isSpeaking && (
              <Badge variant="outline" className="gap-1">
                <Volume2 className="w-3 h-3 animate-pulse" />
                Speaking...
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentPhase === 'reading' && 'Reading Phase'}
            {currentPhase === 'transition' && 'Transitioning to Interview...'}
            {currentPhase === 'interview' && `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
            {currentPhase === 'answering' && `Answering Question ${currentQuestionIndex + 1}`}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Video Feed */}
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative aspect-video bg-muted">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center p-4">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{cameraError}</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={startCamera}>
                      Retry
                    </Button>
                  </div>
                </div>
              )}
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Panel */}
          <div className="space-y-4">
            {/* Phase-specific content */}
            {currentPhase === 'reading' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Reading Phase</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Read or explain the context aloud. Click "Start" when ready, then "Finish" when done.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg mb-4 max-h-48 overflow-y-auto">
                    <p className="text-sm">{session.context.content}</p>
                  </div>
                  <div className="flex gap-2">
                    {!isRecording ? (
                      <Button onClick={handleStartReading} className="gap-2">
                        <Mic className="w-4 h-4" />
                        Start Reading
                      </Button>
                    ) : (
                      <Button onClick={handleFinishReading} variant="destructive" className="gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Finish Reading
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentPhase === 'transition' && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="animate-pulse">
                    <h3 className="font-semibold text-xl mb-2">Get Ready!</h3>
                    <p className="text-muted-foreground">
                      The interview is about to begin...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {(currentPhase === 'interview' || currentPhase === 'answering') && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Interview Question</h3>
                    <span className="text-sm text-muted-foreground">
                      {currentQuestionIndex + 1} / {totalQuestions}
                    </span>
                  </div>
                  <Progress value={progress} className="mb-4" />
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg mb-4">
                    <p className="font-medium">{currentQuestion}</p>
                  </div>
                  {currentPhase === 'answering' && (
                    <Button onClick={handleNextQuestion} className="gap-2">
                      {currentQuestionIndex < totalQuestions - 1 ? (
                        <>
                          Next Question
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Finish Interview
                          <CheckCircle className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Live Transcript */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Live Transcript</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTranscript(!showTranscript)}
                  >
                    {showTranscript ? 'Hide' : 'Show'}
                  </Button>
                </div>
                {showTranscript && (
                  <div className="bg-muted/50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    <p className="text-sm">
                      {transcript}
                      {interimTranscript && (
                        <span className="text-muted-foreground italic">{interimTranscript}</span>
                      )}
                      {!transcript && !interimTranscript && (
                        <span className="text-muted-foreground italic">
                          {isRecording ? 'Listening...' : 'Start speaking to see transcript'}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Speech Support Warning */}
            {!speechSupported && (
              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="p-4">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    ⚠️ Speech recognition is not supported in your browser. 
                    For the best experience, use Chrome or Edge.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
