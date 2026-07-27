"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef, useState, useSyncExternalStore } from "react";
import { Ambient } from "./ambient";
import { Poster } from "./poster";
import { Reveal } from "./reveal";

/**
 * O único `<Canvas>` do site.
 *
 * Antes o fundo de lava criava o seu próprio, fixo em `z-index: -1`. O Ato I
 * precisa de WebGL na FRENTE, e dois Canvas seriam dois contextos WebGL — o
 * navegador limita quantos ficam ativos, e o segundo derruba o primeiro sem
 * avisar. Então existe um só: fica fixo atrás do texto (`z-0` contra o `z-10`
 * do conteúdo) e as fases entram e saem dele.
 */

/**
 * Media query sem `setState` dentro de efeito — que é o que dispara cascata de
 * render e é justamente o que o lint do projeto reclama no fundo antigo.
 * No servidor devolve `false`: o Canvas só monta depois da hidratação mesmo.
 */
function useMatchMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function Stage() {
  const reduce = useMatchMedia("(prefers-reduced-motion: reduce)");
  const coarse = useMatchMedia("(pointer: coarse)");
  const narrow = useMatchMedia("(max-width: 820px)");
  const light = coarse || narrow;

  const [dpr, setDpr] = useState(1.4);
  const declinedOnce = useRef(false);

  // Sob reduced-motion não há cena nenhuma: fica o último quadro da revelação,
  // parado. O Ato I continua ocupando a altura dele e o título continua
  // aparecendo — só não há movimento.
  if (reduce) {
    return (
      <div
        aria-hidden
        className="stage-poster"
        data-saiu="false"
        style={{ backgroundImage: 'url("/dragao/revelacao/f-121.webp")' }}
      />
    );
  }

  return (
    <>
      <Poster />
      <div aria-hidden className="stage-canvas">
      <Canvas
        dpr={light ? 1 : dpr}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
        camera={{ position: [0, 0, 5], fov: 55 }}
      >
        {/* Se o FPS cair, reduz a resolução interna UMA vez — re-resize
            repetido do canvas pisca em GPU fraca. */}
        <PerformanceMonitor
          factor={1}
          onDecline={() => {
            if (declinedOnce.current) return;
            declinedOnce.current = true;
            setDpr((d) => Math.max(0.75, d - 0.35));
          }}
        />
        {/* Ordem de desenho: o ambiente por baixo (renderOrder 0 e 1), o Ato I
            por cima (2). O ambiente fica em zero até o sopro, então durante o
            ato só existe o dragão. */}
        <Ambient leve={light} />
        <Reveal />
        {!light && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.7} luminanceThreshold={0.45} luminanceSmoothing={0.25} mipmapBlur />
          </EffectComposer>
        )}
        </Canvas>
      </div>
    </>
  );
}
