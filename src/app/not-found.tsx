import { ErrorUI, Footer, Header, Navbar } from '@components';

export default function Notfound() {
  return (
    <main className="relative">
      <Navbar />
      <Header />
      <section className="relative bg-gray-100 border border-zinc-100 rounded-2xl max-w-4xl lg:mx-auto mx-4 lg:p-12 p-6 mb-10 min-h-72 ring-1 ring-gray-300">
        <ErrorUI pnfPage />
      </section>
      <Footer />
    </main>
  );
}
