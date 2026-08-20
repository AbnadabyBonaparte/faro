# A PRIMEIRA CAÇADA REAL DA CASA — T-MED

> 19–20/08/2026 · branch `faro/cacada-t-med` · base `2ad7f45`
> **Nenhum CNPJ real neste documento.** O dossiê com os alvos é entregável de
> negócio e vive fora do git.

---

## 0. MANCHETE

O FARO caçou para a própria casa e achou **7.826 clínicas pequenas** e
**2 fichas publicadas** de recém-chegados. A tese que procura indústria grande e
a tese que procura clínica pequena rodam **no mesmo motor, com a mesma função**
— a inversão inteira aconteceu em dado.

E a corrida real achou **três defeitos que nenhum teste tinha achado**.

---

## 1. A MOLDURA, ANTES DOS NÚMEROS

> 🔴 Caçada executada sobre **amostra local** dos lotes reais de julho e
> agosto/2026 da Receita Federal. A cobertura nacional depende da carga integral
> da jazida.

**A amostra encolheu no meio da corrida, e o motivo importa.** O plano era o
recorte que a própria RFB publica (1/10 da base, arquivo 0). Ele não coube no
disco desta sessão. O que sobrou foi uma **amostra por espaço de chave**: os
600.000 primeiros estabelecimentos do arquivo, mais as empresas correspondentes
**pelas mesmas chaves**.

**Nenhum critério que a tese fosse julgar entrou no recorte.** Filtrar por CNAE
de saúde antes de caçar seria cozinhar o resultado e fotografar a panela.

| | |
|---|---:|
| Estabelecimentos varridos (agosto) | **600.000** |
| Empresas cruzadas (agosto) | **590.572** |
| Fatia do universo nacional | ~**0,8%** — 600 mil de ~73,6 M estabelecimentos |
| Régua da carga completa | ×**123** |

🟡 Os 7.372 estabelecimentos (1,2%) cuja empresa não está no mesmo arquivo do
lote ficam sem cruzamento. É o reparticionamento da RFB agindo **entre
conjuntos**, não só entre meses.

---

## 2. A ESTEIRA — o tempo real desta mineração

| Etapa | Volume | Tempo |
|---|---:|---:|
| Carga · estabelecimentos agosto | 600.000 linhas | **32 s** |
| Carga · empresas agosto | 590.572 linhas | **18 s** |
| **Caçada perfil B** (estoque) | 600.000 × 590.572 | **802 s** |
| Recorte de interseção | 33.633 chaves | 3 s |
| Cargas da interseção (3) | 100.416 linhas | 7 s |
| **Diff julho→agosto** | 33.633 × 33.633 | **963 ms** |
| **Caçada perfil A** (evento) | 421 eventos | **802 ms** |
| Publicação | 2 fichas | **192 ms** |

**Ledger da casa:** `linhas_processadas` = 1.380.380 em 7 lançamentos ·
`ms_computacao` = 865.475 em 11 · `ficha_publicada` = 2.

> A varredura de estoque levou **13 minutos**; o diff levou **menos de um
> segundo**. Isso não é curiosidade técnica: é a Lei do Tempo de Cozinha
> (`MODELO-DE-NEGOCIO.md` §D.5) medida na própria casa. O que custa não é achar
> a mudança — é varrer o que não mudou.

---

## 3. O QUE A CAÇADA ACHOU

### Perfil B — a clínica estabelecida (caça por estoque)

| | |
|---|---:|
| Candidatos | **7.826** |
| Em MT/GO | **452** |
| No quintal (Barra do Garças e vizinhas) | **4** |
| Score mín · mediana · máx | **59,1 · 60,8 · 65,5** |
| Fichas publicadas | **0 — e isso é lei, não falha** |

**Por que zero ficha.** Candidato sem evento não vira ficha: perfil que casa sem
nada ter mudado é **lista**, e o banco recusa
(`0015_score_ev_publicacao.sql`). O estoque é o dia-zero previsto no canon — a
entrega dele é uma **fila ranqueada de candidatos**, não ficha. A guarda 08 não
foi adaptada nem contornada.

### Perfil A — o recém-chegado (caça por evento)

| | |
|---|---:|
| Eventos no diff | **421** — 310 situação cadastral, 111 CNAE |
| Candidatos | **2** |
| **Fichas publicadas** | **2** |
| Scores | **78 e 79** · grade **B** · frescor **ok** |
| EV líquido | **declarado não calculável** |

**O EV vazio é decisão, não bug.** A tese é interna: o retorno não é crédito
tributário, é contrato de Conversion OS — e a casa nunca mediu valor médio nem
taxa de conversão desse contrato. Inventar número para a ficha "ficar completa"
é o vício que a Lei 7 existe para impedir. A ficha carrega
`ev_indisponivel_por` e diz o que falta.

### A ficha do topo, mascarada

```
59.XXX.XXX/XXXX-XX · INS*** (mascarado) · score 65,5 / 100 · perfil B

CNAE 8630503 (atividade médica ambulatorial)  FATO   RFB-CNPJ
situação cadastral 02 (ativa)                 FATO   RFB-CNPJ
porte 03 (EPP)                                PROXY  RFB-CNPJ
início de atividade 2022-02-17                FATO   RFB-CNPJ
preferências: MT/GO (3) · quintal (5) · matriz (2) · capital (1) · natureza (1)

fitEstrutural        90,0   4 critérios casaram, 1 por PROXY; 12 de 12 pontos
                            de preferência atendidos
evidenciaTese        50,0   4 critérios observáveis, 2 INDISPONÍVEIS (peso dobrado)
recencia            100,0   lote de referência com 18 dias
qualidadeFontes      50,0   1 de 2 fontes do registry está viva
intensidadeSinal      0,0   nenhum evento — o perfil casa, mas nada mudou
confiancaInferencia  45,0   1 proxy e 2 lacunas de fonte
```

`intensidadeSinal = 0` é a ficha dizendo a verdade sobre si mesma.

---

## 4. A INVERSÃO DE VERTICAL, PROVADA

| | T-04 (indústria) | **T-MED (clínica)** |
|---|---|---|
| Porte | critério: **05**, fora de ME/EPP | critério: **01/03**, ME/EPP |
| Por quê | só indústria grande tem o crédito | clínica grande já tem agência |
| Peso maior | `evidenciaTese` 0,20 | **`fitEstrutural` 0,35** |
| Honestidade | — | **`confiancaInferencia` 0,20** (dobro) |

**Mesmo campo, mesma função `fichas.cacar`, leitura invertida.** Nenhum
`if tese = 'T-MED'` em lugar nenhum.

🟡 **O que exigiu código, dito sem disfarce:** dois operadores genéricos
(`anterior_a`, `intervalo_numerico`), `capital_social` na ingestão, e `peso`
por bonificador. Nenhum deles sabe o que é clínica. A capacidade cresceu; o
motor continua sem conhecer vertical.

---

## 5. OS TRÊS DEFEITOS QUE SÓ A CORRIDA REAL ACHOU

### 5.1 · A caçada escolhia lote no escuro — `0022`

`fichas.cacar` ordenava por `collected_at DESC LIMIT 1`, e `collected_at` é a
data do **lote**, não da carga. Com três coletas de agosto na jazida, as três
têm o mesmo valor e o `LIMIT 1` devolvia qualquer uma. Sem erro, sem aviso.

**O estrago possível em produção é pior que o desta noite:** uma recarga de lote
corrigido conviveria com o defeituoso, e a caçada poderia varrer o defeituoso —
entregando ficha construída sobre dado que a casa já sabia estar errado.

Conserto: desempate por `fechada_em`.

### 5.2 · Razão de julgamento em enum, em dois lugares — `0023`

A lei diz que razão de julgamento é **dado**. Estava em enum — e não em um, em
**dois** CHECKs que precisavam concordar e não tinham quem os sincronizasse.

Na `0020` eu ampliei o primeiro e **escrevi que era dívida**. A dívida cobrou
juros na mesma noite: a caçada passou, o score saiu, e a publicação morreu no
segundo CHECK. Conserto: tabela `fichas.razoes`, os dois lados apontam para ela.

### 5.3 · O perfil A saía sem nome — `0021`

`fichas.cacar` deriva o conjunto auxiliar dos conjuntos que a tese cita. O
perfil A só citava `estabelecimentos`, e `razao_social` mora em `empresas`. O
candidato saía com CNPJ e sem nome — para um dossiê de ligar, lista de número.

Conserto: **um bonificador a mais na tese**, não um join especial no motor.

---

## 6. O FREIO DE CHURN FUNCIONOU DUAS VEZES

O diff foi recusado duas vezes antes de rodar:

1. **Recorte por `cnpj_basico`** — 17.815 chaves aparecendo/sumindo. A chave
   natural do estabelecimento é `(básico, ordem, dv)`; recortar pelo básico deixa
   os dois lados com contagens diferentes.
2. **Par errado** — o defeito 5.1 fez o diff comparar coletas que eu não quis
   comparar. 4.311 chaves de diferença.

Nas duas vezes o freio disse a mesma coisa: *"lote incompleto, recorte parcial
da fonte, ou a fonte mudou de forma — nenhum dos três é notícia"*. Estava certo
nas duas.

Corrigido o recorte para a **chave inteira** — 33.633 chaves idênticas dos dois
lados — o diff rodou em 963 ms e produziu 421 eventos.

---

## 7. O QUE ESTA CAÇADA NÃO PODE AFIRMAR

- ❔ **Inscrição nova não foi detectada, e não podia ser.** Dos 597.944 CNPJ
  básicos do arquivo 0 de agosto, só **36.421 (6,1%)** aparecem no mesmo arquivo
  de julho. Num recorte, "CNPJ novo" e "CNPJ que mudou de arquivo" são
  indistinguíveis. **Só a carga inteira separa os dois** — e esse é o evento
  principal do perfil A.
- 🟡 **6,1% é piso, não réplica.** A Onda 2 mediu ~10,5% sobre arquivos
  inteiros; eu comparei prefixos. Os números são consistentes, não iguais.
- ❔ **A dor não foi verificada.** Nenhuma fonte pública diz se a clínica tem
  site. O motor entrega **perfil compatível**; quem confirma é conferência
  humana. Está na ficha, em `confiancaInferencia` e no "por que não perseguir".
- 🟡 **Os 4 alvos no quintal são poucos porque a amostra é pequena**, não porque
  o quintal seja magro. Com a base inteira, ×123.
- ❔ **A T-MED continua travada em L6.** Motor pronto não libera prospecção: a
  fronteira B2B do interesse legítimo some no empresário individual, que é
  exatamente o alvo. Ver `DOUTRINA-DO-MINERADOR.md` §4.

---

## 8. CONTRA-PROVA

| | |
|---|---|
| Guardas 01–08 | ✅ todas verdes contra Postgres 16 real |
| Testes de integração | ✅ **22/22** contra banco novo com as 23 migrations |
| Testes de unidade | ✅ 17 |
| `typecheck` · `build` | ✅ ✅ |
| Maquete | **intocada** |
| CNPJ real em git | **nenhum** |
| Dossiê | fora do repo, em `/mnt/user-data/outputs/` |

---

## 9. DECISÕES DO DONO

1. **O que fazer com os 4 alvos do quintal** — são reais, são pequenos, são
   perto. Mas L6 não fechou.
2. **A carga completa** virou item de maior alavanca outra vez: sem ela não há
   evento de inscrição nova, que é o timing de ouro da T-MED.
3. **Merge.**
