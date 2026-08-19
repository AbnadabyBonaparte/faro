# ONDA 3 — O MOTOR DE CAÇA

> Relatório de bordo · 19/08/2026 · branch `faro/onda-3-caca`
> Regra de Pedro aplicada ao relatório: responde com prova, traz o adjacente,
> argumenta contra si mesmo, e deixa carga reservada esperando o "pode fechar".

---

## 0. O QUE ESTA ONDA DESCOBRIU (leia isto se ler só uma coisa)

**A T-04, como parametrizada, produz ZERO fichas por mês. E o zero está certo.**

Não é defeito do motor. O pipeline rodou inteiro sobre 4,75 milhões de
estabelecimentos reais da Receita, em 7,5 segundos, e devolveu zero. Os números
medidos no recorte disponível (1/10 da base):

```
eventos `porte_alterado` no recorte ................. 351
estabelecimentos industriais ativos (Brasil) ..... 91.848
destes, em MT/GO .................................. 5.166
território T-04 v0 (MT/GO + porte 05) ................. 82
eventos que caem em indústria ativa (Brasil) ........... 1
>>> interseção T-04 v0 × evento ........................ 0
```

A conta: **82 alvos** no território, contra uma taxa de evento de 351 em 4,49
milhões de empresas — **0,0078% ao mês**. O valor esperado é
`82 × 0,000078 ≈ 0,006 ficha/mês`. Na base inteira (10× o recorte): ~820 alvos,
~3.510 eventos, esperado **~0,06 ficha/mês** — **menos de uma por ano.**

**Isto não se resolve carregando a base inteira.** É aritmética de duas
grandezas pequenas se multiplicando: um território estreito (MT/GO) vezes um
evento raro (mudança de porte).

### 🔴 O que isso cobra do modelo comercial

A Escada v2 (`MODELO-DE-NEGOCIO.md §D.0`) promete **7 fichas/mês** no Pro e
**15** no Escritório. Os volumes foram escolhidos para a régua de preço descer —
está escrito lá, e eu mesmo declarei que era o número mais frágil da tabela.

**Esta é a primeira medição real de cadência, e ela não sustenta 7 fichas/mês
com uma tese só.** Ou o assinante roda várias teses em paralelo, ou a franquia é
outra. Não é catástrofe: é o número aparecendo antes de alguém prometer em
contrato — que é exatamente para isso que se constrói antes de vender.

---

## 1. A PRIMEIRA FICHA REAL DO FARO

Existe. Nasceu de dado real da Receita Federal e está no banco local.

> **Privacidade:** o repo é público. CNPJ e razão social vão mascarados; o resto
> é íntegro. As fichas completas vivem só no banco local.

| | |
|---|---|
| CNPJ | `XX.XXX.XX*/0104` |
| Razão social | `JOC************` |
| **Score** | **59** (derivado — bate com a soma das parcelas) |
| Evidence Grade | **B** |
| Freshness | `ok` (lote com 18 dias) |
| **Ação** | **`preparada`** — esperando o humano |
| Porte | `03` — na coluna de **PROXY**, nunca na de fato |
| EV bruto | R$ 200.000 · `ESTIMATIVA` |
| **EV líquido** | **R$ 6.000** · `ESTIMATIVA` |

### O score, decomposto e justificado

| Dimensão | Valor | Peso | Contribui | Por quê |
|---|---:|---:|---:|---|
| Fit estrutural | 83,3 | 0,25 | 20,8 | 3 de 3 critérios casaram; 1 por PROXY, que conta meio ponto |
| Recência | 100 | 0,15 | 15,0 | Lote de 18 dias contra promessa mensal |
| Evidência da tese | 42,9 | 0,20 | 8,6 | 3 critérios observáveis contra 2 **indisponíveis**, que pesam dobrado |
| Qualidade das fontes | 50,0 | 0,15 | 7,5 | 1 de 2 fontes `viva` — fonte fora do ar não entrega E1 |
| Confiança da inferência | 45,0 | 0,10 | 4,5 | 1 proxy (−25) e 2 lacunas de fonte (−15 cada) |
| Intensidade do sinal | 20 | 0,15 | 3,0 | 1 evento; teto de 60 porque um sinal não é corroboração |
| | | | **59** | |

Cada dimensão grava a **própria justificativa** no banco. Seis números sem
explicação seriam decomposição de fachada.

### A cadeia de evidência

| # | Camada | Fonte | Conf. | Afirmação |
|---|---|---|---:|---|
| 1 | DADO | RFB-CNPJ | 0,95 | CNAE de indústria de transformação: `1351100` |
| 2 | DADO | RFB-CNPJ | 0,95 | Situação cadastral ativa: `02` |
| 3 | INFERÊNCIA | RFB-CNPJ | 0,50 | Faixa de porte declarada: `03` |
| 4 | **SINAL** | RFB-CNPJ | 0,90 | Evento `porte_alterado`: **01 → 03** |
| 5 | INFERÊNCIA | CCEE-CL | **0,00** | Consumo livre de energia: **NÃO OBSERVADO** |

**A linha 5 é a mais importante.** A ausência entra na cadeia com confiança
zero, em vez de sumir dela. Uma ficha que omite o que não olhou parece mais
completa do que é.

### E a ficha argumenta contra si mesma — **6 razões contra 5 nós de evidência**

`sinal_isolado` · `documentacao_provavelmente_ausente` ·
`porte_incompativel_com_custo` · `capacidade_de_utilizacao_duvidosa` ·
`fonte_degradada` · `precedente_desfavoravel`

> ⚠️ **Sobre esta ficha, com todas as letras:** ela veio da **versão 2** da
> T-04, um recorte NACIONAL sem filtro de UF nem de porte, marcado `segmentada`
> e não `ativa`. Existe para exercitar o motor sobre bytes reais. **Não é tese
> de venda e esta empresa não deve ser abordada.** A tese comercial é a v1
> (MT/GO), e ela produziu zero — que é o assunto do §0.

### O número que salta

O EV bruto é R$ 200.000 (piso da faixa do catálogo). O líquido é **R$ 6.000**:

```
200.000 × 0,25 (elegibilidade) × 0,60 (homologação) × 0,70 (prazo) = 21.000
21.000 − 15.000 (custo de documentação) = 6.000
```

**O custo de documentação come 71% do valor esperado.** No piso da faixa, a T-04
mal paga o próprio trabalho. Todos esses números são `HIPÓTESE v0` — mas a
estrutura do cálculo é a que vai valer, e ela mostra onde a tese vive ou morre.

---

## 2. TRÊS DEFEITOS MEUS, ENCONTRADOS MEDINDO

### 1 · A caçada não terminava — e eu ataquei a coisa errada primeiro

Primeira execução: **cancelada aos 12 minutos.** Diagnostiquei o critério de
CNAE (24 `LIKE` por linha × 4,75 M) e consertei na `0016`. Rodou de novo:
**11 minutos.**

Em vez de adivinhar uma terceira vez, decompus e cronometrei:

```
filtro do alvo, sozinho ......... 4,0 s → 5.166 linhas
a caçada inteira ................ > 11 min
```

O filtro nunca foi o problema.

### 2 · O JOIN não dizia o conjunto

`aux.coleta_id = X AND aux.chave_natural = left(alvo.chave, 8)` — faltava
`aux.conjunto = 'empresas'`. Sem isso o índice
`(source_id, conjunto, chave_natural, …)` fica com as colunas da frente livres,
o planejador o descarta e junta milhões de linhas por hash.

### 3 · O ALVO também não dizia — e este é o grave

O alvo era filtrado só por `coleta_id`. **Passou nos testes por acidente:**
`carregarArquivoLocal` cria uma coleta por arquivo, então coleta e conjunto
coincidiam.

Mas `executarColeta` — o coletor de **produção** — carrega empresas,
estabelecimentos e simples na **mesma coleta**. Ali `coleta_id = X` casa com os
três conjuntos, e a caçada compararia o CNAE de um estabelecimento com o payload
de uma linha de `simples`.

Não daria erro. Daria **candidato errado, em silêncio**. É o ponto cego que a
casa já tem registrado: *dois caminhos para a mesma coisa, e só um deles
testado.*

**Resultado dos dois consertos: 12 min → 7,5 s.**

### 4 · Bônus — a busca da tese devolvia a versão errada

No minuto em que a T-04 ganhou uma v2 de demonstração, `versaoAtivaDaTese`
passou a devolvê-la no lugar da comercial: ela ordenava só por versão. Em
produção teria trocado a tese que se vende pela tese que existe para testar —
sem erro, com a ficha saindo bonita. **O teste de integração pegou na hora.**
Agora `ativa` ganha de `segmentada`, sempre.

---

## 3. O QUE FICOU DE PÉ

**O pipeline está inteiro:**

```
✓ coleta   onda 2   IMPLEMENTADA
✓ diff     onda 2   IMPLEMENTADA
✓ caca     onda 3   IMPLEMENTADA
✓ score    onda 3   IMPLEMENTADA
✓ publica  onda 3   IMPLEMENTADA
```

**Migrations 0013–0018.** A T-04 inteira como **dado**: critérios, pesos por
versão de tese, componentes de EV, e as regras do "por que não perseguir".
Nenhum CNAE, nenhuma UF, nenhum peso aparece no código — refinar a tese na
leitura conjunta com o design partner é `UPDATE` de linha, nunca deploy.

**A lei que a onda criou:** candidato sem evento **não vira ficha** — o banco
recusa. É a fronteira entre o FARO e uma lista de empresas que batem num filtro.

**Guardas 7 → 8.** A 08 prova a recusa, e prova que pesos de tese somam 1. O CI
ganhou a mutação: sabota a recusa e exige que a guarda pegue.

**Testes: 21 de integração** contra Postgres real (11 novos da caça) + 17 de
unidade do parser + 12 de domínio. Todos verdes.

---

## 4. CUSTO MEDIDO

| | |
|---|---:|
| Linhas carregadas | 13.743.155 |
| Varredura inicial (perfil, 4,75 M estabelecimentos) | **7,5 s** → 82 candidatos |
| Caçada incremental | **7,2 s** → 0 candidatos |
| Caçada incremental (recorte nacional) | **10,2 s** → 1 candidato |
| Publicação de 1 ficha | **150 ms** |
| Computação total registrada no ledger | 651.531 ms |

> ❔ **O custo em dinheiro continua NÃO MEDIDO.** `custo_centavos` é `NULL` no
> ledger, e NULL significa não medido — nunca zero. O que existe agora é a
> matéria-prima: tempo por caçada e por ficha, gravado a cada execução.

🟡 **ESTIMATIVA de caçada sobre a base inteira:** a varredura escala com o
tamanho da fonte, não com o da resposta — 7,5 s para 4,75 M sugere **~2 min para
73,6 M**. Isso é aceitável para um batch de madrugada. A saída estrutural
(índices por campo de tese, ou uma projeção dos campos que as teses realmente
leem) fica **declarada como obra de outra onda**, não descoberta em produção.

---

## 5. O QUE ESTE RELATÓRIO NÃO PODE AFIRMAR

- ❔ **Nada sobre a CCEE.** Re-testada hoje: **HTTP 403**. Zero linha lida.
- ❔ **Nenhuma ficha foi julgada.** O Tribunal é Onda 4; nenhum ser humano olhou
  a ficha ainda, e o ground truth que calibraria as probabilidades não existe.
- 🟡 **Todo número de EV é `HIPÓTESE v0`** com o piso das faixas do catálogo.
- 🟡 **A cadência de ~0,06 ficha/mês** vem de UM par de lotes e UM tipo de
  evento. Com `cnae_alterado` e `situacao_cadastral_alterada` — ~5× mais
  frequentes — o número sobe. Mas esses exigem diff de **estabelecimentos**, que
  só roda sobre a base inteira (o freio de churn recusa recorte, e recusa com
  razão).
- ❔ **A ficha nunca foi vista numa tela.** Onda 4.

---

## 6. ADJACENTE — o que apareceu do lado

**O caminho para a T-04 ter cadência já está no banco.** Os tipos de evento
`cnae_alterado` (237 no recorte) e `situacao_cadastral_alterada` (1.728) são
~5× mais frequentes que `porte_alterado` e — melhor — moram no **mesmo
conjunto** que o alvo da tese. Não falta código: falta a carga completa, porque
o freio de churn corretamente recusa diferenciar recortes.

Ou seja: **a decisão de retenção + a carga completa não são só infraestrutura.
São o que dá cadência à primeira tese.** Isso muda a prioridade delas.

**Uma tese pode cruzar dois conjuntos, e isso ficou barato.** A T-04 já lê
`estabelecimentos` e `empresas` juntos. A estrutura aceita a terceira (`simples`)
sem mudança de código — o que abre `entrou_simples`/`saiu_simples` como sinal de
mudança de regime, que é matéria-prima direta de tese tributária.
