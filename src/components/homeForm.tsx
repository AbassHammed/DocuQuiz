/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
'use client';

import { useState } from 'react';

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
import { useFormStore } from '@store';
import { FormSubmitType } from '@types';
import { File, Loader2, Notebook, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MAX_FILE_SIZE = 10000000; //10MB
const FILE_TYPE = 'application/pdf';

const difficult = [
  { label: 'Facile', value: 'facile' },
  { label: 'Modéré', value: 'modéré' },
  { label: 'Difficile', value: 'difficile' },
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
    .string({ required_error: 'Vous devez donner un sujet au quiz.' })
    .min(6, { message: 'Le sujet doit comporter au moins 6 caractères.' })
    .max(30, { message: 'Le sujet ne peut pas dépasser 30 caractères.' }),
  difficulty: z.string({
    required_error: 'Veuillez sélectionner une difficulté.',
  }),
  quizCount: z.string({
    required_error: 'Veuillez sélectionner le nombre de séries que vous souhaitez générer.',
  }),
  timer: z.string({ required_error: 'Veuillez sélectionner la durée du quiz.' }),
});

export type HomeFormValues = z.infer<typeof homeFormSchema>;

interface props {
  onSubmit: (data: FormSubmitType) => void;
}

const HomeForm = ({ onSubmit }: props) => {
  const [pdfFile, setPdfFile] = useState<File>();
  const { toast } = useToast();
  const setStatus = useFormStore(state => state.setStatus);
  const [note, setNote] = useState<string | undefined>();
  const [generating, setGenerating] = useState(false);

  const convertPdfToText = async (files: File) => {
    if (!files) {
      toast({
        variant: 'destructive',
        title: 'Erreur de chargement du fichier',
        description: 'Assurez-vous que le fichier est un PDF consultable et de moins de 10 Mo.',
      });
      return;
    }

    await pdfToText(files)
      .then(response => setNote(response))
      .catch(error => setStatus('error'));
  };

  const handleSelectFile = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return toast({
        variant: 'warn',
        title: 'Aucun fichier sélectionné',
        description: 'Veuillez sélectionner un fichier.',
      });
    }
    const file = files[0];

    if (file.size > MAX_FILE_SIZE || file.type !== FILE_TYPE) {
      return toast({
        variant: 'warn',
        title: 'Fichier invalide',
        description: 'Le fichier doit être un PDF et faire moins de 10 Mo.',
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
      setStatus('error');
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
    difficulty: '',
    quizCount: '',
    timer: '',
  };

  const form = useForm<HomeFormValues>({
    resolver: zodResolver(homeFormSchema),
    defaultValues,
  });

  const onFormSubmit = async (data: HomeFormValues) => {
    const formData: FormSubmitType = { ...data, text: note! };
    onSubmit(formData);
  };

  const handleRemoveFile = () => setPdfFile(undefined);
  return (
    <>
      <header className="text-center mb-10">
        <h2 className="text-lg font-semibold mb-1">Ajouter des notes</h2>
        <p className="text-xs text-zinc-400">
          Collez vos notes sous forme de texte ou téléchargez un fichier
        </p>
      </header>
      <div className="flex flex-col gap-3 mb-4">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onFormSubmit)}>
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Programmation orientée objet en Java"
                      {...field}
                      onKeyDown={handleKeyDown}
                      disabled={generating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sélectionner le niveau de difficulté</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez un niveau de difficulté" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficult.map(diff => (
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
                name="quizCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Combien de quiz souhaitez-vous générer ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le nombre de quiz à générer" />
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
                name="timer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temps de complétion</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez une durée raisonnable" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {quizTime.map(diff => (
                          <SelectItem key={diff.label} value={`${diff.label} min`}>
                            {`${diff.label} min`}
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
                    <span>Coller les notes</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="file"
                  className="flex items-center space-x-2 rounded-md hover:text-gray-800 data-[state=active]:bg-gray-200">
                  <File />
                  <span>Importer un fichier</span>
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
                    disabled={generating}
                    placeholder="Collez vos notes ici."
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
                          disabled={generating}
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
            <div className="flex items-center justify-center w-full">
              <Button
                type="submit"
                onClick={() => setGenerating(prev => !prev)}
                className="flex items-center justify-center w-72">
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {generating ? 'Generating Quiz ...' : 'Generate Quiz'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default HomeForm;
