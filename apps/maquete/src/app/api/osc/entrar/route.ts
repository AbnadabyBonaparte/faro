import { NextResponse } from 'next/server'
import { COOKIE, COOKIE_PATH, chaveDaCasa, confere, selo } from '@/lib/portao'

/**
 * Recebe a chave, confere e devolve o cookie de sessão.
 *
 * É um POST de formulário HTML puro, sem JavaScript no cliente: a chave sai do
 * campo direto para o servidor, e nenhum código de navegador chega perto dela.
 * A resposta é sempre um 303 de volta para /osc — no acerto, com o selo; no
 * erro, com `?erro=1` e nada mais.
 */
export async function POST(req: Request): Promise<Response> {
  const destino = new URL(COOKIE_PATH, req.url)
  const chave = chaveDaCasa()

  // Portão desligado: não há o que conferir, e a /osc já está aberta.
  if (chave === undefined) return NextResponse.redirect(destino, 303)

  const formulario = await req.formData()
  const tentativa = formulario.get('chave')

  if (typeof tentativa !== 'string' || !confere(tentativa, chave)) {
    destino.searchParams.set('erro', '1')
    return NextResponse.redirect(destino, 303)
  }

  const resposta = NextResponse.redirect(destino, 303)
  resposta.cookies.set(COOKIE, selo(chave), {
    httpOnly: true,
    sameSite: 'lax',
    // Em produção o cookie só viaja por HTTPS. Em desenvolvimento, `secure`
    // impediria o portão de funcionar em http://localhost.
    secure: process.env.NODE_ENV === 'production',
    path: COOKIE_PATH,
    // Sem `maxAge` nem `expires`: cookie de sessão, morre quando o navegador
    // fecha. Chave de fundador não é para ficar guardada em máquina alheia.
  })
  return resposta
}
