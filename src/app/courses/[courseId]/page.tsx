'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, onSnapshot, collection, query, orderBy, setDoc, arrayUnion, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Course, Lesson, Quiz, UserProgress } from '@/types';
import { CoursePlayer } from '@/components/course-viewer/course-player';
import { Skeleton } from '@/components/ui/skeleton';
import { generateCertificateSVG } from '@/lib/certificate-template';
import { useToast } from '@/hooks/use-toast';

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);

  const courseId = params.courseId;

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/courses/${courseId}`);
    }
  }, [user, authLoading, courseId, router]);

  // Fetch course, lessons, and quizzes
  useEffect(() => {
    if (!courseId) return;

    setLoading(true);

    const courseRef = doc(db, 'courses', courseId);
    const unsubscribeCourse = onSnapshot(courseRef, (docSnap) => {
      if (docSnap.exists()) {
        setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
      } else {
        router.replace('/dashboard');
      }
    });

    const lessonsQuery = query(collection(db, 'courses', courseId, 'lessons'), orderBy('createdAt', 'asc'));
    const unsubscribeLessons = onSnapshot(lessonsQuery, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
      setLessons(lessonsData);
      if (!selectedLessonId && lessonsData.length > 0) {
        setSelectedLessonId(lessonsData[0].id);
      }
    });

    const quizzesQuery = query(collection(db, 'courses', courseId, 'quizzes'));
    const unsubscribeQuizzes = onSnapshot(quizzesQuery, (snapshot) => {
      const quizzesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
      setQuizzes(quizzesData);
    });

    Promise.all([
        getDoc(courseRef),
        new Promise(resolve => onSnapshot(lessonsQuery, () => resolve(true), { once: true })),
    ]).then(() => setLoading(false));

    return () => {
      unsubscribeCourse();
      unsubscribeLessons();
      unsubscribeQuizzes();
    };
  }, [courseId, router, selectedLessonId]);

  // Fetch user progress
  useEffect(() => {
    if (!user) return;
    const progressRef = doc(db, 'userProgress', user.uid, 'courses', courseId);
    const unsubscribeProgress = onSnapshot(progressRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProgress(docSnap.data() as UserProgress);
      } else {
        setUserProgress({ completedLessons: [] });
      }
    });
    return () => unsubscribeProgress();
  }, [user, courseId]);

  const handleMarkComplete = async (lessonId: string) => {
    if (!user || userProgress?.completedLessons.includes(lessonId)) return;
    const progressRef = doc(db, 'userProgress', user.uid, 'courses', courseId);
    try {
      await setDoc(progressRef, {
        completedLessons: arrayUnion(lessonId)
      }, { merge: true });
    } catch (error) {
      console.error("Error marking lesson as complete: ", error);
    }
  };
  
  const handleGenerateCertificate = async () => {
    if (!user || !course || !userProgress || userProgress.certificateUrl) return;

    setIsGeneratingCertificate(true);
    try {
      const studentName = user.displayName || user.email?.split('@')[0] || 'Student';
      const completionDate = new Date();
      const completionDateString = completionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const svgString = generateCertificateSVG({
        studentName,
        courseTitle: course.title,
        completionDate: completionDateString,
      });

      const certificateBlob = new Blob([svgString], { type: 'image/svg+xml' });
      const storageRef = ref(storage, `certificates/${user.uid}/${course.id}.svg`);
      
      const snapshot = await uploadBytes(storageRef, certificateBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const progressRef = doc(db, 'userProgress', user.uid, 'courses', courseId);
      await updateDoc(progressRef, {
        certificateUrl: downloadURL,
        completionDate: serverTimestamp(),
      });
      
      toast({ title: "Certificate Generated!", description: "Your certificate has been saved and is downloading."});

      const link = document.createElement('a');
      link.href = URL.createObjectURL(certificateBlob);
      link.download = `FullStackEdge_${course.title.replace(/\s+/g, '_')}_Certificate.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error generating certificate: ", error);
      toast({ variant: 'destructive', title: "Error", description: "Could not generate certificate." });
    } finally {
      setIsGeneratingCertificate(false);
    }
  };


  const selectedLesson = useMemo(() => {
    return lessons.find(lesson => lesson.id === selectedLessonId);
  }, [lessons, selectedLessonId]);

  const selectedLessonQuiz = useMemo(() => {
    return quizzes.find(quiz => quiz.lessonId === selectedLessonId);
  }, [quizzes, selectedLessonId]);

  if (loading || authLoading || !course || !userProgress) {
    return <CoursePageSkeleton />;
  }

  return (
    <CoursePlayer
      course={course}
      lessons={lessons}
      quizzes={quizzes}
      userProgress={userProgress}
      selectedLesson={selectedLesson}
      selectedLessonQuiz={selectedLessonQuiz}
      isGeneratingCertificate={isGeneratingCertificate}
      onSelectLesson={setSelectedLessonId}
      onMarkComplete={handleMarkComplete}
      onGenerateCertificate={handleGenerateCertificate}
    />
  );
}

function CoursePageSkeleton() {
  return (
    <div className="flex h-[calc(100vh-var(--header-height))]">
      <aside className="w-80 border-r border-border p-4 space-y-2 hidden md:flex flex-col">
         <Skeleton className="h-8 w-full mb-4" />
         <Skeleton className="h-6 w-3/4" />
         <div className="flex-1 space-y-3 mt-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-9 w-full rounded-md" />)}
         </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 md:p-8 lg:p-10 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="aspect-video">
                <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}
