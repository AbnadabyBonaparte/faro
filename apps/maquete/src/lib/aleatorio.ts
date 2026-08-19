/** PRNG determinístico (mulberry32).
 *
 * Os gráficos da marca precisam de textura "aleatória" que seja a MESMA em todo
 * render — servidor e cliente. `Math.random()` daria hidratação divergente e um
 * desenho diferente a cada visita. Semente fixa resolve os dois.
 */
export function semear(semente: number): () => number {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Arredonda para 1 casa — o SVG não precisa de 14 dígitos. */
export const n = (v: number): string => (Math.round(v * 10) / 10).toString()
