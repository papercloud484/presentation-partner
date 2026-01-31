import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, FileText, Timer, Video, MessageSquare, BarChart3 } from 'lucide-react';

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: FileText,
      title: '1. Choose Your Mode',
      description: 'Select between Interview Mode for Q&A practice or Presentation Mode for explanatory practice. Customize which aspects to evaluate.',
    },
    {
      icon: Timer,
      title: '2. Prepare with Context',
      description: 'Receive a random scenario, article, or case study. Use 2-7 minutes to prepare while the timer counts down. A popup alerts you 10 seconds before starting.',
    },
    {
      icon: Video,
      title: '3. Present & Explain',
      description: 'Read or explain the context aloud while the system analyzes your speech, posture, and presence through your camera.',
    },
    {
      icon: MessageSquare,
      title: '4. Answer Questions',
      description: 'In Interview Mode, the system asks 2-3 context-based questions verbally. Answer naturally while being evaluated on communication skills.',
    },
    {
      icon: BarChart3,
      title: '5. Get Feedback',
      description: 'Receive detailed scores on speech fluency, confidence, posture, eye contact, and content relevance. Get personalized tips for improvement.',
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
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            Learn how the Interview Coach helps you improve your communication skills
          </p>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6 flex gap-6 items-start">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={() => navigate('/mode-selection')} className="gap-2">
              Start Practice Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
