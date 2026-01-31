import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, BookOpen, LogOut, User, Mic, Camera, Brain, Award } from 'lucide-react';

export default function Landing() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const features = [
    { icon: Mic, title: 'Speech Analysis', description: 'Real-time fluency and clarity feedback' },
    { icon: Camera, title: 'Visual Presence', description: 'Posture and eye contact evaluation' },
    { icon: Brain, title: 'Content Relevance', description: 'Stay on-topic guidance' },
    { icon: Award, title: 'Detailed Reports', description: 'Actionable improvement tips' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Interview Coach</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Master Your <span className="text-primary">Interview Skills</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Practice with AI-powered feedback on your communication, presence, and confidence. 
            Get personalized tips to improve how you present yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/mode-selection')} className="gap-2">
              <Play className="w-5 h-5" />
              Start Practice
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/how-it-works')} className="gap-2">
              <BookOpen className="w-5 h-5" />
              How It Works
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">6+</div>
              <div className="text-sm text-muted-foreground">Practice Scenarios</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">7</div>
              <div className="text-sm text-muted-foreground">Evaluation Aspects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Personalized Tips</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
