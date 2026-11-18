/* ==========================================================================
   Geaux Auto Glass theme · collection and search filtering
   Progressive enhancement over the GET forms: changes are fetched as the
   section's own HTML and swapped in, the URL is updated with replaceState,
   and everything still works with JavaScript off.
   ========================================================================== */
(function () {
  'use strict';
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function init(root) {
    $$('[data-collection]', root || document).forEach(function (wrap) {
      if (wrap.__brFacets) return; wrap.__brFacets = true;
      var sid = wrap.dataset.sectionId;
      var results = $('[data-results]', wrap);
      var facetsForm = $('[data-facets-form]', wrap);
      var sortSelect = $('[data-sort-select]', wrap);
      var timer = null;

      function currentParams() {
        var p = new URLSearchParams();
        if (facetsForm) {
          new FormData(facetsForm).forEach(function (v, k) { if (v !== '') p.append(k, v); });
        }
        if (sortSelect) p.set('sort_by', sortSelect.value);
        return p;
      }

      function render(params, push) {
        var base = location.pathname;
        var qs = params.toString();
        var url = base + (qs ? '?' + qs : '');
        if (results) results.classList.add('is-loading');
        fetch(base + '?' + (qs ? qs + '&' : '') + 'section_id=' + sid)
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var freshResults = doc.querySelector('[data-results]');
            var freshCounts = doc.querySelectorAll('[data-results-count]');
            var freshFacets = doc.querySelector('.facets');
            var freshActive = doc.querySelector('[data-active-count]');
            if (freshResults && results) results.innerHTML = freshResults.innerHTML;
            $$('[data-results-count]', wrap).forEach(function (el, i) { if (freshCounts[i]) el.textContent = freshCounts[i].textContent; });
            var activeEl = $('[data-active-count]', wrap);
            if (activeEl && freshActive) { activeEl.textContent = freshActive.textContent; activeEl.hidden = freshActive.hidden; }
            var facets = $('.facets', wrap);
            if (freshFacets && facets) {
              var focused = document.activeElement && document.activeElement.name;
              facets.innerHTML = freshFacets.innerHTML;
              facetsForm = $('[data-facets-form]', wrap);
              bindForm();
              if (focused) { var again = facets.querySelector('[name="' + focused + '"]'); if (again) again.focus({ preventScroll: true }); }
            }
            if (push) history.pushState({ hg: true }, '', url);
            if (window.GX && window.GX.init) window.GX.init(wrap);
            document.dispatchEvent(new CustomEvent('gx:collection:updated', { detail: { root: wrap } }));
          })
          .catch(function () { location.href = url; })
          .then(function () { if (results) results.classList.remove('is-loading'); });
      }

      function bindForm() {
        if (!facetsForm || facetsForm.__brBound) return; facetsForm.__brBound = true;
        facetsForm.addEventListener('input', function (e) {
          clearTimeout(timer);
          var delay = e.target.type === 'number' ? 600 : 80;
          timer = setTimeout(function () { render(currentParams(), true); }, delay);
        });
        facetsForm.addEventListener('submit', function (e) { e.preventDefault(); render(currentParams(), true); });
        facetsForm.addEventListener('click', function (e) {
          var a = e.target.closest('[data-facet-remove]'); if (!a) return;
          e.preventDefault();
          var u = new URL(a.href, location.origin);
          var p = u.searchParams;
          if (sortSelect && !p.has('sort_by')) p.set('sort_by', sortSelect.value);
          render(p, true);
        });
      }
      bindForm();

      if (sortSelect) {
        sortSelect.addEventListener('change', function () {
          var hidden = facetsForm && $('[data-sort-hidden]', facetsForm);
          if (hidden) hidden.value = sortSelect.value;
          render(currentParams(), true);
        });
      }

      addEventListener('popstate', function () {
        render(new URLSearchParams(location.search), false);
      });

      // Grid density (3 or 4 columns) remembered per browser.
      var densityBtns = $$('[data-density]', wrap);
      function applyDensity(n) {
        var grid = $('[data-grid]', wrap);
        if (grid) { grid.classList.remove('product-grid--3', 'product-grid--4'); grid.classList.add('product-grid--' + n); }
        densityBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.density === String(n) ? 'true' : 'false'); });
      }
      var saved = null;
      try { saved = localStorage.getItem('br-density'); } catch (e) {}
      if (saved && saved !== wrap.dataset.defaultCols) applyDensity(saved);
      densityBtns.forEach(function (b) {
        b.addEventListener('click', function () {
          applyDensity(b.dataset.density);
          try { localStorage.setItem('br-density', b.dataset.density); } catch (e) {}
        });
      });
      document.addEventListener('gx:collection:updated', function (e) {
        if (e.detail.root !== wrap) return;
        var on = densityBtns.find(function (b) { return b.getAttribute('aria-pressed') === 'true'; });
        if (on) applyDensity(on.dataset.density);
      });

      // Filter panel under the bar.
      var ft = $('[data-filter-toggle]', wrap);
      var panel = $('[data-filters]', wrap);
      function setPanel(open) {
        if (!panel) return;
        panel.hidden = !open;
        if (ft) ft.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) { var f = panel.querySelector('input, button'); if (f) f.focus({ preventScroll: true }); }
      }
      if (ft && panel) {
        ft.addEventListener('click', function () { setPanel(panel.hidden); });
        wrap.addEventListener('click', function (e) { if (e.target.closest('[data-filter-close]')) setPanel(false); });
        wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setPanel(false); ft.focus(); } });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); }); else init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
