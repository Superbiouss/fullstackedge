'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, BookCopy, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0 });
  const [courseEnrollments, setCourseEnrollments] = useState<{ name: string; enrollments: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersQuery = collection(db, 'users');
        const coursesQuery = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));

        const [usersSnapshot, coursesSnapshot] = await Promise.all([
          getDocs(usersQuery),
          getDocs(coursesQuery),
        ]);

        const totalUsers = usersSnapshot.size;
        const totalCourses = coursesSnapshot.size;

        const coursesData = coursesSnapshot.docs.map(doc => doc.data() as Course);
        
        const totalEnrollments = coursesData.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
        
        const enrollmentChartData = coursesData
          .filter(course => (course.enrollmentCount || 0) > 0)
          .map(course => ({
            name: course.title,
            enrollments: course.enrollmentCount || 0,
          }))
          .sort((a, b) => b.enrollments - a.enrollments);

        setStats({ users: totalUsers, courses: totalCourses, enrollments: totalEnrollments });
        setCourseEnrollments(enrollmentChartData);
      } catch (error) {
        console.error("Error fetching analytics data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Analytics</h1>
            <p className="text-muted-foreground">An overview of your platform's performance.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Analytics</h1>
            <p className="text-muted-foreground">An overview of your platform's performance.</p>
        </div>
      
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.users}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <BookCopy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.courses}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.enrollments}</div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Enrollments per Course</CardTitle>
            </CardHeader>
            <CardContent>
                {courseEnrollments.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={courseEnrollments} layout="vertical" margin={{ left: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={150} 
                                tickLine={false} 
                                axisLine={false} 
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={12} 
                                tick={{ dx: -10 }} 
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No enrollment data to display yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
