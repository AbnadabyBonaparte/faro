# CANAL OPERADOR PARCEIRO — A ROTA (b)
## O escritório de advocacia parceiro como operador da casa
**ALSHAM Global Commerce · 17/08/2026**

> Rota **(b)** da decisão selada: canal controlado, ao lado da rota (a)
> picks-and-shovels como núcleo. Ver
> [`MODELO-DE-NEGOCIO.md`](./MODELO-DE-NEGOCIO.md) §A.
>
> Base jurídica e vereditos: [`../junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md`](../junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md) Parte 2.

---

## O desenho

O **escritório de advocacia parceiro da ALSHAM** trabalha como **operador da casa**.
Ele recebe dossiês qualificados e executa os atos que só ele pode executar.

```
      TENANT PRÓPRIO DA ALSHAM                 ESCRITÓRIO PARCEIRO
   (teses do Catálogo da Casa,          →    (advogados habilitados, OAB)
    com certidão de proveniência)
              │                                        │
              │  dossiê qualificado                    │  ato privativo:
              │  (sinais, evidência,                   │  consultoria jurídica,
              │   fonte, EV líquido,                   │  estratégia, petição,
              │   limite de inferência)                │  representação
              │                                        │
              └──────────  GROUND TRUTH  ←─────────────┘
                    (ficha → conversão → valor → prazo de caixa)
```

## 🔴 A ORIGEM DO DOSSIÊ — regra dura

> Os dossiês entregues ao operador parceiro são minerados **EXCLUSIVAMENTE pelo
> tenant próprio da ALSHAM**, a partir de teses do
> [`CATALOGO-DE-TESES-DA-CASA.md`](./CATALOGO-DE-TESES-DA-CASA.md), **cada uma com
> certidão de proveniência**.
>
> **NUNCA de tenant de cliente.** Nem por derivação, nem por inspiração, nem por
> "padrão observado". Ver [`LEI-DE-DADOS.md`](./LEI-DE-DADOS.md).

Isto é o que mantém a frase-síntese honesta: *"Levi's E garimpeiro — cada um com a
sua bateia, no seu lote, com escritura."* O escritório parceiro opera **o lote da
casa**. Se um dossiê não tiver certidão de proveniência, ele não sai.

---

# O MURO LEGAL

**Lei 8.906/1994 — Estatuto da Advocacia.** Unânime nos três pareceres da Junta.

| Artigo | O que diz |
|---|---|
| **Art. 1º** | São privativas de advocacia a **postulação perante o Poder Judiciário** e as atividades de **consultoria, assessoria e direção jurídicas** |
| **Art. 4º** | São **nulos** os atos privativos praticados por pessoa não inscrita na OAB |
| **Art. 5º, §4º** | Consultoria e assessoria jurídicas podem ser verbais ou escritas e **independem de mandato ou contrato formal de honorários** |

**A leitura do §4º que importa para o produto:** consultoria jurídica não precisa de
contrato formal para existir. Ou seja — **a ALSHAM pode praticar ato privativo sem
perceber**, apenas ao redigir uma frase conclusiva. É por isso que a linguagem de
produto ([`MODELO-FARO-V2.md`](./MODELO-FARO-V2.md) §14) é lei e não estilo.

## Quem faz o quê

| Atividade | ALSHAM (tech) | Contador | Advogado |
|---|---|---|---|
| Coletar dado público e fiscal autorizado | ✅ | ✅ | ✅ |
| Software de triagem, scoring, workflow | ✅ | ✅ | ✅ |
| Cálculo mecânico e reconciliação documentada | ✅ com controles | ✅ | ✅ |
| Orientação contábil/fiscal | ❌ | ✅ | conforme escopo |
| **Parecer jurídico e estratégia judicial** | ❌ | ❌ | ✅ |
| **Petição, representação, atuação judicial** | ❌ | ❌ | ✅ |
| Compensação administrativa | software e suporte operacional; **não decide juridicamente** | ✅ | ✅ |
| **Reter % de honorário advocatício** | ❌ **NUNCA** | contrato próprio | conforme OAB |

---

# 💰 REMUNERAÇÃO

## 🔴 A REGRA ABSOLUTA

> # JAMAIS percentual de honorário advocatício.

Nem como êxito. Nem como bônus. Nem como "participação no resultado". Nem
disfarçado de reajuste.

**O que cada juiz disse, sem se falarem:**

> **Gemini:** *"NÃO PODEM […] reter % de honorário advocatício (Infração ética e
> crime de exercício irregular da profissão). Parcerias lícitas ocorrem via cobrança
> por licenciamento de uso ou taxa por lead gerado/processado, **jamais como 'sócios
> de fato' do escritório em divisão de honorários**."*

> **GPT:** *"O Estatuto da Advocacia caracteriza como infração disciplinar utilizar
> **agenciador de causas mediante participação nos honorários**. […] 'Eu gero o lead
> jurídico e recebo 30% dos honorários do advogado' é uma estrutura **juridicamente
> perigosa**."*

> **Manus:** *"O revenue-share deve ser revisado por advogado, pois **partilha de
> honorários, captação, publicidade e associação** entre advocacia e atividade
> empresarial podem gerar problemas éticos e regulatórios."*

## Os dois modelos lícitos

### Modelo 1 — LICENÇA PREMIUM

O escritório assina o FARO em uma linha de licença dimensionada para operação
estruturada. Paga por **software e inteligência**, com preço próprio, independente
do resultado dos casos.

- Preço fixo mensal ou anual
- Não varia com êxito, com valor recuperado nem com honorário do escritório
- Benchmark de referência: `ESTIMATIVA: R$ 2–30 mil/mês` (GPT + Manus) — ver
  [`MODELO-DE-NEGOCIO.md`](./MODELO-DE-NEGOCIO.md) §D.2

### Modelo 2 — FEE POR DOSSIÊ QUALIFICADO

Preço por unidade de trabalho técnico entregue: o dossiê minerado, documentado e
pontuado.

- **Indexável a volume** (faixas de quantidade) **e a faixa** (profundidade do
  dossiê, número de fontes, complexidade da tese)
- **Nunca indexado ao êxito**, ao valor recuperado ou ao honorário cobrado do
  contribuinte
- O preço é do **produto entregue**, não do resultado que ele venha a produzir

**O teste que separa lícito de ilícito:** se o preço muda porque o caso deu certo, é
partilha de honorário. Se o preço muda porque o dossiê era mais profundo, é preço de
produto.

## Estrutura contratual

**Contratos espelhados**, nunca um contrato só:

```
CONTRATO A                          CONTRATO B
ALSHAM ⇄ Escritório                 Escritório ⇄ Contribuinte
licença de software /               serviço jurídico
fee por dossiê                      honorários (regras da OAB)
preço próprio                       relação advogado-cliente
```

Nenhum contrato referencia o outro em cláusula de preço. O contribuinte consente
expressamente com o fluxo, a responsabilidade e o tratamento de dados.

> **⚠️ REVISÃO OBRIGATÓRIA: LEXIS + tributarista do escritório parceiro.**
>
> Nenhuma estrutura concreta de remuneração entra em vigor sem parecer. O próprio
> GPT registra isso no seu `NÃO VERIFICADO` nº 10: *"a fronteira entre serviço
> tecnológico, captação/agenciamento e serviço profissional é material."*

---

# 🔁 GROUND TRUTH LOOP — o moat que nenhum concorrente tem

Esta é a razão estratégica da rota (b). Não é o dinheiro do canal — é o **dado**.

Todo concorrente que vende lista tributária tem o mesmo problema: **nunca descobre
se o lead deu certo.** Vende, entrega, e o resultado desaparece dentro do cliente.
O score nunca aprende porque o resultado nunca volta.

O operador parceiro fecha esse circuito.

```
     FICHA           →  o FARO publicou o dossiê
       ↓
     CONVERSÃO       →  virou caso? não virou? por quê?
       ↓
     VALOR           →  quanto foi efetivamente recuperado (não o bruto acusado)
       ↓
     PRAZO DE CAIXA  →  quanto tempo até o dinheiro entrar
       ↓
   ┌───────────────────────────────────────┐
   │  CALIBRAGEM DO FARO SCORE             │
   │  · quais sinais realmente convertem   │
   │  · qual P(elegibilidade) real         │
   │  · qual P(homologação) real           │
   │  · qual prazo de caixa real por tese  │
   └───────────────────────────────────────┘
       ↓
     TESE MELHOR  →  próxima caça mais precisa
```

## Por que isto responde ao ponto cego triplo

Os três juízes apontaram, cada um de um ângulo, o mesmo buraco
([quadro, Parte 5](../junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md)):

| Juiz | Pergunta | O que o ground truth loop devolve |
|---|---|---|
| **Gemini** | "Quem paga se o algoritmo errar?" | Taxa real de falso positivo, medida — não estimada |
| **GPT** | "Qual o custo econômico de um falso positivo?" | O funil real da casa, em vez do funil hipotético |
| **Manus** | "Qual a capacidade de utilização e o prazo de caixa?" | Prazo de caixa **observado**, por tese |

**Sem o loop, o EV líquido ([`MODELO-DE-NEGOCIO.md`](./MODELO-DE-NEGOCIO.md) §C.3) é
um chute com aparência de fórmula.** As probabilidades que ele multiplica precisam
vir de algum lugar. Vêm daqui.

**E é aqui que a rota (b) deixa de ser "receita extra" e vira infraestrutura:** o
canal existe menos para faturar e mais para **produzir a verdade** que calibra o
produto vendido na rota (a).

## Fronteira do loop

O ground truth vem de **casos operados pelo escritório parceiro sobre dossiês do
tenant da casa** — camada 2 da [`LEI-DE-DADOS.md`](./LEI-DE-DADOS.md). É dado da
própria operação da casa, não de tenant de cliente.

Resultado de assinante só entra por **opt-in declarado** (camada 4), como benchmark
recíproco e contratado.

---

# 🛡️ CLÁUSULA-BLINDAGEM — em todo fluxo

Formulação literal de Gemini, adotada como obrigatória:

> ## "sugestão de dados vs. decisão do contribuinte"

## O risco concreto

A Receita Federal tem **5 anos** para homologar uma compensação. Se a tecnologia
apontar crédito indevido, o contribuinte sofre **multa de ofício de 75% a 150%**
(Gemini). E, no mercado real, **o cliente processa a consultoria/tech exigindo
reparação**.

Um erro de score não custa reputação. Custa multa no cliente e ação de regresso na
casa.

## Onde a blindagem aparece

Não é cláusula de rodapé — aparece em **todo o fluxo**, e a interface é obrigada a
carregá-la:

| Ponto | O que tem que estar explícito |
|---|---|
| **Na ficha** | O FARO apresenta **sinais compatíveis para investigação**. Não afirma elegibilidade, não calcula crédito devido, não emite parecer. |
| **No campo limite de inferência** | O que é dado observado, o que é proxy, o que depende de validação humana |
| **No dossiê entregue ao operador** | A decisão técnica e a conclusão jurídica são do profissional habilitado |
| **No contrato com o escritório** | Delimitação de responsabilidade entre sugestão de dados e decisão profissional |
| **No contrato escritório ⇄ contribuinte** | A decisão de compensar é do contribuinte, assessorado pelo habilitado |
| **Na exportação CSV** | O cabeçalho carrega a ressalva; dado que sai da plataforma leva a ressalva junto |

## O que a ALSHAM nunca diz

| ❌ Proibido | ✅ Obrigatório |
|---|---|
| "esta empresa tem crédito de R$ X" | "sinais compatíveis com a tese X, EV líquido estimado" |
| "empresa elegível" | "alvo que merece investigação" |
| "crédito garantido" | "hipótese que justifica investigação técnica" |
| "recupere R$ X" | "potencial bruto R$ X, com P(elegibilidade) e P(homologação) declaradas" |
| "pode compensar" | "a decisão de compensar é do contribuinte, assessorado por profissional habilitado" |

Ver [`MODELO-FARO-V2.md`](./MODELO-FARO-V2.md) §14.

---

# O QUE ESTE DOCUMENTO NÃO DECIDE

| Aberto | Quem fecha |
|---|---|
| Qual escritório, com que escopo e em que território | Dono |
| Valor da licença premium ou do fee por dossiê | Dono + piloto pago |
| Texto final dos contratos espelhados | **LEXIS + advogado externo + tributarista do escritório** |
| Delimitação exata de responsabilidade por falso positivo | **LEXIS + advogado externo** |
| Se o ground truth loop exige aditivo contratual próprio | **LEXIS** |

Nada aqui é contrato. É o desenho que o advogado vai revisar.

---

*ALSHAM Global Commerce · rota (b) da decisão selada de 17/08/2026. Toda estrutura
de remuneração aguarda revisão LEXIS + advogado externo.*
