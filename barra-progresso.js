// Barra de progresso do topo, portada do runtime original.
// O herói caminha da esquerda para a direita conforme a leitura avança, até
// alcançar a princesa quando o botão de agendamento entra na tela. O dragão
// para de soltar fogo e tomba, e faíscas aparecem.
// A barra só se mostra depois que o botão de agendar do cabeçalho sai da tela,
// para as duas chamadas não competirem no topo.
(function () {
  'use strict';

  var barra = document.querySelector('.hero-progress');
  if (!barra) return;

  var caixaHeroi = barra.children[1];          // posiciona o herói ao longo da barra
  var heroi = barra.querySelector('.hp-hero');
  var grupoDireita = barra.children[2];        // dragão e princesa
  var caixaDragao = grupoDireita && grupoDireita.firstElementChild;
  var fogo = caixaDragao && caixaDragao.firstElementChild;
  var princesa = barra.querySelector('.hp-pc');
  if (!caixaHeroi || !heroi || !caixaDragao || !princesa) return;

  var movimentoReduzido = false;
  try { movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // ---------- Sprites do herói, em dois quadros de caminhada ----------
  var PALETA = { o: '#0C0B14', a: '#3D396E', h: '#8E9FEE', s: '#8CC6FF', f: '#FAF8F5', m: '#E1E4F6', g: '#E9BE58', k: '#4A3B0C', r: '#9B4444', d: '#5E2A2A' };

  function pix(linhas, px) {
    var altura = linhas.length, largura = linhas[0].length, retangulos = '';
    for (var y = 0; y < altura; y++) {
      for (var x = 0; x < largura; x++) {
        var c = linhas[y][x];
        if (c === '.' || c === ' ' || !PALETA[c]) continue;
        retangulos += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + PALETA[c] + '"></rect>';
      }
    }
    return '<svg width="' + (largura * px) + '" height="' + (altura * px) + '" viewBox="0 0 ' + largura + ' ' + altura + '" shape-rendering="crispEdges" style="display:block">' + retangulos + '</svg>';
  }

  var TOPO_HEROI = ['....oo.....', '...ofoo....', '...offo..o.', '...offo.oso', '..oaaaooso.', '.oahhaooo..', '.oahhaao...', '.oaaaaao...', '..oaaao....', '..oa.ao....'];
  var QUADRO_A = pix(TOPO_HEROI.concat(['..o...o....', '.oo...oo...', '.o.....o...']), 2);
  var QUADRO_B = pix(TOPO_HEROI.concat(['..o...o....', '..oo.oo....', '...o.o.....']), 2);

  // ---------- Estado ----------
  var venceu = false, recuando = false, andando = false, quadro = 0;
  var ultimaRolagem = 0;
  var alvo = null, inicio = null;
  var faiscas = [];

  function criarFaiscas() {
    if (faiscas.length) return;
    [[0, -5, 4, ''], [16, 1, 3, 'animation-delay:.3s'], [30, -3, 3, 'animation-delay:.6s']].forEach(function (f, i) {
      var d = document.createElement('div');
      d.className = 'hp-spark';
      d.style.cssText = 'position:absolute; right:' + f[0] + 'px; top:' + f[1] + 'px; width:' + f[2] + 'px; height:' + f[2] + 'px; background:' + (i === 1 ? '#8E9FEE' : '#8CC6FF') + ';' + f[3];
      grupoDireita.appendChild(d);
      faiscas.push(d);
    });
  }

  function removerFaiscas() {
    faiscas.forEach(function (d) { if (d.parentNode) d.parentNode.removeChild(d); });
    faiscas = [];
  }

  function aplicarVitoria() {
    princesa.classList.toggle('cheer', venceu);
    if (fogo) fogo.style.opacity = venceu ? '0' : '1';
    caixaDragao.style.transform = venceu ? 'rotate(14deg) translateY(4px)' : '';
    caixaDragao.style.filter = venceu ? 'grayscale(0.55) opacity(0.5)' : '';
    if (venceu) criarFaiscas(); else removerFaiscas();
  }

  function aoRolar() {
    var doc = document.documentElement;
    var sy = window.scrollY || doc.scrollTop || 0;
    var vh = window.innerHeight || 1;

    if (!alvo || !alvo.isConnected) alvo = document.querySelector('[data-hp-goal]');
    if (!inicio || !inicio.isConnected) inicio = document.querySelector('[data-hp-inicio]');

    var avanco = 0, ganhou = false, recuo = false;
    if (alvo && alvo.getBoundingClientRect().height > 0) {
      var b = alvo.getBoundingClientRect();
      if (b.bottom < 0) {
        // o botão já passou pelo topo: o herói regride
        recuo = true;
        avanco = Math.max(0, 1 - (-b.bottom) / vh);
      } else if (b.top <= vh) {
        // o botão está na tela: o herói alcança a princesa
        ganhou = true;
        avanco = 1;
      } else {
        avanco = Math.min(Math.max(sy / (sy + (b.top - vh)), 0), 1);
      }
    }

    // A barra so entra depois que o botao de agendar do cabecalho sai da tela.
    // Enquanto ele esta visivel, ele ja e a chamada para acao do topo, e a barra
    // disputaria a mesma faixa da tela. A rolagem so responde por isso se o
    // botao sumir do HTML um dia, para a barra nao voltar a nascer colada no topo.
    var mostrar = inicio ? inicio.getBoundingClientRect().bottom < 0 : sy > 16;
    barra.style.setProperty('--p', avanco.toFixed(4));
    barra.style.opacity = mostrar ? '1' : '0';

    ultimaRolagem = performance.now();

    if (ganhou !== venceu) { venceu = ganhou; aplicarVitoria(); }
    if (recuo !== recuando) {
      recuando = recuo;
      caixaHeroi.style.transform = 'translateX(-50%)' + (recuando ? ' scaleX(-1)' : '');
    }
  }

  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', aoRolar, { passive: true });

  // ---------- Caminhada: alterna os dois quadros enquanto a página rola ----------
  heroi.innerHTML = QUADRO_A;
  if (!movimentoReduzido) {
    setInterval(function () {
      var movendo = performance.now() - ultimaRolagem < 170;
      if (movendo && !venceu) {
        quadro = quadro ^ 1;
        heroi.innerHTML = quadro ? QUADRO_B : QUADRO_A;
        if (!andando) { andando = true; heroi.classList.add('walking'); }
      } else if (andando) {
        andando = false;
        heroi.classList.remove('walking');
      }
    }, 150);
  }

  heroi.classList.remove('walking');
  aoRolar();
})();
