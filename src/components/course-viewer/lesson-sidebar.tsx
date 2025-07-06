'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import type { Lesson, UserProgress } from '@/types';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface LessonSidebarProps {
  courseTitle: string;
  lessons: Lesson[];
  userProgress: UserProgress;
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

export function LessonSidebar({
  courseTitle,
  lessons,
  userProgress,
  selectedLessonId,
  onSelectLesson,
}: LessonSidebarProps) {
  return (
    <aside className="w-full md:w-80 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold font-headline truncate" title={courseTitle}>{courseTitle}</h2>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2">
          <ul>
            {lessons.map((lesson, index) => {
              const isCompleted = userProgress.completedLessons.includes(lesson.id);
              const isSelected = lesson.id === selectedLessonId;
              
              // For a future "drip content" feature, you could lock lessons:
              // const isLocked = index > 0 && !userProgress.completedLessons.includes(lessons[index - 1].id);
              const isLocked = false; 

              return (
                <li key={lesson.id}>
                  <Button
                    variant="ghost"
                    onClick={() => onSelectLesson(lesson.id)}
                    disabled={isLocked}
                    className={cn(
                      "w-full justify-start h-auto py-3 px-4 text-left whitespace-normal",
                      isSelected && "bg-accent/10 text-accent",
                      isLocked && "text-muted-foreground"
                    )}
                  >
                    {isLocked ? (
                      <Lock className="h-4 w-4 mr-3 shrink-0" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 mr-3 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
                    )}
                    <span className="flex-1">{index + 1}. {lesson.title}</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  );
}
