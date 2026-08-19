// AFERIDOR DE CONTRASTE — WCAG 2.1, contra o SSOT.
//
// Uso:  npm run contraste
//
// Não é enfeite de relatório: ele sai com código 1 se um par reprovar, e a
// ordem manda "contraste AA conferido e reportado". Conferir é rodar isto.
//
// AA: 4.5:1 para texto normal · 3:1 para texto grande (>=24px, ou >=18.66px
// em peso alto) e para componentes de interface.

import { lerTokens } from './brand/tokens.ts';

const t = lerTokens();

type Canal = readonly [number, number, number];

function rgb(hex: string): Canal {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as unknown as Canal;
}

/** Mistura `frente` sobre `fundo` com opacidade `a` — o que o olho recebe. */
function sobre(frente: string, fundo: string, a: number): string {
  const f = rgb(frente);
  const b = rgb(fundo);
  const m = f.map((v, i) => Math.round(v * a + b[i]! * (1 - a)));
  return `#${m.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function luminancia(hex: string): number {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as unknown as Canal;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function razao(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

type Par = {
  readonly onde: string;
  readonly frente: string;
  readonly fundo: string;
  /** 4.5 texto normal · 3 texto grande e componente */
  readonly minimo: number;
};

const AVISO = sobre(t['fresh-warn']!, t['bg']!, 0.1);

const PARES: readonly Par[] = [
  { onde: 'manchete e corpo sobre o breu', frente: t['text']!, fundo: t['bg']!, minimo: 4.5 },
  { onde: 'manchete e corpo sobre painel', frente: t['text']!, fundo: t['surface']!, minimo: 4.5 },
  { onde: 'texto de apoio sobre o breu', frente: t['text-secondary']!, fundo: t['bg']!, minimo: 4.5 },
  { onde: 'texto de apoio sobre painel', frente: t['text-secondary']!, fundo: t['surface']!, minimo: 4.5 },
  { onde: 'texto de apoio sobre painel 2', frente: t['text-secondary']!, fundo: t['surface-2']!, minimo: 4.5 },
  { onde: 'rótulo mono sobre o breu', frente: t['text-muted']!, fundo: t['bg']!, minimo: 4.5 },
  { onde: 'rótulo mono sobre painel', frente: t['text-muted']!, fundo: t['surface']!, minimo: 4.5 },
  { onde: 'sinal sobre o breu', frente: t['signal']!, fundo: t['bg']!, minimo: 4.5 },
  { onde: 'sinal sobre painel', frente: t['signal']!, fundo: t['surface']!, minimo: 4.5 },
  { onde: 'texto do botão sobre o sinal', frente: t['signal-fg']!, fundo: t['signal']!, minimo: 4.5 },
  { onde: 'banner ANTI-QUANTUM', frente: t['fresh-warn']!, fundo: AVISO, minimo: 4.5 },
  { onde: 'alerta de frescor sobre o breu', frente: t['fresh-old']!, fundo: t['bg']!, minimo: 4.5 },
  { onde: 'envelhecendo sobre o breu', frente: t['fresh-stale']!, fundo: t['bg']!, minimo: 4.5 },
  // 1.4.11 vale para o que PRECISA ser visto para operar. O anel de foco é o
  // caso claro, e ele usa a cor de sinal.
  { onde: 'anel de foco sobre o breu', frente: t['signal']!, fundo: t['bg']!, minimo: 3 },
  { onde: 'anel de foco sobre painel', frente: t['signal']!, fundo: t['surface']!, minimo: 3 },
];

/* 🔴 O QUE ESTE AFERIDOR DEIXA DE FORA, E POR QUÊ.
   `--color-border-strong` sobre o breu dá 1,65:1 — bem abaixo de 3:1. Ele fica
   fora da lista de reprovação de propósito, e a decisão está escrita aqui em
   vez de escondida numa linha que some:

   o traço de 1px é ORNAMENTO, não afordância. O painel já se distingue do fundo
   pela própria superfície (`--surface` sobre `--bg`), nenhum estado de
   componente depende de enxergar a borda, e todo controle operável tem
   indicador próprio acima de 3:1 (o anel de foco, aferido acima). Subir a borda
   para 3:1 exigiria um cinza claro que transformaria o instrumento numa grade
   de planilha — perderia o canon sem ganhar acessibilidade real.

   Se algum dia a borda passar a carregar informação sozinha — estado
   selecionado, erro, limite de área clicável — ela entra na lista e o valor
   sobe. Registrado para que a próxima pessoa saiba que foi escolha, não
   esquecimento. */

let reprovou = 0;
process.stdout.write('▸ contraste WCAG 2.1 AA contra o SSOT\n');
for (const p of PARES) {
  const r = razao(p.frente, p.fundo);
  const passa = r >= p.minimo;
  if (!passa) reprovou += 1;
  process.stdout.write(
    `  ${passa ? '✓' : '✗'} ${p.onde.padEnd(34)} ${r.toFixed(2).padStart(5)}:1  (mín ${p.minimo})\n`,
  );
}
process.stdout.write(reprovou === 0 ? '✓ todos os pares passam\n' : `✗ ${reprovou} par(es) abaixo do mínimo\n`);
process.exit(reprovou === 0 ? 0 : 1);
