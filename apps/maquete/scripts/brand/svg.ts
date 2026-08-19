// Utilitários de desenho. Sem dependência de npm: o gerador da marca é
// reproduzível com `node --experimental-strip-types` e nada mais.

/** PRNG determinístico (mulberry32). Mesma semente → mesmo arquivo, byte a byte. */
export function semear(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Arredonda pra 1 casa: arte não precisa de 14 dígitos, e o arquivo emagrece. */
export const n = (v: number): string =>
  (Math.round(v * 10) / 10).toString();

export const SANS =
  "'Liberation Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const MONO =
  "'Liberation Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

export type Doc = {
  readonly largura: number;
  readonly altura: number;
  readonly corpo: readonly string[];
  readonly defs: readonly string[];
  readonly titulo: string;
};

export function documento(d: Doc): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${d.largura}" height="${d.altura}"`,
    ` viewBox="0 0 ${d.largura} ${d.altura}" role="img" aria-label="${d.titulo}">`,
    `<title>${d.titulo}</title>`,
    d.defs.length > 0 ? `<defs>${d.defs.join('')}</defs>` : '',
    d.corpo.join(''),
    `</svg>`,
    '',
  ].join('');
}
