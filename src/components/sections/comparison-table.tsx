import { COMPARISON } from "@/data/comparison";
import { ChapterMark } from "@/components/icons/chapter-mark";

function RatingCell({ value, label }: { value: number; label: string }) {
  return (
    <td className="px-4 text-gold-soft" aria-label={`${label}: ${value} de 5`}>
      <span aria-hidden>
        {"◆".repeat(value)}
        <span className="text-bone/15">{"◆".repeat(5 - value)}</span>
      </span>
    </td>
  );
}

export function ComparisonTable() {
  return (
    <section id="confronto" className="lava-seam border-y border-gold/10 bg-abyss-2/50 py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <ChapterMark />
        <p className="eyebrow" data-reveal>
          Capítulo VI · O confronto
        </p>
        <h2 className="mt-4 text-4xl font-bold text-bone sm:text-6xl" data-chars>
          Escama contra escama.
        </h2>
        <div className="mt-12 overflow-x-auto" data-reveal>
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparação de origem, elemento, tamanho, poder, inteligência e voo entre sete dragões icônicos
            </caption>
            <thead>
              <tr className="border-b border-gold/30 font-display text-[11px] tracking-[0.2em] text-gold uppercase">
                <th className="py-4 pr-4" scope="col">Dragão</th>
                <th className="px-4" scope="col">Origem</th>
                <th className="px-4" scope="col">Elemento</th>
                <th className="px-4" scope="col">Tamanho</th>
                <th className="px-4" scope="col">Poder</th>
                <th className="px-4" scope="col">Inteligência</th>
                <th className="px-4" scope="col">Voo</th>
                <th className="pl-4" scope="col">Tipo</th>
              </tr>
            </thead>
            <tbody className="text-stone">
              {COMPARISON.map((row) => (
                <tr key={row.name} className="border-b border-bone/8 transition-colors hover:bg-fire/10">
                  <th scope="row" className="py-4 pr-4 text-left font-display text-base font-bold text-bone">
                    {row.name}
                  </th>
                  <td className="px-4">{row.origem}</td>
                  <td className="px-4">{row.elemento}</td>
                  <td className="px-4">{row.tamanho}</td>
                  <RatingCell value={row.poder} label="Poder" />
                  <RatingCell value={row.inteligencia} label="Inteligência" />
                  <td className="px-4">{row.voo}</td>
                  <td className="pl-4">{row.tipo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
