import Image from "next/image";
import { ERAS } from "@/data/eras";
import { ChapterMark } from "@/components/icons/chapter-mark";

/**
 * Capítulo I. Cada era carrega uma "mood" (warm/cool/sacred) que muda a
 * temperatura da imagem — antes as sete civilizações, com climas e lendas
 * bem diferentes entre si, recebiam exatamente o mesmo tratamento de luz.
 * A era bíblica (mood="sacred") também ganha um título maior: é o ponto de
 * maior tensão dramática do capítulo e merece pesar mais que as outras.
 */
export function EraSection() {
  return (
    <section id="eras" className="relative mx-auto max-w-6xl px-6 py-32 sm:px-10">
      <ChapterMark />
      <p className="eyebrow" data-reveal>
        Capítulo I · O nascimento
      </p>
      <h2 className="mt-4 max-w-3xl text-4xl font-bold text-bone sm:text-6xl" data-chars>
        Antes da ficção, o mito.
      </h2>
      <p className="serif mt-6 max-w-2xl text-xl text-stone italic" data-reveal>
        Seis civilizações, seis dragões — e nenhuma delas conversou entre si. O dragão nasceu
        sozinho, em toda parte.
      </p>

      <div className="mt-16 flex flex-col gap-20">
        {ERAS.map((era, i) => (
          <article
            key={era.id}
            className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>figure]:order-2" : ""}`}
          >
            <figure className={`museum-frame era-mood-${era.mood}`} data-reveal>
              <div className="relative h-[420px] w-full overflow-hidden sm:h-[480px]">
                <Image
                  src={era.image}
                  alt={era.caption}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="scale-110 object-cover"
                  data-parallax="0.06"
                />
              </div>
              <figcaption className="museum-caption mt-3">{era.caption}</figcaption>
            </figure>
            <div data-reveal>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-5xl font-black text-fire-bright/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={`font-bold text-bone ${era.mood === "sacred" ? "text-4xl sm:text-6xl" : "text-3xl"}`}>
                    {era.era}
                  </h3>
                  <p className="eyebrow mt-1">
                    {era.year} · {era.map}
                  </p>
                </div>
              </div>
              <div className="gold-line mt-5 w-24" />
              <p className="serif mt-5 text-xl leading-relaxed text-stone">{era.story}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
