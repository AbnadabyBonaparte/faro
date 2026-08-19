# ONDA 2 — A JAZIDA VIVA

> Relatório de bordo · 19/08/2026 · PR #2, mesclado
> Atualizações posteriores ao merge entram por PR próprio e ficam datadas no
> corpo — um relatório que muda sem dizer que mudou não é relatório.
> A Regra de Pedro vale para este relatório: ele responde com prova, traz o
> adjacente, argumenta contra si mesmo, e deixa carga reservada esperando o
> "pode fechar" do dono.

---

## 0. O QUE ESTA ONDA DESCOBRIU (leia isto se ler só uma coisa)

O diff entre dois arquivos **reais** da Receita Federal —
`Estabelecimentos1` do lote de julho contra `Estabelecimentos1` do lote de
agosto — devolveu:

```
estabelecimento_novo   4.256.121
saiu_da_fonte          4.256.121
cnae_alterado                237
situacao_cadastral_alterada 1.728
```

Os dois primeiros números são **idênticos** e valem **89,5% do arquivo**.

Nenhuma empresa nasceu. Nenhuma empresa fechou.

A RFB **reparticiona quais CNPJs caem em qual dos 10 arquivos a cada lote**.
`Estabelecimentos1` de julho e `Estabelecimentos1` de agosto são recortes quase
disjuntos da mesma base: das 4.753.435 chaves de cada um, apenas **497.314
(10,5%)** estão nos dois.

**A lei operacional que sai daqui: o diff só pode rodar sobre a fonte INTEIRA,
nunca sobre um recorte dela.**

Um piloto "com amostra, para economizar" teria entregue 4,2 milhões de
"estabelecimento novo" falsos no primeiro dia. O assinante cancelaria no
segundo — e teria razão.

Isto não virou um aviso na documentação. Virou **freio no banco** (migration
`0012`): o diff conta quantas chaves apareceram e sumiram **antes de inserir
qualquer coisa**, e se passar do limite declarado da fonte ele para, não grava
nada, e registra a recusa em `fontes.saude_coleta`. Guarda 07 reconstrói o
defeito em miniatura e exige que o banco recuse.

---

## 1. AS DUAS FONTES DO MVP — o que foi provado, e como

### 🟢 RFB — CNPJ Base Aberta · **VIVA**

| | |
|---|---|
| Como se chega | WebDAV num **Nextcloud**, share público `gn672Ad4CF8N6TK` |
| Endereço real | `PROPFIND https://arquivos.receitafederal.gov.br/public.php/webdav/Dados/Cadastros/CNPJ/{AAAA-MM}/` |
| Autenticação | Basic, com o **token do share como usuário** e senha vazia |
| Resposta | HTTP **207 Multi-Status**, 36 arquivos por lote |
| Lotes disponíveis | `2023-05` até `2026-08` |
| Licença | Dados abertos — Lei 12.527/2011 e Decreto 8.777/2016 |

**Por que isto merece registro:** os caminhos "óbvios" da documentação antiga
devolvem **404**, o que faz a fonte parecer morta estando viva. Quem tentar
`https://arquivos.receitafederal.gov.br/dados/cnpj/...` conclui que a fonte
caiu. Ela não caiu — mudou de casa.

**Arquivos baixados e conferidos byte a byte:**

| Arquivo | Bytes | sha256 |
|---|---:|---|
| `2026-07/Empresas1.zip` | 77.888.891 | `c6ba8c4407ef41ccd74ae990ac980a634852edeb461b24d98173ca1245e0bbe5` |
| `2026-08/Empresas1.zip` | 77.892.906 | `9742b081739427f47a6070271ff3daaddb3a757b2fe1a1f8f5c3f281c262463b` |
| `2026-07/Estabelecimentos1.zip` | 341.578.424 | `1f87913146d7af0e799b94e48597c57d4b35995c8097d2973cf90c01f8200152` |
| `2026-08/Estabelecimentos1.zip` | 341.753.658 | `f0eeb22e5d6dd22d8038cb0a501535c605d987cceff106cd6fc994ccceba21cd` |
| `2026-07/Simples.zip` | 299.744.806 | tamanho conferido contra a listagem |
| `2026-08/Simples.zip` | 302.289.129 | tamanho conferido contra a listagem |

### ⛔ CCEE — consumidores livres · **INDISPONÍVEL**

HTTP **403** em `dadosabertos.ccee.org.br` e em `www.ccee.org.br`, com
User-Agent de navegador e sem ele. A página devolvida é **da própria CCEE**,
não uma negação genérica de CDN:

> "O acesso foi bloqueado por não atender às políticas de segurança da CCEE.
> Recomendamos que seu time de Segurança/TI analise as chamadas HTTPS/API e
> verifique sua aderência às boas práticas aplicáveis. Persistindo dúvidas,
> abra um chamado na CCEE informando o Error Code e o IP exibidos nesta
> mensagem."
>
> Error Code `0.aa2b3417.1787140361.93c660e` · IP de origem `160.79.106.136`
> · 0800 591 4185 · atendimento@ccee.org.br

**Nenhum contorno foi tentado, e nenhum deve ser.** Burlar bloqueio de
segurança declarado por um órgão não é engenharia, é passivo — e o FARO vende
procedência. O desbloqueio é **ato administrativo**: abrir o chamado com o
Error Code e o IP. Isso é clique do dono, não linha de código.

A CCEE **entrou no registry mesmo assim**, com `status = 'indisponivel'`, o
bloqueio gravado em `fontes.saude_coleta` e o fallback declarado. Registry que
só aceita fonte boa não é registry, é vitrine. E o motor **recusa** coletar de
fonte `indisponivel` — provado em teste.

> ❔ **NÃO VERIFICADO:** nenhuma linha da CCEE foi lida. Tudo que o canon diz
> sobre consumidores livres continua sem lastro de dado até o chamado ser
> aberto e respondido.

---

## 2. O LAYOUT — conferido contra bytes, não contra documentação

| Conjunto | Membro do zip | Colunas | Linhas | Conferido |
|---|---|---:|---:|---|
| `empresas` | `K3241.K03200Y1.D60711.EMPRECSV` | 7 | 4.494.860 | ✅ campo a campo |
| `estabelecimentos` | `K3241.K03200Y1.D60711.ESTABELE` | 30 | 4.753.435 | ✅ campo a campo |
| `simples` | `F.K03200$W.SIMPLES.CSV.D60808` | 7 | — | ⚠️ nome do membro conferido; colunas da documentação |

Formato real: `;` como delimitador, **todos** os campos entre aspas duplas,
sem cabeçalho, encoding **latin1** (não UTF-8).

Linha real, do primeiro registro de `empresas`:

```
"00000000";"BANCO DO BRASIL SA";"2038";"10";"120000000000,00";"05";""
```

**Achado que teria quebrado o coletor:** o membro do zip do Simples se chama
`F.K03200$W.SIMPLES.CSV.D60808` — o identificador fica no **meio** do nome, não
no fim. Casar por sufixo (como os outros dois permitiriam) teria falhado em uma
fonte de três. O padrão em `fontes.layouts.padrao_arquivo` é **substring**, e
isso está escrito na coluna.

**Achado de ausência:** `Cnaes.zip` **não existe** nos lotes `2026-07` nem
`2026-08`. Não foi decisão nossa de não ingerir — o arquivo não estava lá. Está
declarado em `campos_disponiveis.ausentes_no_lote_observado`.

**O que NÃO é ingerido, declarado:** `Socios0..9.zip` (~680 MB/lote, nenhuma
tese do MVP depende dele), `Municipios`, `Naturezas`, `Paises`,
`Qualificacoes`, `Motivos` (tabelas de domínio, sem uso enquanto a ficha não
traduzir códigos). Silêncio vira promessa; por isso está escrito no registry.

---

## 3. PROVA DUPLA DO DIFF (a ordem pediu as duas)

### (a) Fixture sintética — guarda 05, roda no CI

Duas coletas fabricadas com mudanças conhecidas. A guarda **não pergunta "veio
evento?"** — exige a contagem exata, tipo a tipo:

```
porte_alterado               1
cnae_alterado                2
situacao_cadastral_alterada  2
estabelecimento_novo         1
saiu_da_fonte                1
entrou_simples               1
saiu_simples                 1
```

Um evento a mais reprova igual a um a menos: ninguém paga para receber ruído.

A fixture tem uma **armadilha**: o CNPJ `11111111` existe em `empresas` **e** em
`simples` com a mesma chave. O teste de mutação sabota o diff para ignorar o
conjunto e a guarda pega — `porte_alterado` sobe de 1 para **3**. Sem a
separação por conjunto, o motor cruzaria a linha de Empresas com a do Simples
da mesma empresa e pariria evento a cada coleta, para sempre.

### (b) Amostra real — 4,49 milhões contra 4,49 milhões

```
$ motor diff <coleta-agosto>
{ "eventos": { "porte_alterado": 351 }, "duracaoMs": 45230 }
```

**Contraprova independente**, sem tocar no banco nem no motor — `awk` cru sobre
os dois CSVs:

```
$ awk -F'";"' 'NR==FNR{a[substr($1,2)]=$6; next}
               {k=substr($1,2); if (k in a && a[k]!=$6) n++} END{print n}' \
      <(unzip -p Empresas1-2026-07.zip) <(unzip -p Empresas1-2026-08.zip)
351
```

**351 = 351.** Duas implementações independentes, o mesmo número.

Distribuição real das 351 mudanças (códigos da RFB: `01`=ME, `03`=EPP,
`05`=demais):

| de → para | quantas |
|---|---:|
| 01 → 03 | 172 |
| 03 → 05 | 70 |
| 01 → 05 | 53 |
| 05 → 03 | 31 |
| 05 → 01 | 15 |
| 03 → 01 | 10 |

242 empresas cresceram de faixa em um mês, 56 encolheram. **É exatamente o tipo
de sinal em cima do qual o FARO se propõe a existir** — e ele está aqui, medido,
não prometido.

> ⚠️ **O que esta amostra NÃO prova.** `Empresas1` é **um** dos dez arquivos, e
> a §0 mostrou que os arquivos são recortes móveis. Os 351 são reais **dentro do
> recorte**, mas o número do lote inteiro não é 3.510: empresas entram e saem do
> recorte entre lotes. Só a carga completa dá o número do Brasil.

---

## 4. DEFEITOS ENCONTRADOS PELOS PRÓPRIOS TESTES

Todos antes de existir cliente. Todos com correção e teste que os defende.

**1 · O diff rodado duas vezes duplicava os eventos.**
Um retry do batch — a coisa mais banal que acontece às 3h da manhã — dobraria a
notícia na cara do assinante. Corrigido com `eventos.execucoes_diff`: o par de
coletas só se diferencia uma vez, e a segunda chamada devolve o mesmo resultado
sem inserir.

**2 · A carga local falhava sem rebaixar a fonte.**
Havia dois caminhos de fracasso (rede e arquivo local) e só um deles tratava
`LayoutDivergente`. Dois jeitos de fracassar é ter um que ninguém testa.
Unificados em `abortar()`.

**3 · O freio de churn apagava o próprio registro.**
A primeira versão levantava exceção depois de gravar a recusa em
`saude_coleta` — e a exceção desfazia o INSERT. O freio parava o diff e apagava
a prova de que parou. Lote recusado em silêncio é lote que ninguém investiga.
Agora o freio **retorna** uma linha `freio_de_churn` em vez de explodir: a
recusa fica gravada, e quem ignorar o retorno recebe **zero evento**. Fail-safe
vale mais que fail-loud quando o barulho custa o registro.

**4 · As guardas 03 e 04 sujavam o banco.**
Elas fabricavam tenant, fonte e coleta e deixavam tudo lá. A guarda 06 reprovou
por sujeira alheia. A ordem de execução das guardas tinha virado dependência
invisível. Agora as duas provam dentro de transação e desfazem.

**5 · O piso do freio de churn.**
Percentual sobre lote pequeno não é sinal: numa coleta de 11 linhas, duas
novidades já são 18%. Sem piso, o freio reprovaria todo teste e toda fonte
pequena — até alguém desligá-lo. Freio que atrapalha vira freio desligado.
`piso_churn` é 1000 linhas por padrão.

---

## 5. O QUE FICOU DE PÉ

**Migrations `0010`–`0012`** (as nove da Onda 1 continuam intactas):

- `0010` — as duas fontes no registry com ficha completa · partições da jazida ·
  `fontes.layouts` (layout declarado, com data de conferência contra bytes) ·
  os 8 tipos de evento do MVP · `jazida.coletas_fechamento` + view
  `coletas_completas` · `uso.ledger` aceitando custo da casa sem tenant ·
  coluna `conjunto` na jazida
- `0011` — `eventos.regras_diff` e `regras_presenca` (regra é **dado**, não
  `if`) · `eventos.execucoes_diff` · a função `eventos.diferenciar`
- `0012` — o freio de churn

**`@faro/motor`** — coleta e diff saíram de stub:

```
✓ coleta   onda 2   IMPLEMENTADA
✓ diff     onda 2   IMPLEMENTADA
· caca     onda 3   stub declarado
· score    onda 3   stub declarado
· publica  onda 4   stub declarado
```

- download resumível (Range + recuo exponencial) com sha256 e **recusa de
  arquivo truncado** — arquivo cortado entraria na jazida como se empresas
  tivessem sumido
- leitor de CSV com máquina de estados: o `;` dentro de campo existe, e em 60
  milhões de linhas o caso raro acontece milhares de vezes
- parser confere o layout em **toda linha** (não só na primeira) e o **nome do
  membro** do zip; divergência **para a coleta** e rebaixa a fonte
- carga por `COPY FROM STDIN`, sem driver npm
- `jazida.coletas` é append-only, então não existe "marcar como pronta": o
  fechamento é linha nova, e só coleta fechada com `ok` aparece para o diff
- o diff **vive em SQL**, onde os dados estão: uma implementação só. Se o
  TypeScript tivesse a sua cópia, um dia as duas discordariam — e quem
  descobriria seria o assinante

**Guardas: 4 → 7.** Todas contra Postgres 16 de verdade, todas no CI, todas com
mutação que prova que reprovam.

| | |
|---|---|
| 05 | o diff pare **exatamente** os eventos esperados |
| 06 | o registry não promete o que não tem (partição, fallback, layout, e **campo de regra que existe no payload**) |
| 07 | o freio de churn segura — e churn normal de 1% continua passando |

A guarda 06 pega o defeito mais silencioso da lista: uma regra apontando para
campo inexistente **nunca dá erro**. Ela só nunca dispara, e o produto passa
meses prometendo um evento que não nasce.

**10 testes de integração** contra Postgres real + **17 de unidade** do parser,
com bytes fabricados. Nenhum job do CI bate na Receita Federal: CI que depende
de fonte externa fica vermelho pelo dia ruim de outra pessoa, e aí alguém
aprende a ignorar o vermelho.

---

## 6. CUSTO DA CARGA COMPLETA

### O que foi MEDIDO (não estimado)

| | |
|---|---:|
| Lote mensal inteiro | **7,16 GiB** comprimidos, 36 arquivos |
| Conjuntos ingeridos | 6,52 GiB (91% do lote) |
| Não ingeridos | 0,64 GiB |
| Carga de 4.494.860 linhas de `empresas` | **138,6 s** e **148,0 s** (duas execuções) |
| Carga de 4.753.435 linhas de `estabelecimentos` | **259,1 s** e **278,4 s** |
| Vazão | **31 k linhas/s** (empresas) · **18 k linhas/s** (estabelecimentos) |
| Disco por linha, com índices | **465 B** (empresas) · **803 B** (estabelecimentos) |
| Jazida com 18.496.590 linhas | **11 GB** (7.019 MB heap + 3.786 MB índices) |
| Diff 4,49 M × 4,49 M | **45 s** |
| Idempotência (recarga do mesmo lote) | **0,19 s**, zero linha nova |

### O que era ESTIMATIVA — e virou medição

A primeira versão deste relatório extrapolava tudo por bytes comprimidos e
avisava que o número provavelmente estava alto. Em vez de deixar o aviso, fui
medir. Os arquivos `0` de cada conjunto são os únicos que a extrapolação não
cobria bem (`Empresas0` é 7× os outros nove; `Estabelecimentos0` é 6×), então
são exatamente esses dois que estão sendo contados linha a linha.

#### ✅ `empresas` — MEDIDO

| | |
|---|---:|
| `Empresas0` — membro `K3241.K03200Y0.D60808.EMPRECSV` | **29.069.564 linhas** (medido) |
| `Empresas1..9` — extrapolado da densidade de `Empresas1` | ~47,08 M |
| **Total `empresas` por coleta** | **~76,15 M** |

**A extrapolação errou 3,7% para cima** (previa 79,0 M). Errou porque
`Empresas0` comprime melhor: 52.592 linhas/MB contra 57.706 de `Empresas1` —
9% de diferença de densidade entre arquivos do mesmo conjunto.

> ✏️ **CORREÇÃO DE UMA AFIRMAÇÃO MINHA.** A versão anterior deste relatório
> dizia que 79 M "é maior que a base de CNPJs conhecida do país". **Eu não
> verifiquei isso.** Era palpite com cara de fato — exatamente o que a Lei 7
> proíbe, escapando dentro do próprio parágrafo em que eu me gabava de aplicá-la.
> A frase saiu. O que sobra é o que dá para sustentar: a extrapolação errou
> 3,7% para cima, e a razão é a diferença de densidade entre os arquivos.

#### ✅ `estabelecimentos` — MEDIDO

| | |
|---|---:|
| `Estabelecimentos0` — membro `K3241.K03200Y0.D60808.ESTABELE` | **30.008.725 linhas** (medido) |
| `Estabelecimentos1..9` — extrapolado da densidade de `Estabelecimentos1` | ~43,61 M |
| **Total `estabelecimentos` por coleta** | **~73,62 M** |

Aqui a extrapolação errou só **0,8% para cima** (previa 74,2 M): a densidade de
`Estabelecimentos0` é 13.640 linhas/MB contra 13.909 de `Estabelecimentos1` —
1,9% de diferença, muito menor que os 9% que separavam os dois de `empresas`.

**Método das duas contagens**, para poder ser conferido:
`curl -C - -o ARQUIVO URL` e depois `unzip -p ARQUIVO | wc -l`. Contagem de
todas as linhas, não amostragem. Os arquivos foram apagados depois de contados —
o que importa deles é o número, e são 2,7 GB.

#### Totais

| | |
|---|---:|
| `empresas` | 76,15 M |
| `estabelecimentos` | 73,62 M |
| `simples` | 🟡 ~17,4 M (ESTIMATIVA — densidade de `empresas` como proxy) |
| **Linhas por coleta completa** | **~167,2 M** |
| Jazida por coleta | **~95,6 GiB** |
| Jazida com 12 coletas retidas | **~1,12 TiB** |
| Carga sequencial, 1 processo | **~2,0 h** |
| Carga com 4 processos | **~0,5 h** |

Os dois arquivos `0` deixaram de ser extrapolação; `Empresas1..9`,
`Estabelecimentos1..9` e `simples` continuam extrapolados por densidade. Os
bytes por linha (465 para `empresas` e `simples`, 803 para `estabelecimentos`,
com índices) e as vazões (31 k e 18 k linhas/s) são medidos.

> ✏️ **PLACAR HONESTO DA MINHA PRÓPRIA ESTIMATIVA.** Eu tinha estimado 170 M e
> avisado que "provavelmente superestima". O número medido é **167,2 M** — eu
> errei **1,7% para cima**. O aviso estava certo na direção e **exagerado no
> tom**: falei como se o número pudesse estar muito errado, e ele estava quase
> certo. Alarme excessivo também custa: se eu grito a cada número, ninguém
> escuta quando o número realmente for ruim.
>
> O que a medição ensinou de útil não foi o total — foi que **a densidade varia
> entre arquivos do mesmo conjunto** (9% em `empresas`, 1,9% em
> `estabelecimentos`). Extrapolar por bytes funciona, com margem de poucos por
> cento. Registrado para a próxima estimativa não precisar de 40 minutos de
> download para valer.

### O plano de carga — e por que ele não é "roda tudo"

**1 · A primeira coleta não pare evento.** Ela é linha de base. Sem essa regra,
o dia 1 entregaria ~170 milhões de "novidades" que são só o cadastro sendo
visto pela primeira vez. Já está no banco, provado pela guarda 05.

**2 · Carga completa ou nada.** É a lei da §0. O freio de churn (2% para a
RFB) já torna impossível diferenciar um lote parcial contra um completo — o
motor para antes de gravar.

**3 · Retenção declarada antes de encher o disco.** A 97 GiB por coleta, 12
coletas retidas são ~1,17 TiB. A decisão de **quantas coletas se guarda** é
comercial, não técnica, e precisa ser tomada **antes** da primeira carga
completa — depois, apagar coleta é apagar a prova de um evento já publicado, e
a jazida é append-only por lei do canon.

**4 · Otimizações identificadas e NÃO feitas** (com o custo de cada uma):

- `hash` é `text` de 64 caracteres hex. Como `bytea` de 32 bytes, economiza
  ~33 B/linha — **~5,6 GiB por coleta**, ~67 GiB em 12. Não foi feito porque
  troca legibilidade em debug por espaço, e essa troca é decisão do dono.
- `payload` como `jsonb` custa ~128 B/linha em `empresas` e ~283 B em
  `estabelecimentos`. Colunas tipadas cortariam parte disso, mas amarrariam a
  jazida ao formato de hoje — e a jazida existe justamente para guardar o bruto.
- Não há `UNIQUE (source_id, coleta_id, conjunto, chave_natural)`. Custaria
  alguns GB por lote para reprovar o que o `UNIQUE (source_id, hash)` de
  `jazida.coletas` já reprova antes. Está escrito na migration, com a
  contrapartida: a idempotência é de **lote**, não de linha.

**5 · O que ainda não foi medido:** custo em dinheiro. `uso.ledger` grava
volume e duração de cada coleta com `tenant_id` nulo (custo da casa: coleta de
fonte pública é rateada, não vendida), e `custo_centavos` fica **NULL** — que a
coluna declara significar **NÃO MEDIDO**, nunca zero. Escrever 0 ali seria
inventar um número.

---

## 7. CARGA RESERVADA — esperando "pode fechar"

Nada aqui foi feito. Tudo aqui está pronto para ser feito.

| | O que é | Por que parou aqui |
|---|---|---|
| **CCEE** | Abrir chamado com Error Code `0.aa2b3417.1787140361.93c660e` e IP `160.79.106.136` | Ato administrativo. Nenhum contorno técnico é aceitável |
| **Supabase** | Projeto provisionado e as 12 migrations aplicadas | A ordem condicionou ao dono; o repo é o baseline e roda em Postgres puro |
| **Carga completa** | ~170 GiB de disco e ~2 h de CPU por coleta | Depende da decisão de retenção (§6.3) |
| **Vercel** | Deploy da maquete | **BLOQUEADO desde a Onda 1**: HTTP 403 "You don't have permission to create a project", em escopo de time e pessoal. Clique do dono |
| **Layout do Simples** | Conferir as 7 colunas contra bytes reais | O arquivo está baixado; falta a carga, que é grande |
| **`hash` como `bytea`** | ~5,6 GiB/coleta | Troca legibilidade por espaço — decisão do dono |

---

## 8. O QUE ESTE RELATÓRIO NÃO PODE AFIRMAR

Por Lei 7, explicitamente:

- ❔ **Nada sobre a CCEE.** Zero linha lida.
- ❔ **O layout de `simples`** vem da documentação. O nome do membro foi
  conferido; as colunas não.
- 🟡 **Todo número de carga completa é ESTIMATIVA**, com base declarada em §6, e
  provavelmente alta.
- ❔ **Nenhum evento virou ficha.** Caça, score e publicação são Onda 3 e 4, e
  continuam stubs declarados que levantam `EtapaNaoImplementada`.
- ❔ **Nenhum preço foi validado.** A maquete segue com o banner ANTI-QUANTUM e
  os preços marcados como hipótese. A Onda 2 não tocou nela — o CI verifica.
- 🟡 **O freio de churn em 2%** para a RFB é um palpite calibrado sobre um único
  par de lotes. É `limite_churn` no registry justamente para ser corrigido com
  o segundo e o terceiro par, em vez de virar constante esquecida no código.

---

## 9. ADJACENTE — o que apareceu do lado e vale saber

**A RFB tem 39 lotes mensais online**, de `2023-05` a `2026-08`. Isso é uma
série histórica de mais de três anos já publicada. O FARO não precisa esperar
os próximos meses para ter passado: dá para reconstruir 38 diffs mensais e
**testar tese contra história real** antes de vender qualquer coisa. Custo:
~2,7 TiB de jazida se retiver tudo (ESTIMATIVA, §6). Não é para agora — é para
saber que existe.

**Os arquivos `0` de cada conjunto são anômalos** (`Empresas0` é 7× os outros;
`Estabelecimentos0` é 6×). Vale entender por quê antes da carga completa: se
for concentração de registros e não compressão diferente, o paralelismo da
carga precisa levar isso em conta ou um processo vai levar 6× o tempo dos
outros.

**Nenhum dado de cliente entrou no repo.** Nenhum CNPJ de tenant, nenhuma
demanda comercial. Todo dado desta onda é público e oficial. Nenhum nome de
fornecedor de IA aparece em superfície que um dia seja de cliente.
