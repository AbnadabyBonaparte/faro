# ⚙️ ORDEM DE FUNDAÇÃO DO MOTOR — FARO™ · ONDA 1
**De:** o guia do FARO · **Autorização:** dada pelo dono em 19/08/2026 ("soltem o Kraken")
**Repo:** `AbnadabyBonaparte/faro` · **Trilho:** branch `faro/onda-1-fundacao` + PR de verdade · **NUNCA push na main** · merge é clique do dono

---

## §0 — CONTEXTO E A DECISÃO QUE MUDA O ESTADO

Tu conheces este repo: tu mesmo escreveste o `docs/DOSSIE-DE-BORDO.md` (commit `031a797`). O canon dizia "o motor nasce com o design partner pagante". **Essa decisão foi DERRUBADA pelo dono em 19/08/2026:** a construção do SaaS começa AGORA. O irmão do dono continua sendo a primeira dor e o primeiro cliente da Fase 1 — mas o FARO é produto multi-assinante, construído pra muitos.

**Primeira tarefa desta ordem:** gravar o override no repo — atualizar `docs/DOSSIE-DE-BORDO.md` (§6 "o que não existe" e §7 plano) com a marca `[ORDEM 19/08]`: motor em construção, portões por Onda, dono soberano em cada portão. O dossiê não pode mentir sobre o estado.

**Antes de qualquer coisa: VERTEX completo.** Ler o repo inteiro de novo (canon, junta, herança, maquete), confirmar o SHA da main atual, declarar divergências se houver. Sem planta, sem obra.

## §0.1 — A REGRA DE PEDRO (lei de fundação, grava em `docs/canon/REGRA-DE-PEDRO.md`)

Nascida da Parábola do Abacaxi, decretada pelo dono em 19/08/2026. Toda entrega do FARO — ficha, alerta, relatório, resposta:
1. **Responde o que foi perguntado COM PROVA** (fonte, data, limite de inferência);
2. **Traz o adjacente que não foi perguntado** (o evento vizinho, a tese ao lado — a mexerica na promoção);
3. **Argumenta contra si mesma quando deve** (campo "por que não perseguir");
4. **Deixa a carga reservada e espera o "pode fechar"** — o sistema prepara, o humano autoriza. Nunca o contrário.

Entrega que só responde a pergunta é bug de caráter, não feature. Esta regra guia decisões de schema, de UI e de copy em todas as Ondas.

## §1 — ESCOPO DA ONDA 1: A FUNDAÇÃO

O objetivo desta onda é o **esqueleto de produto**: estrutura de monorepo + schema completo do domínio + guardas de CI. **Nenhuma coleta real, nenhuma tela de produto, nenhum score calculado, nenhum pagamento, nenhum deploy novo.** A maquete (`apps/maquete`) fica intocada.

### 1.1 Estrutura (herda o padrão da casa: negócio em packages/, app é pele)
```
apps/maquete        (intocada)
apps/app            (esqueleto Next 16 + React 19 + TS strict — só shell autenticável, sem telas de produto)
packages/core       (domínio puro TS: tipos de tese, ficha, evento, score, evidência — zero dependência de framework)
packages/db         (migrations SQL + tipos gerados)
services/motor      (esqueleto do batch de madrugada: entrypoints coleta→diff→caça→score→publica, tudo stub declarado)
```
pnpm + Turborepo. TS strict em tudo.

### 1.2 Schema v1 (migrations SQL, uma preocupação por arquivo)

**Leis de banco invioláveis (padrão business-os, campeão da matriz):** RLS `ENABLE` + `FORCE` em **100% das tabelas** · zero grant pro `anon` · `revoke public/anon` no PRÓPRIO arquivo da migration · `service_role` nunca no app · `tenant_id` sempre derivado de sessão×memberships no servidor · trilhas append-only imutáveis (sem UPDATE/DELETE; correção = estorno com motivo).

Schemas e tabelas (nomes finais a teu critério técnico, domínio obrigatório):
- **core** — `tenants` (incl. o tenant próprio da ALSHAM, o garimpo da casa), `memberships`, `profiles`. **Lei de Dados no concreto:** isolamento por tenant é físico via RLS; nenhuma consulta cruza tenant.
- **fontes** — `source_registry`: a ficha COMPLETA do canon (§7.1 do MODELO-FARO-V2): source_id estável, órgão, forma de acesso, tipo, periodicidade, **frequência prometida** (transplante HL), última/próxima coleta, licença, campos disponíveis, cobertura, confiabilidade E1/E2/E3, status (viva/degradada/indisponível), **fallback declarado**. Inclui fonte NORMATIVA com versão (Relógio da Reforma).
- **jazida** — snapshots brutos por fonte: `source_id` · `collected_at` · `reference_date` · `source_version` · `hash` · payload. Desenhada pra LOTE (a lei do §11: nunca processar em tempo real; prever particionamento e a indexação como requisito de fundação, não otimização).
- **eventos** — mudanças de estado detectadas por diff entre coletas. Append-only, imutável. Tipo de evento como DADO, não enum (Anti-Viés da casa).
- **teses** — parametrizadas por tenant, **versionadas** (toda edição gera versão nova; ficha aponta pra versão que a gerou), com estado (ativa/estudo/segmentada/contraditada/morta) e certidão de proveniência pro catálogo da casa.
- **fichas** (oportunidades) — score decomposto nas 6 dimensões (cada peso e parcela gravados; o total é DERIVADO, nunca digitado) · **EV líquido com cada componente e seu selo** (`ESTIMATIVA` é coluna, não rodapé) · evidence chain (nós: afirmação · source_id · collected_at · reference_date · regra de transformação · confiança · **limite de inferência**) · Evidence Grade A–D derivado · Freshness · campo **"por que não perseguir"** · campos de proxy FISICAMENTE separados de campos de fato (Confidence Policy no schema, não na disciplina).
- **tribunal** — julgamentos: aprovar/descartar/monitorar + motivo estruturado (o motivo é dado de 1ª classe — é o combustível do Thesis Engine). Append-only.
- **watch** — assinaturas de monitoramento (tese/empresa/recorte/tipo de evento) + feed.
- **usage_ledger** — desde o dia 1: volume processado, computação, fichas publicadas/aprovadas, custo por tese/tenant.

### 1.3 Guardas de CI (nascem com o banco, não depois)
- Teste que enumera TODAS as tabelas e reprova se alguma estiver sem RLS FORCE ou com grant a anon.
- Teste de imutabilidade: UPDATE/DELETE em eventos/tribunal/ledger tem que FALHAR.
- Teste "score derivado": nenhuma escrita direta do total.
- Build + typecheck verdes.

### 1.4 Dados
**Zero dado real nesta onda.** Seeds e testes usam CNPJs sequenciais inválidos (padrão da maquete). Nenhum nome de fornecedor de IA em superfície que um dia seja visível a cliente (Lei do Motor Interno).

## §2 — O QUE FICA EXPLICITAMENTE FORA DA ONDA 1
Coleta real de qualquer fonte · parser de RFB/CCEE · cálculo de score sobre dado real · telas do produto além do shell · Stripe/pagamento · deploy do `apps/app` · qualquer tese jurídica das 3 bloqueadas (C1/C2/C3 seguem trancadas até LEXIS) · agro/PF.

## §3 — CONTRA-PROVA EXIGIDA NO RELATÓRIO (Lei 7)
SHA da branch e nº do PR · saída real do CI (link do run) · lista das tabelas com prova do teste de RLS 100% · prova do teste de imutabilidade falhando o UPDATE · árvore de diretórios criada · o diff do DOSSIE-DE-BORDO com o `[ORDEM 19/08]`. O que não couber provar: ❔ NÃO VERIFICADO, declarado.

## §4 — 🛑 PORTÃO DA ONDA 1
Ao terminar: **PARA.** PR aberto, sem merge. Relatório em língua de dono: manchete → o que foi provado → o que falta → **as decisões que são do dono**. Já sabemos de uma e tu deves listá-la com instrução de clique: **criar o projeto Supabase do FARO** (infra nova = custo = clique do dono) — especifica exatamente o que precisas (região, nome, o que configurar) pra ele clicar em 2 minutos.

**Fila que precede o merge desta PR:** nenhuma conhecida no repo faro. Se o VERTEX achar algo, declara.

## §5 — AS ONDAS SEGUINTES (só pra tu saberes o rumo; NÃO executar)
Onda 2 = a jazida viva (ingestão RFB Base Aberta + CCEE, fontes provadas vivas, diff→eventos) · Onda 3 = motor de caça + score com a tese T-04 real · Onda 4 = fichas na tela, Tribunal, Watch, onboarding. Cada uma terá ordem própria com portão.

Caça bem. O contrato desta casa é: o sistema sugere, o humano visa — e nada, NADA, sem prova. 🐙⚙️
