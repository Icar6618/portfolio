// Locales: Ukrainian is the default (served at the site root), others get a URL prefix.
export const defaultLang = 'uk';
export const languages = ['uk', 'en', 'ru', 'pl', 'de'];

/** Path of a language's page relative to the site base, e.g. '' | 'en/' | 'ru/' | 'pl/' | 'de/'. */
export function langPath(lang) {
  return lang === defaultLang ? '' : `${lang}/`;
}

/** Site base with a trailing slash, e.g. '/portfolio/'. */
export const siteBase = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** Per-language page metadata (title, SEO, Open Graph, Twitter). */
export const meta = {
  uk: {
    htmlLang: 'uk',
    ogLocale: 'uk_UA',
    label: 'UA',
    title: 'Малеєв Віктор | Creative Producer & Product Designer (GenAI)',
    description:
      'Портфоліо Віктора Малеєва — креативний продюсер і продакт-дизайнер, спеціаліст з генеративного ШІ. Редизайн сайтів, брендинг, мерч, AI-відео та візуальний контент.',
    author: 'Віктор Малеєв',
    siteName: 'Віктор Малеєв — Портфоліо',
    keywords:
      'Віктор Малеєв, Creative Producer, Product Designer, GenAI, генеративний ШІ, AI-дизайн, UI/UX, брендинг, мерч, портфоліо',
    image: 'og-image.jpg',
    imageAlt: 'Віктор Малеєв — Creative Producer & Product Designer (GenAI)',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    label: 'EN',
    title: 'Maleiev Viktor | Creative Producer & Product Designer (GenAI)',
    description:
      'Portfolio of Viktor Maleiev — creative producer and product designer specializing in generative AI. Website redesigns, branding, merch, AI video and visual content.',
    author: 'Viktor Maleiev',
    siteName: 'Viktor Maleiev — Portfolio',
    keywords:
      'Viktor Maleiev, Creative Producer, Product Designer, GenAI, generative AI, AI design, UI/UX, branding, merch, portfolio',
    image: 'og-image-en.jpg',
    imageAlt: 'Viktor Maleiev — Creative Producer & Product Designer (GenAI)',
  },
  ru: {
    htmlLang: 'ru',
    ogLocale: 'ru_RU',
    label: 'RU',
    title: 'Малеев Виктор | Creative Producer & Product Designer (GenAI)',
    description:
      'Портфолио Виктора Малеева — креативный продюсер и продакт-дизайнер, специалист по генеративному ИИ. Редизайн сайтов, брендинг, мерч, AI-видео и визуальный контент.',
    author: 'Виктор Малеев',
    siteName: 'Виктор Малеев — Портфолио',
    keywords:
      'Виктор Малеев, Creative Producer, Product Designer, GenAI, генеративный ИИ, AI-дизайн, UI/UX, брендинг, мерч, портфолио',
    image: 'og-image-ru.jpg',
    imageAlt: 'Виктор Малеев — Creative Producer & Product Designer (GenAI)',
  },
  pl: {
    htmlLang: 'pl',
    ogLocale: 'pl_PL',
    label: 'PL',
    title: 'Maleiev Viktor | Creative Producer & Product Designer (GenAI)',
    description:
      'Portfolio Viktora Maleieva — creative producer i product designer specjalizujący się w generatywnej sztucznej inteligencji. Redesign stron, branding, merch, AI wideo i dźwięk.',
    author: 'Viktor Maleiev',
    siteName: 'Viktor Maleiev — Portfolio',
    keywords:
      'Viktor Maleiev, Creative Producer, Product Designer, GenAI, sztuczna inteligencja, UI/UX, branding, merch, portfolio',
    image: 'og-image-en.jpg',
    imageAlt: 'Viktor Maleiev — Creative Producer & Product Designer (GenAI)',
  },
  de: {
    htmlLang: 'de',
    ogLocale: 'de_DE',
    label: 'DE',
    title: 'Maleiev Viktor | Creative Producer & Product Designer (GenAI)',
    description:
      'Portfolio von Viktor Maleiev — Creative Producer und Product Designer mit Spezialisierung auf generative KI. Website-Redesign, Branding, Merch, KI-Video und Sounddesign.',
    author: 'Viktor Maleiev',
    siteName: 'Viktor Maleiev — Portfolio',
    keywords:
      'Viktor Maleiev, Creative Producer, Product Designer, GenAI, generative KI, KI-Design, UI/UX, Branding, Merch, Portfolio',
    image: 'og-image-en.jpg',
    imageAlt: 'Viktor Maleiev — Creative Producer & Product Designer (GenAI)',
  },
};
