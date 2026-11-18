/* phone.js: runs before ScrollCraft.mount. Rewrites act devices per breakpoint
   and tames long pins under reduced motion.
   Theme change: the rewrite is a function (GXPhone.apply) that first puts the
   authored values back. theme.js runs it again when the screen crosses the
   breakpoint (a tablet turned on its side, the editor's mobile preview) and on
   every section the editor re-renders. */
(function () {
  var each = function (s, r, fn) { Array.prototype.forEach.call((r || document).querySelectorAll(s), fn); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mq = matchMedia('(max-width: 860px)');
  var KEYS = ['act', 'span', 'cue', 'kinetic', 'in', 'stagger', 'reveal-at'];
  var TOUCHED = '[data-sc-act="pin"], [data-phone-flow], [data-phone-flow] [data-sc-cue], [data-phone-flow] [data-sc-kinetic], [data-phone-in], [data-phone-reveal-at], [data-phone-span]';

  function apply(scope) {
    scope = scope || document;
    // Authored values: kept the first time an element is seen, put back before every rewrite.
    each(TOUCHED, scope, function (el) {
      if (el.__gxDesk) return;
      var o = el.__gxDesk = {};
      KEYS.forEach(function (k) { o[k] = el.getAttribute('data-sc-' + k); });
      el.setAttribute('data-gx-desk', '');
    });
    each('[data-gx-desk]', scope, function (el) {
      var o = el.__gxDesk; if (!o) return;
      KEYS.forEach(function (k) { if (o[k] === null) el.removeAttribute('data-sc-' + k); else el.setAttribute('data-sc-' + k, o[k]); });
    });

    if (reduce) {
      each('[data-sc-count]', scope, function (el) { el.removeAttribute('data-sc-count'); });
      each('[data-sc-act="pan"]', scope, function (act) { act.setAttribute('data-sc-act', 'flow'); act.removeAttribute('data-sc-span'); act.removeAttribute('data-phone-span'); act.classList.add('is-grid'); each('[data-sc-pan]', act, function (el) { el.removeAttribute('data-sc-pan'); }); });
      each('[data-sc-act="pin"]', scope, function (act) {
        var s = parseFloat(act.getAttribute('data-sc-span') || '1.5');
        if (s > 1.3) act.setAttribute('data-sc-span', '1.25');
        act.removeAttribute('data-phone-span');
      });
    }

    document.documentElement.classList.toggle('is-phone', mq.matches);
    if (mq.matches) {
      each('[data-phone-flow]', scope, function (act) {
        act.setAttribute('data-sc-act', 'flow'); act.removeAttribute('data-sc-span');
        each('[data-sc-cue]', act, function (el) { el.removeAttribute('data-sc-cue'); });
        each('[data-sc-kinetic]', act, function (el) { el.removeAttribute('data-sc-kinetic'); });
        each('[data-phone-in]', act, function (el) { el.setAttribute('data-sc-in', ''); el.setAttribute('data-sc-stagger', el.getAttribute('data-phone-in') || '70'); });
      });
      each('[data-phone-reveal-at]', scope, function (el) { el.setAttribute('data-sc-reveal-at', el.getAttribute('data-phone-reveal-at')); });
      each('[data-phone-span]', scope, function (act) { act.setAttribute('data-sc-span', act.getAttribute('data-phone-span')); });
    }

    // The signature video slot. (Social counts are printed by Liquid.)
    each('.ba[data-video]', scope, function (ba) {
      if (!ba.getAttribute('data-video')) return;
      var act = ba.closest('[data-sc-act]');
      if (act) { act.setAttribute('data-sc-span', '1.3'); act.setAttribute('data-phone-span', '1.2'); }
    });
  }

  window.GXPhone = { apply: apply };
  apply(document);
})();
