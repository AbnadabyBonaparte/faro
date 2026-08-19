// GERADOR DA RODADA 2 — ORDEM VISUAL · direção C selada.
//
// Uso:  npm run brand:rodada-2   (de apps/maquete)
//
// 🔴 Não abre rede, não lê chave. Martelo do dono 19/08: "vetor agora, API
// depois" — a Rodada 2 sai inteira em vetor e não fica bloqueada esperando
// credencial. Arte generativa fica para uma Rodada 3 pontual, só no reveal.

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  bannerPrecos, capaCacada, favicon, fundoPagina, heroHome, heroHomeMobile,
  og, socialQuadrado, socialVertical,
} from './pecas.ts';
import { lerTokens, RAIZ_MAQUETE } from './tokens.ts';

const tokens = lerTokens();
const paleta = new Set(Object.values(tokens).map((h) => h.toLowerCase()));

const BASE = resolve(RAIZ_MAQUETE, 'public', 'brand', 'rodada-2');
const REVEAL = resolve(RAIZ_MAQUETE, 'public', 'brand', 'reveal');
mkdirSync(BASE, { recursive: true });
mkdirSync(REVEAL, { recursive: true });

const PAGINAS = [
  ['teses', 4601], ['fila', 4602], ['watch', 4603], ['painel', 4604], ['fontes', 4605],
] as const;

const PECAS: Array<readonly [string, string, string]> = [
  [BASE, 'hero-home-2400x1000.svg', heroHome(tokens)],
  [BASE, 'hero-home-mobile-820x760.svg', heroHomeMobile(tokens)],
  [BASE, 'banner-precos-2400x760.svg', bannerPrecos(tokens)],
  [BASE, 'capa-cacada-1600x900.svg', capaCacada(tokens)],
  [BASE, 'og-1200x630.svg', og(tokens)],
  [BASE, 'icone-512.svg', favicon(tokens)],
  [REVEAL, 'social-1080x1080.svg', socialQuadrado(tokens)],
  [REVEAL, 'social-1080x1920.svg', socialVertical(tokens)],
  ...PAGINAS.map(([nome, semente]) =>
    [BASE, `fundo-${nome}-1920x360.svg`, fundoPagina(tokens, semente)] as const),
];

type Certidao = { pasta: string; arquivo: string; bytes: number };
const certidoes: Certidao[] = [];

for (const [pasta, arquivo, svg] of PECAS) {
  // 🔴 GUARDA DA PALETA: nenhum hex fora do SSOT sai daqui.
  for (const hex of svg.match(/#[0-9a-fA-F]{3,8}/g) ?? []) {
    if (!paleta.has(hex.toLowerCase())) {
      throw new Error(
        `hex ${hex} em ${arquivo} não existe no SSOT. ` +
          `A arte não inventa cor — ou o token entra em globals.css, ou o desenho muda.`,
      );
    }
  }
  // 🔴 GUARDA DO CONTORNO: arte final não pode depender de fonte instalada.
  if (svg.includes('<text')) {
    throw new Error(`${arquivo} tem <text> — ORDEM VISUAL R2 §3 manda contorno (path).`);
  }
  const bytes = Buffer.byteLength(svg, 'utf8');
  writeFileSync(resolve(pasta, arquivo), svg, 'utf8');
  certidoes.push({ pasta: pasta === REVEAL ? 'brand/reveal' : 'brand/rodada-2', arquivo, bytes });
  process.stdout.write(`${arquivo.padEnd(34)} ${(bytes / 1024).toFixed(1).padStart(7)} KB\n`);
}

writeFileSync(
  resolve(BASE, 'manifesto.json'),
  `${JSON.stringify({ rodada: 2, direcao: 'C — documental', gerador: 'apps/maquete/scripts/brand/gerar-rodada-2.ts', assets: certidoes }, null, 2)}\n`,
  'utf8',
);
process.stdout.write(`\n${certidoes.length} peças · ${(certidoes.reduce((s, c) => s + c.bytes, 0) / 1024).toFixed(1)} KB\n`);
