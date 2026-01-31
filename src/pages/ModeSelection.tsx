import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Presentation } from 'lucide-react';
import { PracticeMode } from '@/types';

export default function ModeSelection() {
  const navigate = useNavigate();
  const { setPracticeMode } = useSession();

  const handleSelectMode = (mode: PracticeMode) => {
    setPracticeMode(mode);
    navigate('/evaluation-scope');
  };

  const modes = [
    {
      id: 'interview' as PracticeMode,
      icon: Users,
      title: 'Interview Mode',
      description: 'Practice answering questions from an AI interview panel. Ideal for job interview preparation.',
      features: ['Context-based Q&A', 'Voice questions', 'Full evaluation'],
    },
    {
      id: 'presentation' as PracticeMode,
      icon: Presentation,
      title: 'Presentation Mode',
      description: 'Practice explaining concepts and presenting information clearly and confidently.',
      features: ['Explanation practice', 'Speaking fluency', 'Presence evaluation'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/landing')} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            Select Practice Mode
          </h1>
          <p className="text-center text-muted-foreground mb-10">
            Choose how you want to practice today
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {modes.map((mode) => (
              <Card 
                key={mode.id}
                className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                onClick={() => handleSelectMode(mode.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <mode.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>{mode.title}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    Select {mode.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
