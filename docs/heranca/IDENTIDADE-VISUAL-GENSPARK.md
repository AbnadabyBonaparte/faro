> **📥 HERANÇA — não é canon.**
>
> Este arquivo é um **espelho externo** do `docs/canon/IDENTIDADE-VISUAL.md`: uma
> leitura de fora, feita sobre o canon, que propôs valores cromáticos exatos onde
> o canon havia deixado tokens abstratos.
>
> **Os tokens canônicos são os de `apps/maquete/src/app/globals.css`**
> (`--color-bg: #06090c` · `--color-surface: #0c1216` · `--color-signal: #2ed3a3`
> · `--color-border: #1c262c`), e a lei de cor é a de `docs/canon/IDENTIDADE-VISUAL.md`.
> Onde este documento divergir do canon — e ele **diverge** (propõe `--bg #060B14`,
> um breu mais azulado) — **vale o canon**.
>
> Guardado por dois motivos: (a) o §1 (por que este público despreza painel de
> startup) é argumento aproveitável; (b) uma proposta descartada só é descartada
> de verdade quando fica registrada por que.
>
> Movido de `docs/canon/` para `docs/heranca/` em 19/08/2026 (Onda 2, housekeeping).
> Dois arquivos de identidade dentro de `canon/` faziam o repo ter duas fontes de
> verdade cromática — e o canon proíbe isso mais alto do que proíbe qualquer cor.

---

Análise completa dos dois documentos do canon. Aqui está a entrega final — **o Santo Graal da identidade visual do FARO**, calibrado sobre as leis que já existem no repo (sem inventar nada que conflite com o canon) e preenchido com o que faltava: **os valores cromáticos exatos**, que o `IDENTIDADE-VISUAL.md` deixou abstratos.

---

# 🟢 FARO™ — A PALETA SOBERANA
### *"O sinal está vivo."* — Sistema cromático definitivo v1.0

---

## 1. A FILOSOFIA — por que esta paleta cativa quem decide

O comprador do FARO não é um usuário de app. É **sócio de escritório, tributarista, grande empresário** — gente que leva a ficha para uma reunião onde se decide R$ 3 milhões. Esse público tem um radar apurado para duas coisas:

| O que ele despreza | O que o cativa |
|---|---|
| Painel colorido de startup, neon, gradiente roxo de "IA" | **Sobriedade de instrumento calibrado** |
| Número misterioso sem procedência | **Grade rígida, fonte+data na linha, monoespaçado** |
| Promessa empolgada | **Silêncio visual que diz: isso aqui é aferido** |

A paleta abaixo executa exatamente isso: **um breu institucional, uma única cor de sinal, e uma escala funcional que é a própria marca envelhecendo.** Nada decorativo. Cada pixel informa.

---

## 2. A PALETA-MESTRA — valores exatos (SSOT)

### 🌑 GROUND — o breu do instrumento

| Token | Hex | Função |
|---|---|---|
| `--bg` | `#060B14` | O breu. Azul-quase-preto profundo — a tela do posto de escuta |
| `--surface` | `#0C1424` | Painel / card |
| `--surface-2` | `#131E33` | Painel elevado / hover |
| `--border` | `#1D2C45` | Traço de grade, divisor de 1px |
| `--border-strong` | `#33486B` | Borda de foco / painel ativo |

### ✒️ TIPOGRAFIA — a voz

| Token | Hex | Função |
|---|---|---|
| `--text` | `#E8EEF6` | Texto primário — branco gelo, nunca branco puro (cansa à noite) |
| `--text-secondary` | `#94A5BC` | Rótulo, metadado, **fonte-e-data** monoespaçada |
| `--text-muted` | `#55677E` | Desativado, placeholder |

### 🟢 SINAL — a única cor de marca

| Token | Hex | Função |
|---|---|---|
| `--signal` | `#2ED8A3` | **Verde-jade de instrumento.** O traço vivo. A marca. |
| `--signal-dim` | `#1A7A5C` | Traço inativo, borda de sinal, varredura apagando |
| `--signal-fg` | `#04100B` | Texto sobre área pintada de sinal |

**Por que `#2ED8A3` e não outro verde:** fósforo puro (`#00FF00`) lê como hacker de brincadeira e **destrói a credibilidade diante do tributarista** — o canon já decretou isso. O `#2ED8A3` é puxado para o jade, dessaturado o suficiente para parecer **aferido por um engenheiro, não pintado por um designer**. Sobre o `#060B14`, entrega contraste altíssimo com pouquíssima área — o comportamento exato de "sinal escasso".

> **Regra de área (inviolável):** o `--signal` nunca ocupa mais de ~10% da área visível. Ele marca **o que importa agora**. Se tudo brilha, nada é sinal.

### 🚦 ESCALA FUNCIONAL — não é marca, é o tempo passando no sinal

| Estado | Token | Hex | Leitura |
|---|---|---|---|
| 🟢 atual | = `--signal` | `#2ED8A3` | o sinal está **vivo** |
| 🟡 recente | `--fresh-warn` | `#D9A441` | âmbar contido — o sinal está **esfriando** |
| 🟠 desatualizando | `--fresh-stale` | `#DE7A3C` | o sinal está **apagando** |
| 🔴 fonte antiga | `--fresh-old` | `#D9534F` | **não abordar sem revalidar** |

Este é o golpe conceitual mais elegante do sistema: **o Freshness não é um semáforo colado sobre a marca — é a medida de intensidade da própria marca.** Verde vivo → âmbar → laranja → vermelho é um radar perdendo o contato. Marca e função dizem a mesma coisa, e é por isso que âmbar e vermelho **jamais** podem ser cor de marca: já têm significado funcional.

### 📄 MODO CLARO — a ficha que vai para a reunião

O FARO nasce escuro, mas o assinante imprime a ficha e a coloca na mesa de um conselho. O modo claro é o **papel de cartório**, não um "tema claro de app":

| Token | Hex | Função |
|---|---|---|
| `--bg-light` | `#F6F4EE` | Papel institucional — branco quente de documento oficial |
| `--surface-light` | `#FFFFFF` | Área de conteúdo |
| `--text-light` | `#10161F` | Tinta |
| `--signal-light` | `#0E7A56` | O sinal **escurecido** — jade profundo com contraste sobre papel |
| `--border-light` | `#D8D3C6` | Linha de grade impressa |

---

## 3. AS LEIS CROMÁTICAS — o que a paleta obriga e proíbe

1. **Uma cor de sinal. Ponto.** Toda a família — horizontal e vertical (TAX → M&A → AGRO → ENERGIA → B2B) — fala com o **mesmo** `#2ED8A3`. As verticais se diferenciam por **assinatura tipográfica** (`FARO TAX`, `FARO M&A`), nunca por cor nova. Cor nova por vertical = confederação de submarcas; sinal único = **um instrumento, muitos territórios**.
2. **Evidence Grade (A–D) usa peso e tipografia, nunca cor.** Grade A é "A" em monoespaçado com borda forte. Colorir evidência a transforma em placar — e evidência não é placar.
3. **Borda antes de sombra.** Traço de 1px `#1D2C45` define área. Sombra difusa é enfeite de fundo claro.
4. **Raio de canto baixo (2–4px).** Painel de instrumento, não bolha de app.
5. **Movimento quase zero.** A única animação permitida é a que comunica mudança de estado: o sinal que acende. O radar varre devagar.
6. **Números sempre monoespaçados.** Score, CNPJ, datas, `source_id` alinham em coluna — é isso que faz o tributarista **confiar olhando**.
7. **Banner ANTI-QUANTUM permanente** enquanto o motor não roda: `PROTÓTIPO — dados ilustrativos`.

---

## 4. A MARCA

Enquanto não houver logotipo desenhado: **`FARO`** em sans, peso alto, tracking aberto, com **um único traço** `#2ED8A3` como acento — não ícone ilustrativo.

> **FARO™ — Inteligência Contínua de Oportunidades.**

**Recusados para sempre:** mira de rifle, cão de caça, pegada, lupa, cérebro, circuito, robô, gradiente neon, roxo de startup.

---

## 5. O RESUMO EXECUTIVO — uma frase para a reunião

> **Breu de instrumento. Um verde-jade que só acende onde a informação está viva. Papel de cartório quando a ficha sai da tela. Zero decoração — porque quem decide milhões não compra enfeite, compra precisão.**

Essa paleta é premium não porque brilha, mas porque **economiza**: a avareza cromática é o sinal de status do sistema. É a mesma lógica do relógio de mergulho e do posto de comando — e é exatamente a frequência em que grandes empresários e advogados reconhecem autoridade.

**Próximo passo sugerido, se quiser:** eu transformo isso em um *brand board* visual (as amostras de cor, tipografia e componentes renderizados) ou em um documento formal de brand guidelines pronto para entregar ao executor. É só dizer qual.
