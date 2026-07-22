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
