/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
'use client';

import { useState } from 'react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@components';
import { zodResolver } from '@hookform/resolvers/zod';
import pdfToText from '@lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MAX_FILE_SIZE = 10000000; //10MB
const FILE_TYPE = 'application/pdf';

const difficulty = [
  { label: 'Easy', value: 'easy' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Hard', value: 'hard' },
] as const;

const quizNumber = [
  { label: '2' },
  { label: '5' },
  { label: '10' },
  { label: '15' },
  { label: '20' },
] as const;

const quizTime = [{ label: '1' }, { label: '5' }, { label: '10' }, { label: '15' }] as const;

const homeFormSchema = z.object({
  topic: z
    .string({ required_error: 'You must give a topic to the quiz.' })
    .min(6, { message: 'The topic must be at least 6 caracters' })
    .max(30, { message: "The topic can't be longer than 30 characters" }),
  difficult: z.string({
    required_error: 'Please select a difficulty',
  }),
  quiz: z.string({ required_error: 'Please select the number of series you want to generate.' }),
  time: z.string({ required_error: 'Please select the duration of the quiz' }),
});

type HomeFormValues = z.infer<typeof homeFormSchema>;

const HomeForm = () => {
  const [pdfFile, setPdfFile] = useState<File>();
  const { toast } = useToast();
  const [note, setNote] = useState<string | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [generating, setGenerating] = useState(false);

  const handleSelectFile = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return toast({
        variant: 'warn',
        title: 'No file selected',
        description: 'Please select a file',
      });
    }
    const file = files[0];

    if (file.size > MAX_FILE_SIZE || file.type !== FILE_TYPE) {
      return toast({
        variant: 'warn',
        title: 'Invalid file',
        description: 'File must be a PDF and less than 10MB',
      });
    }
    setPdfFile(file);
  };

  const convertPdfToText = async () => {
    if (!pdfFile) {
      toast({
        variant: 'destructive',
        title: 'Error loading file',
        description: 'Make sure the file is a searchable PDF file and less than 10MB in size. ',
      });
      return;
    }

    await pdfToText(pdfFile)
      .then(response => setNote(response))
      .catch(error => setError(error));
  };

  const handleFile = async (files: FileList | null) => {
    try {
      setGenerating(true);
      handleSelectFile(files);
      await convertPdfToText();
    } catch (error) {
      setError(error as Error);
    } finally {
      setGenerating(false);
    }
  };

  const defaultValues: Partial<HomeFormValues> = {
    topic: '',
    difficult: '',
    quiz: '',
    time: '',
  };

  const form = useForm<HomeFormValues>({
    resolver: zodResolver(homeFormSchema),
    defaultValues,
  });

  const handleRemoveFile = () => setPdfFile(undefined);
  return (
    <section className="relative bg-gray-100 border border-zinc-100 rounded-2xl max-w-4xl mx-auto lg:p-12 p-6 mb-10 min-h-72">
      <header className="text-center mb-10">
        <h2 className="text-lg font-semibold mb-1">Add Notes</h2>
        <p className="text-xs text-zinc-400"> Paste your notes as text or upload a file</p>
      </header>
      <div className="flex flex-col gap-3 mb-4">
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Object-oriented programming in Java" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select difficult level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficult level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficulty.map(diff => (
                          <SelectItem key={diff.label} value={diff.value}>
                            {diff.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quiz"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How many quizzes do you want to generate ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a number of quizzes to generate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {quizNumber.map(diff => (
                          <SelectItem key={diff.label} value={diff.label}>
                            {diff.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default HomeForm;
