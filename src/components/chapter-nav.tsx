"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CHAPTERS } from "@/data/chapters";

/**
 * Antes só existia um link "A História" (href="#eras"), escondido abaixo do
 * breakpoint sm — em telas de celular não havia NENHUMA forma de pular
 * capítulo além de rolar a página inteira. Isso substitui aquele link por um
 * gatilho visível em qualquer largura, que abre a lista dos 8 capítulos.
 */
export function ChapterNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="chapter-nav">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="chapter-nav-trigger"
      >
        <span aria-hidden className="chapter-nav-icon" data-open={open}>
          <span />
          <span />
          <span />
        </span>
        Capítulos
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar menu de capítulos"
            className="chapter-nav-scrim"
            onClick={() => setOpen(false)}
          />
          <div id={panelId} ref={panelRef} className="chapter-nav-panel" role="dialog" aria-label="Capítulos">
            <ol>
              {CHAPTERS.map((chapter) => (
                <li key={chapter.id}>
                  <a href={`#${chapter.id}`} onClick={() => setOpen(false)}>
                    <span className="chapter-nav-numeral">{chapter.numeral}</span>
                    {chapter.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
