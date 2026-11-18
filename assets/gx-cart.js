/* ==========================================================================
   Geaux Auto Glass theme · cart page
   Quantity changes and removals post to /cart/change.js, then the section is
   re-rendered from Shopify's own HTML so totals, discounts and the header
   count all stay correct. Falls back to the plain form without JavaScript.
   ========================================================================== */
(function () {
  'use strict';
  var H = window.GX || { routes: {}, strings: {} };
  function $(s, c) { return (c || document).querySelector(s); }

  function init(root) {
    var wrap = $('[data-cart-section]', root || document);
    if (!wrap || wrap.__brCart) return; wrap.__brCart = true;
    var sid = wrap.dataset.sectionId;
    var busy = false;

    function change(line, qty) {
      if (busy) return; busy = true;
      var err = $('[data-line-error="' + line + '"]', wrap);
      if (err) err.textContent = '';
      wrap.classList.add('is-loading');
      fetch(H.routes.cartChange || '/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ line: line, quantity: qty, sections: sid, sections_url: location.pathname })
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (!res.ok) {
            var msg = res.body && (res.body.description || res.body.message) || H.strings.cartError;
            if (err) err.textContent = msg; else if (window.GX.toast) window.GX.toast(msg);
            return;
          }
          var html = res.body.sections && res.body.sections[sid];
          if (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var fresh = doc.querySelector('[data-cart-section]');
            if (fresh) { wrap.innerHTML = fresh.innerHTML; wrap.__brCart = false; init(document); }
          }
          if (window.GX.setCartCount) window.GX.setCartCount(res.body.item_count);
        })
        .catch(function () { if (window.GX.toast) window.GX.toast(H.strings.cartError || 'Something went wrong'); })
        .then(function () { busy = false; wrap.classList.remove('is-loading'); });
    }

    wrap.addEventListener('change', function (e) {
      var input = e.target.closest('.quantity__input[data-index]'); if (!input) return;
      change(parseInt(input.dataset.index, 10), Math.max(0, parseInt(input.value, 10) || 0));
    });
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove-line]'); if (!btn) return;
      e.preventDefault();
      change(parseInt(btn.dataset.removeLine, 10), 0);
    });
    var note = $('#CartNote', wrap);
    if (note) {
      var t;
      note.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () {
          fetch(H.routes.cartUpdate || '/cart/update.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note: note.value }) }).catch(function () {});
        }, 500);
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); }); else init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
