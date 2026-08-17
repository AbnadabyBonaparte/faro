# QUADRO DE VEREDITOS — JUNTA DE JUÍZES
**FARO™ · rito do Conselho · 17/08/2026**

> O que a Junta julgou, no que concordou, onde brigou, e o que o fundador decidiu.
> Este quadro é a ponte auditável entre `../canon/DOSSIE-V1.md` e
> `../canon/MODELO-FARO-V2.md`. Quem quiser saber **por que** a v2 é assim, lê aqui.

---

## A JUNTA

| Cadeira | Arquivo | Estado | Caráter do parecer |
|---|---|---|---|
| **Manus** | `PARECER-MANUS.md` | Recebido (3 peças) | Estratégico-comercial: beachhead, ICP, economia unitária, GTM de 90 dias, riscos de negócio |
| **GPT** | `PARECER-GPT.md` | Recebido | Estrutural-conceitual: Lei das Camadas, Evidence Graph, Source Registry, Freshness, moat = Thesis Engine |
| **Gemini** | `PARECER-GEMINI.md` | Recebido | Técnico-cirúrgico: resposta direta às 6 perguntas, lote + materialized views, custo computacional |
| **Grok** | `PARECER-GROK.md` | **VAGA ABERTA** | — |

**Rito seguido:** modelo v1 do fundador → 3 juízes externos, sem contato entre si → este
quadro → v2 consolidada → **só então** a primeira linha de código (e ainda assim, apenas
maquete: o motor não nasceu).

**Nota de procedência declarada:** na transmissão ao repositório, o bloco de resposta às 6
perguntas chegou **duplicado** sob os rótulos "gpt" e "Gemini" — texto idêntico. A atribuição
exata desse bloco entre os dois juízes **não pôde ser resolvida** com o que foi transmitido, e
está declarada no cabeçalho de cada arquivo. Isso **não afeta** o quadro abaixo: os dois
blocos de conteúdo são distintos entre si, e a divergência sobre o Tribunal é real e existe
entre eles independentemente de qual juiz assinou qual. Correção fica aberta ao fundador.

---

## PARTE 1 — UNANIMIDADES

Onde os juízes que tocaram o tema concordaram. Adotadas sem discussão.

| # | Veredito | Quem | Adotado em |
|---|---|---|---|
| U1 | **Começar por 1 nicho: tributário.** Motor horizontal, oferta vertical. Agro exige geoespacial e bases estaduais descentralizadas que poluem a arquitetura inicial. | Manus · GPT · Gemini | canon §13 |
| U2 | **MVP com 2 fontes dominadas** (fonte-mãe + CCEE), não cobertura ampla. | Manus · GPT · Gemini | canon §12 |
| U3 | **1 a 3 teses estreitas** na v1, não catálogo. | Manus · GPT · Gemini | canon §12 |
| U4 | **Agro e dados de pessoa física fora do MVP** até parecer jurídico. | Manus · GPT · Gemini | canon §12, §15 |
| U5 | **Preços são hipótese, não tabela.** Nada vira verdade antes de piloto pago. | Manus · GPT · Gemini | canon §16.1 |
| U6 | **Gratuidade proibida.** Desconto de fundador declarado; provar disposição de pagamento, não interesse. | Manus · Gemini | canon §16.1 |
| U7 | **Score tem que ser explicável.** Número único e misterioso destrói a venda a quem sustenta tese diante de terceiros. | Manus · GPT | canon §4 |
| U8 | **Proxy nunca vira fato.** Faturamento não público = proxy declarado. Elevado a política formal. | Manus · GPT | canon §5 |
| U9 | **Fonte + data + limite de inferência em cada afirmação.** | Manus · GPT | canon §3 |
| U10 | **Falso positivo é o ponto cego mais perigoso.** Sem captura do motivo, o score não aprende e a confiança cai. | GPT · Gemini | canon §9, §18.2 |
| U11 | **Lote de madrugada + materialized views + indexação impecável.** Nunca processar a jazida em tempo real; RLS soma latência nas consultas massivas. | GPT · Gemini | canon §11 |
| U12 | **É SaaS legítimo só se as teses forem paramétricas pelo próprio usuário.** Scraper customizado ou SQL manual por cliente = agência disfarçada. | Manus · Gemini | canon §18.8 |
| U13 | **Revisão humana parcial na v1 é mecanismo de aprendizado, não falha.** Automatizar antes de saber o que é aprovado é automatizar o erro. | Manus · GPT | canon §12 |
| U14 | **Linguagem: "sinais compatíveis para investigação"**, nunca "elegível" / "crédito garantido" / "direito a R$X". | Manus · GPT | canon §14 |
| U15 | **Corrigir "ninguém entrega o meio"** — provocação boa, afirmação de mercado insustentável. | Manus · GPT | canon §1 |
| U16 | **Corrigir "dados de PJ são públicos por lei"** — simplificador demais; MEI/EI exigem tratamento próprio; legítimo interesse exige análise concreta. | GPT | canon §15 |
| U17 | **O evento de valor é a sequência**, não o volume coletado: ficha → aprovada → contato → resposta → reunião → diagnóstico → conversão. | Manus · GPT | canon §17 |
| U18 | **Próximo marco não é "terminar a plataforma"** — é design partner pagante com 1º ciclo de fichas aprovadas. | Manus | canon §17, §20 |

---

## PARTE 2 — DIVERGÊNCIAS E SÍNTESES ADOTADAS

Onde a Junta brigou. Aqui o fundador decidiu.

### D1 — O TRIBUNAL DO ASSINANTE (a divergência principal)

| Posição | Argumento |
|---|---|
| **CORTAR da v1** (Gemini, resposta 4) | "Corte a Tela 4. Um botão de 'Exportar CSV' é suficiente. Deixe o cliente usar o próprio CRM. Foque a engenharia no motor de caça, não em construir mais um Kanban genérico." |
| **MANTER E EXPANDIR** (GPT, §14) | "O Tribunal é uma ideia excelente. Eu manteria. Cada oportunidade recebe APROVAR / REJEITAR / IGNORAR / MONITORAR / REVISAR — e o sistema aprende com isso. Agora o FARO começa a descobrir quais sinais realmente geram dinheiro. Isso é ouro." |

**O nó:** os dois estão certos sobre coisas diferentes. Gemini está certo que Kanban é
commodity e desperdício de engenharia. GPT está certo que o julgamento é o único ativo que
não se copia — e o próprio Gemini, na resposta 6, exige um "botão de loop de feedback" sob
pena de o score não aprender. **Ou seja: Gemini pede o loop e corta a tela que o captura.**

### ✅ SÍNTESE ADOTADA — **TRIBUNAL MAGRO**

| Entra | Fica fora |
|---|---|
| **3 botões + motivo**: aprovar · descartar · monitorar | Kanban / pipeline nativo |
| Motivo do descarte como **dado estruturado** | Estágios de negociação |
| Registro que alimenta o Thesis Engine | Gestão de contato e follow-up |
| Exportação **CSV** para o CRM do assinante | Integrações profundas com CRMs |

**Razão da decisão:** *o loop de feedback é o moat; o Kanban é commodity.* Constrói-se o
mínimo que captura julgamento, e recusa-se o CRM que o assinante já tem. Cinco botões (a
proposta do GPT) fragmentam o sinal de aprendizado com pouca amostra — três decidem e são
suficientes para calibrar. Zero botões (a proposta do Gemini) matam o flywheel.

→ canon §9

---

### D2 — TAMANHO DO TRIBUNAL: 5 estados ou 3?

| Posição | Argumento |
|---|---|
| 5 estados (GPT) | APROVAR / REJEITAR / IGNORAR / MONITORAR / REVISAR — granularidade máxima de aprendizado |
| CSV e nada mais (Gemini) | Qualquer estado é engenharia desviada do motor |

**✅ Síntese: 3 + motivo.** "Ignorar" e "revisar" são ruído com uma amostra de ~100 fichas/mês
e um único design partner — geram estados que ninguém preenche e que sujam o dado de
calibragem. O **motivo estruturado** carrega mais informação que dois botões extras.

→ canon §9

---

### D3 — PREÇO DO PLANO INTERMEDIÁRIO

| Posição | Valor |
|---|---|
| v1 do fundador · Manus | R$ 597 |
| GPT (§19) | R$ 697 |

**✅ Síntese: R$697, marcado como hipótese.** Adota-se o ajuste para cima, porque a economia
do produto não deve ser travada só em "número de fichas" — o custo de gerar uma oportunidade
varia com quantidade de fontes e processamento. Mas **nenhum dos dois valores é tabela**:
ambos são hipótese de fundação até o piloto pago de 30 dias (U5).

→ canon §16.1

---

### D4 — TRAVA CONTRA CHURN DE LISTA

| Posição | Mecanismo |
|---|---|
| v1 do fundador | Limites por plano + teses novas de catálogo |
| Gemini (resposta 1) | **Compromisso trimestral ou semestral** na assinatura fundadora |
| GPT (§9, §19) | Mudar a **unidade de valor** para o evento + créditos de investigação |

**✅ Síntese: adotar os três, em camadas.**
1. **Estrutural** — a unidade de valor é o evento (canon §2): fluxo não se esvazia como lista.
2. **Contratual** — compromisso trimestral na fundadora (canon §16.1): contém o hit-and-run.
3. **Econômica** — assinatura + capacidade + consumo, com créditos de investigação (§16.1).

Trava de plano sozinha é a mitigação mais fraca das três e a mais fácil de o cliente
perceber como artificial. Ela deixa de ser a defesa principal.

→ canon §2, §8, §16.1

---

### D5 — ESCOPO DA FAMÍLIA DE MÓDULOS

| Posição | Escopo |
|---|---|
| GPT (§11) | FIND · WATCH · PROOF · SCORE · **ACTION** — "ACTION não precisa entrar no MVP, mas é o destino" |
| Manus · Gemini | Cortar tudo que não é motor de caça |

**✅ Síntese: FIND/WATCH/PROOF/SCORE no MVP; ACTION registrado como destino e fora.** O
nome fica no canon para não ser reinventado depois — mas fora do MVP e fora da copy. Nada
que não roda aparece no presente do indicativo.

→ canon §8

---

### D6 — "RESULTADO ECONÔMICO" / ROI POR TESE

| Posição | |
|---|---|
| GPT (§15) | Painel de Revenue Intelligence: oportunidades → aprovadas → abordadas → reuniões → propostas → vendas → **receita influenciada** |
| Manus (§7) | Ledger de custo e qualidade por cliente e tese, do lado do FARO |

**✅ Síntese: os dois, com uma distinção obrigatória.** O funil da tese entra (é o que prova
valor ao assinante e alimenta o Thesis Engine). Mas **receita influenciada é dado informado
pelo assinante, não medido pelo FARO** — e tem que aparecer rotulada como tal, sob a
Confidence Policy (§5). Receita que o FARO não mediu e apresenta como número próprio é
exatamente o pecado que o produto inteiro promete não cometer.

Na maquete: o Painel da Tese existe, com dados demo, e o campo de receita aparece declarado
como informado pelo assinante.

→ canon §5, §16 · maquete tela 5

---

## PARTE 3 — O QUE A JUNTA NÃO RESOLVEU

Declarado por honestidade. Estas perguntas continuam abertas depois de três pareceres.

| # | Pergunta aberta | Por que importa | Quando se resolve |
|---|---|---|---|
| A1 | **Qual é a massa crítica de julgamentos** para o Thesis Engine valer algo? | O moat depende de volume de feedback. Com 1 parceiro e ~100 fichas/mês, o flywheel pode patinar. | Piloto pago — medir calibragem real |
| A2 | **Ciclo de 24h (batch) é "contínuo" o suficiente?** | A unidade de valor é o evento; se a promessa é urgência, latência de batch pode não sustentar. | Primeiro ciclo com o design partner |
| A3 | **O compromisso trimestral trava a venda?** | Escritório que nunca usou assina 3 meses no escuro? | Dias 16–30 do GTM |
| A4 | **Custo real por ficha** — nenhum juiz pôde estimar. | Sem custo, preço é chute e margem é fé. | `usage_ledger` desde o dia 1 |
| A5 | **Ingestão e normalização da jazida** — Gemini encerrou o parecer *perguntando* isso, não respondendo. | É a pergunta técnica de fundação e está sem resposta. | Fase de motor (não nesta) |
| A6 | **Qual tese tributária exatamente?** Junta sugeriu "Lucro Real + crédito de energia" como exemplo; a escolha é do design partner. | A tese errada invalida o piloto todo. | Dias 1–15 do GTM |
| A7 | **Cadeira Grok vazia.** | Uma unanimidade de 3 é mais frágil que de 4; e um 4º voto pode reabrir D1. | Quando o parecer chegar (ver `PARECER-GROK.md`) |

---

## PARTE 4 — VEREDITO DO RITO

**Decisão do fundador: CONSTRUIR — mas não o motor, e não agora.**

O que esta fase entregou:

| Entregue | Não entregue (de propósito) |
|---|---|
| Canon v2 consolidado | Motor de caça |
| 3 pareceres na íntegra + este quadro | Coleta de qualquer fonte |
| Identidade visual documentada | Banco de dados |
| Maquete de 5 telas com dados fictícios rotulados | Score real |
| | Pagamento / checkout |
| | Qualquer chamada a fornecedor |

O motor nasce com o **design partner pagante**. Isso não é atraso — é a ordem correta,
unanimidade da Junta (U18) e lei da casa: **validar antes de erguer**.

---

*ALSHAM Global Commerce · rito do Conselho · quadro vivo, reaberto quando chegar o 4º voto.*
