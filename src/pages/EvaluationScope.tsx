import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Zap, Settings } from 'lucide-react';
import { EvaluationAspect } from '@/types';

const evaluationAspects: { id: EvaluationAspect; label: string; description: string; defaultEnabled: boolean }[] = [
  { id: 'speechFluency', label: 'Speech & Fluency', description: 'Filler words, pace, and pauses', defaultEnabled: true },
  { id: 'confidence', label: 'Confidence', description: 'Volume consistency and speaking stability', defaultEnabled: true },
  { id: 'posture', label: 'Posture', description: 'Body alignment and professional stance', defaultEnabled: true },
  { id: 'eyeContact', label: 'Camera / Eye Contact', description: 'Looking at camera and face positioning', defaultEnabled: true },
  { id: 'outfitPresence', label: 'Outfit & Presence', description: 'Color contrast and formality', defaultEnabled: true },
  { id: 'clothingAssessment', label: 'Clothing Assessment', description: 'Neatness and appropriateness (Optional)', defaultEnabled: false },
  { id: 'contentRelativity', label: 'Content Relativity', description: 'Staying on-topic with the context', defaultEnabled: true },
];

export default function EvaluationScope() {
  const navigate = useNavigate();
  const { setEvaluationConfig } = useSession();
  const [mode, setMode] = useState<'default' | 'custom'>('default');
  const [selectedAspects, setSelectedAspects] = useState<EvaluationAspect[]>(
    evaluationAspects.filter(a => a.defaultEnabled).map(a => a.id)
  );

  const handleModeChange = (newMode: 'default' | 'custom') => {
    setMode(newMode);
    if (newMode === 'default') {
      setSelectedAspects(evaluationAspects.filter(a => a.defaultEnabled).map(a => a.id));
    }
  };

  const handleAspectToggle = (aspectId: EvaluationAspect) => {
    setSelectedAspects(prev => 
      prev.includes(aspectId)
        ? prev.filter(id => id !== aspectId)
        : [...prev, aspectId]
    );
  };

  const handleContinue = () => {
    setEvaluationConfig({ mode, aspects: selectedAspects });
    navigate('/context-display');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/mode-selection')} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            Evaluation Scope
          </h1>
          <p className="text-center text-muted-foreground mb-10">
            Choose what aspects you want to be evaluated on
          </p>

          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card 
              className={`cursor-pointer transition-all ${mode === 'default' ? 'border-primary shadow-md' : 'hover:border-primary/50'}`}
              onClick={() => handleModeChange('default')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mode === 'default' ? 'bg-primary' : 'bg-muted'}`}>
                  <Zap className={`w-5 h-5 ${mode === 'default' ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Default Mode</h3>
                  <p className="text-sm text-muted-foreground">Standard evaluation</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${mode === 'custom' ? 'border-primary shadow-md' : 'hover:border-primary/50'}`}
              onClick={() => handleModeChange('custom')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mode === 'custom' ? 'bg-primary' : 'bg-muted'}`}>
                  <Settings className={`w-5 h-5 ${mode === 'custom' ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Custom Mode</h3>
                  <p className="text-sm text-muted-foreground">Choose aspects</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Aspects List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evaluation Aspects</CardTitle>
              <CardDescription>
                {mode === 'default' 
                  ? 'These aspects will be evaluated in default mode'
                  : 'Select the aspects you want to focus on'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {evaluationAspects.map((aspect) => (
                <div 
                  key={aspect.id}
                  className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${
                    selectedAspects.includes(aspect.id) ? 'bg-primary/5' : 'bg-muted/50'
                  }`}
                >
                  <Checkbox
                    id={aspect.id}
                    checked={selectedAspects.includes(aspect.id)}
                    onCheckedChange={() => handleAspectToggle(aspect.id)}
                    disabled={mode === 'default'}
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={aspect.id} 
                      className={`cursor-pointer ${mode === 'default' ? 'cursor-not-allowed' : ''}`}
                    >
                      {aspect.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{aspect.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleContinue} disabled={selectedAspects.length === 0} className="gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
