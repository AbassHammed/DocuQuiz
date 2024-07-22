'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useFormStore } from '@store';

import ErrorImage from '../../public/error.svg';
import NotFoundImage from '../../public/pnf.svg';

const ErrorUI = ({ pnfPage = false }: { pnfPage?: boolean }) => {
  const router = useRouter();
  const setStatus = useFormStore(state => state.setStatus);

  return (
    <div className="flex flex-col items-center space-y-8">
      <Image
        src={pnfPage ? NotFoundImage : ErrorImage}
        alt="Error Image"
        priority
        quality={95}
        style={{ width: '250px', height: '250px' }}
      />

      <h2 className="font-semibold tracking-tight text-center text-zinc-600">
        An error has occured in the application kindly go back and restart.
      </h2>

      <button
        onClick={() => {
          setStatus('idle');
          router.push('/');
        }}
        className="flex mx-auto mt-16 bg-primary text-white text-center px-4 py-3 rounded-md">
        Retourner à l&apos;accueil
      </button>
    </div>
  );
};

export default ErrorUI;
