# LEI DE DADOS — FARO™
## A fronteira entre o que é da casa e o que é do assinante
**ALSHAM Global Commerce · 17/08/2026 · aprovada pelo dono**

> Veredito do dono ao aprovar: **"forma correta, justa e leal — padrão Casa Bonaparte."**

---

## O problema que esta lei resolve

O FARO tem uma tensão embutida no próprio modelo de negócio. A casa faz duas coisas
ao mesmo tempo:

1. **vende a pá** — o SaaS que qualquer operador assina para montar as teses dele;
2. **garimpa** — opera um tenant próprio, cujas teses alimentam o escritório parceiro.

Quem faz as duas coisas tem, tecnicamente, acesso a uma tentação óbvia: **olhar a
tese que o assinante montou e caçar com ela.**

Se isso acontecer uma única vez, o FARO acaba. Não por multa — por confiança. Um
escritório tributário não entrega a lógica comercial dele para uma plataforma que
compete com ele usando a lógica dele.

Esta lei existe para tornar essa fronteira **explícita, contratual e auditável**,
antes de existir a primeira linha de motor.

---

# ⚖️ A REGRA DE OURO

> # A TESE DO ASSINANTE É DO ASSINANTE.

- **Tenant isolado.** A configuração, os parâmetros, os julgamentos e o histórico de
  cada assinante vivem no tenant dele.
- **A pesquisa do cliente é dele.** O recorte que ele inventou é propriedade
  intelectual dele, não matéria-prima da casa.
- **A ALSHAM nunca vê nem deriva.** Não lê tese individual, não copia recorte, não
  reconstrói por engenharia reversa, não usa como semente do catálogo próprio.

Isso vale inclusive — e principalmente — para o tenant da própria casa.

---

# AS QUATRO CAMADAS LÍCITAS

Tudo que a ALSHAM pode legitimamente aprender do sistema cabe em quatro camadas.
**Fora delas, não há uso lícito.**

---

## CAMADA 1 — TELEMETRIA AGREGADA E ANÔNIMA

**O que é:** estatística de comportamento do sistema, sem identificar assinante nem
reconstituir tese individual.

**Exemplos do que é lícito aprender:**

- que **tipos de sinal** convertem mais em aprovação (ex.: "mudança de regime" bate
  "aumento de porte" em taxa de aprovação);
- **taxas por setor e por UF** (ex.: fichas de indústria em GO são aprovadas mais que
  fichas de serviço em SP);
- que **combinações de sinal** geram falso positivo;
- **tempo médio** entre publicação da ficha e julgamento;
- quais **fontes** sustentam as fichas mais aprovadas.

**Para que serve:** alimentar o **Thesis Engine** — o moat da casa
([`MODELO-FARO-V2.md`](./MODELO-FARO-V2.md) §10).

**Condições inegociáveis:**

| Condição | Detalhe |
|---|---|
| **Declarada em contrato** | O assinante sabe disto antes de assinar. Não é letra miúda, é cláusula nomeada. |
| **Agregada** | Nunca por assinante. Mínimo de N assinantes por recorte antes de qualquer número existir. |
| **Anônima** | Impossível reconstituir quem. Se um recorte tem um assinante só, o recorte não é publicado. |
| **Sobre o SINAL, não sobre a TESE** | Aprender que "saída do Simples converte bem" é lícito. Aprender que "o assinante X caça indústria de embalagem em MG com capital acima de Y" **não é**. |

**A linha exata:** telemetria aprende sobre **o mundo** através do uso agregado.
Nunca aprende sobre **o cliente**.

---

## CAMADA 2 — O CATÁLOGO PRÓPRIO DA CASA

**O que é:** as teses que a ALSHAM constrói **do zero**, a partir de fonte pública e
dos pareceres da Junta.

**É o que o tenant ALSHAM opera.** É o lote da casa — com escritura.

**Origem lícita de uma tese do catálogo:**

- texto legal, jurisprudência, portal oficial;
- os pareceres da Junta ([`../junta/`](../junta/) e [`../junta/marianas/`](../junta/marianas/));
- pesquisa própria da casa;
- conhecimento trazido pelo operador parceiro **sobre os casos que ele mesmo operou**.

**Origem ILÍCITA:** qualquer coisa vinda de tenant de cliente.

Cada tese do catálogo carrega **certidão de proveniência** — ver camada 3.
Registro completo: [`CATALOGO-DE-TESES-DA-CASA.md`](./CATALOGO-DE-TESES-DA-CASA.md).

---

## CAMADA 3 — DADO PÚBLICO É DE TODOS

**O que é:** a jazida pública não pertence a ninguém. A ALSHAM pode caçar nela em
paralelo aos assinantes, e isso é **legítimo** — inclusive contra as mesmas empresas.

**O que torna a caça paralela legítima:** a casa chega ao mesmo CNPJ **pelo próprio
caminho**. Dois garimpeiros no mesmo rio é concorrência normal. Um garimpeiro lendo
o mapa do outro é outra coisa.

### 🔴 O QUE É PROIBIDO

> **PROIBIDO derivar tese da configuração ou do julgamento de cliente.**
>
> Não vale "inspirar-se". Não vale "notar um padrão interessante no tenant do
> cliente X". Não vale reconstruir a tese dele a partir dos parâmetros que ele
> escolheu ou das fichas que ele aprovou.
>
> Se a tese da casa **nasceu** de olhar o lote de um cliente, ela é ilícita — mesmo
> que a execução use só dado público.

### 🔍 AUDITORIA DE PROVENIÊNCIA

**Toda tese do catálogo da casa carrega certidão de origem.** Não é documentação
opcional: é o mecanismo que torna a Regra de Ouro **verificável em vez de
prometida**.

Campos mínimos da certidão:

| Campo | Conteúdo |
|---|---|
| `origem` | Parecer da Junta · fonte pública · pesquisa própria · caso operado pelo parceiro |
| `referencia` | Qual parecer, qual lei, qual tema, qual caso |
| `data_criacao` | Quando a tese entrou no catálogo |
| `autor` | Quem a formulou |
| `declaracao` | Afirmação expressa de que **não derivou de tenant de cliente** |

Uma tese da casa sem certidão de proveniência **não entra em produção**. Se a
proveniência não puder ser demonstrada, a tese é descartada — o ônus é de quem
propõe, não de quem audita.

---

## CAMADA 4 — OPT-IN DECLARADO

**O que é:** o assinante **escolhe** compartilhar tese ou resultado, em troca de
benefício explícito — benchmark coletivo, comparação com o mercado, calibragem
assistida.

**Condições:**

| Condição | Detalhe |
|---|---|
| **Feature contratada** | O assinante liga e desliga. Aparece na interface como funcionalidade, com o que ele ganha e o que ele dá. |
| **Nunca bastidor** | Não existe opt-in silencioso, pré-marcado, ou embutido em aceite de termos. |
| **Reversível** | Desligar interrompe o compartilhamento dali em diante. |
| **Recíproco** | Quem compartilha recebe. Benchmark é troca, não doação. |

Opt-in é a **única** porta pela qual dado individual de assinante pode atravessar a
fronteira — e ela só abre por dentro.

---

# 🚨 A LINHA VERMELHA

> ## Copiar a tese individual de um assinante é concorrência desleal e violação de segredo de negócio — e mata o fosso.

Duas razões, e a segunda é a que dói mais:

**1. É ilícito.** A tese que o assinante formulou é segredo de negócio dele. Usá-la
para competir com ele configura concorrência desleal.

**2. Mata o moat.** O fosso do FARO é o **Thesis Engine** — o aprendizado acumulado
sobre quais sinais convertem. Esse aprendizado depende do assinante **entregar
julgamento honesto**. Um assinante que desconfia da plataforma julga menos, julga
pior, ou não julga. **O flywheel para de girar.**

O incentivo econômico e o incentivo ético apontam para o mesmo lado: **a casa ganha
mais respeitando a fronteira do que violando-a.** É por isso que esta lei é
sustentável — não depende de virtude, depende de aritmética.

---

# CLÁUSULAS CONTRATUAIS

## ⚠️ MINUTA — REVISÃO OBRIGATÓRIA

As cláusulas das **camadas 1 e 4** são as que criam obrigação contratual e por isso
estão marcadas:

> **MINUTA — REVISÃO OBRIGATÓRIA LEXIS + ADVOGADO EXTERNO.**
>
> O texto abaixo é **rascunho de intenção**, escrito para que o advogado saiba o que
> a casa quer dizer. **Não é cláusula pronta e não vai para contrato sem revisão.**

### Cláusula 1 — Telemetria agregada (MINUTA)

> A ALSHAM poderá processar, de forma **agregada e anonimizada**, métricas de uso e
> desempenho da plataforma — incluindo taxas de aprovação por tipo de sinal, setor e
> unidade federativa — com a finalidade exclusiva de calibrar os mecanismos de
> pontuação e priorização do serviço.
>
> Tal processamento **não incluirá**, em nenhuma hipótese: a leitura, cópia,
> derivação ou reconstituição das teses, parâmetros de busca, critérios ou
> julgamentos individuais do CONTRATANTE.
>
> Nenhum recorte estatístico será produzido quando insuficiente para garantir a
> impossibilidade de identificação do CONTRATANTE.
>
> As teses, parâmetros e julgamentos do CONTRATANTE permanecem de **titularidade
> exclusiva** dele.

### Cláusula 4 — Opt-in de benchmark (MINUTA)

> O CONTRATANTE poderá, **por ato afirmativo, específico e reversível**, aderir ao
> compartilhamento de teses ou resultados para fins de benchmark coletivo, mediante
> a contrapartida descrita na funcionalidade.
>
> A adesão **não é condição** para uso de qualquer funcionalidade do serviço, não
> será presumida a partir do aceite dos termos gerais, e poderá ser revogada a
> qualquer tempo, com efeitos a partir da revogação.

**Pontos que o advogado precisa endereçar** (a casa não tem competência para
resolver sozinha): base legal aplicável a cada camada · titularidade e licença de
uso do dado derivado · efeito da revogação sobre dado já agregado · retenção e
descarte · tratamento de dado pessoal de pessoa natural que apareça no fluxo
(inclusive MEI e empresário individual, conforme [`MODELO-FARO-V2.md`](./MODELO-FARO-V2.md) §15)
· responsabilidade em caso de vazamento entre tenants.

---

# COMO ISSO SE VERIFICA

Uma lei que não se verifica é decoração. Quando o motor existir, estes são os
mecanismos que provam a fronteira:

| Mecanismo | O que prova |
|---|---|
| **Isolamento por tenant (RLS + FORCE)** | Que o dado do cliente não é alcançável de fora do tenant dele — padrão já provado na casa |
| **Certidão de proveniência por tese** | Que a tese da casa tem origem declarada e auditável |
| **Log de acesso a tenant de cliente** | Que ninguém da casa leu configuração de cliente — e, se leu, quando e por quê |
| **Mínimo de N por recorte na telemetria** | Que nenhum número agregado revela um assinante |
| **Registro do opt-in** | Que a adesão foi ato afirmativo, com data e reversibilidade |

Nada disso existe hoje — não há motor, não há banco. Está registrado aqui como
**requisito de fundação**: quando o motor nascer, nasce com estes mecanismos, não
com eles na fila de melhorias.

---

*ALSHAM Global Commerce · lei aprovada pelo dono em 17/08/2026. As minutas das
cláusulas 1 e 4 aguardam revisão LEXIS + advogado externo.*
