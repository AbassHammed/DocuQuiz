/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';

import { HomeForm, Loading, Summary } from '@components';
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

      const responseData = await response.text();
      const formattedContent = responseData.replace('```json', '').replace('```', '');
      setResContent(formattedContent);
      setStatus('done');
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <section className="relative bg-gray-100 border border-zinc-100 rounded-2xl max-w-4xl lg:mx-auto mx-4 lg:p-12 p-6 mb-10 min-h-72 ring-1 ring-gray-300">
      {/* {status === 'idle' && <HomeForm onSubmit={onSubmit} />} */}
      {status === 'streaming' && <Loading />}
      {status === 'idle' && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center">
          <p className="max-w-sm text-center text-sm text-zinc-500 mb-4">
            Quiz successfully generated! Click the button to begin whenever you&apos;re ready!
          </p>
          <button
            onClick={() => setStatus('start')}
            className="font-geistmono font-semibold tracking-widest bg-primary hover:bg-secondary duration-200 text-white rounded-full px-6 py-3">
            Start Quiz
          </button>
        </div>
      )}
      {status === 'summary' && <Summary />}
    </section>
  );
};

export default FormContainer;
