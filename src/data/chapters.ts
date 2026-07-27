import type { Chapter } from "./types";

/**
 * Três capítulos.
 *
 * O arco é: onde o dragão nasceu (mitologias) → onde no mundo → como ele
 * chegou às telas. Termina no cinema, que é onde o hype vive hoje.
 *
 * "Os lendários" saiu depois de estar pronto: era uma grade de dez
 * personagens protegidos (Smaug, Drogon, Toothless, Shenron, Alduin…) que,
 * sem imagem — e não vai ter, porque gerar retratos deles seria reproduzir
 * design de terceiro —, ficava como dez cartões de texto seguidos.
 *
 * Ele e os outros cortados (a travessia, a galeria, o confronto, os segredos)
 * continuam pesquisados em `src/data/` e viram uma página de acervo. Nada foi
 * jogado fora: numa experiência cinematográfica, capítulo que não puxa a
 * narrativa pra frente mata o fôlego.
 */
export const CHAPTERS: Chapter[] = [
  { id: "eras", numeral: "I", label: "O nascimento" },
  { id: "mapa", numeral: "II", label: "O mapa" },
  { id: "telas", numeral: "III", label: "As telas" },
];
