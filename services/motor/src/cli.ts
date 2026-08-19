/**
 * CLI DO MOTOR — o que a madrugada chama.
 *
 * Sem framework de CLI: são quatro comandos, e uma dependência a mais no
 * caminho crítico da coleta é uma dependência a mais que pode quebrar às 3h.
 *
 *   node --experimental-strip-types src/cli.ts fontes
 *   node --experimental-strip-types src/cli.ts coletar RFB-CNPJ 2026-08 [--conjunto empresas] [--arquivo Empresas1.zip]
 *   node --experimental-strip-types src/cli.ts local RFB-CNPJ empresas 2026-07 /caminho/arquivo.zip
 *   node --experimental-strip-types src/cli.ts diff <coleta-atual> [coleta-anterior]
 *   node --experimental-strip-types src/cli.ts cacar <codigo-tese> [--modo inicial|incremental]
 *   node --experimental-strip-types src/cli.ts publicar <cacada-id> [--limite N]
 */

import { executarColeta, carregarArquivoLocal } from './coleta/index.ts'
import { executarDiff } from './diff/index.ts'
import { executarCaca, versaoAtivaDaTese } from './caca/index.ts'
import { executarPublicacao } from './publica/index.ts'
import { fonte, FONTES } from './fontes/index.ts'
import { linhas as consultar } from './infra/pg.ts'
import { descreverPipeline } from './index.ts'

function bandeira(args: readonly string[], nome: string): string[] {
  const r: string[] = []
  for (let i = 0; i < args.length; i++) {
    if (args[i] === `--${nome}`) {
      const v = args[i + 1]
      if (v !== undefined) r.push(v)
    }
  }
  return r
}

async function principal(): Promise<void> {
  const [comando, ...args] = process.argv.slice(2)

  switch (comando) {
    case 'pipeline': {
      for (const e of descreverPipeline()) {
        console.log(
          `${e.implementada ? '✓' : '·'} ${e.etapa.padEnd(8)} onda ${String(e.onda)}  ${e.descricao}`,
        )
      }
      return
    }

    case 'fontes': {
      const registro = consultar(
        `SELECT source_id, status, coalesce(ultima_coleta_em::text, '—')
           FROM fontes.source_registry ORDER BY source_id`,
      )
      for (const [id, status, ultima] of registro) {
        const f = FONTES[id ?? '']
        const conjuntos = f === undefined ? '?' : f.conjuntos.map((c) => c.nome).join(', ')
        console.log(`${(id ?? '').padEnd(10)} ${(status ?? '').padEnd(13)} ${ultima}  [${conjuntos}]`)
      }
      return
    }

    case 'coletar': {
      const [sourceId, referencia] = args
      if (sourceId === undefined || referencia === undefined) {
        throw new Error('uso: coletar <source-id> <AAAA-MM> [--conjunto x] [--arquivo y]')
      }
      const conjuntos = bandeira(args, 'conjunto')
      const arquivos = bandeira(args, 'arquivo')
      const r = await executarColeta({
        sourceId,
        referencia,
        trabalho: process.env['FARO_TRABALHO'] ?? '/tmp/faro',
        ...(conjuntos.length > 0 ? { conjuntos } : {}),
        ...(arquivos.length > 0 ? { arquivos } : {}),
      })
      console.log(JSON.stringify(r, null, 2))
      return
    }

    case 'local': {
      const [sourceId, nomeConjunto, referencia, caminho] = args
      if (
        sourceId === undefined ||
        nomeConjunto === undefined ||
        referencia === undefined ||
        caminho === undefined
      ) {
        throw new Error('uso: local <source-id> <conjunto> <AAAA-MM> <caminho>')
      }
      const c = fonte(sourceId).conjuntos.find((x) => x.nome === nomeConjunto)
      if (c === undefined) throw new Error(`conjunto desconhecido: ${nomeConjunto}`)
      const r = await carregarArquivoLocal({
        sourceId,
        conjunto: c,
        caminho,
        referencia,
        quando: `${referencia}-01T03:00:00Z`,
      })
      console.log(JSON.stringify(r, null, 2))
      return
    }

    case 'diff': {
      const [atual, anterior] = args
      if (atual === undefined) throw new Error('uso: diff <coleta-atual> [coleta-anterior]')
      const r = executarDiff({
        coletaAtual: atual,
        ...(anterior === undefined ? {} : { coletaAnterior: anterior }),
      })
      console.log(JSON.stringify(r, null, 2))
      return
    }

    case 'cacar': {
      const [codigo] = args
      if (codigo === undefined) {
        throw new Error('uso: cacar <codigo-tese|--versao uuid> [--modo x]')
      }
      // `--versao` roda uma versao ESPECIFICA em vez da ativa. Existe porque uma
      // tese pode ter sub-perfis vivos ao mesmo tempo (T-MED: estoque e evento),
      // e `versaoAtivaDaTese` devolve um so. Nao e atalho de teste: sem isto o
      // sub-perfil segmentado nao teria como ser caçado pela linha de comando.
      const versaoPedida = bandeira(args, 'versao')[0]
      const versao = versaoPedida ?? versaoAtivaDaTese(codigo)
      if (versao === null) {
        throw new Error(`tese ${codigo} nao tem versao ativa — so tese ativa caça`)
      }
      const modo = bandeira(args, 'modo')[0] === 'inicial' ? 'inicial' : 'incremental'
      console.log(JSON.stringify(executarCaca({ teseVersaoId: versao, modo }), null, 2))
      return
    }

    case 'publicar': {
      const [cacadaId] = args
      if (cacadaId === undefined) throw new Error('uso: publicar <cacada-id> [--limite N]')
      const l = bandeira(args, 'limite')[0]
      console.log(
        JSON.stringify(
          executarPublicacao({ cacadaId, ...(l === undefined ? {} : { limite: Number(l) }) }),
          null,
          2,
        ),
      )
      return
    }

    default:
      console.error('comandos: pipeline · fontes · coletar · local · diff · cacar · publicar')
      process.exitCode = 2
  }
}

principal().catch((e: unknown) => {
  console.error(`\x1b[31m✗ ${String(e)}\x1b[0m`)
  process.exitCode = 1
})
