'use client';

import { Footer, FormContainer, Header, Navbar } from '@components';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Header />
      <FormContainer />
      <Footer />
    </main>
  );
}
