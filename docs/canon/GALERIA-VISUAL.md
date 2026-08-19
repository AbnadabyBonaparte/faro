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

**Nenhum hex mora no gerador.** Ele lê os onze tokens de cor do `globals.css` e
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

## 6. HISTÓRICO DE RODADAS

| Rodada | Data | Direções | Estado |
|---|---|---|---|
| 1 | 19/08/2026 | A · B · C, 3 peças cada | 🛑 **no portão — aguardando o dono** |
| 2 | — | a escolhida | não começou, e não começa antes do martelo |

---

*Direção de arte da ALSHAM Global Commerce. Toda entrada nova desta galeria
carrega certidão completa, ou não entra.*
