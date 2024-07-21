import { StreamStatus } from '@types';
import { create } from 'zustand';

interface StoreState {
  status: StreamStatus;
  quizStream: string;
  setQuizStream: (stream: string) => void;
}

interface StoreActions extends StoreState {
  setStatus: (status: StreamStatus) => void;
}

export const useFormStore = create<StoreState & StoreActions>(set => ({
  status: 'idle',
  quizStream: '',
  setQuizStream: stream => set({ quizStream: stream }),
  setStatus: status => set({ status }),
}));
