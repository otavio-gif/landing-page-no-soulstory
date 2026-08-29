// Brilhos que seguem o cursor, portados dos componentes BorderGlow e RaioButton.
//
// São três coisas:
//   1. Todo card com brilho de borda acende conforme o cursor se aproxima da
//      borda, e a luz gira acompanhando o ângulo do cursor.
//   2. Os botões dourados "Agendar um Raio-X Gratuito" se inclinam em 3D e
//      projetam uma sombra dourada para o lado onde o cursor está.
//   3. A plaquinha do NÓ (abaixo de "o caminho mais rápido... são as histórias")
//      faz o mesmo, em lavanda.
//
// Nada disso roda com movimento reduzido nem em telas sem ponteiro de verdade.
(function () {
  'use strict';

  var temPonteiro = true;
  try { temPonteiro = window.matchMedia('(hover: hover)').matches; } catch (e) {}
  var movimentoReduzido = false;
  try { movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (!temPonteiro) return;

  // ---------- Matemática do brilho (igual à do BorderGlow) ----------
  // Quanto o cursor está perto da borda: 0 no centro, 1 na borda.
  function proximidadeDaBorda(el, x, y) {
    var r = el.getBoundingClientRect();
    var cx = r.width / 2, cy = r.height / 2;
    var dx = x - cx, dy = y - cy;
    var kx = Infinity, ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  function anguloDoCursor(el, x, y) {
    var r = el.getBoundingClientRect();
    var dx = x - r.width / 2, dy = y - r.height / 2;
    if (dx === 0 && dy === 0) return 0;
    var g = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    return g < 0 ? g + 360 : g;
  }

  function acender(card, e) {
    var r = card.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty('--edge-proximity', (proximidadeDaBorda(card, x, y) * 100).toFixed(3));
    card.style.setProperty('--cursor-angle', anguloDoCursor(card, x, y).toFixed(3) + 'deg');
  }

  function apagar(card) {
    card.style.setProperty('--edge-proximity', '0');
  }

  // ---------- 1. Todos os cards com brilho de borda ----------
  Array.prototype.forEach.call(document.querySelectorAll('.border-glow-card'), function (card) {
    card.addEventListener('pointermove', function (e) { acender(card, e); }, { passive: true });
    card.addEventListener('pointerleave', function () { apagar(card); }, { passive: true });
  });

  // Recalcula as sete variáveis de cor do brilho para uma nova intensidade,
  // do mesmo jeito que o componente original fazia.
  function aplicarIntensidade(card, corHsl, intensidade) {
    var opacidades = [100, 60, 50, 40, 30, 20, 10];
    var sufixos = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
    for (var i = 0; i < opacidades.length; i++) {
      var pct = Math.min(opacidades[i] * intensidade, 100);
      card.style.setProperty('--glow-color' + sufixos[i], 'hsl(' + corHsl + ' / ' + pct + '%)');
    }
  }

  // ---------- Inclinação 3D que segue o cursor ----------
  // Recebe as medidas de cada peça, porque o botão e a plaquinha usam valores
  // um pouco diferentes (a plaquinha inclina e desloca um pouco mais).
  function ligarInclinacao(alvo, cfg) {
    var card = alvo.querySelector('.border-glow-card');

    function aoEntrar() {
      if (card) {
        aplicarIntensidade(card, cfg.corHsl, cfg.intensidadeQuente);
        card.style.setProperty('--glow-padding', cfg.raioQuente + 'px');
        card.style.setProperty('--cone-spread', String(cfg.coneQuente));
      }
      if (cfg.sombraQuente) alvo.style.boxShadow = cfg.sombraQuente;
    }

    function aoMover(e) {
      if (movimentoReduzido) return;
      var r = alvo.getBoundingClientRect();
      var x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
      var y = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
      var dx = x - 0.5, dy = y - 0.5;
      alvo.style.transform = 'perspective(' + cfg.perspectiva + 'px) translateY(' + cfg.subida + 'px) scale(' + cfg.escala + ')'
        + ' rotateX(' + (-dy * cfg.giroX).toFixed(2) + 'deg)'
        + ' rotateY(' + (dx * cfg.giroY).toFixed(2) + 'deg)';
      // a luz se acumula do lado em que o cursor está
      var ox = (dx * cfg.desloc1).toFixed(0), oy = (dy * cfg.desloc1).toFixed(0);
      alvo.style.boxShadow =
        '0 0 0 1px ' + cfg.corForte + ',' +
        ox + 'px ' + oy + 'px ' + cfg.borrao1 + 'px ' + cfg.corForte + ',' +
        (dx * cfg.desloc2).toFixed(0) + 'px ' + (dy * cfg.desloc2).toFixed(0) + 'px ' + cfg.borrao2 + 'px ' + cfg.corMedia + ',' +
        cfg.sombraBase;
    }

    function aoSair() {
      alvo.style.transform = '';
      alvo.style.boxShadow = '';
      if (card) {
        aplicarIntensidade(card, cfg.corHsl, cfg.intensidadeRepouso);
        card.style.setProperty('--glow-padding', cfg.raioRepouso + 'px');
        card.style.setProperty('--cone-spread', String(cfg.coneRepouso));
      }
    }

    alvo.addEventListener('mouseenter', aoEntrar);
    alvo.addEventListener('mousemove', aoMover);
    alvo.addEventListener('mouseleave', aoSair);
  }

  // ---------- 2. Botões dourados do Raio-X ----------
  Array.prototype.forEach.call(document.querySelectorAll('.sc-host[data-sc-name="RaioButton"] > a'), function (botao) {
    ligarInclinacao(botao, {
      corHsl: '44deg 82% 62%',
      intensidadeRepouso: 2.2, intensidadeQuente: 4.6,
      raioRepouso: 38, raioQuente: 66,
      coneRepouso: 46, coneQuente: 14,
      perspectiva: 680, subida: -4, escala: 1.03, giroX: 12, giroY: 14,
      corForte: 'rgba(233,190,88,0.95)', corMedia: 'rgba(233,190,88,0.55)',
      desloc1: 34, borrao1: 30, desloc2: 66, borrao2: 90,
      sombraBase: '0 20px 48px -20px rgba(74,59,12,0.5)'
    });
  });

  // ---------- 3. Plaquinha do NÓ ----------
  var simbolo = document.querySelector('img[src*="no-symbol-parchment"]');
  if (simbolo) {
    var cardPlaca = simbolo.closest('.border-glow-card');
    // a moldura que recebe a inclinação fica dois níveis acima do card de brilho
    var placa = cardPlaca && cardPlaca.parentElement ? cardPlaca.parentElement.parentElement : null;
    if (placa) {
      ligarInclinacao(placa, {
        corHsl: '229deg 74% 74%',
        intensidadeRepouso: 2.6, intensidadeQuente: 5.5,
        raioRepouso: 80, raioQuente: 150,
        coneRepouso: 46, coneQuente: 12,
        perspectiva: 820, subida: -6, escala: 1.025, giroX: 14, giroY: 16,
        corForte: 'rgba(142,159,238,0.9)', corMedia: 'rgba(142,159,238,0.6)',
        desloc1: 46, borrao1: 40, desloc2: 90, borrao2: 130,
        sombraBase: '0 26px 60px -22px rgba(61,57,110,0.55)',
        sombraQuente: '0 0 0 1px rgba(142,159,238,0.9), 0 0 60px rgba(142,159,238,0.8), 0 22px 60px -24px rgba(61,57,110,0.5)'
      });
    }
  }
})();
