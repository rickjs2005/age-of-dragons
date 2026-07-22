"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * Motor cinematográfico da página inteira (uma ilha só):
 * - Lenis (scroll fluido, desktop fine)
 * - Revelações: [data-reveal] sobe+fade; [data-chars] letra por letra
 * - Parallax de scroll: [data-parallax="0.2"] desliza na rolagem
 * - Cards 3D: [data-tilt] inclinam ao mouse + luz vermelha seguindo (--mx/--my)
 * - Seção horizontal: #timeline-track pinada e scrubada
 * - Cursor custom + cinzas + relâmpago ocasional
 */
export function Cinematic({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [flash, setFlash] = useState(0);

  // relâmpago ocasional (8–20s)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let t: number;
    const schedule = () => {
      t = window.setTimeout(() => {
        if (!alive) return;
        setFlash((f) => f + 1);
        schedule();
      }, 8000 + Math.random() * 12000);
    };
    schedule();
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fine = window.matchMedia("(pointer: fine)").matches;

      let lenis: Lenis | null = null;
      if (!reduce && fine) {
        lenis = new Lenis({
          duration: 1.3,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          wheelMultiplier: 1,
          touchMultiplier: 1.4,
        });
        const raf = (time: number) => lenis!.raf(time * 1000);
        gsap.ticker.add(raf);
        lenis.on("scroll", ScrollTrigger.update);
      }
      if (reduce) return;

      // Barra de progresso do documentário
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

      // Revelações
      el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 46 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 86%", toggleActions: "play none none none" },
          },
        );
      });

      // Letra por letra
      el.querySelectorAll<HTMLElement>("[data-chars]").forEach((item) => {
        const split = SplitText.create(item, { type: "chars", mask: "chars", aria: "none" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.018,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // Parallax de scroll
      el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((item) => {
        const depth = parseFloat(item.dataset.parallax ?? "0.2");
        gsap.to(item, {
          yPercent: -depth * 100,
          ease: "none",
          scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Linha do tempo horizontal
      const track = el.querySelector<HTMLElement>("#timeline-track");
      const pinWrap = el.querySelector<HTMLElement>("#timeline-pin");
      if (track && pinWrap && fine) {
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinWrap,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Tilt 3D + luz seguindo o mouse
      if (fine) {
        el.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
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

      return () => {
        lenis?.destroy();
      };
    },
    { scope: root },
  );

  // cursor custom
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dotEl = dot.current!;
    const ringEl = ring.current!;
    const dx = gsap.quickTo(dotEl, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dotEl, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ringEl, "x", { duration: 0.35, ease: "power3" });
    const ry = gsap.quickTo(ringEl, "y", { duration: 0.35, ease: "power3" });
    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const interactive = (e.target as HTMLElement).closest("a, button, [data-tilt]");
      ringEl.classList.toggle("is-hover", Boolean(interactive));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={root}>
      <div data-progress aria-hidden className="scroll-progress" />
      <div ref={dot} aria-hidden className="cursor-dot" />
      <div ref={ring} aria-hidden className="cursor-ring" />
      <div key={flash} aria-hidden className={`lightning ${flash > 0 ? "flash" : ""}`} />
      {/* cinzas globais */}
      {ASHES.map((a, i) => (
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

const ASHES = [
  { left: "6%", size: 3, dur: "17s", delay: "0s", drift: "5vw", peak: 0.55 },
  { left: "16%", size: 2, dur: "21s", delay: "4s", drift: "-4vw", peak: 0.4 },
  { left: "28%", size: 2, dur: "19s", delay: "9s", drift: "3vw", peak: 0.5 },
  { left: "41%", size: 3, dur: "23s", delay: "2s", drift: "-5vw", peak: 0.45 },
  { left: "54%", size: 2, dur: "18s", delay: "12s", drift: "4vw", peak: 0.5 },
  { left: "67%", size: 2, dur: "22s", delay: "6s", drift: "-3vw", peak: 0.4 },
  { left: "78%", size: 3, dur: "20s", delay: "10s", drift: "5vw", peak: 0.55 },
  { left: "90%", size: 2, dur: "24s", delay: "3s", drift: "-4vw", peak: 0.45 },
];
