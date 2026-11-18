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

  // phone.js rewrites the acts for the screen it loaded on, and can undo it.
  // When the screen crosses the breakpoint (a tablet turned on its side, the
  // editor's mobile preview) the rewrite runs again and the engine re-mounts.
  // What the old instance wrote on acts that changed device comes off first:
  // a pin that is now flow loses its height and stage, a cue that is now an
  // entry reveal loses its inline opacity.
  function rebreak() {
    if (!window.GXPhone) return;
    window.GXPhone.apply(document);
    Array.prototype.forEach.call(document.querySelectorAll('.sc-act--pinned'), function (act) {
      if (/^(pin|scrub|pan)$/.test(act.getAttribute('data-sc-act') || '')) return;
      act.classList.remove('sc-act--pinned'); act.style.height = '';
      var stage = act.querySelector('.sc-stage'); if (stage) stage.classList.remove('sc-stage');
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-gx-desk]'), function (el) {
      if (!el.__gxDesk || el.__gxDesk.cue === null || el.hasAttribute('data-sc-cue')) return;
      el.style.opacity = ''; el.style.transform = ''; el.style.pointerEvents = '';
    });
    grab(); mount(); heroBand(); frame();
  }
  if (phone.addEventListener) phone.addEventListener('change', rebreak); else if (phone.addListener) phone.addListener(rebreak);

  /* ---- smooth anchor scroll (same page only) ---- */
  // The jump goes in the history, so Back returns to where the reader was and
  // the address can be shared. Focus follows the jump for keyboards and readers.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    var el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    if (location.hash !== url.hash && history.pushState) history.pushState(null, '', url.hash);
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!el.hasAttribute('tabindex')) { el.setAttribute('tabindex', '-1'); el.setAttribute('data-gx-jump', ''); }
    try { el.focus({ preventScroll: true }); } catch (err) {}
  });

  /* ---- scroll-linked values, with weight ---- */
  // A mouse wheel and the keyboard move the page in steps, and a value tied
  // straight to the scroll position steps with them. Each value follows its
  // target a fraction per frame instead, so a wipe or a reveal glides to rest.
  // Touch scrolling is already continuous and stays direct. The first write
  // of a value is never eased, so a page that loads mid-way is simply there.
  var EASE = (still || matchMedia('(pointer: coarse)').matches) ? 1 : 0.22;
  var gliding = [], glideOn = false, glideT = 0;
  function put(rec) { rec.el.style.setProperty(rec.prop, rec.cur.toFixed(rec.digits)); }
  function aim(el, prop, target, digits) {
    var recs = el.__gxAim || (el.__gxAim = {}), rec = recs[prop];
    if (!rec) { rec = recs[prop] = { el: el, prop: prop, cur: target, target: target, digits: digits, on: false }; put(rec); return; }
    if (rec.target === target) return;
    rec.target = target;
    if (EASE >= 1) { rec.cur = target; put(rec); return; }
    if (!rec.on) { rec.on = true; gliding.push(rec); }
    if (!glideOn) { glideOn = true; glideT = 0; requestAnimationFrame(glide); }
  }
  function glide(now) {
    var dt = glideT ? Math.min(now - glideT, 50) : 16.7; glideT = now;
    var k = 1 - Math.pow(1 - EASE, dt / 16.7);
    for (var i = gliding.length - 1; i >= 0; i--) {
      var rec = gliding[i], d = rec.target - rec.cur;
      if (Math.abs(d) < 0.002) { rec.cur = rec.target; rec.on = false; gliding.splice(i, 1); }
      else rec.cur += d * k;
      put(rec);
    }
    if (gliding.length) requestAnimationFrame(glide); else glideOn = false;
  }

  /* ---- entry reveals the reader lands past ---- */
  // The engine reveals a block when it comes up from below. A block the reader
  // arrives beyond (a restored scroll position, an anchor jump, Back) never
  // does, and would rise in the wrong direction on the way back up. Those are
  // settled in place, as is anything that takes keyboard focus while hidden.
  var pending = [];
  function show(el) {
    el.classList.add('gx-settled'); el.classList.add('sc-in');
    if (el.hasAttribute('data-sc-stagger')) Array.prototype.forEach.call(el.children, function (kid) { kid.classList.add('sc-in'); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove('gx-settled'); }); });
  }
  function settle() {
    if (!pending.length) return;
    var keep = [];
    for (var i = 0; i < pending.length; i++) {
      var el = pending[i];
      if (el.classList.contains('sc-in') || !el.isConnected) continue;
      if (el.getBoundingClientRect().bottom < 0) show(el); else keep.push(el);
    }
    pending = keep;
  }
  document.addEventListener('focusin', function (e) {
    var el = e.target && e.target.closest && e.target.closest('[data-sc-in]:not(.sc-in)');
    if (el && motionOn) show(el);
  });

  /* ---- elements ---- */
  var bar, tab, slides, sigAct, ba, foot, heroStage, heroPhoto, heroCopy;
  var lastY = scrollY, downRun = 0, upRun = 0, ticking = false;
  function grab() {
    bar = document.querySelector('.bar');
    tab = document.querySelector('.tabbar');
    slides = still ? [] : Array.prototype.slice.call(document.querySelectorAll('.slide, .glint'));
    pending = motionOn ? Array.prototype.slice.call(document.querySelectorAll('[data-sc-in]:not(.sc-in)')) : [];
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
      aim(el, '--rv', t, 3);
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
    aim(ba, '--w', w, 4);
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
    aim(foot, '--fp', e, 4);
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

  function frame() { ticking = false; settle(); reveal(); wipe(); footer(); chrome(); }
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
    if (e && e.type === 'shopify:section:load' && e.target && window.GXPhone) window.GXPhone.apply(e.target);
    grab(); heroBand(); frame();
    mount();
  }
  document.addEventListener('shopify:section:load', refresh);
  document.addEventListener('shopify:section:unload', function () { setTimeout(refresh, 0); });
  document.addEventListener('shopify:section:reorder', refresh);
})();
