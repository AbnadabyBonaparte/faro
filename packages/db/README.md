# @faro/db — o schema v1

**O SQL é a fonte de verdade.** Este pacote guarda as migrations e um índice
tipado delas; não há ORM nem schema paralelo em TypeScript que possa divergir.

> Lição do Banco de Evolução: *"todo projeto com banco precisa de baseline
> versionado — sem baseline, o repositório mente sobre o banco"*. Aqui o
> repositório **é** o baseline, desde a primeira migration.

## Ordem das migrations

Uma preocupação por arquivo. O prefixo numérico é a ordem.

| # | Arquivo | O que trata |
|---|---|---|
| 0001 | `bootstrap_papeis` | Papéis (`anon`/`authenticated`/`service_role`), schemas, revokes e *default privileges* |
| 0002 | `core_tenants` | Tenants, memberships, profiles · a função que deriva tenant da sessão |
| 0003 | `fontes_source_registry` | Source Registry completo + saúde de coleta + fonte normativa com versão |
| 0004 | `imutabilidade` | A trava append-only (trigger + revoke) |
| 0005 | `jazida` | Coletas e snapshots brutos, **particionados por fonte** |
| 0006 | `eventos` | Tipos (dado, não enum) e eventos derivados de diff |
| 0007 | `teses` | Teses versionadas, estado e certidão de proveniência |
| 0008 | `fichas` | Ficha, parcelas de score, cadeia de evidência, adjacentes, por-que-não |
| 0009 | `tribunal_watch_uso` | Julgamentos, assinaturas de Watch, feed e `usage_ledger` |

## As leis que o banco cobra

Não são recomendações — são recusas.

| Lei | Como o banco cobra | Guarda |
|---|---|---|
| **RLS em 100%** | `ENABLE` + `FORCE` em toda tabela; zero grant a `anon`/`PUBLIC` | `guard_01_rls` |
| **Trilha imutável** | Trigger `BEFORE UPDATE OR DELETE` — pega até quem tem `BYPASSRLS` | `guard_02_imutabilidade` |
| **Score derivado** | `score_total` só é escrito por `fichas.recalcular_score()`; escrita direta lança exceção | `guard_03_score_derivado` |
| **Proxy nunca vira fato** | Fato e proxy em **colunas diferentes**; proxy sem base e limite é rejeitado | `guard_04_regra_de_pedro` |
| **Regra de Pedro** | `limite_de_inferencia` NOT NULL não-vazio; ação executada exige autor nomeado | `guard_04_regra_de_pedro` |
| **Tese do assinante é do assinante** | Policies por `tenant_id` derivado de sessão × memberships | `guard_01_rls` |
| **Certidão de proveniência** | Tese da casa não fica `ativa` sem certidão | `guard_04_regra_de_pedro` |

## Rodar as guardas

```bash
# precisa de um Postgres alcançável (PGHOST/PGUSER/PGPASSWORD)
pnpm db:guards
```

Cria um banco limpo, aplica as migrations na ordem e executa cada guarda. O CI
roda o mesmo comando — e depois **sabota o banco de propósito** para provar que
as guardas reprovam quando devem.

## Onde isto ainda não roda

**Não há projeto Supabase.** As migrations foram provadas contra Postgres 16
puro. Provisionar o projeto é clique do dono — ver o relatório da Onda 1.

Quando existir, entram duas coisas que Postgres puro não tem: a FK de
`core.profiles.id` para `auth.users`, e o `service_role` real. Ambas em migration
de ambiente, separada — para que o CI continue rodando sem Supabase.
