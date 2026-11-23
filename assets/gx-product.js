/* ==========================================================================
   Geaux Auto Glass theme · product page
   Variant selection, price/availability/media/URL updates, thumbnail
   navigation, pickup availability, complementary products, gift card
   recipient offset. Re-runs safely on theme editor section reloads.
   ========================================================================== */
(function () {
  'use strict';
  var H = window.GX || { strings: {}, routes: {} };
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function initSection(section) {
    if (!section || section.__brProduct) return;
    section.__brProduct = true;
    var dataEl = $('[data-product-json]', section);
    var product = null;
    try { product = JSON.parse(dataEl.textContent); } catch (e) { return; }
    var picker = $('[data-variant-picker]', section);
    var variantInput = $('[data-variant-id]', section);
    var addBtn = $('[data-add-to-cart]', section);
    var addLabel = $('[data-add-label]', section);
    var priceEl = $('#ProductPrice', section);
    var skuEl = $('#ProductSku', section);
    var inventoryEl = $('[data-inventory]', section);
    var pickupEl = $('[data-pickup-availability]', section);
    var mediaList = $('.product__media-list', section);
    var thumbs = $$('.product__thumb', section);

    function selectedOptions() {
      if (!picker) return null;
      var opts = [];
      $$('[data-option-index]', picker).forEach(function (el) {
        var i = parseInt(el.dataset.optionIndex, 10);
        if (el.tagName === 'SELECT') opts[i] = el.value;
        else if (el.checked) opts[i] = el.value;
      });
      return opts;
    }
    function findVariant(opts) {
      if (!opts) return product.variants[0];
      return product.variants.find(function (v) {
        return v.options.every(function (o, i) { return o === opts[i]; });
      }) || null;
    }

    function showMedia(id, instant) {
      if (!id || !mediaList) return;
      var item = $('[data-media-id="' + id + '"]', mediaList);
      if (!item) return;
      $$('[data-media-id]', mediaList).forEach(function (m) { m.removeAttribute('data-current'); });
      item.setAttribute('data-current', '');
      var wide = window.matchMedia('(min-width: 900px)').matches;
      if (wide && section.dataset.gallery === 'thumbs') {
        // The grid swaps the main image in place; nothing scrolls.
      } else if (wide) {
        var top = item.getBoundingClientRect().top + window.scrollY - 90;
        if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top: top, behavior: 'smooth' });
      } else {
        var left = mediaList.scrollLeft + item.getBoundingClientRect().left - mediaList.getBoundingClientRect().left;
        mediaList.scrollTo({ left: left - (mediaList.clientWidth - item.offsetWidth) / 2, behavior: instant ? 'instant' : 'smooth' });
      }
      thumbs.forEach(function (t) { t.setAttribute('aria-current', t.dataset.thumbFor === String(id) ? 'true' : 'false'); });
    }

    function markAvailability(opts) {
      if (!picker) return;
      $$('[data-option-index]', picker).forEach(function (el) {
        var i = parseInt(el.dataset.optionIndex, 10);
        var candidates = el.tagName === 'SELECT' ? $$('option', el) : [el];
        candidates.forEach(function (c) {
          var test = opts.slice(); test[i] = c.value;
          var v = product.variants.find(function (x) { return x.options.every(function (o, j) { return j === i ? o === c.value : o === test[j]; }); });
          var available = !!(v && v.available);
          if (el.tagName === 'SELECT') { c.disabled = false; c.textContent = c.value + (available ? '' : ' – ' + (H.strings.soldOut || 'Sold out')); }
          else el.classList.toggle('is-unavailable', !available);
        });
      });
    }

    function variantPriceHtml(variant) {
      var html = '';
      if (variant.compare_at_price && variant.compare_at_price > variant.price) html += '<span class="price__sale">' + H.formatMoney(variant.price) + '</span><s class="price__compare">' + H.formatMoney(variant.compare_at_price) + '</s>';
      else html += '<span class="price__regular">' + H.formatMoney(variant.price) + '</span>';
      if (variant.unit_price_measurement) {
        var ref = variant.unit_price_measurement.reference_value !== 1 ? variant.unit_price_measurement.reference_value : '';
        html += '<span class="price__unit">' + H.formatMoney(variant.unit_price) + ' / ' + ref + variant.unit_price_measurement.reference_unit + '</span>';
      }
      return html;
    }

    /* ------------------------------------------------- package pricing
       A size can carry a multi-piece price. The offer only shows when it
       costs less than the same pieces bought one at a time; the package
       price is the same whatever the finish (standoffs or not). */
    var pkgEl = $('[data-package]', section);
    var pkg = null;
    if (pkgEl) { try { pkg = JSON.parse($('[data-package-config]', pkgEl).textContent); } catch (e) { pkg = null; } }
    var pkgOffer = 'single';
    var pkgVariant = null;
    var qtyInput = $('.product__qty .quantity__input', section);
    var pkgOptIndex = -1;
    var pkgSizes = [];

    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function fill(str, vals) { return String(str || '').replace(/\[(\w+)\]/g, function (m, k) { return k in vals ? vals[k] : m; }); }
    function sameSize(a, b) { return String(a).trim().toLowerCase() === String(b).trim().toLowerCase(); }
    function baseVariant(size) {
      return product.variants.filter(function (v) { return sameSize(v.options[pkgOptIndex], size); })
        .sort(function (a, b) { return a.price - b.price; })[0] || null;
    }
    function tierFor(variant) {
      if (!variant || pkgOptIndex < 0) return null;
      var size = variant.options[pkgOptIndex];
      var t = pkg.tiers.find(function (x) { return sameSize(x.size, size); });
      if (!t || !(t.count > 1) || !(t.price > 0)) return null;
      var total = t.price;
      var full = variant.price * t.count;
      if (total >= full) return null;
      return { size: size, count: t.count, total: total, full: full, pct: Math.round((1 - total / full) * 100) };
    }
    function getQty() { return Math.max(1, parseInt(qtyInput && qtyInput.value, 10) || 1); }
    function setQty(n) { if (qtyInput) qtyInput.value = n; }

    function initPackage() {
      if (!pkg || !pkg.tiers || !pkg.tiers.length) return;
      if (!qtyInput) {
        // No quantity block: carry the package quantity in the product form.
        var form = addBtn && addBtn.form;
        if (!form) return;
        qtyInput = document.createElement('input');
        qtyInput.type = 'hidden'; qtyInput.name = 'quantity'; qtyInput.value = '1';
        form.appendChild(qtyInput);
      }
      var want = String(pkg.option || '').trim().toLowerCase();
      pkgOptIndex = (product.options || []).findIndex(function (o) { return String(o.name || o).toLowerCase() === want; });
      if (pkgOptIndex < 0) {
        pkgOptIndex = (product.options || []).findIndex(function (o, i) {
          return pkg.tiers.some(function (t) { return product.variants.some(function (v) { return sameSize(v.options[i], t.size); }); });
        });
      }
      if (pkgOptIndex < 0) return;
      // Sizes this product can actually offer as a package, in option order.
      var values = [];
      product.variants.forEach(function (v) { if (values.indexOf(v.options[pkgOptIndex]) < 0) values.push(v.options[pkgOptIndex]); });
      pkgSizes = values.filter(function (s) { return tierFor(baseVariant(s)); });
      if (!pkgSizes.length) return;

      pkgEl.addEventListener('change', function (e) {
        if (!e.target.matches('[data-package-offer]')) return;
        pkgOffer = e.target.value;
        var tier = tierFor(pkgVariant);
        setQty(pkgOffer === 'bundle' && tier ? tier.count : 1);
        renderPackage(pkgVariant);
      });
      if (qtyInput.type !== 'hidden') {
        qtyInput.addEventListener('change', function () {
          var tier = tierFor(pkgVariant);
          pkgOffer = tier && getQty() === tier.count ? 'bundle' : 'single';
          renderPackage(pkgVariant);
        });
      }
      pkgEl.hidden = false;
      return true;
    }

    function offerHtml(key, o, selected) {
      var thumbs = '';
      for (var i = 0; i < o.pieces; i++) {
        var left = o.pieces > 1 ? Math.round(i * 30 / (o.pieces - 1)) : 0;
        thumbs += '<span class="pkg__thumb" style="left:' + left + 'px">' + (pkg.image ? '<img src="' + esc(pkg.image) + '" alt="" loading="lazy">' : '') + '</span>';
      }
      return '<label class="pkg__offer' + (selected ? ' is-selected' : '') + (o.badge ? ' pkg__offer--badged' : '') + '">' +
        '<input class="pkg__input" type="radio" name="package-' + esc(section.id || 'product') + '" value="' + key + '" data-package-offer' + (selected ? ' checked' : '') + '>' +
        (o.badge ? '<span class="pkg__badge">' + esc(o.badge) + '</span>' : '') +
        '<span class="pkg__radio" aria-hidden="true"></span>' +
        '<span class="pkg__stack" aria-hidden="true">' + thumbs + '</span>' +
        '<span class="pkg__text"><span class="pkg__title">' + esc(o.title) + (o.save ? ' <span class="pkg__save">' + esc(o.save) + '</span>' : '') + '</span>' +
        '<span class="pkg__sub">' + esc(o.sub) + '</span></span>' +
        '<span class="pkg__price"><span class="pkg__amount">' + o.price + '</span>' + (o.compare ? '<s class="pkg__compare">' + o.compare + '</s>' : '') + '</span>' +
      '</label>';
    }

    function renderPackage(variant) {
      if (!variant || pkgOptIndex < 0 || !pkgSizes.length) return;
      var S = pkg.strings || {};
      var money = H.formatMoney;
      var size = variant.options[pkgOptIndex];
      var tier = tierFor(variant);
      if (!tier) pkgOffer = 'single';
      var bundle = pkgOffer === 'bundle';
      var qty = bundle ? tier.count : getQty();

      $('[data-package-caption]', pkgEl).textContent = tier
        ? fill(S.caption, { count: tier.count, price: money(tier.total) })
        : fill(S.captionNone, { size: size });

      var html = offerHtml('single', {
        pieces: 1, title: S.single, sub: fill(S.each, { size: size, price: money(variant.price) }), price: money(variant.price)
      }, !bundle);
      if (tier) {
        html += offerHtml('bundle', {
          pieces: tier.count, badge: pkg.badge,
          title: fill(S.multiple, { count: tier.count }),
          sub: pkg.perPiece ? fill(S.each, { size: size, price: money(Math.round(tier.total / tier.count)) }) : fill(S.bundle, { size: size }),
          price: money(tier.total), compare: money(tier.full), save: fill(S.save, { percent: tier.pct })
        }, bundle);
      }
      var offers = $('[data-package-offers]', pkgEl);
      var hadFocus = offers.contains(document.activeElement);
      offers.innerHTML = html;
      if (hadFocus) { var checked = $('[data-package-offer]:checked', offers); if (checked) checked.focus(); }

      var note = $('[data-package-note]', pkgEl);
      note.hidden = !!tier;
      if (!tier) {
        var list = pkgSizes.length > 1 ? pkgSizes.slice(0, -1).join(', ') + ' ' + (S.and || 'and') + ' ' + pkgSizes[pkgSizes.length - 1] : pkgSizes[0];
        note.textContent = fill(S.note, { sizes: list });
      }

      if (priceEl) {
        if (bundle) {
          priceEl.classList.remove('price--on-sale');
          priceEl.innerHTML = '<span class="price__regular">' + money(tier.total) + '</span><s class="price__compare">' + money(tier.full) + '</s><span class="price__note">' + esc(fill(S.forNote, { count: tier.count, size: size })) + '</span>';
        } else {
          priceEl.classList.toggle('price--on-sale', !!(variant.compare_at_price && variant.compare_at_price > variant.price));
          priceEl.innerHTML = variantPriceHtml(variant) + '<span class="price__note">' + esc(fill(S.perPieceNote, { size: size })) + '</span>';
        }
      }
      if (addLabel && variant.available) {
        var total = bundle ? tier.total : variant.price * qty;
        addLabel.textContent = qty === 1 ? fill(S.addOne, { price: money(total) }) : fill(S.addMany, { count: qty, price: money(total) });
      }
    }

    function packageVariantChanged(variant) {
      if (pkgOptIndex < 0) return;
      pkgVariant = variant;
      if (!variant) return;
      var tier = tierFor(variant);
      if (pkgOffer === 'bundle') {
        // Keep the package across a finish change; drop it when the size has none.
        if (tier) setQty(tier.count); else { pkgOffer = 'single'; setQty(1); }
      } else if (tier && getQty() === tier.count) {
        pkgOffer = 'bundle';
      }
      renderPackage(variant);
    }

    function update() {
      var opts = selectedOptions();
      var variant = findVariant(opts);
      if (opts) {
        $$('[data-option-label]', picker).forEach(function (l) { l.textContent = opts[parseInt(l.dataset.optionLabel, 10)]; });
        markAvailability(opts);
      }
      if (!variant) {
        if (addBtn) { addBtn.disabled = true; }
        if (addLabel) addLabel.textContent = H.strings.unavailable || 'Unavailable';
        return;
      }
      if (variantInput) variantInput.value = variant.id;
      if (addBtn) addBtn.disabled = !variant.available;
      if (addLabel) addLabel.textContent = variant.available ? (H.strings.addToCart || 'Add to cart') : (H.strings.soldOut || 'Sold out');
      if (priceEl && H.formatMoney) {
        priceEl.classList.toggle('price--on-sale', !!(variant.compare_at_price && variant.compare_at_price > variant.price));
        priceEl.classList.toggle('price--sold-out', !variant.available);
        priceEl.innerHTML = variantPriceHtml(variant);
      }
      if (skuEl) { var s = $('[data-sku]', skuEl); if (s) s.textContent = variant.sku || ''; skuEl.hidden = !variant.sku; }
      if (inventoryEl) {
        // Inventory quantity is not in product JSON; refresh from the section.
        fetchSection(variant.id);
      }
      if (pickupEl) { pickupEl.dataset.variantId = variant.id; loadPickup(); }
      showMedia(variant.featured_media && variant.featured_media.id);
      if (history.replaceState) {
        var url = new URL(location.href); url.searchParams.set('variant', variant.id);
        history.replaceState({}, '', url.toString());
      }
      var installments = $('#ProductInstallments input[name="id"]', section);
      if (installments) installments.value = variant.id;
      packageVariantChanged(variant);
    }

    var fetchTimer = null;
    function fetchSection(variantId) {
      clearTimeout(fetchTimer);
      fetchTimer = setTimeout(function () {
        var sid = section.closest('.shopify-section') ? section.closest('.shopify-section').id.replace('shopify-section-', '') : null;
        if (!sid) return;
        var url = location.pathname + '?variant=' + variantId + '&section_id=' + sid;
        fetch(url).then(function (r) { return r.text(); }).then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var fresh = doc.querySelector('[data-inventory]');
          if (fresh && inventoryEl) { inventoryEl.innerHTML = fresh.innerHTML; inventoryEl.hidden = fresh.hidden; inventoryEl.className = fresh.className; }
        }).catch(function () {});
      }, 150);
    }

    function loadPickup() {
      if (!pickupEl) return;
      var id = pickupEl.dataset.variantId;
      var base = pickupEl.dataset.baseUrl || '/';
      fetch(base.replace(/\/$/, '') + '/variants/' + id + '/?section_id=pickup-availability')
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var inner = doc.querySelector('.product__pickup');
          pickupEl.innerHTML = inner ? inner.outerHTML : '';
        }).catch(function () { pickupEl.innerHTML = ''; });
    }

    function loadComplementary() {
      var el = $('[data-complementary]', section);
      if (!el || el.children.length) return;
      fetch(el.dataset.url).then(function (r) { return r.text(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var inner = doc.querySelector('[data-complementary]');
        if (inner) el.innerHTML = inner.innerHTML;
      }).catch(function () {});
    }

    if (picker) picker.addEventListener('change', update);
    thumbs.forEach(function (t) { t.addEventListener('click', function () { showMedia(t.dataset.thumbFor); }); });
    if (mediaList) {
      var initialMedia = $('[data-current]', mediaList);
      if (initialMedia && !window.matchMedia('(min-width: 900px)').matches) {
        showMedia(initialMedia.dataset.mediaId, true);
      }
      // Keep thumbs in sync while swiping on phones.
      var scrollT;
      mediaList.addEventListener('scroll', function () {
        clearTimeout(scrollT);
        scrollT = setTimeout(function () {
          var items = $$('[data-media-id]', mediaList);
          var mid = mediaList.scrollLeft + mediaList.clientWidth / 2;
          var cur = items.find(function (it) { return it.offsetLeft <= mid && it.offsetLeft + it.offsetWidth > mid; });
          if (cur) thumbs.forEach(function (t) { t.setAttribute('aria-current', t.dataset.thumbFor === cur.dataset.mediaId ? 'true' : 'false'); });
        }, 80);
      }, { passive: true });
    }
    var offset = $('[data-recipient-offset]', section);
    if (offset) offset.value = new Date().getTimezoneOffset().toString();

    if (picker) { markAvailability(selectedOptions()); }
    if (initPackage()) packageVariantChanged(findVariant(selectedOptions()));
    if (pickupEl) loadPickup();
    loadComplementary();
  }

  function init(root) { $$('[data-product-section]', root || document).forEach(initSection); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); }); else init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
