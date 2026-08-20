import { createHash, timingSafeEqual } from 'node:crypto'

/* ============================================================================
   PORTÃO DA /osc — chave de acesso de fundador, sem backend
   ============================================================================

   O que isto NÃO é: não é conta, não é cadastro, não é login. É uma CHAVE —
   uma frase que o dono entrega a quem ele quer que entre, e que ele revoga
   trocando uma variável de ambiente.

   POR QUE A CHAVE NUNCA APARECE NO NAVEGADOR
   `OSC_ACCESS_KEY` não leva o prefixo `NEXT_PUBLIC_` de propósito. Toda
   variável com esse prefixo é assada no bundle que vai para o cliente — quem
   abrir o inspetor lê. Sem o prefixo, a variável só existe no servidor, e o
   navegador nunca vê o valor.

   O QUE O COOKIE GUARDA
   Não guarda a chave. Guarda um SELO derivado dela por SHA-256, com pimenta
   fixa. Se alguém ler o cookie, tem o passe daquela sessão — isso é inerente a
   qualquer cookie de acesso — mas não tem a chave, e portanto não sabe o que
   digitar em outro navegador nem o que o dono precisa trocar.
   ========================================================================== */

/** Pimenta fixa: separa este selo de qualquer outro SHA-256 da mesma chave. */
const PIMENTA = 'faro/osc/portao/v1'

/** O valor que vai no cookie. Deriva da chave, mas não a revela. */
export function selo(chave: string): string {
  return createHash('sha256').update(`${PIMENTA}:${chave}`).digest('hex')
}

/**
 * A chave configurada, ou `undefined` se o dono ainda não configurou.
 *
 * Chave vazia ou só espaço conta como NÃO configurada: variável setada por
 * engano com string vazia liberaria a página achando que a protege — e um
 * portão que se acha trancado é pior que portão nenhum.
 */
export function chaveDaCasa(): string | undefined {
  const bruta = process.env['OSC_ACCESS_KEY']
  const limpa = bruta?.trim()
  return limpa === undefined || limpa === '' ? undefined : limpa
}

/**
 * Compara em tempo constante.
 *
 * O `===` de string curto-circuita no primeiro caractere diferente, e a
 * diferença de tempo entre "errou na primeira letra" e "errou na última" é
 * medível pela rede. Comparar os SELOS (sempre 64 caracteres) resolve as duas
 * coisas: tempo constante e comprimento igual, que é o que `timingSafeEqual`
 * exige para não estourar.
 */
export function confere(tentativa: string, chave: string): boolean {
  const a = Buffer.from(selo(tentativa), 'utf8')
  const b = Buffer.from(selo(chave), 'utf8')
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Nome do cookie e escopo — só a /osc precisa dele. */
export const COOKIE = 'faro_osc'
export const COOKIE_PATH = '/osc'
