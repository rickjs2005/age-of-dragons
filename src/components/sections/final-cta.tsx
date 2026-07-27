import { Share } from "@/components/share";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-40">
      {/* Era um SVG desenhado à mão. Agora é o último quadro da revelação — o
          mesmo dragão do topo, parado, esperando. Combina com "as lendas apenas
          esperam" melhor que o rugido, e para de destoar do resto da página. */}
      <div aria-hidden data-parallax="0.12" className="fecho-dragao" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-96 [background:radial-gradient(60%_70%_at_50%_100%,rgb(139_0_0/0.22),transparent_70%)]" />
      <div aria-hidden className="smoke bottom-0 left-1/4 h-64 w-[40rem]" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <p className="serif text-2xl leading-relaxed text-bone italic sm:text-4xl" data-reveal>
          &ldquo;As lendas nunca morrem.
          <br />
          Elas apenas esperam pelo próximo contador de histórias.&rdquo;
        </p>
        <Share />

        {/* Continua existindo, mas rebaixado: quem chegou até aqui e quer rever
            deve conseguir, sem competir com o convite pra compartilhar. */}
        <a href="#top" data-reveal className="mt-12 museum-caption underline-offset-4 hover:underline">
          Rever desde o começo
        </a>
      </div>
    </section>
  );
}
