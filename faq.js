// FAQ da pagina, portado do runtime original para JavaScript puro.
// Quatro abas de categoria e abre-fecha de cada pergunta, com os mesmos estilos.
(function () {
  'use strict';

  // ---------- Conteudo das quatro abas (extraido tal e qual do original) ----------
  var GRUPOS = [
    [
      { q: 'O que é o Nó · StoryFunnels?', a: 'O Nó · StoryFunnels é o sistema que usa histórias pra amarrar os nós do funil e multiplicar a conversão. Um estrategista da Soulstory mergulha no seu negócio, clareia a mensagem e monta os ativos prontos pra usar: no site, nas conversas de venda, nos materiais de apresentação e nos anúncios. Roda em 4 semanas na configuração básica e em 6 na completa.' },
      { q: 'Para quem é?', a: 'Pra três tipos de gente que tem o que vender e perde venda na mensagem. O dono de um negócio que já funciona e travou no crescimento: o produto é bom, a entrega é boa, mas o anúncio traz gente e a página não fecha, e o time de vendas explica de um jeito diferente cada vez. O criador ou influenciador que está virando marca: tem audiência de sobra, mas o lançamento não converte na proporção do público, e a venda ainda depende de você aparecer todo dia. O negócio digital que vende curso, mentoria, assinatura ou serviço: chega tráfego, e a oferta não fecha na tela. Em todos, você tem o que vender. O que falta é a história que faz a pessoa comprar.' },
      { q: 'Para quem não é?', a: 'Não é pra quem precisa refundar a marca inteira. Se o comercial promete uma coisa, o marketing publica outra e a entrega faz uma terceira, o Nó não resolve, e a gente diz isso na conversa. Esse é o Trama. Também não é pra quem quer que a gente rode a mídia: o Nó entrega os textos e o sistema, quem opera é você ou o seu gestor. E não é pra quem ainda não tem um produto que vende. O Nó amarra o que já existe, não inventa uma oferta do zero.' },
      { q: 'Quanto custa?', a: 'Duas configurações. O básico é R$ 9.000 e trata quem decide na visita: o anúncio traz, a página convence, a pessoa compra. O completo é R$ 12.000 e trata também quem não decidiu ali, quem precisa de tempo, e quem já comprou e pode trazer outro. O básico faz a pessoa chegar. O completo faz ela voltar.' },
      { q: 'Quanto tempo dura?', a: 'O básico, 4 semanas. O completo, 6. A segunda semana tem um ponto de parada: você aprova o roteiro antes que qualquer página ou anúncio seja escrito, porque tudo sai dele. Sem roteiro aprovado, nada anda.' },
    ],
    [
      { q: 'Quais ativos estão inclusos?', a: 'No básico, os ativos que fazem a pessoa comprar na primeira visita: o roteiro do seu produto, a frase de uma linha que todo mundo que vende decora, o esqueleto e a copy da página, e os criativos de anúncio. No completo, mais o que faz ela voltar: a isca que captura quem ainda não vai comprar, a sequência de e-mail que lembra e pede, as cinco perguntas que viram história de cliente, e o sistema de indicação com a recompensa já definida. Tudo reunido num caderno feito só pro seu negócio.' },
      { q: 'O que é o roteiro?', a: 'É a espinha do sistema. Sete peças curtas que respondem, na ordem: quem compra e o que ele quer, o que atrapalha, quem resolve, o caminho, o pedido, o custo de não fazer e como fica depois. Na sua história, quem resolve é a sua marca, não a gente. A partir do roteiro sai todo o resto: página, anúncios, e-mails. Nada no material sai de fora dele.' },
      { q: 'O que é a reformulação da página inicial?', a: 'É a página onde a decisão acontece, reescrita do zero na mensagem. A gente entrega o esqueleto, que é a ordem das seções testada, e a copy de cada uma: a oferta acima da dobra, o custo de não fazer logo cedo, o caminho em três passos, o pedido claro repetido conforme rola. Pouca palavra, porque ninguém lê página, escaneia.' },
      { q: 'A reformulação da página é a construção do site?', a: 'Não. A gente entrega o esqueleto e a copy prontos pra montar. Quem constrói o site é você ou o seu desenvolvedor. O Nó não faz identidade visual nem coloca a página no ar. Ele resolve o que a maioria das páginas erra, que é a mensagem, e devolve no ponto de implementar.' },
      { q: 'Os ativos são nossos?', a: 'São. Tudo o que sai no caderno é do seu negócio, pra usar como quiser, sem pedir licença e sem mensalidade. A gente escreve, você fica com o que foi escrito.' },
    ],
    [
      { q: 'O que acontece na sessão de estratégia?', a: 'É onde o roteiro nasce. Antes dela, a gente apura o que o seu negócio já tem: a fala do vendedor mais antigo, as conversas com cliente, a página no ar, o anúncio que roda hoje. Na sessão, isso vira decisão: qual é a única coisa que o seu cliente quer, o que atrapalha o caminho, e a frase que resume tudo. Você sai dela com o roteiro pra aprovar. Nada é escrito antes disso.' },
      { q: 'Alguém revisa a minha mensagem?', a: 'Revisa, e antes de virar página ou anúncio. A gente começa lendo o que você comunica hoje, acha onde a mensagem escapa, e monta o roteiro. Na segunda semana você aprova esse roteiro. Só depois de aprovado é que a página, os e-mails e os criativos são escritos. Você não descobre a mensagem pronta no fim: aprova a base antes de tudo sair dela.' },
      { q: 'O otávio b.m. conduz todo o trabalho?', a: 'Hoje, sim. O otávio conduz a estratégia e a escrita de cada Nó. Conforme a casa cresce, a direção e o padrão de cada projeto continuam passando pela mão dele.' },
      { q: 'Quantas pessoas do nosso time devem participar?', a: 'Poucas, e o seu tempo é o menor de todos. Na apuração, a gente ouve quem mais fala com cliente e conhece o negócio por dentro, em torno de três conversas. Você não precisa estar em todas. O seu momento é o ponto de aprovação do roteiro, na segunda semana. Fora disso, a gente trabalha com o que já existe e devolve pronto.' },
      { q: 'O que acontece depois que eu agendo o Raio-X?', a: 'Começa a apuração. A gente escuta o seu negócio: três conversas na sua empresa, a mesma pergunta nas três, e você não participa de nenhuma. Em dez dias você recebe o Raio-X, um diagnóstico curto que mostra onde a mensagem não bate e onde estão as pontas soltas. A partir dele você decide o caminho: o Nó, pra amarrar a conversão, ou o Trama, pra marca inteira. O Raio-X custa R$ 2.000 e faz as vezes de proposta. Você entra sabendo, não no escuro.' },
    ],
    [
      { q: 'Ajuda se o nosso site recebe tráfego mas não converte?', a: 'É exatamente o caso. Tráfego que não converte quase nunca é problema de tráfego, é problema de mensagem: a pessoa chega, não entende em segundos o que você resolve e por que agora, e sai. O Nó reescreve a página no ponto onde a decisão trava, com a oferta clara, o custo de não fazer cedo e o pedido óbvio. Você para de pagar pra levar gente a uma página que não fecha.' },
      { q: 'Ajuda se o nosso time de vendas explica o negócio de formas diferentes?', a: 'Ajuda, e essa é uma das pontas mais caras. Quando cada vendedor explica de um jeito, o cliente recebe uma empresa diferente a cada conversa, e a confiança não acumula. O Nó entrega a frase de uma linha e o roteiro que todo mundo que vende decora. Vira força de vendas: a mesma resposta, dita por qualquer um, em todo lugar.' },
      { q: 'Funciona para negócios complexos ou técnicos?', a: 'Funciona, e costuma render mais ali. Quanto mais técnico o negócio, mais fácil o time cair na explicação completa, que informa e não vende. O roteiro força a escolha de uma coisa só que o cliente quer, e guarda o detalhe pra quem compra caro e confere, num parágrafo à parte. Complexo por dentro, simples na porta de entrada.' },
      { q: 'Qual a diferença de um workshop, agência ou copy feita por IA?', a: 'Um workshop te ensina e te deixa a tarefa: você sai com anotações e a página pra escrever depois. O Nó sai com os ativos prontos. Uma agência opera a mídia e cobra pra rodar campanha todo mês; o Nó entrega o sistema, e quem roda é você, sem mensalidade. E copy feita por IA parte do nada e inventa quando não sabe. A diferença aqui não é a ferramenta, é a apuração: a gente não escreve uma frase bonita, acha a que já estava na boca do seu vendedor mais antigo e nas suas conversas com cliente. Se não achou, diz que não achou.' },
      { q: 'Por que consertar a mensagem antes de investir mais em marketing?', a: 'Porque tráfego amplifica o que já está lá. Se a mensagem confunde, mais verba compra mais confusão, mais rápido. A mensagem é o multiplicador: a mesma campanha, com a história amarrada, converte o tráfego que hoje escapa. Conserte o que faz a pessoa comprar antes de escalar o que traz a pessoa. Sai mais barato, e o que você constrói fica, em vez de evaporar quando o anúncio para.' },
    ],
  ];

  var secao = document.querySelector('section[data-screen-label="FAQ"]');
  if (!secao) return;
  var abas = Array.prototype.slice.call(secao.querySelectorAll('[role="tablist"] button'));
  var tablist = secao.querySelector('[role="tablist"]');
  var lista = tablist ? tablist.nextElementSibling : null;
  if (!abas.length || !lista) return;

  var abaAtiva = 0;
  var aberta = 0; // primeira pergunta comeca aberta, como no original

  function escaparHtml(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function estiloCard(aberto) {
    return aberto
      ? 'background:rgba(142,159,238,0.07); border:1px solid rgba(142,159,238,0.38); border-radius:14px; margin-bottom:10px; overflow:hidden; transition:border-color .2s ease, background .2s ease'
      : 'background:rgba(250,248,245,0.03); border:1px solid rgba(250,248,245,0.10); border-radius:14px; margin-bottom:10px; overflow:hidden; transition:border-color .2s ease, background .2s ease';
  }

  function estiloIcone(aberto) {
    return 'font-family:var(--font-sans); font-weight:300; font-size:28px; line-height:1; color:' + (aberto ? '#8E9FEE' : 'rgba(250,248,245,0.6)') + '; transform:rotate(' + (aberto ? 45 : 0) + 'deg); transition:transform .25s ease, color .2s ease; flex:none';
  }

  function renderizarLista() {
    var itens = GRUPOS[abaAtiva] || [];
    lista.innerHTML = itens.map(function (item, idx) {
      var aberto = aberta === idx;
      var resposta = aberto
        ? '<div style="padding:0 24px 22px; font-size:clamp(15.5px, 1.1vw, 18px); line-height:1.66; color:rgba(250,248,245,0.72); text-wrap:pretty">' + escaparHtml(item.a) + '</div>'
        : '';
      return '<div style="' + estiloCard(aberto) + '">' +
        '<button type="button" data-faq-item="' + idx + '" aria-expanded="' + aberto + '" style="width:100%; display:flex; align-items:center; justify-content:space-between; gap:16px; background:none; border:none; padding:19px 24px; text-align:left; cursor:pointer; font-family:var(--font-sans)">' +
          '<span style="font-size:clamp(16.5px, 1.15vw, 19px); font-weight:600; color:var(--ss-cream); line-height:1.4; text-wrap:pretty">' + escaparHtml(item.q) + '</span>' +
          '<span style="' + estiloIcone(aberto) + '">+</span>' +
        '</button>' + resposta + '</div>';
    }).join('');
  }

  // Os botões são abas de verdade: têm role="tab" no HTML, e aqui mantemos os
  // estados que o leitor de tela lê. Só a aba ativa fica na sequência do Tab;
  // entre as abas se anda pelas setas, como manda o padrão.
  function renderizarAbas() {
    abas.forEach(function (btn, i) {
      var ativa = i === abaAtiva;
      btn.style.borderBottom = '2px solid ' + (ativa ? '#8E9FEE' : 'transparent');
      btn.style.color = ativa ? '#8E9FEE' : 'rgba(250,248,245,0.55)';
      btn.setAttribute('aria-selected', ativa ? 'true' : 'false');
      btn.setAttribute('tabindex', ativa ? '0' : '-1');
    });
    // o painel passa a ser rotulado pela aba que está aberta
    if (abas[abaAtiva] && abas[abaAtiva].id) {
      lista.setAttribute('aria-labelledby', abas[abaAtiva].id);
    }
  }

  function trocarPara(i, moverFoco) {
    abaAtiva = i;
    aberta = null; // trocar de aba fecha tudo, como no original
    renderizarAbas();
    renderizarLista();
    if (moverFoco && abas[i]) abas[i].focus();
  }

  abas.forEach(function (btn, i) {
    btn.addEventListener('click', function () { trocarPara(i, false); });
    btn.addEventListener('keydown', function (e) {
      var destino = null;
      if (e.key === 'ArrowRight') destino = (i + 1) % abas.length;
      else if (e.key === 'ArrowLeft') destino = (i - 1 + abas.length) % abas.length;
      else if (e.key === 'Home') destino = 0;
      else if (e.key === 'End') destino = abas.length - 1;
      if (destino === null) return;
      e.preventDefault();
      trocarPara(destino, true);
    });
  });

  lista.addEventListener('click', function (e) {
    var alvo = e.target.closest('[data-faq-item]');
    if (!alvo) return;
    var idx = Number(alvo.getAttribute('data-faq-item'));
    aberta = aberta === idx ? null : idx;
    renderizarLista();
  });

  renderizarAbas();
  renderizarLista();
})();
