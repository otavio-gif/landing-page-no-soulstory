// Contadores das quatro réguas de estatística, portados do runtime original.
// Cada número sobe de zero até o valor final quando o card entra na tela,
// com a mesma contagem por mola do original.
// Com movimento reduzido nada anima: os valores finais ficam desde o começo.
(function () {
  'use strict';

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-regua]'));
  if (!cards.length) return;

  var movimentoReduzido = false;
  try { movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (movimentoReduzido) return; // o HTML já traz o valor final

  var rafs = [];

  function formatar(v, casas) {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(v);
  }

  function escrever(el, v) {
    var casas = parseInt(el.getAttribute('data-dec') || '0', 10);
    el.textContent = (el.getAttribute('data-pre') || '') + formatar(v, casas) + (el.getAttribute('data-suf') || '');
  }

  // Contagem por mola, na mesma configuração do original
  // (rigidez = 100/duração, amortecimento = 20 + 40/duração, massa 1).
  function contarComMola(el, destino, duracao) {
    var rigidez = 100 * (1 / duracao);
    var amortecimento = 20 + 40 * (1 / duracao);
    var valor = 0, velocidade = 0, ultimo = performance.now();

    function passo(t) {
      var dt = Math.min((t - ultimo) / 1000, 1 / 30);
      ultimo = t;
      for (var i = 0; i < 4; i++) {
        var h = dt / 4;
        var acel = rigidez * (destino - valor) - amortecimento * velocidade;
        velocidade += acel * h;
        valor += velocidade * h;
      }
      var assentou = Math.abs(destino - valor) < Math.max(destino * 0.0005, 0.001) && Math.abs(velocidade) < 0.02;
      escrever(el, assentou ? destino : valor);
      if (!assentou) rafs.push(requestAnimationFrame(passo));
    }
    rafs.push(requestAnimationFrame(passo));
  }

  function revelar(card) {
    if (card._reguaPronta) return;
    card._reguaPronta = true;
    var num = card.querySelector('[data-regua-num]');
    if (num) contarComMola(num, parseFloat(num.getAttribute('data-to') || '0'), 2);
  }

  // Zera apenas os cards que ainda não passaram pela tela, travando a largura
  // antes, para o número crescendo não empurrar o layout do card.
  var pendentes = [];
  cards.forEach(function (card) {
    var caixa = card.getBoundingClientRect();
    if (caixa.bottom <= 0) return; // já ficou para trás: mantém o valor final
    var num = card.querySelector('[data-regua-num]');
    if (num) {
      if (!num.style.minWidth) num.style.minWidth = Math.ceil(num.getBoundingClientRect().width) + 'px';
      escrever(num, 0);
    }
    pendentes.push(card);
  });
  if (!pendentes.length) return;

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (en.isIntersecting) { revelar(en.target); observador.unobserve(en.target); }
    });
  }, { threshold: 0.25 });
  pendentes.forEach(function (c) { observador.observe(c); });

  // Rede de segurança, caso o observador não dispare em algum navegador.
  function aoRolar() {
    pendentes.forEach(function (c) {
      var b = c.getBoundingClientRect();
      if (!c._reguaPronta && b.top < (window.innerHeight || 0) * 0.92 && b.bottom > 0) revelar(c);
    });
    if (pendentes.every(function (c) { return c._reguaPronta; })) {
      window.removeEventListener('scroll', aoRolar);
    }
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  setTimeout(aoRolar, 400);
})();
