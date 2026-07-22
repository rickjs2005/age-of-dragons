import { TIMELINE } from "@/data/timeline";
import { ChapterMark } from "@/components/icons/chapter-mark";

/**
 * Capítulo IV. Em ponteiro fino, cinematic.tsx pina esta seção e faz o
 * #timeline-track deslizar na horizontal via ScrollTrigger. Em touch (onde o
 * pin é desativado), a trilha já era um flex com overflow-x — mas sem
 * nenhuma pista de que rolava pro lado. Agora tem scroll-snap, fade nas
 * bordas e uma dica de arraste visível só em ponteiro grosso.
 */
export function TimelineSection() {
  return (
    <section id="timeline-pin" className="lava-seam relative overflow-hidden border-y border-gold/10 bg-abyss-2/40">
      <div className="flex h-screen flex-col justify-center">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <ChapterMark reveal={false} />
          <p className="eyebrow">Capítulo IV · A travessia</p>
          <h2 className="mt-3 text-3xl font-bold text-bone sm:text-5xl">Quatro mil anos em um voo.</h2>
          <p className="timeline-drag-hint mt-2">Arraste para o lado →</p>
        </div>
        <div id="timeline-track" className="timeline-track mt-14 flex w-max gap-8 pr-[40vw] pl-6 sm:pl-10">
          {TIMELINE.map((item) => (
            <article key={item.year} className="card-3d w-[78vw] shrink-0 rounded-2xl p-8 sm:w-[420px]">
              <p className="font-display text-4xl font-black text-gold">{item.year}</p>
              <h3 className="mt-2 text-2xl font-bold text-bone">{item.title}</h3>
              <p className="serif mt-3 text-lg leading-relaxed text-stone">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
