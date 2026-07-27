"use client";

import { useEffect, useState } from "react";
import { sceneState } from "./scroll-store";

/**
 * O primeiro segundo.
 *
 * Link que circula não perdoa tela preta: se a pessoa abre e não há nada, ela
 * volta antes do WebGL sequer inicializar. Este cartaz é um WebP de 96px e
 * **154 bytes**, embutido em base64 no próprio HTML — ele não faz requisição
 * nenhuma e pinta no primeiro frame, antes de qualquer JavaScript rodar.
 *
 * A imagem já vem com a mesma gama esmagada que o shader aplica no começo do
 * ato: preto absoluto e dois olhos vermelhos. Quando o Ato I desenha o
 * primeiro quadro de verdade, o cartaz some por baixo dele — e como os dois
 * mostram a mesma coisa no mesmo lugar, a troca não aparece.
 */

const CARTAZ =
  "data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAACQBQCdASpgADYAPnk8m0oko6KhpBqoAJAPCWkAHaH/sV6AADK/kFtIZZ4YGWocuY" +
  "NFG8rzIAD++teyEIoVfsevwQfpkrBJirI7goniOR6daNzPl75z0oG35HsWvP/HufAsf8t+E07GnQASCVOOdW9oxe9X" +
  "+F68zH86kMBWz0jA4xAAAAAAAA==";

export function Poster() {
  const [saiu, setSaiu] = useState(false);

  useEffect(() => {
    // Sempre pelo rAF, nunca direto no corpo do efeito: `setState` síncrono
    // ali dispara render em cascata (e o lint do projeto barra). O primeiro
    // quadro do rAF chega em ~16ms, então não custa nada.
    let vivo = true;
    const olhar = () => {
      if (!vivo) return;
      if (sceneState.primeiroQuadro) {
        setSaiu(true);
        return;
      }
      requestAnimationFrame(olhar);
    };
    requestAnimationFrame(olhar);
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <div
      aria-hidden
      className="stage-poster"
      data-saiu={saiu ? "true" : "false"}
      style={{ backgroundImage: `url("${CARTAZ}")` }}
    />
  );
}
