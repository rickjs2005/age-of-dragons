"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { DURATION, EASE } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero: vídeo do dragão fullscreen em loop, entrada cinematográfica ao
 * carregar (zoom-out + título revelado em cascata), saída em parallax presa
 * ao scroll (vídeo aproxima e escurece enquanto o conteúdo sobe e some), e
 * parallax de MOUSE nas camadas [data-depth]. O botão rola pra primeira era.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const video = videoRef.current;
      if (!el || !video) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduce) {
        gsap
          .timeline({ delay: 0.15 })
          .fromTo(video, { scale: 1.16, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: DURATION.heroVideo, ease: EASE.soft })
          .fromTo(
            "[data-hero-in]",
            { autoAlpha: 0, y: 34 },
            { autoAlpha: 1, y: 0, duration: DURATION.heroCascade, stagger: DURATION.heroCascadeStagger, ease: EASE.reveal },
            0.5,
          )
          .fromTo("[data-hero-cue]", { autoAlpha: 0 }, { autoAlpha: 1, duration: DURATION.heroCue }, 1.7);

        gsap.to(video, {
          scale: 1.18,
          ease: EASE.linear,
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-exit]", {
          yPercent: -22,
          autoAlpha: 0,
          ease: EASE.linear,
          scrollTrigger: { trigger: el, start: "top top", end: "65% top", scrub: true },
        });
        gsap.to("[data-hero-cue]", {
          autoAlpha: 0,
          ease: EASE.linear,
          scrollTrigger: { trigger: el, start: "top top", end: "12% top", scrub: true },
        });
        gsap.to("[data-hero-vignette]", {
          opacity: 1,
          ease: EASE.linear,
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      } else {
        gsap.set(video, { autoAlpha: 1 });
      }

      if (!window.matchMedia("(pointer: fine)").matches) return;
      const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map((layer) => ({
        depth: parseFloat(layer.dataset.depth ?? "0"),
        x: gsap.quickTo(layer, "x", { duration: DURATION.parallaxPointer, ease: "power3" }),
        y: gsap.quickTo(layer, "y", { duration: DURATION.parallaxPointer, ease: "power3" }),
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
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden">
      <video
        ref={videoRef}
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
      <div aria-hidden data-hero-vignette className="absolute inset-0 bg-abyss opacity-0" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-abyss" />
      {/* fumaça em camadas com parallax */}
      <div aria-hidden data-depth="0.5" data-hero-exit className="smoke top-1/3 left-[8%] h-72 w-[46rem]" style={{ ["--smoke-dur" as string]: "16s" }} />
      <div aria-hidden data-depth="0.9" data-hero-exit className="smoke bottom-[12%] right-[4%] h-80 w-[52rem]" style={{ ["--smoke-dur" as string]: "22s" }} />

      <div data-hero-exit className="relative z-10 flex h-full flex-col items-center justify-end pb-[8vh] px-6 text-center">
        <p data-depth="0.15" data-hero-in className="eyebrow">
          Um documentário interativo
        </p>
        <h1
          data-depth="0.25"
          data-hero-in
          className="gilded mt-4 font-display text-[clamp(2.6rem,8.5vw,7.2rem)] leading-[0.98] font-black"
        >
          THE AGE
          <br />
          OF DRAGONS
        </h1>
        <p data-depth="0.15" data-hero-in className="serif mt-5 max-w-xl text-xl text-stone italic sm:text-2xl">
          Conheça as criaturas que moldaram mitologias, impérios e a imaginação da humanidade.
        </p>
        <a
          data-depth="0.1"
          data-hero-in
          href="#eras"
          className="mt-8 rounded-full border border-gold/50 bg-abyss/50 px-8 py-3.5 font-display text-sm tracking-[0.22em] text-gold-soft uppercase backdrop-blur transition-colors hover:bg-gold hover:text-abyss"
        >
          Explore a História
        </a>
      </div>

      <div data-hero-cue aria-hidden className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 opacity-0">
        <span className="scroll-cue-line block h-9 w-px bg-gradient-to-b from-gold/70 to-transparent" />
        <span className="eyebrow text-[9px]!">Role</span>
      </div>
    </section>
  );
}
