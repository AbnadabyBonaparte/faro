# T-04 v1.1 — o território vira peso, e a cadência entra na venda

> Missão curta · 19/08/2026 · branch `faro/t04-v1-1` · main `6892e25`
> Nenhum CNPJ real neste documento. O repo é público.

---

## 0. MANCHETE

A T-04 saiu de **0,06 ficha por mês** para **~1 por mês** — 15× — porque o
território deixou de cortar e passou a pontuar. Continua longe das 7 fichas que
o Pro promete, e é por isso que a franquia passou a ser **por cliente, somando
teses**, e o Censo Prévio passou a mostrar a **cadência estimada antes do
aceite**. Tese de baixa cadência agora é diagnóstico declarado na venda, nunca
surpresa depois de paga.

---

## 1. O QUE MUDOU NA TESE

| | v0 (versão 1) | **v1.1 (versão 3)** |
|---|---|---|
| CNAE industrial | critério (corta) | critério (corta) |
| Situação ativa | critério (corta) | critério (corta) |
| Porte 05 | critério · PROXY | critério · PROXY |
| **MT/GO** | **critério (corta)** | **bonificador (pontua)** |

### A mecânica nova: bonificador

Critério **corta**; bonificador **pontua**. Os dois são dado da tese, com a
mesma forma, e o motor trata a diferença. Sem isso, "priorizar MT/GO" viraria um
`if` no código — e a próxima preferência comercial viraria outro.

O bonificador vale **até 20 dos 100 pontos** de `fitEstrutural`. O teto é
deliberado: **preferência comercial ORDENA a fila, nunca decide se o alvo
serve.** Quem decide isso é o critério.

> Isto separa duas perguntas que estavam misturadas num filtro só:
> *"esta empresa serve para a tese?"* (critério) e *"esta empresa é prioritária
> para nós?"* (preferência). Misturá-las jogava fora alvos bons por um motivo
> que era de conveniência comercial, não de aderência.

Provado no teste de integração: MT pontua **exatamente 20 pontos** acima de SP,
e SP **continua elegível**.

---

## 2. A MEDIÇÃO — v0 × v1.1, mesma amostra real

Recorte de 1/10 da base: 4.753.435 estabelecimentos e 4.494.860 empresas, lotes
reais de 2026-07 e 2026-08 da Receita Federal.

| | v0 (MT/GO) | **v1.1 (nacional)** |
|---|---:|---:|
| Alvos no recorte | 82 | **1.230** |
| Alvos na base inteira 🟡 | 820 | **12.300** |
| Candidatos com evento | 0 | 0 |
| Fichas geradas | 0 | 0 |
| Tempo da varredura | 7,5 s | **8,0 s** |

**15× mais território pelo mesmo custo de máquina.**

### Por que ainda deu zero neste recorte

Existe **um único** evento que cai sobre indústria ativa em todo o recorte — e
ele é de uma empresa de **porte 03** (EPP). A T-04 exige porte **05**. O motor
recusou corretamente: a tese funcionou, não havia o que entregar.

Não é falha do recorte nem da v1.1. É a raridade do evento aparecendo em 1/10 da
base.

---

## 3. A CADÊNCIA — método declarado

**Método:** `alvos no território × taxa de evento medida nos lotes`.
Faixa, não número exato. Recalculável a cada lote.

### As taxas, medidas nos lotes de julho e agosto

| Evento | Ocorrências | Universo | Taxa/mês |
|---|---:|---:|---:|
| `porte_alterado` (empresas) | 351 | 4.494.860 | **0,0078%** |
| `cnae_alterado` (estabelec.) | 237 | 497.314 | **0,0477%** |
| `situacao_cadastral_alterada` | 1.728 | 497.314 | **0,3475%** |
| **Soma** | | | **0,4029%** |

> O universo de 497.314 é a interseção dos dois lotes de estabelecimentos — as
> chaves presentes nos dois. É o denominador certo para taxa de **mudança de
> campo**: o artefato de reparticionamento da RFB (89,5% de churn aparente,
> `ONDA-2-JAZIDA.md` §0) afeta eventos de presença, não de campo.

### A cadência estimada 🟡

| | só com `porte_alterado` | **com todos os eventos** |
|---|---:|---:|
| T-04 **v0** (820 alvos) | 0,06 ficha/mês | 3,30 ficha/mês |
| T-04 **v1.1** (12.300 alvos) | **0,96 ficha/mês** | **49,56 ficha/mês** |

**Duas leituras saem daqui, e a segunda é maior que a primeira:**

**1 · A v1.1 resolveu a inviabilidade.** De uma ficha a cada 16 meses para ~1 por
mês. A T-04 deixou de ser tese impossível e virou tese de baixa cadência — que é
vendável, como Caçada avulsa ou somada a outras.

**2 · O que destrava a tese de verdade não é o recorte: são os EVENTOS DE
ESTABELECIMENTO.** Habilitá-los leva a T-04 de ~1 para **~50 fichas/mês** — 51×.
E eles dependem do diff da base inteira, porque o freio de churn recusa
diferenciar recortes (e recusa com razão).

> 🔴 **Isso muda de novo a prioridade da carga completa.** Na Onda 3 eu disse que
> ela deixara de ser "só infraestrutura". Agora está quantificado: ela é a
> diferença entre uma tese que entrega 1 ficha/mês e uma que entrega 50.

---

## 4. O QUE MUDA NA VENDA

### O Censo Prévio ganhou a segunda métrica

`RITUAL-DO-ACEITE.md` §2.3, emenda de 19/08:

> **Território estimado:** entre 10.000 e 15.000 empresas compatíveis.
> **Cadência estimada:** esta tese deve parir **~1 ficha por mês**.
>
> *Método: eventos históricos × território. Faixa, não número exato.*

Território e cadência respondem perguntas diferentes: *"o lago tem peixe?"* e
*"o peixe passa pela rede?"*. O censo só respondia a primeira, e a T-04 v0 é a
prova viva de que isso não basta — dez mil alvos parados não alimentam ninguém.

**A cadência aparece antes do aceite e se repete no aceite.** Métrica que
informa a decisão e some do acordo é métrica que ninguém pode cobrar depois.

**Cadência baixa não impede a venda — muda o que se vende:** alta → assinatura;
baixa → Caçada avulsa ou tese somada a outras; quase nula → o sistema recusa,
como já recusa território magro.

### A franquia é POR CLIENTE

Também emendado no `MODELO-DE-NEGOCIO.md` §D.0: as 7 fichas do Pro e as 15 do
Escritório são a **soma de todas as teses vivas**, nunca a promessa de cada uma.

O Pro dá 3 teses. Se cada uma parir ~1 ficha/mês, o assinante recebe ~3 — abaixo
da franquia, e isso é normal. **Franquia é teto de consumo, não piso de
entrega.** Prometer 7 por tese seria prometer 21, e nenhuma medição sustenta
isso.

> O que o vendedor diz: *"o plano comporta até 7 fichas no mês, somando suas
> teses; estas três, pela cadência medida, devem parir cerca de N."* As duas
> frases juntas. A primeira sozinha é promessa; a segunda sozinha é desânimo.

---

## 5. CONTRA-PROVA

| | |
|---|---|
| Guardas 01–08 | ✅ todas verdes contra Postgres 16 real |
| Testes de integração | ✅ **22/22** (um novo: o bonificador vira ponto) |
| Testes de unidade | ✅ 17 (parser) + 12 (domínio) |
| typecheck · build | ✅ ✅ |
| Guarda de escopo | ✅ `apps/maquete` **intocada** — reprovaria se eu tocasse |
| CNPJ real em commit ou PR | **nenhum** |
| Fontes novas · Supabase | **nenhuma** — tudo local, como a ordem mandou |

**A v1 não foi editada.** A v1.1 é versão nova (`versao = 3`), como manda a lei
das teses versionadas: fichas já publicadas continuam apontando para a versão
que as gerou.

---

## 6. O QUE ESTE DOCUMENTO NÃO PODE AFIRMAR

- 🟡 **Toda cadência é `ESTIMATIVA`**, com o método na §3. Vem de **um** par de
  lotes; duas medições não fazem uma série.
- 🟡 **A extrapolação ×10** assume que os 10 arquivos da RFB têm territórios
  equivalentes. A Onda 2 mediu que a densidade varia entre arquivos do mesmo
  conjunto (1,9% a 9%) — o erro aqui provavelmente é dessa ordem, não maior.
- ❔ **As ~50 fichas/mês nunca foram observadas.** São o produto de duas taxas
  medidas com um território extrapolado. Só a carga completa confirma.
- ❔ **Nenhuma ficha nova foi gerada nesta missão** — o recorte não tinha evento
  elegível. O pipeline continua provado pela ficha da Onda 3.
- ❔ **CCEE segue bloqueada.** A v1.1 declara a lacuna na cadeia, com confiança 0,
  igual à v0.

---

## 7. DECISÕES DO DONO

1. **Aprovar a T-04 v1.1** — ela já está `ativa` no banco e é a que o catálogo
   devolve. Se o território nacional não servir ao design partner, o caminho é
   uma v1.2 com o bônus mais pesado, não voltar ao corte.
2. **A carga completa virou o item de maior alavanca do projeto**: ~1 → ~50
   fichas/mês. Depende da decisão de retenção (~95,6 GiB por coleta).
3. **Agendar a leitura conjunta com o design partner** — os parâmetros da T-04
   continuam `HIPÓTESE`, e a v1.1 só mudou o recorte.
4. **Merge.**
