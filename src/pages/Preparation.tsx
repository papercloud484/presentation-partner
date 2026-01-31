import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, BookOpen, Briefcase, FileText } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const contextTypeIcons = {
  'interview': Briefcase,
  'article': BookOpen,
  'case-study': FileText,
};

export default function Preparation() {
  const navigate = useNavigate();
  const { session, setPhase } = useSession();
  const [timeLeft, setTimeLeft] = useState(session.preparationTime * 60); // Convert to seconds
  const [showWarning, setShowWarning] = useState(false);
  const [warningDismissed, setWarningDismissed] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTransition = useCallback(() => {
    setPhase('reading');
    navigate('/practice');
  }, [setPhase, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTransition();
      return;
    }

    // Show warning at 10 seconds
    if (timeLeft === 10 && !warningDismissed) {
      setShowWarning(true);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, warningDismissed, handleTransition]);

  const handleWarningDismiss = () => {
    setShowWarning(false);
    setWarningDismissed(true);
  };

  const handleSkipPreparation = () => {
    handleTransition();
  };

  if (!session.context) {
    navigate('/context-display');
    return null;
  }

  const ContextIcon = contextTypeIcons[session.context.type];
  const progressPercentage = ((session.preparationTime * 60 - timeLeft) / (session.preparationTime * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Timer Section */}
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <Clock className="w-3 h-3 mr-1" />
              Preparation Phase
            </Badge>
            <div className="relative inline-flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-8 border-muted flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeDasharray={`${progressPercentage * 2.88} 288`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-destructive animate-pulse' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              Use this time to read and prepare your response
            </p>
          </div>

          {/* Context Display */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ContextIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">{session.context.title}</h2>
                  <span className="text-sm text-muted-foreground capitalize">{session.context.type.replace('-', ' ')}</span>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-line leading-relaxed">
                  {session.context.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Questions Preview */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Questions you'll be asked:</h3>
              <ol className="space-y-3">
                {session.context.questions.map((question, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{question}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Skip Button */}
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={handleSkipPreparation}>
              Skip Preparation & Start Now
            </Button>
          </div>
        </div>
      </div>

      {/* Warning Dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Interview Starting Soon!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your preparation time is almost up. The interview will begin in 10 seconds. 
              Make sure your camera and microphone are ready.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleWarningDismiss}>
              I'm Ready!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
