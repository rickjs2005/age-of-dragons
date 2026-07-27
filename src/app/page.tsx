import { ChapterNav } from "@/components/chapter-nav";
import { CinemaTimeline } from "@/components/sections/cinema-timeline";
import { EraSection } from "@/components/sections/era-section";
import { FinalCta } from "@/components/sections/final-cta";
import { WorldMapSection } from "@/components/sections/world-map-section";
import { Effects } from "@/motion/effects";
import { SmoothScroll } from "@/motion/smooth-scroll";
import { ActOne } from "@/scene/act-one";
import { Stage } from "@/scene/stage";

export default function Home() {
  return (
    <SmoothScroll>
      {/* O Canvas único: o Ato I por cima, o fundo incandescente por baixo. */}
      <Stage />
      <Effects>
        <main id="top" className="grain relative z-10">
          <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
            <p className="font-display text-sm font-black tracking-[0.35em] text-bone">
              THE AGE OF <span className="text-gold">DRAGONS</span>
            </p>
            <ChapterNav />
          </header>

          <ActOne />
          <EraSection />
          <WorldMapSection />
          <CinemaTimeline />
          <FinalCta />

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
      </Effects>
    </SmoothScroll>
  );
}
