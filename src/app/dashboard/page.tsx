'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold font-headline text-gray-200">
            Welcome back, <span className="text-accent">{user.email}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Ready to dive in? Here are your available courses.</p>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold font-headline mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder Course Cards */}
              <Card>
                <CardHeader>
                  <div className="w-full h-40 bg-muted rounded-md mb-4" data-ai-hint="abstract code">
                    <img src="https://placehold.co/600x400.png" alt="Course thumbnail" className="w-full h-full object-cover rounded-md" />
                  </div>
                  <CardTitle className="font-headline text-xl">The Next.js Bootcamp</CardTitle>
                  <CardDescription>Master server-side rendering, data fetching, and more.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full font-bold">Continue Learning</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                   <div className="w-full h-40 bg-muted rounded-md mb-4" data-ai-hint="firebase logo">
                    <img src="https://placehold.co/600x400.png" alt="Course thumbnail" className="w-full h-full object-cover rounded-md" />
                  </div>
                  <CardTitle className="font-headline text-xl">Firebase for Full-Stack</CardTitle>
                  <CardDescription>Learn Auth, Firestore, and Storage to build scalable apps.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full font-bold">Start Course</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-full h-40 bg-muted rounded-md mb-4" data-ai-hint="design system">
                    <img src="https://placehold.co/600x400.png" alt="Course thumbnail" className="w-full h-full object-cover rounded-md" />
                  </div>
                  <CardTitle className="font-headline text-xl">Advanced Tailwind CSS</CardTitle>
                  <CardDescription>Go beyond the basics and create beautiful, custom designs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full font-bold" variant="secondary">Coming Soon</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
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
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Skeleton className="w-full h-40 rounded-md mb-4" />
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-5 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="w-full h-40 rounded-md mb-4" />
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-5 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="w-full h-40 rounded-md mb-4" />
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-5 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
