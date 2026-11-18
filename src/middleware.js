// Build-time (and dev) HTML post-processing for every page:
//  1. Renders translations into elements with data-i18n="key" for the page language
//     (same rules as setLang() in public/js/portfolio.js: HTML strings → innerHTML,
//     plain strings → text), so /en/ and /ru/ ship fully translated HTML.
//     alt / title / aria-label are translated via attrTranslations (keyed by the uk text).
//  2. Turns relative URLs in src/href/poster/data-src ("assets/x.webp", "js/...")
//     into base-absolute ones ("/portfolio/assets/x.webp"), so the same components
//     work on /, /en/ and /ru/.
// Only the affected byte ranges are replaced (positions from parse5); the rest of the
// markup is left untouched.
import { defineMiddleware } from 'astro:middleware';
import { parse } from 'parse5';
import { translations, attrTranslations } from './i18n/translations.js';
import { defaultLang, languages, siteBase } from './i18n/config.js';

const URL_ATTRS = new Set(['src', 'href', 'poster', 'data-src']);
const TEXT_ATTRS = new Set(['alt', 'title', 'aria-label']);
// Leave absolute URLs, protocol URLs (https:, mailto:, data:, ...), fragments and queries alone
const NOT_RELATIVE = /^(?:[a-z][a-z0-9+.-]*:|\/|#|\?)/i;

const escapeText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export function localizeHtml(html, dict, attrDict = {}, base = siteBase) {
  const doc = parse(html, { sourceCodeLocationInfo: true });
  const edits = [];
  const i18nRanges = [];

  const walk = (node) => {
    const loc = node.sourceCodeLocation;
    if (node.attrs && loc && loc.startTag) {
      for (const { name, value } of node.attrs) {
        if (name === 'data-i18n') {
          const text = dict[value];
          if (text && loc.endTag) {
            const range = {
              start: loc.startTag.endOffset,
              end: loc.endTag.startOffset,
              text: text.includes('<') ? text : escapeText(text),
            };
            edits.push(range);
            i18nRanges.push(range);
          }
        } else if (URL_ATTRS.has(name) && value && !NOT_RELATIVE.test(value)) {
          const a = loc.startTag.attrs && loc.startTag.attrs[name];
          if (a) edits.push({ start: a.startOffset, end: a.endOffset, text: `${name}="${escapeAttr(base + value)}"` });
        } else if (TEXT_ATTRS.has(name) && attrDict[value]) {
          const a = loc.startTag.attrs && loc.startTag.attrs[name];
          if (a) edits.push({ start: a.startOffset, end: a.endOffset, text: `${name}="${escapeAttr(attrDict[value])}"` });
        }
      }
    }
    for (const child of node.childNodes || []) walk(child);
  };
  walk(doc);

  // Content of a translated element is replaced wholesale, so drop edits nested inside it
  const kept = edits.filter((e) => !i18nRanges.some((r) => r !== e && r.start <= e.start && e.end <= r.end));
  kept.sort((a, b) => b.start - a.start);

  let out = html;
  for (const e of kept) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!(response.headers.get('content-type') || '').includes('text/html')) return response;

  const lang = languages.includes(context.currentLocale) ? context.currentLocale : defaultLang;
  const html = localizeHtml(await response.text(), translations[lang], attrTranslations[lang]);

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
});
