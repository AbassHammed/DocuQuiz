'use client';

import { useEffect, useState } from 'react';

import { ProgressBar } from '@components';

const Loading = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const handleIncrement = (prev: number) => {
      if (prev === 100) {
        return 0;
      }
      return prev + 10;
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <ProgressBar
        max={100}
        min={0}
        value={value}
        gaugePrimaryColor="rgb(79 70 229)"
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      />

      <h2 className="font-semibold tracking-tight text-center text-zinc-600">
        Generating quiz ...
      </h2>
    </div>
  );
};

export default Loading;
