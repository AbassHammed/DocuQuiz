export type FormSubmitType = {
  topic: string;
  text: string;
  difficulty: string;
  quizCount: string;
  timer: string;
};

export type QuizType = {
  id: string;
  question: string;
  description: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answer: string;
};

export type StreamStatus = 'idle' | 'streaming' | 'done' | 'start' | 'summary' | 'error';
