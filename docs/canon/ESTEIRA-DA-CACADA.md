# A ESTEIRA DA CAÇADA — spec do balcão de cozinha aberta

> Martelo do dono, 19/08/2026 · spec para a onda do app.
> Lei que a governa: [`MODELO-DE-NEGOCIO.md` §D.5 — A Lei do Tempo de Cozinha](./MODELO-DE-NEGOCIO.md).
> Este documento é **contrato de implementação**, não sugestão de UI.

---

## 1. O QUE É

Quem pagou uma Caçada espera de 5 a 10 dias úteis. A Esteira é a tela que ele
abre nesse intervalo para ver **que o sistema não parou**.

Ela é o balcão da cozinha aberta: o cliente não entra na panela, mas vê o fogo
aceso. Sem ela, a janela de espera é indistinguível de abandono — e uma janela
que parece abandono destrói a confiança que ela deveria construir.

---

## 2. AS TRÊS LEIS DA ESTEIRA

### Lei 1 — TODO ESTADO É DERIVADO DE FATO NO BANCO

Nenhum estado da Esteira é escrito por uma rotina de UI. Cada um é **lido** de
uma transição que já aconteceu:

| Etapa na tela | De onde o estado vem | Carimbo de hora |
|---|---|---|
| **Aceite registrado** | trilha imutável do Aceite (quem, quando, qual versão da tese) | o `timestamptz` do aceite |
| **Varredura do território** | `fichas.cacadas` — a linha existe quando a caçada rodou | `rodada_em`, e `duracao_ms` para o tempo gasto |
| **Candidatos em análise** | `fichas.candidatos` — contagem por `cacada_id` | `rodada_em` da caçada que os produziu |
| **Em revisão humana** | `uso.ledger` com `metrica = 'revisao_humana_min'` | `ocorrido_em` do primeiro lançamento |
| **Entrega** | `fichas.fichas` publicadas para a caçada | `criada_em` da última ficha |

Se a linha não existe no banco, **a etapa não aparece como concluída**. Não há
estado otimista, não há "provavelmente já rodou".

### Lei 2 — GRANULARIDADE GROSSA, DE PROPÓSITO

**Etapas, nunca porcentagem.**

Porcentagem exige saber o total antes de terminar, e no meio de uma varredura
esse total é um chute. Chute exibido com duas casas decimais é mentira com cara
de precisão — a mesma família do score atribuído sem decomposição que o canon já
proíbe.

Cinco etapas. Cada uma é `pendente`, `em curso` ou `concluída`. Não existe
sexto estado, não existe fração dentro da etapa.

**Número só entra quando é contagem real e já fechada** — "2,1 M registros
varridos" sai de `linhas_processadas` no `uso.ledger`, depois que a varredura
terminou. Antes disso, não se escreve número nenhum.

### Lei 3 — 🔴 PROIBIDO PROGRESSO FALSO

O que **não** pode existir nesta tela, em nenhuma versão:

- barra que anda sozinha com o relógio;
- animação de "processando" sobre etapa que não está processando;
- atraso plantado para encenar dificuldade;
- porcentagem interpolada entre dois estados;
- carimbo de hora arredondado, adiantado ou inventado.

> **O tempo do FARO é real e a revisão humana é real.** É isso que separa a
> cozinha aberta do restaurante que esconde o micro-ondas. No dia em que a
> Esteira mostrar trabalho que não aconteceu, ela deixa de ser prova e vira
> propaganda — e o produto inteiro se apoia em ser prova.

---

## 3. O QUE ACONTECE QUANDO EMPACA

Etapa parada é o caso mais provável de todos, e a Esteira precisa ser honesta
nele em vez de girar um spinner:

| Situação | O que a tela mostra |
|---|---|
| Etapa em curso há mais que o esperado | `sem movimento desde <hora>` — com a hora real, não um eufemismo |
| Fonte degradada no meio da caçada | o `source_id`, o estado da fonte e o efeito na entrega |
| Fonte bloqueada | a lacuna declarada, como já aparece na ficha |
| Prazo em risco | aviso **antes** do vencimento, com a janela renegociada |

Spinner infinito é a forma mais barata de mentir: ele afirma atividade sem
carregar prova nenhuma. Um texto com hora verdadeira admite o problema e mantém
a confiança.

---

## 4. O QUE A ESTEIRA NÃO É

- ❌ **Não é log técnico.** Nada de nome de tabela, de `job_id`, de stack trace.
- ❌ **Não é a ficha.** Ela mostra o percurso, não o resultado.
- ❌ **Não é canal de suporte.** Sem chat, sem "fale com o analista".
- ❌ **Não é pública.** Só o tenant que pagou a caçada vê a esteira daquela
  caçada — a mesma regra de isolamento que vale para todo o resto do produto.

---

## 5. O QUE JÁ EXISTE NO BANCO, E O QUE FALTA

**Existe** — `fichas.cacadas` (com `rodada_em`, `duracao_ms`, `candidatos`,
`fichas_publicadas`), `fichas.candidatos`, `fichas.fichas`, e `uso.ledger` com
as métricas `linhas_processadas`, `revisao_humana_min` e `ficha_publicada` já
previstas desde a Onda 1.

**Falta** — a trilha do Aceite (nenhuma compra existe ainda) e o lançamento
efetivo de `revisao_humana_min`, que hoje é coluna sem escrita porque a revisão
à mão ainda não roda para cliente pagante.

🟡 Enquanto isso, **a Esteira só existe como recorte de maquete**, com dados
fictícios e horas de exemplo. A tela real nasce na onda do app, contra estas
tabelas — não contra um mock promovido a produção.

---

*ALSHAM Global Commerce · canon vivo. Estado é fato lido do banco, ou não é estado.*
