"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ACT_ONE, sceneState, scrollStore, windowed } from "./scroll-store";

/**
 * Ato I · fases 2 a 4 — a revelação, o avanço com rugido e o sopro de fogo.
 *
 * São três clipes gerados, encadeados: cada um termina no quadro exato em que
 * o seguinte começa (revelação → b2 → avanço → goela → fogo). Servidos como
 * 363 WebP e desenhados num quad conforme o scroll.
 *
 * Sequência de imagens em vez de `<video>` porque `seek` de vídeo não é
 * frame-accurate e engasga no iOS — aqui cada posição de scroll mapeia num
 * quadro exato, em qualquer navegador.
 */

type Sequencia = {
  dir: string;
  count: number;
  /** início e fim no progresso do ato */
  de: number;
  ate: number;
  /**
   * Curva do scroll dentro do clipe. Expoente < 1 atravessa o começo depressa.
   * Serve pro sopro, cujos primeiros 60% são fumaça marrom antes do estouro.
   */
  curva: number;
};

const SEQUENCIAS: Sequencia[] = [
  // Expoente 1.7: os primeiros quadros (o dragão no breu, só os olhos acesos)
  // demoram muito mais scroll pra passar. É o que segura a expectativa antes
  // da brasa subir — e era o trabalho que a fase de olhos tentava fazer.
  { dir: "revelacao", count: 121, de: 0, ate: ACT_ONE.revealEnd, curva: 1.7 },
  { dir: "avanco", count: 121, de: ACT_ONE.revealEnd, ate: ACT_ONE.chargeEnd, curva: 1 },
  { dir: "fogo", count: 121, de: ACT_ONE.chargeEnd, ate: 1, curva: 0.55 },
];

/**
 * Até onde o breu total segura, e onde termina de soltar — frações da fase da
 * revelação. Entre 0 e CRUSH_HOLD a tela é preta com dois olhos e nada mais.
 */
const CRUSH_HOLD = 0.3;
const CRUSH_RELEASE = 0.75;

/**
 * Duas resoluções do mesmo material. A pequena tem 640px de largura e pesa
 * 4,2MB no total contra 9,4MB da grande.
 *
 * Vale porque o Ato I é onde o link viral é aberto — em 4G, no meio da rua — e
 * ninguém enxerga detalhe de escama em 390px. O corte usa o mesmo 820px que o
 * `<Stage>` usa pra decidir o `dpr`: abaixo dele o canvas já renderiza em 1x,
 * então 640 sobra.
 */
const PEQUENO_ATE = 820;

const frameUrl = (dir: string, i: number, pequeno: boolean) =>
  `/dragao/${dir}${pequeno ? "/sm" : ""}/f-${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Largura/altura do material gerado. Fixo: os três clipes vêm do mesmo pipeline.
 */
const SOURCE_ASPECT = 1280 / 714;

const RevealMaterial = shaderMaterial(
  {
    uMap: null,
    uOpacity: 0,
    uCrush: 1,
    uViewAspect: 1.78,
    uSourceAspect: SOURCE_ASPECT,
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uMap;
    uniform float uOpacity;
    uniform float uCrush;
    uniform float uViewAspect;
    uniform float uSourceAspect;

    void main() {
      // "cover": preenche a tela sem distorcer, cortando o excesso. Feito no
      // shader e não na escala do mesh pra sobreviver a qualquer resize sem
      // recalcular geometria. Idêntico ao da fase 1.
      vec2 uv = vUv - 0.5;
      if (uViewAspect > uSourceAspect) uv.y *= uSourceAspect / uViewAspect;
      else                             uv.x *= uViewAspect / uSourceAspect;
      uv += 0.5;

      vec3 c = texture2D(uMap, uv).rgb;

      // Esmaga os pretos. Nem o quadro mais escuro do clipe é preto de verdade
      // — asa, chifre e silhueta continuam legíveis no cinza baixo, e o começo
      // não lia como "dois olhos no breu". A gama alta joga tudo que não é
      // brilhante pro zero e só os olhos sobrevivem; o ganho compensa a perda
      // de brilho deles. Solta conforme a revelação avança.
      float gama = 1.0 + uCrush * 7.0;
      c = pow(c, vec3(gama)) * (1.0 + uCrush * 1.6);

      gl_FragColor = vec4(c * uOpacity, 1.0);
    }
  `,
);

extend({ RevealMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    revealMaterial: ThreeElement<typeof RevealMaterial>;
  }
}

type Quadros = (HTMLImageElement | undefined)[][];

/**
 * Carrega os quadros na ordem da narrativa, com concorrência limitada.
 *
 * Em ordem porque o scroll atravessa as sequências em ordem: o quadro que o
 * usuário vai precisar primeiro é o que baixa primeiro. Concorrência baixa
 * porque disparar 363 requisições de uma vez enfileira tudo no navegador e o
 * quadro 2 chega junto com o último — pior do que carregar devagar.
 */
function carregar(
  plano: [number, number][],
  quadros: Quadros,
  pequeno: boolean,
  sinal: { cancelado: boolean },
) {
  const CONCORRENCIA = 6;
  let proximo = 0;

  const puxar = () => {
    if (sinal.cancelado || proximo >= plano.length) return;
    const [s, i] = plano[proximo++];
    const img = new Image();
    img.decoding = "async";
    img.src = frameUrl(SEQUENCIAS[s].dir, i, pequeno);
    img
      .decode()
      .then(() => {
        if (!sinal.cancelado) quadros[s][i] = img;
      })
      .catch(() => {
        /* quadro perdido: a cena segura no último disponível */
      })
      .finally(puxar);
  };

  for (let k = 0; k < CONCORRENCIA; k++) puxar();
}

/** Conexão ruim: amostra esparsa em vez das três sequências inteiras. */
function plano(): [number, number][] {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const c = nav.connection;
  const poupando =
    c?.saveData === true || c?.effectiveType === "2g" || c?.effectiveType === "slow-2g";

  const lista: [number, number][] = [];
  SEQUENCIAS.forEach((seq, s) => {
    if (!poupando) {
      for (let i = 0; i < seq.count; i++) lista.push([s, i]);
    } else {
      const AMOSTRA = 10;
      for (let k = 0; k < AMOSTRA; k++) {
        lista.push([s, Math.round((k / (AMOSTRA - 1)) * (seq.count - 1))]);
      }
    }
  });
  return lista;
}

export function Reveal() {
  const { viewport, size } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);

  // Um canvas só, reaproveitado: trocar `texture.image` recria a textura na
  // GPU a cada quadro novo. Desenhando no mesmo canvas, é um upload e pronto.
  const painel = useRef<{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    textura: THREE.CanvasTexture;
    quadros: Quadros;
    desenhado: string;
  } | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 714;
    const ctx = canvas.getContext("2d");
    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.minFilter = THREE.LinearFilter;
    textura.generateMipmaps = false;

    const quadros: Quadros = SEQUENCIAS.map((s) => new Array(s.count));
    painel.current = { canvas, ctx, textura, quadros, desenhado: "" };
    // O uniform `uMap` é ligado no primeiro `useFrame`, não aqui: tocar em
    // `mat` dentro do efeito E dentro do useFrame faz o React Compiler barrar.

    const sinal = { cancelado: false };
    carregar(plano(), quadros, window.innerWidth <= PEQUENO_ATE, sinal);

    return () => {
      sinal.cancelado = true;
      textura.dispose();
      painel.current = null;
    };
  }, []);

  useFrame(() => {
    const u = mat.current?.uniforms;
    const p = painel.current;
    if (!u || !p) return;

    if (!u.uMap.value) u.uMap.value = p.textura;
    u.uViewAspect.value = size.width / size.height;
    u.uSourceAspect.value = SOURCE_ASPECT;
    // Entra do preto num piscar de scroll: sem isso o primeiro quadro aparece
    // de estalo quando a página carrega.
    u.uOpacity.value = windowed(scrollStore.actOne, 0, 0.03);

    // Segura o breu total no começo e só então solta a imagem. As duas janelas
    // se somam: a curva 1.7 da sequência atrasa os QUADROS, isto atrasa a LUZ.
    u.uCrush.value =
      1 -
      windowed(
        scrollStore.actOne,
        ACT_ONE.revealEnd * CRUSH_HOLD,
        ACT_ONE.revealEnd * CRUSH_RELEASE,
      );

    const a = scrollStore.actOne;
    let s = SEQUENCIAS.length - 1;
    for (let k = 0; k < SEQUENCIAS.length; k++) {
      if (a < SEQUENCIAS[k].ate) {
        s = k;
        break;
      }
    }
    const seq = SEQUENCIAS[s];
    const t = Math.pow(windowed(a, seq.de, seq.ate), seq.curva);
    const alvo = Math.min(seq.count - 1, Math.round(t * (seq.count - 1)));

    // Se o quadro exato ainda não chegou, recua até o último que chegou: a
    // cena congela por um instante em vez de piscar preto.
    let i = alvo;
    while (i > 0 && !p.quadros[s][i]) i--;
    const img = p.quadros[s][i];
    const chave = `${s}:${i}`;
    if (!img || chave === p.desenhado || !p.ctx) return;

    p.ctx.drawImage(img, 0, 0, p.canvas.width, p.canvas.height);
    p.textura.needsUpdate = true;
    p.desenhado = chave;
    // Só agora o cartaz de 154 bytes pode sair: existe imagem de verdade
    // desenhada por baixo dele.
    sceneState.primeiroQuadro = true;
  });

  return (
    // renderOrder 2: por cima da lava (0) e das brasas (1) do ambiente.
    <mesh scale={[viewport.width, viewport.height, 1]} renderOrder={2}>
      <planeGeometry args={[1, 1]} />
      <revealMaterial ref={mat} attach="material" transparent depthWrite={false} />
    </mesh>
  );
}
