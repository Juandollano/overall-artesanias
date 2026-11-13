/* Casa Over All — lógica del sitio (cabecera, pie, tienda, ficha, carrito) */
(function () {
  'use strict';

  var D = window.OVERALL_DATA || { products: [], categories: [] };

  /* ---------- Configuración ---------- */
  // Corregido: el sitio original usaba wa.me/5950981754016 (con un 0 de más), que no abre el chat.
  var WHATSAPPS = [
    { num: '595981754016', txt: '0981 754 016' },
    { num: '595986128317', txt: '0986 128 317' }
  ];
  var WA_PEDIDOS = WHATSAPPS[0].num;
  var SUCURSALES = [
    { nombre: 'Centro de Asunción', dir: 'Caballero c/ Mcal. Estigarribia', mapa: 'https://www.google.com/maps/place/Over+All+Artesan%C3%ADas/@-25.2838543,-57.6313589,17z' },
    { nombre: 'Shopping del Sol', dir: '2.º nivel, Asunción', mapa: 'https://www.google.com/maps/place/Over+All+Shopping+del+Sol/@-25.2834922,-57.5682179,17z' }
  ];
  var AMBIENTES = {
    comedor: 'Comedor', habitacion: 'Habitación', bano: 'Baño', airelibre: 'Aire libre', corredor: 'Corredor'
  };
  // Estructura de categorías (js/categorias.js, según la planilla CATEGORIAS PAG WEB.xlsx)
  var CATS = window.OVERALL_CATS || { arbol: [], materiales: {}, asignacion: {} };

  /* ---------- Utilidades ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(n) { return '₲ ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function param(k) { return new URLSearchParams(location.search).get(k); }
  // Correcciones de texto: espacios antes de comas, falta de espacio tras punto, tildes mal puestas
  function limpiar(s) {
    return String(s || '')
      .replace(/[ \t]+([,.;:])/g, '$1')
      .replace(/([a-záéíóúñ\d])\.([A-ZÁÉÍÓÚÑ])/g, '$1. $2')
      .replace(/´/g, '’')
      .replace(/(\d)gs\b/gi, '$1 Gs.')
      .trim();
  }
  function nombre(s) {
    s = limpiar(s);
    if (s.length > 3 && s === s.toUpperCase()) s = s.charAt(0) + s.slice(1).toLowerCase(); // "SAGRADA FAMILIA ANGEL"
    return s;
  }
  D.products.forEach(function (p) { p.name = nombre(p.name); p.desc = limpiar(p.desc); p.short = limpiar(p.short); });

  var porSlug = {}, porId = {};
  D.products.forEach(function (p) { porSlug[p.slug] = p; porId[p.id] = p; });
  var catPorSlug = {};
  CATS.arbol.forEach(function (c) {
    catPorSlug[c.s] = c; c.subPorSlug = {};
    c.subs.forEach(function (s) { c.subPorSlug[s.s] = s; });
  });
  // Rutas de cada producto: [{c: categoría, s: subcategoría, m: material}]
  D.products.forEach(function (p) {
    p.rutas = String(CATS.asignacion[p.slug] || '').split(',').map(function (r) {
      var x = r.trim().split('/'); return { c: x[0], s: x[1] || '', m: x[2] || '' };
    }).filter(function (r) { return catPorSlug[r.c]; });
    // Todos los pesebres también aparecen en Navidad > Pesebres
    if (p.rutas.some(function (r) { return r.c === 'pesebres'; })) p.rutas.push({ c: 'navidad', s: 'pesebres', m: '' });
  });
  function enRuta(p, c, s, m) {
    return p.rutas.some(function (r) { return (!c || r.c === c) && (!s || r.s === s) && (!m || r.m === m); });
  }
  function enCategoria(p, slug) { return enRuta(p, slug); }
  function nombreCat(c) { return catPorSlug[c] ? catPorSlug[c].n : c; }
  function nombreSub(c, s) { var k = catPorSlug[c]; return k && k.subPorSlug[s] ? k.subPorSlug[s].n : s; }
  function nombreMat(m) { return CATS.materiales[m] || m; }
  function catPrincipal(p) { return p.rutas[0] || null; }
  function etiquetaRuta(r) { return r.s ? nombreSub(r.c, r.s) : nombreCat(r.c); }
  function urlRuta(c, s, m) { return 'tienda.html?cat=' + c + (s ? '&sub=' + s : '') + (m ? '&mat=' + m : ''); }
  function contar(c, s, m) { return D.products.filter(function (p) { return enRuta(p, c, s, m); }).length; }
  // Imagen representativa de una categoría ("p:slug" = foto de ese producto)
  function imgCat(c) {
    var k = catPorSlug[c]; if (!k) return '';
    if (k.img && k.img.indexOf('p:') === 0) { var p = porSlug[k.img.slice(2)]; if (p && p.imgs[0]) return p.imgs[0].f || p.imgs[0].t; }
    if (k.img) return k.img;
    var q = D.products.filter(function (x) { return enRuta(x, c) && x.imgs[0]; })[0];
    return q ? (q.imgs[0].f || q.imgs[0].t) : 'img/logo-verde.png';
  }

  /* ---------- Almacenamiento seguro ---------- */
  var memoria = {};
  var store = {
    get: function (k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return memoria[k] || null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { memoria[k] = v; } }
  };

  /* ---------- Carrito ---------- */
  var CLAVE = 'overall_carrito_v1';
  var carrito = {
    items: function () {
      var it = store.get(CLAVE) || [];
      return it.filter(function (i) { return porId[i.id]; });
    },
    guardar: function (it) { store.set(CLAVE, it); actualizarBadge(); },
    agregar: function (id, vid, q) {
      var it = this.items(); q = Math.max(1, q | 0);
      var ex = it.filter(function (i) { return i.id === id && (i.vid || null) === (vid || null); })[0];
      if (ex) ex.q = Math.min(99, ex.q + q); else it.push({ id: id, vid: vid || null, q: q });
      this.guardar(it);
    },
    cambiar: function (idx, q) { var it = this.items(); if (!it[idx]) return; it[idx].q = Math.max(1, Math.min(99, q | 0)); this.guardar(it); },
    quitar: function (idx) { var it = this.items(); it.splice(idx, 1); this.guardar(it); },
    vaciar: function () { this.guardar([]); },
    cantidad: function () { return this.items().reduce(function (a, i) { return a + i.q; }, 0); }
  };
  function variante(p, vid) { return (p.vars || []).filter(function (v) { return v.id === vid; })[0] || null; }
  function precioLinea(i) {
    var p = porId[i.id], v = i.vid ? variante(p, i.vid) : null;
    return v ? v.p : p.min;
  }
  function textoVariante(v) {
    if (!v) return '';
    return Object.keys(v.a).filter(function (k) { return v.a[k]; }).map(function (k) { return k + ': ' + v.a[k]; }).join(' · ');
  }
  function actualizarBadge() {
    var n = carrito.cantidad();
    $$('[data-badge]').forEach(function (b) { b.textContent = n; b.hidden = n === 0; });
    $$('[data-carrito-link]').forEach(function (a) { a.setAttribute('aria-label', 'Carrito (' + n + (n === 1 ? ' producto)' : ' productos)')); });
  }

  /* ---------- Íconos ---------- */
  var IC = {
    bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    izq: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    der: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.7-.6z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>'
  };

  /* ---------- Cabecera y pie ---------- */
  var NAV = [
    ['index.html', 'Inicio'], ['#categorias', 'Categorías'], ['tienda.html', 'Tienda'], ['regalos.html', 'Regalos'],
    ['nosotros.html', 'Nosotros'], ['arte.html', 'El arte inspira al arte'], ['glosario.html', 'Glosario']
  ];
  function megaMenu() {
    return '<div class="nav-cat"><button type="button" class="nav-cat__btn" aria-expanded="false" aria-controls="mega" data-mega-btn>Categorías ' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>' +
      '<div class="mega" id="mega" hidden><div class="contenedor mega__grid">' +
      CATS.arbol.filter(function (c) { return contar(c.s); }).map(function (c) {
        var subs = c.subs.filter(function (s) { return contar(c.s, s.s); });
        return '<div class="mega__col"><a class="mega__cat" href="' + urlRuta(c.s) + '">' + esc(c.n) + '</a>' +
          (subs.length ? '<ul>' + subs.map(function (s) { return '<li><a href="' + urlRuta(c.s, s.s) + '">' + esc(s.n) + '</a></li>'; }).join('') + '</ul>' : '') + '</div>';
      }).join('') +
      '<div class="mega__pie"><a href="tienda.html">Ver todos los productos →</a></div>' +
      '</div></div></div>';
  }
  function paginaActual() { var f = location.pathname.split('/').pop(); return f === '' ? 'index.html' : f; }

  function pintarCabecera() {
    var h = $('#cabecera'); if (!h) return;
    var actual = paginaActual();
    if (actual === 'producto.html') actual = 'tienda.html';
    h.innerHTML =
      '<a class="skip-link" href="#contenido">Saltar al contenido</a>' +
      '<div class="topbar">Artesanía paraguaya desde 1920 · Pedidos y consultas: <a href="https://wa.me/' + WA_PEDIDOS + '" target="_blank" rel="noopener">WhatsApp ' + WHATSAPPS[0].txt + '</a></div>' +
      '<header class="header"><div class="contenedor header__fila">' +
      '<a class="header__logo" href="index.html" aria-label="Casa Over All — inicio"><img class="logo-oscuro" src="img/logo-verde.png" alt="Casa Over All" width="480" height="239"><img class="logo-claro" src="img/logo-beige.png" alt="" width="480" height="239"></a>' +
      '<nav class="nav" id="nav" aria-label="Principal">' +
      '<button class="icono-btn nav-cerrar" type="button" aria-label="Cerrar menú" data-cerrar-menu>' + IC.cerrar + '</button>' +
      NAV.map(function (n) {
        if (n[0] === '#categorias') return megaMenu();
        return '<a href="' + n[0] + '"' + (n[0] === actual ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
      }).join('') +
      '</nav>' +
      '<div class="header__acciones">' +
      '<button class="icono-btn" type="button" aria-label="Buscar" aria-expanded="false" aria-controls="buscador" data-buscar>' + IC.lupa + '</button>' +
      '<a class="icono-btn" href="carrito.html" data-carrito-link aria-label="Carrito">' + IC.bolsa + '<span class="badge" data-badge hidden>0</span></a>' +
      '<button class="icono-btn menu-btn" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav" data-abrir-menu>' + IC.menu + '</button>' +
      '</div></div>' +
      '<div class="buscador" id="buscador" hidden><div class="contenedor"><form action="tienda.html" role="search">' +
      '<label class="visually-hidden" for="q-global">Buscar productos</label>' +
      '<input type="search" id="q-global" name="q" placeholder="Buscar ñandutí, hamacas, guampas…" autocomplete="off">' +
      '<button class="btn" type="submit">Buscar</button></form></div></div>' +
      '</header><div class="velo" hidden data-velo></div>';

    var nav = $('#nav'), velo = $('[data-velo]'), abrir = $('[data-abrir-menu]');
    function cerrarMenu() { nav.classList.remove('abierto'); velo.hidden = true; abrir.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    abrir.addEventListener('click', function () { nav.classList.add('abierto'); velo.hidden = false; abrir.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; setTimeout(function () { $('a', nav).focus(); }, 60); });
    $('[data-cerrar-menu]').addEventListener('click', cerrarMenu);
    velo.addEventListener('click', cerrarMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('abierto')) { cerrarMenu(); abrir.focus(); } });
    // Portada: header transparente sobre el slider, blanco al hacer scroll o al abrir el buscador
    if (document.body.classList.contains('con-hero')) {
      var marcar = function () { document.body.classList.toggle('scrolled', window.scrollY > 40 || !$('#buscador').hidden || !$('#mega').hidden); };
      window.addEventListener('scroll', marcar, { passive: true });
      document.addEventListener('click', function () { setTimeout(marcar, 0); });
      marcar();
    }
    // Menú desplegable de categorías: clic o pasar el mouse (en computadora)
    var mb = $('[data-mega-btn]'), mega = $('#mega'), navCat = $('.nav-cat'), megaT;
    function abrirMega(si) { mega.hidden = !si; mb.setAttribute('aria-expanded', String(si)); document.body.classList.toggle('mega-abierto', si); window.dispatchEvent(new Event('scroll')); }
    mb.addEventListener('click', function (e) { e.stopPropagation(); abrirMega(mega.hidden); });
    navCat.addEventListener('mouseenter', function () { if (window.innerWidth > 960) { clearTimeout(megaT); abrirMega(true); } });
    navCat.addEventListener('mouseleave', function () { if (window.innerWidth > 960) megaT = setTimeout(function () { abrirMega(false); }, 180); });
    document.addEventListener('click', function (e) { if (!mega.hidden && !navCat.contains(e.target)) abrirMega(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mega.hidden) { abrirMega(false); mb.focus(); } });
    var bb = $('[data-buscar]'), bz = $('#buscador');
    bb.addEventListener('click', function () {
      bz.hidden = !bz.hidden; bb.setAttribute('aria-expanded', String(!bz.hidden));
      if (!bz.hidden) $('#q-global').focus();
    });
  }

  function pintarPie() {
    var f = $('#pie'); if (!f) return;
    f.innerHTML =
      '<footer class="footer"><div class="contenedor"><div class="footer__grid">' +
      '<div><img class="footer__logo" src="img/logo-beige.png" alt="Casa Over All" width="480" height="239" loading="lazy">' +
      '<p>Auténtica artesanía paraguaya desde 1920. Piezas hechas a mano por artesanos de todo el país.</p>' +
      '<div class="footer__social">' +
      '<a href="https://www.instagram.com/overallartesania" target="_blank" rel="noopener" aria-label="Instagram">' + IC.ig + '</a>' +
      '<a href="https://www.facebook.com/overallartesania" target="_blank" rel="noopener" aria-label="Facebook">' + IC.fb + '</a>' +
      '<a href="https://wa.me/' + WA_PEDIDOS + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + IC.wa + '</a>' +
      '</div></div>' +
      '<div><h2>Links de interés</h2><ul>' +
      '<li><a href="tienda.html">Tienda</a></li><li><a href="regalos.html">Catálogo de regalos</a></li>' +
      '<li><a href="pesebres.html">Pesebres del Paraguay</a></li><li><a href="glosario.html">Glosario de productos</a></li>' +
      '<li><a href="nosotros.html">Nosotros</a></li><li><a href="arte.html">El arte inspira al arte</a></li>' +
      '<li><a href="carrito.html">Mi carrito</a></li></ul></div>' +
      '<div><h2>Encontranos en</h2><ul>' +
      SUCURSALES.map(function (s) {
        return '<li class="footer__item">' + IC.pin + '<span><a href="' + s.mapa + '" target="_blank" rel="noopener"><strong>' + s.nombre + '</strong></a><br>' + s.dir + '</span></li>';
      }).join('') + '</ul></div>' +
      '<div><h2>Contacto</h2><ul>' +
      WHATSAPPS.map(function (w) {
        return '<li class="footer__item">' + IC.wa + '<a href="https://wa.me/' + w.num + '" target="_blank" rel="noopener">WhatsApp ' + w.txt + '</a></li>';
      }).join('') +
      '</ul></div>' +
      '</div><div class="footer__base"><span>© ' + new Date().getFullYear() + ' Casa Over All · Artesanía paraguaya</span><span>Asunción, Paraguay</span></div></div></footer>' +
      '<div class="wa-burbuja" data-wa-burbuja hidden role="dialog" aria-labelledby="wa-tit">' +
      '<button type="button" class="wa-burbuja__x" aria-label="Cerrar" data-wa-cerrar>' + IC.cerrar + '</button>' +
      '<p id="wa-tit"><strong>¡Hola!</strong> ¿Te ayudamos con tu compra o con un regalo?</p>' +
      '<a class="btn btn--wa btn--bloque" href="' + waContexto() + '" target="_blank" rel="noopener" data-wa-link>' + IC.wa + ' Escribinos por WhatsApp</a></div>' +
      '<a class="wa-flotante" href="' + waContexto() + '" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp" data-wa-link>' + IC.wa + '</a>' +
      '<div class="toast" role="status" aria-live="polite" data-toast></div>';
  }

  // Enlace de WhatsApp con mensaje según la página (en una ficha, incluye el producto)
  function waContexto() {
    var p = paginaActual() === 'producto.html' ? porSlug[param('p') || ''] : null;
    var txt = p ? '¡Hola! Quisiera consultar por: ' + p.name : '¡Hola! Quisiera hacer una consulta.';
    return 'https://wa.me/' + WA_PEDIDOS + '?text=' + encodeURIComponent(txt);
  }
  // Ventanita de WhatsApp que "salta" a los pocos segundos (una vez por visita; si se cierra no vuelve a salir)
  function burbujaWA() {
    var b = $('[data-wa-burbuja]'); if (!b) return;
    var CL = 'overall_wa_cerrado';
    var cerrado = false; try { cerrado = sessionStorage.getItem(CL) === '1'; } catch (e) { }
    var cerrar = function () { b.hidden = true; try { sessionStorage.setItem(CL, '1'); } catch (e) { } };
    $('[data-wa-cerrar]', b).addEventListener('click', cerrar);
    $('[data-wa-link]', b).addEventListener('click', cerrar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !b.hidden) cerrar(); });
    $('.wa-flotante').classList.add('pulso');
    if (!cerrado && paginaActual() !== 'carrito.html') setTimeout(function () { b.hidden = false; }, 4000);
  }

  var toastT;
  function toast(html) {
    var t = $('[data-toast]'); if (!t) return;
    t.innerHTML = html; t.classList.add('visible');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('visible'); }, 3500);
  }

  /* ---------- Tarjetas de producto ---------- */
  var PLACEHOLDER = '<div class="sin-img"><img src="img/logo-verde.png" alt="" loading="lazy"></div>';
  function precioHTML(p) {
    if (!p.min) return '<span class="precio">Consultar precio</span>';
    if (p.min !== p.max) return '<span class="precio">' + fmt(p.min) + ' – ' + fmt(p.max) + '</span>';
    if (p.sale && p.reg > p.min) return '<span class="precio"><del>' + fmt(p.reg) + '</del>' + fmt(p.min) + '</span>';
    return '<span class="precio">' + fmt(p.min) + '</span>';
  }
  function tarjeta(p, pref) {
    var url = 'producto.html?p=' + encodeURIComponent(p.slug);
    var img = p.imgs[0]
      ? '<img src="' + esc(p.imgs[0].t) + '" alt="' + esc(p.name) + '" loading="lazy" width="450" height="450">' +
        (p.imgs[1] ? '<img class="img-2" src="' + esc(p.imgs[1].t) + '" alt="" loading="lazy" width="450" height="450">' : '')
      : PLACEHOLDER;
    var badge = !p.stock ? '<span class="etiqueta">Agotado</span>' : (p.sale ? '<span class="etiqueta etiqueta--oferta">Oferta</span>' : '');
    // etiqueta según la sección que se está viendo (un producto puede estar en varias categorías)
    var cat = (pref && p.rutas.filter(function (r) { return r.c === pref; })[0]) || catPrincipal(p);
    var accion;
    if (!p.stock) accion = '<a class="btn btn--borde" href="' + url + '">Ver producto</a>';
    else if (!p.min) accion = '<a class="btn btn--borde" href="' + url + '">Consultar</a>';
    else if (p.vars && p.vars.length) accion = '<a class="btn btn--borde" href="' + url + '">Elegir opciones</a>';
    else accion = '<button class="btn" type="button" data-agregar="' + p.id + '">Agregar al carrito</button>';
    return '<article class="card">' +
      '<a class="card__img" href="' + url + '" tabindex="-1" aria-hidden="true">' + badge + img + '</a>' +
      '<div class="card__cuerpo">' + (cat ? '<span class="card__cat">' + esc(etiquetaRuta(cat)) + '</span>' : '') +
      '<h3 class="card__titulo"><a href="' + url + '">' + esc(p.name) + '</a></h3>' + precioHTML(p) +
      '<div class="card__acciones">' + accion + '</div></div></article>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-agregar]');
    if (!b) return;
    var p = porId[+b.getAttribute('data-agregar')]; if (!p) return;
    carrito.agregar(p.id, null, 1);
    toast('“' + esc(p.name) + '” se agregó al carrito <a href="carrito.html">Ver carrito</a>');
  });

  /* ---------- Inicio ---------- */
  function paginaInicio() {
    // Slider a pantalla completa con desplazamiento horizontal en bucle (como el original, pero alineado)
    var slider = $('.slider'), pista = $('[data-pista]');
    if (slider && pista) {
      var reales = $$('.slide', pista), n = reales.length, pos = 1, timer = null, ocupado = false;
      var primero = reales[0].cloneNode(true), ultimo = reales[n - 1].cloneNode(true);
      [primero, ultimo].forEach(function (c) {
        c.setAttribute('aria-hidden', 'true'); c.removeAttribute('aria-label'); c.removeAttribute('role');
        $$('a', c).forEach(function (a) { a.tabIndex = -1; });
      });
      pista.appendChild(primero); pista.insertBefore(ultimo, reales[0]);
      var puntos = $('[data-puntos]');
      puntos.innerHTML = reales.map(function (s, k) {
        return '<button type="button" aria-label="Ir a la diapositiva ' + (k + 1) + ': ' + esc($('h2', s).textContent) + '"></button>';
      }).join('');
      var dots = $$('button', puntos);
      var mover = function (animar) {
        pista.classList.toggle('animando', !!animar);
        pista.style.transform = 'translate3d(' + (-pos * 100) + '%,0,0)';
        var real = (pos - 1 + n) % n;
        reales.forEach(function (s, k) {
          s.setAttribute('aria-hidden', String(k !== real));
          $$('.btn-slide', s).forEach(function (a) { a.tabIndex = k === real ? 0 : -1; });
        });
        dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === real)); });
      };
      // Al llegar a un clon, saltar sin animación a la diapositiva real equivalente
      var normalizar = function () {
        if (pos <= 0) { pos = n; mover(false); }
        else if (pos >= n + 1) { pos = 1; mover(false); }
        ocupado = false;
      };
      var espera = null;
      var ir = function (p) {
        if (ocupado) return;
        ocupado = true; pos = Math.max(0, Math.min(n + 1, p)); mover(true);
        clearTimeout(espera); espera = setTimeout(normalizar, 1050);
      };
      pista.addEventListener('transitionend', function (e) { if (e.target === pista) { clearTimeout(espera); normalizar(); } });
      var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var auto = function () { clearInterval(timer); if (!quieto) timer = setInterval(function () { if (!document.hidden) ir(pos + 1); }, 5000); };
      var parar = function () { clearInterval(timer); };
      $('[data-prev]').addEventListener('click', function () { ir(pos - 1); auto(); });
      $('[data-next]').addEventListener('click', function () { ir(pos + 1); auto(); });
      dots.forEach(function (d, k) { d.addEventListener('click', function () { ir(k + 1); auto(); }); });
      slider.addEventListener('mouseenter', parar);
      slider.addEventListener('mouseleave', auto);
      slider.addEventListener('focusin', parar);
      slider.addEventListener('focusout', auto);
      slider.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { ir(pos - 1); auto(); }
        if (e.key === 'ArrowRight') { ir(pos + 1); auto(); }
      });
      // Deslizar con el dedo / arrastrar con el mouse
      var x0 = null, arrastre = false;
      slider.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; x0 = e.clientX; arrastre = false; });
      slider.addEventListener('pointermove', function (e) { if (x0 !== null && Math.abs(e.clientX - x0) > 10) arrastre = true; });
      slider.addEventListener('pointerup', function (e) {
        if (x0 === null) return;
        var dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) { ir(dx < 0 ? pos + 1 : pos - 1); auto(); }
      });
      // Si fue un arrastre, no seguir el enlace del slide
      slider.addEventListener('click', function (e) { if (arrastre) { e.preventDefault(); arrastre = false; } }, true);
      mover(false); auto();
    }
    // Categorías de la portada (las 15 de la planilla)
    var gc = $('[data-cats-inicio]');
    if (gc) gc.innerHTML = CATS.arbol.filter(function (c) { return contar(c.s); }).map(function (c) {
      return '<a class="cat" href="' + urlRuta(c.s) + '"><span class="cat__img"><img src="' + esc(imgCat(c.s)) + '" alt="" loading="lazy"></span>' +
        '<span class="cat__nombre">' + esc(c.n) + ' <small>' + contar(c.s) + ' productos</small></span></a>';
    }).join('');
    // Destacados como muestra del catálogo: un producto de cada categoría, distinto en cada visita
    var g = $('[data-destacados]');
    if (g) {
      var usados = {};
      var muestra = CATS.arbol.map(function (c) {
        var ps = D.products.filter(function (p) { return enRuta(p, c.s) && p.stock && p.imgs[0] && !usados[p.id]; });
        if (!ps.length) return null;
        var p = ps[Math.floor(Math.random() * ps.length)]; usados[p.id] = 1;
        return { p: p, c: c };
      }).filter(Boolean);
      g.innerHTML = muestra.map(function (x) {
        return tarjeta(x.p).replace(/<span class="card__cat">[^<]*<\/span>/, '<a class="card__cat" href="' + urlRuta(x.c.s) + '">' + esc(x.c.n) + '</a>');
      }).join('');
    }
  }

  /* ---------- Listas fijas (Regalos, Pesebres) ---------- */
  function listas() {
    $$('[data-lista]').forEach(function (g) {
      var slug = g.getAttribute('data-lista');
      var ps = D.products.filter(function (p) { return enCategoria(p, slug); });
      ps.sort(function (a, b) { return (b.stock - a.stock); });
      g.innerHTML = ps.length ? ps.map(function (p) { return tarjeta(p, slug); }).join('') : '<p class="vacio">Pronto vas a encontrar productos acá.</p>';
      var n = $('[data-cuenta="' + slug + '"]'); if (n) n.textContent = ps.length + ' productos';
    });
  }

  /* ---------- Tienda ---------- */
  function paginaTienda() {
    var POR_PAGINA = 24;
    var st = {
      cat: param('cat') || '', sub: param('sub') || '', mat: param('mat') || '', amb: param('amb') || '', q: param('q') || '',
      orden: param('orden') || 'recientes', disp: param('disp') === '1', n: POR_PAGINA
    };
    if (st.cat && !catPorSlug[st.cat]) { st.cat = ''; st.sub = ''; }
    if (st.sub && !(st.cat && catPorSlug[st.cat].subPorSlug[st.sub])) st.sub = '';
    if (st.mat && !CATS.materiales[st.mat]) st.mat = '';
    var grid = $('[data-grid]'), info = $('[data-info]'), mas = $('[data-mas]'), titulo = $('[data-titulo]'), sub = $('[data-subtitulo]');

    // Árbol de categorías: categoría > subcategoría > material (se despliega lo elegido)
    function pintarArbol() {
      var html = '<li><a href="tienda.html" data-ruta="||"' + (!st.cat ? ' aria-current="true"' : '') + '><span>Todos los productos</span><small>' + D.products.length + '</small></a></li>';
      CATS.arbol.forEach(function (c) {
        var nc = contar(c.s); if (!nc) return;
        var abierta = st.cat === c.s;
        html += '<li><a href="' + urlRuta(c.s) + '" data-ruta="' + c.s + '||"' + (abierta && !st.sub ? ' aria-current="true"' : '') + (abierta ? ' class="abierta"' : '') + '><span>' + esc(c.n) + '</span><small>' + nc + '</small></a>';
        if (abierta) {
          var subs = c.subs.filter(function (s) { return contar(c.s, s.s); });
          if (subs.length) html += '<ul>' + subs.map(function (s) {
            var sa = st.sub === s.s;
            var mats = [];
            if (sa) D.products.forEach(function (p) { p.rutas.forEach(function (r) { if (r.c === c.s && r.s === s.s && r.m && mats.indexOf(r.m) < 0) mats.push(r.m); }); });
            // orden de la planilla primero, luego los demás
            var orden = (s.m || []).concat(mats.filter(function (m) { return (s.m || []).indexOf(m) < 0; }));
            mats = orden.filter(function (m) { return mats.indexOf(m) >= 0; });
            return '<li><a href="' + urlRuta(c.s, s.s) + '" data-ruta="' + c.s + '|' + s.s + '|"' + (sa && !st.mat ? ' aria-current="true"' : '') + '><span>' + esc(s.n) + '</span><small>' + contar(c.s, s.s) + '</small></a>' +
              (mats.length ? '<ul class="lista-mat">' + mats.map(function (m) {
                return '<li><a href="' + urlRuta(c.s, s.s, m) + '" data-ruta="' + c.s + '|' + s.s + '|' + m + '"' + (st.mat === m ? ' aria-current="true"' : '') + '><span>' + esc(nombreMat(m)) + '</span><small>' + contar(c.s, s.s, m) + '</small></a></li>';
              }).join('') + '</ul>' : '') + '</li>';
          }).join('') + '</ul>';
        }
        html += '</li>';
      });
      $('[data-cats]').innerHTML = html;
    }
    // Filtro por material o técnica, válido en todas las categorías (ej.: todo lo de ñandutí)
    var SOLO_MATERIALES = ['ao-poi', 'ao-poi-autentico', 'encaje-ju', 'encaje-con-lienzo', 'nanduti', 'telar', '4-lisos', 'crochet', 'trapito',
      'lienzo', 'ceramica', 'ceramica-esmaltada', 'palo-santo', 'cedro', 'madera', 'cuero', 'karanday', 'karaguata'];
    var matsGlobales = SOLO_MATERIALES.map(function (m) { return { m: m, n: contar('', '', m) }; })
      .filter(function (x) { return x.n >= 2; }).sort(function (a, b) { return b.n - a.n; });
    $('[data-materiales]').innerHTML = matsGlobales.map(function (x) {
      return '<button type="button" class="chip" data-mat="' + x.m + '" aria-pressed="false">' + esc(nombreMat(x.m)) + ' <small>' + x.n + '</small></button>';
    }).join('');
    $('[data-ambientes]').innerHTML = Object.keys(AMBIENTES).map(function (k) {
      return '<button type="button" class="chip" data-amb="' + k + '" aria-pressed="false">' + AMBIENTES[k] + '</button>';
    }).join('');

    var q = $('#q'), orden = $('#orden'), disp = $('#disp');
    q.value = st.q; orden.value = st.orden; disp.checked = st.disp;

    function filtrar() {
      var t = norm(st.q).split(/\s+/).filter(Boolean);
      var ps = D.products.filter(function (p) {
        if ((st.cat || st.mat) && !enRuta(p, st.cat, st.sub, st.mat)) return false;
        if (st.amb && p.tags.indexOf(st.amb) < 0) return false;
        if (st.disp && !p.stock) return false;
        if (t.length) {
          var h = norm(p.name + ' ' + p.desc + ' ' + p.rutas.map(function (r) { return nombreCat(r.c) + ' ' + nombreSub(r.c, r.s) + ' ' + nombreMat(r.m); }).join(' '));
          if (!t.every(function (w) { return h.indexOf(w) >= 0; })) return false;
        }
        return true;
      });
      var o = st.orden;
      if (o === 'precio-asc') ps.sort(function (a, b) { return (a.min || 9e12) - (b.min || 9e12); });
      else if (o === 'precio-desc') ps.sort(function (a, b) { return b.max - a.max; });
      else if (o === 'nombre') ps.sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });
      return ps;
    }
    function urlEstado() {
      var u = new URLSearchParams();
      if (st.cat) u.set('cat', st.cat); if (st.sub) u.set('sub', st.sub); if (st.mat) u.set('mat', st.mat);
      if (st.amb) u.set('amb', st.amb); if (st.q) u.set('q', st.q);
      if (st.orden !== 'recientes') u.set('orden', st.orden); if (st.disp) u.set('disp', '1');
      var s = u.toString();
      history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
    }
    function pintar() {
      var ps = filtrar();
      var t = st.sub ? nombreSub(st.cat, st.sub) : st.cat ? nombreCat(st.cat) : st.mat ? nombreMat(st.mat) : (st.amb ? 'Ambiente: ' + AMBIENTES[st.amb] : 'Tienda');
      if (st.cat && st.mat) t += ' · ' + nombreMat(st.mat);
      titulo.textContent = t;
      sub.textContent = st.q ? 'Resultados para “' + st.q + '”' : (st.sub ? nombreCat(st.cat) : 'Artesanía paraguaya auténtica, hecha a mano.');
      document.title = t + ' — Casa Over All';
      // Migas de pan
      $('[data-migas-tienda]').innerHTML = '<a href="index.html">Inicio</a><span aria-hidden="true">›</span>' +
        (st.cat ? '<a href="tienda.html">Tienda</a><span aria-hidden="true">›</span>' +
          (st.sub ? '<a href="' + urlRuta(st.cat) + '">' + esc(nombreCat(st.cat)) + '</a><span aria-hidden="true">›</span><span>' + esc(nombreSub(st.cat, st.sub)) + '</span>'
            : '<span>' + esc(nombreCat(st.cat)) + '</span>') : '<span>Tienda</span>');
      pintarArbol();
      $$('[data-mat]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mat') === st.mat)); });
      info.textContent = ps.length === 1 ? '1 producto' : ps.length + ' productos';
      grid.innerHTML = ps.length ? ps.slice(0, st.n).map(function (p) { return tarjeta(p, st.cat); }).join('') :
        '<div class="vacio" style="grid-column:1/-1"><h2>No encontramos productos</h2><p>Probá con otra búsqueda o mirá todas las categorías.</p><a class="btn" href="tienda.html">Ver todos los productos</a></div>';
      mas.hidden = ps.length <= st.n;
      $$('[data-amb]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-amb') === st.amb)); });
      urlEstado();
    }
    $('[data-cats]').addEventListener('click', function (e) {
      var a = e.target.closest('[data-ruta]'); if (!a) return;
      e.preventDefault();
      var r = a.getAttribute('data-ruta').split('|');
      st.cat = r[0]; st.sub = r[1]; st.mat = r[2]; st.n = POR_PAGINA; pintar();
      // en celular se cierra el panel solo al elegir el último nivel disponible
      var elegido = $('[data-cats] [aria-current="true"]');
      var hayOtroNivel = elegido && elegido.parentNode.querySelector('ul');
      if (window.innerWidth < 960 && !hayOtroNivel) {
        $('.filtros').classList.remove('abierto'); $('.barra-res').scrollIntoView({ behavior: 'smooth' });
      }
    });
    $('[data-materiales]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-mat]'); if (!b) return;
      var v = b.getAttribute('data-mat'); st.mat = st.mat === v ? '' : v; st.n = POR_PAGINA; pintar();
    });
    $('[data-ambientes]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-amb]'); if (!b) return;
      var v = b.getAttribute('data-amb'); st.amb = st.amb === v ? '' : v; st.n = POR_PAGINA; pintar();
    });
    var deb;
    q.addEventListener('input', function () { clearTimeout(deb); deb = setTimeout(function () { st.q = q.value.trim(); st.n = POR_PAGINA; pintar(); }, 200); });
    $('#form-busqueda').addEventListener('submit', function (e) { e.preventDefault(); st.q = q.value.trim(); pintar(); });
    orden.addEventListener('change', function () { st.orden = orden.value; pintar(); });
    disp.addEventListener('change', function () { st.disp = disp.checked; st.n = POR_PAGINA; pintar(); });
    $('button', mas).addEventListener('click', function () { st.n += POR_PAGINA; pintar(); });
    var fb = $('.filtros-btn');
    fb.addEventListener('click', function () { var f = $('.filtros'); f.classList.toggle('abierto'); fb.setAttribute('aria-expanded', String(f.classList.contains('abierto'))); });
    pintar();
  }

  /* ---------- Ficha de producto ---------- */
  function paginaProducto() {
    var cont = $('[data-ficha]');
    var p = porSlug[param('p') || ''];
    if (!p) {
      cont.innerHTML = '<div class="vacio" style="margin:40px 0"><h1>Producto no encontrado</h1><p>Es posible que el producto ya no esté disponible.</p><a class="btn" href="tienda.html">Ir a la tienda</a></div>';
      document.title = 'Producto no encontrado — Casa Over All';
      return;
    }
    document.title = p.name + ' — Casa Over All';
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', (p.desc || p.name).slice(0, 155));
    var cat = catPrincipal(p);
    $('[data-migas]').innerHTML = '<a href="index.html">Inicio</a><span aria-hidden="true">›</span><a href="tienda.html">Tienda</a>' +
      (cat ? '<span aria-hidden="true">›</span><a href="' + urlRuta(cat.c) + '">' + esc(nombreCat(cat.c)) + '</a>' : '') +
      (cat && cat.s ? '<span aria-hidden="true">›</span><a href="' + urlRuta(cat.c, cat.s) + '">' + esc(nombreSub(cat.c, cat.s)) + '</a>' : '') +
      '<span aria-hidden="true">›</span><span>' + esc(p.name) + '</span>';

    // Atributos que definen variantes
    var claves = [];
    (p.vars || []).forEach(function (v) { Object.keys(v.a).forEach(function (k) { if (claves.indexOf(k) < 0) claves.push(k); }); });
    var opciones = {};
    claves.forEach(function (k) {
      var vals = [], cualquiera = false;
      p.vars.forEach(function (v) { if (v.a[k]) { if (vals.indexOf(v.a[k]) < 0) vals.push(v.a[k]); } else cualquiera = true; });
      if (cualquiera) {
        var at = (p.attrs || []).filter(function (a) { return a.n === k; })[0];
        if (at) at.v.forEach(function (x) { if (vals.indexOf(x) < 0) vals.push(x); });
      }
      opciones[k] = vals;
    });
    var otrosAttrs = (p.attrs || []).filter(function (a) { return claves.indexOf(a.n) < 0; });

    var imgs = p.imgs.length ? p.imgs : null;
    var galeria = imgs
      ? '<div class="galeria__principal"><img data-principal src="' + esc(imgs[0].f || imgs[0].t) + '" alt="' + esc(p.name) + '" width="1100" height="1100"></div>' +
        (imgs.length > 1 ? '<div class="galeria__miniaturas">' + imgs.map(function (im, k) {
          return '<button type="button" data-mini="' + esc(k === 0 ? (im.f || im.t) : im.t) + '" aria-label="Ver imagen ' + (k + 1) + '" aria-current="' + (k === 0) + '"><img src="' + esc(im.t) + '" alt="" loading="lazy"></button>';
        }).join('') + '</div>' : '')
      : '<div class="galeria__principal">' + PLACEHOLDER + '</div>';

    var sel = claves.map(function (k, idx) {
      return '<div class="opcion"><label for="op-' + idx + '">' + esc(k) + '</label><select id="op-' + idx + '" data-op="' + esc(k) + '">' +
        '<option value="">Elegí una opción</option>' + opciones[k].map(function (v) { return '<option>' + esc(v) + '</option>'; }).join('') + '</select></div>';
    }).join('');

    var waTxt = encodeURIComponent('¡Hola! Quisiera consultar por: ' + p.name + ' (' + location.href + ')');
    cont.innerHTML =
      '<div class="galeria">' + galeria + '</div>' +
      '<div class="ficha__info">' + (cat ? '<a class="card__cat" href="' + urlRuta(cat.c, cat.s) + '">' + esc(nombreCat(cat.c)) + (cat.s ? ' · ' + esc(nombreSub(cat.c, cat.s)) : '') + '</a>' : '') +
      '<h1>' + esc(p.name) + '</h1><div class="ficha__precio" data-precio>' + precioHTML(p) + '</div>' +
      (p.desc ? '<p class="ficha__desc">' + esc(p.desc) + '</p>' : '') +
      otrosAttrs.map(function (a) { return '<p><strong>' + esc(a.n) + ':</strong> ' + esc(a.v.join(', ')) + '</p>'; }).join('') +
      sel +
      '<div data-aviso></div>' +
      (p.stock && p.min ?
        '<div class="comprar"><div class="cantidad"><button type="button" data-menos aria-label="Restar uno">−</button>' +
        '<input type="number" id="cant" value="1" min="1" max="99" aria-label="Cantidad"><button type="button" data-mas-uno aria-label="Sumar uno">+</button></div>' +
        '<button class="btn" type="button" data-comprar' + (claves.length ? ' disabled' : '') + '>Agregar al carrito</button></div>'
        : '<p class="aviso' + (!p.stock ? ' aviso--error' : '') + '">' + (!p.stock ? 'Este producto está agotado por el momento.' : 'Escribinos para conocer el precio de este producto.') + '</p>') +
      '<p><a class="btn btn--wa" href="https://wa.me/' + WA_PEDIDOS + '?text=' + waTxt + '" target="_blank" rel="noopener">' + IC.wa + ' Consultar por WhatsApp</a></p>' +
      '<div class="meta">' + (p.sku ? '<p>Código: ' + esc(p.sku) + '</p>' : '') +
      '<p>Categorías: ' + p.rutas.map(function (r) {
        return '<a href="' + urlRuta(r.c) + '">' + esc(nombreCat(r.c)) + '</a>' +
          (r.s ? ' › <a href="' + urlRuta(r.c, r.s) + '">' + esc(nombreSub(r.c, r.s)) + '</a>' : '') +
          (r.m ? ' › <a href="' + urlRuta(r.c, r.s, r.m) + '">' + esc(nombreMat(r.m)) + '</a>' : '');
      }).join(' · ') + '</p>' +
      '<p>Cada pieza es hecha a mano, por lo que puede haber pequeñas variaciones que la hacen única.</p></div>' +
      '</div>';

    // Galería
    $$('[data-mini]').forEach(function (b) {
      b.addEventListener('click', function () {
        $('[data-principal]').src = b.getAttribute('data-mini');
        $$('[data-mini]').forEach(function (x) { x.setAttribute('aria-current', String(x === b)); });
      });
    });

    var elegida = null;
    function buscarVariante() {
      var s = {}; var completo = true;
      $$('[data-op]').forEach(function (e) { s[e.getAttribute('data-op')] = e.value; if (!e.value) completo = false; });
      var aviso = $('[data-aviso]'), btn = $('[data-comprar]');
      elegida = null;
      if (!completo) { aviso.innerHTML = ''; if (btn) btn.disabled = true; $('[data-precio]').innerHTML = precioHTML(p); return; }
      var v = p.vars.filter(function (v) { return claves.every(function (k) { return !v.a[k] || v.a[k] === s[k]; }); })[0];
      if (!v) { aviso.innerHTML = '<p class="aviso aviso--error">Esta combinación no está disponible. Probá con otra.</p>'; if (btn) btn.disabled = true; $('[data-precio]').innerHTML = precioHTML(p); return; }
      $('[data-precio]').innerHTML = '<span class="precio">' + fmt(v.p) + '</span>';
      if (!v.s) { aviso.innerHTML = '<p class="aviso aviso--error">Esta opción está agotada.</p>'; if (btn) btn.disabled = true; return; }
      aviso.innerHTML = ''; elegida = v; if (btn) btn.disabled = false;
    }
    $$('[data-op]').forEach(function (e) { e.addEventListener('change', buscarVariante); });
    var cant = $('#cant');
    if (cant) {
      $('[data-menos]').addEventListener('click', function () { cant.value = Math.max(1, (+cant.value || 1) - 1); });
      $('[data-mas-uno]').addEventListener('click', function () { cant.value = Math.min(99, (+cant.value || 1) + 1); });
      $('[data-comprar]').addEventListener('click', function () {
        if (claves.length && !elegida) return;
        var n = Math.max(1, Math.min(99, +cant.value || 1)); cant.value = n;
        carrito.agregar(p.id, elegida ? elegida.id : null, n);
        toast('“' + esc(p.name) + '” se agregó al carrito <a href="carrito.html">Ver carrito</a>');
      });
    }

    // Relacionados
    // Relacionados: primero de la misma subcategoría, después de la misma categoría
    var rel = !cat ? [] : D.products.filter(function (x) { return x.id !== p.id && x.stock && enRuta(x, cat.c, cat.s); })
      .concat(D.products.filter(function (x) { return x.id !== p.id && x.stock && enRuta(x, cat.c) && !enRuta(x, cat.c, cat.s); })).slice(0, 4);
    if (rel.length) { $('[data-relacionados]').innerHTML = rel.map(tarjeta).join(''); $('[data-rel-seccion]').hidden = false; }
  }

  /* ---------- Carrito ---------- */
  function paginaCarrito() {
    var cont = $('[data-carrito]');
    function pintar() {
      var it = carrito.items();
      if (!it.length) {
        cont.innerHTML = '<div class="vacio" style="grid-column:1/-1"><h2>Tu carrito está vacío</h2><p>Descubrí nuestras artesanías y agregá tus favoritas.</p><a class="btn" href="tienda.html">Ir a la tienda</a></div>';
        return;
      }
      var total = 0;
      var lineas = it.map(function (i, idx) {
        var p = porId[i.id], v = i.vid ? variante(p, i.vid) : null, pr = precioLinea(i); total += pr * i.q;
        var im = p.imgs[0] ? '<img src="' + esc(p.imgs[0].t) + '" alt="" loading="lazy">' : '<img src="img/logo-verde.png" alt="" style="object-fit:contain">';
        return '<div class="linea">' + im + '<div><h3><a href="producto.html?p=' + p.slug + '">' + esc(p.name) + '</a></h3>' +
          (v ? '<small>' + esc(textoVariante(v)) + '</small>' : '') + '<small>' + fmt(pr) + ' c/u</small></div>' +
          '<div class="linea__der"><div class="cantidad"><button type="button" data-l-menos="' + idx + '" aria-label="Restar uno">−</button>' +
          '<input type="number" value="' + i.q + '" min="1" max="99" data-l-cant="' + idx + '" aria-label="Cantidad de ' + esc(p.name) + '">' +
          '<button type="button" data-l-mas="' + idx + '" aria-label="Sumar uno">+</button></div>' +
          '<strong class="precio">' + fmt(pr * i.q) + '</strong><button type="button" class="quitar" data-quitar="' + idx + '">Quitar</button></div></div>';
      }).join('');
      var datos = store.get('overall_datos_v1') || {};
      cont.innerHTML = '<div><h2 class="visually-hidden">Productos</h2>' + lineas +
        '<p style="margin-top:18px"><button type="button" class="quitar" data-vaciar>Vaciar carrito</button></p></div>' +
        '<aside class="resumen" aria-labelledby="res-tit"><h2 id="res-tit">Resumen del pedido</h2>' +
        '<div class="resumen__fila"><span>Subtotal (' + carrito.cantidad() + ')</span><span>' + fmt(total) + '</span></div>' +
        '<div class="resumen__fila"><span>Envío</span><span>A coordinar</span></div>' +
        '<div class="resumen__fila resumen__total"><span>Total</span><span>' + fmt(total) + '</span></div>' +
        '<form class="form-pedido" data-form>' +
        '<label>Nombre y apellido<input type="text" name="nombre" required autocomplete="name" value="' + esc(datos.nombre || '') + '"></label>' +
        '<label>Entrega<select name="entrega">' +
        SUCURSALES.map(function (s) { return '<option>Retiro en ' + esc(s.nombre) + '</option>'; }).join('') +
        '<option value="envio">Envío a domicilio</option></select></label>' +
        '<label data-dir hidden>Dirección y ciudad<input type="text" name="direccion" autocomplete="street-address" value="' + esc(datos.direccion || '') + '"></label>' +
        '<label>Notas (opcional)<textarea name="notas" rows="2"></textarea></label>' +
        '<button class="btn btn--wa btn--bloque" type="submit">' + IC.wa + ' Enviar pedido por WhatsApp</button></form>' +
        '<p class="aviso">Te confirmamos disponibilidad, costo de envío y forma de pago por WhatsApp.</p></aside>';

      var form = $('[data-form]'), sel = form.entrega, dir = $('[data-dir]');
      sel.addEventListener('change', function () { dir.hidden = sel.value !== 'envio'; form.direccion.required = sel.value === 'envio'; });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        store.set('overall_datos_v1', { nombre: form.nombre.value, direccion: form.direccion.value });
        var txt = '¡Hola Over All! Quisiera hacer este pedido:\n\n' + carrito.items().map(function (i) {
          var p = porId[i.id], v = i.vid ? variante(p, i.vid) : null;
          return '• ' + i.q + ' × ' + p.name + (v ? ' (' + textoVariante(v) + ')' : '') + ' — ' + fmt(precioLinea(i) * i.q);
        }).join('\n') + '\n\nTotal: ' + fmt(total) +
          '\nNombre: ' + form.nombre.value +
          '\nEntrega: ' + (sel.value === 'envio' ? 'Envío a ' + form.direccion.value : sel.value) +
          (form.notas.value.trim() ? '\nNotas: ' + form.notas.value.trim() : '');
        window.open('https://wa.me/' + WA_PEDIDOS + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      });
    }
    cont.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      var it = carrito.items();
      if (t.hasAttribute('data-l-menos')) { var a = +t.getAttribute('data-l-menos'); carrito.cambiar(a, it[a].q - 1); pintar(); }
      else if (t.hasAttribute('data-l-mas')) { var b = +t.getAttribute('data-l-mas'); carrito.cambiar(b, it[b].q + 1); pintar(); }
      else if (t.hasAttribute('data-quitar')) { carrito.quitar(+t.getAttribute('data-quitar')); pintar(); }
      else if (t.hasAttribute('data-vaciar')) { if (confirm('¿Vaciar el carrito?')) { carrito.vaciar(); pintar(); } }
    });
    cont.addEventListener('change', function (e) {
      if (e.target.hasAttribute('data-l-cant')) { carrito.cambiar(+e.target.getAttribute('data-l-cant'), +e.target.value || 1); pintar(); }
    });
    pintar();
  }

  /* ---------- Arranque ---------- */
  pintarCabecera();
  pintarPie();
  burbujaWA();
  actualizarBadge();
  window.addEventListener('storage', actualizarBadge);
  var pg = document.body.getAttribute('data-pagina');
  if (pg === 'inicio') paginaInicio();
  if (pg === 'tienda') paginaTienda();
  if (pg === 'producto') paginaProducto();
  if (pg === 'carrito') paginaCarrito();
  listas();
})();
