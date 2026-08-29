// Texto rotativo do hero, portado do componente RotatingText original.
// Alterna três frases, letra por letra, trocando também a cor de fundo da pílula.
//
// Uma diferença proposital em relação ao original: antes de girar, o script mede
// se a frase mais longa cabe na largura disponível. Quando não cabe (celular), a
// pílula fica parada na última frase e quebra em duas linhas, em vez de transbordar
// a tela. A medida é refeita quando a janela muda de tamanho.
(function () {
  'use strict';

  var raiz = document.querySelector('[data-texto-rotativo]');
  if (!raiz) return;

  var leitor = raiz.querySelector('[data-rt-leitor]'); // texto para leitor de tela
  var palco = raiz.querySelector('[data-rt-palco]');
  if (!leitor || !palco) return;

  // Configuração igual à do hero original.
  var TEXTOS = ['vender gastando menos', 'vender mais', 'vender mais caro'];
  var FUNDOS = ['var(--ss-sky)', '#8E9FEE', 'var(--ss-indigo)'];
  var INTERVALO = 2200;
  var DUR = 0.55;
  var PASSO = 0.03; // atraso entre uma letra e a seguinte
  var CURVA = 'cubic-bezier(0.22,1,0.36,1)';
  var PADX = '0.28em', PADY = '0.12em';

  var atual = 0;
  var geracao = 0;
  var relogio = null;
  var girando = false;
  var movimentoReduzido = false;
  try { movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // Divide respeitando acentos e caracteres compostos.
  function letras(texto) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      var seg = new Intl.Segmenter('pt', { granularity: 'grapheme' });
      return Array.from(seg.segment(String(texto)), function (s) { return s.segment; });
    }
    return Array.from(String(texto));
  }

  function totalDeLetras(texto) {
    return String(texto).split(' ').reduce(function (s, p) { return s + letras(p).length; }, 0);
  }

  // Monta uma camada de texto com a animação pedida: 'parado', 'entra' ou 'sai'.
  // Só o modo parado permite quebra de linha; girando, a frase fica sempre numa linha
  // (do contrário a medida da largura sairia errada e a pílula encolheria sozinha).
  function montarCamada(texto, modo, absoluta, podeQuebrar) {
    var camada = document.createElement('span');
    camada.setAttribute('aria-hidden', 'true');
    camada.style.cssText = 'display:inline-flex; padding:' + PADY + ' ' + PADX + '; box-sizing:border-box; line-height:1.1;'
      + (podeQuebrar ? ' flex-wrap:wrap; justify-content:center;' : ' flex-wrap:nowrap; white-space:nowrap;');
    if (absoluta) camada.style.cssText += 'position:absolute; left:0; top:0;';

    var palavras = String(texto).split(' ');
    var i = 0;

    palavras.forEach(function (palavra, wi) {
      var blocoPalavra = document.createElement('span');
      blocoPalavra.style.display = 'inline-flex';
      letras(palavra).forEach(function (ch) {
        var atraso = i * PASSO;
        i += 1;
        var span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, opacity';
        if (modo !== 'parado') {
          if (movimentoReduzido) {
            // com movimento reduzido a troca é só um esmaecer, sem deslocamento
            span.style.animation = (modo === 'entra' ? 'rtxIn' : 'rtxOut') + ' ' + Math.min(DUR, 0.22) + 's ' + CURVA + ' ' + Math.min(atraso, 0.1) + 's both';
          } else {
            span.style.animation = (modo === 'entra' ? 'rtxEnter' : 'rtxLeave') + ' ' + DUR + 's ' + CURVA + ' ' + atraso + 's both';
          }
        }
        span.textContent = ch;
        blocoPalavra.appendChild(span);
      });
      camada.appendChild(blocoPalavra);
      if (wi !== palavras.length - 1) {
        var espaco = document.createElement('span');
        espaco.style.whiteSpace = 'pre';
        espaco.textContent = ' ';
        camada.appendChild(espaco);
      }
    });
    return camada;
  }

  // ---------- Medida: a frase mais longa cabe na linha? ----------
  // Mede o contêiner que abriga o título, não o título em si: a largura dele vem
  // de uma porcentagem da tela, então não é influenciada pelo tamanho da pílula.
  function larguraDisponivel() {
    var titulo = raiz.closest('h1');
    if (!titulo) return document.documentElement.clientWidth;
    var caixa = titulo.parentElement;
    if (!caixa) return titulo.clientWidth;
    var estilo = getComputedStyle(caixa);
    var largura = caixa.clientWidth - parseFloat(estilo.paddingLeft || 0) - parseFloat(estilo.paddingRight || 0);
    return largura > 0 ? largura : titulo.clientWidth;
  }

  function maiorLarguraDeFrase() {
    var regua = document.createElement('span');
    regua.style.cssText = 'position:absolute; visibility:hidden; pointer-events:none; white-space:nowrap; left:-9999px; top:0;';
    raiz.appendChild(regua);
    var maior = 0;
    TEXTOS.forEach(function (t) {
      regua.innerHTML = '';
      var camada = montarCamada(t, 'parado', false, false);
      regua.appendChild(camada);
      maior = Math.max(maior, camada.offsetWidth);
    });
    raiz.removeChild(regua);
    return maior;
  }

  function cabeNaLinha() {
    return maiorLarguraDeFrase() <= larguraDisponivel();
  }

  // ---------- Modo parado (telas estreitas) ----------
  function mostrarParado() {
    pararRelogio();
    girando = false;
    atual = TEXTOS.length - 1; // a última frase é a mais forte da sequência
    leitor.textContent = TEXTOS[atual];
    raiz.style.backgroundColor = FUNDOS[atual];
    raiz.style.width = 'auto';
    raiz.style.whiteSpace = 'normal';
    raiz.style.maxWidth = '100%';
    var camada = montarCamada(TEXTOS[atual], 'parado', false, true);
    palco.innerHTML = '';
    palco.appendChild(camada);
  }

  // ---------- Modo girando (telas largas) ----------
  function medirELargar(camada) {
    var largura = camada.offsetWidth;
    if (largura) raiz.style.width = largura + 'px';
  }

  function avancar() {
    var anterior = atual;
    atual = (atual + 1) % TEXTOS.length;
    geracao += 1;
    var estaGeracao = geracao;

    leitor.textContent = TEXTOS[atual];
    raiz.style.backgroundColor = FUNDOS[atual];

    var entrando = montarCamada(TEXTOS[atual], 'entra', false, false);
    var saindo = montarCamada(TEXTOS[anterior], 'sai', true, false);

    palco.innerHTML = '';
    palco.appendChild(entrando);
    palco.appendChild(saindo);
    medirELargar(entrando);

    // retira a camada que saiu quando a animação dela termina
    var maior = Math.max(totalDeLetras(TEXTOS[atual]), totalDeLetras(TEXTOS[anterior]));
    var ms = (DUR + PASSO * maior) * 1000 + 140;
    setTimeout(function () {
      if (geracao !== estaGeracao) return;
      if (saindo.parentNode) saindo.parentNode.removeChild(saindo);
    }, ms);
  }

  function pararRelogio() { if (relogio) { clearInterval(relogio); relogio = null; } }

  function comecarAGirar() {
    girando = true;
    atual = 0;
    leitor.textContent = TEXTOS[0];
    raiz.style.backgroundColor = FUNDOS[0];
    raiz.style.whiteSpace = 'nowrap';
    raiz.style.maxWidth = '';
    var primeira = montarCamada(TEXTOS[0], 'parado', false, false);
    palco.innerHTML = '';
    palco.appendChild(primeira);
    medirELargar(primeira);
    requestAnimationFrame(function () {
      raiz.style.transition = 'width ' + DUR + 's ' + CURVA + ', background-color ' + DUR + 's ' + CURVA;
    });
    pararRelogio();
    relogio = setInterval(avancar, INTERVALO);
  }

  // ---------- Escolha do modo, agora e a cada mudança de tamanho ----------
  function decidirModo() {
    var deveGirar = cabeNaLinha();
    if (deveGirar && !girando) comecarAGirar();
    else if (!deveGirar && girando) mostrarParado();
  }

  // primeira decisão: como nada foi montado ainda, força o caminho completo
  if (cabeNaLinha()) comecarAGirar();
  else mostrarParado();

  var esperaResize = null;
  window.addEventListener('resize', function () {
    clearTimeout(esperaResize);
    esperaResize = setTimeout(decidirModo, 200);
  });

  // As fontes da marca chegam pela rede e podem demorar. A primeira medida sai
  // com a fonte de reserva, que é mais larga, então refazemos a conta quando as
  // fontes de verdade terminam de carregar.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (girando) {
        // já girando: só corrige a largura da frase que está na tela
        var camada = palco.firstElementChild;
        if (camada) medirELargar(camada);
      }
      decidirModo();
    });
  }
})();
