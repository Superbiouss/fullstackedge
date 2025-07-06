'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { Lesson, Quiz } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, X } from 'lucide-react';

const quizFormSchema = z.object({
  lessonId: z.string().min(1, 'Please select a lesson'),
  question: z.string().min(5, 'Question is required'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least two options are required'),
  correctAnswer: z.string().min(1, 'Please select a correct answer'),
});

export function QuizManager({ courseId }: { courseId: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      lessonId: '',
      question: '',
      options: ['', ''],
      correctAnswer: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  useEffect(() => {
    const fetchLessonsAndQuizzes = async () => {
      const lessonsQuery = query(collection(db, 'courses', courseId, 'lessons'), orderBy('createdAt', 'asc'));
      const lessonsSnapshot = await getDocs(lessonsQuery);
      const lessonsData = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
      setLessons(lessonsData);
      
      if (lessonsData.length > 0) {
        const quizzesQuery = query(collection(db, 'courses', courseId, 'quizzes'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(quizzesQuery, (snapshot) => {
          const quizzesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
          setQuizzes(quizzesData);
        });
        return unsubscribe;
      }
    };
    const unsubscribe = fetchLessonsAndQuizzes();
    return () => {
        unsubscribe.then(unsub => unsub && unsub());
    }
  }, [courseId]);

  async function onSubmit(values: z.infer<typeof quizFormSchema>) {
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'courses', courseId, 'quizzes'), {
        ...values,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Success', description: 'Quiz added successfully.' });
      form.reset({
        lessonId: '',
        question: '',
        options: ['', ''],
        correctAnswer: '',
      });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  const options = form.watch('options');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader><CardTitle>Add New Quiz</CardTitle></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="lessonId" render={({ field }) => (
                  <FormItem><FormLabel>Lesson</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a lesson" /></SelectTrigger></FormControl>
                      <SelectContent>{lessons.map(l => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="question" render={({ field }) => (
                    <FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div>
                    <FormLabel>Options</FormLabel>
                    <div className="space-y-2 mt-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <FormField control={form.control} name={`options.${index}`} render={({ field }) => (
                                    <Input {...field} />
                                )} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><X className="h-4 w-4" /></Button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append('')}>Add Option</Button>
                </div>

                <FormField control={form.control} name="correctAnswer" render={({ field }) => (
                  <FormItem><FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-1">
                            {options.map((opt, index) => (
                                opt && <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value={opt} /></FormControl>
                                    <FormLabel className="font-normal">{opt}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl><FormMessage />
                  </FormItem>
                )} />
                
                <Button type="submit" disabled={isLoading} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Quiz
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Quizzes</CardTitle>
            <CardDescription>{quizzes.length} quizzes in this course.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="p-3 rounded-lg border">
                  <p className="font-semibold">{quiz.question}</p>
                  <p className="text-sm text-muted-foreground">Correct: {quiz.correctAnswer}</p>
                </div>
              ))}
              {quizzes.length === 0 && <p className="text-muted-foreground text-center">No quizzes yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
