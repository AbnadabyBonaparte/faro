# FARO — instruções para agentes

## Leia a planta antes da obra

Antes de qualquer alteração, leia nesta ordem:

1. `docs/canon/MODELO-FARO-V2.md` — a spec vigente do **produto**
2. `docs/canon/MODELO-DE-NEGOCIO.md` — a spec vigente do **negócio**
3. `docs/canon/LEI-DE-DADOS.md` — a fronteira do dado do assinante
4. `docs/junta/QUADRO-DE-VEREDITOS.md` e `docs/junta/marianas/QUADRO-DE-VEREDITOS-MARIANAS.md` — o que já foi decidido e por quê
5. `docs/canon/IDENTIDADE-VISUAL.md` — a direção de arte e seus tokens

O que está no canon **manda mais que a ideia nova**. Se uma tarefa contradiz uma
decisão registrada, sinalize antes de executar — a decisão pode ser revista, mas
conscientemente, nunca por atropelo.

## Next.js: leia os docs antes de codar

<!-- BEGIN:nextjs-agent-rules -->

Before any Next.js work, find and read the relevant doc in
`node_modules/next/dist/docs/`. Your training data is outdated — the docs are the
source of truth.

<!-- END:nextjs-agent-rules -->

## Fase atual: MODELO + MAQUETE

**PROIBIDO nesta fase**, sem autorização explícita do dono:

- backend, API route que faça trabalho real, banco de dados, migrations
- autenticação, multi-tenant, RLS
- pagamento, checkout, cobrança
- qualquer chamada a fornecedor externo ou variável de ambiente
- qualquer coleta de fonte pública

O motor nasce com o **design partner pagante**. Não antecipe.

## Leis invioláveis

### 1. ANTI-QUANTUM

Banner permanente `PROTÓTIPO — dados ilustrativos` em **toda** tela, não
dismissível, enquanto o motor não existir. Nenhuma tela afirma no presente do
indicativo função que não roda. Página de preços só existe marcada como
**proposta de fundação**, sem checkout.

### 2. Lei do Motor Interno

Nenhum nome de fornecedor, modelo ou composição de IA de terceiros em texto
visível ao cliente — em lugar nenhum da interface, copy, metadata, i18n, loading
state, toast, empty state ou resposta exposta. O cliente vê **motor ALSHAM**.

**Exceção declarada — atribuição de parecer.** `docs/junta/` e as citações de
parecer dentro de `docs/canon/` nomeiam as cadeiras da Junta. Isso é exigido pela
**Lei 7b**: um número só carrega selo se disser **qual juiz** o produziu — sem
atribuição, `ESTIMATIVA` vira número órfão e a divergência entre juízes fica
inauditável.

São **documentos internos de governança**, não copy de produto.

**Consequência operacional, sem exceção:** nada disso pode vazar para superfície
voltada ao cliente. A maquete, a interface, a landing e qualquer material comercial
citam **"a Junta"**, **"parecer externo"** ou **"motor ALSHAM"** — nunca o nome da
cadeira. Se o repositório se tornar público, o dono decide o que fazer com
`docs/junta/`; até lá ele é privado por padrão.

### 3. Lei das Camadas na tela

`DADO → SINAL → INFERÊNCIA → TESE → OPORTUNIDADE`. Dado observado e hipótese
**não podem parecer a mesma coisa**. Toda afirmação exibida carrega fonte, data
de coleta, data de referência, transformação e limite de inferência — na linha,
nunca em rodapé ou tooltip.

### 4. Proxy nunca vira fato

Faturamento e qualquer dado não observável aparecem como proxy declarado ou como
"não disponível". Número inventado para preencher vazio é proibido. `0` é `0`.

### 5. Linguagem jurídica de produto

Use "sinais compatíveis para investigação". **Nunca** "elegível", "crédito
garantido", "direito a R$ X", "cliente certo".

### 6. Zero cor hardcoded

SSOT em `apps/maquete/src/app/globals.css`. Proibido hex em `.tsx`/`.ts`;
proibido `bg-white`, `bg-gray-*`, `text-gray-*` e afins. Use os tokens
(`bg-surface`, `text-text-secondary`, `text-signal`, `border-border`…).

### 7. Todo número carrega o selo de quem o produziu

Duas metades da mesma lei.

**7a — Dado fictício sempre rotulado.** Nenhuma empresa da maquete existe. CNPJs são
sequenciais e inválidos de propósito. Todo painel com número carrega selo `fictício`.

**7b — Número de parecer entra com o selo que o juiz deu.** `ESTIMATIVA` continua
`ESTIMATIVA`. `NÃO VERIFICADO` continua `NÃO VERIFICADO`. Nunca promova estimativa a
fato ao copiar de um parecer para o canon, nem ao copiar do canon para a interface.

Quando dois juízes dão números diferentes para a mesma coisa, **declare a divergência**
— não escolha em silêncio. Quando o canon adota um dos números, ele diz qual adotou e
por quê. Exemplo vivo: `MODELO-DE-NEGOCIO.md` §C.1, onde o R$ 250 bi está **proibido**
como tamanho de mercado porque é impacto fiscal de uma discussão.

### 8. Lei de Dados — a tese do assinante é do assinante

Tenant isolado. A pesquisa do cliente é dele. A ALSHAM nunca vê nem deriva.

Quatro camadas lícitas: telemetria agregada e anônima declarada em contrato ·
catálogo próprio da casa · dado público com auditoria de proveniência · opt-in
declarado como feature contratada.

**Linha vermelha:** copiar tese individual de assinante é concorrência desleal e
violação de segredo de negócio — e mata o fosso. Ver `docs/canon/LEI-DE-DADOS.md`.

### 9. Proveniência — toda tese da casa carrega certidão de origem

Nenhuma tese entra em `docs/canon/CATALOGO-DE-TESES-DA-CASA.md` sem declarar de onde
veio (parecer, fonte pública, pesquisa própria ou caso operado pelo parceiro) e
afirmar expressamente que **não derivou de tenant de cliente**.

Sem certidão, não entra. O ônus é de quem propõe.

### 10. A tecnologia nunca emite conclusão jurídica

Lei 8.906/94: postulação judicial e consultoria/assessoria/direção jurídicas são
privativas de advogado, e consultoria jurídica **independe de contrato formal** para
existir (art. 5º, §4º) — ou seja, dá para praticar ato privativo sem perceber, só
redigindo uma frase conclusiva.

Nunca escreva, em código ou copy: "tem direito a", "é elegível", "pode compensar",
"crédito garantido". E **nunca** estruture remuneração como percentual de honorário
advocatício. Ver `docs/canon/CANAL-OPERADOR-PARCEIRO.md`.

## Validação pré-commit

```bash
cd apps/maquete
npx tsc --noEmit
npm run build

# Lei do Motor Interno na maquete — deve ser vazio
grep -rniE "claude|anthropic|gpt|openai|gemini|llama|mistral|deepseek|powered by" src/

# Zero cor hardcoded — deve ser vazio
grep -rnE "#[0-9a-fA-F]{3,8}" src/ --include="*.tsx" --include="*.ts"
grep -rnE "bg-white|bg-gray-|text-gray-|text-white|bg-slate-" src/
```

## Formato de commit

```
<type>(<escopo>): <descrição>

- bullet
- bullet
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`.
