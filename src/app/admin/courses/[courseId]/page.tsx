'use client'

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CourseForm } from '@/components/admin/course-form';
import { LessonManager } from '@/components/admin/lesson-manager';
import { QuizManager } from '@/components/admin/quiz-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.courseId) {
      const fetchCourse = async () => {
        const docRef = doc(db, 'courses', params.courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
        }
        setLoading(false);
      };
      fetchCourse();
    }
  }, [params.courseId]);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-9 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (!course) {
    return <div>Course not found.</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Edit Course</h1>
        <p className="text-muted-foreground">Editing &quot;{course.title}&quot;</p>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <CourseForm course={course} />
        </TabsContent>
        <TabsContent value="lessons">
          <LessonManager courseId={course.id} />
        </TabsContent>
        <TabsContent value="quizzes">
            <QuizManager courseId={course.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
