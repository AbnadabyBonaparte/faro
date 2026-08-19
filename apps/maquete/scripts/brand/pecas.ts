// AS PEÇAS DA RODADA 2 — a direção C aplicada, formato por formato.
//
// Regra que atravessa todas: arte é FUNDO, texto de leitura é HTML. As peças
// que precisam viajar sozinhas (OG, social, favicon) carregam texto — e nelas o
// texto é contorno, nunca `<text>`.

import { FRASE_HERO, FRASE_SINAL } from './contornos.ts';
import {
  cantoneiras, ecoDistante, faixas, frase, larguraRotulo, marca, pauta, registro, rotulo,
} from './pele.ts';
import { comAlfa, type Tokens } from './tokens.ts';
import { documento, n, semear } from './svg.ts';

const QUADRO = (L: number, A: number) => `<clipPath id="quadro"><rect width="${L}" height="${A}"/></clipPath>`;

// ─── HERO DA HOME ───────────────────────────────────────────────────────────
// O funil ocupa a direita; a esquerda fica quieta para a manchete em HTML.
// Curadoria P3 (o produto se mostra) + P1 (hero é manchete curta, não parede).

export function heroHome(t: Tokens): string {
  const L = 2400;
  const A = 1000;
  const c: string[] = [`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`];
  c.push(pauta(t, L, A, 36, 0.8));
  c.push(registro(t, L, A, 36, 300, 4101, 0.7));
  c.push(ecoDistante(t, L, A, 0.5));
  c.push(
    faixas(t, {
      x: L * 0.46, y: A * 0.13, largura: L * 0.48, altura: A * 0.74,
      semente: 4102, rotulos: { corpo: 20, recuo: 26 }, eixo: 0.58,
    }),
  );
  c.push(cantoneiras(t, L, A, L * 0.02, L * 0.016, 0.8));
  return documento({ largura: L, altura: A, corpo: c, defs: [QUADRO(L, A)], titulo: 'FARO — textura do hero, direção C' });
}

export function heroHomeMobile(t: Tokens): string {
  const L = 820;
  const A = 760;
  const c: string[] = [`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`];
  c.push(pauta(t, L, A, 28, 0.8));
  c.push(registro(t, L, A, 28, 140, 4103, 0.7));
  c.push(
    faixas(t, {
      x: L * 0.28, y: A * 0.3, largura: L * 0.64, altura: A * 0.6,
      semente: 4104, rotulos: { corpo: 15, recuo: 18 }, eixo: 0.6,
    }),
  );
  return documento({ largura: L, altura: A, corpo: c, defs: [], titulo: 'FARO — textura do hero mobile, direção C' });
}

// ─── FUNDOS DAS TELAS INTERNAS ──────────────────────────────────────────────
// "quase invisíveis — a tela é instrumento, o fundo não grita" (ordem §2.4).
// Sem faixas e sem rótulo: só a pauta e o registro, na força mais baixa.

export function fundoPagina(t: Tokens, semente: number): string {
  const L = 1920;
  const A = 360;
  const c: string[] = [`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`];
  c.push(pauta(t, L, A, 36, 0.55));
  c.push(registro(t, L, A, 36, 120, semente, 0.5));
  const r = semear(semente + 7);
  const x = L * (0.55 + r() * 0.35);
  c.push(
    `<path d="M${n(x)} 0V${A}" stroke="${comAlfa(t['signal']!, 0.28)}" stroke-width="1.5"/>`,
    `<circle cx="${n(x)}" cy="${n(A * (0.3 + r() * 0.4))}" r="4" fill="${comAlfa(t['signal']!, 0.8)}"/>`,
  );
  return documento({ largura: L, altura: A, corpo: c, defs: [], titulo: 'FARO — placa de fundo, direção C' });
}

// ─── BANNER DA /PRECOS — a escada, com a Caçada em destaque ─────────────────

const DEGRAUS = ['CAÇADA', 'PRO', 'ESCRITÓRIO', 'OPERADOR'] as const;
// Traços por degrau = fichas da franquia (MODELO-DE-NEGOCIO §D.0). Traço não é
// número escrito: o degrau mostra o que entrega sem prometer cifra nenhuma.
const FICHAS = [3, 7, 15, 28] as const;

export function bannerPrecos(t: Tokens): string {
  const L = 2400;
  const A = 760;
  const c: string[] = [`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`];
  c.push(pauta(t, L, A, 36, 0.7));
  c.push(registro(t, L, A, 36, 200, 4201, 0.6));

  const base = A * 0.82;
  const larg = L * 0.17;
  const folga = L * 0.035;
  const x0 = (L - (DEGRAUS.length * larg + (DEGRAUS.length - 1) * folga)) / 2;

  DEGRAUS.forEach((nome, i) => {
    const alt = A * (0.2 + i * 0.13);
    const x = x0 + i * (larg + folga);
    const entrada = i === 0;
    c.push(
      `<rect x="${n(x)}" y="${n(base - alt)}" width="${n(larg)}" height="${n(alt)}" rx="3"`,
      ` fill="${comAlfa(entrada ? t['signal']! : t['surface']!, entrada ? 0.1 : 0.7)}"`,
      ` stroke="${comAlfa(entrada ? t['signal']! : t['border-strong']!, entrada ? 0.85 : 0.7)}" stroke-width="1"/>`,
    );
    const quantos = FICHAS[i]!;
    const passo = larg / (quantos + 1);
    for (let k = 1; k <= quantos; k += 1) {
      const tx = x + passo * k;
      c.push(
        `<path d="M${n(tx)} ${n(base - alt * 0.34)}V${n(base - alt * 0.1)}"`,
        ` stroke="${comAlfa(entrada ? t['signal']! : t['text-secondary']!, entrada ? 0.85 : 0.45)}" stroke-width="1.5"/>`,
      );
    }

    const corpo = 22;
    c.push(
      rotulo(nome, x + (larg - larguraRotulo(nome, corpo)) / 2, base - alt - 22, corpo,
        entrada ? t['signal']! : t['text-muted']!),
    );
  });

  // o degrau de entrada aponta para cima: a escada empurra
  const xs = x0 + larg / 2;
  c.push(
    `<path d="M${n(xs)} ${n(base + 40)}V${n(base + 96)}" stroke="${comAlfa(t['signal']!, 0.5)}" stroke-width="1.5"/>`,
    `<path d="M${n(xs - 14)} ${n(base + 54)}L${n(xs)} ${n(base + 40)}L${n(xs + 14)} ${n(base + 54)}"`,
    ` fill="none" stroke="${comAlfa(t['signal']!, 0.5)}" stroke-width="1.5"/>`,
  );
  c.push(cantoneiras(t, L, A, L * 0.02, L * 0.016, 0.8));
  return documento({ largura: L, altura: A, corpo: c, defs: [], titulo: 'FARO — banner da escada, Caçada em destaque' });
}

// ─── CAPA DA CAÇADA — o produto de entrada tem capa própria ─────────────────

export function capaCacada(t: Tokens): string {
  const L = 1600;
  const A = 900;
  const c: string[] = [`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`];
  c.push(pauta(t, L, A, 32, 0.75));
  c.push(registro(t, L, A, 32, 220, 4301, 0.65));
  c.push(ecoDistante(t, L, A, 0.7));
  c.push(
    faixas(t, {
      x: L * 0.3, y: A * 0.16, largura: L * 0.56, altura: A * 0.62,
      semente: 4302, rotulos: { corpo: 17, recuo: 22 }, eixo: 0.55,
    }),
  );
  const corpo = 26;
  c.push(rotulo('A CAÇADA', L * 0.08, A * 0.92, corpo, t['signal']!));
  c.push(cantoneiras(t, L, A, L * 0.025, L * 0.02, 0.9));
  return documento({ largura: L, altura: A, corpo: c, defs: [QUADRO(L, A)], titulo: 'FARO — capa da Caçada' });
}

// ─── OG IMAGE — o cartão que viaja quando o link é compartilhado ────────────

export function og(t: Tokens): string {
  const L = 1200;
  const A = 630;
  const c: string[] = [`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`];
  c.push(pauta(t, L, A, 28, 0.8));
  c.push(registro(t, L, A, 28, 120, 4401, 0.6));
  c.push(
    faixas(t, {
      x: L * 0.56, y: A * 0.16, largura: L * 0.36, altura: A * 0.68,
      semente: 4402, forca: 0.9, eixo: 0.6, rotulos: { corpo: 11, recuo: 14 },
    }),
  );
  const m = L * 0.065;
  c.push(marca(t, m, A * 0.42, 62));
  c.push(frase(FRASE_HERO, m, A * 0.56, 25, t['text']!));
  c.push(rotulo('INTELIGÊNCIA CONTÍNUA DE OPORTUNIDADES', m, A * 0.68, 13, t['text-muted']!));
  c.push(cantoneiras(t, L, A, L * 0.028, L * 0.022, 0.9));
  return documento({ largura: L, altura: A, corpo: c, defs: [], titulo: 'FARO — cartão de compartilhamento' });
}

// ─── FAVICON — geométrico, nunca mascote ────────────────────────────────────
// Três réguas e o fio jade descendo: a Lei das Camadas no menor tamanho em que
// ela ainda se lê. Cinco faixas viram borrão a 16 px; três sobrevivem.

export function favicon(t: Tokens): string {
  const S = 512;
  const c: string[] = [
    `<rect width="${S}" height="${S}" rx="72" fill="${t['bg']}"/>`,
    `<rect x="8" y="8" width="${S - 16}" height="${S - 16}" rx="66" fill="none" stroke="${comAlfa(t['border-strong']!, 0.9)}" stroke-width="10"/>`,
  ];
  const xs = [148, 256, 364];
  for (const y of xs) {
    c.push(`<path d="M104 ${y}H408" stroke="${comAlfa(t['text-secondary']!, 0.55)}" stroke-width="18" stroke-linecap="square"/>`);
  }
  c.push(
    `<path d="M300 96V416" stroke="${t['bg']}" stroke-width="60" stroke-linecap="butt"/>`,
    `<path d="M300 96V400" stroke="${t['signal']}" stroke-width="24" stroke-linecap="square"/>`,
    `<circle cx="300" cy="416" r="30" fill="${t['signal']}"/>`,
  );
  return documento({ largura: S, altura: S, corpo: c, defs: [], titulo: 'FARO — ícone' });
}

// ─── TEMPLATES SOCIAIS — arsenal do reveal, guardado ────────────────────────
// Área de texto viva: o retângulo `#area-de-texto` marca onde a frase entra.
// Guardados em brand/reveal/ e NÃO publicados — stealth segue.

function social(t: Tokens, L: number, A: number, semente: number, vertical: boolean): string {
  const c: string[] = [`<rect width="${L}" height="${A}" fill="${t['bg']}"/>`];
  c.push(pauta(t, L, A, 30, 0.8));
  c.push(registro(t, L, A, 30, vertical ? 260 : 160, semente, 0.6));
  c.push(ecoDistante(t, L, A, 0.6));
  c.push(
    faixas(t, {
      x: L * 0.12, y: A * (vertical ? 0.16 : 0.14), largura: L * 0.76,
      altura: A * (vertical ? 0.34 : 0.44), semente: semente + 1, forca: 0.95, eixo: 0.6,
    }),
  );

  const m = L * 0.1;
  const baseMarca = A * (vertical ? 0.66 : 0.72);
  c.push(marca(t, m, baseMarca, L * 0.085));
  c.push(frase(FRASE_SINAL, m, baseMarca + L * 0.075, L * 0.048, t['text']!));

  // a área que o próximo designer preenche — some no PNG, fica no SVG
  const areaY = baseMarca + L * 0.1;
  c.push(
    `<rect id="area-de-texto" x="${n(m)}" y="${n(areaY)}" width="${n(L - m * 2)}"`,
    ` height="${n(A * (vertical ? 0.14 : 0.1))}" fill="none"`,
    ` stroke="${comAlfa(t['border-strong']!, 0.5)}" stroke-width="1" stroke-dasharray="8 8"/>`,
  );
  c.push(rotulo('AREA DE TEXTO VIVA', m + 10, areaY + 26, 13, t['text-muted']!));
  c.push(rotulo('INTELIGÊNCIA CONTÍNUA DE OPORTUNIDADES', m, A - m * 0.6, L * 0.014, t['text-muted']!));
  c.push(cantoneiras(t, L, A, L * 0.045, L * 0.035, 0.9));
  return documento({ largura: L, altura: A, corpo: c, defs: [QUADRO(L, A)], titulo: 'FARO — template social (reveal)' });
}

export const socialQuadrado = (t: Tokens): string => social(t, 1080, 1080, 4501, false);
export const socialVertical = (t: Tokens): string => social(t, 1080, 1920, 4503, true);
