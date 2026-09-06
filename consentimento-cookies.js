// Banner de consentimento de cookies (LGPD).
//
// O Google Tag Manager nao esta no HTML: ele so e criado aqui dentro, depois
// que a pessoa clica em Aceitar. Sem aceite, nenhuma requisicao sai para o
// Google e nada e medido. Quem recusa usa o site igual, so nao e medido.
//
// O formulario do Raio-X nao depende disto. Ele fala direto com o Apps Script
// e continua funcionando com ou sem aceite.
(function () {
  'use strict';

  var GTM_ID = 'GTM-M6ZR2J68';
  var CHAVE = 'soulstory:consentimento-cookies';

  var raiz = null;
  var gtmCarregado = false;

  // ---------- Memoria da escolha ----------
  // Tudo em try/catch: o localStorage lanca excecao em navegacao privada e
  // quando o armazenamento esta bloqueado. Qualquer falha cai para o lado de
  // nao rastrear, nunca o contrario.
  function lerEscolha() {
    try {
      var bruto = window.localStorage.getItem(CHAVE);
      if (!bruto) return '';
      return (JSON.parse(bruto) || {}).escolha || '';
    } catch (e) {
      return '';
    }
  }

  function guardarEscolha(escolha) {
    try {
      // A data entra porque a LGPD trata consentimento como algo datavel.
      window.localStorage.setItem(CHAVE, JSON.stringify({
        escolha: escolha,
        data: new Date().toISOString()
      }));
    } catch (e) {}
  }

  function esquecerEscolha() {
    try { window.localStorage.removeItem(CHAVE); } catch (e) {}
  }

  // ---------- Google Tag Manager ----------
  // De proposito sem a parte <noscript> do snippet oficial: aquele iframe
  // dispara sem JavaScript, ou seja, sem passar pelo consentimento, e isso
  // anularia toda a logica desta tela.
  function carregarGtm() {
    if (gtmCarregado) return;
    gtmCarregado = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(script);
  }

  // ---------- Banner ----------
  function montar() {
    raiz = document.createElement('div');
    raiz.className = 'cc-faixa';
    raiz.innerHTML = '' +
      '<div class="cc-caixa" role="region" aria-label="Aviso sobre cookies">' +
        '<p class="cc-texto">Usamos cookies para medir a audiência do site e melhorar a sua experiência. ' +
          'Saiba mais na nossa <a class="cc-link" href="/politica-de-privacidade" target="_blank" rel="noopener">Política de Privacidade</a>.</p>' +
        '<div class="cc-botoes">' +
          '<button type="button" class="cc-botao" data-acao="aceitar">Aceitar</button>' +
          '<button type="button" class="cc-botao" data-acao="recusar">Recusar</button>' +
        '</div>' +
      '</div>';

    raiz.addEventListener('click', function (e) {
      var alvo = e.target.closest('[data-acao]');
      if (!alvo) return;
      decidir(alvo.getAttribute('data-acao') === 'aceitar' ? 'aceito' : 'recusado');
    });

    document.body.appendChild(raiz);
  }

  function mostrar() {
    if (!raiz) montar();
    raiz.style.display = '';
    // A marca na raiz faz o rodape reservar espaco para os proprios links.
    document.documentElement.classList.add('cc-aberto');
  }

  function esconder() {
    if (raiz) raiz.style.display = 'none';
    document.documentElement.classList.remove('cc-aberto');
  }

  // O hero ocupa a tela inteira e coloca os botoes principais perto da base,
  // entao um cartao no rodape disputava espaco com eles em tablet. Esperando a
  // pessoa sair da primeira dobra, os dois nunca dividem a tela. Nada e medido
  // antes do aceite de qualquer forma: quem nunca rolar nao ve o cartao e
  // tambem nao e rastreado.
  var LIMITE_ROLAGEM = 0.8;

  function mostrarAposRolagem() {
    if (window.scrollY > window.innerHeight * LIMITE_ROLAGEM) { mostrar(); return; }
    function aoRolar() {
      if (window.scrollY <= window.innerHeight * LIMITE_ROLAGEM) return;
      window.removeEventListener('scroll', aoRolar);
      mostrar();
    }
    window.addEventListener('scroll', aoRolar, { passive: true });
  }

  function decidir(escolha) {
    guardarEscolha(escolha);
    esconder();
    if (escolha === 'aceito') carregarGtm();
    // Recusa depois de um aceite anterior: o GTM ja carregado nesta aba segue
    // na memoria ate a proxima carga da pagina. A escolha nova ja vale para
    // todas as visitas seguintes.
  }

  // Fonte da verdade do consentimento para quem precisa medir. O modal do
  // Raio-X pergunta aqui antes de empurrar qualquer evento para o dataLayer,
  // para nada ser contabilizado retroativamente por quem nunca aceitou.
  window.soulstoryCookiesAceitos = function () {
    return lerEscolha() === 'aceito';
  };

  // Ponto de revogacao. Enquanto o site nao tem rodape, esta funcao e o
  // caminho para reabrir a escolha: window.soulstoryPreferenciasCookies().
  window.soulstoryPreferenciasCookies = function () {
    esquecerEscolha();
    mostrar();
  };

  // ---------- Botao de preferencias do rodape ----------
  // O botao nasce com hidden no HTML e so aparece aqui. Se este script falhar,
  // ele nao aparece, em vez de aparecer e nao fazer nada ao ser clicado.
  function ligarBotoesPreferencias() {
    var botoes = document.querySelectorAll('[data-acao="preferencias-cookies"]');
    for (var i = 0; i < botoes.length; i++) botoes[i].hidden = false;
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-acao="preferencias-cookies"]')) {
        window.soulstoryPreferenciasCookies();
      }
    });
  }

  // ---------- Entrada ----------
  ligarBotoesPreferencias();

  var escolha = lerEscolha();
  if (escolha === 'aceito') {
    carregarGtm();
  } else if (escolha !== 'recusado') {
    mostrarAposRolagem();
  }
})();
