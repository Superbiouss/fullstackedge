'use client';

import type { Lesson, Quiz } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { QuizViewer } from './quiz-viewer';

interface LessonContentProps {
  lesson: Lesson;
  quiz?: Quiz;
  isCompleted: boolean;
  onMarkComplete: () => void;
}

export function LessonContent({ lesson, quiz, isCompleted, onMarkComplete }: LessonContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
      <h1 className="text-3xl md:text-4xl font-bold font-headline text-accent mb-4">{lesson.title}</h1>
      
      {lesson.type === 'video' ? (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-border shadow-lg mb-6">
          <video src={lesson.content} controls className="w-full h-full object-contain">
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <article className="prose prose-invert max-w-none prose-pre:bg-card prose-pre:p-4 prose-pre:rounded-md mb-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
        </article>
      )}

      {quiz && <QuizViewer quiz={quiz} />}
      
      <div className="mt-8 pt-6 border-t border-border">
        <Button 
          onClick={onMarkComplete}
          disabled={isCompleted}
          size="lg"
          className="font-bold w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/70 disabled:text-primary-foreground/80 disabled:cursor-not-allowed"
        >
          <CheckCircle className="mr-2" />
          {isCompleted ? 'Completed' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  );
}

// Basic prose styling for markdown content, since we don't have the typography plugin
// The 'prose' and 'prose-invert' classes are placeholders here.
// You'd typically add @tailwindcss/typography for this.
// For now, we rely on existing text colors and some manual styling.
// A global CSS entry could be:
// .prose h1, .prose h2 { color: hsl(var(--accent)); }
// .prose p, .prose li { color: hsl(var(--foreground)); }
// etc.
