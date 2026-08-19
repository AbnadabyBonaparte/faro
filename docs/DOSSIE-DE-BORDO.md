# DOSSIÊ DE BORDO — FARO™
**ALSHAM Global Commerce · consolidado em 19/08/2026 · repo `AbnadabyBonaparte/faro`**

> **O que é este documento.** O briefing único do FARO: gênese, leis, estado exato e plano
> de construção. Escrito para que o dono, a guia e o executor pensem com a mesma ideia desde
> a primeira mensagem. É **consolidação do canon que já existe no repo** — não inventa nada.
>
> **Como ler as marcas de procedência:**
>
> | Marca | Significa |
> |---|---|
> | `[canon: ARQUIVO §X]` | Está escrito no repo, naquele arquivo |
> | `[ORDEM 18/08]` | Veio da ordem do dono de 18/08/2026 e **ainda não tinha doc próprio no canon** — este dossiê é a primeira gravação |
> | `[ORDEM 19/08]` | **Override do dono em 19/08/2026** — a construção do motor começou. Onde esta marca aparece, ela **substitui** o que o canon dizia antes |
> | `[BURACO]` | O canon está em silêncio, em conflito ou em aberto — declarado, não tapado |
> | `ESTIMATIVA` / `NÃO VERIFICADO` | Selo do juiz que produziu o número. **Nunca vira fato.** |
>
> **Lei 7 em vigor:** estado atual só entra com contra-prova (SHA, listagem, rota testada).

---

# §1 — O QUE É O FARO

## A frase

**O FARO ensina o computador a farejar dinheiro parado — e mostra a prova de onde ele está.**

## O parágrafo

O FARO é um SaaS de inteligência de oportunidades comerciais. O assinante descreve uma
**tese** — o perfil exato de empresa que vale dinheiro para ele — e o FARO varre fontes
públicas todo dia procurando **mudanças de estado** que se encaixem nessa tese. Devolve
fichas prontas: a empresa, os sinais observados, a fonte e a data de cada afirmação, um
score decomposto e — o mais importante — **o limite do que se pode concluir**. Não vende
lista de empresas. Vende hipótese de oportunidade com rastreabilidade. A oferta de estreia é
**FARO TAX**, para escritórios e consultores de recuperação tributária.
`[canon: MODELO-FARO-V2.md §1]`

## A página

### O que ele é, tecnicamente

Um **motor de inteligência de oportunidades orientado a TESES**. O assinante não escolhe
filtros num catálogo: ele **parametriza uma hipótese operacional** — CNAE, porte, regime,
UF, sinais exigidos — e essa hipótese fica ligada para sempre, caçando sozinha.
`[canon: MODELO-FARO-V2.md §1]`

### A unidade de valor é o EVENTO

Esta é a decisão conceitual mais importante do produto.

| | Como o v1 pensava | Como o FARO pensa hoje |
|---|---|---|
| Unidade | "Encontrei uma empresa" | **"Encontrei uma mudança"** |
| Natureza | Estoque | Fluxo |
| Consumo | A lista se esvazia | O evento continua acontecendo |
| Economia | Churn de lista | Assinatura legítima |

Exemplos de evento: a empresa abriu filial · mudou de atividade · saiu de determinado regime
· entrou em determinado cadastro · aumentou faixa de empregados · ganhou contrato público.
A cadeia é **evento → tese → oportunidade**. `[canon: MODELO-FARO-V2.md §2]`

### O FILME, não a foto

Uma base de dados entrega o **estado atual** — a fotografia. Qualquer concorrente com
dinheiro compra a mesma foto. O FARO entrega **a mudança de estado** — o filme. É por isso
que a arquitetura é orientada a evento e não a consulta: capturar o momento em que um CNPJ
muda gera um gatilho de urgência que a fotografia nunca gera.
`[canon: MODELO-FARO-V2.md §2; junta/marianas/PARECER-GEMINI.md §3]`

### FARO WATCH é o coração

O Watch não é uma funcionalidade a mais — é o que transforma a entrega em fluxo e o que
justifica a mensalidade sem inventar trava de plano. O assinante monitora uma **tese**, uma
**empresa**, um **mercado** ou um **tipo de evento**. `[canon: MODELO-FARO-V2.md §8]`

Dentro dele mora o **Relógio da Reforma** (§4 deste dossiê), que monitora mudança de
**norma** — porque uma lei que muda também é mudança de estado, só que atinge a carteira
inteira de uma vez. `[canon: MODELO-FARO-V2.md §8.1]`

### As cinco telas

| # | Tela | O que faz |
|---|---|---|
| 1 | **TESES** | Formulário paramétrico. O assinante monta a hipótese sozinho — sem consultoria, sem SQL manual. É isso que separa SaaS de agência disfarçada. |
| 2 | **FILA DE OPORTUNIDADES** | As fichas publicadas, com score decomposto, Evidence Grade, Freshness e os três botões do Tribunal Magro. |
| 3 | **FICHA ABERTA** | O Evidence Graph: empresa → dados → sinais → fontes → tese → conclusão. Fonte e data em cada linha. Campo de limite de inferência. |
| 4 | **WATCH** | Feed de eventos ligados a teses. |
| 5 | **PAINEL DA TESE** | Funil: fichas → aprovadas → abordadas → reuniões → propostas. |

`[canon: MODELO-FARO-V2.md §§4, 6, 8, 9; contra-prova das rotas no §6 deste dossiê]`

### A família de módulos

FARO **FIND** (encontrar agora) · **WATCH** (monitorar) · **PROOF** (evidência e fonte) ·
**SCORE** (priorizar) · **ACTION** (transformar em ação comercial — **fora do MVP**, é
destino declarado, não promessa). `[canon: MODELO-FARO-V2.md §8]`

### A vertical de estreia: FARO TAX

**O motor é horizontal; a oferta é vertical.** Começa em tributário porque é onde a dor é
mais aguda e o ROI é calculável pelo cliente — quem fecha recuperação ganha por êxito.
Expansão só depois de retenção provada: TAX → M&A → AGRO → ENERGIA → B2B.
`[canon: MODELO-FARO-V2.md §13]`

### O que o FARO NÃO é

Não é lista de empresas. Não é promessa de faturamento. Não é parecer tributário. Não é
garantia de conversão. Não substitui o profissional habilitado. **A clareza desses limites é
parte do produto**, não rodapé legal. `[canon: MODELO-FARO-V2.md §1]`

---

# §2 — POR QUE ELE EXISTE (a gênese, em ordem)

## 1. A encomenda

Em **17/08/2026** chegou uma demanda espontânea de um profissional do mercado de recuperação
tributária e originação financeira, pedindo literalmente: empresas com 50+ funcionários por
setor e tese tributária, faturamento acima de R$ 100M, pecuaristas confinadores, viabilidade
de mercados — *"me entregue isso aí arrumado"*. `[canon: DOSSIE-V1.md §2]`

> `[ORDEM 18/08]` **Esse profissional é o irmão do dono.** O canon registra "um profissional
> do mercado" sem nomear a relação; a ordem de 18/08 identifica quem é. As duas leituras não
> se contradizem — a segunda é mais específica. O papel dele no modelo está no §3.

## 2. A decisão de virar SaaS

O pedido era um serviço pontual. A leitura do dono foi outra: **a dor descrita é a dor da
categoria inteira**. Ferramentas de lista entregam banco cru — o consultor gasta horas
virando linha em tese. Consultoria de inteligência entrega tese — mas custa caro e a
fotografia envelhece em 90 dias. Ninguém entregava o meio. Daí a virada: em vez de atender
um cliente, construir o produto multi-assinante. `[canon: DOSSIE-V1.md §2]`

## 3. O rito da Junta Externa — 1ª rodada (o produto)

O modelo v1 foi submetido a **três juízes externos, sem contato entre si**, e só depois
consolidado. **O FARO é o primeiro produto da casa desenhado por conselho ANTES da primeira
linha de código.** `[canon: junta/QUADRO-DE-VEREDITOS.md]`

**Resultado: 18 unanimidades e 6 divergências.** As unanimidades que mais mudaram o produto:

- **1 nicho, não multi-nicho** — motor horizontal, oferta vertical
- **2 fontes dominadas** no MVP, não cobertura ampla
- **Score tem que ser explicável** — número único e misterioso destrói a venda
- **Proxy nunca vira fato**
- **Falso positivo é o ponto cego mais perigoso**
- **Lote de madrugada + materialized views** — nunca processar a jazida em tempo real

**A divergência principal:** um juiz mandou **cortar** a tela do Tribunal ("é mais um Kanban
genérico, um CSV resolve"); outro mandou **manter e expandir** ("é o loop de feedback, sem
ele o score não aprende"). A síntese adotada foi o **TRIBUNAL MAGRO** — três botões e um
motivo estruturado, sem Kanban. Razão: *o loop de feedback é o moat, o Kanban é commodity.*
`[canon: junta/QUADRO-DE-VEREDITOS.md D1; MODELO-FARO-V2.md §9]`

**O achado que só a leitura cruzada revelou:** o mesmo juiz que mandou cortar o Tribunal
exigiu, três respostas adiante, "um botão de loop de feedback, senão o score não aprende".
**Pediu o loop e cortou a tela que o captura.** Nenhum juiz enxerga a própria contradição —
ela aparece porque o parecer foi arquivado na íntegra, não resumido.

## 4. A Fossa das Marianas — 2ª rodada (o mercado)

Nova rodada, agora julgando **mercado e modelo de negócio**. Três juízes, de novo sem contato.

### Veredito: 3×0 — PÁ > MINA

| Rota | Gemini | Manus | GPT | Veredito |
|---|---|---|---|---|
| **(a) Picks-and-shovels** | recomendada | **núcleo** | **recomendada** | ✅ **3×0 NÚCLEO** |
| **(b) Canal / revenue-share** | risco legal alto | **canal controlado** | zona delicada | ✅ **canal, com blindagem** |
| **(c) Braço próprio** | escala baixa | destrói a vantagem | não é a 1ª jogada | ❌ **3×0 contra** |
| **(d) Marketplace** | risco baixo/médio | difícil na prática | **risco muito alto** | ⏳ **horizonte** |

`[canon: junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md Parte 1]`

**Por que a pá vence:** os três riscos que podem matar o mercado — modulação de efeitos do
STF (zera o retroativo), limitação de compensação, e a própria reforma acabando com as teses
de base — atingem **a mina**. Nenhum deles mata **a inteligência sobre o que está vivo**.
Quem vende a pá sobrevive à modulação; quem vende a mina, não.
`[canon: junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md Parte 6]`

### O ponto cego triplo

Perguntados "qual pergunta faltou?", os três responderam coisas diferentes — e as três são o
mesmo buraco visto de três ângulos:

| Juiz | A pergunta | O ângulo |
|---|---|---|
| Gemini | *"Quem paga a conta se o algoritmo errar e a Receita multar o cliente?"* | **Responsabilidade** — multa de ofício de 75% a 150%; a RFB tem 5 anos para homologar |
| GPT | *"Qual é o custo econômico de um falso positivo?"* | **Precisão** — o funil: 100.000 → 10.000 → 2.000 → 500 → 200 → **50** |
| Manus | *"Qual a capacidade de utilização do crédito e o prazo de caixa?"* | **Liquidez** — o cliente compra liquidez, não crédito no papel |

### A síntese: **o produto é confiança subscrita, não lead**

O verdadeiro produto é **PROBABILIDADE × VALOR × EVIDÊNCIA × URGÊNCIA**. Isso reposiciona a
plataforma de geradora de leads para **infraestrutura de underwriting tributário**. E abre a
pergunta comercial que muda o negócio:

> *"Quem está disposto a pagar para saber quais oportunidades **NÃO** devem ser perseguidas?
> Essa informação vale tanto quanto encontrar dinheiro."*

`[canon: junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md Parte 5]`

## 5. A estratégia stealth selada

`[ORDEM 18/08 — decisão do dono, primeira gravação neste dossiê. Ainda não tem doc próprio no canon.]`

**Serviço agora. Sistema escondido. Reveal com data.**

O FARO não é anunciado. A Fase 1 vende **serviço** ao irmão — entrega feita a mão, com
qualidade — e essa entrega funciona como **laboratório secreto** do produto: teses reais,
custo por ficha medido, feedback colhido sem que o cliente saiba que está calibrando um
motor. O sistema só é revelado quando tiver o que mostrar, e o reveal tem data.

**Por que stealth em vez de anunciar:** o canon já dizia que o motor só nasce com design
partner **pagante**, e que a automação vem depois de saber quais sinais são aprovados
`[canon: MODELO-FARO-V2.md §12, §20]`. A estratégia stealth é a forma operacional disso —
transforma a espera em coleta de dado em vez de espera parada. O plano completo está no §7.

---

# §3 — O MODELO DE NEGÓCIO SELADO

## As quatro rotas

### (a) PICKS-AND-SHOVELS — o núcleo

Vender inteligência por assinatura para os operadores. A casa não recupera imposto: informa
quem provavelmente tem dinheiro recuperável, com a prova do porquê.
Margem `ESTIMATIVA: 70–90%`. `[canon: MODELO-DE-NEGOCIO.md §A]`

### (b) CANAL OPERADOR-PARCEIRO — adotada, com blindagem

Um **escritório de advocacia parceiro da ALSHAM** trabalha como operador da casa. Recebe
dossiês qualificados minerados **exclusivamente pelo tenant próprio da ALSHAM**, a partir de
teses do Catálogo da Casa, cada uma com certidão de proveniência. **Nunca de tenant de
cliente.** `[canon: CANAL-OPERADOR-PARCEIRO.md]`

> `[ORDEM 18/08]` O escritório recebe o rótulo **Operador-Beta**. O canon descreve a função;
> o nome é desta ordem.

### (c) BRAÇO PRÓPRIO — descartada

Reserva da OAB, capital alto (`ESTIMATIVA: R$ 3–10 milhões`), responsabilidade solidária por
erro profissional, escala baixa. 3×0 contra. `[canon: MODELO-DE-NEGOCIO.md §A]`

### (d) MARKETPLACE — longo prazo

A visão grande, e a rota que mais facilmente atravessa a linha entre marketplace tecnológico
e agenciamento de atividade profissional. **Não é o primeiro passo.**
`[canon: MODELO-DE-NEGOCIO.md §A]`

## A frase-síntese

> ## "Levi's E garimpeiro — cada um com a sua bateia, no seu lote, com escritura."

A casa vende a pá **e** garimpa — em lotes separados, com escritura separada. O que nunca
acontece: garimpar no lote do cliente. `[canon: MODELO-DE-NEGOCIO.md §A]`

## 🔴 O MURO OAB — a regra que não se negocia

**Lei 8.906/1994 — Estatuto da Advocacia.** Unânime nos três pareceres.

| Artigo | O que diz |
|---|---|
| **Art. 1º** | São privativas de advocacia a **postulação judicial** e a **consultoria, assessoria e direção jurídicas** |
| **Art. 4º** | São **nulos** os atos privativos praticados por não inscrito na OAB |
| **Art. 5º, §4º** | Consultoria jurídica **independe de contrato formal** para existir |

**A leitura do §4º que assombra o produto:** dá para praticar ato privativo **sem perceber**,
só redigindo uma frase conclusiva. É por isso que a linguagem blindada (§4 deste dossiê) é
lei e não estilo.

> # A tecnologia NUNCA divide honorário advocatício.
>
> Nem como êxito, nem como bônus, nem disfarçado de reajuste. Um dos juízes foi literal:
> *"'Eu gero o lead jurídico e recebo 30% dos honorários do advogado' é uma estrutura
> juridicamente perigosa."*

**Os dois modelos lícitos:**

1. **Licença premium** — preço fixo por software e inteligência, independente do resultado
   dos casos.
2. **Fee por dossiê qualificado** — preço por unidade de trabalho entregue, indexável a
   **volume e profundidade**, jamais a êxito ou a valor recuperado.

**O teste que separa lícito de ilícito:** se o preço muda porque o caso deu certo, é partilha
de honorário. Se muda porque o dossiê era mais profundo, é preço de produto.

**Estrutura:** contratos **espelhados** — ALSHAM⇄Escritório (tecnologia) e
Escritório⇄Contribuinte (jurídico), sem cláusula de preço referenciando a outra.
`[canon: CANAL-OPERADOR-PARCEIRO.md]`

## Preços — TUDO HIPÓTESE

| Plano | Valor | Status |
|---|---|---|
| FARO Solo | R$ 297/mês | **hipótese de fundação** |
| FARO Pro | R$ 697/mês | **hipótese de fundação** |
| FARO Escritório | R$ 1.497/mês | **hipótese de fundação** |

Mais: **compromisso trimestral** na assinatura fundadora (contém o *hit-and-run* de quem
consome a base e cancela) · **créditos de investigação** para caçadas pesadas · **gratuidade
proibida** — o objetivo é provar disposição de pagamento, não colecionar interesse.
`[canon: MODELO-FARO-V2.md §16.1; MODELO-DE-NEGOCIO.md §D]`

### 🔨 A linha OPERADOR PROFISSIONAL — MARTELO PENDENTE

Dois juízes independentes deram o mesmo benchmark: um operador profissional já paga
`ESTIMATIVA: R$ 2–30 mil/mês` por inteligência.

**A tabela atual topa em R$ 1.497 — uma ordem de grandeza abaixo.** Isso não significa "subir
o preço": significa que a tabela precifica um consultor solo enquanto o benchmark descreve
uma operação estruturada que compra inteligência como insumo de produção.

> **Nenhum valor foi fixado. Nenhuma página exibe esta linha. Aguarda martelo do dono.**

`[canon: MODELO-DE-NEGOCIO.md §D.2]`

## Os dois personagens do canal

`[ORDEM 18/08 — papéis definidos pelo dono; o canon descreve as funções, não as pessoas.]`

| Personagem | Papel hoje | Trajetória |
|---|---|---|
| **O irmão do dono** | Cliente pagante da **Fase 1** (serviço stealth) | Candidato a **operador da rota (b)** · futuro **Parceiro Fundador** no reveal |
| **O escritório de advocacia parceiro** | **Operador-Beta** | Executa os atos privativos sobre dossiês do tenant da casa; fecha o ground truth loop |

**Por que o irmão é o design partner certo:** ele originou a demanda, tem a dor real, opera
no território (MT/GO denso) e paga. O canon exige design partner **pagante** antes do motor
— ele é a resposta a essa exigência. `[canon: MODELO-FARO-V2.md §17, §20]`

**A trava que protege a relação:** mesmo sendo irmão, ele é **cliente**. A Lei de Dados (§4)
vale para ele igual: a tese dele é dele.

## 🔁 O ground truth loop — o moat que ninguém copia

Todo concorrente que vende lista tem o mesmo buraco: **nunca descobre se o lead deu certo.**
O resultado desaparece dentro do cliente e o score nunca aprende.

O operador parceiro fecha o circuito:

```
FICHA → CONVERSÃO → VALOR REAL → PRAZO DE CAIXA
                                        ↓
                      calibragem do FARO Score:
                      quais sinais convertem de verdade,
                      P(elegibilidade) real, P(homologação) real
```

**Sem esse loop, o EV líquido é um chute com aparência de fórmula** — as probabilidades que
ele multiplica precisam vir de algum lugar. Vêm daqui. É por isso que a rota (b) não é
"receita extra": é **infraestrutura de produção da verdade** que calibra o produto vendido na
rota (a). `[canon: CANAL-OPERADOR-PARCEIRO.md]`

---

# §4 — AS LEIS DO FARO (o caráter)

Estas leis são o que separa o FARO de mais uma ferramenta de prospecção. Não são boas
práticas — são condição de existência do produto.

## Lei 1 — A LEI DE DADOS: a tese do assinante é do assinante

**O problema que ela resolve:** a casa vende a pá **e** garimpa. Quem faz as duas coisas tem
acesso a uma tentação óbvia — olhar a tese que o assinante montou e caçar com ela. Se isso
acontecer uma vez, o FARO acaba. Não por multa: por confiança.

> # A TESE DO ASSINANTE É DO ASSINANTE.
> Tenant isolado. A pesquisa do cliente é dele. A ALSHAM nunca vê nem deriva.

**As quatro camadas lícitas de aprendizado:**

| # | Camada | O que é lícito |
|---|---|---|
| 1 | **Telemetria agregada e anônima** | Que **tipos de sinal** convertem, taxas por setor/UF. Declarada em contrato. Sobre o SINAL, nunca sobre a TESE. Mínimo de N assinantes por recorte. |
| 2 | **Catálogo próprio da casa** | Teses construídas do zero, de fonte pública e dos pareceres. É o que o tenant ALSHAM opera. |
| 3 | **Dado público é de todos** | Caça paralela é legítima — a casa chega ao mesmo CNPJ pelo **próprio caminho**. Dois garimpeiros no mesmo rio é normal; um lendo o mapa do outro não é. |
| 4 | **Opt-in declarado** | Compartilhar tese ⇄ benchmark coletivo. Feature contratada, reversível, recíproca. Nunca bastidor, nunca pré-marcado. |

**🚨 Linha vermelha:** copiar tese individual é concorrência desleal e violação de segredo de
negócio — **e mata o fosso**, porque um assinante que desconfia para de julgar, e sem
julgamento o Thesis Engine não gira. *O incentivo econômico e o ético apontam para o mesmo
lado: a casa ganha mais respeitando a fronteira.*

**Auditoria de proveniência:** toda tese do catálogo carrega **certidão de origem** com
declaração expressa de que não derivou de tenant de cliente. Sem certidão, não entra.

`[canon: LEI-DE-DADOS.md; MODELO-FARO-V2.md §15.1]`

## Lei 2 — CONFIDENCE POLICY: proxy nunca vira fato

Caso canônico — faturamento acima de R$ 100M **não é público por empresa**.

| ❌ Proibido | ✅ Obrigatório |
|---|---|
| "Faturamento: R$ 150 milhões." | "Faturamento observado: **não disponível**." |
| Número estimado apresentado como dado | "Proxy de porte: compatível com empresas acima do limiar definido." |

*Quem promete certeza de faturamento vende achismo.* Vira característica de marca: **o FARO
sabe diferenciar fato de hipótese.** `[canon: MODELO-FARO-V2.md §5]`

## Lei 3 — A LEI DAS CAMADAS

```
DADO → SINAL → INFERÊNCIA → TESE → OPORTUNIDADE
```

- **DADO** — o que a fonte efetivamente informa. Nada além.
- **SINAL** — evento derivado da comparação entre coletas.
- **INFERÊNCIA** — hipótese, **declarada como hipótese**.
- **TESE** — a lógica comercial do assinante.
- **OPORTUNIDADE** — só quando passa os critérios mínimos.

**Obrigação por afirmação, sem exceção:** fonte (`source_id`) · data de coleta ·
data de referência · regra de transformação · **limite de inferência**. Na linha, nunca em
rodapé ou tooltip.

O FARO tem que conseguir dizer sempre cinco coisas: o que sabemos · o que observamos · o que
inferimos · por que importa · **o que ainda não sabemos**.
`[canon: MODELO-FARO-V2.md §3]`

## Lei 4 — SCORE DECOMPOSTO E EXPLICÁVEL

Score único e misterioso está **proibido**. Nunca "a IA deu 87".

Seis dimensões visíveis: fit estrutural · evidência da tese · recência · qualidade das fontes
· intensidade do sinal · confiança da inferência.

A leitura correta é: **"87 porque cumpriu 8 de 10 critérios, tem 5 evidências independentes e
2 sinais recentes"**. Na maquete o total é **derivado** dos pesos — a tela não *fala* que o
score é decomposto, ela é obrigada a decompô-lo para exibir um número.
`[canon: MODELO-FARO-V2.md §4]`

## Lei 5 — EV LÍQUIDO é o número-mestre, não o bruto

```
EV LÍQUIDO = bruto
           × P(elegibilidade)
           × P(homologação/uso)
           × ajuste de prazo de caixa
           − custo de documentação
           − honorários do habilitado
```

> ### "Um produto que acusa R$ 3 milhões e converte R$ 100 mil líquidos é pior que um produto que identifica R$ 400 mil com 80% de conversão."

**Regra de exibição:** o EV líquido em destaque; o bruto é componente subordinado, sempre ao
lado das probabilidades que o reduzem. Inverte o instinto comercial de propósito — **o número
grande na tela é um passivo se não converter.**

**As cinco camadas do crédito:**
`Potential → Eligible → Validated → Recoverable → Recovered Cash`. O mercado vende a primeira
como se fosse a última; o FARO nomeia as cinco. `[canon: MODELO-FARO-V2.md §4.1]`

## Lei 6 — O CAMPO "POR QUE NÃO PERSEGUIR"

Toda ficha carrega um campo que **argumenta contra ela própria**: documentação provavelmente
ausente · período possivelmente prescrito · precedente desfavorável · fonte degradada · sinal
isolado · porte incompatível com o custo do trabalho · **capacidade de utilização do crédito
duvidosa**.

Num funil onde 0,05% do topo vira negócio relevante, **o valor de eliminar rápido é igual ao
valor de encontrar**. `[canon: MODELO-FARO-V2.md §4.2]`

## Lei 7 — LINGUAGEM BLINDADA

| ❌ PROIBIDO | ✅ OBRIGATÓRIO |
|---|---|
| "empresa elegível" | "sinais compatíveis para investigação" |
| "crédito garantido" | "hipótese que justifica investigação técnica" |
| "direito a R$ X" | "porte compatível com o limiar da tese" |
| "cliente certo" | "alvo que merece ser investigado" |
| "tem direito a recuperar" | "apresenta N evidências compatíveis com a tese X" |

A diferença entre as colunas é a diferença entre um produto e um passivo.

**Cláusula-blindagem em todo fluxo:** *"sugestão de dados vs. decisão do contribuinte"* — na
ficha, no limite de inferência, no dossiê, nos contratos e **no cabeçalho do CSV** (dado que
sai da plataforma leva a ressalva junto). `[canon: MODELO-FARO-V2.md §14, §15.2]`

## Lei 8 — EVIDENCE GRADE + SOURCE REGISTRY + FRESHNESS

**Evidence Grade A–D**, derivado da composição dos níveis:

| Nível | Natureza |
|---|---|
| **E1** | Fonte oficial — órgão público, autarquia, agência reguladora |
| **E2** | Institucional / derivada — associação, ranking, base secundária |
| **E3** | Sinal externo — notícia, site, vaga, comunicação pública |

O grade usa **peso e tipografia, nunca cor** — colorir transformaria evidência em placar.

**Source Registry:** toda fonte tem ficha — órgão, periodicidade, última coleta, licença,
cobertura, status e **fallback declarado**. Regra de integridade: *toda fonte é provada viva
antes de ser prometida.* Fonte indisponível → o produto **declara a limitação**, não
apresenta inferência como fato.

**Freshness 🟢🟡🟠🔴** — o sinal está vivo? Decisão de design: o verde de "atual" **é a
própria cor de marca**, porque a marca significa "o sinal está vivo".
`[canon: MODELO-FARO-V2.md §6, §7; IDENTIDADE-VISUAL.md §4]`

## Lei 9 — RELÓGIO DA REFORMA e vigilância de versão

O Watch monitora mudança de **norma**, não só de empresa.

| Marco | O que acontece |
|---|---|
| **2026** | Ano-teste: CBS 0,9% + IBS 0,1%, compensáveis com PIS/Cofins |
| **2027** | Fim do PIS/Cofins · CBS plena · Imposto Seletivo entra |
| **2029–2032** | Substituição gradual de ICMS/ISS pelo IBS — 10% ao ano |
| **2033** | Modelo novo integral |

**O motor econômico:** saldos de ICMS com previsão de homologação e compensação **em até 240
meses (20 anos)** no desenho da transição. *Vinte anos para receber é o argumento de venda* —
ninguém quer esperar.

> ## 🔴 A LC 214/2025 JÁ FOI ALTERADA PELA LC 227/2026.
> O produto lê a **versão VIGENTE**, nunca a decorada. Regra escrita contra texto
> desatualizado é falso positivo com aparência de rigor — o pior tipo, porque passa em
> revisão.

`[canon: MODELO-FARO-V2.md §8.1; MODELO-DE-NEGOCIO.md §B.1]`

## Lei 10 — TESE BLOQUEADA quando os juízes divergem

Na rodada Marianas, **três teses do top-8 receberam avaliações frontalmente opostas** de
juízes que não se falaram. O canon **não arbitra nenhuma** — arbitrar tese jurídica é
exatamente o ato privativo que a Lei 8.906/94 veda à tecnologia.

Estados possíveis de uma tese: 🟢 ativa · 🔵 estudo · 🟡 segmentada · 🔴 **contraditada
(bloqueada)** · ⚫ enfraquecida/morta.

**Uma plataforma de inteligência tem que detectar tese MORTA, não só tese viva.**
*Tese estática = produto fraco. Tese versionada em tempo real = produto forte.*
`[canon: CATALOGO-DE-TESES-DA-CASA.md; MODELO-FARO-V2.md §8.1]`

---

# §5 — O CATÁLOGO DE TESES DA CASA

**12 teses numeradas (T-01 a T-12), mais o filhote T-01b = 13 linhas no quadro.** Cada uma
com faixa selada, estado e **certidão de proveniência**.
`[canon: CATALOGO-DE-TESES-DA-CASA.md]`

| # | Tese | Estado | Faixa em empresa-tipo R$ 100M |
|---|---|---|---|
| T-01 | Tema 69 — ICMS destacado na base do PIS/Cofins | 🟢 ativa | `ESTIMATIVA: R$ 0,3–3,0 M` |
| **T-01b** | **ISS na base (Tema 118)** | 🔴 **CONTRADITADA** | `ESTIMATIVA: R$ 500 mil+` |
| T-02 | Monofásico PIS/Cofins | 🟡 segmentada | `ESTIMATIVA: R$ 0,1–1,0 M` |
| T-03 | INSS sobre verbas indenizatórias | 🟡 segmentada | `ESTIMATIVA: R$ 50–800 mil` |
| **T-04** | **Insumos e energia no Lucro Real** | 🟢 ativa — **tese-semente do MVP** | `ESTIMATIVA: R$ 0,2–2,0 M` |
| T-05 | Equiparação hospitalar (Tema 217) | 🟢 ativa, com trava anti-massificação | `ESTIMATIVA: R$ 0,2–1,5 M` |
| T-06 | Funrural | 🔵 estudo — LGPD/PF | `ESTIMATIVA: R$ 50 mil–1,0 M` |
| T-07 | Lei do Bem | 🟢 ativa — para-brisa | `ESTIMATIVA: R$ 100 mil–1,0 M` em benefício |
| T-08 | Drawback e regimes de exportação | 🟢 ativa — para-brisa | `ESTIMATIVA: R$ 100 mil–2,0 M` |
| T-09 | Relógio da Reforma — saldo credor de ICMS | 🔵 estudo — killer feature | `NÃO VERIFICADO` |
| T-10 | Readiness CBS/IBS | 🔵 estudo — para-brisa puro | `NÃO VERIFICADO` |
| T-11 | Secundário de créditos e precatórios | 🔵 estudo — **fora do MVP** | deságio `ESTIMATIVA: 15–60%+` |
| T-12 | Agro — CPR, FIAGRO, barter | 🔵 estudo — **fora do MVP** | comissão `ESTIMATIVA: 0,5–3%+` |

## 🔴 As três em disputa — e o que exatamente está bloqueado

| # | Contradição | Estado preciso |
|---|---|---|
| **C1** | **ISS / Tema 118.** Um juiz: *"risco baixo, já pacificado"*. Outro: *"permanece sem conclusão definitiva"* · risco **muito alto** | **T-01b integralmente bloqueada.** Não entra em nenhuma fila. |
| **C2** | **Terço constitucional de férias / Tema 985.** Um juiz lista como recuperável. Outro cita precedente que **reconheceu a incidência** | **T-03 segmentada:** a rubrica do terço de férias fica **contraditada — não prospectar**. Nenhuma ficha pode agrupar "verbas indenizatórias" como bloco único; opera **rubrica por rubrica**. |
| **C3** | **Monofásico / Tema 1.339.** Um juiz: *"risco de reversão nulo"*. Outro cita repetitivo negando créditos a varejistas de combustíveis | **T-02 segmentada:** o recorte de combustíveis fica ⚫ **enfraquecido/morto**; o resto segue ativo, dependente de cadeia e NCM. |

**Todas as três aguardam parecer LEXIS + tributarista habilitado.** O canon registra a
contradição impressa na ficha de cada tese e **não escolhe lado**.

## O iceberg de 4 andares — as teses futuras

```
        ~~~~~~~~~~ linha d'água ~~~~~~~~~~
   1 │ RELÓGIO DA REFORMA      ← urgência datada · killer feature 2026-28
   2 │ RETROVISOR vs PARA-BRISA ← onde o MVP mora
   3 │ SETORES-MINA            ← onde as teses se concentram
   4 │ LADO FINANCEIRO         ← secundário + agro · exige parceiro regulado
```

**Andar 2 — a distinção que decide a economia:** *retrovisor* é recuperação do passado
(one-shot, ticket alto, acaba, morre com a modulação). *Para-brisa* é planejamento recorrente
(ticket menor, não acaba, sobrevive à reforma). **O para-brisa é o negócio de assinatura; o
retrovisor é a isca de entrada.**

**Andar 3 — setores-mina:** hospitais/clínicas · transportadoras · construção · supermercados
· e-commerce · indústria de transformação. **Nota territorial: MT e GO são densos** — e é o
território do design partner.

**Andar 4 — lei de separação de produto:** **não misturar promessa de crédito tributário com
crédito rural no mesmo produto sem parceiro regulado.** São dois regimes regulatórios
diferentes; juntá-los numa tela é criar passivo por conveniência de marketing.

`[canon: MODELO-DE-NEGOCIO.md §B]`

---

# §6 — ESTADO EXATO (com contra-prova)

**Contra-prova colhida em 19/08/2026**, com o repo sincronizado ao remoto.

## O que EXISTE

| Item | Contra-prova |
|---|---|
| **Commits na `main`** | `f1e47f5` (fundação) · `156fd27` (modelo de negócio + Marianas) · `9207df6`, `5ce82c4`, `7452e9d` (herança HL, subida pelo dono em 19/08) |
| **HEAD atual** | `7452e9d` — local e remoto sincronizados, árvore limpa |
| **Canon** | **5.854 linhas** em `docs/canon/` + `docs/junta/` (contagem `wc -l`) |
| **Herança HL** | **2.181 linhas** em 5 arquivos, `docs/heranca/HL-LICITACAO/` |
| **Maquete** | build limpo, **15 páginas estáticas** geradas |
| **Banner ANTI-QUANTUM** | presente em `layout.tsx:32` — `PROTÓTIPO — dados ilustrativos` |

**Rotas da maquete** (saída do `next build`, não lista de arquivos):

```
○ /            ○ /teses      ○ /fila       ● /fila/[id]  (6 fichas SSG)
○ /watch       ○ /painel     ○ /fontes     ○ /precos      ○ /_not-found
```

**Documentos do canon:** `MODELO-FARO-V2.md` (o produto) · `MODELO-DE-NEGOCIO.md` (o negócio)
· `LEI-DE-DADOS.md` · `CANAL-OPERADOR-PARCEIRO.md` · `CATALOGO-DE-TESES-DA-CASA.md` ·
`IDENTIDADE-VISUAL.md` · `DOSSIE-V1.md` (histórico) · `docs/junta/` (1ª rodada, 4 pareceres +
quadro) · `docs/junta/marianas/` (2ª rodada, 3 pareceres + anexo ❔ + quadro).

## 🔴 OVERRIDE — A CONSTRUÇÃO COMEÇOU

`[ORDEM 19/08]` **O dono derrubou a regra "o motor nasce com o design partner pagante".**
A construção do SaaS começa **agora**. O irmão continua sendo a primeira dor e o primeiro
cliente da Fase 1 — mas **o FARO é produto multi-assinante, construído para muitos**, não
uma entrega sob medida para um.

**O que muda na governança:** os portões deixam de ser as fases comerciais e passam a ser as
**Ondas de construção**. Cada Onda tem escopo fechado, proibidos declarados e **portão do
dono** — nada avança porque "está pronto tecnicamente".

| Onda | Escopo | Estado |
|---|---|---|
| **Onda 1** | Fundação: monorepo · schema completo do domínio · guardas de CI | ✅ **portão passado** (PR #1 mesclado) |
| **Onda 2** | A jazida viva: ingestão RFB + CCEE, fontes provadas vivas, diff→eventos | ✅ **portão passado** (PR #2 e #4) |
| **Onda 3** | Motor de caça + score sobre a tese T-04 real | 🔨 **PR aberto, aguardando portão** |
| **Onda 4** | Fichas na tela, Tribunal, Watch, onboarding | ⏳ |

**Relatório da Onda 2:** `docs/ondas/ONDA-2-JAZIDA.md`. O achado que mais muda
plano: a RFB **reparticiona quais CNPJs caem em qual arquivo a cada lote**, e o
diff entre dois recortes reais pariu 4.256.121 "estabelecimento novo" falsos.
**O diff só roda sobre a fonte inteira** — isso virou freio no banco, não aviso
na documentação.

> **O dono é soberano em cada portão.** O executor abre PR e **para**. Merge é clique dele.

## O que NÃO EXISTE — estado após o override

| Item | Estado |
|---|---|
| Motor de caça | 🔨 **o pipeline está inteiro** — coleta, diff, caça, score e publicação. A primeira ficha real existe (Onda 3) |
| Banco de dados, schema, migrations | 🔨 **12 migrations**, provadas contra Postgres 16 real — falta o projeto Supabase (clique do dono) |
| Multi-tenant e RLS | 🔨 **no schema, com guarda de CI provando 100%** |
| `usage_ledger` | 🔨 **com dado real**: volume e duração de coleta, `custo_centavos` NULL = não medido |
| Coleta de fonte | 🔨 **RFB provada viva e ingerida** (18,5 M linhas reais carregadas em teste) · **CCEE bloqueada pela própria CCEE** (403, chamado é ato do dono) |
| Score real | 🔨 **existe**: 6 dimensões justificadas, total derivado. O da maquete segue fictício |
| Telas de produto além do shell | ❌ **Onda 4** |
| Autenticação funcionando | ❌ shell autenticável existe; auth ligada é Onda 4 |
| Pagamento, checkout, assinatura | ❌ sem Onda marcada |
| Qualquer chamada de rede ou integração externa | 🔨 **só a RFB, e só fora do CI** — nenhum job de CI baixa lote |

**Todos os dados da maquete são fictícios e rotulados.** Nenhuma empresa existe; os CNPJs são
sequenciais e inválidos de propósito (`00.000.00X/0001-00`).

## Pendências vivas

| # | Pendência | Estado |
|---|---|---|
| **P1** | **Deploy da maquete** | ❌ **Bloqueado.** Vercel devolve `403 — You don't have permission to create a project`, no team e fora dele. Três tentativas, dois métodos. **Não é problema do código** — o app builda e roda. **Clique do dono:** Vercel → Add New Project → repo `faro` → **Root Directory = `apps/maquete`**. |
| **P2** | **Martelo da linha Operador Profissional** | Benchmark existe (`ESTIMATIVA: R$ 2–30k/mês`); o valor não. Aguarda dono. |
| **P3** | **Atribuição dos pareceres da 1ª rodada** | Um bloco chegou **duplicado sob os rótulos "gpt" e "Gemini"**. Se tivesse passado, contaria dois votos onde há um. Registrado como `❔` no cabeçalho de cada arquivo. Aguarda correção do dono. |
| **P4** | **LEXIS — quatro frentes** | (a) as 3 teses em disputa (C1/C2/C3) · (b) contratos espelhados do canal · (c) cláusulas 1 e 4 da Lei de Dados, marcadas **MINUTA** · (d) `[19/08]` **L5** — o Aceite da Caçada ante o CDC art. 49. |
| **P5** | **WhatsApp + proposta stealth pro irmão** | `PROPOSTA-001-2026-v2`. `[ORDEM 18/08]` — ainda não versionada no repo. |
| **P6** | **Repo privado?** | Hoje privado. `docs/junta/` e `docs/heranca/` nomeiam fornecedores de IA — necessário pela Lei do Selo, proibido em superfície de cliente. **Voto do guia: manter privado.** Decisão do dono. |

`[canon: relatórios das duas rodadas; P1 verificado nesta sessão]`

---

# §7 — O PLANO DE CONSTRUÇÃO

`[ORDEM 18/08 — o faseamento stealth é decisão do dono, gravada aqui pela primeira vez. Os critérios de MVP e os proibidos vêm do canon.]`

## 🔴 ATUALIZAÇÃO — AS DUAS TRILHAS CORREM JUNTAS

`[ORDEM 19/08]` O override do dono mudou o plano: **a construção não espera mais a Fase 1
comercial terminar.** As duas trilhas correm em paralelo, e cada uma tem os próprios portões.

| | **TRILHA COMERCIAL** (Fases) | **TRILHA DE CONSTRUÇÃO** (Ondas) |
|---|---|---|
| O que é | Vender, entregar, aprender com cliente real | Construir o SaaS multi-assinante |
| Onde está | Fase 1 — serviço stealth ao irmão | **Onda 1 — fundação (em construção)** |
| Portão | Dono | Dono |
| Alimenta | Teses reais, custo por ficha, feedback | Motor que serve **muitos**, não um |

**Por que correm juntas e não em série:** a Fase 1 produz o *conhecimento* (que sinais
convertem, quanto custa uma ficha, qual formato serve). As Ondas produzem a *máquina*. Esperar
uma para começar a outra desperdiça os dois lados — o conhecimento esfria e a máquina não
existe quando o conhecimento chega.

**O que NÃO mudou:** o irmão continua sendo a primeira dor e o primeiro cliente. **O que
mudou:** o FARO é construído desde já como **produto multi-assinante**, não como entrega sob
medida que depois "vira produto". Produto que nasce de entrega sob medida herda o formato de
um cliente só.

### As Ondas de construção

| Onda | Escopo | Proibido nela | Portão |
|---|---|---|---|
| **1 — Fundação** 🔨 | Monorepo · schema completo do domínio · guardas de CI | Coleta real · score sobre dado real · telas de produto · pagamento · deploy novo | PR aberto, **merge é clique do dono** |
| **2 — A jazida viva** | Ingestão RFB Base Aberta + CCEE · fontes provadas vivas · diff→eventos | Score · telas · teses bloqueadas | Dono |
| **3 — O motor** | Caça + score decomposto sobre a tese **T-04** real | Multi-tese · teses 🔴/🔵 | Dono |
| **4 — O produto** | Fichas na tela · Tribunal · Watch · onboarding | Pagamento · verticais novas | Dono |

> **O dono é soberano em cada portão.** O executor abre PR e **para**. Nenhuma Onda avança
> porque "está pronto tecnicamente".

**As três teses bloqueadas (C1/C2/C3) seguem trancadas em todas as Ondas** até parecer LEXIS.
O override liberou a construção, não a matéria jurídica.

---

## FASE 1 — O SERVIÇO STEALTH (agora)

**O que é:** vender **serviço** de prospecção tributária ao irmão, entregue a mão, com
qualidade. Ele paga. Ele não sabe que está alimentando um motor.

**O que se constrói:**

| Construir | Por quê |
|---|---|
| **Teses reais**, escritas e parametrizadas | Semeiam o Catálogo da Casa com proveniência limpa |
| **Ledger de custo por ficha** — horas, fontes consultadas, retrabalho | Sem custo conhecido, preço é chute `[canon: MODELO-FARO-V2.md §16]` |
| **Feedback disfarçado** — quais fichas ele aprovou, quais descartou, **por quê** | É o Tribunal Magro rodando a mão. O motivo estruturado é o dado que calibra. |
| **Fichas no formato do canon** — camadas, fonte+data, limite de inferência, EV líquido | Testa se o formato serve na vida real antes de virar código |

**🔴 PROIBIDO nesta fase:**

- ~~construir motor, banco, auth, pagamento ou qualquer código de produto~~ — **revogado pelo `[ORDEM 19/08]`**: a construção corre na trilha das Ondas, com portão próprio. O que segue proibido na trilha comercial é *prometer ao cliente* o que a máquina ainda não faz;
- anunciar o FARO, publicar landing, falar de sistema com o cliente;
- prometer ao cliente qualquer coisa que só o sistema faria;
- usar a tese **dele** como semente do catálogo da casa sem certidão limpa (Lei de Dados);
- pular a linguagem blindada porque "é serviço, não produto" — a Lei 8.906 não distingue.

**🚪 Portão de saída:** existe **cliente pagante**, **teses reais escritas**, **custo por
ficha medido** e **ao menos um ciclo de fichas julgadas com motivo registrado**.

## FASE 2 — O MVP COM CRITÉRIO E DATA

**O que se constrói** `[canon: MODELO-FARO-V2.md §12]`:

- **1 tese paramétrica** (candidata natural: **T-04**, insumos/energia no Lucro Real)
- **2 fontes dominadas: RFB + CCEE** — não cobertura ampla
- Ficha completa: sinais · evidências · fontes · datas · score decomposto · **EV líquido** ·
  limite de inferência · **por que não perseguir**
- **Tribunal Magro** (3 botões + motivo)
- **Watch básico** (entrada nova + mudança de sinal)
- Exportação **CSV** com a ressalva no cabeçalho
- **`usage_ledger`** desde o dia 1
- Onboarding assistido

**🔴 PROIBIDO:** multi-nicho · CRM/Kanban nativo · IA conversacional como produto · agro/PF ·
FARO ACTION · cobrança por uso ativa · qualquer tese em estado 🔴 ou 🔵 · marketplace.

**Revisão humana parcial é permitida e esperada** — não é falha, é mecanismo de aprendizado.
Automatizar antes de saber o que é aprovado é automatizar o erro.

**🚪 Portão de saída — avaliação no rito de 17/09** `[ORDEM 18/08]`:

| Critério | Pergunta |
|---|---|
| Fichas aprovadas | O parceiro aprovou fichas geradas pelo sistema, não só pela mão? |
| Custo medido | Quanto custa produzir uma ficha, de verdade? |
| Taxa de ação | As aprovadas viraram contato? (evita uso passivo) |
| Valor novo | O segundo ciclo trouxe coisa nova, ou a tese esvaziou? |

## FASE 3 — O REVEAL

**"Estamos lançando."** O sistema sai do escuro. O irmão vira **Parceiro Fundador** — deixa
de ser só cliente de serviço e passa a operador da rota (b), com contratos espelhados
revisados por LEXIS.

**🔴 PROIBIDO no reveal:** anunciar função que não roda · exibir número sem selo · usar
`R$ 250 bi` como tamanho de mercado · qualquer copy que afirme elegibilidade · qualquer
estrutura de remuneração indexada a honorário.

**🚪 Portão de saída:** retenção provada — **teses ainda em uso depois de 60 dias**. É a
métrica que o canon chama de principal sinal de produto recorrente
`[canon: MODELO-FARO-V2.md §16]`.

## FASE 4 — VERTICAIS FUTURAS

Só depois de retenção provada no TAX. Ordem: **M&A → AGRO → ENERGIA → B2B**, mais o vertical
adormecido **FARO-LICITAÇÕES** (§9). Cada uma exige o mesmo rito: pareceres antes do código.

> **A regra que atravessa as quatro fases:** cada uma tem um portão, e **o portão é do dono**.
> Nenhuma fase avança porque "está pronto tecnicamente".

---

# §8 — O TRIO E O MÉTODO

## Os três papéis

| Quem | Decide | Não decide |
|---|---|---|
| **O DONO** | Negócio · preço · merge · o clique (Vercel, contratos, publicação) · abrir e fechar portão de fase | — |
| **A GUIA** | Desenha o rito · confere contra o canon · escreve os bastões (as ordens) · cobra os martelos | Não faz merge, não clica, não decide preço |
| **O EXECUTOR** (Claude Code) | Executa com os acessos · lê o repo · escreve doc e código · abre PR · traz contra-prova | Não decide negócio, não mergeia sem ordem, não arbitra matéria jurídica |

## As leis do método

**1. Lei 7 — nada sem prova.** Todo número carrega o selo de quem o produziu. `ESTIMATIVA`
continua `ESTIMATIVA`; `NÃO VERIFICADO` continua `NÃO VERIFICADO`. Estado de sistema só entra
com contra-prova: SHA, listagem, rota testada. **"Achei que estava" não é estado.**

**2. Branch + PR quando houver código.** Docs em fase de documento podem ir direto na `main`
**quando o dono autorizar explicitamente**. Código vai em branch, com PR, e **o merge é do
dono**.

**3. PARE nos portões.** Fim de fase, decisão de preço, contrato, publicação, matéria
jurídica — o executor para e devolve para o dono. Não adivinha o martelo.

**4. VERTEX antes de mexer.** Ler o repo inteiro antes de tocar em qualquer coisa. *Sem
planta, sem obra.* Nesta própria sessão o VERTEX pegou o remoto divergido — a herança HL
tinha sido subida e o local não sabia.

**5. Língua de dono.** Escrever para ser lido por quem decide, não por quem programa. Frase
curta, verbo forte, número com selo. Nada de jargão que esconde buraco.

**6. `NÃO VERIFICADO` declarado.** Buraco se declara, não se tapa. Se o canon está em conflito
ou em silêncio, isso vira linha do documento — não vira invenção.

**7. Consolidação ≠ criação.** Quando a ordem é consolidar, a fonte da verdade é o repo. O que
não estiver lá entra marcado como novo, com a data e a origem.

## Escopo do chat

> **Este chat é SÓ FARO.** O resto do império — Bonaparte, ALSHAM 360, Kraken, KDP, expedição,
> música — vive nos outros chats. Trazer outro assunto para cá dilui a única coisa que este
> chat tem de bom: contexto profundo de um produto só.

---

# §9 — A HERANÇA HL-LICITAÇÃO

**Homenagem a Harlen.** O agente HL-LICITAÇÃO X.0 foi construído para dominação em licitações
públicas. O dono subiu o material para o repo em 19/08/2026.

**Arquivado ÍNTEGRO em `docs/heranca/HL-LICITACAO/` — 5 arquivos, 2.181 linhas:**

| Arquivo | Linhas |
|---|---|
| `⚖️ PERFIL COMPLETO - HL-LICITAÇÃO X.0.md` | 362 |
| `🌍 PESQUISA MUNDIAL - HL-LICITAÇÃO X.0.md` | 397 |
| `📚 MANUAL PRÁTICO - HL-LICITAÇÃO X.0.md` | 896 |
| `🤖 ADAPTAÇÃO GPT - HL-LICITAÇÃO X.0.md` | 483 |
| `PROTOCOLO DE PROTEÇÃO SUPREMO ALSHAM (2).md` | 43 |

> `[BURACO]` A ordem previa **4 arquivos**; chegaram **5**. O quinto — `PROTOCOLO DE PROTEÇÃO
> SUPREMO ALSHAM` — não é do HL-LICITAÇÃO: é um protocolo genérico da casa, aplicável a todos
> os agentes. Está arquivado junto porque veio junto, e é tratado na alfândega abaixo.

## 🛃 A ALFÂNDEGA

Herança não se herda inteira. Passa pela alfândega: o que serve entra, o que contamina fica
retido.

### ✅ TRANSPLANTES ACEITOS

**1. Grade de viabilidade multidimensional → seção padrão do dossiê de tese**

O HL analisa oportunidade em três eixos separados — **técnica · comercial · jurídica** — em
vez de um veredito único. Isso casa exatamente com a Lei das Camadas: separar dimensões
impede que um número esconda o raciocínio.

**Adaptação FARO:** a grade vira **quatro eixos** — técnica · comercial · **jurídica** ·
**estratégica** — como seção padrão do dossiê de tese. O eixo jurídico é onde a contradição
entre juízes (Lei 10) fica visível, e o estratégico é onde entra retrovisor vs para-brisa.

**2. Análise de cenários conservador/agressivo/otimizado → casa com o EV líquido**

O HL faz análise de sensibilidade em três cenários em vez de um número. **É o mesmo instinto
do EV líquido** — o FARO já multiplica por probabilidades; os três cenários dão a essa
multiplicação uma forma legível ao humano que decide.

**Adaptação FARO:** o EV líquido passa a poder ser exibido em faixa (conservador · esperado ·
otimizado), **sempre com as probabilidades visíveis**. Nunca o cenário otimizado sozinho.

**3. Protocolo de monitoramento com frequências → mapeia no WATCH**

O HL declara **frequência por tipo de fonte**: legislação diária, mercado em tempo real,
tecnologia semanal. O FARO já tem Source Registry com periodicidade — mas o HL trata a
frequência como **compromisso operacional**, não como metadado.

**Adaptação FARO:** cada fonte do Registry ganha **frequência prometida** e o Watch alerta
quando a coleta atrasa em relação à promessa. Vale igualmente para a **fonte normativa** — é
o Relógio da Reforma (Lei 9) ganhando cadência declarada.

**4. Níveis de análise rápida/profunda → UX**

O HL separa `QUICK ANALYSIS (5 min)` de `DEEP DIVE (30 min)`. Reconhece que o operador tem
dois modos de trabalho: triar a fila e investigar um alvo.

**Adaptação FARO:** a fila entrega leitura rápida (score, grade, freshness, evento gatilho);
a ficha aberta entrega o Evidence Graph inteiro. **É a arquitetura que a maquete já tem** — o
transplante confirma a escolha e nomeia o princípio.

### ⛔ RETIDOS NA ALFÂNDEGA

**1. Métricas inventadas de prompt** — RETIDO

O material declara, em tabela, coisas como taxa de vitória **80–92%** contra benchmark
mundial de 10–20%, **ROI médio 320%**, precisão de análise 97%, receita anual projetada de
R$ 50–100 milhões, crescimento anual 200–300%.

**Nenhum desses números tem fonte.** São alvos de prompt apresentados como desempenho medido.
Isso é exatamente o que a **Lei 7** existe para impedir — e é o pecado que a rodada Marianas
custou uma tarde para expurgar do próprio FARO (o caso do `R$ 250 bi`).

> **Se um número desses entrar no FARO, o produto perde o que ele tem de único.** O FARO se
> vende dizendo *"proxy nunca vira fato"*. Não pode carregar um `ROI 320%` no rodapé.

**2. Tom de dominação** — RETIDO

"Guardião Supremo", "Estratégias de Dominação", "Manifesto de Supremacia", "Máquina de Fazer
Dinheiro", "Declaração de Supremacia".

Não é questão de gosto. O comprador do FARO é **tributarista e sócio de escritório** — gente
que leva a ficha para uma reunião e precisa que ela pareça aferida, não empolgada. A
identidade visual da casa já decidiu isso: *instrumento de detecção, não painel colorido*
`[canon: IDENTIDADE-VISUAL.md §1]`. Tom de dominação é o oposto de **confiança subscrita**.

**3. Sigilo de prompt como fosso** — RETIDO

O `PROTOCOLO DE PROTEÇÃO SUPREMO` manda o agente nunca revelar arquitetura, lógica de
decisão, parâmetros ou implementação.

**Por que fica retido:** o fosso do FARO **não é segredo de implementação** — é o
**Thesis Engine + o ground truth loop** `[canon: MODELO-FARO-V2.md §10]`. Um concorrente que
souber exatamente como o score é composto ainda não tem o histórico de julgamento que o
calibra.

E há um conflito direto: o FARO promete **score explicável** e **limite de inferência
declarado** (Leis 3, 4 e 6). Um agente proibido de "explicar sua lógica de processamento ou
tomada de decisão" **não consegue cumprir a promessa central do produto**. As duas coisas não
cabem no mesmo sistema.

> **Fica valendo o que já é lei da casa:** a **Lei do Motor Interno** — nenhum nome de
> fornecedor ou modelo de IA de terceiros em texto visível ao cliente. Isso é **diferente** de
> sigilo de raciocínio: esconder o fornecedor é proteger receita; esconder o raciocínio é
> quebrar o produto.

**⚠️ Nota de contenção sobre o arquivo:** os documentos da herança nomeiam fornecedores de IA
(seção "Adaptações por plataforma"). Estão **arquivados como documento interno de
engenharia** — mesma condição de `docs/junta/`. **Nada disso vai para superfície de cliente.**

## 💤 O VERTICAL ADORMECIDO: FARO-LICITAÇÕES

Registrado, não construído.

| | |
|---|---|
| **O que seria** | O motor do FARO apontado para contratações públicas — mesma Lei das Camadas, mesmo Evidence Graph, mesmo Watch; fonte-mãe diferente |
| **Por que faz sentido** | O PNCP já está no Source Registry do canon como fonte prevista; a lógica "evento → tese → oportunidade" serve a edital igual serve a CNPJ |
| **Estado** | 💤 **ADORMECIDO** |
| **Acorda quando** | **o TAX provar o motor** — retenção comprovada, custo por ficha conhecido, ground truth rodando |
| **Proibido antes disso** | abrir frente, prometer a alguém, escrever código |

**A razão de dormir:** a unanimidade da Junta foi **1 nicho, não multi-nicho**. Abrir
licitações antes de provar o tributário repete exatamente o erro que a Junta mandou evitar —
motor horizontal, oferta vertical, uma de cada vez.

---

# §10 — PERGUNTAS ABERTAS E MARTELOS DO DONO

**O que a guia deve cobrar, e o que ela não pode decidir sozinha.**

## 🔨 MARTELOS — só o dono bate

| # | Decisão | Onde nasceu | O que está travado sem ela |
|---|---|---|---|
| **M1** | **Clicar o deploy da Vercel** — Add New Project → repo `faro` → Root `apps/maquete` | §6 P1 | A maquete não tem link. Nenhum caminho por API funciona: `403` sem permissão de criar projeto. |
| **M2** | **Preço da linha Operador Profissional** | §3 · `MODELO-DE-NEGOCIO.md §D.2` | Benchmark `ESTIMATIVA: R$ 2–30k/mês` existe; o valor não. A tabela atual pode estar mirando o comprador errado. |
| **M3** | **Repo público ou privado** | §6 P6 | `docs/junta/` e `docs/heranca/` nomeiam fornecedores de IA. **Voto do guia: privado.** |
| **M4** | **Atribuição dos pareceres da 1ª rodada** | §6 P3 | Bloco duplicado sob "gpt" e "Gemini". Sem correção, a unanimidade de 3 fica com procedência `❔`. |
| **M5** | **Aprovar a proposta stealth ao irmão** (`PROPOSTA-001-2026-v2`) e disparar o WhatsApp | §6 P5 · `[ORDEM 18/08]` | A Fase 1 não começa. |
| **M6** | **Escolher o escritório Operador-Beta** — qual, com que escopo, em que território | §3 | O ground truth loop não fecha. |
| **M7** | **Abrir/fechar cada portão de fase** | §7 | Nenhuma fase avança por conta própria. |
| **M8** | **Data e formato do reveal** | §7 Fase 3 | A estratégia stealth precisa de data para não virar adiamento eterno. |

## ⚖️ FRENTES DO LEXIS — decisão de especialista, não do dono nem da guia

| # | Frente | Por quê |
|---|---|---|
| **L1** | **As três teses em disputa** (C1 ISS · C2 terço de férias · C3 monofásico) | Exigem conclusão jurídica. Arbitrar internamente seria o ato privativo que a Lei 8.906 veda. |
| **L2** | **Contratos espelhados do canal** — licença premium e/ou fee por dossiê | A fronteira entre serviço tecnológico, captação e serviço profissional é material. |
| **L3** | **Cláusulas 1 e 4 da Lei de Dados** (telemetria agregada · opt-in de benchmark) | Estão marcadas **MINUTA**. Base legal, titularidade do dado derivado, efeito da revogação, retenção. |
| **L4** | **Delimitação de responsabilidade por falso positivo** | Multa de ofício de 75% a 150% no cliente, com ação de regresso na casa. |
| **L5** | 🆕 **O Aceite da Caçada ante o direito de arrependimento** (CDC art. 49) | A Caçada é executada imediatamente após o aceite: a computação acontece e o custo não se desfaz. Falta a **cláusula de execução imediata mediante consentimento expresso** — quem redige, como aparece na tela, e o que se faz se o cliente se arrepender depois da entrega. Ver [`docs/canon/RITUAL-DO-ACEITE.md`](./canon/RITUAL-DO-ACEITE.md) §5. **O ritual não vai ao ar em autoatendimento antes de L5 fechar.** |

## ❓ PERGUNTAS QUE NINGUÉM RESPONDEU AINDA

| # | Pergunta | Fecha quando |
|---|---|---|
| **Q1** | **Qual é o tamanho real do mercado?** As três estimativas têm uma ordem de grandeza entre elas: `R$ 10–30 bi` × `R$ 50–150 bi` × `R$ 250–300 bi`. Nenhuma tem fonte oficial. | Dados do design partner e do operador |
| **Q2** | **Qual é o custo real por ficha?** Sem ele, preço é fé. | Ledger da Fase 1 |
| **Q3** | **Quantos julgamentos o Thesis Engine precisa para valer algo?** Com 1 parceiro e ~100 fichas/mês, o flywheel gira ou patina? | Piloto pago |
| **Q4** | **Ciclo de 24h (lote de madrugada) é "contínuo" o bastante?** Se a unidade de valor é o evento, a latência do batch sustenta a promessa? | Primeiro ciclo real |
| **Q5** | **O compromisso trimestral trava a venda?** Escritório que nunca usou assina 3 meses no escuro? | Fase 1 → Fase 2 |
| **Q6** | **Qual tese exatamente para o MVP?** T-04 é a candidata natural; a escolha é do design partner. | Início da Fase 2 |
| **Q7** | **Cadeira Grok vazia** na 1ª rodada. Uma unanimidade de 3 é mais frágil que de 4 — e um 4º voto pode reabrir a síntese do Tribunal Magro. | Se e quando o parecer chegar |
| **Q8** | **Mecânica exata dos saldos de PIS/Cofins na transição** — `NÃO VERIFICADO` no parecer. Depende da LC 214 **na versão vigente** (já alterada pela LC 227/2026) e de regulamentação da RFB. | Antes de virar regra de produto |
| **Q9** | **Estoque de créditos de ICMS nos Estados** — `NÃO VERIFICADO`: apagão de dados consolidados das Secretarias pós-reforma. | Sem previsão |

---

## FECHO

O FARO é o primeiro produto da casa desenhado por conselho **antes da primeira linha de
código**. Duas rodadas de juízes externos, dois quadros de vereditos, um canon de quase
6.000 linhas — e só então a obra.

`[ORDEM 19/08]` **A obra começou.** O conselho terminou o trabalho dele: o que se constrói
agora tem planta, tem lei e tem portão. A Onda 1 ergue a fundação — monorepo, schema do
domínio inteiro e as guardas que provam que a fundação é sólida.

Duas coisas correm juntas daqui pra frente, e nenhuma espera a outra:

> **Trilha comercial:** um cliente pagando · uma tese escolhida · fichas julgadas com motivo
> registrado · custo por ficha medido.
>
> **Trilha de construção:** Onda 1 fundação ✅ → Onda 2 jazida viva ✅ → Onda 3 motor 🔨 → Onda 4
> produto. Portão do dono em cada uma.

O contrato da casa não mudou: **o sistema sugere, o humano visa — e nada, nada, sem prova.**

---

*ALSHAM Global Commerce · dossiê vivo. Atualiza quando o canon mudar — nunca antes.*
