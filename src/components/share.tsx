"use client";

import { useState, useSyncExternalStore } from "react";

/**
 * O fecho da página: o convite pra passar adiante.
 *
 * No celular, onde link viral realmente circula, o caminho de maior conversão
 * é a folha nativa do sistema — ela já traz os contatos recentes da pessoa. Só
 * que `navigator.share` não existe em desktop, então os destinos individuais
 * continuam sendo o caminho principal lá.
 *
 * Nada aqui envia nada sozinho: cada botão abre a caixa de diálogo do serviço,
 * já preenchida, e quem aperta enviar é a pessoa.
 */

const TEXTO = "Quatro mil anos de mitologia em um scroll só. The Age of Dragons:";

/** Disponibilidade da folha nativa, sem `setState` dentro de efeito. */
function useShareNativo(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );
}

/**
 * A URL de verdade no momento do clique, não a canônica fixa: assim o link
 * compartilhado de um deploy de preview aponta pro preview, e não manda a
 * pessoa pra produção sem querer.
 */
function urlAtual(): string {
  if (typeof window === "undefined") return "https://age-of-dragons.vercel.app";
  return window.location.origin + window.location.pathname;
}

const DESTINOS = [
  {
    nome: "WhatsApp",
    href: (u: string) => `https://wa.me/?text=${encodeURIComponent(`${TEXTO} ${u}`)}`,
    icone: (
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.5 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.5l-.3.4c-.1.1-.3.3-.1.6.1.2.6 1 1.3 1.7.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.2.1.6-.1 1.1Z" />
    ),
  },
  {
    nome: "X",
    href: (u: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(TEXTO)}&url=${encodeURIComponent(u)}`,
    icone: <path d="M18.9 2H22l-7.1 8.1L23.2 22h-6.6l-5.1-6.7L5.6 22H2.4l7.6-8.7L1.2 2h6.7l4.6 6.1L18.9 2Zm-1.1 18h1.8L7.3 3.9H5.4L17.8 20Z" />,
  },
  {
    nome: "LinkedIn",
    href: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    icone: (
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.75-1.95C21.6 8.75 22 11.2 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2.03-3.3-2.03 0-2.34 1.57-2.34 3.2V21h-4V9Z" />
    ),
  },
] as const;

export function Share() {
  const nativo = useShareNativo();
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(urlAtual());
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2400);
    } catch {
      // Área de transferência bloqueada (contexto inseguro, permissão negada).
      // Os destinos ao lado continuam funcionando, então não há o que anunciar.
    }
  };

  const compartilharNativo = async () => {
    try {
      await navigator.share({ title: "The Age of Dragons", text: TEXTO, url: urlAtual() });
    } catch {
      // Cancelar a folha nativa cai aqui. Não é erro: é a pessoa desistindo.
    }
  };

  return (
    <div className="mt-14 flex flex-col items-center gap-6" data-reveal>
      <p className="eyebrow">Passe adiante</p>

      {nativo && (
        <button type="button" onClick={compartilharNativo} className="share-principal">
          Compartilhar
        </button>
      )}

      <ul className="flex flex-wrap items-center justify-center gap-3">
        {DESTINOS.map((d) => (
          <li key={d.nome}>
            <a
              href={d.href(urlAtual())}
              target="_blank"
              rel="noopener noreferrer"
              className="share-alvo"
              aria-label={`Compartilhar no ${d.nome}`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
                {d.icone}
              </svg>
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copiar} className="share-alvo" aria-label="Copiar o link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden focusable="false">
              <path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7" strokeLinecap="round" />
              <path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7" strokeLinecap="round" />
            </svg>
          </button>
        </li>
      </ul>

      {/* Anúncio pra leitor de tela: sem isto, copiar não dá retorno nenhum a
          quem não vê o texto mudar. */}
      <p aria-live="polite" className="share-aviso" data-visivel={copiado ? "true" : "false"}>
        Link copiado
      </p>
    </div>
  );
}
