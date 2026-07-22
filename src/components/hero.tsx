"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

/**
 * Hero: vídeo do dragão fullscreen em loop, fumaça, cinzas globais por cima,
 * e parallax de MOUSE nas camadas [data-depth] (título/fumaça se deslocam
 * contra o cursor). O botão rola pra primeira era.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = root.current;
    if (!el) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map((layer) => ({
      depth: parseFloat(layer.dataset.depth ?? "0"),
      x: gsap.quickTo(layer, "x", { duration: 0.9, ease: "power3" }),
      y: gsap.quickTo(layer, "y", { duration: 0.9, ease: "power3" }),
    }));
    const move = (e: PointerEvent) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      for (const l of layers) {
        l.x(-dx * l.depth * 60);
        l.y(-dy * l.depth * 40);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden">
      <video
        src="/video/dragao-scrub.mp4"
        poster="/video/poster.webp"
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* vinheta e chão escuro */}
      <div aria-hidden className="absolute inset-0 [background:radial-gradient(120%_95%_at_50%_40%,transparent_42%,rgb(9_9_9/0.82)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-abyss" />
      {/* fumaça em camadas com parallax */}
      <div aria-hidden data-depth="0.5" className="smoke top-1/3 left-[8%] h-72 w-[46rem]" style={{ ["--smoke-dur" as string]: "16s" }} />
      <div aria-hidden data-depth="0.9" className="smoke bottom-[12%] right-[4%] h-80 w-[52rem]" style={{ ["--smoke-dur" as string]: "22s" }} />

      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-[8vh] px-6 text-center">
        <p data-depth="0.15" className="eyebrow">
          Um documentário interativo
        </p>
        <h1
          data-depth="0.25"
          className="gilded mt-4 font-display text-[clamp(2.6rem,8.5vw,7.2rem)] leading-[0.98] font-black"
        >
          THE AGE
          <br />
          OF DRAGONS
        </h1>
        <p data-depth="0.15" className="serif mt-5 max-w-xl text-xl text-stone italic sm:text-2xl">
          Conheça as criaturas que moldaram mitologias, impérios e a imaginação da humanidade.
        </p>
        <a
          data-depth="0.1"
          href="#eras"
          className="mt-8 rounded-full border border-gold/50 bg-abyss/50 px-8 py-3.5 font-display text-sm tracking-[0.22em] text-gold-soft uppercase backdrop-blur transition-colors hover:bg-gold hover:text-abyss"
        >
          Explore a História
        </a>
      </div>
    </section>
  );
}
