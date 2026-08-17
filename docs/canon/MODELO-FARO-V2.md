# FARO™ — MODELO DE PRODUTO v2
## Inteligência Contínua de Oportunidades
**ALSHAM Global Commerce · v2 consolidada · 17/08/2026**

> **Não procure clientes. Ensine o FARO a encontrá-los.**

---

## STATUS DESTE DOCUMENTO

Este é o **canon do PRODUTO**: a especificação consolidada que resulta da fusão do modelo v1
do fundador (preservado em `DOSSIE-V1.md`) com as emendas da Junta de Juízes externa
(3 pareceres em `../junta/`, sínteses em `../junta/QUADRO-DE-VEREDITOS.md`), mais as
emendas da 2ª rodada (Fossa das Marianas, `../junta/marianas/`).

O canon do **NEGÓCIO** — rota de entrada, tamanho de mercado, fronteira legal, economia
unitária e pricing — está em [`MODELO-DE-NEGOCIO.md`](./MODELO-DE-NEGOCIO.md). Os documentos
são irmãos: este descreve o que o produto faz; aquele, por que ele se paga.

| Documento | Cobre |
|---|---|
| **Este** | O produto: leis, score, evidência, fontes, watch, tribunal, MVP |
| [`MODELO-DE-NEGOCIO.md`](./MODELO-DE-NEGOCIO.md) | O negócio: decisão selada, iceberg, economia unitária, pricing |
| [`LEI-DE-DADOS.md`](./LEI-DE-DADOS.md) | A fronteira entre o dado da casa e o do assinante |
| [`CANAL-OPERADOR-PARCEIRO.md`](./CANAL-OPERADOR-PARCEIRO.md) | A rota (b), o muro legal e o ground truth loop |
| [`CATALOGO-DE-TESES-DA-CASA.md`](./CATALOGO-DE-TESES-DA-CASA.md) | As teses que a casa opera, com proveniência |

**O que existe hoje:** este modelo + uma maquete de interface com dados fictícios.
**O que não existe hoje:** motor, coleta, banco, score real, cobrança, qualquer produto rodando.

O motor só nasce quando existir um **design partner pagante**. Esta é uma decisão, não um atraso.

Toda afirmação de capacidade neste documento está no **futuro condicional** ou marcada como
**hipótese**. Nada aqui autoriza copy no presente do indicativo sobre função que não roda.

---

## 1. IDENTIDADE E POSICIONAMENTO

**Nome:** FARO™
**Categoria:** Inteligência Contínua de Oportunidades
**Tagline:** *"Não procure clientes. Ensine o FARO a encontrá-los."*
**Oferta vertical de estreia:** **FARO TAX** (tributário)
**Motor:** horizontal, nos bastidores, não vendido como tal

### A frase de posicionamento

> O FARO transforma teses comerciais em inteligência acionável. Ele cruza fontes públicas,
> detecta sinais, reúne evidências, calcula aderência e entrega as empresas que merecem ser
> abordadas — com o porquê, a fonte e o momento.

### A distinção competitiva

A comparação **não é** "temos mais dados que os concorrentes". Plataformas horizontais já
comunicam escala (Econodata: 28M+ empresas ativas; Speedio: 25M empresas, 17M decisores,
planos a partir de R$719/mês; Cortex: inteligência ampla de Go-to-Market com dados, IA e
especialistas). Entrar por volume de CNPJ, quantidade de filtros ou número de telefones é
uma guerra perdida por definição.

A comparação é:

> **Uma base entrega empresas. O FARO entrega uma hipótese de oportunidade com rastreabilidade.**

### Correção de uma frase do v1

O v1 afirmava: *"Ninguém entrega o meio: tese viva, monitorada, com fonte, por assinatura."*

Isso é boa provocação e má afirmação de mercado. Inteligência comercial já existe; buyer
intent e intent scoring já existem internacionalmente (Apollo, 6sense). A afirmação
defensável é outra:

> **Nós transformamos uma tese comercial específica em uma máquina contínua de descoberta de
> oportunidades comprováveis.**

### O que o FARO NÃO é

Não é uma lista de empresas. Não é promessa de faturamento. Não é parecer tributário. Não é
garantia de conversão comercial. Não é substituto do especialista habilitado. **A clareza
desses limites é parte do produto e do fosso de confiança** — não é rodapé legal.

---

## 2. A UNIDADE DE VALOR É O EVENTO

Esta é a mudança conceitual mais importante da v2.

O v1 pensava: *"encontrei uma empresa."*
A v2 pensa: **"encontrei uma mudança."**

| | v1 | v2 |
|---|---|---|
| Unidade | Empresa que bate no filtro | Evento: mudança de estado observável |
| Natureza | Estoque | Fluxo |
| Consumo | A lista se esvazia | O evento continua acontecendo |
| Economia | Churn de lista | Assinatura legítima |

Exemplos de evento: a empresa abriu nova filial · mudou de atividade · entrou em determinado
cadastro · saiu de determinado regime · aumentou faixa de empregados · ganhou contrato
público relevante · passou a apresentar determinada combinação de sinais.

A cadeia é: **evento → tese → oportunidade**.

Consequência arquitetural: o FARO é *event-driven*. A captura de uma **mudança de estado** de
um CNPJ é o que gera o gatilho de urgência para quem aborda. Uma base entrega a fotografia;
o FARO precisa entregar o filme.

Consequência econômica: uma lista pode ser consumida em dois meses e o assinante sai. Um
fluxo de eventos não se esvazia. É por isso que a recorrência é honesta e não uma trava
artificial de plano.

---

## 3. A LEI DAS CAMADAS (fundamental)

Nenhuma afirmação do FARO pode existir fora desta cadeia. É lei de produto, não boa prática.

```
DADO  →  SINAL  →  INFERÊNCIA  →  TESE  →  OPORTUNIDADE
```

**Camada 1 — DADO.** O que a fonte efetivamente informa. Nada além.
*Ex.: CNPJ ativo · CNAE X · UF GO · capital social Y · inscrição em determinado cadastro.*

**Camada 2 — SINAL.** Evento ou característica derivada dos dados.
*Ex.: "passou a ter nova filial" · "deixou determinado regime" · "apareceu em determinado
cadastro" · "aumentou faixa de empregados".*

**Camada 3 — INFERÊNCIA.** O cruzamento de sinais produz uma hipótese — e a hipótese é
declarada como hipótese.
*Ex.: "o conjunto de sinais apresenta alta aderência ao perfil definido na tese".*

**Camada 4 — TESE.** A lógica comercial do assinante, parametrizada por ele.
*Ex.: "empresas do setor X, acima de determinado porte, com determinado perfil tributário e
determinado sinal operacional são potenciais clientes para o serviço Y".*

**Camada 5 — OPORTUNIDADE.** Só existe quando a combinação passa os critérios mínimos da tese.

### Obrigação por afirmação

Cada linha exibida ao assinante carrega, sem exceção:

| Atributo | Obrigatório |
|---|---|
| Fonte (`source_id`) | Sim |
| Data de coleta (`collected_at`) | Sim |
| Data de referência do dado (`reference_date`) | Sim |
| Regra de transformação aplicada | Sim |
| **Limite de inferência** | Sim |

O campo **limite de inferência** é obrigatório na ficha e diz explicitamente: o que é dado
observado, o que é proxy, e o que depende de validação humana.

O FARO deve conseguir dizer, sempre, cinco coisas: o que sabemos · o que observamos · o que
inferimos · por que isso importa · **o que ainda não sabemos**.

---

## 4. FARO SCORE™ — DECOMPOSTO E EXPLICÁVEL

Score único e misterioso está **proibido**. Nunca "a IA deu 87".

O score é a soma explícita de dimensões visíveis:

| Dimensão | O que mede |
|---|---|
| Fit estrutural | Quanto o perfil da empresa casa com os parâmetros da tese |
| Evidência da tese | Quantas evidências independentes sustentam a hipótese |
| Recência | Quão novo é o sinal que disparou a oportunidade |
| Qualidade das fontes | Grau das fontes que sustentam as afirmações (E1/E2/E3) |
| Intensidade do sinal | Força do evento observado |
| Confiança da inferência | Quanto o salto lógico depende de proxy ou validação humana |

A leitura correta é: **"87 porque cumpriu 8 de 10 critérios, possui 5 evidências
independentes e 2 sinais recentes"** — não "87 porque o modelo disse".

Consequência de produto: o assinante entende *por que* aquela empresa está em primeiro lugar,
e pode discordar da ponderação. Discordar alimenta o Thesis Engine (§9).

Consequência de venda: é isso que torna o produto vendável a contador, advogado tributarista,
consultor e M&A — gente que vive de sustentar tese diante de terceiros.

### 4.1 O NÚMERO-MESTRE DA FICHA É O EV LÍQUIDO — NÃO O BRUTO

*(emenda da rodada Fossa das Marianas — origem: parecer Manus)*

O score mede **aderência à tese**. Ele não responde à pergunta que o assinante
realmente faz: *quanto disso vira dinheiro?* Para isso existe o **valor esperado
líquido**, e ele é o número em destaque na ficha.

```
EV LÍQUIDO =
      oportunidade bruta
    × probabilidade de elegibilidade
    × probabilidade de homologação/uso
    × ajuste de prazo de caixa
    − custo de documentação
    − honorários do habilitado
```

> ### "Um produto que acusa R$ 3 milhões e converte R$ 100 mil líquidos é pior que um produto que identifica R$ 400 mil com 80% de conversão."
> — parecer Manus, rodada Marianas

**Regra de exibição:** o EV líquido aparece em destaque. O **bruto é componente
subordinado**, exibido sempre ao lado das probabilidades que o reduzem — nunca
sozinho, nunca maior que o líquido na hierarquia visual.

Isso inverte o instinto comercial de propósito: **o número grande na tela é um
passivo se não converter.** Vender bruto é o que o mercado faz; é também o que
produz o falso positivo que gera multa no cliente e ação de regresso na casa.

**As cinco camadas do crédito** (taxonomia do parecer GPT, adotada):

```
Potential Credit → Eligible Credit → Validated Credit → Recoverable Credit → Recovered Cash
```

O mercado vende a primeira camada como se fosse a última. O FARO nomeia as cinco e
diz em qual delas cada ficha está.

**De onde vêm as probabilidades:** enquanto não houver ground truth, são faixas
declaradas dos pareceres, **com selo `ESTIMATIVA`**. Quando o operador parceiro
devolver conversão real, passam a ser medidas. Ver
[`CANAL-OPERADOR-PARCEIRO.md`](./CANAL-OPERADOR-PARCEIRO.md) — ground truth loop.

### 4.2 CAMPO "POR QUE NÃO PERSEGUIR" — o produto de dizer não

*(emenda da rodada Fossa das Marianas — origem: parecer GPT)*

Toda ficha carrega, obrigatoriamente, um campo que argumenta **contra** ela própria.

O funil real do mercado, conforme o parecer GPT:

```
100.000 empresas prospectadas
 10.000 parecem ter oportunidade
  2.000 realmente têm
    500 têm documentação suficiente
    200 conseguem recuperar
     50 têm ticket economicamente relevante
```

**0,05% do topo vira negócio relevante.** Num funil assim, o valor de eliminar
rápido é igual ao valor de encontrar. Daí a pergunta comercial que reposiciona o
produto:

> **"Quem está disposto a pagar para saber quais oportunidades NÃO devem ser
> perseguidas? Essa informação vale tanto quanto encontrar dinheiro."**
> — parecer GPT, rodada Marianas

O campo lista, em texto direto, o que **desaconselha** a caçada: documentação
provavelmente ausente · período possivelmente prescrito · precedente desfavorável na
tese · fonte degradada na janela · sinal isolado sem corroboração · porte incompatível
com o custo do trabalho · **capacidade de utilização do crédito duvidosa** (o ponto
cego do parecer Manus: sem débito compensável, tributo corrente ou apetite para
litigar, o valor do alvo é artificial).

**Consequência de arquitetura:** este campo é o que transforma o FARO de gerador de
leads em **infraestrutura de underwriting** — a síntese do ponto cego triplo da Junta:

> **O produto é confiança subscrita, não lead.**

Ver [`../junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md`](../junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md) Parte 5.

---

## 5. FARO CONFIDENCE POLICY™

**Lei:** proxy NUNCA vira fato. O sistema jamais transforma proxy em afirmação.

Caso canônico — faturamento. Faturamento acima de R$100M **não é público por empresa**.

| Proibido | Obrigatório |
|---|---|
| "Faturamento: R$ 150 milhões." | "Faturamento observado: não disponível." |
| Número estimado apresentado como dado | "Proxy de porte: compatível com empresas acima do limiar definido." |
| | "Evidências do proxy: capital social · obrigatoriedade de Lucro Real acima do limiar legal · balanço publicado · classificação · rankings públicos." |

Quem promete certeza de faturamento vende achismo. O FARO declara o limite — e é por isso
que é crível.

Isso deixa de ser ética e passa a ser característica de marca: **o FARO sabe diferenciar fato
de hipótese.**

---

## 6. EVIDENCE GRAPH E EVIDENCE GRADE

### 6.1 Evidence Graph (por oportunidade)

Cada oportunidade carrega sua árvore auditável:

```
EMPRESA
│
├── DADO
│   └── CNPJ
│
├── PERFIL
│   ├── CNAE
│   ├── porte
│   ├── localização
│   └── atividade
│
├── SINAIS
│   ├── sinal A
│   ├── sinal B
│   └── sinal C
│
├── FONTES
│   ├── fonte-mãe empresarial
│   ├── fonte complementar 1
│   └── fonte complementar 2
│
├── TESE
│   └── (tese do assinante)
│
└── CONCLUSÃO
    └── grau de aderência + limite de inferência
```

Cada nó guarda: fonte → data da coleta → data de referência → transformação → confiança.
O nome interno da cadeia: **Opportunity Evidence Chain™**. O efeito: o assinante consegue
**auditar** a oportunidade, não apenas confiar nela.

### 6.2 Evidence Grade — os três níveis de evidência

| Nível | Natureza | Exemplos de origem |
|---|---|---|
| **E1** | Fonte oficial | Órgão público, autarquia, agência reguladora, portal oficial de contratações |
| **E2** | Fonte institucional / derivada | Associações setoriais, rankings, bases secundárias, documentos institucionais |
| **E3** | Sinal externo | Notícia, site corporativo, vaga aberta, comunicação pública, evento |

A oportunidade recebe um **grade consolidado A–D**, derivado da composição dos níveis das
evidências que a sustentam. O assinante sabe, antes de gastar uma ligação, se está diante de
evidência forte (A) ou hipótese exploratória (D).

---

## 7. SOURCE REGISTRY™ E FRESHNESS

### 7.1 O registro de fontes

O FARO **não é uma base de dados**. É uma **camada de inteligência sobre múltiplas bases
públicas**. Essa distinção é fundamental e muda o desenho: não competimos por posse de dado,
competimos por leitura de dado.

Toda fonte cadastrada carrega ficha própria:

| Campo | Função |
|---|---|
| `source_id` | Identificador estável, citado em cada afirmação |
| nome · órgão | Origem declarada ao assinante |
| endpoint / forma de acesso | Como se coleta |
| tipo · periodicidade | Ritmo real de atualização da fonte |
| última coleta · próxima coleta | Base do Freshness |
| licença | O que se pode fazer com o dado |
| campos disponíveis | O que a fonte realmente entrega |
| cobertura | Universo efetivamente coberto (não o prometido) |
| confiabilidade | Grau E1/E2/E3 |
| status | Viva · degradada · indisponível |
| **fallback declarado** | O que o produto faz quando a fonte cai |

Cada dado carregado carrega: `source_id` · `collected_at` · `reference_date` ·
`source_version` · `hash` · `confidence`.

**Regra de integridade (lei da casa):** toda fonte é **provada viva antes de ser prometida**.
Quando uma fonte estiver indisponível, o produto **declara a limitação** e não apresenta
inferência como fato.

A arquitetura registra disponibilidade, versão, data de coleta, taxa de erro, alteração de
estrutura e cobertura efetiva. Fonte que muda de formato quebra pipeline — daí os vigias de
colheita e o painel interno de saúde das fontes.

### 7.2 Freshness Score

Uma oportunidade não tem só score de aderência. Tem idade.

| Sinal | Faixa | Leitura |
|---|---|---|
| 🟢 | Atual | Dado recém-coletado |
| 🟡 | Recente | Ainda operacional |
| 🟠 | Desatualizando | Exige atenção antes de abordar |
| 🔴 | Fonte antiga | Não abordar sem revalidar |

O FARO vende o **presente**, não o histórico. Sem Freshness visível, a promessa de
"inteligência contínua" não se sustenta.

---

## 8. FARO WATCH™ — O CORAÇÃO DA ASSINATURA

O v1 já tinha o conceito certo (empresa nova entra sozinha; empresa monitorada que muda
avisa). A v2 promove isso de funcionalidade a **coração do SaaS**.

O assinante pode monitorar:

- uma **tese** ("avise-me sempre que aparecer empresa que cumpra minha tese")
- uma **empresa** específica
- um **mercado** / recorte
- um **tipo de evento**

O Watch é o que transforma a entrega em fluxo. É o que justifica a mensalidade sem inventar
trava de plano.

### Família de módulos (destino, não MVP)

| Módulo | Função | No MVP? |
|---|---|---|
| FARO FIND | Encontrar oportunidades agora | Sim |
| FARO WATCH | Monitorar continuamente | Sim (básico) |
| FARO PROOF | Evidências e fontes | Sim |
| FARO SCORE | Priorizar | Sim |
| FARO ACTION | Transformar oportunidade em ação comercial | **Não** |

### 8.1 MÓDULO RELÓGIO DA REFORMA

*(emenda da rodada Fossa das Marianas — origem: unanimidade 3×0)*

O Watch não monitora só mudança de estado de **empresa**. Monitora também mudança de
estado da **norma** — e, na janela 2026–2033, essa é a fonte de evento mais densa que
existe.

| Evento monitorado | Por que é evento |
|---|---|
| Alteração de lei complementar, MP ou instrução normativa | Muda a regra que sustenta a tese |
| Marco do calendário da transição | 2027 fim do PIS/Cofins · 2029–2032 substituição gradual de ICMS/ISS |
| Precedente novo em tese do catálogo | Pode nascer, enfraquecer ou **matar** uma tese |
| Janela de utilização de saldo credor se aproximando | Urgência datada, por empresa |
| Fonte normativa mudando de versão | Dispara releitura das regras dependentes |

**Por que isto pertence ao Watch e não a um módulo separado:** a unidade de valor do
FARO é o evento (§2). Uma norma que muda **é** uma mudança de estado — só que atinge
a carteira inteira de uma vez, em vez de uma empresa.

#### 🔴 A regra dura da vigilância normativa

> **A LC 214/2025 já foi alterada pela LC 227/2026.**
>
> O produto lê a **versão VIGENTE**, nunca a decorada. Regra de produto escrita
> contra texto legal desatualizado é falso positivo com aparência de rigor — o pior
> tipo, porque passa em revisão.

Consequência para o Source Registry (§7.1): fonte **normativa** entra no registro com
os mesmos campos das fontes de dado — versão, data de coleta, status e fallback. Um
texto legal tem versão do mesmo jeito que um cadastro tem data de coleta.

#### Detectar tese morta, não só tese viva

> *"Tese estática = produto fraco. Tese versionada em tempo real = produto forte."*
> — parecer GPT, rodada Marianas

Na primeira rodada de três juízes sobre o mercado, **três teses do top-8 já estavam
em disputa**. Por isso o catálogo carrega **estado** (ativa · estudo · segmentada ·
contraditada · morta) e **data de última verificação** — e o Watch é quem atualiza
esse estado. Ver [`CATALOGO-DE-TESES-DA-CASA.md`](./CATALOGO-DE-TESES-DA-CASA.md).

**Fora do MVP.** Registrado como o módulo seguinte, não como promessa presente.

---

## 9. TRIBUNAL MAGRO (síntese adotada)

Aqui a Junta divergiu e a v2 decide.

**Divergência:** um parecer mandou **cortar** o Tribunal da v1 (é mais um Kanban genérico;
foque a engenharia no motor de caça; um CSV resolve). Outro mandou **manter e expandir** (é o
loop de feedback; sem ele o score não aprende e a confiança cai).

**Síntese adotada — TRIBUNAL MAGRO:**

| Entra | Fica fora |
|---|---|
| Julgamento de **3 botões + motivo**: aprovar · descartar · monitorar | Kanban / pipeline nativo |
| O motivo do descarte como dado estruturado | Estágios de negociação |
| Registro que alimenta o Thesis Engine | Gestão de contato e follow-up |
| Exportação CSV para o CRM do assinante | Integrações profundas com todos os CRMs |

O raciocínio: **o loop de feedback é o moat, o Kanban é commodity.** Construir CRM é gastar
engenharia onde o assinante já tem ferramenta. Não capturar o julgamento é matar o único
ativo que não se copia. O Tribunal Magro preserva o loop e recusa o CRM.

Sem esse botão, o cliente liga para o "alvo perfeito", descobre que a realidade operacional
não bate com o dado declaratório, e o FARO **não aprende nada**. Falso positivo sem captura
é falso positivo eterno.

---

## 10. O MOAT — THESIS ENGINE E O FLYWHEEL

**O fosso não é a fonte.** Fonte pública muda, é replicável, e qualquer concorrente acessa a
mesma. Quem diz "nosso diferencial é ter dado público" não tem diferencial.

O fosso é o **Thesis Engine**: o conhecimento operacional acumulado sobre

- quais sinais importam;
- quais combinações funcionam;
- quais combinações geram falso positivo;
- quais fontes são confiáveis na prática;
- que peso cada sinal merece;
- quais eventos **precedem** uma oportunidade;
- quais oportunidades viram reunião, quais viram proposta, quais viram venda.

### O flywheel

```
        TESE
         ↓
        CAÇA
         ↓
   OPORTUNIDADES
         ↓
  JULGAMENTO HUMANO   ← Tribunal Magro
         ↓
     ABORDAGEM
         ↓
     RESULTADO
         ↓
      FEEDBACK
         ↓
  RECALIBRAGEM DA TESE
         └──────────→ volta pra CAÇA, melhor
```

Isso é difícil de copiar porque não está no dado — está no histórico de julgamento de quem
vive da tese. Cada ciclo aumenta a distância.

### Arquitetura conceitual

```
                      FARO OS
                         │
                ┌────────┴────────┐
                │                 │
          SOURCE ENGINE      THESIS ENGINE
                │                 │
          ┌─────┴─────┐      ┌────┴────┐
          │           │      │         │
       fonte-mãe   fontes  regras   pesos
       empresarial  compl.  sinais  contexto
                              eventos exceções
                │                 │
                └────────┬────────┘
                         ↓
                  OPPORTUNITY ENGINE
                         ↓
                   EVIDENCE ENGINE
                         ↓
                     SCORE ENGINE
                         ↓
                   TRIBUNAL MAGRO
                         ↓
                     FARO WATCH
                         ↓
                    (FARO ACTION)
                         ↓
                     RESULTADOS
                         ↓
                    FEEDBACK LOOP
                         └──────────→ THESIS ENGINE
```

Isso é plataforma, não aplicação. Mas nasce em pedaços, e o primeiro pedaço é o §12.

---

## 11. ARQUITETURA DE EXECUÇÃO — LOTE, NÃO TEMPO REAL

Decisão técnica gravada como lei, vinda da Junta (unanimidade nos dois pareceres que
tocaram o tema):

**Nunca processar a jazida em tempo real.** Fazer joins complexos e busca textual em uma
tabela de dezenas de milhões de registros a cada request destrói a performance — e as
políticas de isolamento por assinante (RLS) somam latência exatamente nas consultas mais
pesadas.

O padrão:

1. **Varredura em LOTE de madrugada** — o motor de caça roda em batch contra as teses ativas.
2. **Depósito em tabela isolada e leve** — as fichas prontas, já pontuadas, por tenant.
3. **Materialized views** para os resultados de score.
4. **O front do assinante lê ficha pronta do próprio tenant, em milissegundos.**
5. **Indexação impecável da jazida** — não é otimização posterior, é requisito de fundação.

O assinante nunca espera o motor pensar. Ele lê o que o motor já pensou.

Custo de atualização das bases é risco declarado: a jazida empresarial é pesada (dezenas de
GB), e o pipeline de ingestão precisa ser barato e confiável antes de ser amplo.

---

## 12. MVP — FARO TAX

O MVP não tenta caçar tudo. Prova que **uma tese estreita produz uma fila confiável, usada
e renovável**.

| Entra no MVP | Fica FORA da primeira versão |
|---|---|
| Fonte-mãe empresarial + 1 fonte complementar (**2 fontes**, dominadas) | Cobertura ampla de fontes |
| **1 a 3 teses** tributárias estreitas | Catálogo multi-nicho |
| Ficha completa: sinais · evidências · fontes · datas · racional · score decomposto · limite de inferência | Promessa de faturamento observado |
| **Tribunal Magro** (3 botões + motivo) | CRM nativo, Kanban, automações complexas |
| **Watch básico** (entrada nova + mudança de sinal) | Todo tipo de alerta possível |
| Exportação **CSV** | Integrações profundas com CRMs |
| **`usage_ledger`** — consumo, custo e qualidade desde o dia 1 | Cobrança por uso já ativa |
| **Onboarding assistido** | Autosserviço sem acompanhamento |
| | **Agro e dados de pessoa física** — até parecer jurídico |
| | IA conversacional como produto |
| | FARO ACTION |

**Fonte-mãe + CCEE** são o par de estreia: duas fontes que se domina de verdade, contra a
tese tributária de maior dor aguda.

A primeira versão pode operar com **revisão humana parcial**. Isso não é falha, é mecanismo
de aprendizado: a automação vem depois de se saber quais sinais são aprovados, quais são
descartados e quais geram ação comercial. Automatizar antes disso é automatizar o erro.

---

## 13. CLIENTE INICIAL E BEACHHEAD

Decisão: **1 nicho, não multi-nicho.** O motor é horizontal; a oferta comercial é vertical.

O tributário tem a dor mais aguda e o ciclo de monetização mais claro: quem fecha contrato de
recuperação ganha por êxito, e portanto consegue calcular o ROI da oportunidade. O agro exige
lógica geoespacial e bases estaduais descentralizadas que poluem a arquitetura inicial —
entra depois, como módulo, com parecer jurídico na mão.

| Dimensão | ICP inicial |
|---|---|
| Comprador | Sócio, diretor comercial ou consultor líder de escritório tributário B2B |
| Operação | Outbound recorrente, com responsável claro por pesquisar e abordar |
| Dor | Horas gastas montando listas · baixa confiança na priorização · dado que envelhece |
| Capacidade de pagamento | Já investe em aquisição, pré-vendas, dados ou inteligência |
| Necessidade | Uma tese com critérios observáveis em fontes públicas |
| Resultado esperado | Fichas aprovadas · contatos trabalhados · reuniões · diagnósticos |
| **Fora do foco inicial** | BDR genérico · M&A amplo · agro com dados de pessoa física · empresa sem rotina comercial |

A entrada é ainda mais estreita: **uma tese tributária por vez**, escolhida com o design
partner.

### Ordem de expansão (depois de provar retenção)

FARO TAX → FARO M&A → FARO AGRO → FARO ENERGIA → FARO B2B.

---

## 14. LINGUAGEM JURÍDICA DE PRODUTO

Isto vale para interface, copy, e-mail, proposta e resposta de API. Não é sugestão.

| PROIBIDO | OBRIGATÓRIO |
|---|---|
| "empresa elegível" | "sinais compatíveis para investigação" |
| "crédito garantido" | "hipótese que justifica investigação técnica" |
| "direito a R$ X" | "porte compatível com o limiar da tese" |
| "cliente certo" | "alvo que merece ser investigado" |
| "a empresa tem direito a recuperar" | "esta empresa apresenta N evidências compatíveis com a tese X" |

A diferença entre as duas colunas é a diferença entre um produto e um passivo.

A análise técnica e a conclusão tributária **continuam sendo responsabilidade do
profissional habilitado**. O FARO organiza evidência para priorizar investigação; não emite
parecer.

---

## 15. LGPD E TRATAMENTO DE DADOS

O v1 dizia: *"dados de PJ são públicos por lei."* **Simplificador demais — reescrito.**

> Dados cadastrais de pessoas jurídicas e dados pessoais associados a pessoas naturais
> — incluindo MEI e empresário individual, em que a pessoa natural e a atividade empresarial
> se confundem — serão tratados segundo **classificação jurídica própria, finalidade,
> necessidade, base legal aplicável e controles de proteção de dados**.
>
> **O FARO não assume que "público" significa "livre para qualquer finalidade."**

Consequências operacionais:

- Dado pessoal é informação relacionada a pessoa natural. MEI e empresário individual exigem
  tratamento específico, não podem ser varridos junto com PJ pura.
- Legítimo interesse **não é carta branca**: exige análise concreta, finalidade legítima,
  minimização e consideração dos direitos e expectativas do titular.
- Sócios e produtores rurais entram sob análise jurídica prévia, com finalidade definida e
  governança própria.
- O **bloco agro permanece fora do MVP** até existir parecer jurídico e caso de uso específico.
- O produto nasce com o parecer, não remenda depois (protocolo LEXIS da casa).

### 15.1 A TESE DO ASSINANTE É DO ASSINANTE

*(emenda da rodada Fossa das Marianas — Lei de Dados, aprovada pelo dono)*

A LGPD trata do dado de terceiros. Falta a fronteira do dado **do próprio cliente** —
e ela é crítica porque a casa faz duas coisas ao mesmo tempo: vende a pá **e**
garimpa com tenant próprio.

> **Regra de ouro: a tese do assinante é do assinante.** Tenant isolado. A pesquisa
> do cliente é dele. A ALSHAM nunca vê nem deriva.

Quatro camadas lícitas de aprendizado: **telemetria agregada e anônima** declarada em
contrato · **catálogo próprio** da casa · **dado público** com auditoria de
proveniência · **opt-in** declarado como feature contratada.

Linha vermelha: copiar tese individual é concorrência desleal e violação de segredo
de negócio — **e mata o fosso**, porque um assinante que desconfia da plataforma para
de julgar, e sem julgamento o Thesis Engine (§10) não gira.

Texto completo, cláusulas-minuta e mecanismos de verificação:
[`LEI-DE-DADOS.md`](./LEI-DE-DADOS.md).

### 15.2 CLÁUSULA-BLINDAGEM — "sugestão de dados vs. decisão do contribuinte"

*(emenda da rodada Fossa das Marianas — origem: parecer Gemini)*

**O risco concreto:** a Receita Federal tem **5 anos** para homologar uma
compensação. Se a tecnologia apontar crédito indevido, o contribuinte sofre **multa
de ofício de 75% a 150%** — e, no mercado real, **processa a consultoria/tech
exigindo reparação**.

Um erro de score não custa reputação. Custa multa no cliente e ação de regresso na
casa. Por isso a blindagem não é cláusula de rodapé: aparece **em todo o fluxo** —
ficha, limite de inferência, dossiê, contratos espelhados e **cabeçalho da exportação
CSV** (dado que sai da plataforma leva a ressalva junto).

A formulação obrigatória: o FARO apresenta **sugestão de dados**; a **decisão é do
contribuinte**, assessorado por profissional habilitado. Detalhamento:
[`CANAL-OPERADOR-PARCEIRO.md`](./CANAL-OPERADOR-PARCEIRO.md).

---

## 16. ECONOMIA UNITÁRIA

Preço só se valida junto com o **custo de produção da ficha** e o **valor percebido**. Por
isso o `usage_ledger` entra no dia 1: sem custo por ficha conhecido, preço é chute.

O ledger acompanha, por cliente e por tese: volume processado · armazenamento · computação ·
enriquecimento · revisão humana · fichas publicadas · fichas aprovadas · ações realizadas ·
oportunidades geradas.

| Métrica | Fórmula | Por que importa |
|---|---|---|
| Custo por ficha publicada | Custos diretos da tese ÷ fichas publicadas | Define margem real |
| Taxa de aprovação | Fichas aprovadas ÷ fichas entregues | Mede aderência percebida |
| Taxa de ação | Fichas com contato ÷ fichas aprovadas | Evita uso passivo |
| Custo por oportunidade aprovada | Custos variáveis + operação ÷ fichas aprovadas | Compara custo com valor |
| Cobertura nova mensal | Empresas ou sinais novos ÷ universo monitorado | Sustenta recorrência |
| **Retenção de tese** | Teses usadas após 60 dias ÷ teses iniciadas | **Principal sinal de produto recorrente** |
| Margem de contribuição | Receita − custos variáveis − suporte incremental | Orienta preço e escala |

### 16.1 Preços — HIPÓTESE DE FUNDAÇÃO

> ⚠️ **Os valores abaixo são HIPÓTESE DE FUNDAÇÃO, não tabela.** Nenhum preço vira verdade
> antes de um **piloto pago de 30 dias**. A página de preços do protótipo só existe marcada
> como proposta, sem checkout.

| Plano | Hipótese | Escopo hipotético |
|---|---|---|
| **FARO Solo** | R$ 297/mês | 3 teses · fila limitada · Watch básico · CSV |
| **FARO Pro** | R$ 697/mês | 10 teses · Watch contínuo · Evidence Graph · relatórios |
| **FARO Escritório** | R$ 1.497/mês | Multiusuário · teses avançadas · curadoria assistida · prioridade |

**Emenda da Junta adotada — compromisso trimestral na assinatura fundadora.** O Solo a R$297
atrai o curioso que suga a base e cancela em dois meses ("hit-and-run"). Quem fecha contrato
de recuperação tributária ganha dezenas ou centenas de milhares por êxito — o valor do FARO é
o ROI dele, não o preço da lista. O compromisso trimestral alinha o assinante ao
**monitoramento contínuo**, não ao download inicial.

**Créditos de investigação** — para caçadas pesadas, acima do consumo do plano. Uma
oportunidade custa mais ou menos para ser gerada conforme quantidade de fontes e
processamento envolvidos; a economia do produto não pode ser travada só em "número de
fichas".

**Estrutura:** assinatura + capacidade + consumo.

**Gratuidade é proibida.** O objetivo é provar disposição de pagamento, não colecionar
interesse. Desconto de fundador declarado, nunca gratuidade.

---

## 17. GO-TO-MARKET — 90 DIAS FOUNDER-LED

A entrada é founder-led e baseada numa **caçada real**: o fundador entrevista o profissional,
escolhe uma tese, produz uma amostra manual, mostra as fichas, registra objeções e converte o
design partner em assinante fundador. O contrato define tese, janela, entrega, limites de
dados e indicadores.

| Período | Objetivo | Entrega | Decisão |
|---|---|---|---|
| Dias 1–15 | Descoberta | 10–15 entrevistas · 3 teses candidatas | Escolher a tese com dor e orçamento |
| Dias 16–30 | Prova manual | Amostra de fichas para o parceiro | Obter aprovação e **pagamento** |
| Dias 31–45 | Piloto pago | Primeiro ciclo + registro de ações | Confirmar uso real |
| Dias 46–60 | Automação do caminho crítico | Pipeline, histórico, exportação | Medir custo e qualidade |
| Dias 61–75 | Repetição | Segundo ciclo + monitoramento | Provar valor **novo** |
| Dias 76–90 | Decisão de escala | Retenção, margem, aprovação, pipeline | Escalar · reposicionar · encerrar |

### Promessa comercial inicial

> **"Toda semana, o FARO entrega uma fila auditável de empresas que merecem ser investigadas
> para a sua tese tributária — com o motivo, os sinais e a fonte prontos para sua equipe agir."**

### O evento de valor

Não é quantidade de registros coletados. É uma sequência observável, registrada pelo design
partner desde o primeiro dia:

```
ficha recebida → ficha aprovada → contato realizado → resposta obtida
→ reunião marcada → diagnóstico iniciado → oportunidade convertida
```

### Próximo marco

Não é "terminar a plataforma". É: **um design partner pagante, uma tese escolhida, um
primeiro ciclo de fichas aprovadas, ações comerciais registradas e uma decisão fundamentada
sobre o segundo mês.**

---

## 18. RISCOS DECLARADOS

Declarados antes da obra, não descobertos depois.

**1. Ficha correta e comercialmente inútil.** A empresa bate nos filtros e ainda assim não
tem contato acessível, autoridade, timing ou aderência à oferta. Mitigação: medir o elo entre
evidência pública e ação comercial — taxa de ação, não só taxa de aprovação.

**2. Falso positivo da tese.** O cliente liga para o "alvo perfeito" e a realidade
operacional não bate com o dado declaratório. Mitigação: Tribunal Magro com motivo
estruturado. Sem captura do motivo, o score não aprende e a confiança cai.

**3. Custo computacional oculto.** Joins e busca textual em dezenas de milhões de registros
destroem performance; RLS soma latência. Mitigação: §11 — lote + materialized views +
indexação impecável.

**4. Dependência de fontes públicas.** Mudança de formato, atraso, bloqueio ou perda de
cobertura quebram a entrega. Mitigação: vigias de colheita, testes de integridade, fallback
declarado, painel de saúde das fontes.

**5. Custo de atualização das bases.** A jazida empresarial é pesada. Mitigação: pipeline de
ingestão barato e confiável antes de amplo; 2 fontes no MVP.

**6. Percepção "isso eu acho de graça".** Mitigação: o produto não vende o dado, vende a tese
pronta + o monitoramento. A copy tem que cravar isso.

**7. Churn de lista.** O assinante esvazia a tese em 2 meses e sai. Mitigação: a unidade de
valor é o evento (§2) + Watch (§8) + compromisso trimestral na fundadora.

**8. Virar serviço de projeto disfarçado de SaaS.** É SaaS legítimo **se e somente se** o
onboarding e a criação de teses forem **paramétricos e executáveis pelo próprio usuário**. Se
a equipe precisar escrever scraper customizado ou SQL manual para cada cliente novo, o que
existe é uma agência de inteligência com cara de SaaS. **A parametrização é a
escalabilidade.** Mitigação: motor aprende com o julgamento; entradas novas entram
automaticamente; a entrega fica menos manual a cada ciclo.

**9. Risco jurídico e reputacional.** Sinal de prospecção apresentado como conclusão
tributária. Mitigação: §14 + §15 + fonte, data, justificativa, versão da regra e limite de
inferência em cada ficha.

---

## 19. O QUE HERDA DA CASA

| Peça | Herda de | Estado |
|---|---|---|
| Motor de caça (coleta→triagem→score→entrega) | Engenharia HUNTER | Provada em produção interna |
| Segurança de banco (RLS + FORCE em 100%) | Padrão business-os | Campeão da matriz interna |
| Pagamento idempotente + reentregador | Padrão casa-bonaparte | Único com teste de idempotência |
| Copy honesta (promete só o que roda) | Padrão Kraken | Referência da casa |
| Baseline de schema versionado | Régua interna 17/08 | Lei |
| Multi-tenant com isolamento por assinante | Padrão Conversion OS | Provado com 2+ tenants |
| `usage_ledger` | Padrão Kraken | Provado |

---

## 20. DECISÃO FINAL

**Construir — mas não como SaaS horizontal desde o primeiro dia.**

Três coisas ainda precisam ser provadas, e nenhuma se prova escrevendo código:

1. que o comprador **paga** por oportunidade qualificada;
2. que a tese produz **valor novo** depois do primeiro lote;
3. que o **custo por ficha** permite margem.

A ordem correta: vender uma tese tributária estreita → operar um piloto pago → medir
aprovação, ação, pipeline, custo e retenção → automatizar **só o que se repetiu** → e só
então ampliar fontes, teses, nichos e integrações.

O motor não nasce nesta fase. Nasce com o design partner pagante.

---

## APÊNDICE A — RASTREIO DAS EMENDAS

| # | Emenda | Origem | Status |
|---|---|---|---|
| 1 | Unidade de valor = evento, não empresa | Junta | Adotada (§2) |
| 2 | Lei das Camadas DADO→SINAL→INFERÊNCIA→TESE→OPORTUNIDADE | Junta | Adotada (§3) |
| 3 | Score decomposto e explicável | Junta | Adotada (§4) |
| 4 | Confidence Policy — proxy nunca vira fato | v1 + Junta | Elevada a lei (§5) |
| 5 | Evidence Graph + Grade E1/E2/E3 → A–D | Junta | Adotada (§6) |
| 6 | Source Registry + Freshness | Junta | Adotada (§7) |
| 7 | Watch como coração da assinatura | v1 + Junta | Promovida (§8) |
| 8 | Tribunal: cortar (parecer A) × expandir (parecer B) | Junta — **divergência** | **Síntese: Tribunal Magro** (§9) |
| 9 | Moat = Thesis Engine + flywheel, não a fonte | Junta | Adotada (§10) |
| 10 | Lote de madrugada + materialized views + indexação | Junta — unanimidade | Adotada como lei (§11) |
| 11 | MVP: 2 fontes, 1–3 teses, 1 nicho | Junta — unanimidade | Adotada (§12) |
| 12 | Vertical de estreia = tributário | Junta — unanimidade | Adotada (§13) |
| 13 | Agro/PF fora até parecer jurídico | v1 + Junta | Adotada (§12, §15) |
| 14 | LGPD reescrita (MEI/EI, legítimo interesse) | Junta | Adotada (§15) |
| 15 | Preços = hipótese; piloto pago antes da tabela | Junta | Adotada (§16.1) |
| 16 | Compromisso trimestral na fundadora | Junta | Adotada (§16.1) |
| 17 | Créditos de investigação | Junta | Adotada (§16.1) |
| 18 | Corrigir "ninguém entrega o meio" | Junta | Adotada (§1) |
| 19 | Corrigir "dados de PJ são públicos por lei" | Junta | Adotada (§15) |
| 20 | GTM 90 dias founder-led | Junta | Adotada (§17) |
| 21 | Linguagem: "sinais compatíveis para investigação" | Junta | Elevada a lei (§14) |
| 22 | Preço Pro R$597 → R$697 | Junta | Adotada (§16.1) |

Detalhe de cada divergência e da síntese: `../junta/QUADRO-DE-VEREDITOS.md`.

### Emendas da 2ª rodada — Fossa das Marianas (17/08/2026)

Rodada sobre **mercado e modelo de negócio**. Consolidação em
[`MODELO-DE-NEGOCIO.md`](./MODELO-DE-NEGOCIO.md); quadro em
[`../junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md`](../junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md).

| # | Emenda | Origem | Status |
|---|---|---|---|
| M-01 | Rota (a) núcleo + (b) canal · (c) descartada · (d) horizonte | Junta 3×0 + martelo do dono | `MODELO-DE-NEGOCIO.md` §A |
| M-02 | Tech nunca divide honorário advocatício (Lei 8.906/94) | Junta 3×0 | `CANAL-OPERADOR-PARCEIRO.md` |
| M-03 | R$ 250 bi é impacto do Tema 69, não tamanho de mercado | Manus (derruba Gemini) | `MODELO-DE-NEGOCIO.md` §C.1 |
| M-04 | Piso rigoroso R$ 10–30 bi/ano · honorários R$ 1,5–6 bi/ano | Manus | `MODELO-DE-NEGOCIO.md` §C.1 |
| M-05 | **EV líquido como número-mestre da ficha** | Manus | **Adotada — §4.1** |
| M-06 | **Campo "POR QUE NÃO PERSEGUIR"** | GPT | **Adotada — §4.2** |
| M-07 | **Cláusula-blindagem "sugestão de dados vs. decisão do contribuinte"** | Gemini | **Adotada — §15.2** |
| M-08 | **Relógio da Reforma como módulo do Watch** | Junta 3×0 | **Adotada — §8.1** |
| M-09 | **Vigilância normativa: ler a versão VIGENTE (LC 214 ← LC 227/2026)** | Anexo ❔ + Manus + GPT | **Adotada — §8.1** |
| M-10 | Catálogo com estado e proveniência (detectar tese morta) | GPT + as 3 contradições | `CATALOGO-DE-TESES-DA-CASA.md` |
| M-11 | Benchmark R$ 2–30k/mês → hipótese linha Operador Profissional | GPT + Manus | `MODELO-DE-NEGOCIO.md` §D.2 |
| M-12 | Empresa-tipo R$ 100M: usar R$ 500k–1,5M, não R$ 8M | GPT (contra o próprio case) | `MODELO-DE-NEGOCIO.md` §C.2 |
| M-13 | Ground truth loop pelo operador parceiro | Síntese do ponto cego triplo | `CANAL-OPERADOR-PARCEIRO.md` |
| M-14 | **Lei de Dados — a tese do assinante é do assinante** | Aprovada pelo dono | **Adotada — §15.1** + `LEI-DE-DADOS.md` |
| M-15 | Documento sem carimbo de origem não vota | Lição da 1ª rodada, aplicada | `../junta/marianas/README.md` |

**Três contradições diretas entre juízes, declaradas e não arbitradas** (ISS/Tema 118
· terço constitucional de férias/Tema 985 · monofásico/Tema 1.339): registradas em
`CATALOGO-DE-TESES-DA-CASA.md` com as teses **bloqueadas ou segmentadas** até parecer
LEXIS + tributarista habilitado. O canon não arbitra tese jurídica — arbitrar seria
justamente o ato privativo que a Lei 8.906/94 veda à tecnologia.

---

## APÊNDICE B — LEI DO MOTOR INTERNO

O motor de inferência por trás do FARO é **propriedade industrial da ALSHAM**. Nenhum
fornecedor, modelo, peso ou composição de terceiros aparece em texto visível ao cliente:
não em landing, hero, features, "como funciona", FAQ, pricing, badge, footer, label de UI,
loading state, toast, empty state, i18n, resposta de API exposta ou documentação voltada ao
cliente.

O cliente vê: **motor ALSHAM · IA ALSHAM · inteligência ALSHAM · ensemble multi-modelo
proprietário**.

---

*Documento da ALSHAM Global Commerce. Canon vivo — emendas passam pelo rito do Conselho.
Última consolidação: 17/08/2026.*
