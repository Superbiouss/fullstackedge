'use client';

import type { Course, Lesson, Quiz, UserProgress } from '@/types';
import { LessonSidebar } from './lesson-sidebar';
import { LessonContent } from './lesson-content';
import { ProgressTracker } from './progress-tracker';

interface CoursePlayerProps {
  course: Course;
  lessons: Lesson[];
  quizzes: Quiz[];
  userProgress: UserProgress;
  selectedLesson: Lesson | undefined;
  selectedLessonQuiz: Quiz | undefined;
  onSelectLesson: (lessonId: string) => void;
  onMarkComplete: (lessonId: string) => void;
}

export function CoursePlayer({
  course,
  lessons,
  userProgress,
  selectedLesson,
  selectedLessonQuiz,
  onSelectLesson,
  onMarkComplete,
}: CoursePlayerProps) {
  
  const isLessonCompleted = (lessonId: string) => {
    return userProgress.completedLessons.includes(lessonId);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-var(--header-height))]">
      <LessonSidebar
        courseTitle={course.title}
        lessons={lessons}
        userProgress={userProgress}
        selectedLessonId={selectedLesson?.id || null}
        onSelectLesson={onSelectLesson}
      />
      <div className="flex-1 flex flex-col">
        <ProgressTracker
          totalLessons={lessons.length}
          completedLessons={userProgress.completedLessons.length}
        />
        {selectedLesson && (
          <LessonContent
            key={selectedLesson.id}
            lesson={selectedLesson}
            quiz={selectedLessonQuiz}
            isCompleted={isLessonCompleted(selectedLesson.id)}
            onMarkComplete={() => onMarkComplete(selectedLesson.id)}
          />
        )}
      </div>
    </div>
  );
}
