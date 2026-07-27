"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { ACT_ONE, scrollStore } from "./scroll-store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Ato I — O Despertar. A caixa de scroll que alimenta `scrollStore.actOne`.
 *
 * O grude é `position: sticky`, não pin do ScrollTrigger. Pin insere espaçador
 * no layout e recalcula altura a cada refresh — com o Lenis por baixo isso
 * costuma render um tranco no começo e no fim. Sticky é nativo, não mexe no
 * documento, e sobra pro ScrollTrigger só o trabalho que ele faz bem: relatar
 * progresso.
 *
 * A cena em si mora no `<Stage>`; aqui só existe a altura, o título e o
 * fallback pra quem pediu menos movimento.
 */

/** Altura do ato, em telas. Se arrastar no teste real, é o único número. */
const SCREENS = 4;

/** Onde o ato congela sob reduced-motion: corpo revelado, antes do sopro. */
const ACT_ONE_STILL = 0.7;

export function ActOne() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        scrollStore.actOne = ACT_ONE_STILL;
        gsap.set("[data-act-title]", { autoAlpha: 1, y: 0 });
        return;
      }

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollStore.actOne = self.progress;
        },
      });

      // O título só entra depois do fogo: as quatro telas antes dele são puro
      // visual, sem uma palavra na tela.
      gsap.fromTo(
        "[data-act-title]",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: () => `${ACT_ONE.chargeEnd * 100}% top`,
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative" style={{ height: `${SCREENS * 100}svh` }}>
      <div className="sticky top-0 flex h-[100svh] items-end justify-center overflow-hidden pb-[12vh]">
        <div data-act-title className="relative z-10 px-6 text-center opacity-0">
          <p className="eyebrow">Um documentário interativo</p>
          <h1 className="gilded mt-4 font-display text-[clamp(2.6rem,8.5vw,7.2rem)] leading-[0.98] font-black">
            THE AGE
            <br />
            OF DRAGONS
          </h1>
          <p className="serif mt-5 max-w-xl text-xl text-stone italic sm:text-2xl">
            Conheça as criaturas que moldaram mitologias, impérios e a imaginação da humanidade.
          </p>
        </div>
      </div>
    </section>
  );
}
