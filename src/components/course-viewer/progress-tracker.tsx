'use client';

import { Progress } from '@/components/ui/progress';
import { Button } from '../ui/button';
import { Download, Loader2 } from 'lucide-react';
import type { UserProgress } from '@/types';

interface ProgressTrackerProps {
  totalLessons: number;
  completedLessons: number;
  isCourseComplete: boolean;
  userProgress: UserProgress;
  isGenerating: boolean;
  onGenerateCertificate: () => void;
}

export function ProgressTracker({
  totalLessons,
  completedLessons,
  isCourseComplete,
  userProgress,
  isGenerating,
  onGenerateCertificate,
}: ProgressTrackerProps) {
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="p-4 border-b border-border bg-card/50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Progress value={progressPercentage} className="h-3 [&>div]:bg-primary" />
        </div>

        {isCourseComplete ? (
          userProgress.certificateUrl ? (
            <Button asChild className="font-bold">
              <a href={userProgress.certificateUrl} target="_blank" rel="noopener noreferrer" download>
                View Certificate <Download className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button
              onClick={onGenerateCertificate}
              disabled={isGenerating}
              className="font-bold"
            >
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {isGenerating ? 'Generating...' : 'Download Certificate'}
            </Button>
          )
        ) : (
          <p className="text-sm font-medium text-muted-foreground w-48 text-right shrink-0">
            {Math.round(progressPercentage)}% Complete
          </p>
        )}
      </div>
    </div>
  );
}
