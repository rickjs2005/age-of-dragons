"use client";

import { useState } from "react";

/**
 * Mapa das lendas: carta antiga estilizada (grade de coordenadas + rosa dos
 * ventos), pins pulsando; clique abre o painel da lenda. Sem geografia
 * fotorrealista de propósito — é um mapa de biblioteca proibida.
 */
const LEGENDS = [
  { id: "china", x: 76, y: 42, region: "China", title: "Lóng, o senhor das chuvas", text: "Dragões celestiais controlam rios e tempestades há pelo menos 4 mil anos de iconografia. O de cinco garras era símbolo exclusivo do imperador." },
  { id: "japao", x: 84, y: 46, region: "Japão", title: "Ryū dos mares", text: "Serpentes aquáticas de três garras, guardiãs de palácios submersos — Hokusai as pintou até o último ano de vida." },
  { id: "europa", x: 48, y: 34, region: "Europa Medieval", title: "O guardião do tesouro", text: "Do wyrm de Beowulf a São Jorge: o dragão como prova máxima do herói — fogo, escamas e ouro roubado." },
  { id: "nordica", x: 46, y: 22, region: "Escandinávia", title: "Fáfnir e Níðhöggr", text: "O anão que virou dragão pela ganância e a serpente que rói as raízes do mundo — o Norte antigo sonhava grande." },
  { id: "maia", x: 18, y: 52, region: "Mesoamérica", title: "A serpente emplumada", text: "Quetzalcóatl/Kukulkán: dragão-deus de vento e sabedoria, esculpido em pirâmides que se alinham com o sol." },
  { id: "celta", x: 42, y: 30, region: "País de Gales", title: "Y Ddraig Goch", text: "O dragão vermelho que Merlin viu vencer o branco — profecia que virou bandeira de um povo." },
];

export function WorldMap() {
  const [selected, setSelected] = useState<(typeof LEGENDS)[number] | null>(null);

  return (
    <div className="relative">
      <div className="museum-frame relative aspect-[16/9] w-full overflow-hidden">
        {/* fundo de carta antiga */}
        <div aria-hidden className="absolute inset-0 [background:radial-gradient(90%_80%_at_50%_40%,rgb(201_162_39/0.07),transparent_70%),linear-gradient(180deg,#121110,#090909)]" />
        {/* grade de coordenadas */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgb(201_162_39/0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgb(201_162_39/0.14)_1px,transparent_1px)] [background-size:10%_16.6%]"
        />
        {/* rosa dos ventos */}
        <svg aria-hidden viewBox="0 0 100 100" className="absolute right-[4%] bottom-[8%] h-24 w-24 text-gold/40">
          <g stroke="currentColor" fill="none" strokeWidth="1">
            <circle cx="50" cy="50" r="30" />
            <path d="M50 8 L54 46 L50 50 L46 46 Z" fill="currentColor" />
            <path d="M50 92 L54 54 L50 50 L46 54 Z" />
            <path d="M8 50 L46 46 L50 50 L46 54 Z" />
            <path d="M92 50 L54 46 L50 50 L54 54 Z" />
          </g>
        </svg>
        {/* contornos abstratos de terra */}
        <svg aria-hidden viewBox="0 0 160 90" className="absolute inset-0 h-full w-full text-stone/25">
          <g fill="none" stroke="currentColor" strokeWidth="0.5">
            <path d="M18 38 Q24 28 34 30 Q40 24 46 28 Q44 40 36 46 Q30 56 24 54 Q14 50 18 38 Z" />
            <path d="M60 22 Q72 14 86 20 Q100 16 112 24 Q124 30 132 42 Q126 52 114 50 Q104 58 92 52 Q78 54 70 44 Q58 36 60 22 Z" />
            <path d="M26 58 Q34 56 38 64 Q36 76 28 80 Q20 72 26 58 Z" />
            <path d="M96 60 Q108 58 116 66 Q112 76 100 74 Q92 68 96 60 Z" />
          </g>
        </svg>

        {LEGENDS.map((legend) => (
          <button
            key={legend.id}
            type="button"
            onClick={() => setSelected(selected?.id === legend.id ? null : legend)}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${legend.x}%`, top: `${legend.y}%` }}
            aria-label={`Lenda: ${legend.region}`}
          >
            <span className="map-pin block h-3.5 w-3.5 rounded-full border border-gold bg-fire shadow-[0_0_14px_rgb(139_0_0/0.9)] transition-transform group-hover:scale-125" />
            <span className="eyebrow absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap text-[9px] opacity-70">
              {legend.region}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="card-3d mx-auto mt-6 max-w-2xl rounded-xl p-7 text-left" data-reveal>
          <p className="eyebrow">{selected.region}</p>
          <h3 className="mt-2 text-2xl font-bold text-bone">{selected.title}</h3>
          <p className="serif mt-3 text-lg leading-relaxed text-stone">{selected.text}</p>
        </div>
      )}
    </div>
  );
}
