import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, RefreshCw, Clock, FileText, BookOpen, Briefcase } from 'lucide-react';
import { getRandomContext } from '@/data/contexts';
import { PracticeContext } from '@/types';

const contextTypeIcons = {
  'interview': Briefcase,
  'article': BookOpen,
  'case-study': FileText,
};

const contextTypeLabels = {
  'interview': 'Interview Scenario',
  'article': 'Article',
  'case-study': 'Case Study',
};

export default function ContextDisplay() {
  const navigate = useNavigate();
  const { setContext, setPreparationTime, startSession } = useSession();
  const [currentContext, setCurrentContext] = useState<PracticeContext | null>(null);
  const [prepTime, setPrepTime] = useState([3]); // Default 3 minutes

  useEffect(() => {
    setCurrentContext(getRandomContext());
  }, []);

  const handleNewContext = () => {
    setCurrentContext(getRandomContext());
  };

  const handleStart = () => {
    if (currentContext) {
      setContext(currentContext);
      setPreparationTime(prepTime[0]);
      startSession();
      navigate('/preparation');
    }
  };

  if (!currentContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading context...</div>
      </div>
    );
  }

  const ContextIcon = contextTypeIcons[currentContext.type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/evaluation-scope')} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Context</h1>
              <p className="text-muted-foreground">Review this context before starting your practice</p>
            </div>
            <Button variant="outline" onClick={handleNewContext} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              New Context
            </Button>
          </div>

          {/* Context Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ContextIcon className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="secondary">
                  {contextTypeLabels[currentContext.type]}
                </Badge>
              </div>
              <CardTitle className="text-xl">{currentContext.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-line leading-relaxed">
                  {currentContext.content}
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  Questions you'll be asked:
                </h4>
                <ol className="space-y-2">
                  {currentContext.questions.map((question, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{question}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Preparation Time Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Preparation Time
              </CardTitle>
              <CardDescription>
                Choose how long you want to prepare (2-7 minutes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">2 min</span>
                  <span className="text-2xl font-bold text-primary">{prepTime[0]} minutes</span>
                  <span className="text-sm text-muted-foreground">7 min</span>
                </div>
                <Slider
                  value={prepTime}
                  onValueChange={setPrepTime}
                  min={2}
                  max={7}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="flex justify-end">
            <Button size="lg" onClick={handleStart} className="gap-2">
              Start Preparation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
