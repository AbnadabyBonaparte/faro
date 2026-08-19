# GALERIA VISUAL — FARO™

> Certidão de origem de toda imagem do repo. **Imagem sem certidão não entra.**
> Lei 7 aplicada a pixel: o número carrega o selo que o juiz deu; a imagem
> carrega a ferramenta, o parâmetro e a data que a pariram.
> Aberto em 19/08/2026 pela ORDEM VISUAL · O ABISSAL, §0.5. Base: `657a470`.

---

## 0. COMO SE LÊ UMA CERTIDÃO

| Campo | O que responde |
|---|---|
| **arquivo** | o caminho versionado, não o nome bonito |
| **dimensões** | largura × altura na unidade nativa do formato |
| **peso** | bruto e **gzip** — o navegador recebe o segundo |
| **ferramenta** | quem desenhou, com versão/modelo |
| **receita** | o prompt completo, **ou** o gerador + semente + parâmetros |
| **data** | quando entrou |
| **rodada/direção** | de onde veio e se já passou pelo martelo do dono |

### Por que "receita" e não "prompt"

A ordem pede *prompt completo*. Modelo generativo se reproduz por prompt;
desenho vetorial se reproduz por **código + semente**. A Rodada 1 saiu de um
gerador determinístico versionado, então a certidão registra o que de fato
reconstrói o arquivo byte a byte. É mais forte que um prompt: prompt depende
de um serviço de terceiro continuar existindo e devolvendo o mesmo peso; o
gerador está aqui dentro, e roda offline.

### 🔴 As APIs da ordem não foram usadas — e por quê

A ORDEM VISUAL previa **Ideogram** e **fal.ai**, com as chaves chegando como
variável de ambiente da sessão (§0.2). **Elas não existem nesta sessão.**

```
$ env | cut -d= -f1 | grep -iE 'fal|ideogram'
(nenhum resultado)
```

Nenhuma variável com esse nome está configurada. A mesma ordem autoriza, na
linha de ferramentas, *"teus recursos próprios (SVG, CSS, tipografia)"*, e a
§0.7 já destinava a SVG/CSS tudo que fosse geométrico. A Rodada 1 saiu inteira
por esse caminho.

**Custo de API desta rodada: zero. Gerações consumidas: nenhuma.**
Teto de ~15 gerações (§1) intocado — ele continua disponível para a Rodada 2.

O gerador **não abre rede e não lê chave nenhuma**: não há por onde vazar
segredo, e nenhum texto versionável desta rodada contém credencial.

---

## 1. AS TRÊS DIREÇÕES DA RODADA 1

Rascunhos de avaliação. **Nenhuma foi aprovada** — o portão é do dono.

| | Direção | A ideia em uma linha |
|---|---|---|
| **A** | **O ABISSAL** | a luz morre com a profundidade, e alguma coisa passa dentro do que sobrou |
| **B** | **O SONAR** | o posto de escuta: varredura estreita, ecos mudos, um que atende |
| **C** | **A PROFUNDIDADE DOCUMENTAL** | o funil da Lei das Camadas contado em traço, e um evento descendo |

As três carregam **a mesma copy** de propósito — `Não procure clientes. Ensine o FARO a encontrá-los.` no hero,
`O sinal está vivo.` no quadrado. No portão só a **direção** pode variar; se a
frase mudasse junto, o dono estaria escolhendo copy sem saber que escolhia.

Nenhuma imagem tem número, promessa de resultado, animal em destaque,
mandíbula, mira, cão, lupa, cérebro, circuito ou gradiente de IA.
A origem da varredura da direção B fica **no canto, fora do quadro**, e não há
cruz no centro em peça nenhuma — mira é recusada pelo canon (`IDENTIDADE-VISUAL.md` §8)
e pela ordem (§0.3).

---

## 2. CERTIDÕES — RODADA 1

**Comuns a todos os nove assets:**

| | |
|---|---|
| **Ferramenta** | gerador próprio, SVG 1.1 escrito à mão em TypeScript · `node --experimental-strip-types` v22.22.2 |
| **Fonte do desenho** | `apps/maquete/scripts/brand/{gerar-rodada-1,direcoes,svg,tokens}.ts` |
| **Comando** | `npm run brand:rodada-1` (de `apps/maquete` — a maquete fica fora do workspace pnpm por decisão da Onda 1) |
| **Paleta** | lida em tempo de geração de `apps/maquete/src/app/globals.css` (SSOT) |
| **Data** | 19/08/2026 |
| **Rodada / estado** | Rodada 1 · **rascunho, não aprovado** |
| **Tipografia** | Liberation Sans / Liberation Mono, via as pilhas `--font-sans` e `--font-mono` do SSOT |

**Nenhum hex mora no gerador.** Ele lê os tokens de cor do `globals.css` e
**recusa gerar** se qualquer hex fora do SSOT aparecer no desenho pronto — a
guarda roda a cada execução, sobre a saída, não sobre a intenção.

| Arquivo | Dir. | Formato | Dimensões | Bruto | Gzip | Semente |
|---|:--:|---|---:|---:|---:|---:|
| `a-abissal-fundo-1920x1080.svg` | A | fundo | 1920 × 1080 | 47.1 KB | **7.5 KB** | `1903` |
| `a-abissal-hero-2400x1260.svg` | A | hero | 2400 × 1260 | 48.7 KB | **8.3 KB** | `1901` |
| `a-abissal-social-1200x1200.svg` | A | social | 1200 × 1200 | 34.6 KB | **6.1 KB** | `1902` |
| `b-sonar-fundo-1920x1080.svg` | B | fundo | 1920 × 1080 | 10.9 KB | **1.5 KB** | `2903` |
| `b-sonar-hero-2400x1260.svg` | B | hero | 2400 × 1260 | 13.3 KB | **2.0 KB** | `2901` |
| `b-sonar-social-1200x1200.svg` | B | social | 1200 × 1200 | 11.7 KB | **1.8 KB** | `2902` |
| `c-documental-fundo-1920x1080.svg` | C | fundo | 1920 × 1080 | 126.6 KB | **14.0 KB** | `3903` |
| `c-documental-hero-2400x1260.svg` | C | hero | 2400 × 1260 | 130.1 KB | **15.7 KB** | `3901` |
| `c-documental-social-1200x1200.svg` | C | social | 1200 × 1200 | 115.6 KB | **14.0 KB** | `3902` |

Cada semente é o único parâmetro variável entre formatos da mesma direção. A
função que desenha está nomeada em `direcoes.ts`: `abissal`, `sonar`,
`documental`. Rodar o comando duas vezes devolve arquivos idênticos.

**Folha de contato:** `apps/maquete/public/brand/rodada-1/folha-de-contato.html`
— as nove lado a lado, abre direto no navegador, sem servidor.
**Manifesto legível por máquina:** `.../rodada-1/manifesto.json`.

---

## 3. PESO — A LEI MEDIDA

`ORDEM VISUAL §0.6`: hero ≤ 350 KB · OG ≤ 300 KB · fundos ≤ 200 KB · ícones em SVG.

| Classe | Teto | Pior caso desta rodada | Folga |
|---|---:|---:|---:|
| Hero | 350 KB | 15,7 KB (C, gzip) | **22×** |
| Fundo | 200 KB | 14,0 KB (C, gzip) | **14×** |

Mesmo **sem** gzip o pior caso é 130,1 KB, dentro de todos os tetos. Vetor não
precisa de AVIF/WebP: ele já é texto, comprime no transporte e é nítido em
qualquer densidade de tela. A cláusula de AVIF/WebP com fallback volta a valer
na Rodada 2 **se** alguma peça final for raster.

---

## 4. O QUE ESTES RASCUNHOS NÃO SÃO

- ❔ **Não são arte final.** São rascunho de avaliação, como manda a §1.
- 🟡 **O texto ainda é texto, não contorno.** Quem abrir os SVGs sem Liberation
  Sans/Mono instalada vê a fonte substituta da máquina dela. Na rodada final o
  texto vira `path` — aí o arquivo fica idêntico em qualquer lugar. Foi medido
  em Chromium sobre Liberation; é o que os PNGs do relatório mostram.
- 🟡 **A direção A é a mais fraca em vetor.** Bioluminescência e partícula em
  suspensão são exatamente o que um modelo generativo faz melhor que curva de
  Bézier. Se a A for a escolhida, é a primeira a refazer quando houver chave.
- ❔ **Nada foi aplicado na maquete.** Nenhuma página importa estes arquivos;
  o banner ANTI-QUANTUM segue intocado. Aplicação é Rodada 2, §2.8.
- ❔ **Contraste AA não foi conferido** — a ordem pede isso na §3, da arte
  aplicada. Sem aplicação, não há o que medir.

---

## 5. ACHADO TÉCNICO QUE VALE PARA A PRÓXIMA RODADA

**Filtro de SVG escurece errado por padrão.** `feGaussianBlur` opera em
`linearRGB` se ninguém disser o contrário, e a ida-e-volta de gama sobre um
quase-preto devolve **verde claro**: a sombra da direção A nasceu como uma
lente acesa, o oposto exato do briefing. O conserto é
`color-interpolation-filters="sRGB"` no filtro.

Fica registrado porque qualquer sombra, brilho ou vinheta futura sobre o breu
`--color-bg` vai cair na mesma armadilha.

---

---

# RODADA 2 — A DIREÇÃO C APLICADA

> Martelo do dono, 19/08/2026: **direção C — documental**, selada.
> Segundo martelo, mesmo dia: **"vetor agora, API depois"** — a Rodada 2 sai inteira em
> vetor e não fica bloqueada esperando credencial.
> Arte generativa fica para uma **Rodada 3 pontual**, só nas texturas da linguagem A do
> reveal, quando o dono regerar as chaves e puser na env.

## R2.0 — O QUE MUDOU NO MÉTODO DESDE A RODADA 1

| | Rodada 1 | **Rodada 2** |
|---|---|---|
| Texto na arte | `<text>`, dependia da fonte instalada | **contorno (`path`)**, extraído das Liberation por `fontTools` |
| Estrutura da página | gosto | **curadoria com fonte e data** (`CURADORIA-VISUAL.md`) |
| Contraste | não aferido | **`npm run contraste`**, sai com erro se reprovar |
| Guarda do gerador | só paleta | paleta **+ recusa de `<text>`** na saída |

**Como o texto virou contorno:** `apps/maquete/scripts/brand/contornos/gerar-contornos.py`
lê as Liberation Sans/Mono do sistema e cospe `contornos.ts` — as frases do canon
pré-compostas e um **atlas monoespaçado** (alfabeto + acentos, avanço fixo) com que o lado
TypeScript compõe qualquer rótulo novo sem voltar ao Python. O gerador de arte continua com
**zero dependência de npm**.

## R2.1 — CERTIDÃO COMUM

| | |
|---|---|
| **Ferramenta** | gerador próprio, SVG 1.1 em TypeScript · `node --experimental-strip-types` |
| **Fonte do desenho** | `apps/maquete/scripts/brand/{gerar-rodada-2,pecas,pele,contornos,tokens,svg}.ts` |
| **Comando** | `npm run brand:rodada-2` (de `apps/maquete`) |
| **Rasterização** | Chromium headless (`--screenshot`), para PNG de OG, ícone e social |
| **Paleta** | lida em tempo de geração de `apps/maquete/src/app/globals.css` (SSOT) |
| **Tipografia** | Liberation Sans Bold / Liberation Mono, **convertidas em contorno** |
| **Data** | 19/08/2026 · **Rodada 2 · direção C aprovada** |
| **Custo de API** | **zero** — nenhuma geração por modelo |

## R2.2 — AS PEÇAS

| Arquivo | Bruto | Gzip |
|---|---:|---:|
| `rodada-2/banner-precos-2400x760.svg` | 32.9 KB | **3.8 KB** |
| `rodada-2/capa-cacada-1600x900.svg` | 119.8 KB | **15.1 KB** |
| `rodada-2/fundo-fila-1920x360.svg` | 13.0 KB | **1.3 KB** |
| `rodada-2/fundo-fontes-1920x360.svg` | 13.0 KB | **1.3 KB** |
| `rodada-2/fundo-painel-1920x360.svg` | 13.0 KB | **1.3 KB** |
| `rodada-2/fundo-teses-1920x360.svg` | 13.0 KB | **1.3 KB** |
| `rodada-2/fundo-watch-1920x360.svg` | 13.0 KB | **1.3 KB** |
| `rodada-2/hero-home-2400x1000.svg` | 125.9 KB | **15.9 KB** |
| `rodada-2/hero-home-mobile-820x760.svg` | 108.7 KB | **13.6 KB** |
| `rodada-2/icone-512.png` | 10.2 KB | **8.8 KB** |
| `rodada-2/icone-512.svg` | 0.8 KB | **0.3 KB** |
| `rodada-2/og-1200x630.png` | 52.2 KB | **50.0 KB** |
| `rodada-2/og-1200x630.svg` | 132.4 KB | **20.0 KB** |

### Guardadas em `brand/reveal/` — **não publicar, stealth segue**

| Arquivo | Bruto | Gzip |
|---|---:|---:|
| `reveal/social-1080x1080.png` | 84.8 KB | **83.9 KB** |
| `reveal/social-1080x1080.svg` | 120.2 KB | **16.5 KB** |
| `reveal/social-1080x1920.png` | 97.0 KB | **94.3 KB** |
| `reveal/social-1080x1920.svg` | 127.6 KB | **17.4 KB** |

Os dois templates sociais trazem um retângulo tracejado com `id="area-de-texto"`: é onde a
frase da campanha entra. Ele existe no SVG e some do PNG.

**Convenção do App Router:** `src/app/icon.svg`, `src/app/apple-icon.png` e
`src/app/opengraph-image.png` são cópias/rasterizações destas mesmas peças — o Next as
detecta por nome de arquivo, sem `<link>` na mão.

## R2.3 — PESO CONTRA O TETO

| Classe | Teto | Pior caso | Folga |
|---|---:|---:|---:|
| Hero | 350 KB | 15,9 KB (gzip) · 125,9 KB (bruto) | **22×** |
| OG | 300 KB | 52,2 KB (PNG servido) | **5,7×** |
| Fundo de tela | 200 KB | 1,3 KB (gzip) · 13,0 KB (bruto) | **154×** |
| Ícone | vetorial | 0,8 KB SVG | — |

## R2.4 — CONTRASTE

`npm run contraste` afere 15 pares contra o SSOT e **sai com código 1** se algum reprovar.
Na primeira execução, três reprovaram. Duas decisões saíram daí:

1. **`--text-muted` subiu de `#5a6a73` para `#708490`** — o antigo dava 3,56:1 e reprovava AA
   para texto, num token que veste todo rótulo monoespaçado do produto. Emenda registrada em
   `IDENTIDADE-VISUAL.md` §3.
2. **A borda decorativa de 1px ficou fora da regra de 3:1**, com o motivo escrito dentro do
   aferidor: ornamento não é afordância, o painel já se distingue pela superfície, e todo
   controle operável tem indicador próprio acima de 3:1. Se a borda um dia carregar
   informação sozinha, entra na lista.

Depois disso: **15/15 passam.**

## R2.5 — DUAS COISAS QUE ESTA GALERIA PRECISA DIZER CONTRA SI MESMA

- 🟡 **As peças da Rodada 1 não foram regeradas** depois da mudança de `--text-muted`. Elas
  são registro histórico de uma rodada certificada e fechada; rodar `npm run brand:rodada-1`
  hoje produz diferença. É esperado, e está escrito aqui para ninguém tratar como corrupção.
- ❔ **O banner ANTI-QUANTUM saiu de todas as telas** por decisão do dono (revogação em
  `IDENTIDADE-VISUAL.md` §7.3). A mitigação virou humana: quem apresenta é ele. Se a maquete
  for exposta sem acompanhamento, a lei volta.

## 6. HISTÓRICO DE RODADAS

| Rodada | Data | Direções | Estado |
|---|---|---|---|
| 1 | 19/08/2026 | A · B · C, 3 peças cada | 🛑 **no portão — aguardando o dono** |
| 2 | 19/08/2026 | **C — documental**, aplicada no site inteiro | 🛑 no portão — aguardando o dono |
| 3 | — | texturas da linguagem A, por IA, só no reveal | depende das chaves na env |

---

*Direção de arte da ALSHAM Global Commerce. Toda entrada nova desta galeria
carrega certidão completa, ou não entra.*
