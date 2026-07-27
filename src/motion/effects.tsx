"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
import { DURATION, EASE } from "@/lib/motion";
import { ChapterProgress } from "@/components/chapter-progress";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * O motor de animação do conteúdo (Ato II em diante). Uma ilha só:
 *
 * - `[data-reveal]` sobe e aparece ao entrar em quadro
 * - `[data-chars]` revela letra por letra
 * - `[data-parallax="0.2"]` desliza na rolagem
 * - `[data-tilt]` inclina ao mouse com luz seguindo (`--mx` / `--my`)
 * - barra de progresso do documentário, cinzas e relâmpago ocasional
 *
 * Saiu do antigo `cinematic.tsx`, que fazia isto E era dono do Lenis E do
 * fundo WebGL E do pin da linha do tempo horizontal. O Lenis virou
 * `smooth-scroll.tsx`, o fundo virou `scene/`, e a linha do tempo saiu do
 * site com o corte para quatro capítulos.
 */
export function Effects({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [flash, setFlash] = useState(0);

  // relâmpago ocasional (8–20s)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let vivo = true;
    let t: number;
    const agendar = () => {
      t = window.setTimeout(
        () => {
          if (!vivo) return;
          setFlash((f) => f + 1);
          agendar();
        },
        8000 + Math.random() * 12000,
      );
    };
    agendar();
    return () => {
      vivo = false;
      window.clearTimeout(t);
    };
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const fine = window.matchMedia("(pointer: fine)").matches;

      const bar = el.querySelector<HTMLElement>("[data-progress]");
      if (bar) {
        gsap.set(bar, { scaleX: 0 });
        ScrollTrigger.create({
          start: 0,
          end: () => document.documentElement.scrollHeight - window.innerHeight,
          scrub: 0.3,
          onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
        });
      }

      el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 46 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DURATION.reveal,
            ease: EASE.reveal,
            scrollTrigger: { trigger: item, start: "top 86%", toggleActions: "play none none none" },
          },
        );
      });

      el.querySelectorAll<HTMLElement>("[data-chars]").forEach((item) => {
        const split = SplitText.create(item, { type: "chars", mask: "chars", aria: "none" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: DURATION.charsStagger,
          duration: DURATION.chars,
          ease: EASE.snap,
          scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((item) => {
        const depth = parseFloat(item.dataset.parallax ?? "0.2");
        gsap.to(item, {
          yPercent: -depth * 100,
          ease: EASE.linear,
          scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      if (fine) {
        el.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: DURATION.tilt, ease: "power3" });
          const ry = gsap.quickTo(card, "rotationY", { duration: DURATION.tilt, ease: "power3" });
          gsap.set(card, { transformPerspective: 800 });
          card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 10);
            rx((0.5 - py) * 8);
            card.style.setProperty("--mx", `${px * 100}%`);
            card.style.setProperty("--my", `${py * 100}%`);
          });
          card.addEventListener("mouseleave", () => {
            rx(0);
            ry(0);
          });
        });
      }
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div data-progress aria-hidden className="scroll-progress" />
      <ChapterProgress />
      <div key={flash} aria-hidden className={`lightning ${flash > 0 ? "flash" : ""}`} />
      {CINZAS.map((a, i) => (
        <span
          key={i}
          aria-hidden
          className="ash"
          style={{
            left: a.left,
            width: a.size,
            height: a.size,
            ["--ash-dur" as string]: a.dur,
            ["--ash-delay" as string]: a.delay,
            ["--ash-drift" as string]: a.drift,
            ["--ash-peak" as string]: a.peak,
          }}
        />
      ))}
      {children}
    </div>
  );
}

const CINZAS = [
  { left: "6%", size: 3, dur: "17s", delay: "0s", drift: "5vw", peak: 0.55 },
  { left: "16%", size: 2, dur: "21s", delay: "4s", drift: "-4vw", peak: 0.4 },
  { left: "28%", size: 2, dur: "19s", delay: "9s", drift: "3vw", peak: 0.5 },
  { left: "41%", size: 3, dur: "23s", delay: "2s", drift: "-5vw", peak: 0.45 },
  { left: "54%", size: 2, dur: "18s", delay: "12s", drift: "4vw", peak: 0.5 },
  { left: "67%", size: 2, dur: "22s", delay: "6s", drift: "-3vw", peak: 0.4 },
  { left: "78%", size: 3, dur: "20s", delay: "10s", drift: "5vw", peak: 0.55 },
  { left: "90%", size: 2, dur: "24s", delay: "3s", drift: "-4vw", peak: 0.45 },
];
