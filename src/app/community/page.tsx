'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Thread } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
        router.replace('/login?redirect=/community');
        return;
    }

    const q = query(collection(db, 'threads'), orderBy('lastReplyAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Thread));
      setThreads(threadsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching threads: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, authLoading, router]);
  
  if (authLoading || loading) {
      return <CommunityPageSkeleton />;
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Community Discussions</h1>
          <p className="text-muted-foreground">Ask questions, share ideas, and connect with other learners.</p>
        </div>
        <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
          <Link href="/community/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Start a Discussion
          </Link>
        </Button>
      </div>
      
      {threads.length === 0 ? (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold mt-4">No discussions yet</h3>
            <p className="text-muted-foreground mt-2">Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
            {threads.map(thread => (
                <Link href={`/community/${thread.id}`} key={thread.id} className="block">
                    <Card className="hover:border-accent transition-colors">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">{thread.title}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={thread.authorPhotoURL} />
                                    <AvatarFallback>{thread.authorName?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span>{thread.authorName}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>{thread.replyCount || 0} replies</span>
                                <span>
                                    {thread.createdAt?.toDate && formatDistanceToNow(thread.createdAt.toDate(), { addSuffix: true })}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
      )}
    </div>
  );
}

function CommunityPageSkeleton() {
    return (
         <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-5 w-96 mt-2" />
                </div>
                <Skeleton className="h-10 w-48" />
            </div>
             <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                           <Skeleton className="h-7 w-3/4" />
                        </CardHeader>
                        <CardFooter className="flex justify-between items-center">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-40" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
