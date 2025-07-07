'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Course } from '@/types';
import { Switch } from '../ui/switch';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  category: z.string().min(2, { message: 'Category is required.' }),
  isPaid: z.boolean().default(false),
  price: z.coerce.number().optional(),
  thumbnail: z.any().optional(),
}).refine(data => !data.isPaid || (data.isPaid && data.price && data.price > 0), {
  message: 'Price must be a positive number for paid courses.',
  path: ['price'],
});


export function CourseForm({ course }: { course?: Course }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      category: course?.category || '',
      isPaid: course?.isPaid || false,
      price: course?.price || undefined,
      thumbnail: undefined,
    },
  });

  const isPaid = form.watch('isPaid');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      let thumbnailUrl = course?.thumbnailUrl || '';
      const thumbnailFile = values.thumbnail?.[0];

      if (thumbnailFile) {
        const storageRef = ref(storage, `course-thumbnails/${Date.now()}-${thumbnailFile.name}`);
        const snapshot = await uploadBytes(storageRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(snapshot.ref);
      }

      const courseData = {
        ...values,
        price: values.isPaid ? values.price : 0,
        thumbnailUrl,
      };
      
      delete courseData.thumbnail;

      if (course) {
        // Update existing course
        const courseRef = doc(db, 'courses', course.id);
        await updateDoc(courseRef, courseData);
        toast({ title: 'Success', description: 'Course updated successfully.' });
        router.refresh();
      } else {
        // Create new course
        const docRef = await addDoc(collection(db, 'courses'), {
          ...courseData,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'Course created successfully.' });
        router.push(`/admin/courses/${docRef.id}`);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl><Input placeholder="e.g. The Next.js Bootcamp" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe the course..." {...field} rows={5} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl><Input placeholder="e.g. Web Development" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Course Thumbnail</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                    />
                  </FormControl>
                  <FormDescription>
                    {course?.thumbnailUrl && !value && "Current thumbnail is set. Upload a new file to replace it."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-4 rounded-lg border p-4">
                 <FormField
                    control={form.control}
                    name="isPaid"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between w-full">
                            <div className="space-y-0.5">
                                <FormLabel>Paid Course</FormLabel>
                                <FormDescription>
                                    Will this course require payment to access?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
                
            {isPaid && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                        <Input type="number" step="0.01" placeholder="29.99" className="pl-7" {...field} value={field.value ?? ''} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {course ? 'Save Changes' : 'Create Course'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
