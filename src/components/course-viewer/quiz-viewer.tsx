'use client';

import { useState } from 'react';
import type { Quiz } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizViewerProps {
  quiz: Quiz;
}

export function QuizViewer({ quiz }: QuizViewerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);
    setIsCorrect(selectedAnswer === quiz.correctAnswer);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  }

  return (
    <Card className="my-8 bg-card/50 border-accent/20">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Knowledge Check</CardTitle>
        <CardDescription>{quiz.question}</CardDescription>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
          <div className="space-y-4">
            <RadioGroup
              value={selectedAnswer ?? ''}
              onValueChange={setSelectedAnswer}
              className="space-y-3"
            >
              {quiz.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q-${quiz.id}-opt-${index}`} />
                  <Label htmlFor={`q-${quiz.id}-opt-${index}`} className="font-normal text-base">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={handleSubmit} disabled={!selectedAnswer} className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
              Check Answer
            </Button>
          </div>
        ) : (
          <div>
            <Alert variant={isCorrect ? 'default' : 'destructive'} className={isCorrect ? 'border-primary/50' : 'border-destructive/50'}>
              {isCorrect ? 
                <CheckCircle className="h-4 w-4" color="hsl(var(--primary))" /> : 
                <XCircle className="h-4 w-4" />
              }
              <AlertTitle>{isCorrect ? 'Correct!' : 'Not Quite'}</AlertTitle>
              <AlertDescription>
                {isCorrect 
                    ? "Great job! You nailed it."
                    : `The correct answer was: ${quiz.correctAnswer}`
                }
              </AlertDescription>
            </Alert>
            <Button onClick={handleReset} variant="outline" className="mt-4">
                Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
