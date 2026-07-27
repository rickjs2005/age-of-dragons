"use client";

import { useId, useState } from "react";
import { DRAGONS } from "@/data/dragons";
import { ChapterMark } from "@/components/icons/chapter-mark";
import { DragonGlyph } from "@/components/icons/dragon-glyph";

/**
 * Capítulo II. Antes, "Saiba mais" era um <span> sem href nem onClick em
 * cada um dos 10 cards — prometia uma ação que não existia. Agora é um botão
 * real que abre um painel com o "detail" de cada dragão, no mesmo padrão já
 * usado pelo mapa das lendas (WorldMap): consistência de sistema, não um
 * componente novo por seção.
 */
export function DragonGrid() {
  const [selected, setSelected] = useState<(typeof DRAGONS)[number] | null>(null);
  const panelId = useId();

  return (
    <section id="lendarios" className="lava-seam relative border-y border-gold/10 bg-abyss-2/50 py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <ChapterMark />
        <p className="eyebrow" data-reveal>
          Os lendários
        </p>
        <h2 className="mt-4 text-4xl font-bold text-bone sm:text-6xl" data-chars>
          Os dez que a ficção coroou.
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {DRAGONS.map((dragon, i) => {
            const isSelected = selected?.name === dragon.name;
            return (
              <article key={dragon.name} data-tilt data-reveal className="card-3d rounded-2xl p-6">
                <DragonGlyph color={dragon.color} variant={i} />
                <h3 className="mt-4 font-display text-2xl font-bold text-bone">{dragon.name}</h3>
                <p className="eyebrow mt-1">{dragon.universe}</p>
                <dl className="mt-4 space-y-1 text-sm text-stone">
                  <div className="flex justify-between gap-2">
                    <dt className="text-stone/70">Criador</dt>
                    <dd className="text-right text-bone/80">{dragon.creator}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-stone/70">Estreia</dt>
                    <dd className="text-bone/80">{dragon.first}</dd>
                  </div>
                </dl>
                <p className="serif mt-4 min-h-20 text-[15px] leading-relaxed text-stone italic">{dragon.fact}</p>
                <button
                  type="button"
                  aria-expanded={isSelected}
                  aria-controls={panelId}
                  onClick={() => setSelected(isSelected ? null : dragon)}
                  className="mt-4 inline-block border-b border-fire-bright/60 pb-0.5 font-display text-[11px] tracking-[0.22em] text-fire-bright uppercase transition-colors hover:text-gold-soft"
                >
                  {isSelected ? "Fechar" : "Saiba mais"}
                </button>
              </article>
            );
          })}
        </div>

        {selected && (
          <div id={panelId} className="card-3d mx-auto mt-8 max-w-2xl rounded-xl p-7 text-left" data-reveal>
            <p className="eyebrow">{selected.universe}</p>
            <h3 className="mt-2 text-2xl font-bold text-bone">{selected.name}</h3>
            <p className="serif mt-3 text-lg leading-relaxed text-stone">{selected.detail}</p>
          </div>
        )}
      </div>
    </section>
  );
}
