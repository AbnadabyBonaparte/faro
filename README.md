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

## O canon

Leia nesta ordem:

| Documento | O que é |
|---|---|
| [`docs/canon/MODELO-FARO-V2.md`](docs/canon/MODELO-FARO-V2.md) | **A spec vigente.** Modelo consolidado do produto. |
| [`docs/junta/QUADRO-DE-VEREDITOS.md`](docs/junta/QUADRO-DE-VEREDITOS.md) | O que a Junta julgou, onde divergiu, o que foi decidido. |
| [`docs/canon/IDENTIDADE-VISUAL.md`](docs/canon/IDENTIDADE-VISUAL.md) | A direção de arte e o porquê de cada escolha. |
| [`docs/canon/DOSSIE-V1.md`](docs/canon/DOSSIE-V1.md) | Histórico: o modelo original, preservado com os erros que a v2 corrigiu. |

### A Junta de Juízes

| Cadeira | Parecer | Estado |
|---|---|---|
| Manus | [`docs/junta/PARECER-MANUS.md`](docs/junta/PARECER-MANUS.md) | Recebido |
| GPT | [`docs/junta/PARECER-GPT.md`](docs/junta/PARECER-GPT.md) | Recebido |
| Gemini | [`docs/junta/PARECER-GEMINI.md`](docs/junta/PARECER-GEMINI.md) | Recebido |
| Grok | [`docs/junta/PARECER-GROK.md`](docs/junta/PARECER-GROK.md) | **Vaga aberta** |

O FARO é o primeiro produto da casa desenhado pelo rito completo do Conselho:
modelo → três juízes externos → quadro de vereditos → v2 consolidada **antes da
primeira linha de código**.

> `docs/junta/` são **documentos internos de governança**, não material de
> produto. Ficam registrados para que a linhagem da decisão seja auditável.

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
- [x] Três pareceres externos, juízes sem contato entre si
- [x] Quadro de vereditos com divergências e sínteses
- [x] Canon v2 consolidado
- [x] Identidade visual documentada
- [x] Maquete de interface com dados fictícios
- [ ] Quarto parecer (cadeira Grok)
- [ ] **Design partner pagante** ← próximo marco
- [ ] Piloto pago de 30 dias
- [ ] Motor (só depois do piloto)

O próximo marco não é "terminar a plataforma". É: um design partner pagante, uma
tese escolhida, um primeiro ciclo de fichas aprovadas, ações comerciais
registradas e uma decisão fundamentada sobre o segundo mês.

---

*ALSHAM Global Commerce. O motor de inferência do produto é propriedade
industrial da casa e não é divulgado.*
