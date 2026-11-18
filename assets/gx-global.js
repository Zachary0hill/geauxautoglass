/* ==========================================================================
   Geaux Auto Glass theme · global behaviours
   Header menu, mobile drawer, search + predictive search, cart count, AJAX
   add-to-cart with a toast, quantity inputs, localization forms. Vanilla,
   no dependencies, safe to re-run on theme editor section reloads.
   ========================================================================== */
(function () {
  'use strict';

  var H = window.GX || { routes: {}, strings: {} };

  /* ---------------------------------------------------------- utilities */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function debounce(fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; }

  function formatMoney(cents, format) {
    var fmt = format || H.moneyFormat || '${{amount}}';
    var value = '';
    var placeholder = /\{\{\s*(\w+)\s*\}\}/;
    function withDelims(num, precision, thousands, decimal) {
      thousands = thousands || ','; decimal = decimal || '.';
      if (isNaN(num) || num == null) return '0';
      num = (num / 100).toFixed(precision);
      var parts = num.split('.');
      var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var c = parts[1] ? decimal + parts[1] : '';
      return dollars + c;
    }
    var m = fmt.match(placeholder);
    switch (m && m[1]) {
      case 'amount': value = withDelims(cents, 2); break;
      case 'amount_no_decimals': value = withDelims(cents, 0); break;
      case 'amount_with_comma_separator': value = withDelims(cents, 2, '.', ','); break;
      case 'amount_no_decimals_with_comma_separator': value = withDelims(cents, 0, '.', ','); break;
      case 'amount_with_apostrophe_separator': value = withDelims(cents, 2, "'", '.'); break;
      default: value = withDelims(cents, 2);
    }
    return fmt.replace(placeholder, value);
  }
  window.GX.formatMoney = formatMoney;

  /* ------------------------------------------------------------- toast */
  var toastTimer;
  function toast(text, opts) {
    var el = $('#BrToast'); if (!el) return;
    opts = opts || {};
    $('.br-toast__text', el).textContent = text;
    var link = $('.br-toast__link', el);
    if (link) link.hidden = !opts.link;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, opts.ms || 4200);
  }
  window.GX.toast = toast;
  document.addEventListener('click', function (e) {
    if (e.target.closest('.br-toast__close')) { var el = $('#BrToast'); if (el) el.hidden = true; }
  });

  /* ------------------------------------------------------------ header */
  function initHeader(root) {
    root = root || document;
    var header = $('.br-header', root); if (!header || header.__brInit) return;
    header.__brInit = true;
    if (!header.classList.contains('br-header--static') && header.parentElement) header.parentElement.classList.add('br-header-wrap--sticky');

    // Glass header (home page): paper ground and dark ink once the reader has
    // scrolled past the top of the cover, or whenever a menu, the search or
    // the drawer is open and needs a ground to sit on.
    var overlay = header.classList.contains('br-header--overlay');
    var search = null;
    var stateRAF = null;
    function syncHeaderState() {
      stateRAF = null;
      if (!overlay) return;
      var solid = window.scrollY > 24
        || !!$('.br-nav__item.is-open', header)
        || !!(search && !search.hidden)
        || document.body.classList.contains('br-drawer-open');
      header.classList.toggle('is-solid', solid);
    }
    function queueHeaderState() { if (overlay && !stateRAF) stateRAF = requestAnimationFrame(syncHeaderState); }

    // The height of everything above the page content, for the cover to fill
    // the first screen exactly (the CSS carries the at-rest value; this
    // corrects for a wrapped announcement line or a taller logo).
    function measureTop() {
      var announce = $('.br-announce');
      var top = announce ? announce.getBoundingClientRect().height : 0;
      if (!overlay) top += header.getBoundingClientRect().height;
      document.body.style.setProperty('--br-top-h', top.toFixed(2) + 'px');
    }

    // Desktop dropdowns: hover opens them on a mouse, click still toggles (and
    // is what the keyboard uses), Escape and an outside click close them.
    var navItems = $$('.br-nav__item--has-sub', header);
    var hoverMenus = window.matchMedia('(min-width: 990px) and (hover: hover) and (pointer: fine)');
    var hoverTimer = null;

    function closeItem(item) {
      item.classList.remove('is-open');
      var btn = $('.br-nav__link', item);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
    function closeMenus(except) {
      navItems.forEach(function (o) { if (o !== except) closeItem(o); });
      queueHeaderState();
    }
    // Anchor the panel to the right edge of its item when the left-anchored
    // one would run off the window.
    function placeSub(item) {
      var sub = $('.br-nav__sub', item); if (!sub) return;
      sub.classList.remove('br-nav__sub--right');
      if (sub.getBoundingClientRect().right > window.innerWidth - 16) sub.classList.add('br-nav__sub--right');
    }
    function openItem(item) {
      closeMenus(item);
      if (item.classList.contains('is-open')) return;
      item.classList.add('is-open');
      var btn = $('.br-nav__link', item);
      if (btn) btn.setAttribute('aria-expanded', 'true');
      placeSub(item);
      queueHeaderState();
    }

    navItems.forEach(function (item) {
      var btn = $('.br-nav__link', item);
      if (btn) btn.addEventListener('click', function (e) {
        e.preventDefault();
        clearTimeout(hoverTimer);
        if (item.classList.contains('is-open')) { closeItem(item); queueHeaderState(); }
        else openItem(item);
      });
      item.addEventListener('mouseenter', function () {
        if (!hoverMenus.matches) return;
        clearTimeout(hoverTimer);
        // Cross straight over to a sibling once a panel is down; from rest,
        // wait a beat so sweeping past the bar doesn't flash panels open.
        var open = navItems.some(function (o) { return o.classList.contains('is-open'); });
        if (open) { openItem(item); return; }
        hoverTimer = setTimeout(function () { openItem(item); }, 90);
      });
      item.addEventListener('mouseleave', function () {
        if (!hoverMenus.matches) return;
        clearTimeout(hoverTimer);
        // A grace period, so clipping a corner on the way to a link is forgiven.
        hoverTimer = setTimeout(function () { closeItem(item); queueHeaderState(); }, 200);
      });
    });

    // Tabbing out of the nav leaves nothing hanging open.
    var nav = $('.br-nav', header);
    if (nav) nav.addEventListener('focusout', function (e) {
      if (nav.contains(e.relatedTarget)) return;
      closeMenus();
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest('.br-nav__item--has-sub')) return;
      clearTimeout(hoverTimer);
      closeMenus();
    });
    header.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      clearTimeout(hoverTimer);
      navItems.forEach(function (o) {
        if (!o.classList.contains('is-open')) return;
        closeItem(o);
        var b = $('.br-nav__link', o); if (b) b.focus();
      });
      queueHeaderState();
    });

    // Mobile drawer
    var drawer = $('.br-drawer', root);
    var toggle = $('.br-header__menu-toggle', header);
    var lastFocus = null;
    function openDrawer() {
      if (!drawer) return;
      lastFocus = document.activeElement;
      drawer.setAttribute('open', '');
      document.body.classList.add('br-drawer-open');
      queueHeaderState();
      toggle && toggle.setAttribute('aria-expanded', 'true');
      var first = $('.br-drawer__close', drawer); if (first) first.focus();
    }
    function closeDrawer() {
      if (!drawer) return;
      drawer.removeAttribute('open');
      document.body.classList.remove('br-drawer-open');
      queueHeaderState();
      toggle && toggle.setAttribute('aria-expanded', 'false');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    if (toggle && drawer) {
      toggle.addEventListener('click', openDrawer);
      $$('.br-drawer__close, .br-drawer__scrim', drawer).forEach(function (el) { el.addEventListener('click', closeDrawer); });
      drawer.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeDrawer(); return; }
        if (e.key !== 'Tab') return;
        var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', drawer).filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    }

    // Search overlay
    var searchToggle = $('.br-header__search-toggle', header);
    search = $('.br-search', root);
    if (searchToggle && search) {
      var input = $('input[type="search"]', search);
      function openSearch() {
        search.hidden = false;
        document.body.classList.add('br-drawer-open');
        queueHeaderState();
        requestAnimationFrame(function () { search.classList.add('is-open'); });
        searchToggle.setAttribute('aria-expanded', 'true');
        if (input) { input.focus(); input.select(); }
      }
      function closeSearch() {
        search.classList.remove('is-open');
        document.body.classList.remove('br-drawer-open');
        setTimeout(function () { search.hidden = true; queueHeaderState(); }, 240);
        searchToggle.setAttribute('aria-expanded', 'false');
        searchToggle.focus();
      }
      searchToggle.addEventListener('click', function () { if (search.hidden) openSearch(); else closeSearch(); });
      search.addEventListener('click', function (e) { if (e.target.closest('[data-search-close]')) closeSearch(); });
      search.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSearch(); });
      document.addEventListener('keydown', function (e) { if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && search.hidden && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); } });
    }

    measureTop();
    syncHeaderState();
    addEventListener('scroll', queueHeaderState, { passive: true });
    addEventListener('resize', debounce(measureTop, 120));
    addEventListener('load', measureTop);
  }

  /* -------------------------------------------------------------- cover */
  // First load: the lights come on once the plate has decoded. The cap keeps a
  // slow image from holding the copy back; the plate itself fades in on its
  // own load so it never pops. A page that arrives already scrolled (refresh
  // mid-page, back navigation) skips the choreography.
  function initCover(root) {
    $$('.cover', root || document).forEach(function (cover) {
      if (cover.__brLit) return; cover.__brLit = true;
      var plate = $('.cover__plate', cover);
      var instant = window.scrollY > 80;
      var lit = false, cap = null;
      function light() {
        if (lit) return; lit = true; clearTimeout(cap);
        if (instant) cover.classList.add('cover--instant');
        cover.classList.add('cover--lit');
      }
      if (plate) {
        var loaded = function () { plate.classList.add('is-loaded'); light(); };
        if (plate.complete) {
          if (plate.decode) plate.decode().then(loaded, loaded); else loaded();
        } else {
          plate.addEventListener('load', loaded, { once: true });
          plate.addEventListener('error', loaded, { once: true });
        }
      }
      if (instant || !plate) light(); else cap = setTimeout(light, 1400);
    });
  }
  // The strip's scroll cue takes the reader to whatever follows the cover.
  document.addEventListener('click', function (e) {
    var cue = e.target.closest('[data-cover-scroll]'); if (!cue) return;
    var cover = cue.closest('.cover'); if (!cover) return;
    var wrap = cover.closest('.shopify-section') || cover;
    var next = wrap.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* -------------------------------------------------- predictive search */
  function initPredictive(root) {
    $$('[data-predictive-search]', root || document).forEach(function (form) {
      if (form.__brInit) return; form.__brInit = true;
      var input = $('input[type="search"]', form);
      var results = $('[data-predictive-results]', form.parentElement) || $('[data-predictive-results]', form);
      if (!input || !results) return;
      var controller = null;
      var def = $('[data-search-default]', form.parentElement);
      var run = debounce(function () {
        var q = input.value.trim();
        if (q.length < 2) { results.innerHTML = ''; if (def) def.hidden = false; return; }
        if (def) def.hidden = true;
        if (controller) controller.abort();
        controller = new AbortController();
        var url = (H.routes.predictiveSearch || '/search/suggest') + '?q=' + encodeURIComponent(q) + '&resources[type]=product,collection,page,article&resources[limit]=6&resources[limit_scope]=each&section_id=predictive-search';
        fetch(url, { signal: controller.signal })
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var inner = doc.querySelector('#shopify-section-predictive-search');
            results.innerHTML = inner ? inner.innerHTML : '';
          })
          .catch(function () {});
      }, 220);
      input.addEventListener('input', run);
    });
  }

  /* ---------------------------------------------------------- quantity */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.quantity__button'); if (!btn) return;
    var wrap = btn.closest('.quantity'); var input = wrap && $('input', wrap); if (!input) return;
    var step = parseInt(input.step || '1', 10) || 1;
    var min = parseInt(input.min || '0', 10) || 0;
    var max = input.max ? parseInt(input.max, 10) : Infinity;
    var v = parseInt(input.value || '0', 10) || 0;
    v = btn.dataset.dir === 'down' ? v - step : v + step;
    v = Math.max(min, Math.min(max, v));
    input.value = v;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* -------------------------------------------------------- cart count */
  function setCartCount(n) {
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.hidden = !(n > 0);
    });
  }
  window.GX.setCartCount = setCartCount;

  /* ------------------------------------------------ AJAX add to cart */
  function initProductForms(root) {
    $$('form[data-product-form]', root || document).forEach(function (form) {
      if (form.__brInit) return; form.__brInit = true;
      form.addEventListener('submit', function (e) {
        if (!window.fetch || form.hasAttribute('data-no-ajax')) return;
        e.preventDefault();
        var btn = $('[type="submit"]', form);
        var err = $('[data-form-error]', form);
        if (err) { err.hidden = true; err.textContent = ''; }
        if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.classList.add('is-loading'); }
        var fd = new FormData(form);
        fd.append('sections', 'header');
        fetch(H.routes.cartAdd || '/cart/add', { method: 'POST', body: fd, headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
          .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
          .then(function (res) {
            if (!res.ok) {
              var msg = res.body && (res.body.description || res.body.message) || H.strings.cartError;
              if (err) { err.textContent = msg; err.hidden = false; } else toast(msg);
              return;
            }
            fetch((H.routes.cart || '/cart') + '.js').then(function (r) { return r.json(); }).then(function (c) { setCartCount(c.item_count); });
            if (!$('#CartDrawer')) toast(H.strings.addedToCart || 'Added to cart', { link: true });
            document.dispatchEvent(new CustomEvent('gx:cart:added', { detail: res.body }));
          })
          .catch(function () { if (err) { err.textContent = H.strings.cartError; err.hidden = false; } })
          .then(function () { if (btn) { btn.removeAttribute('aria-disabled'); btn.classList.remove('is-loading'); } });
      });
    });
  }

  /* --------------------------------------------------- localization */
  function initLocalization(root) {
    $$('form[data-localization-form]', root || document).forEach(function (form) {
      if (form.__brInit) return; form.__brInit = true;
      $$('select', form).forEach(function (sel) {
        sel.addEventListener('change', function () {
          var hidden = $('input[name="' + sel.dataset.target + '"]', form);
          if (hidden) hidden.value = sel.value;
          form.submit();
        });
      });
    });
  }

  /* ---------------------------------------------------------- share */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-share-copy]'); if (!btn) return;
    var input = $(btn.dataset.shareCopy);
    var url = input ? input.value : location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast(btn.dataset.copied || 'Link copied'); });
    else if (input) { input.select(); document.execCommand('copy'); toast(btn.dataset.copied || 'Link copied'); }
  });

  /* ------------------------------------------------------------ boot */
  function init(root) {
    initHeader(root);
    initCover(root);
    initPredictive(root);
    initProductForms(root);
    initLocalization(root);
  }
  window.GX.init = init;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();

  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
