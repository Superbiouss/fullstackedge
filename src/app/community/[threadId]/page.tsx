'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot, collection, query, orderBy, addDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import type { Thread, Reply } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const replySchema = z.object({
  content: z.string().min(1, { message: 'Reply cannot be empty.' }),
});

export default function ThreadPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const threadId = params.threadId as string;
  const { toast } = useToast();

  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: { content: '' },
  });

  useEffect(() => {
    if (!threadId) return;

    const threadRef = doc(db, 'threads', threadId);
    const unsubscribeThread = onSnapshot(threadRef, (docSnap) => {
      if (docSnap.exists()) {
        setThread({ id: docSnap.id, ...docSnap.data() } as Thread);
      } else {
        router.replace('/community');
      }
      setLoading(false);
    });

    const repliesQuery = query(collection(db, 'threads', threadId, 'replies'), orderBy('createdAt', 'asc'));
    const unsubscribeReplies = onSnapshot(repliesQuery, (snapshot) => {
      const repliesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reply));
      setReplies(repliesData);
    });

    return () => {
      unsubscribeThread();
      unsubscribeReplies();
    };
  }, [threadId, router]);

  async function onReplySubmit(values: z.infer<typeof replySchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to reply.' });
        return;
    }
    setIsReplying(true);
    try {
        const repliesColRef = collection(db, 'threads', threadId, 'replies');
        await addDoc(repliesColRef, {
            content: values.content,
            authorId: user.uid,
            authorName: user.displayName || user.email,
            authorPhotoURL: user.photoURL || '',
            createdAt: serverTimestamp(),
        });

        const threadRef = doc(db, 'threads', threadId);
        await updateDoc(threadRef, {
            replyCount: increment(1),
            lastReplyAt: serverTimestamp(),
        });

        form.reset();
        toast({ title: 'Success', description: 'Your reply has been posted.' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
        setIsReplying(false);
    }
  }


  if (loading || authLoading) {
    return <ThreadPageSkeleton />;
  }
  
  if (!thread) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold">Thread not found</h2>
            <p className="text-muted-foreground">This discussion may have been deleted.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/community">Return to community</Link>
            </Button>
        </div>
    )
  }

  return (
    <div>
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/community">&larr; Back to all discussions</Link>
      </Button>

      <Card>
        <CardHeader>
            <h1 className="text-3xl font-bold font-headline">{thread.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={thread.authorPhotoURL} />
                    <AvatarFallback>{thread.authorName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>Posted by <strong>{thread.authorName}</strong></span>
                <span>•</span>
                <span>{thread.createdAt?.toDate && format(thread.createdAt.toDate(), 'PPP')}</span>
            </div>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none prose-pre:bg-card prose-pre:p-4 prose-pre:rounded-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{thread.content}</ReactMarkdown>
        </CardContent>
      </Card>
      
      <div className="my-8">
        <h2 className="text-2xl font-bold font-headline mb-4">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</h2>
        <div className="space-y-6">
            {replies.map(reply => (
                <Card key={reply.id} className="bg-card/50">
                    <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                         <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.authorPhotoURL} />
                            <AvatarFallback>{reply.authorName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                            <span className="font-semibold">{reply.authorName}</span>
                            <span className="text-muted-foreground ml-2">
                                {reply.createdAt?.toDate && format(reply.createdAt.toDate(), 'MMM d, yyyy h:mm a')}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none text-sm pt-0">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{reply.content}</ReactMarkdown>
                    </CardContent>
                </Card>
            ))}
             {replies.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
                </div>
            )}
        </div>
      </div>
      
      {user && (
        <Card className="mt-8">
            <CardHeader><h3 className="font-headline text-lg">Your Reply</h3></CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onReplySubmit)} className="space-y-4">
                        <FormField control={form.control} name="content" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="Share your thoughts... (Markdown is supported)" {...field} rows={5} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isReplying}>
                            {isReplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Post Reply
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

function ThreadPageSkeleton() {
    return (
        <div>
            <Skeleton className="h-9 w-48 mb-4" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-9 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                </CardContent>
            </Card>
            <div className="my-8">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <Card key={i} className="bg-card/50">
                            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-5 w-40" />
                            </CardHeader>
                            <CardContent className="pt-0 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
