// GA4 lead clicks for Geaux Auto Glass.
//
// Where it goes: Shopify admin > Settings > Customer events > Add custom pixel.
// Name it "GA4 lead clicks", paste this whole file, set GA4_ID below, Save, then Connect.
//
// What it does: the theme publishes geaux:quote_click (a "Get a quote" link was clicked)
// and geaux:call_click (a phone number was tapped). This pixel sends each one to GA4 as
// quote_click / call_click. It sends no page views, so it does not double count the
// Google & YouTube app. In GA4, mark both events as key events (Admin > Events).
//
// Parameters on each event: placement (header, tab_bar, phone_menu, footer, page),
// page_path, link_text, and on calls: shop (lafayette, new_orleans, other).

const GA4_ID = 'G-XXXXXXXXXX'; // GA4 > Admin > Data streams > your web stream > Measurement ID

const tag = document.createElement('script');
tag.async = true;
tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
document.head.appendChild(tag);

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

// The pixel runs in a sandbox that cannot read the storefront's cookies directly, so the
// visitor's GA client id and session id are read through Shopify and handed to gtag.
// That keeps these clicks on the same visitor and session as the page views.
const ready = (async () => {
  const config = { send_page_view: false };
  try {
    const ga = await browser.cookie.get('_ga'); // GA1.1.1234567890.1700000000
    const parts = (ga || '').split('.');
    if (parts.length >= 4) config.client_id = parts.slice(-2).join('.');
    const session = await browser.cookie.get('_ga_' + GA4_ID.replace(/^G-/, ''));
    const match = (session || '').match(/^GS1\.\d\.(\d+)/) || (session || '').match(/^GS2\.\d\.s(\d+)/);
    if (match) config.session_id = match[1];
  } catch (err) {}
  gtag('config', GA4_ID, config);
})();

['quote_click', 'call_click'].forEach((name) => {
  analytics.subscribe('geaux:' + name, async (event) => {
    await ready;
    const data = event.customData || {};
    gtag('event', name, {
      placement: data.placement,
      page_path: data.page_path,
      link_text: data.link_text,
      shop: data.shop,
      page_location: event.context.document.location.href,
      page_title: event.context.document.title,
    });
  });
});
