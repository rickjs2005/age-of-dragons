"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
// O Lenis não injeta estilo nenhum: sem esta folha, `html.lenis body` fica sem
// `height: auto`, `[data-lenis-prevent]` não contém o overscroll e iframes
// roubam o ponteiro durante a rolagem.
import "lenis/dist/lenis.css";
import { SCROLL } from "@/lib/motion";
import { scrollStore } from "@/scene/scroll-store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Dono do scroll suave e única fonte que escreve `scrollStore.global` e
 * `scrollStore.pointer`.
 *
 * O Lenis roda em qualquer aparelho, não só em ponteiro fino: `syncTouch` fica
 * no padrão (false), então o toque continua nativo — o que ele acrescenta no
 * celular é a rolagem única que o ScrollTrigger e a cena WebGL leem.
 *
 * Sob `prefers-reduced-motion` o Lenis não é criado, mas o store continua sendo
 * alimentado pelo scroll nativo: a cena precisa saber onde a página está mesmo
 * sem inércia nenhuma.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({
        duration: SCROLL.duration,
        easing: SCROLL.easing,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        // href="#capitulo" passa a ser um voo do Lenis em vez do pulo seco do
        // navegador.
        anchors: { duration: SCROLL.anchorDuration, easing: SCROLL.anchorEasing },
      });
      raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      // O ticker do GSAP "engole" frames longos por padrão; com o Lenis
      // pendurado nele isso vira travanco visível na rolagem.
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);
    }

    // Um caminho só pro progresso global, com ou sem Lenis: ler a posição real
    // do documento. Com Lenis, essa posição já é a suavizada — ele escreve no
    // scroll de verdade, não num transform.
    const readScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      scrollStore.global = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    };
    const readPointer = (e: PointerEvent) => {
      scrollStore.pointer.x = e.clientX / window.innerWidth;
      scrollStore.pointer.y = 1 - e.clientY / window.innerHeight;
    };

    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("pointermove", readPointer, { passive: true });

    return () => {
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("pointermove", readPointer);
      // Sem remover o raf, cada hot-reload deixa um Lenis morto girando no
      // ticker do GSAP.
      if (raf) gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // padrão do GSAP
      lenis?.destroy();
    };
  });

  return <>{children}</>;
}
