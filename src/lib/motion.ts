/**
 * Fonte única de easing/duração pro motor cinematográfico (hero.tsx + cinematic.tsx).
 * Antes cada animação calibrava esses valores à mão, espalhados pelo código —
 * uma curva errada tinha que ser caçada arquivo por arquivo.
 */
export const EASE = {
  soft: "power2.out",
  reveal: "power3.out",
  snap: "power4.out",
  linear: "none",
} as const;

/**
 * Scroll suave (Lenis). Mesma razão de existir: a curva da rolagem é o gesto
 * mais repetido do site inteiro — calibra num lugar só.
 */
export const SCROLL = {
  /** inércia da roda/trackpad, em segundos */
  duration: 1.25,
  /** expo.out — freia longo e macio, sem o repique de power4 */
  easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  /** salto entre capítulos: menu, "role para começar", voltar ao topo */
  anchorDuration: 1.6,
  /** cubic.out — chega no capítulo desacelerando, sem passar do ponto */
  anchorEasing: (t: number) => 1 - Math.pow(1 - t, 3),
} as const;

export const DURATION = {
  heroVideo: 2.2,
  heroCascade: 1.1,
  heroCascadeStagger: 0.14,
  heroCue: 1,
  reveal: 1.1,
  chars: 0.8,
  charsStagger: 0.018,
  tilt: 0.5,
  parallaxPointer: 0.9,
} as const;
