// ============================================================
//  📚 کاتالوگ کتاب‌ها و اپیزودها
//  برای افزودن کتاب یا اپیزود جدید، همین فایل را ویرایش کنید
// ============================================================

const CATALOG = [
  {
    id: "book-1",
    title: "میزان",
    author: "آقای شریف طباطبایی",
    category: "توسعه‌فردی",
    cover: "https://via.placeholder.com/300x300/1a1a2e/e94560?text=📖",
    description: "کتابی درباره چگونگی شکل‌گیری عادت‌ها و تغییر آن‌ها در زندگی، کسب‌وکار و جامعه.",
    totalEpisodes: 3,
    episodes: [
      {
        id: "ep-1-1",
        title: "فصل اول: حلقه عادت",
        duration: "42:30",
        // 🔗 لینک فایل صوتی از کانال تلگرام را اینجا قرار دهید
        audioUrl: "https://t.me/navaybasirat/1006",
        telegramFileId: "", // اختیاری: File ID تلگرام
        description: "آشنایی با ساختار سه‌گانه عادت: نشانه، روتین، پاداش",
        date: "۱۴۰۳/۰۱/۱۵",
        isNew: true
      },
      {
        id: "ep-1-2",
        title: "فصل دوم: مغز و عادت‌ها",
        duration: "38:15",
        audioUrl: "https://t.me/navaybasirat/1005",
        telegramFileId: "",
        description: "بررسی نقش عقده‌های قاعده‌ای در شکل‌گیری عادت‌های خودکار",
        date: "۱۴۰۳/۰۱/۲۲",
        isNew: false
      },
      {
        id: "ep-1-3",
        title: "فصل سوم: کلید طلایی",
        duration: "45:00",
        audioUrl: "https://t.me/your_channel/3",
        telegramFileId: "",
        description: "چطور می‌توان عادت‌های قدیمی را با جایگزینی روتین تغییر داد؟",
        date: "۱۴۰۳/۰۱/۲۹",
        isNew: false
      }
    ]
  },
  {
    id: "book-2",
    title: "تفکر سریع و کند",
    author: "دانیل کانمن",
    category: "روان‌شناسی",
    cover: "https://via.placeholder.com/300x300/0f3460/e94560?text=🧠",
    description: "کاوش در دو سیستم تفکر انسانی و چگونگی تأثیر آن‌ها بر تصمیمات روزمره.",
    totalEpisodes: 2,
    episodes: [
      {
        id: "ep-2-1",
        title: "سیستم ۱ و سیستم ۲",
        duration: "50:20",
        audioUrl: "https://t.me/your_channel/4",
        telegramFileId: "",
        description: "معرفی دو نوع تفکر: اتوماتیک و تحلیلی",
        date: "۱۴۰۳/۰۲/۰۵",
        isNew: true
      },
      {
        id: "ep-2-2",
        title: "سوگیری‌های شناختی",
        duration: "47:10",
        audioUrl: "https://t.me/your_channel/5",
        telegramFileId: "",
        description: "بررسی رایج‌ترین اشتباهات ذهنی که روزانه مرتکب می‌شویم",
        date: "۱۴۰۳/۰۲/۱۲",
        isNew: false
      }
    ]
  },
  {
    id: "book-3",
    title: "مسیر نه",
    author: "گرگ مک‌کئون",
    category: "بهره‌وری",
    cover: "https://via.placeholder.com/300x300/16213e/53c0f0?text=✨",
    description: "هنر کمتر، ولی بهتر انجام دادن کارها از طریق اصل‌گرایی در زندگی.",
    totalEpisodes: 2,
    episodes: [
      {
        id: "ep-3-1",
        title: "اصل‌گرایی چیست؟",
        duration: "35:45",
        audioUrl: "https://t.me/your_channel/6",
        telegramFileId: "",
        description: "تعریف اصل‌گرایی و تفاوت آن با مینیمالیسم",
        date: "۱۴۰۳/۰۳/۰۱",
        isNew: false
      },
      {
        id: "ep-3-2",
        title: "نه گفتن با احترام",
        duration: "39:00",
        audioUrl: "https://t.me/your_channel/7",
        telegramFileId: "",
        description: "چگونه به درخواست‌های غیرضروری نه بگوییم بدون آسیب به روابط",
        date: "۱۴۰۳/۰۳/۰۸",
        isNew: true
      }
    ]
  }
];

// دسته‌بندی‌های موجود (از روی کاتالوگ به صورت خودکار ساخته می‌شود)
const CATEGORIES = ["همه", ...new Set(CATALOG.map(b => b.category))];

// ============================================================
// 🆕 راهنمای افزودن کتاب یا اپیزود جدید:
//
// برای افزودن کتاب جدید:
//   1. یک آبجکت جدید به آرایه CATALOG اضافه کنید
//   2. id منحصربه‌فرد مثل "book-4" بگذارید
//   3. اپیزودها را در آرایه episodes تعریف کنید
//   4. audioUrl را با لینک پست تلگرام پر کنید (مثل https://t.me/channel/postid)
//
// برای افزودن اپیزود به کتاب موجود:
//   1. کتاب مورد نظر را پیدا کنید
//   2. یک آبجکت جدید به آرایه episodes آن اضافه کنید
//   3. audioUrl را با لینک پست تلگرام پر کنید
//   4. totalEpisodes کتاب را یک واحد افزایش دهید
// ============================================================
