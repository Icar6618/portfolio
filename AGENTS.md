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
| **Structure** | HTML5 / Single-Page | Zero-build setup; runs directly in modern browsers via `index.html`. |
| **Styling** | Tailwind CSS (CDN) + Custom Theme Engine | Dual-theme support: Dark (default) & Light mode (`#F8FAFC`), persisted via `localStorage`. |
| **Icons** | Lucide Icons | Loaded via CDN (`lucide@latest`); re-initialized with `lucide.createIcons()`. |
| **Typography** | Google Fonts | `Inter` (UI/body) and `Space Grotesk` (headings/accents). |
| **Localization** | Custom Client-side i18n | Tri-lingual support: Ukrainian (`uk`), English (`en`), Russian (`ru`). |
| **Interactivity** | Vanilla JavaScript | Dark/Light theme switcher, custom branded cursor, click-spawned reactive floating quotes, lightbox modal, dynamic category filtering. |

---

## 📁 Repository Structure

```
x:\Work Plio\
├── index.html              # Main application file (HTML + Tailwind + custom CSS + JS logic)
├── README.md               # User-facing project documentation
├── AGENTS.md               # AI Agent operating guidelines (this file)
├── AGENT.md                # Alias / fallback for agents
└── assets/                 # Static media assets
    ├── avatar.jpg          # Profile photo
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

### 1. Zero-Build Architecture
- Do **not** introduce a Node.js/npm bundling build chain (Vite, Webpack, etc.) unless explicitly requested by the user.
- The portfolio is intentionally maintained as a clean, dependency-free single file (`index.html`) for instant portability and direct file opening (`file:///...`).

### 2. Localization (i18n) Invariants
- The application supports **Ukrainian (`uk`)**, **English (`en`)**, and **Russian (`ru`)**.
- Ukrainian is the **default primary language**.
- **Every new UI text element** must be registered in the `translations` dictionary inside `index.html`:
  - Provide accurate strings in `uk`, `en`, and `ru`.
  - Use semantic `data-i18n="<key>"` or `data-i18n-placeholder="<key>"` attributes on HTML elements.
  - If adding interactive click phrases, add them to `clickPhrases[<lang>]`.

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
- Store all static images and media inside the `assets/` directory.
- Use relative paths (e.g., `assets/filename.png`), never absolute paths or temp directory links.
- Preserve image aspect ratios and responsive grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

### 6. Git & Version Control
- Branch standard: `main`.
- Write concise, descriptive commit messages following Conventional Commits format (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`).
