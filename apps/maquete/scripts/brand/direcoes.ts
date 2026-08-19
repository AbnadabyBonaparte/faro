// AS TRÊS DIREÇÕES DA RODADA 1 — desenho vetorial, zero dependência de npm.
//
// Toda cor vem de `lerTokens()` (SSOT: src/app/globals.css). Nenhum hex mora
// aqui. Toda posição "aleatória" vem de `semear()` com semente fixa: mesma
// semente, mesmo arquivo, byte a byte — é o que permite a certidão da §0.5
// dizer "gerador + parâmetros" no lugar de "prompt".

import { comAlfa, type Tokens } from './tokens.ts';
import { documento, MONO, n, SANS, semear } from './svg.ts';

export type Formato = 'hero' | 'social' | 'fundo';

export const DIMENSOES: Readonly<Record<Formato, readonly [number, number]>> = {
  hero: [2400, 1260],
  social: [1200, 1200],
  fundo: [1920, 1080],
};

/** As únicas frases autorizadas na arte (ordem §0.7). Nenhum número.
 *  As três direções carregam a MESMA frase de propósito: no portão do dono só
 *  a direção pode variar, senão ele estaria escolhendo copy junto sem saber. */
export const FRASE_HERO = 'Não procure clientes. Ensine o FARO a encontrá-los.';
export const FRASE_SOCIAL = 'O sinal está vivo.';
export const ASSINATURA = 'FARO™ — INTELIGÊNCIA CONTÍNUA DE OPORTUNIDADES';

// ─────────────────────────────────────────────────────────────────────────────
// PEÇAS COMUNS — a pele do instrumento
// ─────────────────────────────────────────────────────────────────────────────

/** Marca tipográfica: `FARO` em sans pesado, tracking aberto, e o traço de
 *  sinal como acento mínimo. Nunca ícone ilustrativo (IDENTIDADE-VISUAL §8). */
function marca(t: Tokens, x: number, y: number, corpo: number): string {
  const traco = corpo * 0.062;
  return [
    `<rect x="${n(x)}" y="${n(y - corpo * 0.78)}" width="${n(traco)}"`,
    ` height="${n(corpo * 0.9)}" fill="${t['signal']}"/>`,
    `<text x="${n(x + traco + corpo * 0.34)}" y="${n(y)}" font-family="${SANS}"`,
    ` font-size="${n(corpo)}" font-weight="700" letter-spacing="${n(corpo * 0.14)}"`,
    ` fill="${t['text']}">FARO</text>`,
  ].join('');
}

/** Cantoneiras: o enquadramento do instrumento. Cantos, nunca cruz no centro —
 *  mira é item recusado pelo canon (§8) e pela ordem (§0.3). */
function cantoneiras(t: Tokens, L: number, A: number, m: number, b: number): string {
  const c = comAlfa(t['border-strong']!, 0.6);
  const p = (x1: number, y1: number, x2: number, y2: number) =>
    `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${c}" stroke-width="1"/>`;
  return [
    p(m, m, m + b, m), p(m, m, m, m + b),
    p(L - m, m, L - m - b, m), p(L - m, m, L - m, m + b),
    p(m, A - m, m + b, A - m), p(m, A - m, m, A - m - b),
    p(L - m, A - m, L - m - b, A - m), p(L - m, A - m, L - m, A - m - b),
  ].join('');
}

/** O bloco de assinatura, igual nas três direções: marca + frase embaixo à
 *  esquerda, categoria em mono embaixo à direita. Fora da área de desenho. */
function rodape(t: Tokens, L: number, A: number, f: Formato): string {
  const mQuadro = L * 0.026;
  const mTexto = L * 0.055;
  const corpo = f === 'hero' ? 66 : 74;
  const frase = f === 'hero' ? 38 : 42;
  const selo = f === 'hero' ? 15 : 14;
  const baseMarca = f === 'hero' ? A - mTexto - 62 : A * 0.8;
  return [
    cantoneiras(t, L, A, mQuadro, L * 0.02),
    marca(t, mTexto, baseMarca, corpo),
    `<text x="${n(mTexto)}" y="${n(baseMarca + frase * 1.5)}" font-family="${SANS}"`,
    ` font-size="${n(frase)}" fill="${t['text']}">`,
    f === 'hero' ? FRASE_HERO : FRASE_SOCIAL,
    `</text>`,
    `<text x="${n(L - mTexto)}" y="${n(A - mTexto)}" text-anchor="end" font-family="${MONO}"`,
    ` font-size="${n(selo)}" letter-spacing="${n(selo * 0.2)}" fill="${t['text-muted']}">`,
    ASSINATURA,
    `</text>`,
  ].join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// DIREÇÃO A — O ABISSAL
// A luz morre com a profundidade, e alguma coisa passa DENTRO da luz que sobrou.
// O predador é ausência com forma: uma foice de breu que ocupa o que estava
// iluminado. Sem barbatana, sem mandíbula, sem olho.
// ─────────────────────────────────────────────────────────────────────────────

export function abissal(t: Tokens, f: Formato): string {
  const [L, A] = DIMENSOES[f];
  const r = semear(f === 'hero' ? 1901 : f === 'social' ? 1902 : 1903);
  const suave = f === 'fundo' ? 0.42 : 1;
  const defs: string[] = [];
  const c: string[] = [];

  defs.push(
    `<linearGradient id="coluna" x1="0" y1="0" x2="0" y2="1">`,
    `<stop offset="0" stop-color="${comAlfa(t['surface-2']!, 1 * suave)}"/>`,
    `<stop offset="0.24" stop-color="${comAlfa(t['surface-2']!, 0.72 * suave)}"/>`,
    `<stop offset="0.52" stop-color="${comAlfa(t['surface']!, 0.2 * suave)}"/>`,
    `<stop offset="0.8" stop-color="${comAlfa(t['bg']!, 0)}"/>`,
    `<stop offset="1" stop-color="${comAlfa(t['bg']!, 0)}"/>`,
    `</linearGradient>`,
    `<radialGradient id="eixo" gradientUnits="userSpaceOnUse"`,
    ` cx="${n(L * 0.5)}" cy="${n(-A * 0.18)}" r="${n(L * 0.66)}">`,
    `<stop offset="0" stop-color="${comAlfa(t['signal-dim']!, 0.22 * suave)}"/>`,
    `<stop offset="1" stop-color="${comAlfa(t['signal-dim']!, 0)}"/>`,
    `</radialGradient>`,
    // 🔴 sRGB explícito: o padrão do SVG é linearRGB, e a ida-e-volta de gama
    // sobre quase-preto devolve um verde CLARO — a sombra virava lente acesa.
    // Descoberto renderizando; ver GALERIA-VISUAL.md.
    `<filter id="bruma" x="-25%" y="-60%" width="150%" height="220%" color-interpolation-filters="sRGB">`,
    `<feGaussianBlur stdDeviation="${n(L * 0.011)}"/></filter>`,
    `<filter id="corpo" x="-25%" y="-60%" width="150%" height="220%" color-interpolation-filters="sRGB">`,
    `<feGaussianBlur stdDeviation="${n(L * 0.007)}"/></filter>`,
    `<filter id="lume" x="-300%" y="-300%" width="700%" height="700%" color-interpolation-filters="sRGB">`,
    `<feGaussianBlur stdDeviation="${n(L * 0.005)}"/></filter>`,
  );

  c.push(`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`);
  c.push(`<rect width="${L}" height="${A}" fill="url(#coluna)"/>`);
  c.push(`<rect width="${L}" height="${A}" fill="url(#eixo)"/>`);

  // estratos: a água em camadas, cada vez mais raras conforme desce
  for (let i = 0; i < 18; i += 1) {
    const y = A * (0.05 + Math.pow(i / 18, 1.5) * 0.95);
    const a = (0.13 - i * 0.006) * suave;
    if (a <= 0.005) continue;
    c.push(`<path d="M0 ${n(y)}H${L}" stroke="${comAlfa(t['border']!, a)}" stroke-width="1"/>`);
  }

  /** foice de breu: lente longa e fina, atravessando a faixa iluminada.
   *  Sai em duas passadas — o contraluz difuso primeiro, o corpo opaco por
   *  cima. Sem o contraluz a silhueta some no breu; com ele, a forma se lê
   *  sem que nada de figurativo precise ser desenhado. */
  const foice = (cy: number, esp: number, inc: number, op: number): string => {
    const d =
      `M${n(-L * 0.14)} ${n(cy + inc)}` +
      `C${n(L * 0.3)} ${n(cy - esp + inc * 0.4)} ${n(L * 0.7)} ${n(cy - esp - inc * 0.4)} ${n(L * 1.14)} ${n(cy - inc)}` +
      `C${n(L * 0.7)} ${n(cy + esp - inc * 0.4)} ${n(L * 0.3)} ${n(cy + esp + inc * 0.4)} ${n(-L * 0.14)} ${n(cy + inc)}Z`;
    return [
      `<g opacity="${n(op)}">`,
      `<path d="${d}" fill="none" filter="url(#bruma)"`,
      ` stroke="${comAlfa(t['signal-dim']!, 0.62)}" stroke-width="${n(L * 0.0032)}"/>`,
      `<path d="${d}" fill="${t['bg']}" filter="url(#corpo)"/>`,
      `</g>`,
    ].join('');
  };

  c.push(foice(A * 0.42, A * 0.125, A * 0.055, 1));
  c.push(foice(A * 0.79, A * 0.055, -A * 0.028, 0.34 * suave));

  // neve marinha
  const grao: string[] = [];
  const total = f === 'social' ? 420 : 620;
  for (let i = 0; i < total; i += 1) {
    const x = r() * L;
    const y = Math.pow(r(), 0.78) * A;
    const raio = 0.5 + r() * 1.8;
    const a = (0.04 + r() * 0.2) * suave;
    grao.push(`<circle cx="${n(x)}" cy="${n(y)}" r="${n(raio)}" fill="${comAlfa(t['text-muted']!, a)}"/>`);
  }
  c.push(`<g>${grao.join('')}</g>`);

  // bioluminescência: o cardume de sinal, concentrado num terço da tela
  const bx = f === 'social' ? L * 0.6 : L * 0.68;
  const by = A * 0.34;
  const bio: string[] = [];
  for (let i = 0; i < 18; i += 1) {
    const ang = r() * Math.PI * 2;
    const dist = Math.pow(r(), 0.6) * L * 0.16;
    const x = bx + Math.cos(ang) * dist;
    const y = by + Math.sin(ang) * dist * 0.6;
    const raio = 0.9 + r() * 2;
    const a = (0.18 + r() * 0.52) * suave;
    bio.push(`<circle cx="${n(x)}" cy="${n(y)}" r="${n(raio)}" fill="${comAlfa(t['signal']!, a)}"/>`);
  }
  c.push(`<g filter="url(#lume)">${bio.join('')}</g>`);

  // O RETORNO: um ponto que não é neve. Dois anéis, e o canon inteiro cabe aí.
  const rx = bx + L * 0.055;
  const ry = by - A * 0.02;
  c.push(
    `<circle cx="${n(rx)}" cy="${n(ry)}" r="${n(L * 0.03)}" fill="none"`,
    ` stroke="${comAlfa(t['signal']!, 0.14 * suave)}" stroke-width="1"/>`,
    `<circle cx="${n(rx)}" cy="${n(ry)}" r="${n(L * 0.013)}" fill="none"`,
    ` stroke="${comAlfa(t['signal']!, 0.34 * suave)}" stroke-width="1"/>`,
    `<circle cx="${n(rx)}" cy="${n(ry)}" r="${n(L * 0.003)}" fill="${comAlfa(t['signal']!, 0.95 * suave)}"/>`,
  );

  if (f === 'fundo') {
    return documento({ largura: L, altura: A, corpo: c, defs, titulo: 'FARO — direção A, textura de fundo' });
  }
  c.push(rodape(t, L, A, f));
  return documento({ largura: L, altura: A, corpo: c, defs, titulo: `FARO — direção A, ${f}` });
}

// ─────────────────────────────────────────────────────────────────────────────
// DIREÇÃO B — O SONAR
// O posto de escuta. A origem da varredura fica no canto de baixo, FORA do
// quadro: se ficasse no centro com raios cruzando, viraria mira, e mira é
// recusada pelo canon (§8) e pela ordem (§0.3). O feixe é estreito de
// propósito — "não vendemos volume, vendemos pontaria" também vale pra arte.
// ─────────────────────────────────────────────────────────────────────────────

export function sonar(t: Tokens, f: Formato): string {
  const [L, A] = DIMENSOES[f];
  const r = semear(f === 'hero' ? 2901 : f === 'social' ? 2902 : 2903);
  const suave = f === 'fundo' ? 0.45 : 1;
  const defs: string[] = [];
  const c: string[] = [];

  const ox = L * 0.04;
  const oy = A * 1.04;
  const alcance = Math.hypot(L - ox, oy);
  // feixe estreito: "não vendemos volume, vendemos pontaria" também na arte.
  const a0 = -Math.PI * 0.36; // trás do feixe
  const a1 = -Math.PI * 0.3; // frente do feixe — a linha que acende
  const px = (ang: number, d = alcance) => ox + Math.cos(ang) * d;
  const py = (ang: number, d = alcance) => oy + Math.sin(ang) * d;

  defs.push(
    `<radialGradient id="feixe" gradientUnits="userSpaceOnUse"`,
    ` cx="${n(ox)}" cy="${n(oy)}" r="${n(alcance)}">`,
    `<stop offset="0" stop-color="${comAlfa(t['signal-dim']!, 0.34 * suave)}"/>`,
    `<stop offset="0.5" stop-color="${comAlfa(t['signal-dim']!, 0.1 * suave)}"/>`,
    `<stop offset="1" stop-color="${comAlfa(t['signal-dim']!, 0)}"/>`,
    `</radialGradient>`,
    `<clipPath id="quadro"><rect width="${L}" height="${A}"/></clipPath>`,
  );

  c.push(`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`);
  c.push(`<g clip-path="url(#quadro)">`);

  // grade rígida — o instrumento tem régua (IDENTIDADE-VISUAL §6)
  const passo = f === 'social' ? 40 : 48;
  const grade: string[] = [];
  for (let x = 0; x <= L; x += passo) {
    const forte = x % (passo * 5) === 0;
    grade.push(`<path d="M${n(x)} 0V${A}" stroke="${comAlfa(t['border']!, (forte ? 0.95 : 0.34) * suave)}" stroke-width="1"/>`);
  }
  for (let y = 0; y <= A; y += passo) {
    const forte = y % (passo * 5) === 0;
    grade.push(`<path d="M0 ${n(y)}H${L}" stroke="${comAlfa(t['border']!, (forte ? 0.95 : 0.34) * suave)}" stroke-width="1"/>`);
  }
  c.push(grade.join(''));

  // os anéis do eco
  for (let i = 1; i <= 14; i += 1) {
    const raio = (alcance * i) / 14;
    c.push(
      `<circle cx="${n(ox)}" cy="${n(oy)}" r="${n(raio)}" fill="none"`,
      ` stroke="${comAlfa(t['border-strong']!, Math.max((0.95 - i * 0.055) * suave, 0.12))}" stroke-width="1"/>`,
    );
  }

  // raios: a régua angular do posto
  for (let i = 0; i <= 8; i += 1) {
    const ang = -Math.PI * 0.52 + (i / 8) * Math.PI * 0.44;
    c.push(
      `<path d="M${n(ox)} ${n(oy)}L${n(px(ang))} ${n(py(ang))}"`,
      ` stroke="${comAlfa(t['border']!, 0.4 * suave)}" stroke-width="1"/>`,
    );
  }

  // a varredura, e a linha que acende na frente dela
  c.push(
    `<path d="M${n(ox)} ${n(oy)}L${n(px(a0))} ${n(py(a0))}`,
    `A${n(alcance)} ${n(alcance)} 0 0 1 ${n(px(a1))} ${n(py(a1))}Z" fill="url(#feixe)"/>`,
    `<path d="M${n(ox)} ${n(oy)}L${n(px(a1))} ${n(py(a1))}"`,
    ` stroke="${comAlfa(t['signal']!, 0.55 * suave)}" stroke-width="1.5"/>`,
  );

  // ecos: quase todos mudos, poucos vivos
  const vivos: Array<[number, number]> = [];
  const ecos: string[] = [];
  for (let i = 0; i < (f === 'social' ? 62 : 84); i += 1) {
    const ang = -Math.PI * 0.56 + r() * Math.PI * 0.52;
    const dist = (0.12 + Math.pow(r(), 0.65) * 0.88) * alcance;
    const x = px(ang, dist);
    const y = py(ang, dist);
    if (x < 0 || x > L || y < 0 || y > A) continue;
    const dentroDoFeixe = ang >= a0 && ang <= a1;
    const vivo = dentroDoFeixe && r() < 0.3;
    if (vivo) vivos.push([x, y]);
    const a = (vivo ? 0.9 : 0.24 + r() * 0.36) * suave;
    const s = vivo ? 5 : 3;
    ecos.push(
      `<rect x="${n(x - s / 2)}" y="${n(y - s / 2)}" width="${s}" height="${s}"`,
      ` fill="${comAlfa(vivo ? t['signal']! : t['text-muted']!, a)}"/>`,
    );
  }
  c.push(ecos.join(''));

  // UM eco ganha moldura e nome de camada — o resto continua sendo ruído
  if (f !== 'fundo') {
    const [ax, ay] = vivos[0] ?? [L * 0.55, A * 0.42];
    const cx = L * 0.026;
    const fonte = L * 0.014;
    c.push(
      `<rect x="${n(ax - cx / 2)}" y="${n(ay - cx / 2)}" width="${n(cx)}" height="${n(cx)}" rx="3"`,
      ` fill="none" stroke="${comAlfa(t['signal']!, 0.8)}" stroke-width="1"/>`,
      `<path d="M${n(ax + cx / 2)} ${n(ay - cx / 2)}L${n(ax + cx * 1.4)} ${n(ay - cx * 1.15)}`,
      `H${n(ax + cx * 3.4)}" fill="none" stroke="${comAlfa(t['signal']!, 0.45)}" stroke-width="1"/>`,
      `<text x="${n(ax + cx * 1.5)}" y="${n(ay - cx * 1.4)}" font-family="${MONO}"`,
      ` font-size="${n(fonte)}" letter-spacing="${n(fonte * 0.2)}" fill="${t['signal']}">SINAL</text>`,
    );
  }

  c.push(`</g>`);

  if (f === 'fundo') {
    return documento({ largura: L, altura: A, corpo: c, defs, titulo: 'FARO — direção B, textura de fundo' });
  }
  c.push(rodape(t, L, A, f));
  return documento({ largura: L, altura: A, corpo: c, defs, titulo: `FARO — direção B, ${f}` });
}

// ─────────────────────────────────────────────────────────────────────────────
// DIREÇÃO C — A PROFUNDIDADE DOCUMENTAL
// O breu como papel de cartório invertido. As cinco faixas SÃO a Lei das
// Camadas (canon §3): de DADO até OPORTUNIDADE, e a densidade de traços cai
// junto — o funil não é ilustrado, é contado. O traço jade é UM evento
// descendo as camadas: assinatura viva, quase vertical, nunca gráfico.
// ─────────────────────────────────────────────────────────────────────────────

const CAMADAS = ['DADO', 'SINAL', 'INFERÊNCIA', 'TESE', 'OPORTUNIDADE'] as const;
// quantos NÃO passam da camada — o que passa é sempre o traço jade, um só.
const DENSIDADE = [760, 250, 78, 19, 0] as const;

export function documental(t: Tokens, f: Formato): string {
  const [L, A] = DIMENSOES[f];
  const r = semear(f === 'hero' ? 3901 : f === 'social' ? 3902 : 3903);
  const suave = f === 'fundo' ? 0.45 : 1;
  const c: string[] = [];

  c.push(`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`);

  // colunas ao longe — a pauta do livro-razão, quase apagada
  const col = f === 'social' ? 30 : 36;
  const pauta: string[] = [];
  for (let x = 0; x <= L; x += col) {
    pauta.push(`<path d="M${n(x)} 0V${A}" stroke="${comAlfa(t['border']!, 0.2 * suave)}" stroke-width="1"/>`);
  }
  c.push(pauta.join(''));

  // blocos monoespaçados ilegíveis: textura de registro, não texto falso
  const bloco: string[] = [];
  for (let i = 0; i < (f === 'social' ? 300 : 460); i += 1) {
    const x = Math.floor(r() * (L / col)) * col + 6;
    const y = 40 + Math.floor(r() * ((A - 80) / 14)) * 14;
    const larg = 6 + Math.floor(r() * 4) * 4;
    bloco.push(`<path d="M${n(x)} ${n(y)}H${n(x + larg)}" stroke="${comAlfa(t['text-muted']!, 0.11 * suave)}" stroke-width="1"/>`);
  }
  c.push(bloco.join(''));

  const m = L * 0.055;
  const topo = f === 'hero' ? A * 0.1 : A * 0.1;
  const base = f === 'hero' ? A * 0.74 : A * 0.66;
  const vao = (base - topo) / CAMADAS.length;
  const altura = vao * 0.72;
  const rotulo = f === 'hero' ? L * 0.11 : L * 0.19;
  const x0 = m + rotulo;
  const larg = L - m - x0;
  const eixo = x0 + larg * 0.63; // a coluna por onde o evento desce
  const trilha: Array<[number, number]> = [];

  CAMADAS.forEach((nome, i) => {
    const y = topo + vao * i;
    const meio = y + altura / 2;

    c.push(
      `<rect x="${n(x0)}" y="${n(y)}" width="${n(larg)}" height="${n(altura)}" rx="3"`,
      ` fill="${comAlfa(t['surface']!, 0.6 * suave)}"`,
      ` stroke="${comAlfa(t['border']!, 1 * suave)}" stroke-width="1"/>`,
    );

    if (f !== 'fundo') {
      const fonte = f === 'hero' ? L * 0.0112 : L * 0.0145;
      c.push(
        `<text x="${n(m)}" y="${n(meio + fonte * 0.36)}" font-family="${MONO}"`,
        ` font-size="${n(fonte)}" letter-spacing="${n(fonte * 0.2)}" fill="${t['text-muted']}">${nome}</text>`,
      );
    }

    // os traços da faixa: muitos em cima, um embaixo
    const marcas: string[] = [];
    for (let k = 0; k < DENSIDADE[i]!; k += 1) {
      const x = x0 + 10 + r() * (larg - 20);
      const h = altura * (0.24 + r() * 0.46);
      marcas.push(
        `<path d="M${n(x)} ${n(meio - h / 2)}V${n(meio + h / 2)}"`,
        ` stroke="${comAlfa(t['text-secondary']!, (0.1 + r() * 0.24) * suave)}" stroke-width="1"/>`,
      );
    }
    c.push(marcas.join(''));

    // o traço que sobrevive à camada — sempre na coluna do evento
    const x = eixo + (r() - 0.5) * larg * 0.05;
    trilha.push([x, meio]);
    c.push(
      `<path d="M${n(x)} ${n(meio - altura * 0.42)}V${n(meio + altura * 0.42)}"`,
      ` stroke="${comAlfa(t['signal']!, 0.85 * suave)}" stroke-width="1.5"/>`,
    );
  });

  // a assinatura viva: curva suave ligando o que sobreviveu, camada a camada
  const d: string[] = [`M${n(trilha[0]![0])} ${n(topo - vao * 0.26)}`];
  for (let i = 0; i < trilha.length; i += 1) {
    const [x, y] = trilha[i]!;
    const [xa, ya] = i === 0 ? [trilha[0]![0], topo - vao * 0.26] : trilha[i - 1]!;
    d.push(`C${n(xa)} ${n(ya + (y - ya) * 0.55)} ${n(x)} ${n(y - (y - ya) * 0.55)} ${n(x)} ${n(y)}`);
  }
  const [ux, uy] = trilha[trilha.length - 1]!;
  d.push(`L${n(ux)} ${n(uy + vao * 0.36)}`);
  c.push(
    `<path d="${d.join('')}" fill="none" stroke="${comAlfa(t['signal']!, 0.55 * suave)}" stroke-width="1.5"/>`,
    `<circle cx="${n(ux)}" cy="${n(uy)}" r="${n(L * 0.0034)}" fill="${comAlfa(t['signal']!, 0.95 * suave)}"/>`,
  );

  if (f === 'fundo') {
    return documento({ largura: L, altura: A, corpo: c, defs: [], titulo: 'FARO — direção C, textura de fundo' });
  }
  c.push(rodape(t, L, A, f));
  return documento({ largura: L, altura: A, corpo: c, defs: [], titulo: `FARO — direção C, ${f}` });
}
