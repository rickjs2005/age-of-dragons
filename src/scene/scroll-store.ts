/**
 * A única ponte entre o mundo GSAP/Lenis e o mundo Three.
 *
 * O scroll escreve aqui; os `useFrame` leem daqui. Nada de estado React no
 * caminho: a 60fps, um `setState` por frame re-renderiza a árvore inteira e
 * derruba o scrub. É o mesmo padrão que o fundo de lava já usava com o
 * `intensityRef` — só promovido a peça compartilhada.
 *
 * Objeto mutável de propósito. Ninguém deve substituí-lo, só escrever campos.
 */
export type ScrollStore = {
  /** progresso 0→1 da página inteira */
  global: number;
  /** progresso 0→1 dentro do Ato I. Fica em 0 antes dele e em 1 depois. */
  actOne: number;
  /** cursor normalizado, origem no canto inferior esquerdo */
  pointer: { x: number; y: number };
};

export const scrollStore: ScrollStore = {
  global: 0,
  actOne: 0,
  pointer: { x: 0.5, y: 0.5 },
};

/**
 * Sinais da cena que o DOM precisa observar. Mesma razão do `scrollStore`:
 * objeto mutável, lido em rAF, sem estado React no caminho quente.
 */
export const sceneState = {
  /** vira true quando o Ato I desenha o primeiro quadro de verdade */
  primeiroQuadro: false,
};

/**
 * Fronteiras das fases do Ato I, em progresso do próprio ato.
 * Mexer aqui reencena o ato inteiro sem tocar em nenhum shader.
 *
 * São três batidas encadeadas, e cada clipe termina no quadro exato em que o
 * seguinte começa: revelação (começa no escuro, termina na b2) → avanço
 * (começa na b2, termina na goela) → fogo (começa na goela).
 *
 * Não existe mais uma fase de "olhos". Havia uma máscara de pálpebra desenhada
 * por cima do primeiro quadro, e ela era o problema: meio aberta, a abertura
 * virava uma fresta esticada e saíam dois riscos horizontais dos lados de cada
 * olho. O primeiro quadro da revelação já É o dragão no breu com os olhos
 * acesos — não havia nada pra acrescentar ali.
 */
export const ACT_ONE = {
  /** 0 → aqui: o escuro segura, a brasa sobe e revela o corpo */
  revealEnd: 0.46,
  /** revealEnd → aqui: ele avança, sacode a cabeça e ruge */
  chargeEnd: 0.78,
  /** chargeEnd → 1: o sopro de fogo toma a tela */
} as const;

/** Remapeia `p` da janela [a,b] para 0→1, travado nas pontas. */
export function windowed(p: number, a: number, b: number): number {
  if (b <= a) return p >= b ? 1 : 0;
  const t = (p - a) / (b - a);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}
