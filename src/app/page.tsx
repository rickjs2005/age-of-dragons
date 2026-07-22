import { Cinematic } from "@/components/cinematic";
import { Hero } from "@/components/hero";
import { ChapterNav } from "@/components/chapter-nav";
import { EraSection } from "@/components/sections/era-section";
import { DragonGrid } from "@/components/sections/dragon-grid";
import { WorldMapSection } from "@/components/sections/world-map-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { CinemaTimeline } from "@/components/sections/cinema-timeline";
import { CuriositiesGrid } from "@/components/sections/curiosities-grid";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <Cinematic>
      <main id="top" className="grain">
        <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
          <p className="font-display text-sm font-black tracking-[0.35em] text-bone">
            THE AGE OF <span className="text-gold">DRAGONS</span>
          </p>
          <ChapterNav />
        </header>

        <Hero />
        <EraSection />
        <DragonGrid />
        <WorldMapSection />
        <TimelineSection />
        <GallerySection />
        <ComparisonTable />
        <CinemaTimeline />
        <CuriositiesGrid />
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
    </Cinematic>
  );
}
