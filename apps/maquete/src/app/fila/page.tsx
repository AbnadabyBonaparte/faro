import { HeroPagina } from '@/components/marca/Faixa'
import { Fila } from '@/components/Fila'

export default function Page() {
  return (
    <>
    <HeroPagina
      selo="PASSO 3 · A FICHA"
      titulo="A fila é de eventos, não de empresas."
      chamada="Cada ficha nasce de uma mudança datada, com score decomposto, grau de evidência e o motivo declarado para não perseguir."
      fundo="/brand/rodada-2/fundo-fila-1920x360.svg"
    />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">

        <Fila />
      </div>
    </>
  )
}
