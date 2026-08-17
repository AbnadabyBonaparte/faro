# IDENTIDADE VISUAL — FARO™
**Direção de arte · v1 · 17/08/2026**

> Registro da escolha estética do FARO e do **porquê** dela. STYLUS lê a paleta do mundo em
> que opera — não impõe cor única. O FARO pediu identidade própria; esta é a decisão, com as
> alternativas recusadas declaradas.

---

## 1. O CONCEITO

**FARO é um instrumento de detecção.** Não é dashboard de vendas, não é CRM, não é rede
social de leads. A referência mental é o **posto de escuta**: radar, sonar, farol. Um operador
sozinho, à noite, lendo sinais fracos numa tela escura e decidindo para onde apontar.

Três palavras que governam toda decisão de arte:

| Palavra | O que impõe |
|---|---|
| **PRECISÃO** | Nada decorativo. Cada pixel informa. Números monoespaçados. Grade rígida. |
| **ESCURIDÃO** | Fundo escuro por padrão — a tela de instrumento, não a folha de papel. |
| **SINAL** | **Uma** cor de sinal, usada com avareza. Se tudo brilha, nada é sinal. |

O oposto do FARO, visualmente: painel colorido cheio de gráficos animados. Isso é o que
vende dado. O FARO vende **leitura de dado** — e leitura pede silêncio visual.

---

## 2. A COR DE SINAL — verde-sinal de instrumento

**Escolha: verde-sinal (`--signal`), tom de instrumento, sobre fundo azul-quase-preto.**

O verde de varredura de radar é o único acento cromático da marca. Aparece em: o traço do
sinal ativo, o foco, o estado "detectado", o eixo vivo do Evidence Graph, a marca.

**Por que verde-sinal:**

1. É a cor da **detecção** no imaginário coletivo — varredura de radar, traço de
   osciloscópio, sonar. Comunica "instrumento que encontra" sem precisar de ícone.
2. É **território livre** dentro da casa. O âmbar-riqueza e o ciano-análise já estão ocupados
   por outro mundo do ecossistema; repetir a paleta de um irmão apagaria o FARO.
3. Sobre fundo azul-preto, entrega contraste altíssimo com pouca área pintada — exatamente o
   comportamento de "sinal escasso" que o produto precisa.

**Calibragem obrigatória:** não é verde-fósforo saturado (`#00FF00`). Fósforo puro lê como
hacker/terminal de brincadeira e destrói a credibilidade diante de tributarista e advogado —
o público que precisa levar a ficha para uma reunião. O tom é **verde de instrumento**:
puxado para o jade, dessaturado o suficiente para parecer aferido, não neon.

### Alternativas recusadas (e por quê)

| Alternativa | Argumento a favor | Por que foi recusada |
|---|---|---|
| **Âmbar-farol** | "Faro"/farol — feixe âmbar, conceitualmente perfeito | Colide de frente com o âmbar-riqueza de outro produto da casa. Dois mundos iguais na retina. |
| **Ciano-elétrico** | Frieza analítica, combina com "inteligência" | Já é a cor de análise de um irmão. E ciano puxa para "tech genérico". |
| **Vermelho-alvo** | Caça, mira, urgência | Vermelho é reservado para **risco/fonte antiga** na escala funcional (§4). Marca em vermelho mataria o alerta. |
| **Roxo/violeta** | Diferenciação máxima | Lê como "IA/startup", exatamente a associação que a Lei do Motor Interno manda evitar. |

---

## 3. TOKENS — SSOT

Zero cor hardcoded em componente. Toda cor entra por CSS variable. O arquivo
`apps/maquete/src/app/globals.css` é a fonte única de verdade da maquete.

```
/* GROUND — a tela do instrumento */
--bg              fundo mais profundo (o breu)
--surface         painel / card
--surface-2       painel elevado / hover
--border          traço de grade, divisor
--border-strong   borda de foco / painel ativo

/* TIPOGRAFIA */
--text            texto primário
--text-secondary  rótulo, metadado, fonte-e-data
--text-muted      texto desativado, placeholder

/* SINAL — a única cor de marca */
--signal          verde-sinal de instrumento
--signal-dim      verde-sinal rebaixado (traço inativo, borda)
--signal-fg       texto sobre área pintada de sinal
```

**Regra de área:** o `--signal` nunca ocupa mais de ~10% da área visível de uma tela.
Ele marca **o que importa agora**, não a decoração.

**Modo claro:** o FARO nasce escuro por padrão. Modo claro é ambiente de leitura/impressão
de ficha (o assinante leva a ficha para reunião) — previsto na estrutura de tokens, não
implementado na maquete v1. Declarado aqui para não ser esquecido.

---

## 4. ESCALA FUNCIONAL (não é marca — é semáforo)

O produto tem duas escalas que **precisam** de cor e que **não** são identidade: Freshness
(§7.2 do canon) e Evidence Grade (§6.2). Elas são funcionais, declaradas como tais, e não
disputam com o `--signal`.

```
--fresh-ok        🟢 atual          → É O PRÓPRIO --signal
--fresh-warn      🟡 recente
--fresh-stale     🟠 desatualizando
--fresh-old       🔴 fonte antiga
```

**Decisão: `--fresh-ok` não é um verde novo — é o próprio `--signal`.**

O problema óbvio de uma marca verde com um semáforo que também tem verde é a colisão: dois
verdes na mesma tela e o leitor não sabe se a cor significa "é marca" ou "está fresco".
Inventar um segundo verde "funcional e mais neutro" só empilha o problema — passariam a ser
dois verdes parecidos e ambíguos, o que é pior que um.

A saída é conceitual, não cromática: **a cor de sinal significa "o sinal está vivo"**. Num
instrumento de varredura, sinal fresco brilha e sinal velho apaga. Então o Freshness não é um
semáforo colado por cima da marca — é a **medida de intensidade da própria marca**:

| Estado | Cor | Leitura |
|---|---|---|
| 🟢 atual | `--signal` | o sinal está vivo |
| 🟡 recente | âmbar contido | o sinal está esfriando |
| 🟠 desatualizando | laranja | o sinal está apagando |
| 🔴 fonte antiga | vermelho | não abordar sem revalidar |

Isso resolve a colisão e ainda amarra a identidade ao produto: a única cor de marca só
aparece onde a informação está viva. Marca e função dizem a mesma coisa.

Consequência prática: **âmbar, laranja e vermelho ficam reservados ao envelhecimento e ao
risco.** É por isso que a marca não pode ser âmbar nem vermelha (§2) — não é só questão de
não repetir um irmão da casa, é que essas faixas já têm significado funcional.

O Evidence Grade (A–D) usa **peso e tipografia**, não cor própria — grade A não é "verde
bom", é "A" em monoespaçado com borda forte. Colorir o grade transformaria evidência em
placar, e evidência não é placar.

---

## 5. TIPOGRAFIA

| Uso | Fonte | Regra |
|---|---|---|
| Interface, texto corrido, rótulos | **Sans do sistema** (stack nativa) | Legibilidade acima de personalidade |
| Números, score, CNPJ, datas, `source_id`, timestamps | **Monoespaçada** | **Obrigatório.** Número que se compara alinha em coluna. |

O monoespaçado não é estilo — é função. Score decomposto, data de coleta e identificador de
fonte são feitos para serem **comparados linha a linha**. Fonte proporcional embaralha
comparação.

Nunca monoespaçado em texto corrido.

---

## 6. FORMA

- **Grade rígida.** Alinhamento em coluna acima de composição solta. Instrumento tem régua.
- **Raio de canto baixo.** Painel de instrumento, não bolha de app.
- **Borda antes de sombra.** Traço de 1px define área; sombra difusa é enfeite de fundo claro.
- **Densidade média-alta.** O assinante lê fila e compara — espaço em branco generoso é para
  landing page, não para posto de escuta.
- **Movimento quase zero.** Nenhuma animação decorativa. Transição só onde comunica mudança
  de estado (o sinal que aparece, o julgamento registrado). O radar varre devagar.

---

## 7. LEIS QUE A ARTE TEM QUE CARREGAR

A identidade não é só estética — ela é obrigada a tornar visíveis três leis do canon.

**1. A Lei das Camadas (canon §3) tem que ser visível.** Dado, sinal, inferência e tese não
podem parecer a mesma coisa na tela. Hierarquia tipográfica e rótulo explícito de camada em
cada afirmação. Se o assinante não distingue dado de inferência olhando, a arte falhou.

**2. Fonte e data andam com a afirmação (canon §3).** `source_id` + data de coleta + data de
referência aparecem **na linha**, em `--text-secondary` monoespaçado. Nunca em rodapé, nunca
em tooltip escondido. Afirmação sem procedência visível é afirmação proibida.

**3. ANTI-QUANTUM (lei da casa).** Enquanto o motor não existe, **toda tela** carrega banner
permanente: `PROTÓTIPO — dados ilustrativos`. Não é rodapé discreto, não é dismissível, não
sai da tela ao rolar. Nenhuma tela do protótipo afirma no presente do indicativo função que
não roda.

**4. Lei do Motor Interno (canon Apêndice B).** Nenhum nome de fornecedor, modelo ou
composição de terceiros em qualquer texto visível. O cliente vê **motor ALSHAM**.

---

## 8. A MARCA

Enquanto não existir logotipo desenhado, a marca é **tipográfica**: `FARO` em sans, peso
alto, tracking aberto, com o acento de sinal marcando presença mínima (um traço, não um
ícone ilustrativo).

Assinatura de categoria, sempre junto na primeira aparição:
**FARO™ — Inteligência Contínua de Oportunidades.**

Recusado explicitamente: mira de rifle, cão de caça, pegada, lupa, cérebro, circuito, robô.
Os quatro primeiros infantilizam a caça; os três últimos são clichê de IA e violam o espírito
da Lei do Motor Interno.

---

*Direção de arte da ALSHAM Global Commerce. Documento vivo — evolui com o produto, não com a
moda.*
