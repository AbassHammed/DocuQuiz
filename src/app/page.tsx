import { Header, HomeForm, Navbar } from '@components';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Header />
      <HomeForm />
    </main>
  );
}
