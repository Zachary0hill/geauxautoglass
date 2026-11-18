/* phone.js: runs before ScrollCraft.mount. Rewrites act devices per breakpoint
   and tames long pins under reduced motion. */
(function () {
  var each = function (s, r, fn) { Array.prototype.forEach.call((r || document).querySelectorAll(s), fn); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    each('[data-sc-count]', null, function (el) { el.removeAttribute('data-sc-count'); });
    each('[data-sc-act="pan"]', null, function (act) { act.setAttribute('data-sc-act', 'flow'); act.removeAttribute('data-sc-span'); act.removeAttribute('data-phone-span'); act.classList.add('is-grid'); each('[data-sc-pan]', act, function (el) { el.removeAttribute('data-sc-pan'); }); });
    each('[data-sc-act="pin"]', null, function (act) {
      var s = parseFloat(act.getAttribute('data-sc-span') || '1.5');
      if (s > 1.3) act.setAttribute('data-sc-span', '1.25');
      act.removeAttribute('data-phone-span');
    });
  }
  if (!matchMedia('(max-width: 860px)').matches) return;
  document.documentElement.classList.add('is-phone');
  each('[data-phone-flow]', null, function (act) {
    act.setAttribute('data-sc-act', 'flow'); act.removeAttribute('data-sc-span');
    each('[data-sc-cue]', act, function (el) { el.removeAttribute('data-sc-cue'); });
    each('[data-sc-kinetic]', act, function (el) { el.removeAttribute('data-sc-kinetic'); });
    each('[data-phone-in]', act, function (el) { el.setAttribute('data-sc-in', ''); el.setAttribute('data-sc-stagger', el.getAttribute('data-phone-in') || '70'); });
  });
  each('[data-phone-reveal-at]', null, function (el) { el.setAttribute('data-sc-reveal-at', el.getAttribute('data-phone-reveal-at')); });
  each('[data-phone-span]', null, function (act) { act.setAttribute('data-sc-span', act.getAttribute('data-phone-span')); });
})();

/* Runs before ScrollCraft.mount as well: the signature video slot. (Social counts are printed by Liquid.) */
(function () {
  var ba = document.querySelector('.ba[data-video]');
  if (ba && ba.getAttribute('data-video')) {
    var act = ba.closest('[data-sc-act]');
    if (act) { act.setAttribute('data-sc-span', '1.3'); act.setAttribute('data-phone-span', '1.2'); }
  }
})();
