# ⚙️ ORDEM DA ONDA 2 — FARO™ · A JAZIDA VIVA
**De:** o guia do FARO · **Autorização do dono:** 19/08/2026 (Onda 1 mergeada — PR #1, merge do dono às 11:36 UTC)
**Repo:** `AbnadabyBonaparte/faro` · **Trilho:** branch `faro/onda-2-jazida` + PR · NUNCA push na main · merge é do dono

---

## §0 — VERTEX E ARRUMAÇÃO DE CASA

1. **VERTEX:** sincronizar com a main pós-merge do PR #1, confirmar SHA, declarar qualquer divergência.
2. **Housekeeping de canon (decisões já seladas pelo guia — executar, não rediscutir):**
   - `IDENTIDADE-VISUAL-GENSPARK.md` sai do canon → vai pra `docs/heranca/` como documento de referência, com nota de cabeçalho: "espelho externo do IDENTIDADE-VISUAL.md; os tokens canônicos são os do `apps/maquete/src/app/globals.css` (`--bg: #06090c` etc.)".
   - Emenda no `docs/canon/IDENTIDADE-VISUAL.md` §3: gravar a spec do **MODO CLARO "papel de cartório"** (transplante aceito do doc de referência): `--bg-light #F6F4EE` · `--surface-light #FFFFFF` · `--text-light #10161F` · `--signal-light #0E7A56` · `--border-light #D8D3C6` — declarado como "previsto, implementação na onda da impressão de ficha". Marca `[EMENDA 19/08 — transplante aprovado]`.

## §1 — ESCOPO: AS DUAS FONTES-MÃE VIVAS E O DIFF QUE PARE EVENTOS

O objetivo da onda: **dado real entrando na jazida, e o motor de diff transformando duas coletas em EVENTOS.** As fontes do MVP, e só elas: **RFB Base Aberta do CNPJ** (a jazida-mãe) e **CCEE consumidores livres** (a fonte da tese de energia). Fonte normativa/Relógio da Reforma fica FORA (onda futura).

### 1.1 — Prova de vida das fontes (lei: toda fonte é provada viva antes de ser prometida)
Pra cada uma das 2 fontes:
- Localizar o endpoint oficial ATUAL (a RFB muda o caminho dos lotes; não confiar em URL decorada — descobrir e registrar).
- **Baixar de verdade** ao menos um arquivo real do lote (RFB: um dos CSVs do conjunto — ex. Empresas0; CCEE: a lista completa, que é pequena).
- Conferir os campos reais contra o que o `source_registry` promete; divergência de layout = registrar, ajustar o registry, declarar no relatório.
- Preencher a ficha completa no `fontes.source_registry` (seed via migration ou script idempotente): endpoint, periodicidade real, frequência prometida, licença, campos, cobertura, E1, status `viva`, fallback declarado.
- Registrar a coleta em `jazida.coletas` + `fontes.saude_coleta` com bytes, hash, duração, `collected_at`, `reference_date` (a data de referência do lote RFB é a do mês do lote, não a do download — não confundir as duas).

### 1.2 — Coletores e parsers (`services/motor`)
- Coletor RFB: download resumível, verificação de hash, descompactação, parser do layout oficial (empresas/estabelecimentos/simples — implementar os conjuntos necessários às teses do MVP; os demais ficam declarados como não-ingeridos), carga em `jazida.snapshots` na partição da fonte. **Idempotente**: rodar duas vezes a mesma coleta não duplica.
- Coletor CCEE: parser da lista, mesma disciplina.
- **Carga completa da RFB (60M+) NÃO roda nesta onda** — o ambiente não é o lugar dela. A onda prova com **amostra real** (um arquivo do lote, integral). O plano e o custo estimado da carga completa (armazenamento, tempo, banda no Supabase) são ENTREGA DO RELATÓRIO, pra decisão do dono no portão.

### 1.3 — O motor de diff → eventos (o coração)
- Comparar coleta N contra N-1 por chave natural (CNPJ/estabelecimento) e parir `eventos.eventos` append-only.
- Tipos de evento iniciais como SEED DE DADO (nunca enum): `estabelecimento_novo` · `cnae_alterado` · `porte_alterado` · `situacao_cadastral_alterada` · `entrou_simples` / `saiu_simples` · `consumidor_livre_novo` (CCEE) · `saiu_da_fonte`. Cada evento carrega: chave, fonte, coleta de origem e de comparação, o antes e o depois, `reference_date`.
- **Prova dupla:** (a) fixture sintética — duas coletas fabricadas com mudanças conhecidas → o diff tem que parir EXATAMENTE os eventos esperados, e o teste entra no CI; (b) amostra real — rodar o diff entre dois recortes reais quando os lotes permitirem, ou declarar ❔ se só houver um lote disponível no mês.

### 1.4 — Saúde e custo
- `fontes.saude_coleta`: todo run registrado; **mudança de estrutura detectada** (coluna a mais/a menos) rebaixa a fonte pra `degradada` e o run PARA com erro declarado — nunca ingestão silenciosa de layout errado.
- `uso.ledger`: cada coleta e cada diff lançam volume e duração. O custo por ficha do futuro começa a ser medido aqui.

### 1.5 — Infra real (condicional, sem bloquear a onda)
- **SE** os secrets `SUPABASE_DB_URL` e `SUPABASE_PROJECT_REF` existirem no repo: aplicar as 9 migrations no projeto real, rodar as 4 guardas CONTRA ELE (contra-prova em produção, não só local), criar a migration de ambiente (FK `auth.users`, papéis reais) que a Onda 1 deixou declarada, e ingerir a amostra lá.
- **SE NÃO existirem:** tudo se prova no Postgres local como na Onda 1, e o portão lista o clique pendente do dono sem drama. A onda NÃO trava na ausência do clique.

## §2 — FORA DESTA ONDA
Score · fichas · caça por tese (T-04 é a Onda 3) · telas · Stripe · deploy do app · carga completa dos 60M (decisão de custo do dono) · fonte normativa/Relógio · teses C1/C2/C3 (trancadas até LEXIS) · agro/PF.

## §3 — CONTRA-PROVA EXIGIDA (Lei 7)
URLs oficiais registradas · bytes e hash do que foi baixado · contagem de linhas ingeridas por tabela/partição · o quadro de eventos da fixture (esperado × obtido) · prints/saídas das guardas (local e, se houver secrets, contra o Supabase real) · CI verde com link do run · plano de carga completa com custo estimado e selo `ESTIMATIVA` em cada número.

## §4 — 🛑 PORTÃO DA ONDA 2
PR aberto, sem merge. Relatório: manchete → provado → falta → decisões do dono. Já previstas pra mesa dele: (1) merge · (2) secrets do Supabase se ainda faltarem · (3) o plano+custo da carga completa da jazida · (4) 🔴 lembrete de pauta: o repo segue PÚBLICO com o código do motor — a recomendação do guia e do executor é Private, decisão dele.

## §5 — LEMBRETES DE CARÁTER
Todo dado desta onda é PÚBLICO E OFICIAL (RFB/CCEE) — nenhum dado de cliente, nenhum CNPJ de tenant, nada da demanda comercial no repo. Nenhum fornecedor de IA em superfície que um dia seja de cliente. Regra de Pedro vale pro teu relatório também: responde com prova, traz o adjacente que achares no caminho, argumenta contra o próprio plano se descobrires razão, e deixa a carga reservada no portão.

Caça bem. A jazida te espera. 🐙⛏️
