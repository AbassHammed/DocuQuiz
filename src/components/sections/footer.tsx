import Link from 'next/link';

const Footer = () => (
  <footer className="flex justify-center items-center lg:py-8 lg:px-20 text-gray-500 text-center font-medium text-sm md:p-8 sm:p-4">
    <div>
      <span>Fork of</span>
      <Link
        className="p-1 text-blue-600 hover:underline focus:underline"
        href="https://github.com/Evavic44/quiznote"
        rel="noopener noreferrer"
        target="_blank">
        Quiznote
      </Link>
      &middot;
      <span className="pl-0.5">Built with</span>
      <Link
        className="p-1 text-blue-600 hover:underline focus:underline"
        href="https://nextjs.org/"
        target="_blank"
        rel="noopener noreferrer">
        Next.js
      </Link>
    </div>
  </footer>
);

export default Footer;
