# DOSSIÊ V1 — HISTÓRICO PRESERVADO

> **Este documento é histórico. Não é o canon vigente.**
>
> O canon vigente é [`MODELO-FARO-V2.md`](./MODELO-FARO-V2.md).
>
> Este é o modelo original do fundador, submetido à Junta de Juízes externa em 17/08/2026,
> preservado **na íntegra e sem correções** para que a linhagem de decisão fique auditável:
> dá para ver exatamente o que foi proposto, o que a Junta contestou e o que a v2 mudou.
>
> Duas frases deste documento foram **corrigidas** na v2 e permanecem aqui como erro
> registrado, não como verdade:
> - *"Ninguém entrega o meio: tese viva, monitorada, com fonte, por assinatura"* — forte demais
>   como afirmação de mercado (ver v2 §1).
> - *"dados de PJ são públicos por lei"* — simplificador demais (ver v2 §15).
>
> Os preços aqui (R$297 / R$597 / R$1.497) foram revistos na v2 (Pro → R$697) e rebaixados
> de tabela a **hipótese de fundação** (ver v2 §16.1).

---

# FARO™ — O CAÇADOR DE OPORTUNIDADES
**Modelo de produto · ALSHAM Global Commerce · v1 — 17/08/2026**
Documento de desenho submetido à Junta de Juízes externa para parecer. Nada aqui foi construído ainda: é o modelo antes da obra, seguindo a lei da casa (validar antes de erguer).

---

## 1. O QUE É (em três frases)

FARO é um SaaS de **caçada de oportunidades comerciais com curadoria**. O assinante — consultor tributário, contador, BDR, boutique de M&A, corretor do agro — cadastra as **teses** dele (o perfil exato de empresa que vale dinheiro pra ele), e o motor caça todos os dias em **fontes públicas oficiais**, devolvendo **fichas de oportunidade prontas pra abordagem**: empresa + por que ela se encaixa + sinais + fonte de cada dado + score. Não vendemos banco de dados; vendemos **o alvo certo, com o porquê e a fonte do lado**.

**Uma linha de posicionamento:** *"Lista qualquer um vende. O FARO entrega a presa, o motivo e a prova."*

---

## 2. POR QUE EXISTE (a dor real, com origem real)

O modelo nasceu de uma demanda espontânea de um profissional do mercado (recuperação tributária + originação financeira), recebida em 17/08/2026, pedindo literalmente: empresas 50+ funcionários por setor e tese tributária, faturamento >R$100M, pecuaristas confinadores, viabilidade de mercados — *"me entregue isso aí arrumado"*.

A dor que ele descreveu é a dor de toda a categoria:
- Ferramentas de lista (Econodata, Speedio, Cortex) entregam **banco cru** — o consultor ainda gasta horas transformando linha em tese.
- Consultoria de inteligência entrega tese — mas custa R$8–30 mil por projeto e **envelhece em 90 dias**.
- Ninguém entrega o meio: **tese viva, monitorada, com fonte, por assinatura.**

---

## 3. O CICLO DO PRODUTO — CAÇA → JULGA → ABORDA

**Tela 1 · TESES.** O assinante monta caçadas permanentes por filtros: CNAE, porte, UF/região, regime provável, sinais especiais (consumidor livre de energia, importador/exportador, rede de postos, confinador). Cada tese fica ligada pra sempre.

**Tela 2 · A CAÇA (diária, automática).** O motor varre as fontes oficiais no padrão coleta → triagem → score. Engenharia já provada internamente na ALSHAM (o mesmo padrão do nosso caçador de tecnologia, operacional desde julho/2026).

**Tela 3 · FICHAS DE OPORTUNIDADE.** O produto de verdade. Cada alvo chega como briefing: razão social · CNAE · porte · capital · localização · **por que se encaixa na tese** (ex.: "não optante do Simples + capital acima de X + consumidora livre CCEE → forte candidata a Lucro Real com crédito de energia") · **fonte de cada dado** · score de aderência 0–100.

**Tela 4 · O TRIBUNAL DO ASSINANTE.** Fila de julgamento: aprova ou descarta com um toque. Aprovadas viram pipeline (kanban simples) ou exportam pro CRM dele (CSV; integrações depois).

**Tela 5 · O FARO CONTÍNUO.** O que justifica a mensalidade: empresa nova que entra no critério **aparece sozinha**; empresa monitorada que muda (abre filial, muda porte, sai do Simples) **avisa**. Relatório mensal de caçada por tese.

---

## 4. ONDE ELE CAÇA (fontes públicas, todas oficiais)

| Fonte | O que entrega |
|---|---|
| Base de Dados Abertos do CNPJ (Receita Federal) | A jazida-mãe: ~60M CNPJs — CNAE, porte, capital, sócios, Simples, situação |
| CCEE — lista de consumidores livres | Grandes consumidores de energia (tese créditos PIS/COFINS energia) |
| ANP — cadastro de postos autorizados | Todas as redes de postos do país (tese monofásico) |
| RFB — importadoras/exportadoras por faixa | Volume de comércio exterior (tese créditos acumulados) |
| CVM + diários oficiais + rankings públicos | Faturamento de S.A.s e grandes empresas |
| RAIS/CAGED (faixas públicas) | Porte de folha por faixa declarada |
| PNCP — contratos públicos | Quem vende pro governo e por quanto |
| Senatran, Contran, ABVE, ANEEL | Estudos de mobilidade elétrica |
| Assocon, IBGE Censo Agro, CAR/SICAR, MAPA | Confinadores: município → imóvel → alvo |

**Regra de integridade (lei da casa):** toda fonte é provada viva antes de prometida. Limites de dado público **declarados no produto**: faturamento >R$100M não é público por empresa — o FARO entrega por proxy declarado (Lucro Real obrigatório >R$78M, capital, rankings, balanços publicados). Quem promete certeza de faturamento vende achismo; nós declaramos o limite e por isso somos criíveis.

**LGPD:** dados de PJ são públicos por lei. Dados de PF (sócios, produtores rurais) entram sob legítimo interesse com parcimônia e revisão jurídica prévia (nosso protocolo LEXIS) — o produto nasce com o parecer, não remenda depois.

---

## 5. MODELO DE NEGÓCIO

Assinatura mensal, multi-tenant, autosserviço com onboarding assistido no plano alto. Preços de fundação (inversão de preço da casa: tabela futura declarada desde o dia 1):

| Plano | Fundação | Tabela futura | Entrega |
|---|---|---|---|
| **FARO Solo** | R$ 297/mês | R$ 497 | 3 teses ativas · N fichas/mês · exportação CSV |
| **FARO Pro** | R$ 597/mês | R$ 997 | 10 teses · fichas ampliadas · monitoramento contínuo · relatório mensal |
| **FARO Escritório** | R$ 1.497/mês | R$ 2.497 | Multiusuário · teses ilimitadas · teses customizadas com curadoria assistida · prioridade |

- Medição de consumo por assinante desde o dia 1 (padrão `usage_ledger` já provado no nosso Kraken) — fundação pra cobrança por uso e pra conhecer o custo real por ficha.
- **Design partner fundador:** o profissional que originou a demanda entra como primeiro assinante pagante, com as teses dele semeando o catálogo inicial — desconto de fundador declarado, nunca gratuidade.

---

## 6. O QUE HERDA DA CASA (por que dá pra construir rápido e bem)

| Peça | Herda de | Estado |
|---|---|---|
| Motor de caça (coleta→triagem→score→entrega) | Engenharia HUNTER | Provada em produção interna |
| Segurança de banco (RLS + FORCE em 100%) | Padrão business-os | Campeão da matriz interna |
| Pagamento idempotente + reentregador | Padrão casa-bonaparte | Único com teste de idempotência |
| Copy honesta (promete só o que roda) | Padrão Kraken | Referência da casa |
| Baseline de schema versionado | Régua nova (17/08) | Lei interna |
| Multi-tenant com isolamento por assinante | Padrão Conversion OS | Provado com 2+ tenants |

---

## 7. CONCORRÊNCIA E FOSSO

- **Econodata / Speedio / Cortex:** banco cru + filtros. Não entregam tese, não explicam o porquê, não citam fonte por linha, não monitoram mudança de regime.
- **Consultorias de inteligência:** entregam tese, mas por projeto (caro, foto que envelhece).
- **Fosso do FARO:** (1) a ficha com o *porquê* e a *fonte por linha* — auditável, coisa que gera confiança em quem vive de tese tributária; (2) o monitoramento contínuo — a lista nunca envelhece; (3) honestidade estrutural — limites de dado declarados no produto (ninguém no mercado faz; todos fingem certeza); (4) custo — fontes públicas + motor próprio = margem alta nos planos de entrada.

---

## 8. RISCOS CONHECIDOS (declarados antes da obra)

1. **Custo de atualização das bases** — a base CNPJ é pesada (dezenas de GB/mês); pipeline de ingestão precisa ser barato e confiável.
2. **Percepção "isso eu acho de graça"** — mitigação: o produto não vende o dado, vende a tese pronta + monitoramento; a copy precisa cravar isso.
3. **Churn de lista** — se o assinante "esvazia" a tese em 2 meses e sai; mitigação: monitoramento contínuo + teses novas de catálogo + limites por plano.
4. **LGPD no agro (PF)** — parecer jurídico antes da entrega do bloco confinadores.
5. **Dependência de fontes públicas** — fonte que muda de formato quebra pipeline; mitigação: vigias de colheita (padrão já ativo no nosso caçador interno) + fallback declarado.

---

## 9. PERGUNTAS À JUNTA (o parecer que pedimos)

1. **Preço:** as faixas R$297/597/1.497 estão certas pra o valor entregue e pro bolso de consultor tributário/contador brasileiro? Onde está o erro?
2. **Demanda:** o mercado de "caçadores de oportunidade" (consultores tributários, BDRs, M&A, agro) é grande e sofrido o bastante pra sustentar um SaaS de assinatura — ou isso é serviço de projeto disfarçado de SaaS?
3. **Fosso:** a combinação ficha-com-fonte + monitoramento + honestidade declarada segura concorrência de quem tem banco maior (Econodata etc.) se eles copiarem a camada de tese?
4. **MVP:** qual é o menor produto que já cobra mensalidade com dignidade — quantas teses, quais fontes primeiro, o que corta da v1?
5. **GTM:** começar por 1 nicho (tributário) e expandir, ou nascer multi-nicho já que o motor é o mesmo?
6. **O que estamos deixando de ver?** O risco que não listamos no §8.

---

*Documento da ALSHAM Global Commerce. O motor de IA por trás do produto é propriedade industrial da casa e não é divulgado. Modelo sujeito a revisão pela Junta e decisão final do fundador.*
