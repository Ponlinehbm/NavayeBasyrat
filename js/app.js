// ============================================================
//  🎧 منطق اصلی اپلیکیشن پادکست کتاب
// ============================================================

/* ── وضعیت سراسری ── */
const State = {
  view: 'home',           // 'home' | 'book'
  currentBook: null,
  player: {
    episode: null,
    book: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    speed: 1,
    expanded: false,
  },
  filter: {
    category: 'همه',
    author: 'همه',
    query: '',
  },
  audio: null,
};

/* ── ایموجی پیش‌فرض برای جلد کتاب‌ها ── */
const COVER_EMOJIS = ['📗','📘','📙','📕','📔','📒','📚','🔖'];
function bookEmoji(id) {
  const idx = parseInt(id.replace(/\D/g, '')) % COVER_EMOJIS.length;
  return COVER_EMOJIS[idx];
}

/* ── رندر صفحه اصلی ── */
function renderHome() {
  const { category, query } = State.filter;

  let books = CATALOG.filter(b => {
    const matchCat = category === 'همه' || b.category === category;
    const matchAuthor = State.filter.author === 'all' || b.author === State.filter.author;
    const query = State.filter.query.toLowerCase();
    const matchSearch = query === '' || 
      b.title.includes(query) ||
      b.author.includes(query) ||
      b.category.includes(query);
      return matchCat && matchAuthor && matchSearch;
  });

  const hasNew = b => b.episodes.some(e => e.isNew);

  const grid = document.getElementById('books-grid');
  grid.innerHTML = '';

  if (!books.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🔍</div>
        <p>کتابی یافت نشد</p>
      </div>`;
    return;
  }

  books.forEach((book, i) => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.animationDelay = `${i * 0.06}s`;
    card.innerHTML = `
      ${hasNew(book) ? '<div class="badge-new">جدید</div>' : ''}
      <div class="book-cover">
        <span class="book-cover-emoji">${bookEmoji(book.id)}</span>
      </div>
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
        <div class="book-meta">
          <span class="book-episodes">${book.episodes.length} اپیزود</span>
          <span class="book-category">${book.category}</span>
        </div>
      </div>`;
    card.addEventListener('click', () => openBook(book.id));
    grid.appendChild(card);
  });

  // آمار
  document.getElementById('total-books').textContent = CATALOG.length;
  document.getElementById('total-episodes').textContent =
    CATALOG.reduce((s, b) => s + b.episodes.length, 0);
}

/* ── باز کردن کتاب ── */
function openBook(bookId) {
  const book = CATALOG.find(b => b.id === bookId);
  if (!book) return;
  State.currentBook = book;
  State.view = 'book';

  document.getElementById('home-view').style.display = 'none';
  const bookView = document.getElementById('book-view');
  bookView.style.display = 'block';
  bookView.scrollTop = 0;
  window.scrollTo(0, 0);

  renderBookPage(book);
}

/* ── رندر صفحه کتاب ── */
function renderBookPage(book) {
  document.getElementById('book-hero-emoji').textContent  = bookEmoji(book.id);
  document.getElementById('book-hero-title').textContent  = book.title;
  document.getElementById('book-hero-author').textContent = book.author;
  document.getElementById('book-hero-desc').textContent   = book.description;
  document.getElementById('book-ep-count').textContent    = book.episodes.length;
  document.getElementById('book-category-badge').textContent = book.category;

  const list = document.getElementById('episodes-list');
  list.innerHTML = '';

  book.episodes.forEach((ep, i) => {
    const card = document.createElement('div');
    card.className = 'episode-card';
    card.id = `ep-card-${ep.id}`;
    card.style.animationDelay = `${i * 0.07}s`;
    if (State.player.episode?.id === ep.id && State.player.isPlaying) {
      card.classList.add('playing');
    }

    card.innerHTML = `
      <div class="ep-play-btn" id="ep-btn-${ep.id}">
        ${State.player.episode?.id === ep.id && State.player.isPlaying
          ? `<div class="wave-bars">
               <div class="wave-bar"></div><div class="wave-bar"></div>
               <div class="wave-bar"></div><div class="wave-bar"></div>
             </div>`
          : '▶'}
      </div>
      <div class="ep-info">
        <div class="ep-title">${ep.title}</div>
        <div class="ep-desc">${ep.description}</div>
        <div class="ep-meta">
          <span class="ep-duration">⏱ ${ep.duration}</span>
          <span class="ep-date">${ep.date}</span>
          ${ep.isNew ? '<span class="ep-new-badge">جدید</span>' : ''}
        </div>
      </div>`;

    card.addEventListener('click', () => playEpisode(ep, book));
    list.appendChild(card);
  });
}

/* ── بازگشت به خانه ── */
function goHome() {
  State.view = 'home';
  State.currentBook = null;
  document.getElementById('home-view').style.display = 'block';
  document.getElementById('book-view').style.display = 'none';
  window.scrollTo(0, 0);
}

/* ── پخش اپیزود ── */
function playEpisode(episode, book) {
  // اگر همان اپیزود است → toggle
  if (State.player.episode?.id === episode.id) {
    togglePlay();
    return;
  }

  // اپیزود جدید
  if (State.audio) {
    State.audio.pause();
  }

  State.player.episode  = episode;
  State.player.book     = book;
  State.player.isPlaying = false;
  State.player.currentTime = 0;

  // ساختن آبجکت Audio
  State.audio = new Audio();
  State.audio.playbackRate = State.player.speed;

  // رویدادها
  State.audio.addEventListener('timeupdate', onTimeUpdate);
  State.audio.addEventListener('loadedmetadata', () => {
    State.player.duration = State.audio.duration;
    updateProgressUI();
  });
  State.audio.addEventListener('ended', onEnded);
  State.audio.addEventListener('error', onAudioError);

  // تلاش برای بارگذاری فایل صوتی
  // اگر audioUrl لینک تلگرام است، به کانال باز می‌کنیم
  const isTgLink = episode.audioUrl.startsWith('https://t.me/');

  if (!isTgLink) {
    State.audio.src = episode.audioUrl;
    State.audio.load();
    State.audio.play().then(() => {
      State.player.isPlaying = true;
      updatePlayerUI();
    }).catch(() => {
      State.player.isPlaying = false;
      updatePlayerUI();
    });
  } else {
    // لینک تلگرام → نمایش پلیر و دکمه باز کردن در تلگرام
    State.player.isPlaying = false;
  }

  showPlayer();
  updatePlayerUI();
  refreshEpisodeCards();
}

/* ── توقف/پخش ── */
function togglePlay() {
  if (!State.audio || !State.player.episode) return;
  if (State.player.isPlaying) {
    State.audio.pause();
    State.player.isPlaying = false;
  } else {
    State.audio.play().catch(() => {});
    State.player.isPlaying = true;
  }
  updatePlayerUI();
  refreshEpisodeCards();
}

/* ── رویداد پیشرفت ── */
function onTimeUpdate() {
  State.player.currentTime = State.audio.currentTime;
  updateProgressUI();
}

function onEnded() {
  State.player.isPlaying = false;
  State.player.currentTime = 0;
  updatePlayerUI();
  refreshEpisodeCards();
  // پخش اپیزود بعدی
  autoPlayNext();
}

function onAudioError() {
  State.player.isPlaying = false;
  updatePlayerUI();
}

/* ── پخش خودکار بعدی ── */
function autoPlayNext() {
  if (!State.player.book || !State.player.episode) return;
  const episodes = State.player.book.episodes;
  const idx = episodes.findIndex(e => e.id === State.player.episode.id);
  if (idx < episodes.length - 1) {
    setTimeout(() => playEpisode(episodes[idx + 1], State.player.book), 800);
  }
}

/* ── اپیزود قبلی/بعدی ── */
function prevEpisode() {
  if (!State.player.book || !State.player.episode) return;
  const eps = State.player.book.episodes;
  const idx = eps.findIndex(e => e.id === State.player.episode.id);
  if (idx > 0) playEpisode(eps[idx - 1], State.player.book);
}
function nextEpisode() {
  if (!State.player.book || !State.player.episode) return;
  const eps = State.player.book.episodes;
  const idx = eps.findIndex(e => e.id === State.player.episode.id);
  if (idx < eps.length - 1) playEpisode(eps[idx + 1], State.player.book);
}

/* ── جلو/عقب ۱۵ ثانیه ── */
function seekBy(secs) {
  if (!State.audio) return;
  State.audio.currentTime = Math.max(0,
    Math.min(State.audio.duration || 0, State.audio.currentTime + secs));
}

/* ── تغییر سرعت ── */
const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];
function cycleSpeed() {
  const idx = SPEEDS.indexOf(State.player.speed);
  State.player.speed = SPEEDS[(idx + 1) % SPEEDS.length];
  if (State.audio) State.audio.playbackRate = State.player.speed;
  document.getElementById('speed-btn').textContent = `${State.player.speed}×`;
}

/* ── باز کردن در تلگرام ── */
function openInTelegram() {
  const ep = State.player.episode;
  if (!ep) return;
  const url = ep.audioUrl;
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
}

/* ── نمایش/مخفی پلیر ── */
function showPlayer() {
  document.getElementById('player-bar').classList.add('visible');
}

/* ── گسترش/جمع پلیر ── */
function togglePlayerExpand() {
  State.player.expanded = !State.player.expanded;
  document.getElementById('player-full').classList.toggle('open', State.player.expanded);
}

/* ── به‌روزرسانی UI پلیر ── */
function updatePlayerUI() {
  const ep   = State.player.episode;
  const book = State.player.book;
  if (!ep) return;

  document.getElementById('mini-title').textContent = ep.title;
  document.getElementById('mini-book').textContent  = book?.title || '';

  const playIcon = State.player.isPlaying ? '⏸' : '▶';
  document.getElementById('mini-play-btn').textContent  = playIcon;
  document.getElementById('full-play-btn').textContent  = playIcon;

  document.getElementById('tg-open-btn').textContent =
    `🔗 شنیدن در تلگرام — ${ep.title}`;

  updateProgressUI();
}

function updateProgressUI() {
  const cur = State.player.currentTime;
  const dur = State.player.duration || 0;
  const pct = dur > 0 ? (cur / dur * 100) : 0;

  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('time-current').textContent  = formatTime(cur);
  document.getElementById('time-total').textContent    = formatTime(dur);
}

/* ── ریفرش کارت‌های اپیزود ── */
function refreshEpisodeCards() {
  if (State.view !== 'book' || !State.currentBook) return;
  State.currentBook.episodes.forEach(ep => {
    const card = document.getElementById(`ep-card-${ep.id}`);
    const btn  = document.getElementById(`ep-btn-${ep.id}`);
    if (!card || !btn) return;

    const isActive = State.player.episode?.id === ep.id;
    const isPlaying = isActive && State.player.isPlaying;

    card.classList.toggle('playing', isPlaying);
    btn.innerHTML = isPlaying
      ? `<div class="wave-bars">
           <div class="wave-bar"></div><div class="wave-bar"></div>
           <div class="wave-bar"></div><div class="wave-bar"></div>
         </div>`
      : (isActive ? '⏸' : '▶');
  });
}

/* ── فرمت زمان ── */
function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/* ── پروگرس بار کلیک ── */
function onProgressClick(e) {
  if (!State.audio || !State.player.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  State.audio.currentTime = pct * State.player.duration;
}

/* ── فیلترهای دسته‌بندی ── */
function setupFilters() {
  const bar = document.getElementById('filter-bar');
  bar.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip' + (cat === State.filter.category ? ' active' : '');
    chip.textContent = cat;
    chip.addEventListener('click', () => {
      State.filter.category = cat;
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderHome();
    });
    bar.appendChild(chip);
  });
}

/* ── سرچ ── */
function setupSearch() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', () => {
    State.filter.query = input.value.trim();
    renderHome();
  });
}

/* ── تلگرام WebApp ── */
function initTelegram() {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.setHeaderColor('#0a0a0f');
    tg.setBackgroundColor('#0a0a0f');
  }
}

/* ── راه‌اندازی ── */
function init() {
  initTelegram();
  setupFilters();
  setupSearch();
  renderHome();

  // دکمه بازگشت
  document.getElementById('back-btn').addEventListener('click', goHome);

  // پروگرس بار
  document.getElementById('progress-bar-wrap').addEventListener('click', onProgressClick);

  // کنترل‌های پلیر
  document.getElementById('mini-play-btn').addEventListener('click', togglePlay);
  document.getElementById('full-play-btn').addEventListener('click', togglePlay);
  document.getElementById('prev-btn').addEventListener('click', prevEpisode);
  document.getElementById('next-btn').addEventListener('click', nextEpisode);
  document.getElementById('seek-back-btn').addEventListener('click', () => seekBy(-15));
  document.getElementById('seek-fwd-btn').addEventListener('click', () => seekBy(15));
  document.getElementById('speed-btn').addEventListener('click', cycleSpeed);
  document.getElementById('tg-open-btn').addEventListener('click', openInTelegram);

  // گسترش پلیر
  document.getElementById('expand-handle').addEventListener('click', togglePlayerExpand);
  document.getElementById('player-mini').addEventListener('click', (e) => {
    if (!e.target.closest('.ctrl-btn')) togglePlayerExpand();
  });

  // حذف لودر
  setTimeout(() => {
    const loader = document.getElementById('app-loader');
    if (loader) loader.style.opacity = '0';
    setTimeout(() => loader?.remove(), 300);
  }, 600);
}

document.getElementById('author-filter').addEventListener('change', (e) => {
    State.filter.author = e.target.value;
    renderHome();
});
