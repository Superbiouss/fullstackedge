'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course, UserProgress } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Loader2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Footer } from '@/components/footer';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const unsubscribeCourses = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(coursesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching courses: ", error);
      setLoading(false);
    });

    const progressQuery = query(collection(db, 'userProgress', user.uid, 'courses'));
    const unsubscribeProgress = onSnapshot(progressQuery, (snapshot) => {
        const progressRecords: Record<string, UserProgress> = {};
        snapshot.forEach(doc => {
            progressRecords[doc.id] = doc.data() as UserProgress;
        });
        setProgressData(progressRecords);
    });

    return () => {
      unsubscribeCourses();
      unsubscribeProgress();
    };
  }, [user, authLoading, router]);

  const handlePurchase = async (course: Course) => {
    if (!user) {
        router.push(`/login?redirect=/dashboard`);
        return;
    }
    setIsPurchasing(course.id);
    try {
        const response = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId: course.id, userId: user.uid })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create checkout session');
        }

        const { url } = await response.json();
        if (url) {
            window.location.href = url;
        }
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not initiate purchase.' });
        setIsPurchasing(null);
    }
  };

  if (authLoading || loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold font-headline text-gray-200">
            Welcome back, <span className="text-accent">{user.email?.split('@')[0]}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Ready to dive in? Here are your available courses.</p>
          
          <div className="mt-8">
             {courses.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">No courses available yet</h3>
                    <p className="text-muted-foreground mt-2">Check back soon for new content!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                    const hasAccess = !course.isPaid || !!userProfile?.purchasedCourses?.includes(course.id);
                    const userProgress = progressData[course.id];
                    const completedLessons = userProgress?.completedLessons?.length || 0;
                    const totalLessons = course.lessonCount || 0;
                    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

                    return (
                        <Card key={course.id} className="flex flex-col">
                          <CardHeader className="p-0">
                              <div className="relative w-full h-40">
                                <Image
                                  src={course.thumbnailUrl || 'https://placehold.co/600x400.png'}
                                  alt={course.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  className="object-cover rounded-t-lg"
                                  data-ai-hint="online course"
                                />
                              </div>
                              <div className="p-6">
                                  <div className='flex justify-between items-start gap-2'>
                                      <CardTitle className="font-headline text-xl mb-2">{course.title}</CardTitle>
                                      <Badge variant={course.isPaid ? 'default' : 'secondary'} className="whitespace-nowrap">
                                          {course.isPaid ? `$${course.price}` : 'Free'}
                                      </Badge>
                                  </div>
                                  <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                              </div>
                          </CardHeader>
                          <CardContent className="flex-1">
                            {hasAccess && totalLessons > 0 && (
                                <div className="space-y-2">
                                    <Progress value={progressPercentage} className="h-2 [&>div]:bg-primary" />
                                    <p className="text-xs text-muted-foreground">{completedLessons} / {totalLessons} lessons completed</p>
                                </div>
                            )}
                          </CardContent>
                          <CardFooter>
                            {hasAccess ? (
                                  <Button asChild className="w-full font-bold">
                                      <Link href={`/courses/${course.id}`}>
                                          {progressPercentage > 0 && progressPercentage < 100 ? 'Continue Learning' : 'Start Learning'} <ArrowRight className="ml-2 h-4 w-4" />
                                      </Link>
                                  </Button>
                              ) : (
                                  <Button 
                                      onClick={() => handlePurchase(course)} 
                                      disabled={isPurchasing === course.id}
                                      className="w-full font-bold"
                                      style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
                                  >
                                      {isPurchasing === course.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                                      Buy for ${course.price}
                                  </Button>
                              )}
                          </CardFooter>
                        </Card>
                    );
                })}
                </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DashboardSkeleton() {
  return (
     <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-6 w-3/4 mt-3" />
          
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="p-0">
                     <Skeleton className="w-full h-40 rounded-t-lg" />
                     <div className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2 mt-1" />
                     </div>
                  </CardHeader>
                  <CardFooter>
                     <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
