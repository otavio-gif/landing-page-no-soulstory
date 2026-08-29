// Arte de meio-tom com revelação pelo cursor, portada do componente
// HalftoneReveal original. Usa a biblioteca OGL (WebGL) e os mesmos shaders.
// A imagem estática continua no HTML como reserva: se o WebGL ou a OGL não
// carregarem, ela permanece visível e nada quebra.
(function () {
  'use strict';

  var caixa = document.querySelector('[data-meio-tom]');
  if (!caixa) return;
  var reserva = caixa.querySelector('img');

  // Ajustes usados nesta página, iguais aos do export original.
  var CONFIG = {
    src: 'images/halftone-quote.jpg',
    tinta: '#0C0B14',
    papel: '#FAF8F5',
    densidade: 130,
    angulo: 22,
    raioRevelacao: 0.32,
    borda: 0.66,
    contraste: 1.22,
    tamanhoPonto: 1,
    seguir: 0.32
  };

  var HT_VERT = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  var HT_FRAG = `#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 iResolution;
uniform vec2 uImageSize;
uniform vec2 uMouse;
uniform float uActivity;
uniform float uDotSize;
uniform float uDensity;
uniform float uAngle;
uniform int uShape;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform int uMode;
uniform float uContrast;
uniform float uInvert;
uniform float uRevealRadius;
uniform float uEdge;
uniform float uIdleReveal;
uniform int uTrigger;
in vec2 vUv;
out vec4 fragColor;
vec2 uAspect() { return vec2(iResolution.x / max(iResolution.y, 1.0), 1.0); }
vec2 coverUv(vec2 uv) {
  float ia = uImageSize.x / max(uImageSize.y, 1.0);
  float pa = iResolution.x / max(iResolution.y, 1.0);
  vec2 s = pa > ia ? vec2(1.0, ia / pa) : vec2(pa / ia, 1.0);
  return (uv - 0.5) * s + 0.5;
}
vec3 gradeRGB(vec3 c) { c = clamp((c - 0.5) * uContrast + 0.5, 0.0, 1.0); return mix(c, 1.0 - c, uInvert); }
float shapeDist(vec2 f) {
  if (uShape == 1) return max(abs(f.x), abs(f.y));
  if (uShape == 2) return abs(f.x) + abs(f.y);
  if (uShape == 3) return abs(f.y);
  return length(f);
}
mat2 rot(float a) { float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }
vec4 sampleCell(vec2 st, float dens, float ang) {
  vec2 rp = rot(ang) * st * dens;
  vec2 center = floor(rp) + 0.5;
  vec2 stC = rot(-ang) * (center / dens);
  vec2 uvC = stC / uAspect();
  return texture(tMap, clamp(coverUv(uvC), 0.0, 1.0));
}
float coverage(vec2 st, float dens, float ang, float ink, float rscale) {
  vec2 rp = rot(ang) * st * dens;
  vec2 f = fract(rp) - 0.5;
  float d = shapeDist(f);
  float r = sqrt(clamp(ink, 0.0, 1.0)) * 0.72 * rscale * uDotSize;
  float w = length(fwidth(rp)) * 0.6 + 1e-4;
  return smoothstep(r + w, r - w, d);
}
void main() {
  vec2 aspect = uAspect();
  vec2 st = vUv * aspect;
  float ang = radians(uAngle);
  vec2 duv = (vUv - uMouse) * aspect;
  float dist = length(duv);
  float act = uTrigger == 2 ? 1.0 : (uTrigger == 0 ? 0.0 : uActivity);
  float radius = max(uRevealRadius, 1e-4) * mix(0.4, 1.0, act);
  float px = 1.4 / max(iResolution.y, 1.0);
  float band = max(px, radius * (1.0 - clamp(uEdge, 0.0, 1.0)) * 0.45);
  float loupe = 1.0 - smoothstep(radius - band, radius + band, dist);
  float focus = clamp(max(loupe * act, uIdleReveal), 0.0, 1.0);
  float dens = uDensity;
  vec3 print;
  if (uMode == 2) {
    vec3 gc = gradeRGB(sampleCell(st, dens, ang + radians(15.0)).rgb);
    vec3 gm = gradeRGB(sampleCell(st, dens, ang + radians(75.0)).rgb);
    vec3 gy = gradeRGB(sampleCell(st, dens, ang).rgb);
    vec3 gk = gradeRGB(sampleCell(st, dens, ang + radians(45.0)).rgb);
    float c = 1.0 - gc.r; float m = 1.0 - gm.g; float y = 1.0 - gy.b;
    float k = 1.0 - dot(gk, vec3(0.299, 0.587, 0.114));
    float gcr = min(min(c, m), y) * 0.5;
    c = clamp(c - gcr, 0.0, 1.0); m = clamp(m - gcr, 0.0, 1.0); y = clamp(y - gcr, 0.0, 1.0);
    k = clamp(max(gcr, k * k * 0.9), 0.0, 1.0);
    float covC = coverage(st, dens, ang + radians(15.0), c, 0.82);
    float covM = coverage(st, dens, ang + radians(75.0), m, 0.82);
    float covY = coverage(st, dens, ang, y, 0.82);
    float covK = coverage(st, dens, ang + radians(45.0), k, 0.78);
    print = uPaper;
    print = mix(print, print * vec3(0.10, 0.72, 0.90), covC);
    print = mix(print, print * vec3(0.92, 0.10, 0.52), covM);
    print = mix(print, print * vec3(0.98, 0.86, 0.10), covY);
    print = mix(print, print * vec3(0.08), covK);
  } else if (uMode == 1) {
    vec3 ink2 = mix(uInk.gbr, vec3(0.90, 0.24, 0.30), 0.7);
    float lumA = dot(gradeRGB(sampleCell(st, dens, ang).rgb), vec3(0.299, 0.587, 0.114));
    float lumB = dot(gradeRGB(sampleCell(st, dens, ang + radians(38.0)).rgb), vec3(0.299, 0.587, 0.114));
    float covA = coverage(st, dens, ang, 1.0 - lumA, 1.0);
    float covB = coverage(st, dens, ang + radians(38.0), pow(1.0 - lumB, 1.4), 0.92);
    print = uPaper;
    print = mix(print, ink2, covB * 0.85);
    print = mix(print, uInk, covA);
  } else {
    float lum = dot(gradeRGB(sampleCell(st, dens, ang).rgb), vec3(0.299, 0.587, 0.114));
    float cov = coverage(st, dens, ang, 1.0 - lum, 1.0);
    print = mix(uPaper, uInk, cov);
  }
  float t = clamp(dist / radius, 0.0, 1.0);
  float bend = t * t * t * t;
  vec2 dir = dist > 1e-5 ? duv / dist : vec2(0.0);
  vec2 off = dir * bend * radius * 0.22 / aspect;
  vec2 ca = dir * bend * 0.0045 / aspect;
  vec3 sharp = gradeRGB(vec3(
    texture(tMap, clamp(coverUv(vUv - off - ca), 0.0, 1.0)).r,
    texture(tMap, clamp(coverUv(vUv - off), 0.0, 1.0)).g,
    texture(tMap, clamp(coverUv(vUv - off + ca), 0.0, 1.0)).b
  ));
  vec3 col = mix(print, sharp, focus);
  fragColor = vec4(col, 1.0);
}
`;

  function hexParaRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [0, 0, 0];
  }

  var movimentoReduzido = false;
  try { movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function iniciar() {
    var ogl = window.ogl;
    if (!ogl) return false;
    var Renderer = ogl.Renderer, Program = ogl.Program, Triangle = ogl.Triangle, Mesh = ogl.Mesh, Texture = ogl.Texture;

    var renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: false, antialias: true });
    } catch (e) {
      return false; // sem WebGL: a imagem de reserva continua valendo
    }
    var gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    caixa.appendChild(gl.canvas);

    var textura = new Texture(gl, { generateMipmaps: false });
    var uniforms = {
      tMap: { value: textura },
      iResolution: { value: [1, 1] },
      uImageSize: { value: [1, 1] },
      uMouse: { value: [0.5, 0.5] },
      uActivity: { value: 0 },
      uDotSize: { value: CONFIG.tamanhoPonto },
      uDensity: { value: CONFIG.densidade },
      uAngle: { value: CONFIG.angulo },
      uShape: { value: 0 },              // círculo
      uInk: { value: hexParaRgb(CONFIG.tinta) },
      uPaper: { value: hexParaRgb(CONFIG.papel) },
      uMode: { value: 0 },               // monocromático
      uContrast: { value: CONFIG.contraste },
      uInvert: { value: 0 },
      uRevealRadius: { value: CONFIG.raioRevelacao },
      uEdge: { value: CONFIG.borda },
      uIdleReveal: { value: 0 },
      uTrigger: { value: 1 }             // revela ao passar o ponteiro
    };

    var programa = new Program(gl, { vertex: HT_VERT, fragment: HT_FRAG, uniforms });
    var malha = new Mesh(gl, { geometry: new Triangle(gl), program: programa });

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = CONFIG.src;
    img.onload = function () {
      textura.image = img;
      uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
      if (reserva) reserva.style.display = 'none'; // só esconde a reserva quando a arte já está pronta
    };

    function redimensionar() {
      var w = caixa.clientWidth || 1, h = caixa.clientHeight || 1;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height];
    }
    redimensionar();
    if (window.ResizeObserver) new ResizeObserver(redimensionar).observe(caixa);
    else window.addEventListener('resize', redimensionar);

    var ponteiro = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5, ativo: 0, alvo: 0 };
    function aoMover(e) {
      var r = caixa.getBoundingClientRect();
      ponteiro.x = (e.clientX - r.left) / r.width;
      ponteiro.y = 1 - (e.clientY - r.top) / r.height;
      ponteiro.alvo = movimentoReduzido ? 0 : 1;
    }
    function aoSair() { ponteiro.alvo = 0; }
    caixa.addEventListener('pointermove', aoMover, { passive: true });
    caixa.addEventListener('pointerenter', aoMover, { passive: true });
    caixa.addEventListener('pointerleave', aoSair, { passive: true });

    // ---------- Só renderiza o que está na tela ----------
    // Esta arte fica no fim de uma página muito longa, mas o WebGL começava a
    // desenhar junto com o hero e não parava mais. Agora ele só trabalha
    // quando a arte se aproxima da tela.
    var naTela = false;
    var quadro = null;
    var anterior = performance.now();

    function ligar() {
      if (naTela) return;
      naTela = true;
      anterior = performance.now();
      quadro = requestAnimationFrame(laco);
    }

    function desligar() {
      naTela = false;
      if (quadro) { cancelAnimationFrame(quadro); quadro = null; }
    }

    function laco(agora) {
      quadro = null;
      if (!naTela) return;
      quadro = requestAnimationFrame(laco);
      var dt = Math.min(0.05, Math.max(0.001, (agora - anterior) / 1000));
      anterior = agora;
      var a = 1 - Math.exp(-dt / Math.max(0.001, CONFIG.seguir));
      ponteiro.sx += (ponteiro.x - ponteiro.sx) * a;
      ponteiro.sy += (ponteiro.y - ponteiro.sy) * a;
      var ba = 1 - Math.exp(-dt / 0.18);
      ponteiro.ativo += (ponteiro.alvo - ponteiro.ativo) * ba;
      uniforms.uMouse.value[0] = ponteiro.sx;
      uniforms.uMouse.value[1] = ponteiro.sy;
      uniforms.uActivity.value = ponteiro.ativo;
      renderer.render({ scene: malha });
    }
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { if (e.isIntersecting) ligar(); else desligar(); });
      }, { rootMargin: '200px' }).observe(caixa);
    } else {
      ligar(); // navegador sem observador: mantém o comportamento antigo
    }
    return true;
  }

  // ---------- OGL sob demanda ----------
  // A biblioteca pesa 130KB e serve só a esta arte, que fica no fim de uma
  // página muito longa. Carregar no início era o maior peso morto do site.
  // Agora ela só é buscada quando a arte se aproxima da tela, com folga
  // suficiente para chegar antes de aparecer. Se a busca falhar, a imagem de
  // reserva que já está no HTML continua no lugar e nada quebra.
  function buscarOgl() {
    if (window.ogl) return Promise.resolve(window.ogl);
    return import('./vendor/ogl.module.js').then(function (mod) {
      window.ogl = mod;
      return mod;
    });
  }

  function acionar() {
    buscarOgl().then(function () { iniciar(); }, function () { /* fica a reserva */ });
  }

  // ---------- Fora do celular ----------
  // Abaixo de 700px a arte inteira sai da página pelo responsivo.css, porque sem
  // cursor não há o que revelar. A trava aqui garante que a OGL, 130KB que
  // servem só a este efeito, nunca seja buscada nesses aparelhos. O limite é o
  // mesmo do CSS: se mudar lá, muda aqui.
  var celular = null;
  try { celular = window.matchMedia('(max-width: 700px)'); } catch (e) {}
  function noCelular() { return !!(celular && celular.matches); }

  function observar() {
    if (window.IntersectionObserver) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting || noCelular()) return;
          obs.disconnect();
          acionar();
        });
      }, { rootMargin: '600px' });
      obs.observe(caixa);
    } else {
      acionar();
    }
  }

  if (noCelular()) {
    // Janela estreita pode virar larga (girar o aparelho, redimensionar no
    // computador). Quando isso acontece a arte volta a existir, e só então
    // vale a pena começar a observá-la.
    if (celular && celular.addEventListener) {
      celular.addEventListener('change', function ao(e) {
        if (e.matches) return;
        celular.removeEventListener('change', ao);
        observar();
      });
    }
  } else {
    observar();
  }
})();
