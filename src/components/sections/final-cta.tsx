import { FinalSilhouette } from "@/components/icons/final-silhouette";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-40">
      <div aria-hidden className="absolute inset-x-0 bottom-0 [background:radial-gradient(60%_70%_at_50%_100%,rgb(139_0_0/0.22),transparent_70%)]">
        <FinalSilhouette />
      </div>
      <div aria-hidden className="smoke bottom-0 left-1/4 h-64 w-[40rem]" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <p className="serif text-2xl leading-relaxed text-bone italic sm:text-4xl" data-reveal>
          &ldquo;As lendas nunca morrem.
          <br />
          Elas apenas esperam pelo próximo contador de histórias.&rdquo;
        </p>
        <a
          href="#top"
          data-reveal
          className="mt-12 rounded-full border border-gold/50 bg-abyss/60 px-8 py-3.5 font-display text-sm tracking-[0.22em] text-gold-soft uppercase backdrop-blur transition-colors hover:bg-gold hover:text-abyss"
        >
          Voltar ao topo
        </a>
      </div>
    </section>
  );
}
