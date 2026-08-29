# CLAUDE.md — Landing de captação Soulstory

Este arquivo é a lei da casa deste projeto. Antes de qualquer edição, refinamento ou skill, leia daqui até o fim e obedeça. Se uma skill, uma sugestão sua ou um instinto de "ficaria mais bonito assim" conflitar com o que está escrito aqui, este arquivo vence. Sempre.

---

## O que é este projeto

Uma landing page de captação de lead da Soulstory, um estúdio de storytelling branding. O objetivo da página é uma coisa só: fazer a pessoa preencher um formulário. Os dados do formulário vão para uma planilha do Google Sheets (via Google Apps Script) e disparam um email de aviso na hora. O aviso por WhatsApp entra numa fase posterior, não agora.

O site é estático (HTML, CSS e JavaScript), versionado no GitHub e hospedado no Cloudflare Pages via conexão Git.

A fonte da verdade visual é a pasta `_ds/` (o Soulstory Design System 2.0). Todo token de cor, fonte, espaçamento, raio, sombra e movimento vive lá. Não invente valor fora do que está definido nessa pasta.

---

## Regras invioláveis (nunca quebre, em hipótese alguma)

- **Nunca use travessão.** O travessão é o traço longo (Unicode U+2014, o `em dash`), aquele que a escrita de IA adora enfiar no lugar de dois pontos, vírgula ou parênteses. Também não use o traço médio (U+2013, `en dash`). Isso vale para tudo: texto visível, código e comentários. No lugar, use dois pontos, vírgula, parênteses ou ponto final. O hífen curto normal (U+002D, o de "landing-page") é permitido.
- **Português do Brasil em tudo**, incluindo comentários de código e mensagens.
- **Nunca escreva senha, chave de API ou token secreto dentro do código.** Nunca coloque segredo em arquivo versionado.
- **Não execute `git push`.** Quem sobe as mudanças para a nuvem é o Otávio, pelo GitHub Desktop. Seu trabalho para no arquivo salvo e no commit local, se solicitado. Não empurre para o remoto.
- **Não apague nenhum arquivo sem confirmar com o Otávio antes.**

---

## Como trabalhar aqui

- **Explique o porquê antes do como.** Antes de mexer, diga o raciocínio em português simples. Decoreba não constrói nada.
- **Uma mudança de cada vez.** Termine uma coisa, verifique, e só então parta para a próxima. Nunca empilhe várias mudanças de uma vez, porque quando algo quebra fica impossível saber qual delas foi a culpada.
- **Verificação visual é obrigatória.** Toda alteração de layout passa por screenshot do Playwright antes e depois, em pelo menos duas larguras: 375px (celular) e 1440px (desktop). Opcionalmente 1280px como intermediário. Nunca declare uma tarefa concluída sem ter olhado o screenshot com os próprios olhos. Mobile primeiro.
- **Skills, uma de cada vez.** Aplique uma skill, tire o screenshot antes e depois, confira, e só então a próxima. Nunca rode várias skills na mesma passada.

---

## Design tokens da marca

Sempre use as variáveis CSS já definidas em `_ds/` (por exemplo `var(--brand)`, `var(--surface-page)`, `var(--sp-9)`). Nunca cole valores hex ou pixels soltos no código: chame o token. Isso mantém a marca consistente e evita o CSS virar sopa de números mágicos.

Referência rápida dos principais (o conjunto completo está em `_ds/tokens/`):

**Cores de marca**
- Indigo Authority (primária): `#3D396E` → `var(--brand)`
- Lavender Insight (periwinkle): `#8E9FEE` → `var(--brand-soft)`
- Sky Awakening: `#8CC6FF` → `var(--accent-sky)`
- Indigo press (estado pressionado): `#2D2A52`

**Superfícies claras**
- Parchment (fundo padrão de página): `#FAF8F5` → `var(--surface-page)`
- Warm Veil (fundo de seção alternada): `#F1EFEC` → `var(--surface-veil)`
- White (só preenchimento de card, nunca fundo de página): `#FFFFFF` → `var(--surface-card)`
- Mist Lavender (tint de badge): `#E1E4F6`

**Superfícies escuras**
- Void (fundo escuro): `#0C0B14` → `var(--surface-void)`
- Elevated Void: `#15131F`
- Surface Indigo: `#1F1B2E`

**Fontes**
- Sans (toda estrutura e UI): Mr Eaves Sans OT → `var(--font-sans)`
- Serif (tagline, corpo editorial, citação, geralmente itálico): Minion 3 Pro → `var(--font-serif)`
- Mono (número de seção, metadata, código): JetBrains Mono → `var(--font-mono)`
- Display usa peso 400 (leve, autoridade sussurrada). Corpo com line-height nunca abaixo de 1.50, editorial em 1.70.

**Espaçamento e layout**
- Base de 8px, escala de 4px a 160px (`--sp-1` a `--sp-14`). Padding de seção generoso (96px no desktop).
- Largura máxima do container: 1200px → `var(--container-max)`.

**Cantos (raio)**
- Quase quadrado. A escala para em 32px. Badges 6px, botões e inputs 10px, cards 12px a 16px, heroes até 32px. Sem pílula totalmente redonda.

**Movimento**
- Durações: 160ms, 280ms, 520ms. Curva `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out suave).
- Fades e lifts pequenos (translateY de 2px) no hover. Sem bounce, sem spring, sem scale-down.
- Respeite `prefers-reduced-motion` (o design system já traz essa regra).

---

## Regras de marca que não se discutem

- **Sem gradiente. Nunca.** A casa não tem nenhum. Profundidade vem de alternar seções Parchment e Void, como capítulos de um livro, não de preenchimento em gradiente.
- **Branco puro nunca é fundo de página.** Sempre Parchment ou Void.
- **Sombra sempre tingida de indigo** (`rgba(60, 57, 110, ...)`), nunca cinza neutro. O anel de foco é um brilho periwinkle de 3px, o único momento em que a cor de marca aparece forte num formulário.
- **Sem cromáticos quentes.** Nada de laranja, vermelho, amarelo saturado ou verde. Saturação contida. O violeta mais claro é uma lavanda suave, nunca roxo elétrico.
- **Serif itálico (Minion 3) só em tagline e citação.** Nunca em label de interface.
- **O símbolo da marca, os dois arcos com três pontos, é um asset PNG** (`images/symbol-*.png`). Nunca redesenhe como texto ou como SVG. O logotipo SOULSTORY nunca vem digitado junto com o parêntese.
- **Voz: autoridade tranquila, editorial.** Confiante, sem pressa, um pouco literária. Sem emoji, sem exclamação, sem gíria, sem verbo de growth-marketing (nada de "turbine", "destrave", "impulsione"). Sentence case no corpo e nos títulos, o logotipo SOULSTORY e as overlines em maiúsculas.
- **Sem icon font e sem set de ícones de UI.** Se uma tela realmente precisar de ícone funcional, use Lucide e sinalize claramente que é uma substituição, porque não faz parte do pacote original da marca.

Nota sobre a assinatura de atribuição: o design system oficial da Soulstory usa travessão na linha de assinatura da marca. Aqui, pela regra inviolável acima, isso não se aplica. Onde a marca assinaria com travessão, use o middot ( · ) ou reescreva a frase. Se aparecer um caso de assinatura formal em dúvida, pergunte ao Otávio antes de decidir.

---

## Skills

**Pode usar** (uma de cada vez, com screenshot antes e depois entre cada uma):
- `frontend-design`, `ui-ux-pro-max`, `component-polish`
- `motion-language` (somente se for mexer em animação)
- `arquitetura-visual-persuasiva` e `ux-writing-imersivo` (quando fizer sentido para hierarquia visual e microtexto)

**Bloqueie:**
- A Taste package e qualquer skill que imponha uma estética própria por cima do `_ds/`. O design system da Soulstory é a única fonte visual deste projeto. Não aceite "melhorias de gosto" vindas de fora dele.

---

## O acabamento deste site (o que ainda falta fazer)

Este site veio de um export do Claude Design e passou por uma faxina de peso, mas ainda não passou pelo acabamento. Pendências:

- **Trazer as bibliotecas externas para dentro (vendorizar).** Hoje o site puxa duas bibliotecas de fora via CDN: GSAP (animação de scroll) e OGL (gráfico WebGL). Baixe e sirva localmente, para o site não depender da nuvem de terceiros.
- **Fontes.** Mr Eaves e Minion 3 são do Adobe Typekit (kit `wnf4ddz`), carregadas via `@import`. JetBrains Mono vem do Google Fonts. Atenção: Adobe Typekit é um serviço licenciado, então mantenha o carregamento via kit oficial e apenas garanta que os fallbacks locais (Avenir, Garamond) funcionam bem. Não tente baixar e hospedar a fonte da Adobe.
- **Formato do export.** O arquivo principal veio como `.dc.html` (formato do Claude Design). Garanta que a página roda sozinha num navegador comum, sem depender do runtime da ferramenta de origem.
- **Comprimir mídia.** Imagens: JPEG na qualidade 82, PNG otimizado, largura máxima de 2200px (Pillow). Vídeo, se houver: H.264, CRF 28, sem trilha de áudio (ffmpeg).
- **Acessibilidade e responsividade como piso, não enfeite.** Foco de teclado visível (o design system já define o anel periwinkle), reduced-motion respeitado, tudo funcionando no celular antes de tudo.

---

## Quando o formulário entrar (fase seguinte, ainda não agora)

- **Armazenamento MVP:** frontend estático mais Google Sheets via Google Apps Script. Não use banco de dados (Supabase e afins) enquanto o produto não estiver validado. Não super engenheirar.
- O mesmo Apps Script dispara o email de aviso na hora em que o lead chega.
- Use os componentes `Input` e `Textarea` do `_ds/` (preenchimento branco, hairline indigo, foco periwinkle). Não recrie campo de formulário do zero.
- **LGPD:** a caixa de consentimento para contato NÃO pode vir pré-marcada. A pessoa marca com a própria mão. Essa regra entra no formulário desde o primeiro rascunho.
