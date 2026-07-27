import { WorldMap } from "@/components/world-map";
import { ChapterPlate } from "@/components/chapter-plate";

export function WorldMapSection() {
  return (
    <section id="mapa" className="mx-auto max-w-6xl px-6 pb-32 sm:px-10">
      <ChapterPlate
        src="/dragao/capitulos/mapa.webp"
        numeral="II"
        rotulo="O mapa"
        titulo="Onde as lendas acordaram."
      />
      <p className="serif mt-10 max-w-xl text-xl text-stone italic" data-reveal>
        Toque nos marcadores — cada brasa é um mito que sobreviveu ao tempo.
      </p>
      <div className="mt-12" data-reveal>
        <WorldMap />
      </div>
    </section>
  );
}
