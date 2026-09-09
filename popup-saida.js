// Pop-up de saida.
//
// Aparece uma unica vez por sessao, quando a pessoa da sinal de que vai
// embora. Reaproveita a casca de vidro do modal do Raio-X (mesmo raio, mesma
// borda, mesmas animacoes raioxPop e raioxFade, ja definidas no index.html),
// sem a camada de brilho em gradiente, que a marca nao usa.
//
// O sinal de saida muda conforme o aparelho: no desktop e o cursor escapando
// pela borda de cima, em direcao as abas. No celular nao existe cursor, entao
// o sinal e uma rolagem rapida para cima depois de a pessoa ja ter descido a
// pagina, que e como alguem procura o botao de voltar.
(function () {
  'use strict';

  var CHAVE = 'soulstory:popup-saida';
  var INSTAGRAM = 'https://www.instagram.com/soulstory.br/';

  // Respiro antes de qualquer disparo. Quem bate na pagina e sai em dois
  // segundos nao errou o caminho por falta de convite.
  var TEMPO_MINIMO = 12000;

  // Celular: so vale como saida se a pessoa ja desceu a pagina e volta rapido.
  var PROFUNDIDADE_MINIMA = 0.25;
  var SUBIDA_MINIMA = 140;
  var JANELA_SUBIDA = 420;

  var raiz = null;
  var aberto = false;
  var focoAnterior = null;
  var nascimento = Date.now();
  var movimentoReduzido = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Memoria da exibicao ----------
  // sessionStorage e nao localStorage: o convite se renova a cada visita nova,
  // mas nunca repete dentro da mesma. Falha de armazenamento cai para o lado
  // de nao incomodar.
  function jaMostrou() {
    try { return window.sessionStorage.getItem(CHAVE) === '1'; } catch (e) { return true; }
  }

  function marcarMostrado() {
    try { window.sessionStorage.setItem(CHAVE, '1'); } catch (e) {}
  }

  // ---------- Motivos para ficar calado ----------
  function visivel(elemento) {
    if (!elemento) return false;
    try { return window.getComputedStyle(elemento).display !== 'none'; } catch (e) { return false; }
  }

  // O banner de cookies NAO entra aqui de proposito. Ja foi tentado esperar a
  // decisao antes de abrir, e na pratica o cartao nunca aparecia: quase
  // ninguem clica no banner. O pop-up abre por cima, o veu escurece o banner
  // por um momento e a escolha continua intacta quando o cartao fecha. Nenhum
  // rastreador dispara sem aceite de qualquer forma.
  function bloqueado() {
    if (aberto || jaMostrou()) return true;
    if (Date.now() - nascimento < TEMPO_MINIMO) return true;
    // O modal do Raio-X so existe no DOM depois de ter sido aberto uma vez.
    // Quem chegou no formulario nao precisa deste convite.
    if (document.querySelector('[data-modal-raiox]')) return true;
    return false;
  }

  // ---------- Montagem ----------
  function html() {
    var animCard = movimentoReduzido ? '' : ' animation:raioxPop .44s cubic-bezier(0.22,1,0.36,1);';
    var animVeu = movimentoReduzido ? '' : ' animation:raioxFade .3s ease;';

    return '' +
      '<div data-acao="fechar" style="position:absolute; inset:0; background:rgba(9,8,17,0.62); backdrop-filter:blur(7px); -webkit-backdrop-filter:blur(7px);' + animVeu + '"></div>' +
      '<div role="dialog" aria-modal="true" aria-labelledby="ps-titulo" style="position:relative; width:min(540px, 100%); max-height:min(92vh, 720px); overflow:hidden; border-radius:28px; background:rgba(20,19,38,0.55); backdrop-filter:blur(34px) saturate(180%); -webkit-backdrop-filter:blur(34px) saturate(180%); border:1px solid rgba(200,208,255,0.22); box-shadow:0 50px 130px -30px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.22);' + animCard + '">' +

        // Orbes de profundidade: cor solida com desfoque, nao gradiente.
        '<div aria-hidden="true" style="position:absolute; top:-90px; right:-70px; width:270px; height:270px; border-radius:50%; background:rgba(142,159,238,0.30); filter:blur(72px); pointer-events:none"></div>' +
        '<div aria-hidden="true" style="position:absolute; bottom:-100px; left:-60px; width:250px; height:250px; border-radius:50%; background:rgba(140,198,255,0.16); filter:blur(78px); pointer-events:none"></div>' +

        '<button type="button" data-acao="fechar" aria-label="Fechar" style="position:absolute; top:18px; right:18px; z-index:2; width:38px; height:38px; border-radius:50%; border:1px solid rgba(250,248,245,0.18); background:rgba(250,248,245,0.06); color:var(--ss-cream); font-size:22px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; flex:none; transition:background .2s ease">×</button>' +

        '<div style="position:relative; padding:46px 38px 44px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:20px">' +
          '<img src="images/symbol-cream.png" alt="" width="140" height="107" style="width:52px; height:auto; display:block; opacity:0.92">' +
          '<h2 id="ps-titulo" style="margin:0; max-width:22ch; font-family:var(--font-sans); font-weight:400; font-size:clamp(24px, 4.4vw, 32px); line-height:1.2; letter-spacing:-0.01em; color:var(--ss-cream); text-wrap:balance">Você quer ver seus clientes mais felizes pagando mais caro pelos mesmos produtos e serviços?</h2>' +
          '<p style="margin:0; font-family:var(--font-serif); font-style:italic; font-size:21px; line-height:1.5; color:rgba(250,248,245,0.78)">Segue a Soulstory.</p>' +
          '<a href="' + INSTAGRAM + '" target="_blank" rel="noopener" data-acao="seguir" style="margin-top:4px; display:inline-flex; align-items:center; justify-content:center; text-decoration:none; background:var(--ss-periwinkle); color:#0C0B14; border:none; border-radius:13px; padding:15px 32px; font-family:var(--font-sans); font-weight:600; font-size:17px; cursor:pointer; box-shadow:0 10px 26px -12px rgba(142,159,238,0.7); transition:transform .15s ease, box-shadow .2s ease">Seguir no Instagram</a>' +
        '</div>' +
      '</div>';
  }

  function montar() {
    raiz = document.createElement('div');
    raiz.setAttribute('data-popup-saida', '');
    // Abaixo do Raio-X (120) de proposito: se os dois existirem, o formulario manda.
    raiz.style.cssText = 'position:fixed; inset:0; z-index:118; display:none; align-items:center; justify-content:center; padding:18px; font-family:var(--font-sans)';
    raiz.innerHTML = html();

    raiz.addEventListener('click', function (e) {
      var alvo = e.target.closest('[data-acao]');
      if (!alvo) return;
      if (alvo.getAttribute('data-acao') === 'fechar') fechar();
      if (alvo.getAttribute('data-acao') === 'seguir') fechar();
    });

    document.body.appendChild(raiz);
  }

  // ---------- Abrir e fechar ----------
  function abrir() {
    if (bloqueado()) return;

    marcarMostrado();
    if (!raiz) montar();
    aberto = true;
    focoAnterior = document.activeElement;
    raiz.style.display = 'flex';
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    var fechaBotao = raiz.querySelector('button[data-acao="fechar"]');
    if (fechaBotao) { try { fechaBotao.focus(); } catch (e) {} }
    desligarSensores();
  }

  function fechar() {
    if (!aberto) return;
    aberto = false;
    if (raiz) raiz.style.display = 'none';
    try { document.body.style.overflow = ''; } catch (e) {}
    if (focoAnterior) { try { focoAnterior.focus(); } catch (e) {} }
  }

  // ---------- Teclado ----------
  // Escape fecha, e o Tab circula dentro do cartao enquanto ele esta aberto,
  // para o teclado nao escapar para a pagina atras do veu.
  document.addEventListener('keydown', function (e) {
    if (!aberto) return;
    if (e.key === 'Escape') { fechar(); return; }
    if (e.key !== 'Tab' || !raiz) return;

    var focaveis = raiz.querySelectorAll('button, a[href]');
    if (!focaveis.length) return;
    var primeiro = focaveis[0];
    var ultimo = focaveis[focaveis.length - 1];

    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  });

  // ---------- Sensores de saida ----------
  var sensoresLigados = false;

  function aoSairPeloTopo(e) {
    // relatedTarget vazio significa que o cursor deixou a janela, e nao apenas
    // passou de um elemento para outro dentro dela.
    if (e.relatedTarget || e.clientY > 0) return;
    abrir();
  }

  var ultimoY = 0;
  var ultimoT = 0;

  function aoRolar() {
    var y = window.scrollY;
    var t = Date.now();
    var altura = document.documentElement.scrollHeight - window.innerHeight;

    if (altura > 0 && y / altura >= PROFUNDIDADE_MINIMA) {
      var subiu = ultimoY - y;
      if (subiu >= SUBIDA_MINIMA && t - ultimoT <= JANELA_SUBIDA) {
        abrir();
        return;
      }
    }
    // Referencia so anda para baixo ou depois da janela, para a subida ser
    // medida contra o ponto mais alto recente e nao contra o quadro anterior.
    if (y > ultimoY || t - ultimoT > JANELA_SUBIDA) { ultimoY = y; ultimoT = t; }
  }

  function ligarSensores() {
    if (sensoresLigados) return;
    sensoresLigados = true;
    var comCursor = window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (comCursor) {
      document.addEventListener('mouseout', aoSairPeloTopo);
    } else {
      ultimoY = window.scrollY;
      ultimoT = Date.now();
      window.addEventListener('scroll', aoRolar, { passive: true });
    }
  }

  function desligarSensores() {
    sensoresLigados = false;
    document.removeEventListener('mouseout', aoSairPeloTopo);
    window.removeEventListener('scroll', aoRolar);
  }

  // ---------- Entrada ----------
  if (!jaMostrou()) ligarSensores();

  // Gatilho manual, util para conferir o cartao sem esperar o sinal de saida.
  window.soulstoryPopupSaida = function () {
    try { window.sessionStorage.removeItem(CHAVE); } catch (e) {}
    nascimento = 0;
    abrir();
  };
})();
