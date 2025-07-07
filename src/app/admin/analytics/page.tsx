'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, BookCopy, UserCheck, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AnalyticsPage() {
  const [platformStats, setPlatformStats] = useState({ users: 0, courses: 0, enrollments: 0 });
  const [courseEnrollments, setCourseEnrollments] = useState<{ name: string; enrollments: number }[]>([]);
  const [financialStats, setFinancialStats] = useState<{ totalRevenue: number; revenueChartData: any[] }>({ totalRevenue: 0, revenueChartData: [] });
  const [loading, setLoading] = useState(true);
  const [financialLoading, setFinancialLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformData = async () => {
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

        setPlatformStats({ users: totalUsers, courses: totalCourses, enrollments: totalEnrollments });
        setCourseEnrollments(enrollmentChartData);
      } catch (error) {
        console.error("Error fetching platform data: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFinancialData = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (!response.ok) {
                throw new Error('Failed to fetch financial stats');
            }
            const data = await response.json();
            setFinancialStats(data);
        } catch (error) {
            console.error("Error fetching financial data: ", error);
        } finally {
            setFinancialLoading(false);
        }
    }

    fetchPlatformData();
    fetchFinancialData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Analytics</h1>
            <p className="text-muted-foreground">An overview of your platform's performance.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
        </div>
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Analytics</h1>
            <p className="text-muted-foreground">An overview of your platform's performance.</p>
        </div>
      
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {financialLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{formatCurrency(financialStats.totalRevenue)}</div>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{platformStats.users}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <BookCopy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{platformStats.courses}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{platformStats.enrollments}</div>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Revenue (Last 30 Days)</CardTitle>
                    <CardDescription>Daily revenue from course sales.</CardDescription>
                </CardHeader>
                <CardContent>
                    {financialLoading ? <Skeleton className="h-80 w-full" /> : (
                         financialStats.revenueChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={financialStats.revenueChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                        formatter={(value) => formatCurrency(value as number)}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground">No revenue data to display yet.</p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Enrollments per Course</CardTitle>
                    <CardDescription>Most popular courses by student enrollment.</CardDescription>
                </CardHeader>
                <CardContent>
                    {courseEnrollments.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
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
                                <Bar dataKey="enrollments" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
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
    </div>
  );
}
