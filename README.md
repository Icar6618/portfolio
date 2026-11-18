# Персональне веб-портфоліо: Віктор Малеєв (Viktor Malieiev)
### Creative Producer & Product Designer (GenAI Specialist)

Сучасне інтерактивне веб-портфоліо, побудоване на фреймворку **Astro** з модульною архітектурою компонентів, повною підтримкою 3 мов (UA/EN/RU), 8 комбінаціями тем (4 палітри × 2 режими) та автоматичним деплоєм на GitHub Pages.

---

## 🛠 Технічний стек

- **Фреймворк:** [Astro v7](https://astro.build/) (Static Site Generation, нульовий JS оверхед)
- **Стилізація:** Tailwind CSS + кастомна дизайн-система зі складною палітрою тем (`midnight`, `blue`, `fire`, `green` × `dark`/`light`)
- **Компоненти:** Модульна декомпозиція на 15 незалежних `.astro` компонентів
- **Іконки:** Lucide Icons
- **Деплоймент:** GitHub Actions CI/CD на GitHub Pages

---

## 📁 Структура проєкту

```text
├── .github/workflows/
│   └── deploy.yml            # Автоматичний білд та деплой на GitHub Pages
├── public/
│   ├── assets/               # Зображення (WebP) та AI-відео
│   ├── js/portfolio.js       # Клієнтська логіка: теми, лайтбокс, зум
│   ├── og-image{,-en,-ru}.jpg # Превʼю для соцмереж (Open Graph / Twitter) для кожної мови
│   ├── favicon.png
│   └── apple-touch-icon.png
├── src/
│   ├── components/           # Модульні Astro-компоненти
│   │   ├── PortfolioPage.astro     # Сторінка цілком (спільна для всіх мов)
│   │   ├── CustomCursor.astro      # Фірмовий інтерактивний курсор
│   │   ├── Navbar.astro            # Навігація, дропдаун тем, мобільне меню
│   │   ├── Hero.astro              # Головний екран + ключові метрики
│   │   ├── TargetRoles.astro       # Цільові вакансії та ролі
│   │   ├── Redesign.astro          # Порівняння «До» та «Після»
│   │   ├── Merch.astro             # Авторський мерч з фільтрами
│   │   ├── Branding.astro          # Айдентика, лого та маскот
│   │   ├── About.astro             # Бізнес-кейс, партнерства, 3 фото
│   │   ├── Skills.astro            # AI-стек, генеративне медіа, шахи
│   │   ├── Bot.astro               # AI-бот підтримки @whynot_supportbot
│   │   ├── Gear.astro              # Студійний сетап та обладнання
│   │   ├── Gallery.astro           # Естетична фотогалерея
│   │   ├── Footer.astro            # Контакти, копіювання email, соцмережі
│   │   ├── Lightbox.astro          # Модальний лайтбокс із зумом та панорамуванням
│   │   └── EngagementWidget.astro  # Віджет переглядів та лайків
│   ├── layouts/
│   │   └── Layout.astro      # Базовий лейаут: мета-теги/OG/hreflang для мови, лоадер тем
│   ├── pages/
│   │   ├── index.astro       # Українська версія (/)
│   │   ├── en/index.astro    # Англійська версія (/en/)
│   │   └── ru/index.astro    # Російська версія (/ru/)
│   ├── i18n/
│   │   ├── translations.js   # Переклади інтерфейсу (uk/en/ru)
│   │   └── config.js         # Мови та мета-теги для кожної мови
│   ├── middleware.js         # Підставляє переклади в HTML під час збірки
│   ├── styles/
│   │   └── global.css        # Кастомні стилі, анімації, теми
│   └── scripts/
│       └── portfolio.js      # Скрипти інтерактивності
├── astro.config.mjs          # Конфігурація Astro (site, base)
├── package.json              # Залежності та скрипти
└── tsconfig.json             # TypeScript конфігурація
```

---

## 🚀 Команди для розробки

Всі команди запускаються через менеджер пакетів `pnpm` (або `npm`):

```bash
# Встановлення залежностей
pnpm install

# Запуск локального сервера розробки (гаряче перезавантаження)
pnpm dev

# Збірка продакшен-версії сайту (в директорію dist/)
pnpm build

# Локальний попередній перегляд зібраного продакшен-сайту
pnpm preview
```

---

## 🌐 Деплой на GitHub Pages

У репозиторії налаштовано автоматичний GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Перейдіть до репозиторію на GitHub: **Settings** → **Pages**.
2. У розділі **Build and deployment** → **Source** оберіть **GitHub Actions**.
3. При кожному пуші у гілку `main` проєкт автоматично збирається та публікується на `https://icar6618.github.io/portfolio/`.
