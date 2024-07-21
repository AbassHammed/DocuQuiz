/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  Form,
  FormControl,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from '@components';
import { zodResolver } from '@hookform/resolvers/zod';
import pdfToText from '@lib/utils';
import { File, Notebook, XIcon } from 'lucide-react';
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

  const convertPdfToText = async (files: File) => {
    if (!files) {
      toast({
        variant: 'destructive',
        title: 'Error loading file',
        description: 'Make sure the file is a searchable PDF file and less than 10MB in size. ',
      });
      return;
    }

    await pdfToText(files)
      .then(response => setNote(response))
      .catch(error => setError(error));
  };

  const handleSelectFile = async (files: FileList | null) => {
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
    await convertPdfToText(file);
  };

  const handleFile = async (files: FileList | null) => {
    try {
      setGenerating(true);
      handleSelectFile(files);
    } catch (error) {
      setError(error as Error);
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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
    <>
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
                    <Input
                      placeholder="Object-oriented programming in Java"
                      {...field}
                      onKeyDown={handleKeyDown}
                    />
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
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reasonable time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {quizTime.map(diff => (
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

            <Tabs defaultValue="note">
              <TabsList className="grid w-full grid-cols-2 bg-white items-center justify-center p-0 px-2 m-0 h-12 ring-1 ring-[#969696] ring-opacity-50">
                <TabsTrigger
                  value="note"
                  className="rounded-md hover:text-gray-800 data-[state=active]:bg-gray-200">
                  <div className="flex items-center space-x-2">
                    <Notebook />
                    <span>Paste note</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="file"
                  className="flex items-center space-x-2 rounded-md hover:text-gray-800 data-[state=active]:bg-gray-200">
                  <File />
                  <span>Upload file</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="note" className="flex w-full items-center space-x-2 py-2">
                <label htmlFor="notes" className="block mb-3 w-full">
                  <span className="block text-sm font-semibold text-zinc-600 mb-2">Note</span>
                  <textarea
                    value={note}
                    name="notes"
                    id="notes"
                    rows={10}
                    cols={30}
                    onChange={e => setNote(e.target.value)}
                    required
                    placeholder="Paste your note here."
                    className="appearance-none w-full p-3 border border-zinc-200 placeholder-zinc-400 rounded-md focus:outline-none focus:ring-zinc-300 text-sm"></textarea>
                </label>
              </TabsContent>
              <TabsContent value="file" className="mr-2">
                <div className="mt-5">
                  <div className="max-w-lg mx-auto">
                    {!pdfFile && (
                      <div className="max-w-md h-40 rounded-lg border-2 border-gray-400 border-dashed flex items-center justify-center">
                        <label htmlFor="file" className="cursor-pointer text-center p-4 md:p-8">
                          <svg
                            className="w-10 h-10 mx-auto"
                            viewBox="0 0 41 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12.1667 26.6667C8.48477 26.6667 5.5 23.6819 5.5 20C5.5 16.8216 7.72428 14.1627 10.7012 13.4949C10.5695 12.9066 10.5 12.2947 10.5 11.6667C10.5 7.0643 14.231 3.33334 18.8333 3.33334C22.8655 3.33334 26.2288 6.19709 27.0003 10.0016C27.0556 10.0006 27.1111 10 27.1667 10C31.769 10 35.5 13.731 35.5 18.3333C35.5 22.3649 32.6371 25.7279 28.8333 26.5M25.5 21.6667L20.5 16.6667M20.5 16.6667L15.5 21.6667M20.5 16.6667L20.5 36.6667"
                              stroke="#4F46E5"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="mt-3 text-black max-w-xs mx-auto">
                            Click to{' '}
                            <span className="font-medium text-indigo-600">Upload your file</span> or
                            drag and drop your file here
                          </p>
                        </label>
                        <input
                          id="file"
                          type="file"
                          className="hidden"
                          accept="application/pdf"
                          onChange={e => handleFile(e.target.files)}
                        />
                      </div>
                    )}

                    {pdfFile && (
                      <div className="mt-5 bg-white p-4 rounded shadow relative">
                        <button
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                          onClick={handleRemoveFile}>
                          <XIcon size={20} />
                        </button>

                        <p className="text-lg text-gray-500 font-semibold">{pdfFile.name}</p>
                        <p className="text-sm text-gray-500">Size: {pdfFile.size} bytes</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </>
  );
};

export default HomeForm;
