'use client';

import { useEffect, useState } from 'react';

import { Button, ErrorUI, HomeForm, Loading, QuizContainer, Summary } from '@components';
import { useFormStore, useQuizStore, useTimerStore } from '@store';
import { FormSubmitType } from '@types';

const FormContainer = () => {
  const status = useFormStore(state => state.status);
  const setStatus = useFormStore(state => state.setStatus);
  const setQuizzes = useQuizStore(state => state.setQuizzes);
  const reset = useQuizStore(state => state.reset);
  const setTimer = useTimerStore(state => state.setTimer);
  const [resContent, setResContent] = useState('');

  useEffect(() => {
    if (status === 'done') {
      try {
        const data = JSON.parse(resContent);
        setQuizzes(data);
      } catch {
        reset();
        setResContent('');
        setStatus('error');
      }
    }
  }, [resContent, reset, setQuizzes, setStatus, status]);

  const parseQuizResponse = (response: any) => {
    const quizKeys = Object.keys(response).filter(key => Array.isArray(response[key]));

    for (const key of quizKeys) {
      const potentialQuizzes = response[key];
      if (
        potentialQuizzes.length > 0 &&
        typeof potentialQuizzes[0] === 'object' &&
        potentialQuizzes[0].question
      ) {
        return potentialQuizzes.map((quiz: any) => ({
          id: quiz.id.toString(),
          question: quiz.question,
          description: quiz.description,
          options: quiz.options,
          answer: quiz.answer,
        }));
      }
    }
    return [];
  };

  const onSubmit = async (data: FormSubmitType) => {
    try {
      setStatus('streaming');
      setResContent('');
      setTimer(Number(data.timer));

      const formData = new FormData();
      formData.append('topic', data.topic);
      formData.append('text', data.text);
      formData.append('difficulty', data.difficulty);
      formData.append('quizCount', data.quizCount);
      formData.append('timer', data.timer);

      const response = await fetch('/api/server', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setStatus('error');
      }

      const responseData = await response.json();
      const quizzes = parseQuizResponse(responseData);
      setResContent(JSON.stringify(quizzes));
      setStatus('done');
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <section className="relative bg-gray-100 border border-zinc-100 rounded-2xl max-w-4xl lg:mx-auto mx-4 lg:p-12 p-6 mb-10 min-h-72 ring-1 ring-gray-300">
      {status === 'error' && <ErrorUI />}
      {status === 'idle' && <HomeForm onSubmit={onSubmit} />}
      {status === 'streaming' && <Loading />}
      {status === 'done' && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center">
          <p className="max-w-sm text-center text-sm text-zinc-500 mb-4">
            Quiz généré avec succès ! Cliquez sur le bouton pour commencer quand vous êtes prêt !
          </p>
          <Button
            onClick={() => setStatus('start')}
            className="font-semibold tracking-widest bg-primary duration-200 text-white rounded-full px-6 py-3">
            Commencer le quiz
          </Button>
        </div>
      )}
      {status === 'start' && <QuizContainer />}
      {status === 'summary' && <Summary />}
    </section>
  );
};

export default FormContainer;
