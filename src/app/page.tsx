import { Cinematic } from "@/components/cinematic";
import { Hero } from "@/components/hero";
import { WorldMap } from "@/components/world-map";

/* ===================== DADOS ===================== */

const ERAS = [
  { id: "china", era: "Mitologia Chinesa", year: "~2700 a.C.", map: "Vale do Rio Amarelo", image: "/art/nove-dragoes.webp", caption: "Chen Rong · Nove Dragões · 1244", story: "O Lóng nasce como divindade das águas: comanda chuvas, rios e a sorte das colheitas. Império e dragão viram sinônimos — cinco garras, só o trono." },
  { id: "japao", era: "Mitologia Japonesa", year: "~700 d.C.", map: "Arquipélago Japonês", image: "/art/hokusai-fuji.webp", caption: "Hokusai · Dragão sobre o Fuji · 1849", story: "O Ryū herda a serpente chinesa e mergulha no mar: guardião de palácios submersos e das marés. Hokusai o pintou subindo o Fuji em fumaça — sua última obra." },
  { id: "europa", era: "Europa Medieval", year: "~700–1500", map: "Do Reno aos Cárpatos", image: "/art/sao-jorge.webp", caption: "Uccello · São Jorge e o Dragão · c. 1470", story: "O dragão vira o adversário definitivo: cospe fogo, guarda ouro e mede a alma dos heróis. Beowulf o enfrenta; São Jorge o converte em lenda de altar." },
  { id: "biblia", era: "Tradição Bíblica", year: "~95 d.C.", map: "Patmos, Mar Egeu", image: "/art/dragao-biblia.webp", caption: "O grande dragão vermelho · Apocalipse 12 · arte conceitual", story: "Exilado em Patmos, João descreve um dragão vermelho de sete cabeças, dez chifres e sete coroas, cuja cauda arrasta um terço das estrelas do céu — 'a antiga serpente, chamada Diabo e Satanás'. Miguel e seus anjos o enfrentam e o expulsam do céu à Terra: o dragão deixa de ser bicho e vira a forma que o mal assume para, enfim, ser vencido." },
  { id: "nordica", era: "Mitologia Nórdica", year: "~800–1200", map: "Escandinávia", image: "/art/sigurd.webp", caption: "Sigurd mata Fáfnir · pedra de Ramsund (réplica)", story: "Fáfnir era um anão consumido pela ganância até virar dragão; Níðhöggr rói as raízes da árvore-mundo. No Norte, o dragão é o preço da cobiça." },
  { id: "maia", era: "Mesoamérica", year: "~100 d.C.", map: "Yucatán e Altiplano", image: "/art/quetzalcoatl.webp", caption: "Quetzalcóatl · Codex Telleriano-Remensis", story: "A serpente emplumada voa sem asas: deus do vento, de Vênus e do saber. Pirâmides inteiras foram alinhadas pro seu corpo de luz descer na equinócio." },
  { id: "celta", era: "Lendas Celtas", year: "~830 d.C.", map: "País de Gales", image: "/art/vortigern.webp", caption: "Os dragões de Vortigern · manuscrito medieval", story: "Sob a torre do rei, Merlin revela dois dragões em guerra: o vermelho vence o branco — e vira bandeira de um povo até hoje." },
];

const DRAGONS = [
  { name: "Smaug", universe: "O Hobbit", creator: "J.R.R. Tolkien", first: "1937", fact: "Dorme sobre a montanha de ouro de Erebor — e conversa antes de queimar.", color: "#c9a227" },
  { name: "Drogon", universe: "Game of Thrones", creator: "G.R.R. Martin", first: "1996 / 2011", fact: "O maior dos três filhos de Daenerys — e o único que decide o próprio destino.", color: "#8b0000" },
  { name: "Balerion", universe: "House of the Dragon", creator: "G.R.R. Martin", first: "2018", fact: "O Terror Negro: sua sombra engolia cidades inteiras. Conquistou Westeros.", color: "#3d0d0d" },
  { name: "Toothless", universe: "How to Train Your Dragon", creator: "Cressida Cowell / DreamWorks", first: "2003 / 2010", fact: "Um Fúria da Noite: o dragão mais rápido — e o mais leal — de Berk.", color: "#2b2b46" },
  { name: "Shenron", universe: "Dragon Ball", creator: "Akira Toriyama", first: "1984", fact: "Não cospe fogo: concede desejos. Basta reunir as sete esferas.", color: "#1d7a3f" },
  { name: "Alduin", universe: "The Elder Scrolls: Skyrim", creator: "Bethesda", first: "2011", fact: "O Devorador de Mundos fala a língua dos Thu'um — e você aprende a gritar de volta.", color: "#494f5c" },
  { name: "Fatalis", universe: "Monster Hunter", creator: "Capcom", first: "2004", fact: "A lenda proibida de Schrade: caçadores veteranos ainda tremem no tema de batalha.", color: "#5a1220" },
  { name: "Ender Dragon", universe: "Minecraft", creator: "Mojang", first: "2011", fact: "O chefe final do jogo mais vendido da história — derrotá-la 'zera' o mundo.", color: "#4d2a6b" },
  { name: "Saphira", universe: "Eragon", creator: "Christopher Paolini", first: "2002", fact: "Escamas de safira e alma ligada ao cavaleiro — escrita por um autor de 15 anos.", color: "#1f4e79" },
  { name: "Tiamat", universe: "Dungeons & Dragons", creator: "TSR / Wizards", first: "1975", fact: "Cinco cabeças, cinco sopros: a rainha dos dragões cromáticos herda o nome da Babilônia.", color: "#7a3b0f" },
];

const CINEMA = [
  { year: "1996", title: "Dragonheart", note: "Draco, dublado por Sean Connery, divide o coração com um rei." },
  { year: "2002", title: "Reign of Fire", note: "Dragões pós-apocalípticos dominam a Terra moderna." },
  { year: "2006", title: "Eragon", note: "Saphira leva a fantasia juvenil às telas." },
  { year: "2010", title: "How to Train Your Dragon", note: "Toothless redefine o dragão como melhor amigo." },
  { year: "2011", title: "Game of Thrones", note: "Drogon, Rhaegal e Viserion renascem das cinzas." },
  { year: "2012–14", title: "The Hobbit", note: "Smaug ganha voz (e desprezo) de Benedict Cumberbatch." },
  { year: "2022", title: "House of the Dragon", note: "A dança dos dragões: dezessete feras em guerra civil." },
  { year: "2023", title: "Dungeons & Dragons", note: "Honra entre ladrões traz o RPG raiz ao cinema." },
];

const COMPARISON = [
  { name: "Smaug", origem: "Terra-média", elemento: "Fogo", tamanho: "~60 m", poder: 5, inteligencia: 5, voo: "Sim", tipo: "Wyrm clássico" },
  { name: "Drogon", origem: "Westeros", elemento: "Fogo", tamanho: "~70 m", poder: 5, inteligencia: 4, voo: "Sim", tipo: "Dragão de guerra" },
  { name: "Toothless", universe: "", origem: "Berk", elemento: "Plasma", tamanho: "~8 m", poder: 4, inteligencia: 5, voo: "Sim", tipo: "Fúria da Noite" },
  { name: "Shenron", origem: "Terra (DB)", elemento: "Místico", tamanho: "Quilômetros", poder: 5, inteligencia: 5, voo: "Levita", tipo: "Dragão divino" },
  { name: "Alduin", origem: "Skyrim", elemento: "Fogo/Tempo", tamanho: "~20 m", poder: 5, inteligencia: 5, voo: "Sim", tipo: "Devorador de mundos" },
  { name: "Ender Dragon", origem: "The End", elemento: "Vazio", tamanho: "~20 m", poder: 3, inteligencia: 2, voo: "Sim", tipo: "Chefe final" },
  { name: "Tiamat", origem: "Avernus", elemento: "5 sopros", tamanho: "~40 m", poder: 5, inteligencia: 5, voo: "Sim", tipo: "Deusa-dragã" },
];

const CURIOSITIES = [
  { title: "O maior da ficção", text: "Shenron some no horizonte: quilômetros de corpo — mas Ancalagon, o Negro (Tolkien), quebrou montanhas ao cair." },
  { title: "O primeiro da literatura", text: "O wyrm sem nome de Beowulf (~700 d.C.) inaugura o dragão guardião de tesouro que Tolkien confessou ter roubado." },
  { title: "O mais poderoso", text: "Alduin come o próprio tempo; Shenron reescreve a realidade. Empate técnico entre fim do mundo e desejo." },
  { title: "O mais inteligente", text: "Smaug: vaidoso, estrategista e retórico — a conversa com Bilbo é uma aula de xadrez verbal." },
  { title: "O mais rápido", text: "Toothless, um Fúria da Noite: na lore de Berk, mais veloz que qualquer outra espécie catalogada." },
];

const GALLERY = [
  { src: "/art/leviatan.webp", alt: "A Destruição do Leviatã — Gustave Doré, 1865", label: "Doré · Leviatã · 1865" },
  { src: "/art/apocalipse.webp", alt: "O Dragão de Sete Cabeças — Dürer, 1498", label: "Dürer · Apocalipse · 1498" },
  { src: "/art/nove-dragoes.webp", alt: "Nove Dragões — Chen Rong, 1244", label: "Chen Rong · 1244" },
  { src: "/art/vortigern.webp", alt: "Os dragões de Vortigern — manuscrito medieval", label: "Vortigern · séc. XV" },
  { src: "/art/devorador.webp", alt: "O devorador ancestral emerge das chamas diante de uma silhueta solitária", label: "O Devorador Ancestral · arte conceitual" },
];

/* ===================== MARCAS/SVG ===================== */

const GLYPH_PATHS = [
  // 0 · alado clássico (Smaug, Drogon...)
  "M6 46 Q18 18 38 24 Q48 8 64 14 L74 4 L71 16 Q88 18 94 34 Q80 30 74 35 Q62 28 54 33 Q42 28 36 37 Q22 40 6 46 Z",
  // 1 · veloz / fúria da noite (Toothless, Fatalis...)
  "M4 40 Q24 44 34 30 Q30 16 44 10 Q40 22 50 24 Q66 10 84 16 Q72 22 70 30 Q88 28 96 38 Q78 34 68 40 Q52 32 40 38 Q22 32 4 40 Z",
  // 2 · celestial / serpente (Shenron, Saphira...)
  "M6 30 Q18 10 34 18 Q30 28 40 30 Q46 14 60 20 Q54 30 64 32 Q72 18 88 22 Q78 30 84 40 Q66 36 58 44 Q46 34 36 42 Q22 36 6 30 Z",
  // 3 · devorador / chifrudo (Alduin, Tiamat...)
  "M8 44 L20 16 L26 26 L36 10 L40 24 L52 6 L54 22 L68 12 Q64 24 74 26 Q86 22 96 32 Q80 30 76 38 Q60 30 50 36 Q34 28 26 38 Q16 34 8 44 Z",
];
const GLYPH_EYE: Array<[number, number]> = [
  [72, 10],
  [82, 18],
  [85, 23],
  [66, 14],
];

function ChapterMark({ reveal = true }: { reveal?: boolean }) {
  return (
    <div className="chapter-mark" aria-hidden {...(reveal ? { "data-reveal": true } : {})}>
      <svg viewBox="0 0 64 20" className="h-4 w-20" fill="none">
        <path
          d="M1 10 Q16 1.5 28.5 9.5"
          stroke="#ff7a3d"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M1 10 Q16 18.5 28.5 10.5"
          stroke="#ff7a3d"
          strokeOpacity="0.55"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M63 10 Q48 1.5 35.5 9.5"
          stroke="#ff7a3d"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M63 10 Q48 18.5 35.5 10.5"
          stroke="#ff7a3d"
          strokeOpacity="0.55"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <rect
          className="chapter-mark-core"
          x="27.5"
          y="5.5"
          width="9"
          height="9"
          rx="1.4"
          transform="rotate(45 32 10)"
          fill="var(--color-gold-soft)"
        />
      </svg>
    </div>
  );
}

function DragonGlyph({ color, variant }: { color: string; variant: number }) {
  const i = variant % GLYPH_PATHS.length;
  const [ex, ey] = GLYPH_EYE[i];
  return (
    <svg
      viewBox="0 0 100 52"
      aria-hidden
      className="h-20 w-full"
      fill="none"
      style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}
    >
      <g stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={GLYPH_PATHS[i]} />
        <circle cx={ex} cy={ey} r="1.7" fill={color} stroke="none" />
      </g>
    </svg>
  );
}

function FinalSilhouette() {
  return (
    <svg viewBox="0 0 400 240" aria-hidden className="mx-auto w-full max-w-5xl text-[#211d1a]">
      <g fill="currentColor">
        <path
          className="wing-l"
          d="M200,170 Q110,80 12,48 Q60,60 58,95 Q100,105 100,145 Q160,165 200,170 Z"
        />
        <path
          className="wing-r"
          d="M200,170 Q290,80 388,48 Q340,60 342,95 Q300,105 300,145 Q240,165 200,170 Z"
        />
        <path
          d="M185,178 C178,150 182,120 172,95 C165,78 168,60 158,48 L130,42 L145,55 L165,50
             C172,66 180,70 190,66 L200,40 L195,20 L225,8 L205,35 L222,42 L210,50
             C215,70 210,90 218,110 C224,130 218,155 212,178 Z"
        />
        <path d="M205,178 Q230,200 220,225 Q235,235 250,225 Q232,238 215,232 Q222,218 210,205 Q200,195 205,178 Z" />
      </g>
    </svg>
  );
}

/* ===================== PÁGINA ===================== */

export default function Home() {
  return (
    <Cinematic>
      <main className="grain">
        {/* Nav */}
        <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
          <p className="font-display text-sm font-black tracking-[0.35em] text-bone">
            THE AGE OF <span className="text-gold">DRAGONS</span>
          </p>
          <a
            href="#eras"
            className="hidden rounded-full border border-gold/40 bg-abyss/60 px-4 py-2 font-display text-[11px] tracking-[0.25em] text-gold-soft uppercase backdrop-blur transition-colors hover:bg-gold hover:text-abyss sm:block"
          >
            A História
          </a>
        </header>

        <Hero />

        {/* ===== 1 · O nascimento dos dragões ===== */}
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
                <figure className="museum-frame" data-reveal>
                  <div className="overflow-hidden">
                    <img src={era.image} alt={era.caption} loading="lazy" className="h-[420px] w-full scale-110 object-cover sm:h-[480px]" data-parallax="0.06" />
                  </div>
                  <figcaption className="museum-caption mt-3">{era.caption}</figcaption>
                </figure>
                <div data-reveal>
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-5xl font-black text-fire-bright/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-3xl font-bold text-bone">{era.era}</h3>
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

        {/* ===== 2 · Dragões mais famosos da ficção ===== */}
        <section className="lava-seam relative border-y border-gold/10 bg-abyss-2/50 py-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <ChapterMark />
            <p className="eyebrow" data-reveal>
              Capítulo II · Os lendários
            </p>
            <h2 className="mt-4 text-4xl font-bold text-bone sm:text-6xl" data-chars>
              Os dez que a ficção coroou.
            </h2>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {DRAGONS.map((dragon, i) => (
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
                  <p className="serif mt-4 min-h-20 text-[15px] leading-relaxed text-stone italic">
                    {dragon.fact}
                  </p>
                  <span className="mt-4 inline-block border-b border-fire-bright/60 pb-0.5 font-display text-[11px] tracking-[0.22em] text-fire-bright uppercase">
                    Saiba mais
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 3 · Mapa das lendas ===== */}
        <section className="mx-auto max-w-6xl px-6 py-32 sm:px-10">
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

        {/* ===== 4 · Linha do tempo horizontal ===== */}
        <section id="timeline-pin" className="lava-seam relative overflow-hidden border-y border-gold/10 bg-abyss-2/40">
          <div className="flex h-screen flex-col justify-center">
            <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
              <ChapterMark reveal={false} />
              <p className="eyebrow">Capítulo IV · A travessia</p>
              <h2 className="mt-3 text-3xl font-bold text-bone sm:text-5xl">
                Quatro mil anos em um voo.
              </h2>
            </div>
            <div id="timeline-track" className="mt-14 flex w-max gap-8 pr-[40vw] pl-6 sm:pl-10">
              {[
                ["~1750 a.C.", "Tiamat na Babilônia", "O caos primordial tem corpo de dragoa. Marduk a corta ao meio — e do corpo nasce o mundo."],
                ["~600 a.C.", "Leviatã nas Escrituras", "“Da sua boca saem tochas” — Jó 41 descreve a fera que nenhum anzol segura."],
                ["1244", "Nove Dragões", "Chen Rong pinta a obra-prima do dragão oriental: dez metros de tinta, névoa e garra."],
                ["~1470", "São Jorge de Uccello", "O dragão medieval vira retábulo: o mal com asas, vencido pela lança."],
                ["1498", "Apocalipse de Dürer", "Sete cabeças em xilogravura — o dragão bíblico impresso em série pela primeira vez."],
                ["1937", "Smaug", "Tolkien devolve a voz ao dragão. A fantasia moderna nasce sob suas asas."],
                ["1975", "Dungeons & Dragons", "O dragão vira sistema: agora qualquer mesa pode enfrentá-lo — ou pilotá-lo."],
                ["2011", "A era do streaming", "Drogon, Alduin e a Ender Dragon estreiam no MESMO ano. O dragão domina todas as telas."],
              ].map(([year, title, text]) => (
                <article key={year as string} className="card-3d w-[78vw] shrink-0 rounded-2xl p-8 sm:w-[420px]">
                  <p className="font-display text-4xl font-black text-gold">{year}</p>
                  <h3 className="mt-2 text-2xl font-bold text-bone">{title}</h3>
                  <p className="serif mt-3 text-lg leading-relaxed text-stone">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 5 · Galeria ===== */}
        <section className="mx-auto max-w-7xl px-6 py-32 sm:px-10">
          <ChapterMark />
          <p className="eyebrow" data-reveal>
            Capítulo V · A galeria
          </p>
          <h2 className="mt-4 text-4xl font-bold text-bone sm:text-6xl" data-chars>
            O acervo proibido.
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {GALLERY.map((item, i) => {
              const isLast = i === GALLERY.length - 1;
              return (
                <figure
                  key={item.src}
                  data-reveal
                  className={`gallery-card group relative overflow-hidden rounded-2xl border border-gold/15 ${isLast ? "md:col-span-2" : ""}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className={`w-full object-cover ${isLast ? "h-[520px]" : "h-[420px]"}`}
                  />
                  <figcaption className="museum-caption absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-abyss via-abyss/60 to-transparent p-5 pt-14">
                    {item.label}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>

        {/* ===== 6 · Comparação ===== */}
        <section className="lava-seam border-y border-gold/10 bg-abyss-2/50 py-32">
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
                <thead>
                  <tr className="border-b border-gold/30 font-display text-[11px] tracking-[0.2em] text-gold uppercase">
                    <th className="py-4 pr-4">Dragão</th>
                    <th className="px-4">Origem</th>
                    <th className="px-4">Elemento</th>
                    <th className="px-4">Tamanho</th>
                    <th className="px-4">Poder</th>
                    <th className="px-4">Inteligência</th>
                    <th className="px-4">Voo</th>
                    <th className="pl-4">Tipo</th>
                  </tr>
                </thead>
                <tbody className="text-stone">
                  {COMPARISON.map((row) => (
                    <tr key={row.name} className="border-b border-bone/8 transition-colors hover:bg-fire/10">
                      <td className="py-4 pr-4 font-display text-base font-bold text-bone">{row.name}</td>
                      <td className="px-4">{row.origem}</td>
                      <td className="px-4">{row.elemento}</td>
                      <td className="px-4">{row.tamanho}</td>
                      <td className="px-4 text-gold-soft">{"◆".repeat(row.poder)}<span className="text-bone/15">{"◆".repeat(5 - row.poder)}</span></td>
                      <td className="px-4 text-gold-soft">{"◆".repeat(row.inteligencia)}<span className="text-bone/15">{"◆".repeat(5 - row.inteligencia)}</span></td>
                      <td className="px-4">{row.voo}</td>
                      <td className="pl-4">{row.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ===== 7 · Dragões no cinema ===== */}
        <section className="mx-auto max-w-4xl px-6 py-32 sm:px-10">
          <ChapterMark />
          <p className="eyebrow" data-reveal>
            Capítulo VII · As telas
          </p>
          <h2 className="mt-4 text-4xl font-bold text-bone sm:text-6xl" data-chars>
            O dragão vai ao cinema.
          </h2>
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

        {/* ===== 8 · Curiosidades ===== */}
        <section className="lava-seam border-y border-gold/10 bg-abyss-2/50 py-32">
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

        {/* ===== Final ===== */}
        <section className="relative overflow-hidden py-40">
          <div aria-hidden className="absolute inset-x-0 bottom-0 [background:radial-gradient(60%_70%_at_50%_100%,rgb(139_0_0/0.22),transparent_70%)]">
            <FinalSilhouette />
          </div>
          <div aria-hidden className="smoke bottom-0 left-1/4 h-64 w-[40rem]" />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
            <p className="serif text-2xl leading-relaxed text-bone italic sm:text-4xl" data-reveal>
              “As lendas nunca morrem.
              <br />
              Elas apenas esperam pelo próximo contador de histórias.”
            </p>
            <a
              href="#"
              data-reveal
              className="mt-12 rounded-full border border-gold/50 bg-abyss/60 px-8 py-3.5 font-display text-sm tracking-[0.22em] text-gold-soft uppercase backdrop-blur transition-colors hover:bg-gold hover:text-abyss"
            >
              Voltar ao topo
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="lava-seam border-t border-gold/10 px-6 py-12 text-center">
          <p className="museum-caption">
            The Age of Dragons — experiência-conceito por{" "}
            <a href="https://milweb.com.br" className="text-gold-soft underline-offset-4 hover:underline">
              MilWeb
            </a>
            . Obras históricas em domínio público; personagens citados pertencem aos seus criadores.
          </p>
        </footer>
      </main>
    </Cinematic>
  );
}
