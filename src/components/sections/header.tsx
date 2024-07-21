const Header = () => (
  <section className="w-full mx-auto flex flex-col items-center p-6 mb-6 mt-20">
    <div className={`flex flex-col items-center justify-center text-center `}>
      <h1 className="max-w-2xl sm:text-[3rem] text-[1.9rem] leading-tight font-bold tracking-tight mb-5 text-zinc-800">
        Rendez l&apos;apprentissage amusant et efficace!
      </h1>
      <p className="lg:max-w-lg max-w-sm md:text-lg text-sm mb-6 text-zinc-600">
        Transformez vos notes ou support de cours en quiz interactifs en toute simplicité avec{' '}
        <span className="font-bold text-blue-500">DocuQuiz</span>.
      </p>
    </div>
  </section>
);

export default Header;
