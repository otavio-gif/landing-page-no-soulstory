// Carrossel da história do otávio b.m., portado do componente StoryStack original.
// Pilha de cartas que se arrasta ou toca, com bolinhas de navegação, avanço
// automático a cada 6 segundos e o brilho de borda que segue o cursor.
// A cada troca dispara o evento 'soulstory:story-change', que a legenda escuta.
(function () {
  'use strict';

  var palco = document.querySelector('.sstk-stage');
  if (!palco) return;

  var cartas = Array.prototype.slice.call(palco.querySelectorAll('.sstk-card'));
  var bolinhas = Array.prototype.slice.call(document.querySelectorAll('.sstk-dot'));
  var dica = document.querySelector('.sstk-hint');
  if (cartas.length < 2) return;

  // Posição de cada carta na pilha, por profundidade (0 = topo).
  var PILHA = [
    { x: 0, y: 0, r: 0, s: 1 },
    { x: 34, y: 26, r: 5.5, s: 0.955 },
    { x: -30, y: 48, r: -4.8, s: 0.915 },
    { x: 26, y: 70, r: 4.2, s: 0.878 },
    { x: -22, y: 90, r: -3.4, s: 0.844 },
    { x: 18, y: 108, r: 2.6, s: 0.812 }
  ];

  var ordem = cartas.map(function (_, i) { return i; }); // ordem[0] é a carta do topo
  var arrasto = { ativo: false, moveu: false, x0: 0, y0: 0, pid: null, el: null };
  var automatico = null;
  var varreduraRaf = null;
  var movimentoReduzido = false;
  try { movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function gsapDisponivel() { return window.gsap; }

  // ---------- Disposição da pilha ----------
  function dispor(animar) {
    var g = gsapDisponivel();
    ordem.forEach(function (indice, posicao) {
      var el = cartas[indice];
      if (!el) return;
      el.classList.toggle('sstk-top', posicao === 0);
      var o = PILHA[Math.min(posicao, PILHA.length - 1)];
      var props = { x: o.x, y: o.y, scale: o.s, rotation: o.r, zIndex: 100 - posicao, transformOrigin: '50% 0%' };
      if (g) {
        if (animar && !movimentoReduzido) g.to(el, Object.assign({ duration: 0.62, ease: 'power3.out', overwrite: true }, props));
        else g.set(el, props);
      } else {
        el.style.transform = 'translate(' + o.x + 'px,' + o.y + 'px) scale(' + o.s + ') rotate(' + o.r + 'deg)';
        el.style.transformOrigin = '50% 0%';
        el.style.zIndex = 100 - posicao;
      }
    });
  }

  // ---------- Brilho que varre a borda quando a carta muda ----------
  function varrer(el) {
    if (!el || movimentoReduzido) return;
    if (varreduraRaf) cancelAnimationFrame(varreduraRaf);
    el.classList.add('sstk-sweep');
    var t0 = performance.now(), duracao = 1500, a0 = 84, a1 = 468;
    function encerrar() {
      el.classList.remove('sstk-sweep');
      el.style.setProperty('--edge-proximity', '0');
    }
    function passo(agora) {
      var t = Math.min((agora - t0) / duracao, 1);
      var e = 1 - Math.pow(1 - t, 3);
      el.style.setProperty('--cursor-angle', (a0 + (a1 - a0) * e) + 'deg');
      var prox = t < 0.42 ? (t / 0.42) : (1 - (t - 0.42) / 0.58);
      el.style.setProperty('--edge-proximity', (Math.max(prox, 0) * 100).toFixed(1));
      if (t < 1) varreduraRaf = requestAnimationFrame(passo);
      else { encerrar(); varreduraRaf = null; }
    }
    varreduraRaf = requestAnimationFrame(passo);
    setTimeout(encerrar, duracao + 260);
  }

  // ---------- Troca de carta ----------
  function anunciar(i) {
    try { window.dispatchEvent(new CustomEvent('soulstory:story-change', { detail: { index: i } })); } catch (e) {}
  }

  function marcarBolinhas(i) {
    bolinhas.forEach(function (b, idx) { b.classList.toggle('on', idx === i); });
  }

  function definirTopo(i) {
    marcarBolinhas(i);
    anunciar(i);
    varrer(cartas[i]);
  }

  function mandarParaTras() {
    if (ordem.length < 2) return;
    ordem = ordem.slice(1).concat(ordem[0]);
    definirTopo(ordem[0]);
    dispor(true);
  }

  function irPara(alvo) {
    var idx = ordem.indexOf(alvo);
    if (idx < 1) return;
    ordem = ordem.slice(idx).concat(ordem.slice(0, idx));
    definirTopo(alvo);
    dispor(true);
  }

  // ---------- Avanço automático ----------
  function pararAutomatico() { if (automatico) { clearInterval(automatico); automatico = null; } }
  function iniciarAutomatico() {
    if (movimentoReduzido) return;
    pararAutomatico();
    automatico = setInterval(mandarParaTras, 6000);
  }

  function esconderDica() { if (dica) dica.classList.add('gone'); }

  // ---------- Brilho seguindo o cursor ----------
  palco.addEventListener('pointermove', function (e) {
    var el = cartas[ordem[0]];
    if (!el || arrasto.ativo) return;
    if (el.classList.contains('sstk-sweep')) el.classList.remove('sstk-sweep');
    var r = el.getBoundingClientRect();
    var cx = r.width / 2, cy = r.height / 2;
    var dx = (e.clientX - r.left) - cx, dy = (e.clientY - r.top) - cy;
    var kx = Infinity, ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    var borda = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    var grau = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (grau < 0) grau += 360;
    el.style.setProperty('--edge-proximity', (borda * 100).toFixed(2));
    el.style.setProperty('--cursor-angle', grau.toFixed(2) + 'deg');
  }, { passive: true });

  // ---------- Arrastar e tocar ----------
  cartas.forEach(function (el, i) {
    el.addEventListener('pointerdown', function (e) {
      if (ordem[0] !== i) return; // só a carta do topo se arrasta
      arrasto = { ativo: true, moveu: false, x0: e.clientX, y0: e.clientY, pid: e.pointerId, el: el };
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      pararAutomatico();
      var g = gsapDisponivel();
      if (g) g.killTweensOf(el);
    });
  });

  window.addEventListener('pointermove', function (e) {
    if (!arrasto.ativo) return;
    var dx = e.clientX - arrasto.x0, dy = e.clientY - arrasto.y0;
    if (!arrasto.moveu && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) { arrasto.moveu = true; esconderDica(); }
    var rot = Math.max(-9, Math.min(9, dx * 0.045));
    var g = gsapDisponivel();
    if (g) g.set(arrasto.el, { x: dx, y: dy, rotation: rot });
    else arrasto.el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg)';
  }, { passive: true });

  window.addEventListener('pointerup', function (e) {
    if (!arrasto.ativo) return;
    arrasto.ativo = false;
    try { arrasto.el.releasePointerCapture(arrasto.pid); } catch (err) {}
    var dx = e.clientX - arrasto.x0, dy = e.clientY - arrasto.y0;
    // toque simples, ou arrasto longo o bastante, avançam a pilha
    if (!arrasto.moveu || Math.hypot(dx, dy) > 82) mandarParaTras();
    else dispor(true);
    iniciarAutomatico();
  });

  window.addEventListener('pointercancel', function () {
    if (!arrasto.ativo) return;
    arrasto.ativo = false;
    dispor(true);
    iniciarAutomatico();
  });

  // ---------- Bolinhas ----------
  bolinhas.forEach(function (b, i) {
    b.addEventListener('click', function () {
      pararAutomatico();
      esconderDica();
      irPara(i);
      iniciarAutomatico();
    });
  });

  // ---------- O automático pausa com o ponteiro sobre a pilha ----------
  palco.addEventListener('mouseenter', pararAutomatico);
  palco.addEventListener('mouseleave', iniciarAutomatico);

  // ---------- Legenda que acompanha a pilha ----------
  // Encontra o quadro de legenda pelo rótulo e liga no evento de troca.
  (function ligarLegenda() {
    var rotulo = null;
    var spans = document.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++) {
      if (spans[i].textContent.trim() === 'A história de otávio b.m.') { rotulo = spans[i]; break; }
    }
    if (!rotulo) return;
    var cabecalho = rotulo.parentElement;
    var capitulo = cabecalho.querySelector('.sc-interp');
    var corpo = cabecalho.nextElementSibling;
    var deslizante = corpo && corpo.firstElementChild;
    if (!capitulo || !deslizante) return;

    window.addEventListener('soulstory:story-change', function (e) {
      var idx = (e.detail && e.detail.index) || 0;
      capitulo.textContent = String(idx + 1).padStart(2, '0');
      deslizante.style.transform = 'translateX(-' + (idx * 100) + '%)';
    });
  })();

  // ---------- Início ----------
  function iniciar() {
    if (!gsapDisponivel()) { setTimeout(iniciar, 60); return; }
    cartas.forEach(function (el) { el.classList.remove('sstk-sweep'); });
    ordem = cartas.map(function (_, i) { return i; });
    dispor(false);
    marcarBolinhas(0);
    anunciar(0);
    setTimeout(function () { varrer(cartas[ordem[0]]); }, 480);
    iniciarAutomatico();
  }
  iniciar();
})();
