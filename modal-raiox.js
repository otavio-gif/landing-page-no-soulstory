// Modal do Raio-X de Marca, portado do runtime original para JavaScript puro.
// Abre pelo botao dentro da secao #investimento. Os demais botoes continuam
// rolando ate a secao por ancora nativa.
(function () {
  'use strict';

  // ---------- Backend ----------
  // Endpoint publico do Google Apps Script que grava na planilha e dispara o
  // email de aviso. E uma URL de publicacao, nao um segredo.
  var URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbym9ibB2-BCfY4l_2apbnYJX9o0zWaqniHPO_lGTsSiozSGvGETAB-hX69zwJcI84yr/exec';

  // ---------- Sprites em pixel art (mesma paleta do original) ----------
  var PALETA = { o: '#0C0B14', a: '#3D396E', h: '#8E9FEE', s: '#8CC6FF', f: '#FAF8F5', m: '#E1E4F6', g: '#E9BE58', k: '#4A3B0C', r: '#9B4444', d: '#5E2A2A' };

  function pix(linhas, px) {
    var altura = linhas.length, largura = linhas[0].length;
    var retangulos = '';
    for (var y = 0; y < altura; y++) {
      for (var x = 0; x < largura; x++) {
        var c = linhas[y][x];
        if (c === '.' || c === ' ' || !PALETA[c]) continue;
        retangulos += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + PALETA[c] + '"></rect>';
      }
    }
    return '<svg width="' + (largura * px) + '" height="' + (altura * px) + '" viewBox="0 0 ' + largura + ' ' + altura + '" shape-rendering="crispEdges" style="display:block">' + retangulos + '</svg>';
  }

  var GORILA = ['....ooooo......', '...oaaaaao.....', '...osoaoso.....', '...oaaaaao.....', '.oooaaaaaooo...', 'oaaaaaaaaaaao..', 'oahhaaaaahhao..', 'oahhaaaaahhao..', 'oaaaaaaaaaaao..', 'ooaaaaaaaaaoo..', 'o.oaaaaaaao.o..', 'o.oaaaaaaao.o..', 'o..oaaaaao..o..', '...oao.oao.....', '..ooo..ooo.....'];
  var BARRIL = ['..oooo..', '.orrddo.', 'orrddrro', 'orddrrdo', 'ordrrddo', 'orrddrro', '.oddrro.', '..oooo..'];
  var HEROI_MODAL = ['....oo.....', '...ofoo....', '...offo..o.', '...offo.oso', '..oaaaooso.', '.oahhaooo..', '.oahhaao...', '.oaaaaao...', '..oaaao....', '..oa.ao....', '..o...o....', '.oo...oo...', '.o.....o..'];
  var PRINCESA = ['..s.s.s..', '.osssso..', '.ohhhho..', '.ohffho..', '.ohffho..', '.ohhhho..', '..ommo...', '.ommmmo..', '.ommmmo..', 'ommmmmmo.', 'ommmmmmo.', '.ommmmo..', '..o..o...'];
  var CORPO_HEROI = ['..oooo...', '.oaaaao..', '.oaaaao..', '.oaaaao..', 'ohhhhhho.', 'ohhhhhho.', 'ohhhhhho.', '.ohhhho..', '.oaaao...', '.oaaao...'];
  var HEROI_A = CORPO_HEROI.concat(['.oa.ao...', '.oo..oo..']);
  var HEROI_B = CORPO_HEROI.concat(['.oa.ao...', '..oo.o...']);
  var CORPO_PRINCESA = ['..s.s.s..', '.osssso..', '.ohhhho..', '.ohhhho..', '.ohhhho..', '.ohhhho..', '..ommo...', '.ommmmo..', '.ommmmo..', 'ommmmmmo.', 'ommmmmmo.', '.ommmmo..'];
  var PRINCESA_A = CORPO_PRINCESA.concat(['..o..o...']);
  var PRINCESA_B = CORPO_PRINCESA.concat(['.o....o..']);
  var CORACAO = ['.oo.oo.', 'ohhohho', 'ohhhhho', '.ohhho.', '..oho..', '...o...'];

  // ---------- Perguntas (mesma lista do original) ----------
  var PERGUNTAS = [
    { key: 'nome', kind: 'text', input: 'text', label: 'Qual é o seu nome completo?', hint: 'Como podemos te chamar.', placeholder: 'Nome completo', required: true },
    { key: 'whatsapp', kind: 'text', input: 'tel', label: 'Qual é o seu WhatsApp?', hint: 'Usamos para confirmar o seu Raio-X.', placeholder: '(00) 00000-0000', required: true },
    { key: 'email', kind: 'text', input: 'email', label: 'Qual é o seu melhor e-mail?', hint: 'Enviamos os detalhes por aqui.', placeholder: 'voce@empresa.com', required: true },
    { key: 'empresa', kind: 'text', input: 'text', label: 'Qual é o nome da sua empresa?', placeholder: 'Nome da empresa', required: true },
    { key: 'site', kind: 'text', input: 'url', label: 'Qual é o site da empresa?', hint: 'Opcional.', placeholder: 'https://', required: false },
    { key: 'instagram', kind: 'text', input: 'text', label: 'Qual é o Instagram da empresa?', hint: 'Opcional.', placeholder: '@perfil', required: false },
    { key: 'funcao', kind: 'choice', label: 'Qual é a sua função na empresa?', required: true, options: ['Dono(a) do negócio / CEO', 'Alta liderança (C-level)', 'Diretor(a)', 'Gerente', 'Colaborador(a)', 'Freelancer ou consultor(a)', 'Outro', 'Líder de uma equipe de marketing', 'Líder de uma equipe de vendas', 'Dono(a) de agência'] },
    { key: 'faturamento', kind: 'choice', label: 'Qual é o faturamento anual da empresa?', required: false, options: ['Menos de R$ 300.000', 'Entre R$ 300.001 e R$ 500.000', 'Entre R$ 501.000 e R$ 1.000.000', 'Entre R$ 1.000.001 e R$ 5.000.000', 'Acima de R$ 5.000.000'] },
    { key: 'investir', kind: 'choice', label: 'Você pretende investir em marketing, vendas, site ou growth nos próximos 3 a 6 meses?', required: false, options: ['Sim, já tenho orçamento disponível', 'Sim, mas ainda não tenho orçamento disponível', 'Talvez mais tarde', 'No momento não'] },
    { key: 'ajuda', kind: 'textarea', label: 'Como você acredita que a Soulstory pode te ajudar?', hint: 'Conte com as suas palavras.', placeholder: 'Escreva aqui...', required: false }
  ];

  // ---------- Estilos reutilizados (identicos ao original) ----------
  var ESTILO_OPCAO = 'display:flex; align-items:center; gap:14px; width:100%; box-sizing:border-box; padding:16px 18px; border-radius:13px; border:1px solid rgba(200,208,255,0.16); background:rgba(255,255,255,0.04); color:rgba(250,248,245,0.86); font-family:var(--font-sans); font-size:18px; font-weight:500; cursor:pointer; text-align:left; transition:border-color .18s ease, background .18s ease';
  var ESTILO_OPCAO_SEL = 'display:flex; align-items:center; gap:14px; width:100%; box-sizing:border-box; padding:16px 18px; border-radius:13px; border:1px solid var(--ss-periwinkle); background:rgba(142,159,238,0.18); color:var(--ss-cream); font-family:var(--font-sans); font-size:18px; font-weight:600; cursor:pointer; text-align:left; transition:border-color .18s ease, background .18s ease';
  var ESTILO_PONTO = 'width:19px; height:19px; border-radius:50%; border:2px solid rgba(200,208,255,0.4); background:transparent; flex:none; box-sizing:border-box';
  var ESTILO_PONTO_SEL = 'width:19px; height:19px; border-radius:50%; border:2px solid var(--ss-periwinkle); background:var(--ss-periwinkle); box-shadow:inset 0 0 0 3px rgba(20,19,38,0.85); flex:none; box-sizing:border-box';
  var ESTILO_INPUT = 'width:100%; box-sizing:border-box; padding:17px 20px; border-radius:15px; border:1px solid rgba(200,208,255,0.22); background:rgba(255,255,255,0.06); color:var(--ss-cream); color-scheme:dark; font-family:var(--font-sans); font-size:19px; outline:none; transition:border-color .2s ease, box-shadow .2s ease';
  var ESTILO_TEXTAREA = 'width:100%; box-sizing:border-box; padding:17px 20px; min-height:150px; resize:vertical; border-radius:15px; border:1px solid rgba(200,208,255,0.22); background:rgba(255,255,255,0.06); color:var(--ss-cream); color-scheme:dark; font-family:var(--font-sans); font-size:18px; line-height:1.5; outline:none; transition:border-color .2s ease, box-shadow .2s ease';
  var ESTILO_AVANCAR = 'background:var(--ss-periwinkle); color:#0C0B14; box-shadow:0 10px 26px -12px rgba(142,159,238,0.7); border:none; border-radius:13px; padding:15px 32px; font-family:var(--font-sans); font-weight:600; font-size:17px; cursor:pointer; transition:transform .15s ease, box-shadow .2s ease; white-space:nowrap';
  var ESTILO_AVANCAR_FINAL = 'background:#E9BE58; color:#0C0B14; box-shadow:0 12px 30px -12px rgba(233,190,88,0.65); border:none; border-radius:13px; padding:15px 32px; font-family:var(--font-sans); font-weight:600; font-size:17px; cursor:pointer; transition:transform .15s ease, box-shadow .2s ease; white-space:nowrap';

  // ---------- Estado ----------
  var estado = { aberto: false, passo: 0, enviado: false, enviando: false, id: '', form: {} };
  PERGUNTAS.forEach(function (q) { estado.form[q.key] = ''; });
  var filaParcial = Promise.resolve();  // encadeia os envios parciais, um de cada vez
  var raiz = null;            // container fixo do modal
  var botaoOrigem = null;     // quem abriu, para devolver o foco ao fechar
  var jogo = { ligado: false, raf: null, barril: null, proximo: 0, anteriorT: 0, pulou: false };
  var movimentoReduzido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function escaparHtml(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------- Montagem do modal ----------
  function htmlCabecalho() {
    return '' +
      '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding:26px 30px 0">' +
        '<div style="display:flex; flex-direction:column; gap:12px">' +
          '<div aria-label="Nó · StoryFunnels · um programa Soulstory" style="display:flex; align-items:center; gap:12px">' +
            '<img src="images/no-symbol-void.svg" alt="" style="width:34px; height:34px; flex:none; display:block">' +
            '<div style="font-size:32px; font-weight:400; line-height:0.9; letter-spacing:0.02em; color:var(--ss-cream)">NÓ</div>' +
            '<div style="width:1px; height:36px; background:var(--line-default-dark)"></div>' +
            '<div style="display:flex; flex-direction:column; gap:2px; text-align:left">' +
              '<div style="font-size:10px; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; color:var(--ss-periwinkle)">StoryFunnels</div>' +
              '<div style="font-family:var(--font-serif); font-style:italic; font-size:12px; color:var(--text-secondary-dark)">O cliente é o herói</div>' +
              '<div style="width:100%; height:1px; background:var(--line-default-dark); margin:2px 0"></div>' +
              '<div style="font-size:7px; font-weight:500; letter-spacing:0.22em; text-transform:uppercase; color:var(--text-tertiary-dark)">Um programa Soulstory</div>' +
            '</div>' +
          '</div>' +
          '<span style="font-family:var(--font-mono); font-size:11px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:rgba(250,248,245,0.55)">Raio-X de Marca · Gratuito · 45 min</span>' +
        '</div>' +
        '<button type="button" data-acao="fechar" aria-label="Fechar" style="width:38px; height:38px; border-radius:50%; border:1px solid rgba(250,248,245,0.18); background:rgba(250,248,245,0.06); color:var(--ss-cream); font-size:22px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; flex:none; transition:background .2s ease">×</button>' +
      '</div>';
  }

  function htmlJogo() {
    return '' +
      '<div style="padding:18px 30px 0">' +
        '<div style="margin-bottom:8px"><span data-papel="passo" style="font-family:var(--font-mono); font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ss-periwinkle)"></span></div>' +
        '<div style="position:relative; height:58px">' +
          '<div style="position:absolute; right:1px; bottom:5px; pointer-events:none">' + pix(PRINCESA, 2) + '</div>' +
          '<div data-papel="gorila" style="position:absolute; right:26px; bottom:1px; transform-origin:center bottom; transition:transform .6s ease, filter .6s ease; pointer-events:none">' + pix(GORILA, 3) + '</div>' +
          '<div data-papel="barril" style="position:absolute; bottom:8px; left:86%; opacity:0; transform:translateX(-50%); pointer-events:none"><div class="rx-spin">' + pix(BARRIL, 2) + '</div></div>' +
          '<div style="position:absolute; left:0; right:0; bottom:0; height:9px; border-radius:999px; background:rgba(250,248,245,0.14); overflow:hidden"><div data-papel="progresso" style="height:100%; border-radius:999px; background:linear-gradient(90deg, #8E9FEE, #8CC6FF); width:10%; transition:width .45s cubic-bezier(0.22,1,0.36,1)"></div></div>' +
          '<div data-papel="heroi-pos" style="position:absolute; bottom:9px; left:10%; transform:translateX(-50%); transition:left .45s cubic-bezier(0.22,1,0.36,1); pointer-events:none">' +
            '<div data-papel="heroi-pulo" style="filter:drop-shadow(0 1px 0 rgba(12,11,20,0.55))">' + pix(HEROI_MODAL, 2) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function htmlFormulario() {
    return '' +
      htmlCabecalho() +
      htmlJogo() +
      '<div style="margin-top:16px; background:#FFFFFF; padding:18px 30px; border-top:1px solid rgba(60,57,110,0.12); border-bottom:1px solid rgba(60,57,110,0.12)">' +
        '<p style="margin:0; font-family:var(--font-sans); font-size:16px; line-height:1.55; color:var(--text-secondary); text-wrap:pretty">As respostas abaixo vão ajudar o especialista Soulstory a realizar um <strong style="color:var(--ss-ink); font-weight:600">raio-x personalizado e exclusivo</strong> <span style="font-family:var(--font-serif); font-style:italic; color:var(--ss-indigo)">(leva apenas 2 minutos)</span>.</p>' +
      '</div>' +
      '<div class="raiox-scroll" style="flex:1; min-height:0; overflow-y:auto; padding:28px 30px 8px">' +
        '<div data-papel="pergunta"></div>' +
      '</div>' +
      '<div style="display:flex; align-items:center; justify-content:space-between; gap:14px; padding:18px 30px 26px; border-top:1px solid rgba(250,248,245,0.10)">' +
        '<button type="button" data-acao="voltar" style="background:none; border:none; color:rgba(250,248,245,0.6); font-family:var(--font-sans); font-size:16px; font-weight:500; cursor:pointer; padding:8px 2px; display:inline-flex; align-items:center; gap:6px; transition:color .2s ease">← Voltar</button>' +
        '<button type="button" data-acao="avancar" style="' + ESTILO_AVANCAR + '"></button>' +
      '</div>';
  }

  function htmlEnviado() {
    var coracoes = [
      { left: '30%', bottom: '62px', delay: '' },
      { left: '42%', bottom: '86px', delay: 'animation-delay:.8s' },
      { left: '56%', bottom: '70px', delay: 'animation-delay:.4s' },
      { left: '66%', bottom: '90px', delay: 'animation-delay:1.4s' }
    ].map(function (c) {
      return '<div class="rx-heart" style="position:absolute; left:' + c.left + '; bottom:' + c.bottom + ';' + c.delay + '">' + pix(CORACAO, 3) + '</div>';
    }).join('');
    return '' +
      '<div style="position:relative; padding:40px 40px 52px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px">' +
        '<div style="position:relative; width:100%; max-width:320px; height:164px; display:flex; align-items:flex-end; justify-content:center">' +
          coracoes +
          '<div class="rx-couple" style="position:relative; display:flex; align-items:flex-end">' +
            '<div style="position:relative; margin-right:-4px"><div class="rx-fa">' + pix(HEROI_A, 4) + '</div><div class="rx-fb" style="position:absolute; left:0; top:0">' + pix(HEROI_B, 4) + '</div></div>' +
            '<div style="position:relative; margin-left:-4px"><div class="rx-fa">' + pix(PRINCESA_A, 4) + '</div><div class="rx-fb" style="position:absolute; left:0; top:0">' + pix(PRINCESA_B, 4) + '</div></div>' +
            '<div style="position:absolute; left:50%; bottom:18px; transform:translateX(-50%); width:15px; height:6px; background:var(--ss-cream); border-radius:3px"></div>' +
          '</div>' +
        '</div>' +
        '<h3 style="margin:0; font-family:var(--font-sans); font-weight:700; font-size:31px; letter-spacing:-0.5px; color:var(--ss-cream)">Recebemos a sua solicitação.</h3>' +
        '<p style="margin:0; max-width:440px; font-family:var(--font-serif); font-style:italic; font-size:19px; line-height:1.6; color:rgba(250,248,245,0.72); text-wrap:pretty">Em breve a Soulstory entra em contato para confirmar o seu Raio-X de Marca gratuito.</p>' +
        '<button type="button" data-acao="fechar" style="margin-top:6px; background:var(--ss-periwinkle); color:#0C0B14; border:none; border-radius:12px; padding:15px 32px; font-family:var(--font-sans); font-weight:600; font-size:17px; cursor:pointer">Fechar</button>' +
      '</div>';
  }

  function montar() {
    raiz = document.createElement('div');
    raiz.setAttribute('data-modal-raiox', '');
    raiz.style.cssText = 'position:fixed; inset:0; z-index:120; display:flex; align-items:center; justify-content:center; padding:18px; font-family:var(--font-sans)';
    raiz.innerHTML = '' +
      '<div data-acao="fechar" style="position:absolute; inset:0; background:rgba(9,8,17,0.62); backdrop-filter:blur(7px); -webkit-backdrop-filter:blur(7px); animation:raioxFade .3s ease"></div>' +
      '<div role="dialog" aria-modal="true" aria-label="Agendar Raio-X de Marca" style="position:relative; width:min(680px, 100%); max-height:min(94vh, 960px); display:flex; flex-direction:column; border-radius:28px; overflow:hidden; background:rgba(20,19,38,0.55); backdrop-filter:blur(34px) saturate(180%); -webkit-backdrop-filter:blur(34px) saturate(180%); border:1px solid rgba(200,208,255,0.22); box-shadow:0 50px 130px -30px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.22); animation:raioxPop .44s cubic-bezier(0.22,1,0.36,1)">' +
        '<div aria-hidden="true" style="position:absolute; inset:0; pointer-events:none; background:radial-gradient(130% 92% at 12% -10%, rgba(255,255,255,0.16), rgba(255,255,255,0) 46%)"></div>' +
        '<div aria-hidden="true" style="position:absolute; top:-90px; right:-70px; width:270px; height:270px; border-radius:50%; background:rgba(142,159,238,0.30); filter:blur(72px); pointer-events:none"></div>' +
        '<div aria-hidden="true" style="position:absolute; bottom:-100px; left:-60px; width:250px; height:250px; border-radius:50%; background:rgba(140,198,255,0.16); filter:blur(78px); pointer-events:none"></div>' +
        '<div data-papel="conteudo" style="position:relative; display:flex; flex-direction:column; min-height:0; flex:1"></div>' +
      '</div>';
    document.body.appendChild(raiz);

    // clique: fechar (backdrop e botoes), voltar, avancar
    raiz.addEventListener('click', function (e) {
      var alvo = e.target.closest('[data-acao]');
      if (!alvo) return;
      var acao = alvo.getAttribute('data-acao');
      if (acao === 'fechar') fechar();
      if (acao === 'voltar') irPara(estado.passo - 1);
      if (acao === 'avancar') avancar();
      if (acao === 'opcao') escolher(alvo.getAttribute('data-valor'));
    });
  }

  // ---------- Renderizacao ----------
  function el(papel) { return raiz.querySelector('[data-papel="' + papel + '"]'); }

  function renderizar() {
    var conteudo = el('conteudo');
    if (estado.enviado) {
      conteudo.innerHTML = htmlEnviado();
      return;
    }
    conteudo.innerHTML = htmlFormulario();
    renderizarPasso(true);
  }

  function renderizarPasso(primeira) {
    var q = PERGUNTAS[estado.passo];
    var total = PERGUNTAS.length;
    var ultimo = estado.passo === total - 1;
    var valor = estado.form[q.key] || '';

    el('passo').textContent = 'Pergunta ' + (estado.passo + 1);
    var pct = ((estado.passo + 1) / total * 100).toFixed(1) + '%';
    el('progresso').style.width = pct;
    el('heroi-pos').style.left = pct;

    // gorila derrotado na ultima pergunta
    var gorila = el('gorila');
    gorila.style.transform = ultimo ? 'rotate(82deg) translateY(3px)' : '';
    gorila.style.filter = ultimo ? 'grayscale(0.7) opacity(0.5)' : '';

    var voltar = el('conteudo').querySelector('[data-acao="voltar"]');
    voltar.style.visibility = estado.passo > 0 ? 'visible' : 'hidden';
    var avancarBtn = el('conteudo').querySelector('[data-acao="avancar"]');
    avancarBtn.style.cssText = ultimo ? ESTILO_AVANCAR_FINAL : ESTILO_AVANCAR;
    avancarBtn.textContent = ultimo ? 'Agendar Raio-X Gratuito' : 'Continuar';

    var area = el('pergunta');
    var h = '<h3 style="margin:0 0 10px; font-family:var(--font-sans); font-weight:700; font-size:clamp(25px, 2.7vw, 33px); line-height:1.18; letter-spacing:-0.5px; color:var(--ss-cream); text-wrap:pretty">' + escaparHtml(q.label) + (q.required ? '<span style="color:var(--ss-periwinkle)"> *</span>' : '') + '</h3>';
    if (q.hint) h += '<p style="margin:0 0 24px; font-family:var(--font-serif); font-style:italic; font-size:18.5px; line-height:1.5; color:rgba(250,248,245,0.6)">' + escaparHtml(q.hint) + '</p>';
    if (q.kind === 'text') {
      h += '<input type="' + q.input + '" value="' + escaparHtml(valor) + '" placeholder="' + escaparHtml(q.placeholder || '') + '" class="raiox-field" data-papel="campo" style="' + ESTILO_INPUT + '">';
    } else if (q.kind === 'textarea') {
      h += '<textarea placeholder="' + escaparHtml(q.placeholder || '') + '" class="raiox-field" data-papel="campo" style="' + ESTILO_TEXTAREA + '">' + escaparHtml(valor) + '</textarea>';
    } else {
      h += '<div style="display:flex; flex-direction:column; gap:8px">' + q.options.map(function (opt) {
        var sel = valor === opt;
        return '<button type="button" data-acao="opcao" data-valor="' + escaparHtml(opt) + '" style="' + (sel ? ESTILO_OPCAO_SEL : ESTILO_OPCAO) + '"><span style="' + (sel ? ESTILO_PONTO_SEL : ESTILO_PONTO) + '"></span><span style="flex:1; text-align:left">' + escaparHtml(opt) + '</span></button>';
      }).join('') + '</div>';
    }
    h += '<div data-papel="erro" style="margin-top:16px; font-size:15px; font-weight:500; color:#F1A9A9; display:none"></div>';

    // entrada suave da pergunta (mesma transicao do original)
    area.style.cssText = 'opacity:0; transform:translateY(14px)';
    area.innerHTML = h;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      area.style.cssText = 'opacity:1; transform:translateY(0); transition:opacity .34s cubic-bezier(0.22,1,0.36,1), transform .34s cubic-bezier(0.22,1,0.36,1)';
      focarCampo();
    }); });

    var campo = area.querySelector('[data-papel="campo"]');
    if (campo) {
      campo.addEventListener('input', aoDigitar);
      if (q.kind === 'text') campo.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); avancar(); } });
      campo.addEventListener('focus', function () { campo.style.borderColor = 'var(--ss-periwinkle)'; campo.style.boxShadow = '0 0 0 3px rgba(142,159,238,0.28)'; });
      campo.addEventListener('blur', function () { campo.style.borderColor = 'rgba(200,208,255,0.22)'; campo.style.boxShadow = 'none'; });
    }
  }

  function focarCampo() {
    setTimeout(function () {
      if (!estado.aberto || !raiz) return;
      var campo = raiz.querySelector('[data-papel="campo"]');
      if (campo) { try { campo.focus(); } catch (e) {} }
    }, 90);
  }

  function mostrarErro(msg) {
    var erro = el('erro');
    if (erro) { erro.textContent = msg; erro.style.display = msg ? 'block' : 'none'; }
  }

  // ---------- Acoes ----------
  function aoDigitar(e) {
    var q = PERGUNTAS[estado.passo];
    var v = e.target.value;
    if (q.key === 'whatsapp') {
      var d = v.replace(/\D/g, '').slice(0, 11);
      v = d ? '(' + d.slice(0, 2) + (d.length >= 2 ? ') ' : '') + d.slice(2, 7) + (d.length > 7 ? '-' + d.slice(7, 11) : '') : '';
      e.target.value = v;
    }
    estado.form[q.key] = v;
    mostrarErro('');
  }

  function escolher(valor) {
    var q = PERGUNTAS[estado.passo];
    estado.form[q.key] = valor;
    mostrarErro('');
    renderizarPasso();
  }

  function irPara(passo) {
    estado.passo = passo;
    renderizarPasso();
  }

  function avancar() {
    var q = PERGUNTAS[estado.passo];
    var v = (estado.form[q.key] || '').trim();
    if (q.required && !v) { mostrarErro(q.kind === 'choice' ? 'Selecione uma opção para continuar.' : 'Este campo é obrigatório.'); return; }
    if (q.key === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { mostrarErro('Digite um e-mail válido.'); return; }
    if (estado.passo >= PERGUNTAS.length - 1) { enviar(); return; }
    // Depois das validacoes, para clique frustrado nao virar requisicao.
    enviarParcial();
    irPara(estado.passo + 1);
  }

  // Identificador da sessao de preenchimento. O mesmo id acompanha os parciais e
  // o envio completo, e e por ele que o Apps Script atualiza a linha em vez de
  // criar outra. Nasce so na primeira vez que ha algo real para enviar, entao
  // quem abre o modal e fecha sem responder nada nao gera registro nenhum.
  function garantirId() {
    if (!estado.id) {
      estado.id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    }
    return estado.id;
  }

  // Monta o objeto que vai para a planilha. As chaves dos campos saem da propria
  // lista de PERGUNTAS, entao a grafia esperada pelo Apps Script nunca sai de
  // sincronia. O que ainda nao foi respondido viaja como string vazia.
  function montarPayload(status) {
    var dados = { status: status, id: garantirId() };
    PERGUNTAS.forEach(function (q) {
      dados[q.key] = (estado.form[q.key] || '').trim();
    });
    // Na planilha o WhatsApp vai limpo, so os digitos, sem a mascara da tela.
    dados.whatsapp = dados.whatsapp.replace(/\D/g, '');
    return dados;
  }

  // Lead parcial: sai a cada pergunta vencida, para nao perder quem desiste no
  // meio do caminho. Roda em segundo plano e falha em silencio, porque e um
  // bonus de captacao e nunca deve atrapalhar quem esta preenchendo.
  function enviarParcial() {
    // O retrato e tirado agora, no clique, e nao na hora em que a requisicao
    // sair, para o payload refletir exatamente este passo.
    var corpo = JSON.stringify(montarPayload('parcial'));
    // A fila encadeia um envio depois do outro. Disparados em paralelo, dois
    // parciais podem chegar fora de ordem e o mais antigo sobrescrever o mais
    // novo na planilha. Nada disso esta no caminho da pessoa: ela ja avancou.
    filaParcial = filaParcial.then(function () {
      // keepalive faz a requisicao sobreviver ao fechamento da aba, que e
      // justamente quando o ultimo parcial vale mais.
      return fetch(URL_APPS_SCRIPT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: corpo,
        redirect: 'follow',
        keepalive: true
      });
    })['catch'](function () {
      // Silencio proposital: parcial que falha nao vira erro na tela.
    });
  }

  function enviar() {
    if (estado.enviando) return;

    var botao = el('conteudo').querySelector('[data-acao="avancar"]');
    estado.enviando = true;
    mostrarErro('');
    if (botao) {
      botao.disabled = true;
      botao.textContent = 'Enviando...';
      botao.style.opacity = '0.65';
      botao.style.cursor = 'progress';
    }

    function liberarBotao() {
      estado.enviando = false;
      if (botao) {
        botao.disabled = false;
        botao.textContent = 'Agendar Raio-X Gratuito';
        botao.style.opacity = '';
        botao.style.cursor = 'pointer';
      }
    }

    // O cabecalho vai como text/plain de proposito: declarar application/json faz
    // o navegador disparar antes uma requisicao de verificacao (preflight CORS),
    // que o Apps Script nao responde. O corpo continua sendo JSON puro, lido do
    // outro lado com JSON.parse(e.postData.contents).
    fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(montarPayload('completo')),
      redirect: 'follow'
    }).then(function (resposta) {
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
      pararJogo();
      estado.enviando = false;
      estado.enviado = true;
      renderizar();
    })['catch'](function () {
      liberarBotao();
      mostrarErro('Não foi possível enviar agora. Verifique a sua conexão e tente de novo.');
    });
  }

  function abrir(origem) {
    botaoOrigem = origem || null;
    if (!raiz) montar();
    estado.aberto = true;
    estado.passo = 0;
    estado.enviado = false;
    estado.enviando = false;
    estado.id = '';
    filaParcial = Promise.resolve();
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    raiz.style.display = 'flex';
    renderizar();
    iniciarJogo();
  }

  function fechar() {
    pararJogo();
    estado.aberto = false;
    try { document.body.style.overflow = ''; } catch (e) {}
    if (raiz) raiz.style.display = 'none';
    if (botaoOrigem) { try { botaoOrigem.focus(); } catch (e) {} }
  }

  // ---------- Mini-game do barril (nao roda com movimento reduzido) ----------
  function iniciarJogo() {
    if (movimentoReduzido) return;
    jogo.ligado = true;
    if (jogo.raf) return;
    jogo.barril = null;
    jogo.proximo = performance.now() + 2000;
    jogo.anteriorT = performance.now();
    var velocidade = 0.026;
    function laco(t) {
      jogo.raf = null;
      if (!jogo.ligado || estado.enviado) return;
      var dt = Math.min(48, t - jogo.anteriorT);
      jogo.anteriorT = t;
      var barrilEl = el('barril');
      var derrotado = estado.passo >= PERGUNTAS.length - 1;
      if (derrotado || !barrilEl) {
        jogo.barril = null;
        if (barrilEl) barrilEl.style.opacity = '0';
      } else {
        if (jogo.barril == null && t >= jogo.proximo) {
          jogo.barril = 86; jogo.proximo = t + 12000; jogo.pulou = false;
          barrilEl.style.opacity = '1';
        }
        if (jogo.barril != null) {
          jogo.barril -= velocidade * dt;
          barrilEl.style.left = jogo.barril + '%';
          var heroiPos = el('heroi-pos');
          if (heroiPos && !jogo.pulou) {
            var rb = barrilEl.getBoundingClientRect(), rh = heroiPos.getBoundingClientRect();
            var cb = rb.left + rb.width / 2, ch = rh.left + rh.width / 2;
            if (cb <= ch + 22 && cb >= ch - 10) { pular(); jogo.pulou = true; }
          }
          if (jogo.barril < -8) { jogo.barril = null; barrilEl.style.opacity = '0'; }
        }
      }
      jogo.raf = requestAnimationFrame(laco);
    }
    jogo.raf = requestAnimationFrame(laco);
  }

  function pararJogo() {
    jogo.ligado = false;
    if (jogo.raf) { cancelAnimationFrame(jogo.raf); jogo.raf = null; }
  }

  function pular() {
    var elPulo = el('heroi-pulo');
    if (!elPulo) return;
    elPulo.classList.remove('rx-jump');
    void elPulo.offsetWidth;
    elPulo.classList.add('rx-jump');
  }

  // ---------- Ligacao com a pagina ----------
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && estado.aberto) fechar();
  });

  // o unico botao que abre o modal e o de dentro da secao de investimento
  var abridor = document.querySelector('#investimento .sc-host[data-sc-name="RaioButton"] a');
  if (abridor) {
    abridor.addEventListener('click', function (e) {
      e.preventDefault();
      abrir(abridor);
    });
  }

  // mantem o evento original disponivel para outros gatilhos futuros
  window.addEventListener('soulstory:open-raiox', function () { abrir(null); });
})();
