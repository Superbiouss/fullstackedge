'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Lesson } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Video, Type, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

const formSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  type: z.enum(['text', 'video']),
  content: z.any(),
}).refine(data => {
    if (data.type === 'video') return data.content?.length > 0;
    if (data.type === 'text') return typeof data.content === 'string' && data.content.length > 10;
    return false;
}, {
    message: 'Content is required.',
    path: ['content'],
});


export function LessonManager({ courseId }: { courseId: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'text',
      content: '',
    },
  });

  const lessonType = form.watch('type');

  useEffect(() => {
    const q = query(collection(db, 'courses', courseId, 'lessons'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
      setLessons(lessonsData);
    });
    return () => unsubscribe();
  }, [courseId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      let contentUrlOrText = values.content;
      if (values.type === 'video' && values.content?.[0]) {
        const file = values.content[0];
        const storageRef = ref(storage, `lessons/${courseId}/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        contentUrlOrText = await getDownloadURL(snapshot.ref);
      }
      
      await addDoc(collection(db, 'courses', courseId, 'lessons'), {
        title: values.title,
        type: values.type,
        content: contentUrlOrText,
        createdAt: serverTimestamp(),
      });

      toast({ title: 'Success', description: 'Lesson added successfully.' });
      form.reset();
      form.setValue('content', '');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (lessonId: string) => {
    try {
        await deleteDoc(doc(db, 'courses', courseId, 'lessons', lessonId));
        toast({ title: 'Success', description: 'Lesson deleted.' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not delete lesson.' });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Add New Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Lesson 1: Introduction" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={(value) => { field.onChange(value); form.setValue('content', ''); }} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="text">Text (Markdown)</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>{lessonType === 'text' ? 'Text Content' : 'Video File'}</FormLabel>
                    <FormControl>
                      {lessonType === 'text' ? (
                        <Textarea placeholder="Write your lesson content here..." rows={8} onChange={onChange} {...rest} />
                      ) : (
                        <Input type="file" accept="video/*" onChange={(e) => onChange(e.target.files)} {...rest} />
                      )}
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isLoading} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Lesson
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Lessons</CardTitle>
            <CardDescription>{lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'} in this course.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground font-bold">{index + 1}</span>
                    {lesson.type === 'video' ? <Video className="h-5 w-5 text-accent" /> : <Type className="h-5 w-5 text-accent" />}
                    <span className="font-medium">{lesson.title}</span>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the lesson
                          and any associated quizzes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(lesson.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
              {lessons.length === 0 && <p className="text-muted-foreground text-center py-8">No lessons yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
