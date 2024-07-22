/* eslint-disable quotes */
'use client';

import { useEffect, useState } from 'react';

import { ProgressBar } from '@components';

const Loading = () => {
  const [value, setValue] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    'Envoi de vos données pour analyse...',
    'Génération du quiz en cours...',
    'Presque terminé...',
    "Nous sommes désolés pour l'attente...",
  ];

  useEffect(() => {
    const handleMessageIndex = () => {
      setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    };

    const handleIncrement = (prev: number) => {
      if (prev === 100) {
        return 0;
      }

      if (prev % 20 === 0) {
        handleMessageIndex();
      }
      return prev + 10;
    };

    setValue(handleIncrement);
    const interval = setInterval(() => {
      setValue(handleIncrement);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center space-y-8">
      <ProgressBar
        max={100}
        min={0}
        value={value}
        gaugePrimaryColor="rgb(79 70 229)"
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      />

      <h2 className="font-semibold tracking-tight text-center text-zinc-600">
        {messages[messageIndex]}
      </h2>
    </div>
  );
};

export default Loading;
