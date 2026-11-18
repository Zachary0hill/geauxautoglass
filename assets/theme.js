/* Geaux Auto Glass: page behavior. Port of site/main.js from the handoff.
   The engine (scrollcraft.js) drives every data-sc-* attribute; this file
   mounts it and owns the header, the phone tab bar, the scroll-linked image
   reveals, the before and after wipe, the footer, the map toggle, the
   signature video and the merch filter. phone.js has already rewritten the
   act attributes for phones before this file runs.
   Changes from main.js, for Shopify only:
   - social counts are printed by Liquid (no social-counts.js);
   - everything is re-grabbed after a theme editor edit, and the engine is
     re-mounted on the edited DOM;
   - clicks are delegated, so re-rendered sections keep working. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phone = matchMedia('(max-width: 860px)');
  var GX = window.GX || {};
  var motionOn = GX.motion !== false;
  var root = document.documentElement;
  var still = reduce || !motionOn;
  if (!still) root.classList.add('ap-ready');

  /* ---- engine ---- */
  var engine = null;
  function mount() {
    if (!motionOn || !window.ScrollCraft) return;
    // The engine has no destroy. Empty the previous instance's acts so it stops
    // driving the page, then let a fresh instance measure the edited DOM.
    if (engine && engine.acts) engine.acts.length = 0;
    engine = window.ScrollCraft.mount(document.body);
  }
  mount();

  // phone.js runs once over the document. A section the editor re-renders comes
  // back with the authored attributes, so rewrite it the same way.
  function phoneRewrite(scope) {
    var each = function (s, fn) { Array.prototype.forEach.call(scope.querySelectorAll(s), fn); };
    if (reduce) {
      each('[data-sc-count]', function (el) { el.removeAttribute('data-sc-count'); });
      each('[data-sc-act="pin"]', function (act) {
        var s = parseFloat(act.getAttribute('data-sc-span') || '1.5');
        if (s > 1.3) act.setAttribute('data-sc-span', '1.25');
        act.removeAttribute('data-phone-span');
      });
    }
    if (phone.matches) {
      each('[data-phone-flow]', function (act) {
        act.setAttribute('data-sc-act', 'flow'); act.removeAttribute('data-sc-span');
        Array.prototype.forEach.call(act.querySelectorAll('[data-sc-cue]'), function (el) { el.removeAttribute('data-sc-cue'); });
        Array.prototype.forEach.call(act.querySelectorAll('[data-phone-in]'), function (el) { el.setAttribute('data-sc-in', ''); el.setAttribute('data-sc-stagger', el.getAttribute('data-phone-in') || '70'); });
      });
      each('[data-phone-span]', function (act) { act.setAttribute('data-sc-span', act.getAttribute('data-phone-span')); });
    }
    each('.ba[data-video]', function (fig) {
      if (!fig.getAttribute('data-video')) return;
      var act = fig.closest('[data-sc-act]');
      if (act) { act.setAttribute('data-sc-span', '1.3'); act.setAttribute('data-phone-span', '1.2'); }
    });
  }

  /* ---- smooth anchor scroll (same page only) ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    var el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---- elements ---- */
  var bar, tab, slides, sigAct, ba, foot, heroStage, heroPhoto, heroCopy;
  var lastY = scrollY, downRun = 0, upRun = 0, ticking = false;
  function grab() {
    bar = document.querySelector('.bar');
    tab = document.querySelector('.tabbar');
    slides = still ? [] : Array.prototype.slice.call(document.querySelectorAll('.slide, .glint'));
    sigAct = document.querySelector('.act-sig');
    ba = document.querySelector('.ba');
    foot = document.querySelector('.vanfoot');
    heroStage = document.querySelector('.hero');
    heroPhoto = document.querySelector('.hero__photo');
    heroCopy = document.querySelector('.hero .sc-copy--lead');
    dots();
    video();
  }

  // Scroll-linked image reveals: --rv 0..1 per figure. Starts 12% of a screen
  // below the fold, complete when the figure top reaches 62% of the screen.
  function reveal() {
    var vh = innerHeight;
    for (var i = 0; i < slides.length; i++) {
      var el = slides[i];
      var t = (vh * 1.12 - el.getBoundingClientRect().top) / (vh * 0.5);
      t = t < 0 ? 0 : t > 1 ? 1 : t; t = t * t * (3 - 2 * t);
      if (el._rv !== t) { el._rv = t; el.style.setProperty('--rv', t.toFixed(3)); }
    }
  }

  // SIGNATURE MOVE: the back glass goes in as the reader scrolls. --w 0..1 is
  // the share of the frame showing the finished job. The knob carries the mark.
  function wipe() {
    if (!ba || !sigAct || ba.classList.contains('ba--video')) return;
    if (still) { ba.style.setProperty('--w', '0.5'); return; }
    var r = sigAct.getBoundingClientRect();
    var travel = Math.max(r.height - innerHeight, 1);
    var p = (-r.top) / travel;
    var t = (p - 0.08) / 0.74;
    t = t < 0 ? 0 : t > 1 ? 1 : t; t = t * t * (3 - 2 * t);
    var w = 0.06 + t * 0.94;
    if (ba._w !== w) { ba._w = w; ba.style.setProperty('--w', w.toFixed(4)); }
  }

  function chrome() {
    var y = scrollY, d = y - lastY; lastY = y;
    if (bar) {
      bar.classList.toggle('bar--solid', y > innerHeight * 0.55);
      bar.classList.toggle('bar--compact', y > 72);
    }
    if (!tab) return;
    if (!phone.matches || document.body.classList.contains('menu-locked')) return;
    if (d > 0) { downRun += d; upRun = 0; } else if (d < 0) { upRun -= d; downRun = 0; }
    var nearTop = y < 80;
    var nearEnd = y + innerHeight > document.documentElement.scrollHeight - 40;
    var hide = tab.classList.contains('tabbar--hidden');
    if (nearTop || nearEnd) hide = false;
    else if (downRun > 28) hide = true;
    else if (upRun > 14) hide = false;
    tab.classList.toggle('tabbar--hidden', hide);
    document.body.classList.toggle('tab-hidden', hide);
  }

  // Review row on phones: the dots follow the swipe.
  function dots() {
    Array.prototype.forEach.call(document.querySelectorAll('.revs'), function (revs) {
      if (revs._dots) return;
      var wrap = revs.parentNode.querySelector('.revs__dots');
      if (!wrap) return;
      revs._dots = true;
      revs.addEventListener('scroll', function () {
        var marks = wrap.querySelectorAll('i');
        var max = revs.scrollWidth - revs.clientWidth;
        var k = max > 0 ? Math.round(revs.scrollLeft / max * (marks.length - 1)) : 0;
        for (var i = 0; i < marks.length; i++) marks[i].classList.toggle('on', i === k);
      }, { passive: true });
    });
  }

  // Footer: the van lettering ticker and the diamond mark follow the scroll.
  // --fp runs 0..1 from the footer's top entering the screen to the page end.
  function footer() {
    if (!foot || still) return;
    var r = foot.getBoundingClientRect();
    var p = (innerHeight - r.top) / Math.max(Math.min(r.height, innerHeight), 1);
    p = p < 0 ? 0 : p > 1 ? 1 : p;
    var e = 1 - Math.pow(1 - p, 2);
    if (foot._p !== e) { foot._p = e; foot.style.setProperty('--fp', e.toFixed(4)); }
  }

  // Phone hero: the cover photo is a band that runs from the top of the screen
  // to the top of the copy, so a wide shot shows whole at any screen height.
  // Measured at rest only. Without it the stylesheet holds the band at 46%.
  function heroBand() {
    if (!heroStage || !heroPhoto || !heroCopy) return;
    if (!phone.matches) { heroPhoto.style.height = ''; return; }
    if (scrollY > 40 || document.body.classList.contains('tab-hidden')) return;
    var s = heroStage.getBoundingClientRect(), c = heroCopy.getBoundingClientRect();
    var h = Math.round(c.top - s.top + 56);
    h = Math.max(150, Math.min(h, s.height * 0.6));
    heroPhoto.style.height = h + 'px';
  }

  // Location cards: "Show map" swaps the photo for a Google map of that shop.
  // The map loads on the first press, so the page stays light until someone asks for it.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.loc__map');
    if (!btn) return;
    var fig = btn.closest('.loc').querySelector('.loc__fig');
    var map = fig.querySelector('iframe');
    var on = btn.getAttribute('aria-pressed') !== 'true';
    if (on && !map) {
      map = document.createElement('iframe');
      map.src = btn.getAttribute('data-map');
      map.title = btn.getAttribute('data-map-title');
      map.loading = 'lazy';
      map.referrerPolicy = 'no-referrer-when-downgrade';
      fig.appendChild(map);
    }
    if (map) map.hidden = !on;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? (btn.getAttribute('data-label-on') || 'Show photo') : (btn.getAttribute('data-label-off') || 'Show map');
  });

  // Signature video: when the figure names a file in data-video, a muted loop
  // replaces the before and after wipe. It plays only while it is on screen.
  function video() {
    var fig = document.querySelector('.ba[data-video]');
    if (!fig || !fig.getAttribute('data-video') || fig.classList.contains('ba--video')) return;
    var vid = document.createElement('video');
    vid.muted = true; vid.defaultMuted = true; vid.loop = true; vid.playsInline = true; vid.preload = 'metadata';
    vid.setAttribute('muted', ''); vid.setAttribute('playsinline', '');
    vid.setAttribute('aria-label', fig.getAttribute('data-video-label') || 'Glass out, glass in. Muted video of a replacement.');
    vid.src = fig.getAttribute('data-video');
    if (reduce) vid.controls = true;
    fig.appendChild(vid);
    fig.classList.add('ba--video');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting && !reduce) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
          else vid.pause();
        });
      }, { threshold: 0.35 }).observe(fig);
    }
  }

  // Merch grid: filter chips. Buttons with aria-pressed; other types get the hidden attribute.
  document.addEventListener('click', function (e) {
    var chip = e.target.closest && e.target.closest('.chip[data-filter]');
    if (!chip) return;
    var scope = chip.closest('.shopify-section') || document;
    var f = chip.getAttribute('data-filter');
    Array.prototype.forEach.call(scope.querySelectorAll('.chip[data-filter]'), function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
    Array.prototype.forEach.call(scope.querySelectorAll('.mitem'), function (it) { it.hidden = f !== 'all' && it.getAttribute('data-type') !== f; });
  });

  // Cart count in the header, kept current after an add.
  function setCount(n) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-cart-count]'), function (el) { el.textContent = n; });
  }
  document.addEventListener('gx:cart:added', function () {
    fetch(((GX.routes && GX.routes.cart) || '/cart') + '.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); }).then(function (c) { setCount(c.item_count); }).catch(function () {});
  });

  function frame() { ticking = false; reveal(); wipe(); footer(); chrome(); }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  grab();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { onScroll(); heroBand(); });
  addEventListener('load', function () { onScroll(); heroBand(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(heroBand);
  heroBand();
  frame();

  /* ---- theme editor ---- */
  // The engine measures the DOM once at mount; every edit replaces a section.
  function refresh(e) {
    if (e && e.type === 'shopify:section:load' && e.target) phoneRewrite(e.target);
    grab(); heroBand(); frame();
    mount();
  }
  document.addEventListener('shopify:section:load', refresh);
  document.addEventListener('shopify:section:unload', function () { setTimeout(refresh, 0); });
  document.addEventListener('shopify:section:reorder', refresh);
})();
