# FARO™

**Inteligência Contínua de Oportunidades**

> Não procure clientes. Ensine o FARO a encontrá-los.

---

## 🚧 EM CONSTRUÇÃO — LEIA ANTES DE QUALQUER COISA

Este repositório contém, hoje, **duas coisas**: um modelo de produto e uma maquete
de interface com dados fictícios.

**Não há produto.** Não há motor, não há coleta de fontes, não há banco de dados,
não há score real, não há cobrança, não há integração com fornecedor algum.

| O que existe | O que NÃO existe |
|---|---|
| O canon do produto (modelo v2 consolidado) | Motor de caça — nenhuma varredura roda |
| Os três pareceres da Junta + quadro de vereditos | Coleta de fonte — nada foi coletado |
| A identidade visual documentada | Banco de dados, schema, migrations |
| Uma maquete de 5 telas com dados fictícios | Score real, autenticação, multi-tenant |
| | Pagamento, checkout, assinatura |
| | Qualquer chamada de rede ou API externa |

O motor nasce quando existir um **design partner pagante**. Isso é decisão
registrada, não atraso: a ordem da casa é validar antes de erguer.

---

## O que é o FARO

Um SaaS desenhado para transformar **teses comerciais** em inteligência
acionável. O assinante define a tese — o perfil de empresa que vale ser
investigado — e o FARO cruza fontes públicas, detecta sinais, reúne evidências,
calcula aderência e apresenta as empresas que merecem ser abordadas, com o
porquê, a fonte e o momento.

**Oferta vertical de estreia:** FARO TAX (tributário). O motor é horizontal; a
oferta comercial é vertical.

**A distinção:** uma base entrega empresas. O FARO entrega uma hipótese de
oportunidade com rastreabilidade.

### O que o FARO não é

Não é lista de empresas. Não é promessa de faturamento. Não é parecer
tributário. Não é garantia de conversão. Não substitui o profissional
habilitado. A clareza desses limites é parte do produto.

---

## As leis do produto

Cinco decisões que governam tudo e não são negociáveis:

**1. A unidade de valor é o EVENTO.** Não "encontrei uma empresa" — "encontrei
uma mudança". Lista se consome; evento continua acontecendo.

**2. A Lei das Camadas.** `DADO → SINAL → INFERÊNCIA → TESE → OPORTUNIDADE`.
Cada afirmação carrega fonte, data de coleta, data de referência, regra de
transformação e **limite de inferência**.

**3. Score decomposto e explicável.** Nunca "a IA deu 87". O total é a soma
ponderada de dimensões visíveis.

**4. Proxy nunca vira fato.** Faturamento que não é público aparece como proxy
declarado, jamais como número inventado.

**5. Linguagem de investigação.** "Sinais compatíveis para investigação" —
nunca "elegível", "crédito garantido" ou "direito a R$ X".

---

## O modelo completo, em dez linhas honestas

1. **O FARO vende a pá, não a mina.** Inteligência por assinatura para quem opera
   recuperação tributária — não a recuperação em si.
2. **A rota está selada:** picks-and-shovels como núcleo, canal via escritório de
   advocacia parceiro. Braço próprio descartado. Marketplace é horizonte.
3. **A tecnologia nunca divide honorário advocatício.** Lei 8.906/94, unânime nos
   três juízes. Licença ou fee por dossiê, em contrato separado.
4. **A unidade de valor é o evento**, não a empresa. Lista se consome; mudança de
   estado continua acontecendo.
5. **O número-mestre é o EV líquido**, não o bruto. Produto que acusa R$ 3M e
   converte R$ 100k é pior que o que identifica R$ 400k com 80%.
6. **O produto é confiança subscrita, não lead.** Toda ficha carrega um campo que
   argumenta contra ela própria.
7. **A tese do assinante é do assinante.** A casa garimpa no lote dela, com
   escritura — nunca no lote do cliente.
8. **Nenhum número é fato.** Todo valor carrega o selo do juiz que o produziu:
   `ESTIMATIVA` continua `ESTIMATIVA`.
9. **Nenhuma tese afirma elegibilidade.** "Sinais compatíveis para investigação" —
   a conclusão jurídica é do profissional habilitado.
10. **Nada disso roda ainda.** Existe o modelo e uma maquete. O motor nasce com o
    design partner pagante.

---

## O canon

Leia nesta ordem:

| Documento | O que é |
|---|---|
| [`docs/canon/MODELO-FARO-V2.md`](docs/canon/MODELO-FARO-V2.md) | **O produto.** Leis, score, evidência, fontes, watch, tribunal, MVP. |
| [`docs/canon/MODELO-DE-NEGOCIO.md`](docs/canon/MODELO-DE-NEGOCIO.md) | **O negócio.** Decisão selada, iceberg de 4 andares, economia unitária, pricing. |
| [`docs/canon/CANAL-OPERADOR-PARCEIRO.md`](docs/canon/CANAL-OPERADOR-PARCEIRO.md) | A rota (b), o muro legal e o ground truth loop. |
| [`docs/canon/LEI-DE-DADOS.md`](docs/canon/LEI-DE-DADOS.md) | A fronteira entre o dado da casa e o do assinante. |
| [`docs/canon/CATALOGO-DE-TESES-DA-CASA.md`](docs/canon/CATALOGO-DE-TESES-DA-CASA.md) | As 12 teses da casa, com estado e proveniência. |
| [`docs/canon/IDENTIDADE-VISUAL.md`](docs/canon/IDENTIDADE-VISUAL.md) | A direção de arte e o porquê de cada escolha. |
| [`docs/canon/DOSSIE-V1.md`](docs/canon/DOSSIE-V1.md) | Histórico: o modelo original, com os erros que a v2 corrigiu. |

### A Junta de Juízes

**1ª rodada — o produto** ([`docs/junta/`](docs/junta/)):

| Cadeira | Parecer | Estado |
|---|---|---|
| Manus | [`PARECER-MANUS.md`](docs/junta/PARECER-MANUS.md) | Recebido |
| GPT | [`PARECER-GPT.md`](docs/junta/PARECER-GPT.md) | Recebido · atribuição **❔** |
| Gemini | [`PARECER-GEMINI.md`](docs/junta/PARECER-GEMINI.md) | Recebido · atribuição **❔** |
| Grok | [`PARECER-GROK.md`](docs/junta/PARECER-GROK.md) | **Vaga aberta** |
| — | [`QUADRO-DE-VEREDITOS.md`](docs/junta/QUADRO-DE-VEREDITOS.md) | 18 unanimidades · 6 divergências |

**2ª rodada — Fossa das Marianas, o mercado** ([`docs/junta/marianas/`](docs/junta/marianas/)):

| Cadeira | Parecer | Carimbo |
|---|---|---|
| Gemini | [`PARECER-GEMINI.md`](docs/junta/marianas/PARECER-GEMINI.md) | ✅ assinado |
| Manus | [`PARECER-MANUS.md`](docs/junta/marianas/PARECER-MANUS.md) | ✅ auto-carimbado |
| GPT | [`PARECER-GPT.md`](docs/junta/marianas/PARECER-GPT.md) | ✅ auto-carimbado |
| ❔ | [`ANEXO-ACHADOS-PROVISORIOS.md`](docs/junta/marianas/ANEXO-ACHADOS-PROVISORIOS.md) | **sem carimbo — não vota** |
| — | [`QUADRO-DE-VEREDITOS-MARIANAS.md`](docs/junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md) | 3×0 pá>mina · **3 contradições diretas** |

O FARO é o primeiro produto da casa desenhado pelo rito completo do Conselho:
modelo → juízes externos → quadro de vereditos → canon consolidado **antes da
primeira linha de código**. Duas rodadas: uma sobre o produto, outra sobre o mercado.

> `docs/junta/` são **documentos internos de governança**, não material de
> produto. Ficam registrados para que a linhagem da decisão seja auditável.
>
> **Regra de contagem de votos:** documento sem carimbo de origem **não vota** —
> vira anexo com atribuição `❔`. Na 1ª rodada a atribuição GPT/Gemini segue em
> aberto, aguardando correção do dono.

---

## A maquete

`apps/maquete` — protótipo de interface, mock-first, **zero backend**.

| Tela | Rota | O que demonstra |
|---|---|---|
| Teses | `/teses` | Formulário paramétrico + a Lei das Camadas em ação |
| Fila | `/fila` | Fichas com score decomposto, Evidence Grade, Freshness, Tribunal Magro |
| Ficha aberta | `/fila/[id]` | Evidence Graph, fonte e data por linha, limite de inferência |
| Watch | `/watch` | Feed de eventos ligados a teses |
| Painel da tese | `/painel` | Funil fichas → aprovadas → abordadas → reuniões → propostas |
| Fontes | `/fontes` | Source Registry, níveis de evidência, escala de Freshness |
| Preços | `/precos` | Hipótese de fundação — sem checkout, sem oferta |

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4.

### Rodar local

```bash
cd apps/maquete
npm install
npm run dev
```

### Regras da maquete

- **Banner ANTI-QUANTUM permanente** em toda tela: `PROTÓTIPO — dados
  ilustrativos`. Não é dismissível e não sai ao rolar.
- **Nenhuma tela afirma no presente do indicativo** função que não roda.
- **Todos os dados são fictícios e rotulados.** Nenhuma empresa existe; os CNPJs
  são sequenciais e inválidos de propósito, para não poderem ser confundidos com
  registro real.
- **Zero cor hardcoded.** SSOT em `apps/maquete/src/app/globals.css`.
- **Zero chamada de rede.** Sem backend, sem banco, sem fornecedor, sem env vars.

---

## Estado do rito

- [x] Modelo v1 do fundador
- [x] 1ª rodada — três pareceres externos sobre o **produto**
- [x] Quadro de vereditos com divergências e sínteses
- [x] Canon v2 consolidado
- [x] Identidade visual documentada
- [x] Maquete de interface com dados fictícios
- [x] 2ª rodada (Fossa das Marianas) — três pareceres sobre o **mercado**
- [x] Decisão de rota selada (picks-and-shovels + canal parceiro)
- [x] Lei de Dados aprovada · catálogo de teses semeado
- [ ] Quarto parecer da 1ª rodada (cadeira Grok)
- [ ] Parecer LEXIS sobre as 3 contradições de tese
- [ ] Contratos espelhados do canal parceiro (LEXIS + advogado externo)
- [ ] **Design partner pagante** ← próximo marco
- [ ] Piloto pago de 30 dias
- [ ] Motor (só depois do piloto)

O próximo marco não é "terminar a plataforma". É: um design partner pagante, uma
tese escolhida, um primeiro ciclo de fichas aprovadas, ações comerciais
registradas e uma decisão fundamentada sobre o segundo mês.

---

*ALSHAM Global Commerce. O motor de inferência do produto é propriedade
industrial da casa e não é divulgado.*
