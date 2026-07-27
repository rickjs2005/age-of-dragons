# The Age of Dragons — reformulação cinematográfica

Data: 2026-07-26

> **O que a implementação mudou em relação a este documento.** O texto abaixo é
> o desenho original; foi seguido em quase tudo, menos nestes pontos, que só
> apareceram ao ver a coisa rodando:
>
> 1. **A fase 1 não desenha olhos.** O plano era um shader com pálpebra
>    procedural. Ele foi escrito, testado e descartado: por mais que se
>    acertasse posição, cor e queda de brilho, a amêndoa lia como vidro
>    vermelho ao lado de um olho renderizado em fotorrealismo, e meio aberta
>    virava dois riscos horizontais. O primeiro quadro da revelação já É o
>    dragão no breu com os olhos acesos — o que faltava era só segurar o escuro,
>    e isso virou uma gama alta no shader da própria sequência (`uCrush`).
> 2. **O ato tem três batidas, não três fases com fogo procedural.** Viraram
>    revelação → avanço com rugido → sopro, encadeadas em três clipes gerados.
>    O sopro em partículas WebGL foi trocado por fogo do próprio clipe: partícula
>    faz brasa e fumaça bem, baforada na câmera não.
> 3. **O pull-back virou push-in.** O dragão avança contra a câmera em vez de
>    ser revelado por afastamento.
> 4. **Peso e primeiro segundo** ganharam tratamento que o spec não previa: uma
>    variante de 640px (4,2MB contra 9,4MB) e um cartaz de 154 bytes embutido em
>    base64 no HTML.
>
> O restante — Canvas único, scroll fora do React, `scroll-store` como única
> ponte, sticky em vez de pin, o ambiente em zero durante o ato — foi
> implementado como está escrito.

## Objetivo

Refazer o site como uma experiência cinematográfica em scroll. O topo deixa de
ser "vídeo de dragão em loop com título por cima" e vira uma sequência narrada
pela rolagem: escuridão total → dois olhos acendem → o corpo é revelado → o
dragão solta fogo → e esse fogo vira a luz com que se lê a história dele.

O gatilho é o hype de *A Casa do Dragão*. O gatilho não é o conteúdo: o dragão
protagonista é **original**, não uma réplica do Vhagar ou do Caraxes. O site
segue citando Smaug, Drogon e Toothless como referência cultural com a ressalva
que já existe no rodapé.

## Decisões fechadas com o usuário

| Questão | Decisão |
|---|---|
| Escopo | Site inteiro refeito do zero |
| Conteúdo | Enxugar para 4-5 capítulos, preservando a pesquisa |
| Orçamento Higgsfield | Teto de ~120 créditos (saldo: 329,65) |
| Prazo | Sem prazo — prioridade é ficar bem feito |
| Técnica | Híbrida: WebGL nas pontas, frames gerados só no meio |

## Preço real por geração

Levantado do histórico de transações da própria conta, não de tabela publicada:

| Modelo | Tipo | Créditos |
|---|---|---|
| Higgsfield Soul V2 / Soul Location | imagem | 0,12 |
| Image Background Remover | utilitário | 1 |
| Nano Banana Pro | imagem | 2 |
| Bytedance Image Upscale | utilitário | 2 |
| Kling v3.0 | vídeo | 8,75 |
| Seedance 2.0 Mini | vídeo | 12,5 |
| Cinematic Studio 3.0 | vídeo | 20–25 |
| Seedance 2.0 | vídeo | 22,5–45 |

## Abordagem escolhida e o que foi descartado

**Escolhida — híbrida.** A cena dos olhos no escuro é 95% preto e 5% luz: não
precisa de vídeo, precisa de dois pontos emissivos com bloom. Isso custa zero
crédito, roda em qualquer resolução e — porque é WebGL — **reage ao mouse**. O
sopro de fogo idem: partículas, não pixels gravados. Só a revelação do corpo
consome geração de IA.

O ganho decisivo não é o custo, é a continuidade: como o fogo é procedural, ele
não "acaba" quando o pin solta. Ele decai para brasa e vira o fundo do Ato II.
Vídeo puro sempre termina em corte seco.

**Descartado — vídeo controlado por scroll.** `video.currentTime` amarrado ao
scroll não é frame-accurate, engasga no iOS e depende de quantos keyframes o
encoder deixou. E o dragão não reage a nada.

**Descartado — dragão 3D completo (GLB via `generate_3d`).** Mesh gerada por IA
vem com topologia ruim e sem rig. Um dragão 3D meia-boca fica visivelmente pior
que um vídeo fotorreal. O 3D entra como luz e partícula, nunca como criatura.

## Arquitetura

### Um Canvas só

Hoje `lava-background.tsx` cria o próprio `<Canvas>` fixo em `z-index: -1`. O
Ato I precisa de WebGL na frente. Dois Canvas seriam dois contextos WebGL —
desperdício e risco, já que o navegador limita contextos ativos. O Canvas sobe
para `z-0`, o texto fica em `z-10`, e as fases entram e saem dele.

O véu preto de 47% que hoje é CSS estático (`.lava-canvas::after`) vira uniform
animado: **0 durante a revelação** — senão cobre o dragão com uma cortina — e
sobe para 0,47 a partir do Ato II, onde existe para dar contraste ao texto.

### O scroll não passa por React

Progresso de scroll em `useState` re-renderiza a 60fps e trava. Lenis escreve
num objeto mutável; os `useFrame` leem dele; nenhum `setState` no caminho.
`lava-background.tsx` já faz isso com `intensityRef` — o padrão está certo, só
é promovido a peça compartilhada em vez de detalhe interno.

### Estrutura de arquivos

`cinematic.tsx` hoje acumula Lenis, reveals, parallax, tilt, pin da timeline,
cinzas e relâmpago num arquivo só; `lava-background.tsx` acumula dois shaders
GLSL inline, o Canvas e o monitor de performance. Somar o Ato I a eles seria
empilhar sobre fundação torta.

```
src/scene/
  stage.tsx        ← o Canvas único, Bloom, PerformanceMonitor
  eyes.tsx         ← Ato I · fase 1
  reveal.tsx       ← Ato I · fase 2 (frames como textura)
  breath.tsx       ← Ato I · fase 3 (partículas)
  ambient.tsx      ← o fundo de lava atual, rebaixado ao Ato II
  scroll-store.ts  ← o ref compartilhado, fonte única do progresso

src/motion/
  smooth-scroll.tsx ← Lenis isolado
  effects.ts        ← reveals / parallax / tilt

src/sections/       ← Ato II, enxugado
```

`scroll-store.ts` é o único acoplamento entre o mundo GSAP e o mundo Three: uma
interface, explícita, numa direção só.

### Fluxo ponta a ponta

Lenis rola → escreve `scrollStore.global` e `scrollStore.actOne` → chama
`ScrollTrigger.update()` → o `useFrame` do `stage.tsx` lê o store e distribui
para as três fases. Sem laço de volta.

## Ato I — O Despertar

`<section>` de 400vh, primeiro filho pinado, progresso 0→1 em três janelas.

### Fase 1 · Os olhos (0 → 0,28)

Preto absoluto: `#000`, sem gradiente de lava, sem cinzas, sem vinheta. Qualquer
brilho competindo mata o efeito.

Os olhos são um shader num quad, com pupila fendida vertical e falloff radial no
bloom. A abertura é uma máscara no próprio shader — um `smoothstep` de fenda
fechada a olho aberto. Não é opacidade subindo: é a forma mudando. É a diferença
entre "dois pontos acenderam" e "uma coisa abriu o olho".

- A pupila segue o mouse, ~3% de deslocamento. Sutil de propósito.
- Um piscar, por volta de 0,18, ~120ms.
- Os primeiros 40% da fase são escuridão quase total, com um resto de brasa no
  limiar do perceptível. Segurar o vazio constrói a expectativa; encurtar isso
  é a tentação a resistir.

### Fase 2 · A revelação (0,28 → 0,72)

~120 frames de um clipe gerado: a câmera afasta e o corpo emerge, revelado por
luz de brasa vinda de baixo, não por iluminação de estúdio. Isso é direção de
arte e também economia — o que fica no escuro não precisa ser gerado bem.

A costura é o ponto crítico: os olhos do shader precisam alinhar com os olhos do
frame 1 e sumir por baixo num cross-fade. Acertando, ninguém percebe onde o
WebGL virou vídeo. Errando, os olhos "pulam" e o truque fica exposto. É o
primeiro ponto a testar no navegador.

O véu preto vai a 0. A câmera do R3F faz dolly-out ampliando o afastamento do
próprio clipe.

### Fase 3 · O sopro (0,72 → 1,00)

Último frame: a boca abre. A chama **não vem do vídeo** — nasce em partículas
WebGL na posição da boca, herdando o sistema de partículas de
`lava-background.tsx` (direção "sobe" → "jorra", cor para laranja com núcleo
branco, velocidade maior). `uIntensity` vai a 1 e o fundo incandesce.

Quando o pin solta, a chama decai para brasa e vira o fundo do Ato II. Sem
corte.

400vh são 4 telas; com Lenis a 1,25s de inércia é uma descida longa e pesada. Se
arrastar no teste real, corta para 320vh — é um número, não uma reescrita.

## Em aberto

Estes pontos não estavam decididos quando a implementação começou e **não devem
ser resolvidos por suposição**:

1. **Quais 4-5 capítulos sobrevivem.** Hoje são 8 (`src/data/chapters.ts`) mais
   timeline horizontal, galeria, tabela comparativa, cinema e curiosidades.
   Decisão de conteúdo, do usuário. O que sair vira material de uma página de
   acervo, não lixo.
2. **Qualquer gasto de crédito.** Nenhuma geração é disparada sem o prompt e o
   custo aprovados antes.

## Verificação

O projeto não tem infraestrutura de teste (não há script `test` no
`package.json`), então "verificado" aqui significa:

- `npx tsc --noEmit` limpo;
- `npx next build` passando;
- `npx eslint` limpo nos arquivos tocados;
- inspeção no navegador via Chrome, com evidência: classes aplicadas, uniforms
  chegando, FPS durante o scrub do Ato I, peso total transferido.

Um orçamento de performance explícito para o Ato I: **peso transferido abaixo de
3MB até o primeiro frame da revelação** e **sem queda sustentada abaixo de 50fps**
durante o pin em máquina de referência.

## Acessibilidade e degradação

- `prefers-reduced-motion`: sem pin e sem scrub. O Ato I vira uma imagem estática
  do dragão revelado com o título; a história desce normalmente.
- Rede lenta (`navigator.connection.saveData` ou `effectiveType` ruim): pula a
  sequência de frames e usa uma imagem estática de alta qualidade; o Ato I
  encurta para 200vh.
- Sem WebGL: o Ato I cai para a mesma imagem estática. O site continua legível e
  navegável — o Ato I é reforço, nunca requisito para o conteúdo.
