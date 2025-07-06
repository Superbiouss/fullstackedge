'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressTrackerProps {
  totalLessons: number;
  completedLessons: number;
}

export function ProgressTracker({ totalLessons, completedLessons }: ProgressTrackerProps) {
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="p-4 border-b border-border bg-card/50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Progress value={progressPercentage} className="h-3 [&>div]:bg-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground w-28 text-right">
          {Math.round(progressPercentage)}% Complete
        </p>
      </div>
    </div>
  );
}
