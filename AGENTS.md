# AGENTS.md — AI Agent Guidelines & Repository Context

## 📌 Project Overview
- **Project Name:** Viktor Malieiev Personal Portfolio
- **Owner:** Viktor Malieiev (Віктор Малєєв) — *Creative Producer & Product Designer (GenAI Specialist)*
- **Primary Repository:** [GitHub Repository](https://github.com/Icar6618/portfolio.git)
- **Deployment / Live Target:** [whynotartcompany-tech/portfolio](https://github.com/whynotartcompany-tech/portfolio.git) / `why-not.com.ua`
- **Type:** Modern Single-Page Application (SPA) Web Portfolio with interactive UI, merchandise showcase, and redesign case studies.

---

## 🛠 Tech Stack & Architecture

| Component | Technology | Details |
|---|---|---|
| **Framework** | Astro 7 (static output) | Component-based single page (`src/pages/index.astro`), built to `dist/`. Package manager: pnpm 11, Node ≥ 22. |
| **Styling** | Tailwind CSS v3 (compiled at build via PostCSS) + Custom Theme Engine | Dual-theme support: Dark (default) & Light mode (`#F8FAFC`), persisted via `localStorage`. |
| **Icons** | Lucide Icons | Loaded via CDN (`lucide@latest`); re-initialized with `lucide.createIcons()`. |
| **Typography** | Google Fonts | `Inter` (UI/body) and `Space Grotesk` (headings/accents). |
| **Localization** | Custom Client-side i18n | Tri-lingual support: Ukrainian (`uk`), English (`en`), Russian (`ru`). |
| **Interactivity** | Vanilla JavaScript | Live views & like counter widget, dark/light theme switcher, custom branded cursor, click-spawned reactive floating quotes, lightbox modal, dynamic category filtering. |

---

## 📁 Repository Structure

```
icar-portfolio/
├── astro.config.mjs        # Astro config (site, base: '/portfolio', build.format: 'file')
├── tailwind.config.mjs     # Tailwind theme (brand colors, fonts) and content globs
├── postcss.config.mjs      # PostCSS → Tailwind
├── package.json            # Scripts: dev / build / preview
├── pnpm-lock.yaml
├── .github/workflows/
│   └── deploy.yml          # CI: pnpm build → GitHub Pages on push to main
├── README.md               # User-facing project documentation
├── AGENTS.md               # AI Agent operating guidelines (this file)
├── AGENT.md                # Alias / fallback for agents
├── src/
│   ├── pages/              # index.astro (uk, /), en/index.astro (/en/), ru/index.astro (/ru/)
│   ├── layouts/Layout.astro# <head>: per-language SEO/OG/Twitter meta, hreflang, theme loader, scripts
│   ├── components/
│   │   ├── PortfolioPage.astro # The page: composes all section components (shared by all languages)
│   │   └── *.astro         # One component per section (Hero, Merch, Gallery, Footer, ...)
│   ├── i18n/
│   │   ├── translations.js # UI strings (uk/en/ru) + attrTranslations for alt/title/aria-label
│   │   └── config.js       # Languages, URL prefixes, per-language page meta
│   ├── middleware.js       # Renders translations into HTML and makes asset URLs base-absolute
│   └── styles/global.css   # Custom CSS (themes, cursor, animations) + @tailwind directives
└── public/                 # Copied verbatim into dist/
    ├── js/portfolio.js     # Client-side logic: `clickPhrases`, lightbox, cursor, themes (strings come from the page)
    └── assets/             # Static media assets
        ├── avatar.jpg      # Profile photo
    ├── brand-board.jpg     # Brand moodboard and identity
    ├── brand-logo.png      # Brand mark
    ├── cursor-logo.png     # Custom cursor graphic (mascot raccoon)
    ├── mascot-*.png        # Character illustrations in different poses
    ├── old-site-design.png # "Before" redesign screenshot
    ├── after-desktop-*.png # "After" redesign desktop showcase
    ├── after-mobile-*.png  # "After" redesign mobile showcase
    ├── tshirt-*.png        # Merch apparel mockups
    ├── merch-bag-*.png     # Merch tote bags
    └── merch-mug-*.png     # Merch ceramic mugs
```

---

## 🧭 Rules & Guidelines for AI Agents

### 1. Astro Static Architecture
- The site is built with Astro as a fully static site (no SSR, no adapters). Keep it that way unless the user explicitly asks otherwise.
- Commands: `pnpm dev` (http://localhost:4321/portfolio/), `pnpm build` (→ `dist/`), `pnpm preview`.
- Add sections as components in `src/components/` and include them in `src/components/PortfolioPage.astro`. Pages are built as `<path>/index.html` (`build.format: 'directory'`).
- Tailwind is compiled at build time: config in `tailwind.config.mjs`, PostCSS in `postcss.config.mjs`, directives at the END of `src/styles/global.css` (keeps the cascade order the theme overrides rely on). Class names must appear as full strings in `src/**` or `public/js/**` (no `text-${color}-400` concatenation). Lucide is loaded via CDN. Stay on Tailwind v3 unless explicitly asked to migrate to v4.
- Client scripts in `public/js/` are included with `<script is:inline>` and are not bundled.
- Deployment is automatic via `.github/workflows/deploy.yml`; never commit `dist/` or `node_modules/`.

### 2. Localization (i18n) Invariants
- The application supports **Ukrainian (`uk`)**, **English (`en`)**, and **Russian (`ru`)**.
- Ukrainian is the **default primary language**.
- Each language is a separate static page: `/portfolio/` (uk, no prefix), `/portfolio/en/`, `/portfolio/ru/` (Astro i18n routing, `prefixDefaultLocale: false`). The language switcher is a set of links between these pages.
- Translations are rendered **at build time** by `src/middleware.js` (same rules as `setLang()`: strings containing `<` → innerHTML, others → text). The browser only receives the current language as `window.__I18N__` (injected in `Layout.astro`).
- **Every new UI text element** must be registered in `src/i18n/translations.js`:
  - Provide accurate strings in `uk`, `en`, and `ru` (all three must have the same keys).
  - Add `data-i18n="<key>"` to the element; write the Ukrainian text inside it as the source.
  - For `alt` / `title` / `aria-label`, write Ukrainian text in the component and add its `en`/`ru` versions to `attrTranslations` (keyed by the Ukrainian text).
  - Page title/description/OG/Twitter texts live in `meta` in `src/i18n/config.js`; OG images: `public/og-image{,-en,-ru}.jpg`.
  - If adding interactive click phrases, add them to `clickPhrases[<lang>]` in `public/js/portfolio.js`.

### 3. Visual & Styling Standards
- Respect the existing dark cyberpunk/neo-brutalist tech aesthetic:
  - Background: `#07090E`
  - Cards & Modals: `#131B2E`
  - Borders: `#1F293D`
  - Accents: `brand-purple` (`#8B5CF6`), `brand-cyan` (`#06B6D4`), `brand-pink` (`#EC4899`)
- Keep glassmorphism effects consistent (`backdrop-blur-md`, subtle border glows).

### 4. Interactive Components & DOM Updates
- **Lucide Icons:** When modifying or injecting DOM with icons, always call `lucide.createIcons()`.
- **Custom Cursor:** Elements with click actions (`a`, `button`, `input`, `[onclick]`, `.cursor-pointer`) must trigger cursor states. If dynamically rendering clickable cards, call `setupCursorHover()`.
- **Lightbox:** Images in showcases should support click-to-preview using `openLightbox(src, caption)`.

### 5. Media & Asset Management
- Store all static images and media inside the `public/assets/` directory.
- Use **WebP** for images (convert PNG/JPG before adding). Reference them with base-relative paths (e.g., `assets/filename.webp`); the middleware rewrites `src`/`href`/`poster`/`data-src` to `/portfolio/assets/...` on every page. In client JS, pass such paths through `resolveAsset()`. Never hardcode `/portfolio/` or use temp directory links.
- Preserve image aspect ratios and responsive grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

### 6. Git & Version Control
- Branch standard: `main`.
- Write concise, descriptive commit messages following Conventional Commits format (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`).
