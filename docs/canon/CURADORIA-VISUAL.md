# CURADORIA VISUAL — o padrão-vencedor, extraído de quem já venceu

> Fase 1 da ORDEM VISUAL · Rodada 2 · 19/08/2026
> Ordem do dono: **não inventar a roda — girá-la.**
> Toda decisão de layout da Fase 2 cita uma linha daqui. Achismo é reprovado na origem.

---

## 0. MÉTODO, E O QUE ELE NÃO ALCANÇA

Cada observação abaixo tem **site + data + como foi obtida**. Duas maneiras:

| Método | O que ele vê | O que ele não vê |
|---|---|---|
| **A — leitura da página** (conversão para texto) | ordem das seções, título, densidade de copy, que tipo de visual acompanha cada bloco | tratamento gráfico fino, cor, tipografia |
| **B — extração do HTML servido** (`curl` + varredura de `h1/h2/h3`, `img`, `video`) | esqueleto real, contagem de mídia, texto alternativo | o que só existe depois do JavaScript rodar |

**Todas as visitas: 19/08/2026.**

🔴 **Duas lacunas honestas, declaradas antes de qualquer conclusão:**

- **Palantir Foundry** (`palantir.com/platforms/foundry/`, método B): 692.687 bytes servidos e **zero** `h1`/`h2`/`h3`, zero `img`, zero `video` no HTML. A página é montada inteiramente por JavaScript no cliente. Não consegui renderizá-la aqui — o navegador headless desta sessão não atravessa o proxy. **Palantir não foi avaliado.** O que sobra é um achado colateral, e ele vale: uma home que serve 700 KB sem um único cabeçalho no HTML é ruim de indexar e ruim de ler por leitor de tela. Não é padrão a copiar.
- **Econodata** (`econodata.com.br`, método B): **HTTP bloqueado** — devolveu página da Cloudflare, *"Sorry, you have been blocked"*. **Não foi avaliado.**

Cinco referências de elite e dois concorrentes ficaram legíveis. É com eles que a Fase 2 trabalha.

---

## 1. AS REFERÊNCIAS DE ELITE

### 1.1 Linear — `linear.app` · método A

Treze blocos, nesta ordem: hero → manifesto → três blocos de conceito → **cinco blocos de produto** → changelog → depoimentos → número de clientes → fecho.

| Observado | Medida |
|---|---|
| Hero | uma manchete + subtítulo de 10 palavras + **2 CTAs** |
| Copy por bloco | **20 a 60 palavras** — nenhum bloco longo |
| Blocos com screenshot de produto | **5 de 13** |
| Mural de logotipos de clientes | **não existe** |
| Alegação numérica | **uma só**, e no fim: "over 40,000 product teams" |
| Rodapé | 6 grupos: Product · Features · Company · Resources · Connect · Legal |

### 1.2 Vanta — `vanta.com` · método A

Hero → **mural de logos logo abaixo do hero** → features → agente → depoimento → frameworks → três trilhas por porte → casos → prêmio → conteúdo → fecho.

| Observado | Medida |
|---|---|
| Hero | "Trust is everything" + ~25 palavras + 2 CTAs |
| Visual do hero | **UI estilizada/abstraída**, não captura de tela crua |
| Mural de logos | **imediatamente abaixo do hero**, 6 logos; depois mais 9 |
| Copy por bloco | 25 a 50 palavras; seis cartões de feature somam ~50 |
| Como mostra o produto | **fragmentos de UI**, um por feature |
| Números | 16.000+ clientes · 2.000 h · 20% · 93% |
| Fecho | uma frase + **um** CTA ("Get a demo") |

### 1.3 Retool — `retool.com` · método B

`h1` único → 3 `h3` de capacidade → "Why enterprises choose Retool" + 3 `h3` → prova social → **5 casos, todos com número no título** → "Start today" → conteúdo.

| Observado | Medida |
|---|---|
| Hierarquia | **um `h1` só**, seções em `h2`, itens em `h3` |
| Casos de cliente | 5, e **os cinco têm número no próprio título** ("saved $8M and 20,000+ hours", "10x reduction") |
| Mídia | **135 `img`**, 1 `video` |
| Fecho | "Start today" |

### 1.4 Stripe — `stripe.com` · método B

Soluções por modelo de negócio (6 `h3`) → "The backbone of global commerce" → clientes por porte → infraestrutura (3 `h3`) → "What's happening".

| Observado | Medida |
|---|---|
| Estrutura | **por caso de uso**, não por lista de features |
| Casos nomeados | Hertz · URBN · Instacart · Le Monde — **empresa real no título** |
| Mídia | 35 `img`, **1 `canvas`** (gráfico/animação desenhada em código) |
| Números | "$1.9T em 2025", "150K+ users" |

### 1.5 Vercel — `vercel.com` · método B

`h1` de duas palavras ("Agentic Infrastructure") → 3 `h2` de capacidade → "Recently shipped" → "Built by you, or your agents" → rodapé em **10 grupos**.

| Observado | Medida |
|---|---|
| Manchete | **duas palavras** |
| Blocos de capacidade | 3, e cada um é uma frase inteira em `h2` |
| Mídia | **19 `img` na página toda** — a mais enxuta do grupo |
| Rodapé | 10 grupos, o mais denso do grupo |

---

## 2. OS CONCORRENTES — O CONTRASTE

### 2.1 Speedio — `speedio.com.br` · método B

| Observado | Medida | Leitura |
|---|---|---|
| **Dois `h1` na mesma página** | "Escale suas vendas B2B…" e "Perdendo tempo com leads desqualificados…" | hierarquia quebrada |
| **166 `img` · 3 textos alternativos distintos** | "Arrow icon", "logo da Speedio", "logomarca speedio" | imagem sem alt é imagem invisível para leitor de tela |
| Contadores sem rótulo no HTML | `h2` contendo só `25`, `17`, `20`, `17` | número solto, sem o que ele mede |
| Prova social numérica no topo | "Mais de 4.000 clientes já potencializaram seus resultados" | promessa de resultado |
| **Preço e FAQ na home** | "R$1.379,00/mês", 6 perguntas | a home vira página de preço |
| Selos de prêmio | "Vencedor do B2B Awards 2024" | prova emprestada |

### 2.2 Cortex Intelligence — `cortex-intelligence.com` · método B

| Observado | Medida | Leitura |
|---|---|---|
| **Dois `h1`** | "Inteligência aumentada para acelerar seu crescimento" / "…aplicada ao GTM para" | o segundo está cortado no meio |
| **Cabeçalhos repetidos** | "As empresas líderes estão com a Cortex" **duas vezes**; "Conheça nossas soluções com Go-to-Market Intelligence" **duas vezes** — a segunda encima cartões de conteúdo, não de solução | cabeçalho reaproveitado errado |
| 66 `img` | quatro produtos, quatro soluções, casos, materiais | densidade sem hierarquia |

**O que os dois fazem bem, e merece ser dito:** ambos organizam a oferta em **quatro blocos nomeados** (Cortex Growth/Geofusion/Brand/Reach), e ambos põem **FAQ e LGPD na superfície** — no Brasil, dado é assunto sensível e responder isso cedo é acerto. O FARO já tem `LEI-DE-DADOS.md`; ela precisa aparecer, não só existir.

---

## 3. O PADRÃO-VENCEDOR EXTRAÍDO

Dez regras. Cada uma sai de uma observação acima, e cada uma vira decisão de layout na Fase 2.

| # | Regra | De onde saiu |
|---|---|---|
| **P1** | **Hero = uma manchete curta + subtítulo de ~10–25 palavras + no máximo 2 CTAs.** | Linear 1.1 · Vanta 1.2 · Vercel 1.4 (2 palavras) |
| **P2** | **Prova de procedência logo abaixo do hero, antes de qualquer feature.** | Vanta 1.2 (mural de logos colado no hero) |
| **P3** | **O produto se mostra como UI, nunca como ilustração conceitual.** | Linear 1.1 (5 blocos de screenshot) · Vanta 1.2 (fragmento por feature) |
| **P4** | **UI estilizada e recortada, não captura crua da tela inteira.** | Vanta 1.2 ("stylized/abstracted UI mockup") |
| **P5** | **20 a 60 palavras por bloco. Bloco longo é bloco não lido.** | Linear 1.1 · Vanta 1.2 |
| **P6** | **Um `h1` só. Seções em `h2`, itens em `h3`.** | Retool 1.3 acerta · Speedio 2.1 e Cortex 2.2 erram |
| **P7** | **Organizar por caso de uso, não por lista de features.** | Stripe 1.5 |
| **P8** | **Fechar com uma frase e UM CTA.** | Vanta 1.2 · Retool 1.3 · Linear 1.1 |
| **P9** | **Rodapé denso e categorizado — 6 a 10 grupos.** | Linear 1.1 (6) · Vercel 1.4 (10) |
| **P10** | **Gráfico desenhado em código, não imagem de gráfico.** | Stripe 1.5 (`canvas`) |

### E a regra que o FARO quebra de propósito

> **P-CONTRA · O número é o vício do setor, e o FARO não vai ter.**
>
> Ramp anuncia doze alegações numéricas na home. Retool põe cifra no título dos cinco casos.
> Vanta abre com 16.000+. Stripe abre com $1,9 trilhão. Speedio abre com 4.000 clientes e
> fecha com R$1.379,00/mês.
>
> **Todos eles têm cliente para contar. O FARO não tem — e mentir número é o único jeito de
> parecer que tem.** A ordem já proibia (§0.7: "nenhum número, nenhuma promessa de
> resultado"), e a curadoria mostra que a proibição não é só higiene: num mar onde todo mundo
> grita número, **a contenção é o que sobra de diferente.**
>
> No lugar do número entra o que o FARO tem de verdade e ninguém mais mostra: **a
> procedência** — fonte oficial, data de coleta, e a tabela do que existe × do que não existe.
> É a aplicação direta da P2, com a moeda que a casa possui.

---

## 4. O QUE A FASE 2 NÃO VAI FAZER, E POR QUÊ

| Recusado | Fundamento |
|---|---|
| Foto de banco de imagem, aperto de mão, pessoa de stock | nenhuma das cinco referências de elite usa; as fotos que aparecem (Vanta 1.2) são **retratos reais de clientes citados** — o FARO não tem clientes para retratar, então não tem foto |
| Mural de logotipos | o FARO está em stealth e não tem cliente. Mural vazio ou inventado é fraude; P2 é cumprida com procedência de **fonte de dado**, não de cliente |
| Selo de prêmio | prova emprestada (2.1) |
| Preço e FAQ empilhados na home | vira página de preço (2.1); o FARO já tem `/precos` própria |
| Contador animado sem rótulo | número solto (2.1) |
| Segundo `h1` | P6 |

---

*Curadoria da ALSHAM Global Commerce para o FARO™. Documento vivo: nova referência entra com
site, data e método, ou não entra.*
