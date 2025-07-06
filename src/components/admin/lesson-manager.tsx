'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Lesson } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Video, Type } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  type: z.enum(['text', 'video']),
  content: z.any(),
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
    },
  });

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
      let content = values.content;
      if (values.type === 'video' && values.content?.[0]) {
        const file = values.content[0];
        const storageRef = ref(storage, `lessons/${courseId}/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        content = await getDownloadURL(snapshot.ref);
      }
      
      await addDoc(collection(db, 'courses', courseId, 'lessons'), {
        title: values.title,
        type: values.type,
        content: content,
        createdAt: serverTimestamp(),
      });

      toast({ title: 'Success', description: 'Lesson added successfully.' });
      form.reset();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Add New Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{form.getValues('type') === 'text' ? 'Text Content (Markdown)' : 'Video File'}</FormLabel>
                    <FormControl>
                      {form.getValues('type') === 'text' ? (
                        <Textarea {...field} />
                      ) : (
                        <Input type="file" accept="video/*" onChange={(e) => field.onChange(e.target.files)} />
                      )}
                    </FormControl>
                  </FormItem>
                )} />
                <Button type="submit" disabled={isLoading} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Lessons</CardTitle>
            <CardDescription>{lessons.length} lessons in this course.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {lesson.type === 'video' ? <Video className="h-5 w-5 text-accent" /> : <Type className="h-5 w-5 text-accent" />}
                    <span>{lesson.title}</span>
                  </div>
                  {/* Edit/Delete buttons can be added here */}
                </div>
              ))}
              {lessons.length === 0 && <p className="text-muted-foreground text-center">No lessons yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
