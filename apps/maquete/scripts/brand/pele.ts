// A PELE DA DIREÇÃO C — vocabulário comum das peças da Rodada 2.
//
// A direção-mãe foi selada: o breu como papel de cartório invertido, a Lei das
// Camadas contada em traço, e um fio jade atravessando como assinatura viva.
// Elementos da direção B (sonar) entram como detalhe secundário — anel de eco,
// régua angular — nunca como assunto principal.
//
// Nenhum hex mora aqui: as cores vêm de `lerTokens()`, que lê o `globals.css`.
// Nenhum `<text>` sai daqui: todo texto é contorno (ORDEM VISUAL R2 §3).

import { ATLAS_MONO, AVANCO_MONO, type Contorno, MARCA } from './contornos.ts';
import { comAlfa, type Tokens } from './tokens.ts';
import { n, semear } from './svg.ts';

export const CAMADAS = ['DADO', 'SINAL', 'INFERÊNCIA', 'TESE', 'OPORTUNIDADE'] as const;

/** Quantos traços NÃO passam de cada camada. O que passa é sempre o fio jade. */
export const DENSIDADE = [760, 250, 78, 19, 0] as const;

// ─── TEXTO EM CONTORNO ──────────────────────────────────────────────────────

/** Rótulo monoespaçado em contorno. `corpo` é a altura em unidades do desenho. */
export function rotulo(
  texto: string,
  x: number,
  y: number,
  corpo: number,
  cor: string,
  tracking = 0.18,
): string {
  const s = corpo / 100;
  const passo = AVANCO_MONO + tracking * 100;
  const glifos: string[] = [];
  [...texto].forEach((ch, i) => {
    const d = ATLAS_MONO[ch];
    if (d === undefined) throw new Error(`glifo '${ch}' fora do atlas mono — rodar gerar-contornos.py`);
    if (d !== '') glifos.push(`<path transform="translate(${n(i * passo)} 0)" d="${d}"/>`);
  });
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s.toFixed(4)})" fill="${cor}">${glifos.join('')}</g>`;
}

export function larguraRotulo(texto: string, corpo: number, tracking = 0.18): number {
  const passo = AVANCO_MONO + tracking * 100;
  return ((texto.length - 1) * passo + AVANCO_MONO) * (corpo / 100);
}

/** Frase em sans, já pré-composta em contorno pelo gerador Python. */
export function frase(c: Contorno, x: number, y: number, corpo: number, cor: string): string {
  const s = corpo / 100;
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s.toFixed(4)})" fill="${cor}"><path d="${c.d}"/></g>`;
}

export function larguraFrase(c: Contorno, corpo: number): number {
  return c.largura * (corpo / 100);
}

/** A marca: `FARO` em contorno, com o traço de sinal como acento mínimo. */
export function marca(t: Tokens, x: number, y: number, corpo: number): string {
  const s = corpo / 100;
  const traco = corpo * 0.085;
  const folga = corpo * 0.36;
  return [
    `<rect x="${n(x)}" y="${n(y - corpo * 0.72)}" width="${n(traco)}" height="${n(corpo * 0.72)}" fill="${t['signal']}"/>`,
    `<g transform="translate(${n(x + traco + folga)} ${n(y)}) scale(${s.toFixed(4)})" fill="${t['text']}"><path d="${MARCA.d}"/></g>`,
  ].join('');
}

export function larguraMarca(corpo: number): number {
  return corpo * 0.085 + corpo * 0.36 + MARCA.largura * (corpo / 100);
}

// ─── TEXTURA DE CARTÓRIO ────────────────────────────────────────────────────

/** A pauta do livro-razão: colunas verticais quase apagadas. */
export function pauta(t: Tokens, L: number, A: number, passo: number, forca = 1): string {
  const linhas: string[] = [];
  for (let x = 0; x <= L; x += passo) {
    linhas.push(`<path d="M${n(x)} 0V${A}" stroke="${comAlfa(t['border']!, 0.2 * forca)}" stroke-width="1"/>`);
  }
  return linhas.join('');
}

/** Blocos monoespaçados ilegíveis: textura de registro, nunca texto falso. */
export function registro(
  t: Tokens,
  L: number,
  A: number,
  passo: number,
  quantos: number,
  semente: number,
  forca = 1,
): string {
  const r = semear(semente);
  const p: string[] = [];
  for (let i = 0; i < quantos; i += 1) {
    const x = Math.floor(r() * (L / passo)) * passo + 6;
    const y = 20 + Math.floor(r() * ((A - 40) / 14)) * 14;
    const larg = 6 + Math.floor(r() * 4) * 4;
    p.push(`<path d="M${n(x)} ${n(y)}H${n(x + larg)}" stroke="${comAlfa(t['text-muted']!, 0.11 * forca)}" stroke-width="1"/>`);
  }
  return p.join('');
}

/** Cantoneiras: enquadramento de instrumento. Cantos, nunca cruz no centro. */
export function cantoneiras(t: Tokens, L: number, A: number, m: number, b: number, forca = 1): string {
  const c = comAlfa(t['border-strong']!, 0.6 * forca);
  const p = (x1: number, y1: number, x2: number, y2: number) =>
    `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${c}" stroke-width="1"/>`;
  return [
    p(m, m, m + b, m), p(m, m, m, m + b),
    p(L - m, m, L - m - b, m), p(L - m, m, L - m, m + b),
    p(m, A - m, m + b, A - m), p(m, A - m, m, A - m - b),
    p(L - m, A - m, L - m - b, A - m), p(L - m, A - m, L - m, A - m - b),
  ].join('');
}

// ─── O FUNIL DAS CAMADAS — o assunto da direção C ───────────────────────────

export type Faixas = {
  readonly x: number;
  readonly y: number;
  readonly largura: number;
  readonly altura: number;
  readonly semente: number;
  /** rótulo de camada à esquerda; pede espaço extra fora de `largura` */
  readonly rotulos?: { readonly corpo: number; readonly recuo: number };
  readonly forca?: number;
  /** onde o fio jade desce, em fração da largura */
  readonly eixo?: number;
};

/**
 * As cinco faixas da Lei das Camadas, com a densidade caindo de DADO para
 * OPORTUNIDADE, e o fio jade descendo pelo que sobreviveu a cada camada.
 *
 * 🔴 O funil não é ilustrado — é CONTADO. Os 760 traços de DADO estão todos
 * desenhados. Se alguém mudar a densidade, a imagem muda junto, porque ela não
 * é um desenho de um funil: ela é o funil.
 */
export function faixas(t: Tokens, f: Faixas): string {
  const r = semear(f.semente);
  const forca = f.forca ?? 1;
  const vao = f.altura / CAMADAS.length;
  const alturaFaixa = vao * 0.72;
  const eixo = f.x + f.largura * (f.eixo ?? 0.63);
  const trilha: Array<readonly [number, number]> = [];
  const p: string[] = [];

  CAMADAS.forEach((nome, i) => {
    const y = f.y + vao * i;
    const meio = y + alturaFaixa / 2;

    p.push(
      `<rect x="${n(f.x)}" y="${n(y)}" width="${n(f.largura)}" height="${n(alturaFaixa)}" rx="3"`,
      ` fill="${comAlfa(t['surface']!, 0.6 * forca)}" stroke="${comAlfa(t['border']!, 1 * forca)}" stroke-width="1"/>`,
    );

    if (f.rotulos !== undefined) {
      const { corpo, recuo } = f.rotulos;
      p.push(rotulo(nome, f.x - recuo, meio + corpo * 0.36, corpo, t['text-muted']!));
    }

    const marcas: string[] = [];
    for (let k = 0; k < DENSIDADE[i]!; k += 1) {
      const x = f.x + 10 + r() * (f.largura - 20);
      const h = alturaFaixa * (0.24 + r() * 0.46);
      marcas.push(
        `<path d="M${n(x)} ${n(meio - h / 2)}V${n(meio + h / 2)}"`,
        ` stroke="${comAlfa(t['text-secondary']!, (0.1 + r() * 0.24) * forca)}" stroke-width="1"/>`,
      );
    }
    p.push(marcas.join(''));

    const x = eixo + (r() - 0.5) * f.largura * 0.05;
    trilha.push([x, meio]);
    p.push(
      `<path d="M${n(x)} ${n(meio - alturaFaixa * 0.42)}V${n(meio + alturaFaixa * 0.42)}"`,
      ` stroke="${comAlfa(t['signal']!, 0.85 * forca)}" stroke-width="1.5"/>`,
    );
  });

  const entrada = f.y - vao * 0.26;
  const d: string[] = [`M${n(trilha[0]![0])} ${n(entrada)}`];
  trilha.forEach(([x, y], i) => {
    const [xa, ya] = i === 0 ? ([trilha[0]![0], entrada] as const) : trilha[i - 1]!;
    d.push(`C${n(xa)} ${n(ya + (y - ya) * 0.55)} ${n(x)} ${n(y - (y - ya) * 0.55)} ${n(x)} ${n(y)}`);
  });
  const [ux, uy] = trilha[trilha.length - 1]!;
  d.push(`L${n(ux)} ${n(uy + vao * 0.36)}`);

  p.push(
    `<path d="${d.join('')}" fill="none" stroke="${comAlfa(t['signal']!, 0.55 * forca)}" stroke-width="1.5"/>`,
    `<circle cx="${n(ux)}" cy="${n(uy)}" r="${n(f.largura * 0.004)}" fill="${comAlfa(t['signal']!, 0.95 * forca)}"/>`,
  );
  return p.join('');
}

/** Detalhe da direção B: um arco de eco, com a origem fora do quadro. */
export function ecoDistante(t: Tokens, L: number, A: number, forca = 1): string {
  const ox = -L * 0.1;
  const oy = A * 1.35;
  const p: string[] = [];
  for (let i = 3; i <= 9; i += 1) {
    const raio = (Math.hypot(L - ox, oy) * i) / 9;
    p.push(
      `<circle cx="${n(ox)}" cy="${n(oy)}" r="${n(raio)}" fill="none"`,
      ` stroke="${comAlfa(t['border-strong']!, 0.3 * forca)}" stroke-width="1"/>`,
    );
  }
  return `<g clip-path="url(#quadro)">${p.join('')}</g>`;
}
