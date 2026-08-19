# ⚙️ ORDEM COMERCIAL — FARO™ · A ESCADA E O RITUAL
**De:** o guia do FARO · **Martelo do dono:** 19/08/2026 ("ótimo" — selado)
**Repo:** `AbnadabyBonaparte/faro` · **Trilho:** branch `faro/comercial-escada-e-ritual` + PR · nunca push na main · merge é do dono
**Coordenação:** esta ordem é independente da Onda 2 (jazida). Ela toca SÓ `docs/canon/` e `apps/maquete/`. NÃO tocar em `IDENTIDADE-VISUAL.md` nem no doc GENSPARK — isso é housekeeping da Onda 2, evitar conflito de merge.

---

## §0 — VERTEX
Sincronizar com a main atual, confirmar SHA. Se a branch da Onda 2 já existir, declarar e seguir — os escopos não se cruzam.

## §1 — CANON: A ESCADA DE PREÇOS v2 (emenda em `MODELO-DE-NEGOCIO.md §D`)

Substituir a tabela de hipóteses pela ESCADA selada pelo dono em 19/08 — **tudo permanece HIPÓTESE até o piloto pago** (a moldura da Lei 7 não muda; muda a hipótese registrada):

| Degrau | Preço | Entrega |
|---|---|---|
| **FARO Caçada** (entrada avulsa — todo cliente começa aqui) | **R$ 997** | 1 tese parametrizada · **os 3 melhores alvos, ranqueados** (ficha completa: EV líquido, fonte+data por linha, "por que não perseguir") · Eco de 30 dias (1 alerta se evento novo bater na tese) · abate 100% no 1º mês do Pro se assinar em 30 dias |
| **FARO Pro** | **R$ 1.997/mês** | 3 teses vivas · **7 fichas novas/mês** · Watch contínuo · CSV |
| **FARO Escritório** | **R$ 3.997/mês** | 7 teses vivas · **15 fichas/mês** · multiusuário · curadoria assistida · prioridade |
| **Operador Profissional** | sob proposta (`ESTIMATIVA: R$ 8–15k/mês`) | volume e profundidade sob desenho · contrato próprio · nunca indexado a êxito |
| **Ficha extra** (crédito de investigação) | **R$ 349** | acima da franquia de qualquer plano |

Registrar no texto as 3 leis da escada: (1) **régua descendente** — R$/ficha cai subindo (332 → 285 → 266) e a ficha extra é sempre mais cara que a de plano, senão a escada não empurra; (2) **cada degrau dobra** (997 → 1.997 → 3.997); (3) **escassez é o produto** — decreto do dono: entregar volume na entrada mata o retorno; "não vendemos volume, vendemos pontaria". O FARO Solo (R$297) está **morto** — remover, com nota de porquê (convite ao cliente errado, hit-and-run). Volumes de fichas = hipótese a calibrar pelo ledger da Fase 1. Compromisso trimestral e gratuidade-proibida permanecem como estão.

## §2 — CANON: `docs/canon/RITUAL-DO-ACEITE.md` (documento novo)

A spec do funil de compra, decretada pelo dono em 19/08. Estrutura:

**§2.1 O problema:** cliente não sabe montar tese perfeita; tese ruim = entrega frustrada = reembolso. O ritual resolve ANTES de cobrar.

**§2.2 Os 4 passos (toda compra passa por eles, sem exceção):**
1. **A presa em língua de gente** — campo livre; login obrigatório ANTES (nenhum passo do ritual roda anônimo).
2. **O Espelho do Refinador** — IA da casa traduz pra tese paramétrica e exibe duas colunas: "o que tu pediste" × "o que dá pra caçar COM PROVA", com todo proxy declarado como proxy (Confidence Policy operando na venda). Refino é grátis e ilimitado ANTES da caça; tese nova DEPOIS da entrega = Caçada nova.
3. **O Censo Prévio** — contagem do território na jazida ANTES de cobrar, exibida **só em faixa/ordem de grandeza**. Território magro → o sistema recusa a venda e sugere alargar a tese (reembolso se evita aqui, não no jurídico).
4. **O Aceite da Caçada** — página gerada na hora: tese final por extenso · o que será entregue (quantidade, prazo, formato, fontes em nível de categoria) · **o que NÃO é** (não é parecer; não garante conversão; "sinais compatíveis para investigação") · checkbox + botão "Aprovo esta caçada" · **só então pagamento e execução**. O aceite grava na trilha imutável: quem, quando, qual versão da tese (prova em caso de disputa).

**§2.3 A Defesa do Funil (contra o garimpo pré-pagamento):**
- Censo só em faixa: sem número exato, sem recorte por sub-critério, sem nome de empresa, sem export;
- Identificação verificada antes do censo + **3 censos de cortesia por conta**; do 4º em diante, só com Caçada;
- `usage_ledger` vigia o padrão censo-sem-compra e corta o funil educadamente (o abuso vira dado);
- O método fino (quais fontes, quais campos, como se cruza) só aparece na ficha PAGA.
- Calibragem registrada: a contagem é quase-commodity; o fosso (ranking, EV, evento, "por que não") mora atrás do pagamento — não sobre-defender o funil a ponto de criar atrito pro honesto.

**§2.4 Simetria com a Regra de Pedro:** na entrega, o sistema deixa a carga reservada esperando o "pode fechar" do humano; na compra, é o cliente que dá o "pode fechar" antes do motor gastar bala. Referenciar `REGRA-DE-PEDRO.md`.

**§2.5 Pendência declarada:** frente **L5 do LEXIS** — redação jurídica do aceite ante o direito de arrependimento (CDC art. 49): cláusula de execução imediata mediante consentimento expresso. Adicionar L5 à lista de frentes LEXIS onde ela estiver registrada (Dossiê de Bordo §10). Na Fase 1 (serviço ao design partner), o ritual roda À MÃO: leitura conjunta = Refinador; proposta assinada = Aceite.

## §3 — MAQUETE: página `/precos` refeita + copy da home

Exceção legítima e DECLARADA à guarda "maquete intocada": esta ordem é uma ordem DE maquete. Ajustar a guarda com honestidade — ela deve reprovar toque em maquete **em branches de Onda do motor**, não em branches `faro/comercial-*` ou de maquete; registrar o ajuste no PR (lição da casa: guarda se ajusta declarando, nunca se enfraquece em silêncio).

1. **`/precos`:** refazer com a escada do §1 — a Caçada como carta destacada (borda `--signal`, selo "A porta — todo cliente começa aqui"), os 3 degraus acima, a régua R$/ficha visível (332→285→266), ficha extra no rodapé. Selo `HIPÓTESE` em todo preço, **sem checkout, sem lista de espera** (regra existente da maquete, não muda). Zero cor hardcoded — tokens do `globals.css`.
2. **`/precos` ganha uma seção "Como se compra"** com os 4 passos do ritual em resumo (ilustra o §2 — mock estático, sem formulário funcional).
3. **Copy da home:** a frase *"O motor só nasce com um design partner pagante. Isso é decisão registrada…"* está DESATUALIZADA desde o override de 19/08. Trocar por estado honesto: motor **em construção por ondas** (nada roda ainda; o quadro "o que existe × o que não existe" se atualiza conforme o real). Banner ANTI-QUANTUM permanece intocável.

## §4 — CONTRA-PROVA E PORTÃO
Build da maquete EXIT=0 · screenshot/render das rotas alteradas · diff dos docs do canon · guarda ajustada com o teste provando que ainda reprova toque em maquete numa branch de Onda. 🛑 PR aberto, SEM merge — relatório em língua de dono (manchete → provado → falta → decisões dele). Fila de merge conhecida: nenhuma; se a Onda 2 abrir PR antes, declarar a ordem sugerida de merge pro dono.

Caça bem. A escada agora é lei em construção. 🐺🔨
