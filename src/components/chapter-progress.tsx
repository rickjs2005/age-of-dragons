"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from "@/data/chapters";

/**
 * Indicador fixo "Capítulo N/VIII" — a moldura de documentário que a copy já
 * promete ("Um documentário interativo", "Capítulo I" a "VIII") mas que antes
 * só existia no texto, nunca na interface. Observa as seções de capítulo e
 * mostra qual está em foco; some no hero e na seção final.
 */
export function ChapterProgress() {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          const index = CHAPTERS.findIndex((c) => c.id === id);
          if (index !== -1) setActiveIndex(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const chapter = activeIndex >= 0 ? CHAPTERS[activeIndex] : null;

  return (
    <div aria-hidden className="chapter-progress" data-visible={chapter ? "true" : "false"}>
      {chapter && (
        <>
          <span className="chapter-progress-count">
            {chapter.numeral}
            <span className="chapter-progress-total">/{CHAPTERS[CHAPTERS.length - 1].numeral}</span>
          </span>
          <span className="chapter-progress-label">{chapter.label}</span>
        </>
      )}
    </div>
  );
}
