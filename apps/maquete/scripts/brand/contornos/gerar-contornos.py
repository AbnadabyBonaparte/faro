#!/usr/bin/env python3
"""Converte texto em CONTORNO (path SVG) — ORDEM VISUAL Rodada 2, §3.

Por que existe: arte final não pode depender da fonte instalada na máquina de
quem abre o arquivo. Na Rodada 1 o texto era `<text>`, e o desenho mudava de
forma conforme o computador. Aqui o texto vira geometria: idêntico em todo
lugar, para sempre.

Roda uma vez e cospe `contornos.ts`, que entra versionado. O gerador de arte em
TypeScript continua sem dependência de npm — ele só importa a constante.

Uso:  python3 apps/maquete/scripts/brand/contornos/gerar-contornos.py
"""

from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

FONTES = Path("/usr/share/fonts/truetype/liberation")
SANS = FONTES / "LiberationSans-Bold.ttf"
MONO = FONTES / "LiberationMono-Regular.ttf"

# corpo 100 em todos: o desenho escala depois, e assim o número fica redondo
CORPO = 100.0


def contornar(caminho_fonte: Path, texto: str, tracking: float) -> tuple[str, float]:
    """Devolve (path, largura total) com o texto em corpo 100, baseline em y=0."""
    fonte = TTFont(caminho_fonte)
    upem = fonte["head"].unitsPerEm
    escala = CORPO / upem
    conjunto = fonte.getGlyphSet()
    cmap = fonte.getBestCmap()
    hmtx = fonte["hmtx"]

    partes: list[str] = []
    x = 0.0
    for ch in texto:
        nome = cmap.get(ord(ch))
        if nome is None:
            raise SystemExit(f"glifo ausente para {ch!r} em {caminho_fonte.name}")
        caneta = SVGPathPen(conjunto, ntos=lambda v: f"{v:.1f}")
        # y invertido: fonte é y-para-cima, SVG é y-para-baixo
        conjunto[nome].draw(TransformPen(caneta, (escala, 0, 0, -escala, x, 0)))
        d = caneta.getCommands()
        if d:
            partes.append(d)
        x += hmtx[nome][0] * escala + tracking

    return "".join(partes), x - tracking


# Atlas monoespaçado: em vez de pré-compor cada rótulo, exportamos o alfabeto.
# Mono tem avanço fixo, então o lado TypeScript compõe qualquer rótulo somando
# largura — sem precisar voltar aqui a cada palavra nova.
ATLAS = " ABCDEFGHIJKLMNOPQRSTUVWXYZÁÂÃÀÇÉÊÍÓÔÕÚ·—™.,()/"


def atlas_mono() -> tuple[dict[str, str], float]:
    fonte = TTFont(MONO)
    upem = fonte["head"].unitsPerEm
    escala = CORPO / upem
    conjunto = fonte.getGlyphSet()
    cmap = fonte.getBestCmap()
    avancos = set()
    glifos: dict[str, str] = {}
    for ch in ATLAS:
        nome = cmap.get(ord(ch))
        if nome is None:
            raise SystemExit(f"glifo ausente para {ch!r} no atlas mono")
        caneta = SVGPathPen(conjunto, ntos=lambda v: f"{v:.1f}")
        conjunto[nome].draw(TransformPen(caneta, (escala, 0, 0, -escala, 0, 0)))
        # espaço tem contorno vazio, e mesmo assim entra: o atlas é o contrato.
        # Sem isso o lado TypeScript não distingue "sem desenho" de "fora do atlas".
        glifos[ch] = caneta.getCommands()
        avancos.add(round(fonte["hmtx"][nome][0] * escala, 3))
    if len(avancos) != 1:
        raise SystemExit(f"fonte mono com avanços diferentes: {sorted(avancos)}")
    return glifos, avancos.pop()


PECAS = [
    ("MARCA", SANS, "FARO", 14.0),
    ("SELO", MONO, "FARO™ — INTELIGÊNCIA CONTÍNUA DE OPORTUNIDADES", 12.0),
    ("FRASE_HERO", SANS, "Não procure clientes. Ensine o FARO a encontrá-los.", 0.0),
    ("FRASE_SINAL", SANS, "O sinal está vivo.", 0.0),
    ("FRASE_PONTARIA", SANS, "Não vendemos volume. Vendemos pontaria.", 0.0),
    ("FRASE_MUDANCA", SANS, "Encontrei uma mudança.", 0.0),
]

linhas = [
    "// GERADO — não editar à mão.",
    "// Origem: apps/maquete/scripts/brand/contornos/gerar-contornos.py",
    "// Texto em CONTORNO (ORDEM VISUAL Rodada 2, §3): arte final não depende de",
    "// fonte instalada. Corpo 100, baseline em y=0, começo em x=0.",
    "",
    "export type Contorno = { readonly d: string; readonly largura: number };",
    "",
]
for nome, fonte, texto, tracking in PECAS:
    d, largura = contornar(fonte, texto, tracking)
    linhas.append(f"/** {texto!r} · {fonte.name} · tracking {tracking} */")
    linhas.append(
        f"export const {nome}: Contorno = {{ d: '{d}', largura: {largura:.1f} }};"
    )
    linhas.append("")

glifos, avanco = atlas_mono()
linhas.append("/** Alfabeto monoespaçado em contorno. Corpo 100, avanço fixo. */")
linhas.append(f"export const AVANCO_MONO = {avanco};")
linhas.append("export const ATLAS_MONO: Readonly<Record<string, string>> = {")
for ch, d in glifos.items():
    chave = "' '" if ch == " " else f"'{ch}'"
    linhas.append(f"  {chave}: '{d}',")
linhas.append("};")
linhas.append("")

destino = Path(__file__).resolve().parent.parent / "contornos.ts"
destino.write_text("\n".join(linhas), encoding="utf-8")
print(f"{destino} · {destino.stat().st_size / 1024:.1f} KB")
