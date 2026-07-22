import { WorldMap } from "@/components/world-map";
import { ChapterMark } from "@/components/icons/chapter-mark";

export function WorldMapSection() {
  return (
    <section id="mapa" className="mx-auto max-w-6xl px-6 py-32 sm:px-10">
      <ChapterMark />
      <p className="eyebrow" data-reveal>
        Capítulo III · O mapa
      </p>
      <h2 className="mt-4 text-4xl font-bold text-bone sm:text-6xl" data-chars>
        Onde as lendas acordaram.
      </h2>
      <p className="serif mt-5 max-w-xl text-xl text-stone italic" data-reveal>
        Toque nos marcadores — cada brasa é um mito que sobreviveu ao tempo.
      </p>
      <div className="mt-12" data-reveal>
        <WorldMap />
      </div>
    </section>
  );
}
