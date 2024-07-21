/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { HomeForm } from '@components';
import { useFormStore, useQuizStore, useTimerStore } from '@store';

const FormContainer = () => {
  const status = useFormStore(state => state.status);
  const setStatus = useFormStore(state => state.setStatus);
  const setQuizzes = useQuizStore(state => state.setQuizzes);
  const reset = useQuizStore(state => state.reset);
  const setTimer = useTimerStore(state => state.setTimer);

  return (
    <section className="relative bg-gray-100 border border-zinc-100 rounded-2xl max-w-4xl lg:mx-auto mx-4 lg:p-12 p-6 mb-10 min-h-72 ring-1 ring-gray-300">
      {status === 'idle' && <HomeForm />}
    </section>
  );
};

export default FormContainer;
