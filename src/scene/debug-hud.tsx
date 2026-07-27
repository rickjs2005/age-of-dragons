"use client";

import { useEffect, useRef } from "react";
import { ACT_ONE, scrollStore, windowed } from "./scroll-store";

/**
 * Régua do Ato I. Só existe na página de laboratório — nunca no site.
 *
 * Mostra em que ponto do ato e de qual fase o scroll está, pra que uma crítica
 * ("os olhos ficam estranhos aqui") vire um número em vez de uma adivinhação.
 *
 * Escreve direto no DOM via ref, sem estado: o mesmo motivo do `scroll-store`
 * existir — um `setState` por frame derrubaria o que estamos tentando medir.
 */
export function DebugHud() {
  const linha1 = useRef<HTMLSpanElement>(null);
  const linha2 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let vivo = true;
    const tick = () => {
      if (!vivo) return;
      const a = scrollStore.actOne;
      const fase =
        a < ACT_ONE.revealEnd
          ? `revelação ${windowed(a, 0, ACT_ONE.revealEnd).toFixed(2)}`
          : a < ACT_ONE.chargeEnd
            ? `avanço ${windowed(a, ACT_ONE.revealEnd, ACT_ONE.chargeEnd).toFixed(2)}`
            : `fogo ${windowed(a, ACT_ONE.chargeEnd, 1).toFixed(2)}`;
      if (linha1.current) linha1.current.textContent = `ato ${a.toFixed(3)}`;
      if (linha2.current) linha2.current.textContent = fase;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        zIndex: 50,
        display: "flex",
        gap: 14,
        padding: "8px 14px",
        borderRadius: 999,
        border: "1px solid rgb(201 162 39 / 0.3)",
        background: "rgb(0 0 0 / 0.72)",
        color: "#e2c76a",
        font: "12px/1 ui-monospace, monospace",
        letterSpacing: "0.08em",
        pointerEvents: "none",
      }}
    >
      <span ref={linha1}>ato 0.000</span>
      <span ref={linha2} style={{ color: "#f5f2ec" }}>
        olhos 0.00
      </span>
    </div>
  );
}
