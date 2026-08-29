// Borda elétrica do card do Raio-X, portada do componente ElectricBorder original.
// Desenha o contorno do card num canvas, deslocado por ruído, quadro a quadro.
// Ao passar o ponteiro sobre o botão de agendamento, a borda acelera e fica mais
// agitada, e a sombra do card ganha o brilho periwinkle.
// Com movimento reduzido a borda é desenhada uma vez e fica parada.
(function () {
  'use strict';

  var container = document.querySelector('.electric-border');
  if (!container) return;
  var canvas = container.querySelector('.eb-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var card = container.querySelector('.eb-content > div');
  var gatilho = document.querySelector('[data-hp-goal]');

  var COR = '#8E9FEE';
  var RAIO = 20;
  var CALMO = { velocidade: 0.85, caos: 0.14 };
  var AGITADO = { velocidade: 2.1, caos: 0.34 };
  var SOMBRA_CALMA = 'var(--shadow-floating)';
  var SOMBRA_ACESA = '0 0 0 1px rgba(142,159,238,0.5), 0 0 36px rgba(142,159,238,0.55), 0 34px 80px -34px rgba(142,159,238,0.6), var(--shadow-floating)';

  var atual = CALMO;
  var tempo = 0;
  var ultimoQuadro = 0;

  var movimentoReduzido = false;
  try { movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // No celular a borda é uma hairline parada, desenhada pelo responsivo.css, e o
  // canvas fica escondido. Sem esta trava o aparelho continuaria fazendo 30 mil
  // contas de ruído por quadro para desenhar algo que ninguém vê. O limite de
  // 700px é o mesmo do CSS: se mudar lá, muda aqui.
  var celular = null;
  try { celular = window.matchMedia('(max-width: 700px)'); } catch (e) {}
  function noCelular() { return !!(celular && celular.matches); }

  // ---------- Ruído (mesma matemática do original) ----------
  function aleatorio(x) { return (Math.sin(x * 12.9898) * 43758.5453) % 1; }

  function ruido2D(x, y) {
    var i = Math.floor(x), j = Math.floor(y);
    var fx = x - i, fy = y - j;
    var a = aleatorio(i + j * 57);
    var b = aleatorio(i + 1 + j * 57);
    var c = aleatorio(i + (j + 1) * 57);
    var d = aleatorio(i + 1 + (j + 1) * 57);
    var ux = fx * fx * (3.0 - 2.0 * fx);
    var uy = fy * fy * (3.0 - 2.0 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }

  function ruidoEmOitavas(x, oitavas, lacunaridade, ganho, amplitudeBase, frequenciaBase, t, semente, achatamento) {
    var y = 0, amplitude = amplitudeBase, frequencia = frequenciaBase;
    for (var i = 0; i < oitavas; i++) {
      var amp = amplitude;
      if (i === 0) amp *= achatamento;
      y += amp * ruido2D(frequencia * x + semente * 100, t * frequencia * 0.3);
      frequencia *= lacunaridade;
      amplitude *= ganho;
    }
    return y;
  }

  // ---------- Geometria do retângulo arredondado ----------
  function pontoDaQuina(cx, cy, raio, anguloInicial, arco, progresso) {
    var ang = anguloInicial + progresso * arco;
    return { x: cx + raio * Math.cos(ang), y: cy + raio * Math.sin(ang) };
  }

  function pontoDoContorno(t, esq, topo, largura, altura, raio) {
    var retaH = largura - 2 * raio;
    var retaV = altura - 2 * raio;
    var arco = (Math.PI * raio) / 2;
    var perimetro = 2 * retaH + 2 * retaV + 4 * arco;
    var d = t * perimetro;
    var acc = 0;
    if (d <= acc + retaH) return { x: esq + raio + ((d - acc) / retaH) * retaH, y: topo };
    acc += retaH;
    if (d <= acc + arco) return pontoDaQuina(esq + largura - raio, topo + raio, raio, -Math.PI / 2, Math.PI / 2, (d - acc) / arco);
    acc += arco;
    if (d <= acc + retaV) return { x: esq + largura, y: topo + raio + ((d - acc) / retaV) * retaV };
    acc += retaV;
    if (d <= acc + arco) return pontoDaQuina(esq + largura - raio, topo + altura - raio, raio, 0, Math.PI / 2, (d - acc) / arco);
    acc += arco;
    if (d <= acc + retaH) return { x: esq + largura - raio - ((d - acc) / retaH) * retaH, y: topo + altura };
    acc += retaH;
    if (d <= acc + arco) return pontoDaQuina(esq + raio, topo + altura - raio, raio, Math.PI / 2, Math.PI / 2, (d - acc) / arco);
    acc += arco;
    if (d <= acc + retaV) return { x: esq, y: topo + altura - raio - ((d - acc) / retaV) * retaV };
    acc += retaV;
    return pontoDaQuina(esq + raio, topo + raio, raio, Math.PI, Math.PI / 2, (d - acc) / arco);
  }

  // ---------- Desenho ----------
  var OITAVAS = 10, LACUNARIDADE = 1.6, GANHO = 0.7, FREQUENCIA = 10, ACHATAMENTO = 0;
  var DESLOCAMENTO = 60, MARGEM = 60;
  var largura = 0, altura = 0, dprAnterior = 0;

  function ajustarTamanho() {
    var r = container.getBoundingClientRect();
    largura = r.width + MARGEM * 2;
    altura = r.height + MARGEM * 2;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprAnterior = dpr;
    canvas.width = largura * dpr;
    canvas.height = altura * dpr;
    canvas.style.width = largura + 'px';
    canvas.style.height = altura + 'px';
    ctx.scale(dpr, dpr);
  }

  // ---------- Só desenha o que está na tela ----------
  // Sem isto o contorno era recalculado 60 vezes por segundo desde o
  // carregamento, mesmo com o card três telas abaixo. Como cada quadro faz
  // cerca de 30 mil contas de ruído, era processador gasto para desenhar o
  // que ninguém estava vendo.
  var naTela = false;   // está animando agora
  var visivel = false;  // o card está dentro da área visível
  var quadro = null;

  function ligar() {
    if (naTela || movimentoReduzido || noCelular()) return;
    naTela = true;
    ultimoQuadro = performance.now(); // evita um salto grande no primeiro quadro
    quadro = requestAnimationFrame(desenhar);
  }

  function desligar() {
    naTela = false;
    if (quadro) { cancelAnimationFrame(quadro); quadro = null; }
  }

  function desenhar(agora) {
    quadro = null;
    if (!naTela && !movimentoReduzido) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (dpr !== dprAnterior) ajustarTamanho();

    var dt = (agora - ultimoQuadro) / 1000;
    ultimoQuadro = agora;
    tempo += dt * atual.velocidade;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = COR;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    var larguraBorda = largura - 2 * MARGEM;
    var alturaBorda = altura - 2 * MARGEM;
    var raio = Math.min(RAIO, Math.min(larguraBorda, alturaBorda) / 2);
    var perimetro = 2 * (larguraBorda + alturaBorda) + 2 * Math.PI * raio;
    var amostras = Math.floor(perimetro / 2);

    ctx.beginPath();
    for (var i = 0; i <= amostras; i++) {
      var progresso = i / amostras;
      var p = pontoDoContorno(progresso, MARGEM, MARGEM, larguraBorda, alturaBorda, raio);
      var rx = ruidoEmOitavas(progresso * 8, OITAVAS, LACUNARIDADE, GANHO, atual.caos, FREQUENCIA, tempo, 0, ACHATAMENTO);
      var ry = ruidoEmOitavas(progresso * 8, OITAVAS, LACUNARIDADE, GANHO, atual.caos, FREQUENCIA, tempo, 1, ACHATAMENTO);
      var x = p.x + rx * DESLOCAMENTO;
      var y = p.y + ry * DESLOCAMENTO;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    if (naTela && !movimentoReduzido) quadro = requestAnimationFrame(desenhar);
  }

  // ---------- Hover no botão de agendamento ----------
  if (gatilho) {
    gatilho.addEventListener('mouseenter', function () {
      atual = AGITADO;
      if (card) card.style.boxShadow = SOMBRA_ACESA;
    });
    gatilho.addEventListener('mouseleave', function () {
      atual = CALMO;
      if (card) card.style.boxShadow = SOMBRA_CALMA;
    });
  }

  ajustarTamanho();
  if (window.ResizeObserver) new ResizeObserver(ajustarTamanho).observe(container);
  ultimoQuadro = performance.now();

  // Girar o aparelho ou redimensionar a janela cruza os 700px: a animação
  // acompanha a troca de borda que o CSS acabou de fazer. O observador de tela
  // continua sendo criado em qualquer largura, senão uma janela que começa
  // estreita e depois alarga ficaria sem ninguém para ligar a animação.
  if (celular && celular.addEventListener) {
    celular.addEventListener('change', function () {
      if (celular.matches) desligar();
      else if (movimentoReduzido) requestAnimationFrame(desenhar);
      else if (visivel) ligar();
    });
  }

  if (movimentoReduzido) {
    // movimento reduzido: um quadro só, parado, como já era
    if (!noCelular()) requestAnimationFrame(desenhar);
  } else if (window.IntersectionObserver) {
    // ligar() ignora o pedido enquanto a tela for de celular
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { visivel = e.isIntersecting; if (visivel) ligar(); else desligar(); });
    }, { rootMargin: '200px' }).observe(container);
  } else {
    ligar(); // navegador sem observador: mantém o comportamento antigo
  }
})();
