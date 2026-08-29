// Cards "Motivo 1" e "Motivo 2" da seção Problema, portados do runtime original.
// Cada card vira em 3D no clique, revelando o verso, e volta no clique seguinte.
(function () {
  'use strict';

  var cards = document.querySelectorAll('[role="button"][aria-label^="Motivo"]');
  if (!cards.length) return;

  // Com movimento reduzido o card ainda vira, mas sem a animação de giro.
  var movimentoReduzido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(cards, function (card) {
    var interno = card.firstElementChild;
    if (!interno) return;

    if (movimentoReduzido) interno.style.transition = 'none';

    function virar() {
      var virado = card.getAttribute('aria-pressed') === 'true';
      card.setAttribute('aria-pressed', virado ? 'false' : 'true');
      interno.style.transform = virado ? 'rotateY(0deg)' : 'rotateY(180deg)';
    }

    card.addEventListener('click', virar);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        virar();
      }
    });
  });
})();
