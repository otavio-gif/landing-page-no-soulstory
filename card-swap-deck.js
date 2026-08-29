// Deck de depoimentos (prova social), portado do componente CardSwap original.
// As cartas giram sozinhas a cada 4,6 segundos, pausam com o ponteiro em cima e
// respondem aos botões de anterior e próximo. O painel de texto ao lado acompanha.
(function () {
  'use strict';

  var container = document.querySelector('.card-swap-container');
  if (!container) return;

  var cartas = Array.prototype.slice.call(container.querySelectorAll('.ss-card'));
  if (cartas.length < 2) return;

  // Dados de cada cliente, na mesma ordem das cartas no HTML.
  var CLIENTES = [
    { name: 'Igor Gonçalves', followers: '747 mil seguidores', num: 'R$ 48,3 milhões faturados.', copy: 'Cinco lançamentos de sete dígitos, dois de oito, movidos por uma só narrativa: os Inconformados.' },
    { name: 'Camila Vieira', followers: '4,4 mi seguidores', num: 'Do zero a múltiplos 8 dígitos em 11 meses.', copy: 'Ela leu a própria copy e perguntou se não tinha sido ela quem escreveu.' },
    { name: 'Patrícia Domingos', followers: '40,9 mil seguidores', num: '198 mil euros em 9 meses, no tráfego orgânico.', copy: 'Tudo isso sem um euro em anúncio.' },
    { name: '49 educação', followers: '27,3 mil seguidores', num: 'R$ 1,2 milhão no primeiro ano de operação.', copy: 'Empresa no primeiro ano, seis pessoas no time, e o caixa já cruza os sete dígitos.' },
    { name: 'Spencer', followers: '2 mi seguidores', num: 'De 629 para 2.187 alunos em 8 meses.', copy: 'Oito meses, e a história começou a encher a escola de aluno novo.' },
    { name: 'Codirect', followers: '227 mil seguidores', num: 'Ticket de R$ 3.600 para R$ 19.800 em menos de 12 meses.', copy: 'Em dois anos, o mês de R$ 260 mil virou mês de R$ 770 mil.' }
  ];

  // Medidas e tempos do original.
  var DIST_X = 66, DIST_Y = 58, SKEW = 6, INTERVALO = 4600;
  var CONFIG = { ease: 'elastic.out(0.62,0.9)', durDrop: 1.15, durMove: 1.25, durReturn: 1.25, promoteOverlap: 0.72, returnDelay: 0.08 };

  var total = cartas.length;
  var ordem = cartas.map(function (_, i) { return i; }); // ordem[0] é a carta da frente
  var animando = false;
  var pendente = 0;
  var relogio = null;
  var movimentoReduzido = false;
  try { movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // ---------- Painel de texto ao lado ----------
  var botaoProximo = document.querySelector('[aria-label="Próximo card"]');
  var botaoAnterior = document.querySelector('[aria-label="Card anterior"]');
  var painel = null;
  if (botaoProximo) {
    var linhaBotoes = botaoProximo.parentElement;
    var blocoTexto = linhaBotoes.previousElementSibling;
    if (blocoTexto) {
      var textos = blocoTexto.querySelectorAll('.sc-interp');
      var contadores = linhaBotoes.querySelectorAll('.sc-interp');
      if (textos.length >= 3 && contadores.length >= 1) {
        painel = { num: textos[0], copy: textos[1], attr: textos[2], indice: contadores[0] };
      }
    }
  }

  function atualizarPainel(i) {
    if (!painel) return;
    var c = CLIENTES[i] || {};
    painel.num.textContent = c.num || '';
    painel.copy.textContent = c.copy || '';
    painel.attr.textContent = (c.name || '') + (c.followers ? ' · ' + c.followers : '');
    painel.indice.textContent = String(i + 1).padStart(2, '0');
  }

  function anunciar(i) {
    var idx = (i == null) ? ordem[0] : i;
    atualizarPainel(idx);
    var c = CLIENTES[idx] || {};
    try {
      window.dispatchEvent(new CustomEvent('soulstory:deck-change', {
        detail: { index: idx, name: c.name, followers: c.followers, num: c.num, copy: c.copy }
      }));
    } catch (e) {}
  }

  // ---------- Posições da pilha ----------
  function vaga(i) {
    return { x: i * DIST_X, y: -i * DIST_Y, z: -i * DIST_X * 1.5, zIndex: total - i };
  }

  function posicionarAgora(g, el, v) {
    g.set(el, {
      x: v.x, y: v.y, z: v.z,
      xPercent: -50, yPercent: -50,
      skewY: SKEW, transformOrigin: 'center center',
      zIndex: v.zIndex, force3D: true
    });
  }

  function reposicionarTudo(g) {
    ordem.forEach(function (indice, posicao) {
      var el = cartas[indice];
      if (el) posicionarAgora(g, el, vaga(posicao));
    });
  }

  // ---------- Giro para a frente ----------
  function girar() {
    var g = window.gsap;
    if (!g || animando || ordem.length < 2) return;
    animando = true;
    var frente = ordem[0];
    var resto = ordem.slice(1);
    anunciar(resto[0]);

    if (movimentoReduzido) {
      ordem = resto.concat(frente);
      reposicionarTudo(g);
      animando = false;
      return;
    }

    var elFrente = cartas[frente];
    var tl = g.timeline();
    tl.to(elFrente, { y: '+=500', duration: CONFIG.durDrop, ease: CONFIG.ease });
    tl.addLabel('promove', '-=' + (CONFIG.durDrop * CONFIG.promoteOverlap));
    resto.forEach(function (indice, i) {
      var el = cartas[indice];
      var v = vaga(i);
      tl.set(el, { zIndex: v.zIndex }, 'promove');
      tl.to(el, { x: v.x, y: v.y, z: v.z, duration: CONFIG.durMove, ease: CONFIG.ease }, 'promove+=' + (i * 0.15));
    });
    var vagaFundo = vaga(total - 1);
    tl.addLabel('retorna', 'promove+=' + (CONFIG.durMove * CONFIG.returnDelay));
    tl.call(function () { g.set(elFrente, { zIndex: vagaFundo.zIndex }); }, undefined, 'retorna');
    tl.to(elFrente, { x: vagaFundo.x, y: vagaFundo.y, z: vagaFundo.z, duration: CONFIG.durReturn, ease: CONFIG.ease }, 'retorna');
    tl.call(function () {
      ordem = resto.concat(frente);
      animando = false;
      resolverPendente();
    });
  }

  // ---------- Giro para trás ----------
  function girarParaTras() {
    var g = window.gsap;
    if (!g || animando || ordem.length < 2) return;
    animando = true;
    var arr = ordem.slice();
    var fundo = arr.pop();
    ordem = [fundo].concat(arr);
    anunciar();

    if (movimentoReduzido) {
      reposicionarTudo(g);
      animando = false;
      return;
    }

    var tl = g.timeline();
    ordem.forEach(function (indice, i) {
      var el = cartas[indice];
      if (!el) return;
      var v = vaga(i);
      tl.set(el, { zIndex: v.zIndex }, 0);
      tl.to(el, { x: v.x, y: v.y, z: v.z, duration: CONFIG.durMove, ease: CONFIG.ease }, 0);
    });
    tl.call(function () { animando = false; resolverPendente(); });
  }

  function resolverPendente() {
    if (!pendente) return;
    var d = pendente;
    pendente = 0;
    if (d < 0) girarParaTras(); else girar();
  }

  // ---------- Giro automático ----------
  // naTela evita que o deck fique girando fora da vista. Ao voltar, ele retoma
  // de onde parou, em vez de ter avançado sozinho no escuro.
  var naTela = false;

  function pararRelogio() { if (relogio) { clearInterval(relogio); relogio = null; } }
  function reiniciarRelogio() {
    if (movimentoReduzido || !naTela) return;
    pararRelogio();
    relogio = setInterval(girar, INTERVALO);
  }

  // ---------- Navegação ----------
  function navegar(dir) {
    if (animando) { pendente = dir; return; }
    if (dir < 0) girarParaTras(); else girar();
    reiniciarRelogio();
  }

  if (botaoAnterior) botaoAnterior.addEventListener('click', function () { navegar(-1); });
  if (botaoProximo) botaoProximo.addEventListener('click', function () { navegar(1); });
  window.addEventListener('soulstory:deck-nav', function (e) {
    navegar((e && e.detail && e.detail.dir) || 1);
  });

  container.addEventListener('mouseenter', pararRelogio);
  container.addEventListener('mouseleave', reiniciarRelogio);

  // ---------- Início ----------
  function iniciar() {
    var g = window.gsap;
    if (!g) { setTimeout(iniciar, 60); return; }
    ordem = cartas.map(function (_, i) { return i; });
    reposicionarTudo(g);
    anunciar(0);

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { naTela = true; reiniciarRelogio(); }
          else { naTela = false; pararRelogio(); }
        });
      }, { rootMargin: '200px' }).observe(container);
    } else {
      naTela = true;
      reiniciarRelogio();
    }
  }
  iniciar();
})();
