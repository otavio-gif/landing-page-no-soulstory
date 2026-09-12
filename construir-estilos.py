#!/usr/bin/env python3
"""
Junta os CSS do site em dois arquivos, para o navegador fazer menos viagens.

Por quê: o design system vem partido em sete arquivos de cerca de 1KB. Cada um
custa uma ida e volta na rede. Numa conexão 4G lenta isso chegou a 520ms por
arquivo, e o relatório do PageSpeed apontou 1.850ms de renderização bloqueada.
Juntando, o custo cai para uma viagem só.

Gera:
  estilos-base.css     as fontes, os tokens e o estilo do design system
  estilos-ajustes.css  os nossos ajustes de estado e de responsividade

IMPORTANTE: estes dois arquivos são GERADOS. Se você mexer em algum CSS de
origem (dentro de _ds/, em estados.css ou em responsivo.css), rode este script
de novo:  python3 construir-estilos.py
"""
import os
import re

RAIZ = os.path.dirname(os.path.abspath(__file__))
DS = "_ds/soulstory-design-system-5ceab3da-bbf2-4d0c-b870-44e472cf3637"

# Ordem importa: quem vem depois vence em caso de empate.
BASE = [
    "vendor/fontes/jetbrains-mono.css",
    f"{DS}/tokens/fonts.css",
    f"{DS}/tokens/colors.css",
    f"{DS}/tokens/typography.css",
    f"{DS}/tokens/spacing.css",
    f"{DS}/tokens/motion.css",
    f"{DS}/tokens/base.css",
    f"{DS}/styles.css",
]
AJUSTES = ["estados.css", "responsivo.css"]


def ler(caminho):
    with open(os.path.join(RAIZ, caminho), encoding="utf-8") as f:
        return f.read()


def preparar(caminho, texto):
    """Tira os @import internos e conserta os caminhos relativos."""
    externos = []

    def guardar(m):
        alvo = m.group(1).strip("'\"")
        # import de arquivo local: o conteúdo já entra no pacote, então some
        if not alvo.startswith("http"):
            return ""
        externos.append(m.group(0))
        return ""

    texto = re.sub(r"@import\s+url\(([^)]+)\)\s*;", guardar, texto)

    # url() relativo passa a apontar a partir da raiz do site
    pasta = os.path.dirname(caminho)
    if pasta:
        def corrigir(m):
            alvo = m.group(1).strip("'\"")
            if alvo.startswith(("http", "data:", "/", "#")):
                return m.group(0)
            return f"url({pasta}/{alvo})"
        texto = re.sub(r"url\(([^)]+)\)", corrigir, texto)

    return externos, texto


def montar(arquivos, titulo):
    externos, partes = [], []
    for caminho in arquivos:
        ext, corpo = preparar(caminho, ler(caminho))
        externos.extend(ext)
        partes.append(f"/* ===== {caminho} ===== */\n{corpo.strip()}\n")

    cabecalho = (
        "/* =========================================================================\n"
        f"   {titulo}\n"
        "   ARQUIVO GERADO. Não edite aqui: mexa nos arquivos de origem e rode\n"
        "   python3 construir-estilos.py para refazer.\n"
        "   Origem:\n"
        + "".join(f"     {a}\n" for a in arquivos)
        + "   ========================================================================= */\n"
    )
    # Os @import externos (o kit da Adobe) NÃO entram mais no pacote. Por quê:
    # um @import dentro do CSS só é descoberto depois que o CSS inteiro chega,
    # o que enfileira a fonte atrás da folha de estilo e custa uma ida e volta
    # inteira no 4G antes do primeiro pixel. O kit agora é chamado por <link>
    # direto no <head> do index.html, antes de estilos-base.css, com preconnect.
    # Continua sendo o kit oficial da Adobe, só que descoberto pelo navegador no
    # primeiro byte do HTML em vez de no último byte do CSS.
    if externos:
        print("  (import externo deixado fora do pacote, vai no <head>: " + ", ".join(dict.fromkeys(externos)) + ")")
    return "\n".join(x for x in [cabecalho, "\n".join(partes)] if x)


for arquivos, saida, titulo in [
    (BASE, "estilos-base.css", "Soulstory · fontes, tokens e design system"),
    (AJUSTES, "estilos-ajustes.css", "Soulstory · ajustes de estado e responsividade"),
]:
    conteudo = montar(arquivos, titulo)
    destino = os.path.join(RAIZ, saida)
    with open(destino, "w", encoding="utf-8") as f:
        f.write(conteudo)
    origem = sum(os.path.getsize(os.path.join(RAIZ, a)) for a in arquivos)
    print(f"{saida}: {len(arquivos)} arquivos, {origem/1024:.1f}KB -> {os.path.getsize(destino)/1024:.1f}KB")
