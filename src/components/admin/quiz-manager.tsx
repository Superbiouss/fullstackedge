'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Lesson, Quiz } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, X, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

const quizFormSchema = z.object({
  lessonId: z.string().min(1, 'Please select a lesson'),
  question: z.string().min(5, 'Question is required'),
  options: z.array(
      z.object({ value: z.string().min(1, "Option can't be empty") })
    ).min(2, 'At least two options are required'),
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
      options: [{ value: '' }, { value: '' }],
      correctAnswer: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  useEffect(() => {
    const lessonsQuery = query(collection(db, 'courses', courseId, 'lessons'), orderBy('createdAt', 'asc'));
    const unsubscribeLessons = onSnapshot(lessonsQuery, (snapshot) => {
      setLessons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson)));
    });

    const quizzesQuery = query(collection(db, 'courses', courseId, 'quizzes'), orderBy('createdAt', 'desc'));
    const unsubscribeQuizzes = onSnapshot(quizzesQuery, (snapshot) => {
      setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
    });

    return () => {
      unsubscribeLessons();
      unsubscribeQuizzes();
    };
  }, [courseId]);

  const onSubmit = async (values: z.infer<typeof quizFormSchema>) => {
    setIsLoading(true);
    try {
      const flatOptions = values.options.map(opt => opt.value);
      if (!flatOptions.includes(values.correctAnswer)) {
          toast({ variant: 'destructive', title: 'Error', description: 'Correct answer must be one of the options.' });
          setIsLoading(false);
          return;
      }
        
      await addDoc(collection(db, 'courses', courseId, 'quizzes'), {
        lessonId: values.lessonId,
        question: values.question,
        options: flatOptions,
        correctAnswer: values.correctAnswer,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Success', description: 'Quiz added successfully.' });
      form.reset({
        lessonId: '',
        question: '',
        options: [{ value: '' }, { value: '' }],
        correctAnswer: '',
      });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    try {
        await deleteDoc(doc(db, 'courses', courseId, 'quizzes', quizId));
        toast({ title: 'Success', description: 'Quiz deleted.' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not delete quiz.' });
    }
  };

  const options = form.watch('options');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader><CardTitle>Add New Quiz</CardTitle></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="lessonId" render={({ field }) => (
                  <FormItem><FormLabel>Lesson</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={lessons.length === 0}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a lesson" /></SelectTrigger></FormControl>
                      <SelectContent>{lessons.map(l => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="question" render={({ field }) => (
                    <FormItem><FormLabel>Question</FormLabel><FormControl><Input placeholder="What is Next.js?" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div>
                    <FormLabel>Options</FormLabel>
                    <div className="space-y-2 mt-2">
                        {fields.map((field, index) => (
                            <FormField key={field.id} control={form.control} name={`options.${index}.value`} render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl><Input placeholder={`Option ${index + 1}`} {...field} /></FormControl>
                                    {fields.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><X className="h-4 w-4 text-muted-foreground" /></Button>}
                                </FormItem>
                            )} />
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: '' })} disabled={fields.length >= 5}>Add Option</Button>
                </div>

                {options.some(opt => opt.value) && <FormField control={form.control} name="correctAnswer" render={({ field }) => (
                  <FormItem><FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-1">
                            {options.map((opt, index) => (
                                opt.value && <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value={opt.value} /></FormControl>
                                    <FormLabel className="font-normal">{opt.value}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl><FormMessage />
                  </FormItem>
                )} />
                
                <Button type="submit" disabled={isLoading} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Quiz
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Quizzes</CardTitle>
            <CardDescription>{quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} in this course.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizzes.map((quiz) => {
                const lessonTitle = lessons.find(l => l.id === quiz.lessonId)?.title || 'Unknown';
                return (
                    <div key={quiz.id} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{quiz.question}</p>
                            <p className="text-sm text-muted-foreground mt-1">For Lesson: {lessonTitle}</p>
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
                                <AlertDialogDescription>This will permanently delete the quiz.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(quiz.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="mt-3 space-y-2 text-sm">
                        {quiz.options.map((option, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {option === quiz.correctAnswer 
                                    ? <CheckCircle className="h-4 w-4 text-green-500" />
                                    : <XCircle className="h-4 w-4 text-muted-foreground" />
                                }
                                <span>{option}</span>
                            </div>
                        ))}
                    </div>
                    </div>
                );
              })}
              {quizzes.length === 0 && <p className="text-muted-foreground text-center py-8">No quizzes yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
