import { CINEMA } from "@/data/cinema";
import { ChapterPlate } from "@/components/chapter-plate";

export function CinemaTimeline() {
  return (
    <section id="telas" className="mx-auto max-w-4xl px-6 pb-32 sm:px-10">
      <ChapterPlate
        src="/dragao/capitulos/telas.webp"
        numeral="III"
        rotulo="As telas"
        titulo="O dragão vai ao cinema."
      />
      <div className="mt-14 rounded-2xl bg-abyss-2/75 px-8 py-10 sm:px-14 sm:py-12">
        <ol className="relative border-l border-fire/40 pl-10">
          {CINEMA.map((item) => (
            <li key={item.title} data-reveal className="relative mb-10 last:mb-0">
              <span aria-hidden className="absolute top-2 -left-[45px] h-3 w-3 rounded-full border border-gold bg-fire shadow-[0_0_12px_rgb(139_0_0/0.9)]" />
              <p className="font-display text-xl font-bold text-gold">{item.year}</p>
              <h3 className="mt-1 text-2xl font-bold text-bone">{item.title}</h3>
              <p className="serif mt-1 text-lg text-stone italic">{item.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
