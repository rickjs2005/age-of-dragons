import type { Chapter } from "./types";

/**
 * Quatro capítulos, não oito.
 *
 * O arco é: onde o dragão nasceu (mitologias) → quem foram os lendários →
 * onde no mundo → como ele chegou às telas. Termina no cinema, que é onde o
 * hype vive hoje.
 *
 * O que saiu — a travessia (timeline horizontal), a galeria, o confronto
 * (tabela comparativa) e os segredos — continua pesquisado em `src/data/` e
 * vira uma página de acervo. Nada foi jogado fora: numa experiência
 * cinematográfica, oito capítulos matam o fôlego antes do fim.
 */
export const CHAPTERS: Chapter[] = [
  { id: "eras", numeral: "I", label: "O nascimento" },
  { id: "lendarios", numeral: "II", label: "Os lendários" },
  { id: "mapa", numeral: "III", label: "O mapa" },
  { id: "telas", numeral: "IV", label: "As telas" },
];
