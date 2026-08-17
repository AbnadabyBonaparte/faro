# FARO — instruções para agentes

## Leia a planta antes da obra

Antes de qualquer alteração, leia nesta ordem:

1. `docs/canon/MODELO-FARO-V2.md` — a spec vigente do produto
2. `docs/junta/QUADRO-DE-VEREDITOS.md` — o que já foi decidido e por quê
3. `docs/canon/IDENTIDADE-VISUAL.md` — a direção de arte e seus tokens

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

Exceção declarada: `docs/junta/` guarda os pareceres da Junta de Juízes, que são
**documentos internos de governança** e nomeiam as cadeiras por instrução do
dono. Não são copy de produto e não devem ser linkados em superfície voltada ao
cliente.

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

### 7. Dados fictícios sempre rotulados

Nenhuma empresa da maquete existe. CNPJs são sequenciais e inválidos de
propósito. Todo painel com número carrega selo `fictício`.

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
