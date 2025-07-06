'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(coursesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Courses</h1>
          <p className="text-muted-foreground">Manage your courses here.</p>
        </div>
        <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
          <Link href="/admin/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Course
          </Link>
        </Button>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader className="p-0">
                <div className="relative w-full h-40">
                  <Image
                    src={course.thumbnailUrl || 'https://placehold.co/600x400.png'}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                 <div className="p-6">
                    <div className='flex justify-between items-start'>
                        <CardTitle className="font-headline text-xl mb-2">{course.title}</CardTitle>
                        <Badge variant={course.isPaid ? 'default' : 'secondary'}>
                            {course.isPaid ? `$${course.price}` : 'Free'}
                        </Badge>
                    </div>
                    <CardDescription>{course.description.substring(0, 100)}...</CardDescription>
                 </div>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/admin/courses/${course.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
