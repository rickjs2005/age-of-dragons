import Image from "next/image";

/**
 * A placa de abertura de um capítulo: uma faixa de imagem sangrando pela
 * largura toda, com o rótulo e o título por cima.
 *
 * Existe pra costurar o Ato I com o texto. Sem ela, a página saía de um dragão
 * fotorreal em tela cheia direto pra parágrafos sobre fundo de lava, e a
 * emenda aparecia.
 *
 * As imagens são originais e deliberadamente atmosféricas — fumaça, ouro,
 * pergaminho, feixe de projetor. Nenhuma mostra criatura de terceiro: os dez
 * dragões do capítulo II são personagens protegidos (Smaug, Drogon, Toothless,
 * Shenron, Alduin…) e continuam sendo citados só por texto.
 */
export function ChapterPlate({
  src,
  numeral,
  rotulo,
  titulo,
  prioridade = false,
}: {
  src: string;
  numeral: string;
  rotulo: string;
  titulo: string;
  /** true só no primeiro capítulo: é o único que pode entrar em quadro cedo. */
  prioridade?: boolean;
}) {
  return (
    <div className="chapter-plate" data-reveal>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        priority={prioridade}
        loading={prioridade ? undefined : "lazy"}
        sizes="100vw"
        className="object-cover"
      />
      <div className="chapter-plate-conteudo">
        <p className="eyebrow">
          Capítulo {numeral} · {rotulo}
        </p>
        <h2 className="mt-3 max-w-4xl text-4xl font-bold text-bone sm:text-6xl">{titulo}</h2>
      </div>
    </div>
  );
}
