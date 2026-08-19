// GERADOR DA RODADA 1 — ORDEM VISUAL · O ABISSAL (19/08/2026)
//
// Uso:  node --experimental-strip-types apps/maquete/scripts/brand/gerar-rodada-1.ts
//
// 🔴 Este gerador NÃO chama API nenhuma. Ele não lê chave, não abre rede, não
// tem para onde vazar segredo. A ordem previa Ideogram/fal.ai por variável de
// ambiente; elas não existem nesta sessão, e a mesma ordem autoriza
// "teus recursos próprios (SVG, CSS, tipografia)". É por aqui que a Rodada 1 sai.

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { abissal, DIMENSOES, documental, type Formato, sonar } from './direcoes.ts';
import { lerTokens, RAIZ_MAQUETE } from './tokens.ts';

const DESTINO = resolve(RAIZ_MAQUETE, 'public', 'brand', 'rodada-1');

const DIRECOES = [
  { letra: 'a', nome: 'abissal', desenha: abissal },
  { letra: 'b', nome: 'sonar', desenha: sonar },
  { letra: 'c', nome: 'documental', desenha: documental },
] as const;

const FORMATOS: readonly Formato[] = ['hero', 'social', 'fundo'];

const tokens = lerTokens();
const paleta = new Set(Object.values(tokens).map((h) => h.toLowerCase()));

mkdirSync(DESTINO, { recursive: true });

type Certidao = {
  arquivo: string;
  direcao: string;
  formato: Formato;
  largura: number;
  altura: number;
  bytes: number;
};

const certidoes: Certidao[] = [];

for (const d of DIRECOES) {
  for (const f of FORMATOS) {
    const svg = d.desenha(tokens, f);

    // 🔴 GUARDA DA PALETA: nenhum hex fora do SSOT pode ter entrado no desenho.
    for (const hex of svg.match(/#[0-9a-fA-F]{3,8}/g) ?? []) {
      if (!paleta.has(hex.toLowerCase())) {
        throw new Error(
          `hex ${hex} em ${d.nome}/${f} não existe no SSOT. ` +
            `A arte não inventa cor — ou o token entra em globals.css, ou o desenho muda.`,
        );
      }
    }

    const [largura, altura] = DIMENSOES[f];
    const arquivo = `${d.letra}-${d.nome}-${f}-${largura}x${altura}.svg`;
    const bytes = Buffer.byteLength(svg, 'utf8');
    writeFileSync(resolve(DESTINO, arquivo), svg, 'utf8');
    certidoes.push({ arquivo, direcao: `${d.letra.toUpperCase()} — ${d.nome}`, formato: f, largura, altura, bytes });
    process.stdout.write(`${arquivo}  ${(bytes / 1024).toFixed(1)} KB\n`);
  }
}

writeFileSync(
  resolve(DESTINO, 'manifesto.json'),
  `${JSON.stringify({ rodada: 1, gerador: 'apps/maquete/scripts/brand/gerar-rodada-1.ts', assets: certidoes }, null, 2)}\n`,
  'utf8',
);

const total = certidoes.reduce((s, c) => s + c.bytes, 0);
process.stdout.write(`\n${certidoes.length} rascunhos · ${(total / 1024).toFixed(1)} KB no total\n`);
