/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';

import { HomeForm, Loading } from '@components';
import { useFormStore, useQuizStore, useTimerStore } from '@store';
import { FormSubmitType } from '@types';

const FormContainer = () => {
  const status = useFormStore(state => state.status);
  const setStatus = useFormStore(state => state.setStatus);
  const setQuizzes = useQuizStore(state => state.setQuizzes);
  const reset = useQuizStore(state => state.reset);
  const setTimer = useTimerStore(state => state.setTimer);
  const [resContent, setResContent] = useState('');

  const onSubmit = async (data: FormSubmitType) => {
    setStatus('streaming');
    setResContent('');

    const formData = new FormData();

    formData.append('topic', data.topic);
    formData.append('text', data.text);
    formData.append('difficulty', data.difficulty);
    formData.append('quizCount', data.quizCount);
    formData.append('timer', data.timer);

    const res = await fetch('/api/server', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      console.log(result);
    } else {
      console.error('Error submitting form');
    }

    setStatus('done');
  };

  return (
    <section className="relative bg-gray-100 border border-zinc-100 rounded-2xl max-w-4xl lg:mx-auto mx-4 lg:p-12 p-6 mb-10 min-h-72 ring-1 ring-gray-300">
      {/* {status === 'idle' && <HomeForm onSubmit={onSubmit} />} */}
      {status === 'idle' && <Loading />}
    </section>
  );
};

export default FormContainer;
