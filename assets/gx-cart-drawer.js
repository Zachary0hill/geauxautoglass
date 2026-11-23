/* ==========================================================================
   Geaux Auto Glass theme · cart drawer
   Opens from the cart icon and after every add to cart. Every change posts
   to Shopify and the drawer re-renders from the section's own HTML, so the
   totals, discounts and header count are never guessed.
   ========================================================================== */
(function () {
  'use strict';
  var H = window.GX || { routes: {}, strings: {} };
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function boot() {
  var drawer = $('#CartDrawer');
  if (!drawer || drawer.__brBoot) return;
  drawer.__brBoot = true;
  var lastFocus = null;
  var busy = false;
  var closeTimer = null;

  function open(opener) {
    if (drawer.open && closeTimer === null) return;
    clearTimeout(closeTimer);
    closeTimer = null;
    if (!drawer.open) lastFocus = opener || document.activeElement;
    drawer.hidden = false;
    if (!drawer.open) drawer.showModal();
    document.body.classList.add('br-drawer-open');
    requestAnimationFrame(function () { if (drawer.open && closeTimer === null) drawer.classList.add('is-open'); });
    var c = $('.cart-drawer__close', drawer); if (c) c.focus();
  }
  function close() {
    if (!drawer.open || closeTimer !== null) return;
    drawer.classList.remove('is-open');
    closeTimer = setTimeout(function () {
      closeTimer = null;
      drawer.close();
      drawer.hidden = true;
      document.body.classList.remove('br-drawer-open');
      if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
    }, 280);
  }

  function controls(root) {
    return $$('a[href], button:enabled, input:enabled', root).filter(function (el) {
      return el.tabIndex >= 0 && el.getClientRects().length > 0;
    });
  }

  function swap(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var fresh = doc.querySelector('#CartDrawer');
    if (!fresh) return;
    var panel = $('.cart-drawer__panel', drawer);
    var freshPanel = fresh.querySelector('.cart-drawer__panel');
    if (!panel || !freshPanel) return;
    var active = document.activeElement;
    var restore = drawer.open && panel.contains(active);
    var item = active.closest('[data-item-key]');
    var index = restore ? controls(item || panel).indexOf(active) : -1;
    panel.innerHTML = freshPanel.innerHTML;
    if (restore) {
      var scope = item ? $('[data-item-key="' + CSS.escape(item.dataset.itemKey) + '"]', panel) : panel;
      var target = scope && controls(scope)[index];
      if (!target || target.className !== active.className) target = $('.cart-drawer__close', panel);
      target.focus({ preventScroll: true });
    }
  }

  function refresh(cb) {
    fetch((H.routes.root || '/') + '?sections=cart-drawer', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j['cart-drawer']) swap(j['cart-drawer']); if (cb) cb(); })
      .catch(function () {});
  }

  function change(line, qty) {
    if (busy) return; busy = true;
    drawer.classList.add('is-loading');
    fetch(H.routes.cartChange || '/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ line: line, quantity: qty, sections: 'cart-drawer' })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) { if (window.GX.toast) window.GX.toast(res.body.description || res.body.message || H.strings.cartError); return; }
        if (res.body.sections && res.body.sections['cart-drawer']) swap(res.body.sections['cart-drawer']);
        if (window.GX.setCartCount) window.GX.setCartCount(res.body.item_count);
      })
      .catch(function () { if (window.GX.toast) window.GX.toast(H.strings.cartError || 'Something went wrong'); })
      .then(function () { busy = false; drawer.classList.remove('is-loading'); });
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-cart-open]');
    if (opener) { e.preventDefault(); open(opener); refresh(); return; }
    if (!drawer.contains(e.target)) return;
    if (e.target.closest('[data-cart-close]')) { e.preventDefault(); close(); return; }
    var qb = e.target.closest('[data-drawer-qty]');
    if (qb) {
      var input = $('[data-drawer-input="' + qb.dataset.drawerQty + '"]', drawer);
      var v = parseInt(input && input.value || '1', 10) || 1;
      v = qb.dataset.dir === 'down' ? v - 1 : v + 1;
      change(parseInt(qb.dataset.drawerQty, 10), Math.max(0, v));
      return;
    }
    var rm = e.target.closest('[data-drawer-remove]');
    if (rm) { change(parseInt(rm.dataset.drawerRemove, 10), 0); }
  });
  drawer.addEventListener('change', function (e) {
    var input = e.target.closest('[data-drawer-input]'); if (!input) return;
    change(parseInt(input.dataset.drawerInput, 10), Math.max(0, parseInt(input.value, 10) || 0));
  });
  drawer.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var items = controls(drawer);
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // After an add to cart anywhere on the page, open the drawer instead of a toast.
  document.addEventListener('gx:cart:added', function () { refresh(open); });
  }
  boot();
  document.addEventListener('DOMContentLoaded', boot);
  document.addEventListener('shopify:section:load', boot);
})();
