import { CURIOSITIES } from "@/data/curiosities";
import { ChapterMark } from "@/components/icons/chapter-mark";

export function CuriositiesGrid() {
  return (
    <section id="segredos" className="lava-seam border-y border-gold/10 bg-abyss-2/50 py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <ChapterMark />
        <p className="eyebrow" data-reveal>
          Capítulo VIII · Segredos
        </p>
        <h2 className="mt-4 text-4xl font-bold text-bone sm:text-6xl" data-chars>
          O que os registros guardam.
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CURIOSITIES.map((item) => (
            <article key={item.title} data-tilt data-reveal className="card-3d rounded-2xl p-7">
              <h3 className="font-display text-xl font-bold text-gold-soft">{item.title}</h3>
              <p className="serif mt-3 text-lg leading-relaxed text-stone">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
