// Texto rotativo do hero, portado do componente RotatingText original.
// Alterna três frases, letra por letra, trocando também a cor de fundo da pílula.
//
// Uma diferença proposital em relação ao original: antes de girar, o script mede
// se a frase mais longa cabe na largura disponível. Quando não cabe (celular), as
// três frases continuam girando, só que dentro de uma pílula de tamanho travado,
// com o texto quebrado em duas linhas. Travar largura e altura é o que impede o
// título inteiro de subir e descer a cada troca. A medida é refeita quando a
// janela muda de tamanho.
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
  // A cor do texto acompanha a claridade da pílula. Creme sobre a sky dava 1,70
  // de contraste e sobre a lavanda 2,37, abaixo do piso de 3 para texto grande.
  // Com tinta nas duas claras a conta vira 10,4 e 7,4, e a indigo, que já
  // passava com folga, continua com creme.
  var FRENTES = ['var(--ss-ink)', 'var(--ss-ink)', 'var(--ss-cream)'];
  var INTERVALO = 2200;
  var DUR = 0.55;
  var PASSO = 0.03; // atraso entre uma letra e a seguinte
  var CURVA = 'cubic-bezier(0.22,1,0.36,1)';
  var PADX = '0.28em', PADY = '0.12em';

  var atual = 0;
  var geracao = 0;
  var relogio = null;
  var girando = false;
  var estreito = false;   // true quando a frase mais longa nao cabe numa linha
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
      + (podeQuebrar ? ' flex-wrap:wrap; justify-content:center; align-items:center; width:100%;' : ' flex-wrap:nowrap; white-space:nowrap;');
    if (absoluta) camada.style.cssText += 'position:absolute; left:0; top:0;' + (podeQuebrar ? ' height:100%;' : '');

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

  // ---------- Medida do retangulo travado (telas estreitas) ----------
  // Mede as três frases já quebradas na largura disponível e devolve a maior
  // altura. É ela que fica fixa enquanto a pílula gira: sem isso, a troca de uma
  // frase de duas linhas por uma de uma linha empurraria o título inteiro.
  function maiorAlturaComQuebra(largura) {
    var regua = document.createElement('span');
    regua.style.cssText = 'position:absolute; visibility:hidden; pointer-events:none; left:-9999px; top:0; display:block; white-space:normal; width:' + largura + 'px;';
    raiz.appendChild(regua);
    var maior = 0;
    TEXTOS.forEach(function (t) {
      regua.innerHTML = '';
      var camada = montarCamada(t, 'parado', false, true);
      regua.appendChild(camada);
      maior = Math.max(maior, camada.offsetHeight);
    });
    raiz.removeChild(regua);
    return maior;
  }

  // ---------- Troca de frase ----------
  // No estreito a largura já está travada, então medir a camada só faria a
  // pílula pular de tamanho a cada frase.
  function medirELargar(camada) {
    if (estreito) return;
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
    raiz.style.color = FRENTES[atual];

    var entrando = montarCamada(TEXTOS[atual], 'entra', false, estreito);
    var saindo = montarCamada(TEXTOS[anterior], 'sai', true, estreito);

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

  function comecarAGirar(modoEstreito) {
    estreito = modoEstreito;
    girando = true;
    atual = 0;
    leitor.textContent = TEXTOS[0];
    raiz.style.backgroundColor = FUNDOS[0];
    raiz.style.color = FRENTES[0];
    if (estreito) {
      // A frase mais longa não cabe numa linha. Em vez de congelar numa frase só,
      // a pílula vira um retângulo de tamanho fixo (a largura disponível, a altura
      // da maior frase) e as três giram quebradas dentro dele.
      var largura = larguraDisponivel();
      raiz.style.whiteSpace = 'normal';
      raiz.style.maxWidth = '100%';
      raiz.style.width = largura + 'px';
      raiz.style.height = maiorAlturaComQuebra(largura) + 'px';
      palco.style.width = '100%';
      palco.style.height = '100%';
      palco.style.alignItems = 'center';
      palco.style.justifyContent = 'center';
    } else {
      raiz.style.whiteSpace = 'nowrap';
      raiz.style.maxWidth = '';
      raiz.style.height = '';
      palco.style.width = '';
      palco.style.height = '';
      palco.style.alignItems = '';
      palco.style.justifyContent = '';
    }
    var primeira = montarCamada(TEXTOS[0], 'parado', false, estreito);
    palco.innerHTML = '';
    palco.appendChild(primeira);
    medirELargar(primeira);
    requestAnimationFrame(function () {
      raiz.style.transition = 'width ' + DUR + 's ' + CURVA + ', background-color ' + DUR + 's ' + CURVA;
    });
    pararRelogio();

    // Com movimento reduzido a pílula não gira: fica parada na primeira frase.
    // Só amaciar a troca não bastava. Trocar de frase a cada 2,2 segundos é
    // conteúdo que se atualiza sozinho para sempre, e o corte seco incomoda
    // quem pediu menos movimento tanto quanto a animação incomodava. As outras
    // frases não se perdem: a seção "O que acontece nas 4 semanas" lista as
    // quatro por extenso, e o leitor de tela continua anunciando esta.
    if (movimentoReduzido) return;

    relogio = setInterval(avancar, INTERVALO);
  }

  // ---------- Escolha do modo, agora e a cada mudança de tamanho ----------
  // Remonta só quando o modo realmente muda de um lado para o outro, para o giro
  // não recomeçar do zero a cada respiro da janela.
  function decidirModo() {
    var modoEstreito = !cabeNaLinha();
    if (!girando || modoEstreito !== estreito) comecarAGirar(modoEstreito);
  }

  comecarAGirar(!cabeNaLinha());

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
