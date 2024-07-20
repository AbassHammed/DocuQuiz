/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Logo from '../../../public/Icon.png';

export default function Navbar() {
  /** disable eslint */
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <header
      className={`bg-white fixed top-0 left-0 w-full h-20 duration-200 ease-[cubic-bezier(0,0,0,1)] lg:border-b border-zinc-100 text-zinc-600 z-20 ${
        !toggleMenu ? 'overflow-hidden' : 'bg-white md:h-20 h-full overflow-visible'
      }`}>
      <div className="max-w-7xl flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-lg flex items-center gap-x-2 order-2">
          <Image src={Logo} alt="Reda logo" width={40} height={40} quality={95} priority />
          DocuQuiz
        </Link>

        {/* <div className="order-3">
          <div className="md:flex hidden items-center gap-x-6">
            <Button
              text="GitHub"
              url="https://github.com/Evavic44/quiznote"
              icon={<GithubIcon />}
              external
              theme="primary"
            />
          </div>
        </div> */}
      </div>
    </header>
  );
}
