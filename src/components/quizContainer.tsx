'use client';

import { useMemo, useState } from 'react';

import { Countdown, ProgressLine, Quiz } from '@components';
import { useFormStore, useQuizStore, useTimerStore } from '@store';

export default function QuizContainer() {
  const quizzes = useQuizStore(state => state.quizzes);
  const index = useQuizStore(state => state.index);

  const { id, question, answer, options } = quizzes[index];

  const nextIndex = useQuizStore(state => state.nextIndex);
  const selectedAnswer = useQuizStore(state => state.selectedAnswer);
  const setStatus = useFormStore(state => state.setStatus);
  const timer = useTimerStore(state => state.timer);
  const [timeLeft, setTimeLeft] = useState(timer * 60);

  const correctAnswer = useMemo(() => answer === selectedAnswer, [answer, selectedAnswer]);

  const lastQuestion = index === quizzes.length - 1;

  return (
    <div key={id}>
      <div className="flex flex-col mb-4">
        <Countdown minutes={timer} timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
      </div>

      <ProgressLine />

      <blockquote className="max-w-md mx-auto text-center font-semibold text-xl leading-relaxed text-zinc-700 tracking-tight mt-12">
        {question}
      </blockquote>

      <div className="flex flex-col gap-4 my-8">
        {Object.entries(options).map(([key, value]) => (
          <Quiz key={`${id}-${key}`} alpha={key} text={value} quiz={quizzes[index]} />
        ))}
      </div>

      {selectedAnswer && (
        <em className="block not-italic text-sm font-geistmono text-center">
          <span className={correctAnswer ? 'text-green-600' : 'text-red-600'}>
            {correctAnswer ? 'Correct!' : 'Faux!'}
          </span>{' '}
          La réponse est <span className="font-bold">&#40;{answer}&#41;</span>
        </em>
      )}

      {lastQuestion ? (
        <button
          disabled={selectedAnswer ? false : true}
          onClick={() => setStatus('summary')}
          className="flex mx-auto mt-16 bg-black text-white text-center px-4 py-3 rounded-md">
          Terminer
        </button>
      ) : (
        <button
          disabled={selectedAnswer ? false : true}
          onClick={() => {
            nextIndex();
          }}
          className="flex mx-auto mt-16 bg-black text-white text-center px-4 py-3 rounded-md">
          Question suivante
        </button>
      )}
    </div>
  );
}
