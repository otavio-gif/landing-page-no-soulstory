// Modal do Raio-X de Marca, portado do runtime original para JavaScript puro.
// Abre pelo botao dentro da secao #investimento. Os demais botoes continuam
// rolando ate a secao por ancora nativa.
(function () {
  'use strict';

  // ---------- Backend ----------
  // Endpoint publico do Google Apps Script que grava na planilha e dispara o
  // email de aviso. E uma URL de publicacao, nao um segredo.
  var URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbym9ibB2-BCfY4l_2apbnYJX9o0zWaqniHPO_lGTsSiozSGvGETAB-hX69zwJcI84yr/exec';

  // ---------- Medicao (GTM / GA4) ----------
  // Sinalizacao para o GTM, nada mais. Nunca interfere no envio do lead ao
  // Apps Script, que funciona com ou sem consentimento de cookies.
  //
  // So empurra com aceite: sem consentimento nada entra no dataLayer, entao o
  // GTM nao encontra historico para contabilizar depois. Se o script de
  // consentimento nem carregou, a resposta e a mesma, nao medir.
  //
  // Nunca viaja dado pessoal daqui. Nome, WhatsApp, e-mail, empresa e
  // faturamento ficam no envio ao Apps Script e nao entram no dataLayer.
  function avisarGtm(evento, extras) {
    try {
      if (typeof window.soulstoryCookiesAceitos !== 'function') return;
      if (!window.soulstoryCookiesAceitos()) return;
      window.dataLayer = window.dataLayer || [];
      var dados = { event: evento };
      if (extras) {
        for (var chave in extras) {
          if (Object.prototype.hasOwnProperty.call(extras, chave)) dados[chave] = extras[chave];
        }
      }
      window.dataLayer.push(dados);
    } catch (e) {
      // Medicao nunca derruba o formulario.
    }
  }

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
    // Obrigatoria, com uma saida para quem ainda nao tem site: a alternativa
    // abaixo do campo responde por ela e avanca sozinha, como uma escolha
    { key: 'site', kind: 'text', input: 'url', label: 'Qual é o site da empresa?', placeholder: 'https://', required: true, alternativa: 'Não tenho site ainda', avancoAuto: true },
    { key: 'instagram', kind: 'text', input: 'text', label: 'Qual é o Instagram da empresa?', hint: 'Opcional.', placeholder: '@perfil', required: false },
    { key: 'funcao', kind: 'choice', avancoAuto: true, label: 'Qual é a sua função na empresa?', required: true, options: ['Dono(a) do negócio / CEO', 'Diretor(a)', 'Gerente', 'Colaborador(a)', 'Freelancer ou consultor(a)', 'Outro'] },
    { key: 'faturamento', kind: 'choice', avancoAuto: true, label: 'Qual é o faturamento anual da empresa?', required: false, options: ['Menos de R$ 300.000', 'Entre R$ 300.001 e R$ 500.000', 'Entre R$ 501.000 e R$ 1.000.000', 'Entre R$ 1.000.001 e R$ 5.000.000', 'Acima de R$ 5.000.000'] },
    { key: 'investir', kind: 'choice', avancoAuto: true, label: 'Você pretende investir em marketing, vendas, site ou growth nos próximos 3 a 6 meses?', required: false, options: ['Sim, já tenho orçamento disponível', 'Sim, mas ainda não tenho orçamento disponível', 'Talvez mais tarde', 'No momento não'] },
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
  // Versao compacta do Continuar, para caber ao lado do campo no celular
  var ESTILO_AVANCAR_CAMPO = 'flex:none; background:var(--ss-periwinkle); color:#0C0B14; box-shadow:0 10px 26px -12px rgba(142,159,238,0.7); border:none; border-radius:13px; padding:0 16px; font-family:var(--font-sans); font-weight:600; font-size:17px; cursor:pointer; transition:transform .15s ease, box-shadow .2s ease; white-space:nowrap';
  var ESTILO_AVANCAR_FINAL = 'background:#E9BE58; color:#0C0B14; box-shadow:0 12px 30px -12px rgba(233,190,88,0.65); border:none; border-radius:13px; padding:15px 32px; font-family:var(--font-sans); font-weight:600; font-size:17px; cursor:pointer; transition:transform .15s ease, box-shadow .2s ease; white-space:nowrap';

  // ---------- Avisos de privacidade (LGPD) ----------
  // O link abre em nova aba de proposito. O que a pessoa ja preencheu vive so
  // na memoria, em estado.form, entao sair da pagina apagaria tudo. Com aba
  // nova, o modal continua intacto atras, na mesma pergunta.
  var LINK_POLITICA = '<a href="/politica-de-privacidade" target="_blank" rel="noopener">Política de Privacidade</a>';
  var ESTILO_AVISO = 'margin:20px 0 0; font-family:var(--font-sans); font-size:14px; line-height:1.5; color:var(--text-tertiary-dark); text-wrap:pretty';

  function htmlAviso(texto) {
    return '<p class="raiox-aviso" style="' + ESTILO_AVISO + '">' + texto + '</p>';
  }

  // ---------- Estado ----------
  var estado = { aberto: false, passo: 0, enviado: false, id: '', form: {} };
  PERGUNTAS.forEach(function (q) { estado.form[q.key] = ''; });
  var filaParcial = Promise.resolve();  // encadeia os envios parciais, um de cada vez
  var timerAuto = null;       // avanco automatico pendente nas perguntas de escolha
  var timerEspera = null;     // troca da tela de espera pelo agradecimento
  var raiz = null;            // container fixo do modal
  var botaoOrigem = null;     // quem abriu, para devolver o foco ao fechar
  var jogo = { ligado: false, raf: null, barril: null, proximo: 0, anteriorT: 0, pulou: false };
  var movimentoReduzido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function escaparHtml(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------- Montagem do modal ----------
  var ESTILO_FECHAR = 'width:38px; height:38px; border-radius:50%; border:1px solid rgba(250,248,245,0.18); background:rgba(250,248,245,0.06); color:var(--ss-cream); font-size:22px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; flex:none; transition:background .2s ease';

  function htmlCabecalho() {
    return '' +
      '<div data-papel="cabecalho" style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding:26px 30px 0">' +
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
        '<button type="button" data-acao="fechar" aria-label="Fechar" style="' + ESTILO_FECHAR + '">×</button>' +
      '</div>';
  }

  function htmlJogo() {
    return '' +
      '<div data-papel="jogo" style="padding:18px 30px 0">' +
        '<div data-papel="linha-passo" style="margin-bottom:8px"><span data-papel="passo" style="font-family:var(--font-mono); font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ss-periwinkle)"></span>' +
          // Fechar da pergunta 2 em diante, quando o cabecalho sai de cena
          '<button type="button" data-acao="fechar" aria-label="Fechar" data-papel="fechar-compacto" style="' + ESTILO_FECHAR + '; display:none">×</button>' +
        '</div>' +
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
      '<div data-papel="faixa" style="margin-top:16px; background:#FFFFFF; padding:18px 30px; border-top:1px solid rgba(60,57,110,0.12); border-bottom:1px solid rgba(60,57,110,0.12)">' +
        '<p style="margin:0; font-family:var(--font-sans); font-size:16px; line-height:1.55; color:var(--text-secondary); text-wrap:pretty">As respostas abaixo vão ajudar o especialista Soulstory a realizar um <strong style="color:var(--ss-ink); font-weight:600">raio-x personalizado e exclusivo</strong> <span style="font-family:var(--font-serif); font-style:italic; color:var(--ss-indigo)">(leva apenas 2 minutos)</span>.</p>' +
      '</div>' +
      '<div class="raiox-scroll" style="flex:1; min-height:0; overflow-y:auto; padding:28px 30px 8px">' +
        '<div data-papel="pergunta"></div>' +
      '</div>' +
      '<div data-papel="rodape" style="display:flex; align-items:center; justify-content:space-between; gap:14px; padding:18px 30px 26px; border-top:1px solid rgba(250,248,245,0.10)">' +
        '<button type="button" data-acao="voltar" style="background:none; border:none; color:rgba(250,248,245,0.6); font-family:var(--font-sans); font-size:16px; font-weight:500; cursor:pointer; padding:8px 2px; display:inline-flex; align-items:center; gap:6px; transition:color .2s ease">← Voltar</button>' +
        '<button type="button" data-acao="avancar" data-papel="avancar" style="' + ESTILO_AVANCAR + '"></button>' +
      '</div>';
  }

  // ---------- Telas do fim (espera e agradecimento) ----------
  // As duas dividem a mesma moldura, para a troca entre elas nao mudar o desenho.
  var ESTILO_TELA_FINAL = 'position:relative; padding:40px 40px 52px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px';
  var ESTILO_CENA_FINAL = 'position:relative; width:100%; max-width:320px; height:164px; display:flex; align-items:flex-end; justify-content:center';
  var ESTILO_TITULO_FINAL = 'margin:0; font-family:var(--font-sans); font-weight:700; font-size:31px; letter-spacing:-0.5px; color:var(--ss-cream)';
  var ESTILO_TEXTO_FINAL = 'margin:0; max-width:440px; font-family:var(--font-serif); font-style:italic; font-size:19px; line-height:1.6; color:rgba(250,248,245,0.72); text-wrap:pretty';

  var TEMPO_DE_ESPERA = 2000;        // quanto a tela de espera fica aberta
  var DURACAO_CAMINHADA = 1800;      // o encontro acontece um pouco antes da troca
  // Ponto de encontro: o mesmo do casal da tela final, centralizado, com 4px de
  // sobreposicao de cada lado (36px cada personagem, 64px o par)
  var FIM_DA_CAMINHADA = 'calc(50% - 32px)';
  // Cada metade da barra passa 1px do centro: com 50% exatos, a emenda cai
  // entre dois pixels no celular e aparece um risco escuro no meio
  var METADE_DA_BARRA = 'calc(50% + 1px)';

  // Dois quadros alternados fazem o personagem andar (as classes ja param
  // sozinhas com movimento reduzido)
  function andando(quadroA, quadroB) {
    return '<div class="rx-fa">' + pix(quadroA, 4) + '</div><div class="rx-fb" style="position:absolute; left:0; top:0">' + pix(quadroB, 4) + '</div>';
  }

  // Tela de espera: o heroi e a princesa saem das pontas da barra e se
  // encontram no centro, e a barra enche das duas pontas para o meio
  // acompanhando cada um. Quando eles se encontram, entra o casal da tela de
  // agradecimento no mesmo lugar. Com movimento reduzido, a cena ja nasce no
  // fim, parada.
  function htmlEspera() {
    var parado = movimentoReduzido;
    var heroi = parado ? pix(HEROI_A, 4) : andando(HEROI_A, HEROI_B);
    var princesa = parado ? pix(PRINCESA_A, 4) : andando(PRINCESA_A, PRINCESA_B);
    var inicio = parado ? FIM_DA_CAMINHADA : '0px';
    var metade = parado ? METADE_DA_BARRA : '0%';
    var transicao = DURACAO_CAMINHADA + 'ms var(--ease-out)';
    var estiloMetade = 'position:absolute; top:0; bottom:0; width:' + metade + '; background:var(--ss-periwinkle); transition:width ' + transicao;
    return '' +
      // Centralizada na vertical: a tela tem a altura do agradecimento, mais
      // alto, e com o conteudo no topo sobrava um vazio grande embaixo
      '<div data-papel="tela-espera" role="status" style="grid-area:1 / 1; ' + ESTILO_TELA_FINAL + '; justify-content:center">' +
        '<div style="' + ESTILO_CENA_FINAL + '">' +
          '<div style="position:relative; width:100%; height:66px">' +
            '<div data-papel="espera-heroi" style="position:absolute; bottom:9px; left:' + inicio + '; transition:left ' + transicao + '">' + heroi + '</div>' +
            '<div data-papel="espera-princesa" style="position:absolute; bottom:9px; right:' + inicio + '; transition:right ' + transicao + '">' + princesa + '</div>' +
            '<div style="position:absolute; left:0; right:0; bottom:0; height:9px; border-radius:var(--r-sm); background:rgba(250,248,245,0.14); overflow:hidden">' +
              '<div data-papel="espera-barra-esq" style="left:0; ' + estiloMetade + '"></div>' +
              '<div data-papel="espera-barra-dir" style="right:0; ' + estiloMetade + '"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<h3 style="' + ESTILO_TITULO_FINAL + '">Aguarde um momento.</h3>' +
        '<p style="' + ESTILO_TEXTO_FINAL + '">Seus dados estão sendo processados.</p>' +
      '</div>';
  }

  var ESTILO_BOTAO_FINAL = 'max-width:100%; background:var(--ss-periwinkle); color:#0C0B14; border:none; border-radius:12px; padding:15px 32px; font-family:var(--font-sans); font-weight:600; font-size:17px; line-height:1.3; cursor:pointer';
  var ESTILO_BOTAO_AGENDAR = 'display:inline-block; max-width:100%; box-sizing:border-box; background:' + PALETA.g + '; color:#0C0B14; text-decoration:none; border-radius:12px; padding:16px 40px; font-family:var(--font-sans); font-weight:700; font-size:18px; line-height:1.3; cursor:pointer; box-shadow:0 0 0 1px rgba(233,190,88,0.5), 0 6px 22px -8px rgba(233,190,88,0.5); transition:transform .16s cubic-bezier(0.22,1,0.36,1), box-shadow .16s cubic-bezier(0.22,1,0.36,1)';
  var URL_AGENDA = 'https://agenda-raio-x.soulstory.com.br/';
  var ESTILO_CONTADOR ='font-family:var(--font-mono); font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ss-periwinkle)';
  var ESTILO_TITULO_ENTREGAVEL = 'margin:0; font-family:var(--font-sans); font-weight:700; font-size:26px; line-height:1.2; letter-spacing:-0.4px; color:var(--ss-cream); text-wrap:balance';
  var ESTILO_ROTULO_BARRA = 'font-family:var(--font-mono); font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:rgba(250,248,245,0.6)';
  var ESTILO_NOTA_FINAL = 'margin:0; max-width:440px; font-family:var(--font-sans); font-size:15px; line-height:1.5; color:rgba(250,248,245,0.6); text-wrap:pretty';
  var ESTILO_AVISO_WHATSAPP = 'margin:0; padding:14px 18px; border-radius:var(--r-lg); background:rgba(142,159,238,0.12); border:1px solid rgba(142,159,238,0.35); font-family:var(--font-sans); font-size:17px; font-weight:500; line-height:1.5; color:var(--ss-cream); text-wrap:pretty';

  // Os quatro entregaveis do Raio-X, na ordem do cartao da oferta, com o mesmo
  // mockup que aparece la
  var ENTREGAVEIS = [
    { imagem: 'diag-mock-1', titulo: 'Análise estratégica do seu funil de vendas', texto: 'Veja onde o seu funil de vendas está perdendo dinheiro, e pare de perder vendas.' },
    { imagem: 'diag-mock-2', titulo: 'Análise estratégica da mensagem', texto: 'Descubra o que o cliente entende quando você fala, e o que dizer pra ele escolher você (pagando mais caro).' },
    { imagem: 'diag-mock-3', titulo: 'Análise estratégica da oferta', texto: 'Entenda por que o cliente pede desconto, e como vender sem baixar o preço, mesmo sendo mais caro que os concorrentes.' },
    { imagem: 'diag-mock-4', titulo: 'Plano de ação aplicável em até 28 dias', texto: 'Saia sabendo o que fazer amanhã cedo, e em que ordem, pra aplicar tudo em até 28 dias.' }
  ];
  var AVISO_WHATSAPP = 'Olhe o seu WhatsApp, nossa equipe mandou o link para você agendar o seu ' + semQuebra('raio-x') + '.';

  // Mantem a palavra inteira na mesma linha: sem isso, "raio-x" quebrava no
  // hifen, com "raio-" numa linha e "x" na outra
  function semQuebra(texto) {
    return '<span style="white-space:nowrap">' + texto + '</span>';
  }

  // X discreto no canto das telas do fim, no mesmo desenho do X do formulario
  function htmlFecharCanto() {
    return '<button type="button" data-acao="fechar" aria-label="Fechar" style="' + ESTILO_FECHAR + '; position:absolute; top:20px; right:20px">×</button>';
  }

  // Uma tela por entregavel: contador, mockup, titulo, texto e o botao que
  // segue. A ultima traz o aviso do WhatsApp e fecha o modal. O botao fica
  // sempre no pe da tela, no mesmo lugar, para o dedo nao precisar procurar.
  function htmlEntregavel(item, i) {
    var ultimo = i === ENTREGAVEIS.length - 1;
    var botao = ultimo
      ? '<button type="button" data-acao="fechar" data-principal="" style="' + ESTILO_BOTAO_FINAL + '; margin-top:auto">Fechar</button>'
      : '<button type="button" data-acao="entregavel-proximo" data-principal="" style="' + ESTILO_BOTAO_FINAL + '; margin-top:auto">Próximo</button>';
    return '' +
      '<div data-papel="entregavel-' + (i + 1) + '" aria-hidden="true" style="grid-area:1 / 1; visibility:hidden; opacity:0; ' + ESTILO_TELA_FINAL + '">' +
        htmlFecharCanto() +
        '<span style="' + ESTILO_CONTADOR + '">' + (i + 1) + '/' + ENTREGAVEIS.length + '</span>' +
        '<div style="width:100%; max-width:220px; box-sizing:border-box; padding:9px; border-radius:var(--r-lg); background:var(--ss-warm-veil)">' +
          '<picture><source type="image/webp" srcset="images/' + item.imagem + '.webp"><img src="images/' + item.imagem + '.png" alt="" width="600" height="475" decoding="async" style="width:100%; height:auto; display:block"></picture>' +
        '</div>' +
        '<h3 style="' + ESTILO_TITULO_ENTREGAVEL + '">' + item.titulo + '</h3>' +
        '<p style="' + ESTILO_TEXTO_FINAL + '">' + item.texto + '</p>' +
        (ultimo ? '<p style="' + ESTILO_AVISO_WHATSAPP + '">' + AVISO_WHATSAPP + '</p>' : '') +
        botao +
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
    // Nasce escondida, no mesmo lugar da tela de espera. Assim o modal ja tem
    // a altura final desde o primeiro instante e nao pula na troca.
    return '' +
      '<div data-papel="tela-obrigado" aria-hidden="true" style="grid-area:1 / 1; visibility:hidden; opacity:0; ' + ESTILO_TELA_FINAL + '">' +
        '<div style="' + ESTILO_CENA_FINAL + '">' +
          coracoes +
          '<div class="rx-couple" style="position:relative; display:flex; align-items:flex-end">' +
            '<div style="position:relative; margin-right:-4px"><div class="rx-fa">' + pix(HEROI_A, 4) + '</div><div class="rx-fb" style="position:absolute; left:0; top:0">' + pix(HEROI_B, 4) + '</div></div>' +
            '<div style="position:relative; margin-left:-4px"><div class="rx-fa">' + pix(PRINCESA_A, 4) + '</div><div class="rx-fb" style="position:absolute; left:0; top:0">' + pix(PRINCESA_B, 4) + '</div></div>' +
            '<div style="position:absolute; left:50%; bottom:18px; transform:translateX(-50%); width:15px; height:6px; background:var(--ss-cream); border-radius:3px"></div>' +
          '</div>' +
        '</div>' +
        '<h3 style="' + ESTILO_TITULO_FINAL + '">Falta apenas um passo para concluir</h3>' +
        // Barra quase cheia: o que falta e agendar a call. O vermelho e o mesmo
        // do barril do joguinho (PALETA.r), fechado e de saturacao contida. A
        // barra e o centro da tela: numero grande em cima e trilho mais grosso,
        // porque sozinha ela tem pouco contraste sobre o fundo escuro.
        '<div style="width:100%; max-width:400px; margin:4px 0 2px">' +
          '<div style="display:flex; align-items:baseline; justify-content:space-between; gap:12px; margin-bottom:10px">' +
            '<span style="font-family:var(--font-sans); font-weight:700; font-size:36px; line-height:1; letter-spacing:-0.5px; color:var(--ss-cream)">93%</span>' +
            '<span style="' + ESTILO_ROTULO_BARRA + '; color:rgba(250,248,245,0.78)">Concluído</span>' +
          '</div>' +
          '<div role="progressbar" aria-valuenow="93" aria-valuemin="0" aria-valuemax="100" aria-label="Agendamento do raio-x" style="height:16px; border-radius:var(--r-sm); background:rgba(250,248,245,0.14); box-shadow:inset 0 0 0 1px rgba(250,248,245,0.12); overflow:hidden">' +
            '<div style="width:93%; height:100%; border-radius:var(--r-sm); background:' + PALETA.r + '"></div>' +
          '</div>' +
        '</div>' +
        '<p style="' + ESTILO_TEXTO_FINAL + '">Agende a Call de ' + semQuebra('Raio-X') + ' no botão abaixo.</p>' +
        // O botao leva para a agenda, em outra aba, para o modal continuar aqui.
        // O dourado (PALETA.g) e o mesmo do botao principal da pagina e fica no
        // lado oposto do periwinkle no circulo de cores. Para sair do modal
        // continua havendo o X do canto, a tecla Esc e o clique fora.
        '<a href="' + URL_AGENDA + '" target="_blank" rel="noopener" style="' + ESTILO_BOTAO_AGENDAR + '; margin-top:6px">Agendar ' + semQuebra('Raio-X') + '</a>' +
        '<p style="' + ESTILO_NOTA_FINAL + '">O ' + semQuebra('Raio-X') + ' é personalizado para a situação ATUAL do seu negócio, por isso a call é fundamental para o diagnóstico.</p>' +
        htmlFecharCanto() +
      '</div>';
  }

  function montar() {
    raiz = document.createElement('div');
    raiz.setAttribute('data-modal-raiox', '');
    raiz.style.cssText = 'position:fixed; inset:0; z-index:120; display:flex; align-items:center; justify-content:center; padding:18px; font-family:var(--font-sans)';
    // overflow:clip no dialogo: o circulo desfocado do canto passa 70px da borda
    // direita, e com overflow:hidden o navegador ainda rolava o dialogo para o
    // lado ao focar um campo, deslocando todo o conteudo no celular. O clip
    // corta igual e nao deixa rolar. Navegador antigo sem clip fica no hidden.
    raiz.innerHTML = '' +
      '<div data-acao="fechar" style="position:absolute; inset:0; background:rgba(9,8,17,0.62); backdrop-filter:blur(7px); -webkit-backdrop-filter:blur(7px); animation:raioxFade .3s ease"></div>' +
      '<div role="dialog" aria-modal="true" aria-label="Agendar Raio-X de Marca" style="position:relative; width:min(680px, 100%); max-height:min(94vh, 960px); display:flex; flex-direction:column; border-radius:28px; overflow:hidden; overflow:clip; background:rgba(20,19,38,0.55); backdrop-filter:blur(34px) saturate(180%); -webkit-backdrop-filter:blur(34px) saturate(180%); border:1px solid rgba(200,208,255,0.22); box-shadow:0 50px 130px -30px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.22); animation:raioxPop .44s cubic-bezier(0.22,1,0.36,1)">' +
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
      if (acao === 'ver-entregaveis') mostrarEntregaveis();
      if (acao === 'entregavel-proximo') proximoEntregavel(alvo);
    });
  }

  // ---------- Renderizacao ----------
  function el(papel) { return raiz.querySelector('[data-papel="' + papel + '"]'); }

  function renderizar() {
    var conteudo = el('conteudo');
    if (estado.enviado) {
      // As duas telas do fim ocupam a mesma celula da grade, uma sobre a outra
      // Em tela baixa, a grade rola por dentro, para o botao do pe nunca sumir
      conteudo.innerHTML = '<div class="raiox-scroll" style="display:grid; min-height:0; overflow-y:auto">' + htmlEspera() + htmlEnviado() + '</div>';
      iniciarEspera();
      return;
    }
    conteudo.innerHTML = htmlFormulario();
    renderizarPasso(true);
  }

  // Poe o casal para andar e, passado o tempo de espera, revela o agradecimento
  function iniciarEspera() {
    clearTimeout(timerEspera);
    if (!movimentoReduzido) {
      // Dois quadros de folga para o navegador desenhar a posicao inicial antes
      // da final. Sem isso a transicao nao acontece.
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        var heroi = el('espera-heroi');
        var princesa = el('espera-princesa');
        var barraEsq = el('espera-barra-esq');
        var barraDir = el('espera-barra-dir');
        if (heroi) heroi.style.left = FIM_DA_CAMINHADA;
        if (princesa) princesa.style.right = FIM_DA_CAMINHADA;
        if (barraEsq) barraEsq.style.width = METADE_DA_BARRA;
        if (barraDir) barraDir.style.width = METADE_DA_BARRA;
      }); });
    }
    timerEspera = setTimeout(revelarObrigado, TEMPO_DE_ESPERA);
  }

  // Troca uma tela do fim por outra com um fade curto. As duas dividem a mesma
  // celula da grade, entao o modal nao muda de tamanho.
  // A tela que sai so se esconde no fim do fade. A que entra fica visivel na
  // hora (sem transicao de visibility) e aparece pela opacidade, para o botao
  // dela ja poder receber o foco.
  function trocarTela(de, para) {
    var fade = 'opacity var(--dur-base) var(--ease-out)';
    de.style.transition = movimentoReduzido ? 'none' : fade + ', visibility var(--dur-base)';
    para.style.transition = movimentoReduzido ? 'none' : fade;
    de.style.opacity = '0';
    de.style.visibility = 'hidden';
    de.setAttribute('aria-hidden', 'true');
    para.style.opacity = '1';
    para.style.visibility = 'visible';
    para.removeAttribute('aria-hidden');
  }

  // "Veja o que voce vai receber": os entregaveis entram na mesma grade, um por
  // tela, e o agradecimento sai
  function mostrarEntregaveis() {
    var obrigado = el('tela-obrigado');
    if (!obrigado || el('entregavel-1')) return;
    obrigado.parentNode.insertAdjacentHTML('beforeend', ENTREGAVEIS.map(htmlEntregavel).join(''));
    irParaTela(obrigado, el('entregavel-1'));
    // O agradecimento sai de cena na hora: ele e a tela mais alta, e os
    // entregaveis, que dividem a mesma celula da grade, herdariam a altura dele
    obrigado.style.display = 'none';
  }

  function proximoEntregavel(botao) {
    var atual = botao.closest('[data-papel^="entregavel-"]');
    var n = Number(atual.getAttribute('data-papel').split('-')[1]);
    var seguinte = el('entregavel-' + (n + 1));
    if (seguinte) irParaTela(atual, seguinte);
  }

  // Troca de tela por clique: o foco do teclado vai junto, para o botao
  // principal da tela nova, em vez de se perder no botao que sumiu. O foco
  // espera dois quadros: no instante da troca a tela nova ainda esta no comeco
  // da transicao de visibility, contada como escondida, e o navegador recusa o
  // foco (inclusive com movimento reduzido, que encurta mas nao zera as transicoes)
  function irParaTela(de, para) {
    trocarTela(de, para);
    var principal = para.querySelector('[data-principal]');
    if (!principal) return;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      if (!estado.aberto || para.getAttribute('aria-hidden') === 'true') return;
      try { principal.focus({ preventScroll: true }); } catch (e) {}
    }); });
  }

  function revelarObrigado() {
    timerEspera = null;
    var espera = el('tela-espera');
    var obrigado = el('tela-obrigado');
    if (!espera || !obrigado) return;
    trocarTela(espera, obrigado);

    // Terminada a troca, a tela de espera sai de cena de vez, e com ela os
    // quadros de caminhada que seguiriam rodando escondidos. A tela final e a
    // mais alta das duas, entao o modal nao muda de tamanho.
    if (movimentoReduzido) {
      espera.style.display = 'none';
    } else {
      espera.addEventListener('transitionend', function sumir(e) {
        if (e.target !== espera) return;
        espera.removeEventListener('transitionend', sumir);
        espera.style.display = 'none';
      });
    }
  }

  function renderizarPasso(primeira) {
    var q = PERGUNTAS[estado.passo];
    var total = PERGUNTAS.length;
    var ultimo = estado.passo === total - 1;
    var valor = estado.form[q.key] || '';

    // Da segunda pergunta em diante, o topo fica so com a barra de progresso: o
    // logo e a faixa branca de apresentacao ja cumpriram o papel na primeira.
    // O fechar desce para a linha da "Pergunta N", no mesmo ponto da tela em
    // que estava (26px do topo, 30px da direita).
    var compacto = estado.passo > 0;
    el('cabecalho').style.display = compacto ? 'none' : 'flex';
    el('faixa').style.display = compacto ? 'none' : 'block';
    el('jogo').style.paddingTop = compacto ? '26px' : '18px';
    el('linha-passo').style.cssText = compacto
      ? 'display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:8px'
      : 'margin-bottom:8px';
    el('fechar-compacto').style.display = compacto ? 'flex' : 'none';

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
    var rotuloAvancar = ultimo ? 'Agendar Raio-X Gratuito' : 'Continuar';
    var avancarBtn = el('avancar');
    avancarBtn.style.cssText = ultimo ? ESTILO_AVANCAR_FINAL : ESTILO_AVANCAR;
    avancarBtn.textContent = rotuloAvancar;

    // O responsivo.css usa estas marcas para, no celular, trocar o botao do
    // rodape pelo botao junto do campo
    el('conteudo').setAttribute('data-tipo', q.kind);
    if (estado.passo === 0) el('conteudo').setAttribute('data-primeira', '');
    else el('conteudo').removeAttribute('data-primeira');

    var area = el('pergunta');
    var h = '<h3 style="margin:0 0 10px; font-family:var(--font-sans); font-weight:700; font-size:clamp(25px, 2.7vw, 33px); line-height:1.18; letter-spacing:-0.5px; color:var(--ss-cream); text-wrap:pretty">' + escaparHtml(q.label) + (q.required ? '<span style="color:var(--ss-periwinkle)"> *</span>' : '') + '</h3>';
    if (q.hint) h += '<p style="margin:0 0 24px; font-family:var(--font-serif); font-style:italic; font-size:18.5px; line-height:1.5; color:rgba(250,248,245,0.6)">' + escaparHtml(q.hint) + '</p>';
    // No celular o teclado cobre o rodape, entao nas perguntas de texto o
    // Continuar tambem vem ao lado do campo. Ele so aparece no celular
    // (responsivo.css, secao 7). O campo grande da ultima pergunta nao tem
    // espaco ao lado, e embaixo dele o botao ficava cortado pela altura do
    // modal, entao ali o botao segue no rodape.
    if (q.kind === 'text') {
      h += '<div style="display:flex; gap:8px; align-items:stretch">' +
        '<input type="' + q.input + '" value="' + escaparHtml(q.alternativa && valor === q.alternativa ? '' : valor) + '" placeholder="' + escaparHtml(q.placeholder || '') + '" class="raiox-field" data-papel="campo" style="' + ESTILO_INPUT + '; min-width:0; flex:1 1 auto">' +
        '<button type="button" data-acao="avancar" class="raiox-avancar-campo" style="' + ESTILO_AVANCAR_CAMPO + '">' + rotuloAvancar + '</button>' +
      '</div>';
      if (q.alternativa) {
        var marcada = valor === q.alternativa;
        h += '<button type="button" data-acao="opcao" data-valor="' + escaparHtml(q.alternativa) + '" data-papel="alternativa" style="' + (marcada ? ESTILO_OPCAO_SEL : ESTILO_OPCAO) + '; margin-top:12px">' +
          '<span style="' + (marcada ? ESTILO_PONTO_SEL : ESTILO_PONTO) + '"></span><span style="flex:1; text-align:left">' + escaparHtml(q.alternativa) + '</span>' +
        '</button>';
      }
    } else if (q.kind === 'textarea') {
      h += '<textarea placeholder="' + escaparHtml(q.placeholder || '') + '" class="raiox-field" data-papel="campo" style="' + ESTILO_TEXTAREA + '">' + escaparHtml(valor) + '</textarea>';
    } else {
      h += '<div style="display:flex; flex-direction:column; gap:8px">' + q.options.map(function (opt) {
        var sel = valor === opt;
        return '<button type="button" data-acao="opcao" data-valor="' + escaparHtml(opt) + '" style="' + (sel ? ESTILO_OPCAO_SEL : ESTILO_OPCAO) + '"><span style="' + (sel ? ESTILO_PONTO_SEL : ESTILO_PONTO) + '"></span><span style="flex:1; text-align:left">' + escaparHtml(opt) + '</span></button>';
      }).join('') + '</div>';
    }
    h += '<div data-papel="erro" style="margin-top:16px; font-size:15px; font-weight:500; color:#F1A9A9; display:none"></div>';

    // Transparencia LGPD. Na entrada, porque o lead parcial ja sai no primeiro
    // Continuar. No fim, junto do botao que envia de vez. As telas do meio
    // ficam limpas, para o aviso nao virar ruido nas dez perguntas.
    if (estado.passo === 0) {
      h += htmlAviso('Seus dados são tratados conforme nossa ' + LINK_POLITICA + '.');
    } else if (ultimo) {
      h += htmlAviso('Ao enviar, você concorda com nossa ' + LINK_POLITICA + '.');
    }

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
    var alternativa = el('alternativa');
    if (alternativa) {
      alternativa.style.cssText = ESTILO_OPCAO + '; margin-top:12px';
      alternativa.firstChild.style.cssText = ESTILO_PONTO;
    }
  }

  function escolher(valor) {
    var q = PERGUNTAS[estado.passo];
    estado.form[q.key] = valor;
    mostrarErro('');
    renderizarPasso();
    // Nas perguntas de escolha unica, selecionar ja avanca: clicar em Continuar
    // depois nao acrescenta nada. A pausa curta (mesma duracao media do design
    // system) deixa a marcacao aparecer antes da tela trocar.
    if (q.avancoAuto) {
      cancelarAvancoAuto();
      timerAuto = setTimeout(function () { timerAuto = null; avancar(); }, 280);
    }
  }

  // Cancela o avanco automatico pendente. Chamado em toda navegacao manual,
  // para um clique rapido em Voltar ou Fechar nao ser atropelado pelo timer.
  function cancelarAvancoAuto() {
    if (timerAuto) { clearTimeout(timerAuto); timerAuto = null; }
  }

  function irPara(passo) {
    cancelarAvancoAuto();
    estado.passo = passo;
    renderizarPasso();
  }

  function avancar() {
    cancelarAvancoAuto();
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

  // Envio final. A tela de espera aparece na hora do clique e, 2 segundos
  // depois, o agradecimento. Nenhuma das duas espera o Apps Script: ele so
  // responde depois de mandar os WhatsApps de aviso, o que leva de 10 a 15
  // segundos. O envio segue em segundo plano. Se as duas tentativas falharem,
  // a linha continua na planilha como parcial, com tudo menos a ultima resposta.
  function enviar() {
    if (estado.enviado) return;

    // O retrato e tirado agora, no clique, para uma nova abertura do modal
    // durante a segunda tentativa nao mexer no que vai para a planilha.
    enviarCompleto(JSON.stringify(montarPayload('completo')), 1);

    // A conversao conta no clique, para quem fecha a aba durante a espera
    // tambem entrar na medicao. Os parciais ficam de fora: sao outra funcao.
    avisarGtm('raiox_completou', { raiox_id: estado.id });
    pararJogo();
    estado.enviado = true;
    renderizar();
  }

  function enviarCompleto(corpo, tentativa) {
    // O cabecalho vai como text/plain de proposito: declarar application/json faz
    // o navegador disparar antes uma requisicao de verificacao (preflight CORS),
    // que o Apps Script nao responde. O corpo continua sendo JSON puro, lido do
    // outro lado com JSON.parse(e.postData.contents).
    fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: corpo,
      redirect: 'follow',
      // keepalive faz o envio sobreviver ao fechamento da aba, que pode vir
      // logo depois do agradecimento.
      keepalive: true
    }).then(function (resposta) {
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
      return resposta.text();
    }).then(function (texto) {
      // Quando o script quebra, o Google devolve uma pagina de erro com status
      // 200. So o "ok" do proprio script confirma que o lead foi gravado.
      if (String(texto).trim() !== 'ok') throw new Error('resposta inesperada');
    })['catch'](function () {
      // Uma segunda tentativa, so uma. Se a primeira tiver chegado mesmo assim,
      // o Apps Script reconhece o id e nao repete os avisos.
      if (tentativa < 2) {
        setTimeout(function () { enviarCompleto(corpo, tentativa + 1); }, 2000);
      }
    });
  }

  function abrir(origem) {
    botaoOrigem = origem || null;
    if (!raiz) montar();
    estado.aberto = true;
    estado.passo = 0;
    estado.enviado = false;
    estado.id = '';
    // Reabrir durante a espera nao pode deixar o agradecimento cair por cima
    // do formulario novo
    clearTimeout(timerEspera);
    timerEspera = null;
    filaParcial = Promise.resolve();
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    raiz.style.display = 'flex';
    renderizar();
    iniciarJogo();
    avisarGtm('raiox_abriu');
  }

  function fechar() {
    cancelarAvancoAuto();
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

  // os botoes que abrem o modal sao os da secao de investimento: o de antes do
  // cartao da oferta e o de dentro dele. Os demais da pagina rolam ate a secao.
  Array.prototype.forEach.call(document.querySelectorAll('#investimento .sc-host[data-sc-name="RaioButton"] a'), function (abridor) {
    abridor.addEventListener('click', function (e) {
      e.preventDefault();
      abrir(abridor);
    });
  });

  // mantem o evento original disponivel para outros gatilhos futuros
  window.addEventListener('soulstory:open-raiox', function () { abrir(null); });
})();
