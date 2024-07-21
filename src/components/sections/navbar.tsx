'use client';

import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants, Icons } from '@components';
import { siteConfig } from '@config/site';
import { cn } from '@lib/utils';

import Logo from '../../../public/Icon.png';

export default function Navbar() {
  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white h-20 duration-200 ease-[cubic-bezier(0,0,0,1)] text-black z-20 overflow-hidden`}>
      <div className="w-full flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-lg flex items-center gap-x-2 order-1">
          <Image src={Logo} alt="Reda logo" width={30} height={30} quality={95} priority />
          DocuQuiz
        </Link>

        <nav className="flex items-center order-2">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                }),
                'h-10 w-10 px-0',
              )}>
              <Icons.gitHub className="h-6 w-6 text-black" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
