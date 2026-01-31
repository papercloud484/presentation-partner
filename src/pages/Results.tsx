import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, RefreshCw, TrendingUp, Award, 
  Mic, Eye, Shirt, Brain, User, Volume2,
  CheckCircle, AlertTriangle, XCircle
} from 'lucide-react';
import { EvaluationScore, EvaluationAspect, PracticeContext } from '@/types';

interface SessionData {
  transcript: string;
  context: PracticeContext;
  duration: number;
  practiceMode: string;
}

const aspectIcons: Record<EvaluationAspect, React.ElementType> = {
  speechFluency: Mic,
  confidence: TrendingUp,
  posture: User,
  eyeContact: Eye,
  outfitPresence: Shirt,
  clothingAssessment: Shirt,
  contentRelativity: Brain,
};

const aspectLabels: Record<EvaluationAspect, string> = {
  speechFluency: 'Speech & Fluency',
  confidence: 'Confidence',
  posture: 'Posture',
  eyeContact: 'Eye Contact',
  outfitPresence: 'Outfit & Presence',
  clothingAssessment: 'Clothing Assessment',
  contentRelativity: 'Content Relevance',
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const getScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
  if (score >= 60) return 'bg-amber-100 dark:bg-amber-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
};

const getScoreIcon = (score: number) => {
  if (score >= 80) return CheckCircle;
  if (score >= 60) return AlertTriangle;
  return XCircle;
};

export default function Results() {
  const navigate = useNavigate();
  const [scores, setScores] = useState<EvaluationScore[]>([]);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    const storedScores = sessionStorage.getItem('evaluationScores');
    const storedSession = sessionStorage.getItem('sessionData');

    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
    if (storedSession) {
      setSessionData(JSON.parse(storedSession));
    }
  }, []);

  const overallScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    : 0;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTryAnother = () => {
    sessionStorage.removeItem('evaluationScores');
    sessionStorage.removeItem('sessionData');
    navigate('/context-display');
  };

  const handlePracticeAgain = () => {
    navigate('/preparation');
  };

  const handleGoHome = () => {
    sessionStorage.removeItem('evaluationScores');
    sessionStorage.removeItem('sessionData');
    navigate('/landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Award className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
          <p className="text-muted-foreground">
            Here's your performance analysis and improvement tips
          </p>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-lg font-semibold text-muted-foreground mb-1">Overall Score</h2>
                <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                </div>
                <p className="text-sm text-muted-foreground mt-1">out of 100</p>
              </div>
              <div className="flex-1 max-w-md w-full">
                <Progress value={overallScore} className="h-4" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Needs Work</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                {sessionData && (
                  <>
                    <Badge variant="outline" className="mb-2">
                      {sessionData.practiceMode === 'interview' ? 'Interview Mode' : 'Presentation Mode'}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Duration: {formatDuration(sessionData.duration)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Scores and Tips */}
        <Tabs defaultValue="scores" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scores">Performance Scores</TabsTrigger>
            <TabsTrigger value="tips">Improvement Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {scores.map((score) => {
                const Icon = aspectIcons[score.aspect];
                const ScoreIcon = getScoreIcon(score.score);
                return (
                  <Card key={score.aspect} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${getScoreBgColor(score.score)}`}>
                          <Icon className={`w-6 h-6 ${getScoreColor(score.score)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{aspectLabels[score.aspect]}</h3>
                            <div className={`flex items-center gap-1 ${getScoreColor(score.score)}`}>
                              <ScoreIcon className="w-4 h-4" />
                              <span className="font-bold">{score.score}</span>
                            </div>
                          </div>
                          <Progress value={score.score} className="h-2 mb-2" />
                          <p className="text-xs text-muted-foreground">{score.details}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <div className="space-y-4">
              {scores.map((score) => {
                const Icon = aspectIcons[score.aspect];
                return (
                  <Card key={score.aspect}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        {aspectLabels[score.aspect]} Tips
                      </CardTitle>
                      <CardDescription>
                        Score: {score.score}/100 • {score.score >= 80 ? 'Excellent' : score.score >= 60 ? 'Good' : 'Needs Improvement'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {score.tips.map((tip, index) => (
                          <li key={index} className="flex gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Context Summary */}
        {sessionData?.context && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Session Context</CardTitle>
              <CardDescription>{sessionData.context.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {sessionData.context.content}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={handleTryAnother} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Another Context
          </Button>
          <Button variant="outline" onClick={handlePracticeAgain} className="gap-2">
            <Volume2 className="w-4 h-4" />
            Practice Again
          </Button>
          <Button onClick={handleGoHome} className="gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
