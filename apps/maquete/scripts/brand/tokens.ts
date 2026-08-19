// Lê os tokens de cor do SSOT da maquete (`src/app/globals.css`).
//
// 🔴 POR QUE ISTO EXISTE: a arte da marca não pode carregar hex próprio.
// Se a paleta mudar no SSOT, a arte muda junto ou o gerador quebra —
// nunca uma terceira paleta paralela vivendo em `scripts/`.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
export const RAIZ_MAQUETE = resolve(AQUI, '..', '..');
export const SSOT = resolve(RAIZ_MAQUETE, 'src', 'app', 'globals.css');

export type Tokens = Readonly<Record<string, string>>;

/** Os tokens que a arte tem direito de usar. Pedir qualquer outro é erro. */
const EXIGIDOS = [
  'bg',
  'surface',
  'surface-2',
  'border',
  'border-strong',
  'text',
  'text-secondary',
  'text-muted',
  'signal',
  'signal-dim',
  'signal-fg',
] as const;

export function lerTokens(): Tokens {
  const css = readFileSync(SSOT, 'utf8');
  const achados: Record<string, string> = {};

  for (const nome of EXIGIDOS) {
    const re = new RegExp(`--color-${nome}\\s*:\\s*(#[0-9a-fA-F]{3,8})\\s*;`);
    const m = re.exec(css);
    if (m === null || m[1] === undefined) {
      throw new Error(
        `token --color-${nome} não existe em ${SSOT}. ` +
          `A arte se recusa a inventar cor: ou o token volta, ou a arte muda.`,
      );
    }
    achados[nome] = m[1];
  }

  return Object.freeze(achados);
}

/** Cor do token + opacidade, como `rgb(r g b / a)` — sem inventar hex novo. */
export function comAlfa(hex: string, alfa: number): string {
  const h = hex.replace('#', '');
  const p =
    h.length === 3
      ? [h[0]! + h[0]!, h[1]! + h[1]!, h[2]! + h[2]!]
      : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];
  const [r, g, b] = p.map((x) => parseInt(x!, 16));
  return `rgb(${r} ${g} ${b} / ${alfa.toFixed(3)})`;
}
