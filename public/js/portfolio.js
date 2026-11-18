    // UI strings for the current page language, injected by Layout.astro
    // (source of truth: src/i18n/translations.js).
    const translations = window.__I18N__ || {};

    // Click interactive phrases
    const clickPhrases = {
      uk: [
        "Привіт! Я — Малеєв Віктор 👋",
        "Дякую, що завітали! ✨",
        "Why not? 🦝",
        "Буду радий спільному проєкту 🚀",
        "Радий вас тут бачити! 💜",
        "Гарного вам дня! ☀️",
        "GenAI & Creative Design ⚡",
        "Пишіть у Telegram: @diebbova 💬"
      ],
      en: [
        "Hi! I'm Maleiev Viktor 👋",
        "Thank you for stopping by! ✨",
        "Why not? 🦝",
        "I'd be glad to work together 🚀",
        "Glad to see you here! 💜",
        "Have a great day! ☀️",
        "GenAI & Creative Design ⚡",
        "Feel free to message me: @diebbova 💬"
      ],
      ru: [
        "Привет! Я — Малеев Виктор 👋",
        "Спасибо, что заглянули! ✨",
        "Why not? 🦝",
        "Буду рад совместному проекту 🚀",
        "Рад вас здесь видеть! 💜",
        "Хорошего вам дня! ☀️",
        "GenAI & Creative Design ⚡",
        "Пишите в Telegram: @diebbova 💬"
      ]
    };

    // Each language is a separate page (/, /en/, /ru/); the page language is set on <html lang>.
    let currentLang = document.documentElement.lang || 'uk';
    let phraseIndex = 0;

    // Asset paths in data/onclick handlers are base-relative ("assets/x.webp");
    // resolve them against the site base so they work on /en/ and /ru/ too.
    const SITE_BASE = document.documentElement.dataset.base || '/';
    function resolveAsset(src) {
      return /^(?:[a-z]+:|\/)/i.test(src) ? src : SITE_BASE + src;
    }

    // ==========================================
    // Collapsible Topic Sections Logic
    // ==========================================
    function toggleSection(sectionId, forceExpand = null) {
      const sec = document.getElementById(sectionId);
      if (!sec) return;
      const isCurrentlyCollapsed = sec.classList.contains('is-collapsed');
      const shouldCollapse = (forceExpand === null) ? !isCurrentlyCollapsed : !forceExpand;

      if (shouldCollapse) {
        sec.classList.add('is-collapsed');
      } else {
        sec.classList.remove('is-collapsed');
      }

      updateSectionToggleUI(sectionId, shouldCollapse);
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    function updateSectionToggleUI(sectionId, isCollapsed) {
      const label = document.querySelector(`[data-toggle-label="${sectionId}"]`);
      const icon = document.querySelector(`[data-toggle-icon="${sectionId}"]`);
      const lang = currentLang || 'uk';
      const collapseText = (translations[lang] && translations[lang].section_collapse) || 'Згорнути';
      const expandText = (translations[lang] && translations[lang].section_expand) || 'Розгорнути';

      if (label) {
        label.textContent = isCollapsed ? expandText : collapseText;
      }
      if (icon) {
        icon.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }

    // Auto-expand collapsible section if user clicks an anchor link leading into it
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.replace('#', '');
      const sec = document.getElementById(targetId);
      if (sec && sec.classList.contains('collapsible-section')) {
        toggleSection(targetId, true);
      }
    });

    function checkHashExpand() {
      if (window.location.hash) {
        const targetId = window.location.hash.replace('#', '');
        const sec = document.getElementById(targetId);
        if (sec && sec.classList.contains('collapsible-section')) {
          toggleSection(targetId, true);
        }
      }
    }
    window.addEventListener('hashchange', checkHashExpand);

    function setLang(lang) {
      if (!translations[lang]) return;
      currentLang = lang;

      document.querySelectorAll('.lang-active').forEach(el => el.classList.remove('lang-active'));
      const activeBtn = document.getElementById(`btn-${lang}`);
      if (activeBtn) activeBtn.classList.add('lang-active');

      document.documentElement.lang = lang;

      const pageTitles = {
        uk: "Малеєв Віктор | Creative Producer & Product Designer (GenAI)",
        en: "Maleiev Viktor | Creative Producer & Product Designer (GenAI)",
        ru: "Малеев Виктор | Creative Producer & Product Designer (GenAI)"
      };
      if (pageTitles[lang]) {
        document.title = pageTitles[lang];
      }

      const elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
          if (translations[lang][key].includes('<')) {
            el.innerHTML = translations[lang][key];
          } else {
            el.textContent = translations[lang][key];
          }
        }
      });


      // Re-render active lightbox caption if modal is currently open
      const lbModal = document.getElementById('lightbox');
      if (lbModal && !lbModal.classList.contains('hidden') && typeof renderActiveLightboxImage === 'function') {
        renderActiveLightboxImage();
      }

      // Refresh all collapsible section toggle button labels
      document.querySelectorAll('.collapsible-section').forEach(sec => {
        if (sec.id) {
          updateSectionToggleUI(sec.id, sec.classList.contains('is-collapsed'));
        }
      });

      // Update theme UI and indicator strings in new language
      if (typeof updateThemeUI === 'function') {
        updateThemeUI();
      }

      const isLight = document.documentElement.classList.contains('light');
      const themeTextMobile = document.getElementById('theme-text-mobile');
      if (themeTextMobile) {
        if (isLight) {
          themeTextMobile.textContent = (lang === 'en' ? 'Dark Theme' : (lang === 'ru' ? 'Темная тема' : 'Темна тема'));
        } else {
          themeTextMobile.textContent = (lang === 'en' ? 'Light Theme' : (lang === 'ru' ? 'Светлая тема' : 'Світла тема'));
        }
      }
    }

    // Filter merchandise cards
    function filterMerch(category) {
      document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const cards = document.querySelectorAll('.merch-card');
      cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Lightbox & Auto-Zoom functions
    const zoomBox = document.getElementById('lightbox-zoom-box');
    const zoomImg = document.getElementById('lightbox-img');
    const zoomHint = document.getElementById('zoom-hint-badge');
    let isLightboxZoomed = false;

    function updateZoomHintState() {
      if (!zoomHint) return;
      const hintText = document.getElementById('zoom-hint-text') || zoomHint.querySelector('span');
      const hintIcon = document.getElementById('zoom-hint-icon') || zoomHint.querySelector('i');
      
      const langDict = (translations && translations[currentLang]) ? translations[currentLang] : (translations ? translations['uk'] : {});
      
      if (isLightboxZoomed) {
        if (hintText) {
          hintText.setAttribute('data-i18n', 'lightbox_zoom_out_hint');
          hintText.textContent = langDict.lightbox_zoom_out_hint || 'Натисніть для зменшення 🔍';
        }
        if (hintIcon) {
          hintIcon.setAttribute('data-lucide', 'zoom-out');
        }
      } else {
        if (hintText) {
          hintText.setAttribute('data-i18n', 'lightbox_zoom_hint');
          hintText.textContent = langDict.lightbox_zoom_hint || 'Натисніть для збільшення 🔍';
        }
        if (hintIcon) {
          hintIcon.setAttribute('data-lucide', 'zoom-in');
        }
      }
      if (window.lucide) {
        lucide.createIcons();
      }
    }

    function resetZoom() {
      if (!zoomImg) return;
      zoomImg.style.transformOrigin = 'center center';
      zoomImg.style.transform = 'scale(1)';
      if (zoomBox) {
        zoomBox.classList.remove('cursor-zoom-out');
        zoomBox.classList.add('cursor-zoom-in');
      }
      isLightboxZoomed = false;
      updateZoomHintState();
    }

    function applyZoom(clientX, clientY) {
      if (!zoomBox || !zoomImg) return;
      const rect = zoomBox.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

      zoomImg.style.transformOrigin = `${x.toFixed(2)}% ${y.toFixed(2)}%`;
      zoomImg.style.transform = 'scale(2.4)';
      zoomBox.classList.remove('cursor-zoom-in');
      zoomBox.classList.add('cursor-zoom-out');
      isLightboxZoomed = true;
      updateZoomHintState();
    }

    if (zoomBox && zoomImg) {
      // Click to toggle zoom: click once to zoom in, click again to zoom out
      zoomBox.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isLightboxZoomed) {
          applyZoom(e.clientX, e.clientY);
        } else {
          resetZoom();
        }
      });

      // Desktop mousemove: ONLY pan image while zoomed in
      zoomBox.addEventListener('mousemove', (e) => {
        if (isLightboxZoomed) {
          const rect = zoomBox.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
          const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
          zoomImg.style.transformOrigin = `${x.toFixed(2)}% ${y.toFixed(2)}%`;
        }
      });

      zoomBox.addEventListener('mouseenter', () => {
        const customCursor = document.getElementById('custom-cursor');
        if (customCursor) customCursor.classList.add('opacity-0');
      });

      zoomBox.addEventListener('mouseleave', () => {
        const customCursor = document.getElementById('custom-cursor');
        if (customCursor) customCursor.classList.remove('opacity-0');
      });

      // Mobile Touch inspection & tap to zoom
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;
      let isTouchPanning = false;

      zoomBox.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();
          isTouchPanning = false;
        }
      }, { passive: true });

      zoomBox.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length === 1) {
          const diffX = Math.abs(e.touches[0].clientX - touchStartX);
          const diffY = Math.abs(e.touches[0].clientY - touchStartY);
          if (diffX > 8 || diffY > 8) {
            isTouchPanning = true;
          }
          if (isLightboxZoomed) {
            const rect = zoomBox.getBoundingClientRect();
            if (rect.width && rect.height) {
              const x = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
              const y = Math.max(0, Math.min(100, ((e.touches[0].clientY - rect.top) / rect.height) * 100));
              zoomImg.style.transformOrigin = `${x.toFixed(2)}% ${y.toFixed(2)}%`;
            }
            if (e.cancelable) e.preventDefault();
          }
        }
      }, { passive: false });

      zoomBox.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        if (!isTouchPanning && touchDuration < 350) {
          if (!isLightboxZoomed) {
            applyZoom(touchStartX, touchStartY);
          } else {
            resetZoom();
          }
        }
      });
    }

    // ==========================================
    // Lightbox & Gallery Sets Navigation
    // ==========================================
    const imageCaptions = {
      'assets/avatar.webp': {
        uk: 'Малеєв Віктор — Creative Producer & Product Designer (GenAI)',
        en: 'Maleiev Viktor — Creative Producer & Product Designer (GenAI)',
        ru: 'Малеев Виктор — Creative Producer & Product Designer (GenAI)'
      },
      'assets/old-site-design.webp': {
        uk: 'Сайт Why Not? до редизайну (Desktop, Tablet, Mobile)',
        en: 'Why Not? marketplace prior to redesign (Desktop, Tablet, Mobile)',
        ru: 'Сайт Why Not? до редизайна (Desktop, Tablet, Mobile)'
      },
      'assets/after-desktop-home.webp': {
        uk: 'Оновлена головна сторінка Why Not? (Desktop): банер Dark and Light, товари тижня, релізи артистів',
        en: 'Redesigned Why Not? Homepage (Desktop): Dark and Light banner, products of the week, artist releases',
        ru: 'Обновленная главная страница Why Not? (Desktop): баннер Dark and Light, товары недели, релизы артистов'
      },
      'assets/after-desktop-about.webp': {
        uk: 'Розділ «Про нас», Місія, Цінності та Прозоре відстеження замовлень',
        en: 'About Us Section: Mission, Core Values & Transparent Order Tracking',
        ru: 'Раздел «О нас», Миссия, Ценности и Прозрачный трекинг заказов'
      },
      'assets/after-mobile-cart.webp': {
        uk: 'Мобільний кошик із фірмовим маскотом у кошику та рекомендаціями',
        en: 'Mobile shopping cart with branded mascot and smart upsell recommendations',
        ru: 'Мобильная корзина с фирменным маскотом и товарными рекомендациями'
      },
      'assets/after-mobile-mission.webp': {
        uk: 'Мобільна адаптація: картки місії та пошук товарів',
        en: 'Mobile UX adaptation: Mission feature cards and streamlined product search',
        ru: 'Мобильная адаптация: карточки миссии и удобный поиск товаров'
      },
      'assets/after-desktop-en.webp': {
        uk: 'Англомовна локалізація маркетплейсу (International Storefront)',
        en: 'English localization of the marketplace (International Storefront)',
        ru: 'Англоязычная локализация маркетплейса (International Storefront)'
      },
      'assets/merch-deck-cards.webp': {
        uk: 'Презентація дропу футболок у форматі 3D-колоди карток',
        en: 'T-Shirt collection showcase formatted as an interactive 3D card deck',
        ru: 'Презентация дропа футболок в формате интерактивной 3D-колоды карт'
      },
      'assets/tshirt-quote-dreams-black.webp': {
        uk: 'Футболка Acid-Wash: «Мрії можуть підняти, але не забувай про межі» з ланцюгом',
        en: 'Acid-Wash T-Shirt: "Dreams can lift you, but never forget your boundaries" with chain',
        ru: 'Футболка Acid-Wash: «Мечты могут поднять, но не забывай о границах» с цепью'
      },
      'assets/tshirt-quote-dreams-white.webp': {
        uk: 'Біла оверсайз футболка: «Мрії можуть підняти, але не забувай про межі»',
        en: 'White Oversize T-Shirt: "Dreams can lift you, but never forget your boundaries"',
        ru: 'Белая оверсайз футболка: «Мечты могут поднять, но не забывай о границах»'
      },
      'assets/tshirt-quote-stains.webp': {
        uk: 'Футболка: «Плями — доказ що ти жив, а не боявся» (Вінтажна типографіка)',
        en: 'T-Shirt: "Stains are proof you lived rather than feared" (Vintage typography)',
        ru: 'Футболка: «Пятна — доказательство что ты жил, а не боялся» (Винтажная типографика)'
      },
      'assets/tshirt-cyber-angel.webp': {
        uk: 'Acid-Wash футболка зі скутим кібер-ангелом у неоновій рамці',
        en: 'Acid-Wash T-Shirt featuring a chained cyber-angel in a neon frame',
        ru: 'Acid-Wash футболка со скованным кибер-ангелом в неоновой рамке'
      },
      'assets/tshirt-cyber-lily.webp': {
        uk: 'Acid-Wash футболка з павуковою лілією та японським канджі',
        en: 'Acid-Wash T-Shirt with red spider lily (Lycoris) and Japanese kanji',
        ru: 'Acid-Wash футболка с паучьей лилией и японскими кандзи'
      },
      'assets/merch-bag-angel.webp': {
        uk: 'Білий еко-шопер зі скутим кібер-ангелом',
        en: 'White eco tote bag with chained cyber-angel graphic',
        ru: 'Белый эко-шопер со скованным кибер-ангелом'
      },
      'assets/merch-bag-cyber.webp': {
        uk: 'Білий еко-шопер: Кіберпанк Лікоріс та Канджі',
        en: 'White eco tote bag: Cyberpunk Spider Lily & Kanji typography',
        ru: 'Белый эко-шопер: Киберпанк Ликорис и Кандзи'
      },
      'assets/merch-mug-fire.webp': {
        uk: 'Керамічна кружка «СТРАХИ» у полум\'ї',
        en: 'Ceramic mug "FEARS" surrounded by custom flame typography',
        ru: 'Керамическая кружка «СТРАХИ» в фирменном пламени'
      },
      'assets/logo-geometry.webp': {
        uk: 'Геометрична сітка побудови логотипу (Vector Grid & Proportions)',
        en: 'Logo vector geometric construction grid and proportions',
        ru: 'Геометрическая сетка построения логотипа (Vector Grid & Proportions)'
      },
      'assets/brand-board.webp': {
        uk: 'Брендбук та носії стилю: пакування, мерч, зовнішня реклама',
        en: 'Brandboard and brand collaterals: packaging, merchandise, outdoor advertising',
        ru: 'Брендбук и носители стиля: упаковка, мерч, наружная реклама'
      },
      'assets/mascot-flag.webp': {
        uk: 'Маскот Why Not? з прапором України',
        en: 'Why Not? Mascot holding the Ukrainian flag',
        ru: 'Маскот Why Not? с флагом Украины'
      },
      'assets/mascot-packing.webp': {
        uk: 'Маскот пакує мерч для клієнта',
        en: 'Why Not? Mascot carefully packing merchandise for a customer',
        ru: 'Маскот упаковывает мерч для клиента'
      },
      'assets/mascot-cloak.webp': {
        uk: 'Маскот у чорній мантії / Streetwear',
        en: 'Why Not? Mascot in an oversized streetwear cloak',
        ru: 'Маскот в черной streetwear мантии'
      },
      'assets/mascot-peek.webp': {
        uk: 'Маскот визирає зі стіни / Стікер',
        en: 'Why Not? Mascot peeking from behind a wall / Official sticker',
        ru: 'Маскот выглядывает из-за стены / Стикер'
      },
      'assets/pitching-banner.webp': {
        uk: 'Пітчинг проєкту Why Not?: публічна презентація платформи перед аудиторією та партнерами',
        en: 'Why Not? Project Pitch: live presentation of the platform before audiences and partners',
        ru: 'Питчинг проекта Why Not?: публичная презентация платформы перед аудиторией и партнерами'
      },
      'assets/partnership-handshake.webp': {
        uk: 'Партнерство та співпраця з музикантами та дистриб\'юторами Why Not?',
        en: 'Partnerships & collaborations with Ukrainian artists and distributors',
        ru: 'Партнерство и сотрудничество с музыкантами и дистрибьюторами Why Not?'
      },
      'assets/muzika-partners-proof.png': {
        uk: 'Офіційне партнерство Why Not? на платформі MUZIKA.UA (muzika.ua/en/partners)',
        en: 'Official Why Not? partnership listed on MUZIKA.UA platform (muzika.ua/en/partners)',
        ru: 'Официальное партнерство Why Not? на платформе MUZIKA.UA (muzika.ua/en/partners)'
      },
      'assets/after-mobile-partners.webp': {
        uk: 'Співпраця з музичною дистриб\'юторською платформою MUZIKA.UA',
        en: 'Strategic distribution partnership with MUZIKA.UA music platform',
        ru: 'Сотрудничество с музыкальной дистрибьюторской платформой MUZIKA.UA'
      },
      'assets/gear-lenovo-loq.webp': {
        uk: 'Ноутбук Lenovo LOQ 15IAX9 — 3 TB Storage Workstation',
        en: 'Laptop Lenovo LOQ 15IAX9 — 3 TB Storage Creative Workstation',
        ru: 'Ноутбук Lenovo LOQ 15IAX9 — 3 TB Storage Workstation'
      },
      'assets/gear-akg-p220.webp': {
        uk: 'Конденсаторний студійний мікрофон AKG P220',
        en: 'AKG P220 Large-Diaphragm True Condenser Studio Microphone',
        ru: 'Конденсаторный студийный микрофон AKG P220'
      },
      'assets/gear-focusrite-scarlett.webp': {
        uk: 'Звукова карта Focusrite Scarlett 2i2 Studio 3rd Gen',
        en: 'Focusrite Scarlett 2i2 Studio (3rd Gen) USB Audio Interface',
        ru: 'Звуковая карта Focusrite Scarlett 2i2 Studio 3rd Gen'
      },
      'assets/gear-led-u600.webp': {
        uk: 'Світлодіодна прямокутна лампа Led U600 зі штатив-триногою',
        en: 'Led U600 Rectangular Studio Lighting Panel with Adjustable Tripod',
        ru: 'Светодиодная прямоугольная лампа Led U600 со штативом'
      },
      'assets/gear-jabra-evolve2.webp': {
        uk: 'Бездротова гарнітура Jabra Evolve2 55 Stereo UC',
        en: 'Jabra Evolve2 55 Stereo UC Wireless Noise-Cancelling Headset',
        ru: 'Беспроводная гарнитура Jabra Evolve2 55 Stereo UC'
      },
      'assets/gear-akg-k240.webp': {
        uk: 'Студійні навушники AKG K240 MKII для роботи зі звуком',
        en: 'AKG K240 MKII Professional Semi-Open Over-Ear Studio Headphones',
        ru: 'Студийные наушники AKG K240 MKII для точной работы со звуком'
      },
      'assets/gear-huion-h610x.webp': {
        uk: 'Графічний планшет Huion H610X — 8192 рівні тиску',
        en: 'Huion H610X Graphics Drawing Tablet — 8192 pressure levels',
        ru: 'Графический планшет Huion H610X — 8192 уровня давления'
      },
      'assets/photo-kyiv-cathedral.webp': {
        uk: 'Малеєв Віктор — Архітектурна фотосесія в Києві',
        en: 'Maleiev Viktor — Kyiv Architectural Photography',
        ru: 'Малеев Виктор — Архитектурная фотосессия в Киеве'
      },
      'assets/photo-kyiv-portrait.webp': {
        uk: 'Малеєв Віктор — Творчий портрет на фоні собору',
        en: 'Maleiev Viktor — Creative Portrait with Cathedral Backdrop',
        ru: 'Малеев Виктор — Творческий портрет на фоне собора'
      },
      'assets/photo-autumn-courtyard.webp': {
        uk: 'Малеєв Віктор — Осінній затишний дворик',
        en: 'Maleiev Viktor — Autumn Courtyard Photography',
        ru: 'Малеев Виктор — Осенний уютный дворик'
      },
      'assets/photo-autumn-bench.webp': {
        uk: 'Малеєв Віктор — Осіння паркова фотосесія',
        en: 'Maleiev Viktor — Autumn Park Atmosphere',
        ru: 'Малеев Виктор — Осенняя парковая атмосфера'
      },
      'assets/photo-modernist-arch.webp': {
        uk: 'Малеєв Віктор — Модерністська архітектура',
        en: 'Maleiev Viktor — Modernist Urban Architecture',
        ru: 'Малеев Виктор — Модернистская городская архитектура'
      }
    };

    const gallerySets = {
      photos: [
        { src: 'assets/photo-kyiv-cathedral.webp', caption: 'Малеєв Віктор' },
        { src: 'assets/photo-kyiv-portrait.webp', caption: 'Малеєв Віктор' },
        { src: 'assets/photo-autumn-courtyard.webp', caption: 'Малеєв Віктор' },
        { src: 'assets/photo-autumn-bench.webp', caption: 'Малеєв Віктор' },
        { src: 'assets/photo-modernist-arch.webp', caption: 'Малеєв Віктор' }
      ],
      merch: [
        { src: 'assets/merch-deck-cards.webp', caption: 'Презентація дропу футболок у форматі 3D-колоди карток' },
        { src: 'assets/tshirt-quote-dreams-black.webp', caption: 'Футболка Acid-Wash: «Мрії можуть підняти, але не забувай про межі» з ланцюгом' },
        { src: 'assets/tshirt-quote-dreams-white.webp', caption: 'Біла оверсайз футболка: «Мрії можуть підняти, але не забувай про межі»' },
        { src: 'assets/tshirt-quote-stains.webp', caption: 'Футболка: «Плями — доказ що ти жив, а не боявся» (Вінтажна типографіка)' },
        { src: 'assets/tshirt-cyber-angel.webp', caption: 'Acid-Wash футболка зі скутим кібер-ангелом у неоновій рамці' },
        { src: 'assets/tshirt-cyber-lily.webp', caption: 'Acid-Wash футболка з павуковою лілією та японським канджі' },
        { src: 'assets/merch-bag-angel.webp', caption: 'Білий еко-шопер зі скутим кібер-ангелом' },
        { src: 'assets/merch-bag-cyber.webp', caption: 'Білий еко-шопер: Кіберпанк Лікоріс та Канджі' },
        { src: 'assets/merch-mug-fire.webp', caption: 'Керамічна кружка «СТРАХИ» у полум\'ї' }
      ],
      redesign: [
        { src: 'assets/old-site-design.webp', caption: 'Сайт Why Not? до редизайну (Desktop, Tablet, Mobile)' },
        { src: 'assets/after-desktop-home.webp', caption: 'Оновлена головна сторінка Why Not? (Desktop)' },
        { src: 'assets/after-desktop-about.webp', caption: 'Розділ «Про нас», Місія, Цінності та Прозоре відстеження замовлень' },
        { src: 'assets/after-mobile-cart.webp', caption: 'Мобільний кошик із фірмовим маскотом у кошику та рекомендаціями' },
        { src: 'assets/after-mobile-mission.webp', caption: 'Мобільна адаптація: картки місії та пошук товарів' },
        { src: 'assets/after-desktop-en.webp', caption: 'Англомовна локалізація маркетплейсу (International Storefront)' }
      ],
      branding: [
        { src: 'assets/logo-geometry.webp', caption: 'Геометрична сітка побудови логотипу (Vector Grid & Proportions)' },
        { src: 'assets/brand-board.webp', caption: 'Брендбук та носії стилю: пакування, мерч, зовнішня реклама' },
        { src: 'assets/mascot-flag.webp', caption: 'Маскот з прапором України' },
        { src: 'assets/mascot-packing.webp', caption: 'Маскот пакує мерч для клієнта' },
        { src: 'assets/mascot-cloak.webp', caption: 'Маскот у чорній мантії / Streetwear' },
        { src: 'assets/mascot-peek.webp', caption: 'Маскот визирає зі стіни / Стікер' }
      ],
      gear: [
        { src: 'assets/gear-lenovo-loq.webp', caption: 'Ноутбук Lenovo LOQ 15IAX9 — 3 TB Storage Workstation' },
        { src: 'assets/gear-akg-p220.webp', caption: 'Конденсаторний студійний мікрофон AKG P220' },
        { src: 'assets/gear-focusrite-scarlett.webp', caption: 'Звукова карта Focusrite Scarlett 2i2 Studio 3rd Gen' },
        { src: 'assets/gear-led-u600.webp', caption: 'Світлодіодна прямокутна лампа Led U600 зі штатив-триногою' },
        { src: 'assets/gear-jabra-evolve2.webp', caption: 'Бездротова гарнітура Jabra Evolve2 55 Stereo UC' },
        { src: 'assets/gear-akg-k240.webp', caption: 'Студійні навушники AKG K240 MKII для роботи зі звуком' },
        { src: 'assets/gear-huion-h610x.webp', caption: 'Графічний планшет Huion H610X — 8192 рівні тиску' }
      ],
      pitching: [
        { src: 'assets/pitching-banner.webp', caption: 'Пітчинг проєкту Why Not?: публічна презентація платформи перед аудиторією та партнерами' },
        { src: 'assets/partnership-handshake.webp', caption: 'Партнерство та співпраця з музикантами та дистриб\'юторами Why Not?' },
        { src: 'assets/after-mobile-partners.webp', caption: 'Співпраця з музичною дистриб\'юторською платформою MUZIKA.UA' }
      ]
    };

    let activeGallery = [];
    let activeGalleryIndex = 0;

    function openLightbox(src, caption, group) {
      if (group && gallerySets[group]) {
        activeGallery = gallerySets[group];
      } else {
        // Auto-detect which set contains this image
        let found = null;
        for (const g in gallerySets) {
          if (gallerySets[g].some(item => item.src === src)) {
            found = gallerySets[g];
            break;
          }
        }
        activeGallery = found || [{ src, caption: caption || '' }];
      }

      activeGalleryIndex = activeGallery.findIndex(item => item.src === src);
      if (activeGalleryIndex < 0) activeGalleryIndex = 0;

      // Preserve explicit caption if provided
      if (caption && activeGallery[activeGalleryIndex]) {
        activeGallery[activeGalleryIndex].caption = caption;
      }

      renderActiveLightboxImage();

      const modal = document.getElementById('lightbox');
      modal.classList.remove('hidden');
      if (window.lucide) {
        lucide.createIcons();
      }
    }

    function renderActiveLightboxImage() {
      const item = activeGallery[activeGalleryIndex];
      if (!item) return;

      const img = document.getElementById('lightbox-img');
      const cap = document.getElementById('lightbox-caption');
      const counter = document.getElementById('lightbox-counter');
      const counterText = document.getElementById('lightbox-counter-text');
      const prevBtn = document.getElementById('lightbox-prev');
      const nextBtn = document.getElementById('lightbox-next');
      const dotsContainer = document.getElementById('lightbox-dots');

      resetZoom();

      // Smooth subtle transition
      img.style.opacity = '0.3';
      img.src = resolveAsset(item.src);
      img.onload = () => { img.style.opacity = '1'; };
      setTimeout(() => { img.style.opacity = '1'; }, 60);

      // Localized Caption (prioritize imageCaptions dictionary by src)
      let displayCap = '';
      if (typeof imageCaptions !== 'undefined' && imageCaptions[item.src] && imageCaptions[item.src][currentLang]) {
        displayCap = imageCaptions[item.src][currentLang];
      } else {
        let authorName = (translations[currentLang] && translations[currentLang].badge_name) ? translations[currentLang].badge_name : 'Малеєв Віктор';
        displayCap = item.caption || '';
        if (displayCap === 'Малеєв Віктор' || displayCap === 'Maleiev Viktor' || displayCap === 'Малеев Виктор') {
          displayCap = authorName;
        }
      }
      if (cap) cap.textContent = displayCap;

      // Multi-image set controls (arrows, counter, dots)
      const hasMultiple = activeGallery.length > 1;

      if (counter) {
        counter.classList.toggle('hidden', !hasMultiple);
        if (counterText) counterText.textContent = `${activeGalleryIndex + 1} / ${activeGallery.length}`;
      }
      if (prevBtn) prevBtn.classList.toggle('hidden', !hasMultiple);
      if (nextBtn) nextBtn.classList.toggle('hidden', !hasMultiple);

      // Clickable pagination dots for sets <= 12 items
      if (dotsContainer) {
        if (hasMultiple && activeGallery.length <= 12) {
          dotsContainer.classList.remove('hidden');
          dotsContainer.innerHTML = activeGallery.map((_, idx) => {
            const isActive = idx === activeGalleryIndex;
            return `<button type="button" onclick="jumpToGallery(${idx})" aria-label="Фото ${idx + 1}" class="transition-all duration-200 cursor-pointer ${
              isActive 
                ? 'w-6 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm shadow-purple-500/50' 
                : 'w-2 h-2 rounded-full bg-white/25 hover:bg-white/60'
            }"></button>`;
          }).join('');
        } else {
          dotsContainer.classList.add('hidden');
          dotsContainer.innerHTML = '';
        }
      }

      if (window.lucide) {
        lucide.createIcons();
      }
    }

    function lightboxPrev(e) {
      if (e) e.stopPropagation();
      if (activeGallery.length <= 1) return;
      activeGalleryIndex = (activeGalleryIndex - 1 + activeGallery.length) % activeGallery.length;
      renderActiveLightboxImage();
    }

    function lightboxNext(e) {
      if (e) e.stopPropagation();
      if (activeGallery.length <= 1) return;
      activeGalleryIndex = (activeGalleryIndex + 1) % activeGallery.length;
      renderActiveLightboxImage();
    }

    function jumpToGallery(idx) {
      if (idx >= 0 && idx < activeGallery.length) {
        activeGalleryIndex = idx;
        renderActiveLightboxImage();
      }
    }

    function closeLightbox() {
      const modal = document.getElementById('lightbox');
      resetZoom();
      modal.classList.add('hidden');
      const customCursor = document.getElementById('custom-cursor');
      if (customCursor) customCursor.classList.remove('opacity-0');
    }

    // Keyboard Navigation: Escape, ArrowLeft, ArrowRight, A, D
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('lightbox');
      if (!modal || modal.classList.contains('hidden')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left' || e.key === 'a' || e.key === 'A') {
        lightboxPrev();
      } else if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'd' || e.key === 'D') {
        lightboxNext();
      }
    });

    // Touch Swipe Navigation for Mobile / Tablet
    (function setupLightboxSwipe() {
      const modal = document.getElementById('lightbox');
      if (!modal) return;

      let touchStartX = 0;
      let touchStartY = 0;

      modal.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      modal.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length !== 1 || isLightboxZoomed) return;
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;

        // Check if horizontal swipe was dominant and longer than 40px
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
          if (diffX < 0) {
            lightboxNext(); // Swiped left -> next photo
          } else {
            lightboxPrev(); // Swiped right -> prev photo
          }
        }
      }, { passive: true });
    })();

    // Custom Mouse Cursor Tracking
    const cursor = document.getElementById('custom-cursor');
    let mouseX = -100, mouseY = -100;
    let isTouch = false;

    window.addEventListener('touchstart', () => { isTouch = true; }, { once: true });

    document.addEventListener('mousemove', (e) => {
      if (isTouch) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      cursor.classList.remove('opacity-0');
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.add('opacity-0');
    });

    document.addEventListener('mousedown', () => {
      if (!isTouch) cursor.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
      if (!isTouch) cursor.classList.remove('cursor-click');
    });

    function setupCursorHover() {
      const clickables = document.querySelectorAll('a, button, input, [onclick], .cursor-pointer');
      clickables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
      });
    }

    // Mobile Navigation Drawer Toggle
    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      const icon = document.getElementById('menu-icon');
      const nav = document.getElementById('main-nav');
      if (!menu) return;
      menu.classList.toggle('hidden');
      const isOpen = !menu.classList.contains('hidden');
      if (nav) {
        if (isOpen) nav.classList.add('menu-open');
        else nav.classList.remove('menu-open');
      }
      if (icon) {
        icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        lucide.createIcons();
      }
    }

    function closeMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      const icon = document.getElementById('menu-icon');
      const nav = document.getElementById('main-nav');
      if (nav) nav.classList.remove('menu-open');
      if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      }
    }

    // ==========================================================
    // Multi-Theme Engine: Mode Switcher (Dark / Light) + 4 Named Palettes
    // 1. «Творчий Фіолетовий» (Midnight Violet: #000000, #0B0718, #160150, #400072, #600095)
    // 2. «Професійний синій» (Professional Blue: #06090E, #152A3D, #294F74, #3A668B, #437FB1)
    // 3. «Вогняні барви» (Fiery Hues: #120A0C, #1F1115, #C82333, #D4AF37, #F7F2F2, #A38F93)
    // 4. «Зелений спокій» (Green Serenity: #080C0A, #121A16, #A8FF1A, #F2F7F4, #8A9E93, #0B0F0D, #151E19, #1ED760)
    // ==========================================================
    let currentMode = 'dark';
    let currentPalette = 'midnight';

    (function initThemeState() {
      const savedFull = localStorage.getItem('preferred_full_theme');
      const savedSimple = localStorage.getItem('preferred_theme');
      if (savedFull) {
        if (savedFull.startsWith('blue')) currentPalette = 'blue';
        else if (savedFull.startsWith('fire')) currentPalette = 'fire';
        else if (savedFull.startsWith('green')) currentPalette = 'green';
        else currentPalette = 'midnight';
        currentMode = savedFull.includes('light') ? 'light' : 'dark';
      } else if (savedSimple) {
        currentMode = savedSimple === 'light' ? 'light' : 'dark';
        currentPalette = 'midnight';
      }
    })();

    function setMode(mode) {
      currentMode = mode;
      applyCurrentTheme();
    }

    function setTheme(mode) {
      setMode(mode);
    }

    function setPalette(palette) {
      currentPalette = palette;
      applyCurrentTheme();
      closeThemeDropdown();
    }

    function applyCurrentTheme() {
      const themeKey = currentPalette + '-' + currentMode;
      const html = document.documentElement;
      html.classList.remove('dark', 'light', 'theme-midnight', 'theme-blue', 'theme-fire', 'theme-green');

      if (currentPalette === 'blue') {
        html.classList.add('theme-blue');
      } else if (currentPalette === 'fire') {
        html.classList.add('theme-fire');
      } else if (currentPalette === 'green') {
        html.classList.add('theme-green');
      } else {
        html.classList.add('theme-midnight');
      }

      if (currentMode === 'light') {
        html.classList.add('light');
      } else {
        html.classList.add('dark');
      }

      localStorage.setItem('preferred_full_theme', themeKey);
      localStorage.setItem('preferred_theme', currentMode);

      updateThemeUI();
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    function toggleTheme() {
      // Quick toggle Dark <-> Light
      setMode(currentMode === 'dark' ? 'light' : 'dark');
    }

    function togglePalette() {
      // Cycle through midnight -> blue -> fire -> green -> midnight
      if (currentPalette === 'midnight') setPalette('blue');
      else if (currentPalette === 'blue') setPalette('fire');
      else if (currentPalette === 'fire') setPalette('green');
      else setPalette('midnight');
    }

    function toggleThemeDropdown(event) {
      if (event) event.stopPropagation();
      const menu = document.getElementById('theme-dropdown-menu');
      const chevron = document.getElementById('theme-chevron');
      if (!menu) return;
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        menu.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
      } else {
        menu.classList.add('hidden');
        if (chevron) chevron.classList.remove('rotate-180');
      }
    }

    function closeThemeDropdown() {
      const menu = document.getElementById('theme-dropdown-menu');
      const chevron = document.getElementById('theme-chevron');
      if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        if (chevron) chevron.classList.remove('rotate-180');
      }
    }

    function updateThemeUI() {
      const isDark = (currentMode === 'dark');
      const isMidnight = (currentPalette === 'midnight');
      const isBlue = (currentPalette === 'blue');
      const isFire = (currentPalette === 'fire');
      const isGreen = (currentPalette === 'green');

      // 1. Update Mode Tabs in Dropdown
      const dDarkTab = document.getElementById('mode-tab-dark');
      const dLightTab = document.getElementById('mode-tab-light');
      const mDarkTab = document.getElementById('m-mode-tab-dark');
      const mLightTab = document.getElementById('m-mode-tab-light');

      [dDarkTab, mDarkTab].forEach(t => {
        if (!t) return;
        if (isDark) {
          t.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer mode-tab-active';
        } else {
          t.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-400 hover:text-white bg-transparent';
        }
      });

      [dLightTab, mLightTab].forEach(t => {
        if (!t) return;
        if (!isDark) {
          t.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer mode-tab-active';
        } else {
          t.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-400 hover:text-white bg-transparent';
        }
      });

      // 2. Mode text indicators
      const modeInd = document.getElementById('mode-status-indicator');
      if (modeInd) {
        modeInd.textContent = isDark ? (currentLang === 'en' ? 'Dark Mode' : (currentLang === 'ru' ? 'Темная' : 'Темна')) : (currentLang === 'en' ? 'Light Mode' : (currentLang === 'ru' ? 'Светлая' : 'Світла'));
      }

      // 3. Highlight active palette card
      const pMid = document.getElementById('palette-opt-midnight');
      const pBlue = document.getElementById('palette-opt-blue');
      const pFire = document.getElementById('palette-opt-fire');
      const pGreen = document.getElementById('palette-opt-green');
      const mMid = document.getElementById('m-palette-opt-midnight');
      const mBlue = document.getElementById('m-palette-opt-blue');
      const mFire = document.getElementById('m-palette-opt-fire');
      const mGreen = document.getElementById('m-palette-opt-green');

      if (pMid) pMid.classList.toggle('theme-opt-active', isMidnight);
      if (pBlue) pBlue.classList.toggle('theme-opt-active', isBlue);
      if (pFire) pFire.classList.toggle('theme-opt-active', isFire);
      if (pGreen) pGreen.classList.toggle('theme-opt-active', isGreen);
      if (mMid) mMid.classList.toggle('theme-opt-active', isMidnight);
      if (mBlue) mBlue.classList.toggle('theme-opt-active', isBlue);
      if (mFire) mFire.classList.toggle('theme-opt-active', isFire);
      if (mGreen) mGreen.classList.toggle('theme-opt-active', isGreen);

      // 4. Active Dot in navbar
      const dot = document.getElementById('active-theme-dot');
      if (dot) {
        if (isFire) {
          dot.className = isDark 
            ? 'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C82333] ring-2 ring-[#120A0C] shadow-sm shadow-[#C82333]/80'
            : 'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C82333] ring-2 ring-white shadow-sm shadow-[#C82333]/80';
        } else if (isGreen) {
          dot.className = isDark
            ? 'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1ED760] ring-2 ring-[#080C0A] shadow-sm shadow-[#A8FF1A]/80'
            : 'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1ED760] ring-2 ring-white shadow-sm shadow-[#1ED760]/80';
        } else if (isMidnight) {
          dot.className = isDark 
            ? 'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#600095] ring-2 ring-[#07090E] shadow-sm shadow-[#600095]/60'
            : 'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#400072] ring-2 ring-white shadow-sm shadow-[#400072]/60';
        } else {
          dot.className = isDark
            ? 'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#437FB1] ring-2 ring-[#06090E] shadow-sm shadow-[#437FB1]/60'
            : 'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#294F74] ring-2 ring-white shadow-sm shadow-[#294F74]/60';
        }
      }

      // 5. Navbar theme icon & label
      const themeIcon = document.getElementById('theme-icon');
      if (themeIcon) {
        if (isDark) {
          themeIcon.setAttribute('data-lucide', 'moon');
          themeIcon.className = isFire ? 'w-4 h-4 text-[#D4AF37]' : (isGreen ? 'w-4 h-4 text-[#A8FF1A]' : (isBlue ? 'w-4 h-4 text-[#437FB1]' : 'w-4 h-4 text-purple-300'));
        } else {
          themeIcon.setAttribute('data-lucide', 'sun');
          themeIcon.className = isFire ? 'w-4 h-4 text-[#C82333]' : (isGreen ? 'w-4 h-4 text-[#1ED760]' : (isBlue ? 'w-4 h-4 text-[#294F74]' : 'w-4 h-4 text-amber-500'));
        }
      }

      const label = document.getElementById('theme-btn-label');
      if (label) {
        const key = isFire ? 'theme_fire_title' : (isGreen ? 'theme_green_title' : (isMidnight ? 'theme_midnight_title' : 'theme_blue_title'));
        label.textContent = (translations[currentLang] && translations[currentLang][key]) ? translations[currentLang][key] : (isFire ? 'Вогняні барви' : (isGreen ? 'Зелений спокій' : (isMidnight ? 'Творчий Фіолетовий' : 'Професійний синій')));
      }

      const mText = document.getElementById('m-active-theme-text');
      if (mText) {
        const mName = isDark ? (currentLang === 'en' ? 'Dark' : (currentLang === 'ru' ? 'Темная' : 'Темна')) : (currentLang === 'en' ? 'Light' : (currentLang === 'ru' ? 'Светлая' : 'Світла'));
        const pKey = isFire ? 'theme_fire_title' : (isGreen ? 'theme_green_title' : (isBlue ? 'theme_blue_title' : 'theme_midnight_title'));
        const pName = (translations[currentLang] && translations[currentLang][pKey]) ? translations[currentLang][pKey] : (isFire ? 'Вогняні барви' : (isGreen ? 'Зелений спокій' : (isBlue ? 'Професійний синій' : 'Творчий Фіолетовий')));
        mText.textContent = mName + ' • ' + pName;
      }
    }

    // Close theme dropdown on click outside or escape key
    document.addEventListener('click', function(e) {
      const wrapper = document.getElementById('theme-dropdown-wrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        closeThemeDropdown();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeThemeDropdown();
      }
    });

    // Initialize UI on DOM load
    document.addEventListener('DOMContentLoaded', function() {
      applyCurrentTheme();
    });

    // ==========================================================
    // Live Views & Likes Engagement Engine
    // ==========================================================
    const ENGAGEMENT_CONFIG = {
      baseViews: 69,
      baseLikes: 21,
      storageKeyViews: 'victor_portfolio_views_v2',
      storageKeyLikes: 'victor_portfolio_likes_v2',
      storageKeyHasLiked: 'victor_has_liked_v2',
      storageKeySession: 'victor_session_viewed_v2'
    };

    let totalViews = ENGAGEMENT_CONFIG.baseViews;
    let totalLikes = ENGAGEMENT_CONFIG.baseLikes;
    let hasUserLiked = false;

    function initEngagement() {
      const storedViews = parseInt(localStorage.getItem(ENGAGEMENT_CONFIG.storageKeyViews), 10);
      const storedLikes = parseInt(localStorage.getItem(ENGAGEMENT_CONFIG.storageKeyLikes), 10);
      hasUserLiked = localStorage.getItem(ENGAGEMENT_CONFIG.storageKeyHasLiked) === 'true';

      const isFirstInit = isNaN(storedViews);

      totalViews = !isNaN(storedViews) && storedViews >= ENGAGEMENT_CONFIG.baseViews 
        ? storedViews 
        : ENGAGEMENT_CONFIG.baseViews;
        
      totalLikes = !isNaN(storedLikes) && storedLikes >= ENGAGEMENT_CONFIG.baseLikes 
        ? storedLikes 
        : ENGAGEMENT_CONFIG.baseLikes;

      if (isFirstInit) {
        localStorage.setItem(ENGAGEMENT_CONFIG.storageKeyViews, totalViews);
        localStorage.setItem(ENGAGEMENT_CONFIG.storageKeyLikes, totalLikes);
        sessionStorage.setItem(ENGAGEMENT_CONFIG.storageKeySession, 'true');
      } else {
        // Increment view once per visitor session
        const sessionViewed = sessionStorage.getItem(ENGAGEMENT_CONFIG.storageKeySession);
        if (!sessionViewed) {
          totalViews += 1;
          localStorage.setItem(ENGAGEMENT_CONFIG.storageKeyViews, totalViews);
          sessionStorage.setItem(ENGAGEMENT_CONFIG.storageKeySession, 'true');
        }
      }

      // Smooth count-up animation
      animateCounter('widget-views-count', Math.max(0, totalViews - 8), totalViews, 700);
      animateCounter('widget-likes-count', Math.max(0, totalLikes - 4), totalLikes, 700);

      updateLikeButtonUI();
    }

    function animateCounter(elementId, start, end, duration) {
      const obj = document.getElementById(elementId);
      if (!obj) return;
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        obj.textContent = current;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          obj.textContent = end;
        }
      };
      window.requestAnimationFrame(step);
    }

    function updateLikeButtonUI() {
      const btn = document.getElementById('like-btn');
      const icon = document.getElementById('like-icon');
      if (!btn || !icon) return;

      if (hasUserLiked) {
        btn.classList.add('like-active');
        btn.classList.remove('from-purple-600/30', 'to-pink-600/30');
        btn.classList.add('from-pink-600', 'to-purple-600', 'shadow-pink-500/30');
        icon.classList.add('fill-current', 'text-white');
      } else {
        btn.classList.remove('like-active');
        btn.classList.remove('from-pink-600', 'to-purple-600', 'shadow-pink-500/30');
        btn.classList.add('from-purple-600/30', 'to-pink-600/30');
        icon.classList.remove('fill-current', 'text-white');
        icon.classList.add('text-pink-400');
      }
      lucide.createIcons();
    }

    function handleLikeClick(e) {
      if (e) e.stopPropagation();
      const likesElem = document.getElementById('widget-likes-count');

      if (!hasUserLiked) {
        hasUserLiked = true;
        totalLikes += 1;
        localStorage.setItem(ENGAGEMENT_CONFIG.storageKeyHasLiked, 'true');
        localStorage.setItem(ENGAGEMENT_CONFIG.storageKeyLikes, totalLikes);
        
        const clientX = e ? e.clientX : window.innerWidth - 60;
        const clientY = e ? e.clientY : window.innerHeight - 60;
        spawnFloatingHearts(clientX, clientY);
        showToast(
          currentLang === 'en' 
            ? 'Thank you for your support! ❤️' 
            : (currentLang === 'ru' ? 'Спасибо за поддержку! 💜' : 'Дякую за вподобайку! ❤️')
        );
      } else {
        hasUserLiked = false;
        totalLikes = Math.max(ENGAGEMENT_CONFIG.baseLikes, totalLikes - 1);
        localStorage.setItem(ENGAGEMENT_CONFIG.storageKeyHasLiked, 'false');
        localStorage.setItem(ENGAGEMENT_CONFIG.storageKeyLikes, totalLikes);
      }

      if (likesElem) likesElem.textContent = totalLikes;
      updateLikeButtonUI();
    }

    function spawnFloatingHearts(x, y) {
      const icons = ['❤️', '💖', '✨', '🔥', '👏'];
      for (let i = 0; i < 7; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = icons[Math.floor(Math.random() * icons.length)];
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 40;
        heart.style.left = `${x + offsetX}px`;
        heart.style.top = `${y + offsetY}px`;
        heart.style.fontSize = `${16 + Math.random() * 12}px`;
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1200);
      }
    }

    function showToast(message) {
      let toast = document.getElementById('engagement-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'engagement-toast';
        toast.className = 'fixed bottom-28 right-4 sm:right-6 z-50 px-4 py-2.5 rounded-xl backdrop-blur-xl bg-purple-950/90 border border-purple-500/40 text-white text-xs font-semibold shadow-2xl transition-all duration-300 opacity-0 transform translate-y-2 pointer-events-none flex items-center gap-2';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.remove('opacity-0', 'translate-y-2');
      toast.classList.add('opacity-100', 'translate-y-0');

      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
      }, 2400);
    }

    // Direct Email Message Compose & Copy functions
    function handleEmailClick(e) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const email = 'maleev.nosov@gmail.com';
      const subjectText = (currentLang === 'en')
        ? 'Collaboration inquiry for Maleiev Viktor'
        : (currentLang === 'ru' ? 'Предложение сотрудничества: Малеев Виктор' : 'Пропозиція співпраці: Малеєв Віктор');
      const subject = encodeURIComponent(subjectText);

      if (isMobile) {
        if (e) e.preventDefault();
        window.location.href = `mailto:${email}?subject=${subject}`;
        return;
      }

      // On desktop: open Gmail Web Compose directly in a new tab
      if (e) e.preventDefault();
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    }

    function copyEmailToClipboard(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const email = 'maleev.nosov@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const msg = (currentLang === 'en')
          ? 'Copied to clipboard: maleev.nosov@gmail.com 📋'
          : (currentLang === 'ru' ? 'Скопировано в буфер: maleev.nosov@gmail.com 📋' : 'Скопійовано в буфер: maleev.nosov@gmail.com 📋');
        showToast(msg);
      }).catch(() => {
        showToast('maleev.nosov@gmail.com');
      });
    }

    // Spawn Floating Phrase on Click
    document.addEventListener('click', (e) => {
      if (e.target.closest('#lightbox button') || e.target.closest('.filter-btn') || e.target.closest('nav') || e.target.closest('#engagement-widget') || e.target.closest('a') || e.target.closest('button')) return;

      const phrases = clickPhrases[currentLang] || clickPhrases['uk'];
      const text = phrases[phraseIndex % phrases.length];
      phraseIndex++;

      const bubble = document.createElement('div');
      bubble.className = 'click-phrase';
      bubble.textContent = text;
      bubble.style.left = `${e.clientX}px`;
      bubble.style.top = `${e.clientY}px`;

      document.body.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 1350);
    });

    // Dynamic Navbar Lifecycle:
    // 1. Зверху сайту: Шапка відображається звичайною прямокутною на весь екран
    // 2. При скролі вниз: Шапка плавно переходить у стиль плаваючої капсули
    // 3. Якщо гортати ще нижче: Капсула плавно ховається вгору за екран
    // 4. Якщо трохи крутнути вгору: Вона знову плавно з'являється у формі капсули
    // 5. Якщо доскролити до самого верху: Капсула плавно розкривається назад у звичайну прямокутну шапку
    function setupSmartNavbar() {
      const nav = document.getElementById('main-nav') || document.querySelector('nav');
      if (!nav) return;

      let lastScrollY = Math.max(0, window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0);
      let ticking = false;
      const scrollThreshold = 6;
      const topThreshold = 40;   // Below 40px: normal rectangular full-width header
      const hideThreshold = 140; // Past 140px: scrolling down deeper hides the capsule

      function updateNavbar() {
        const currentScrollY = Math.max(0, window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0);
        const scrollDelta = currentScrollY - lastScrollY;

        const mobileMenu = document.getElementById('mobile-menu');
        const isMobileMenuOpen = mobileMenu && !mobileMenu.classList.contains('hidden');

        if (currentScrollY <= topThreshold) {
          // 1 & 5. At very top (or scrolled back to top): return to normal full-width rectangle
          nav.classList.remove('nav-capsule');
          nav.classList.remove('nav-hidden');
        } else {
          // 2. Scrolled down from top: smoothly morphs into floating capsule
          nav.classList.add('nav-capsule');

          if (!isMobileMenuOpen && Math.abs(scrollDelta) >= scrollThreshold) {
            if (scrollDelta > 0) {
              // 3. Scrolling even lower past hideThreshold: capsule glides up and hides
              if (currentScrollY > hideThreshold) {
                nav.classList.add('nav-hidden');
                if (typeof closeThemeDropdown === 'function') {
                  closeThemeDropdown();
                }
              }
            } else if (scrollDelta < 0) {
              // 4. Scrolling up: capsule glides back down and reappears!
              nav.classList.remove('nav-hidden');
            }
          }
        }

        lastScrollY = currentScrollY;
        ticking = false;
      }

      window.addEventListener('scroll', () => {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateNavbar);
        }
      }, { passive: true });

      updateNavbar();
    }

    window.addEventListener('DOMContentLoaded', () => {
      // Text is already rendered in the page language at build time; this only
      // syncs language-dependent UI state (toggles, theme labels, captions).
      setLang(currentLang);
      applyCurrentTheme();
      initEngagement();
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
      setupCursorHover();
      setupSmartNavbar();
      checkHashExpand();
    });