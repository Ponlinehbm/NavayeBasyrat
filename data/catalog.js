// ============================================================
//  📚 کاتالوگ کتاب‌ها و اپیزودها
//  برای افزودن کتاب یا اپیزود جدید، همین فایل را ویرایش کنید
// ============================================================

const CATALOG = [
  {
    id: "book-1",
    title: "میزان",
    author: "آقای شریف طباطبایی",
    category: "اعتقادی",
    cover: "https://via.placeholder.com/300x300/1a1a2e/e94560?text=📖",
    description: "",
    totalEpisodes: 20,
    episodes: [
      {
        id: "ep-1-1",
        title: "فصل اول",
        duration: "42:30",
        // 🔗 لینک فایل صوتی از کانال تلگرام را اینجا قرار دهید
        audioUrl: "https://t.me/navaybasirat/1006",
        telegramFileId: "", // اختیاری: File ID تلگرام
        description: "",
        date: "۱۴۰۳/۰۱/۱۵",
        isNew: true
      },
      {
        id: "ep-1-2",
        title: "فصل دوم",
        duration: "38:15",
        audioUrl: "https://t.me/navaybasirat/1005",
        telegramFileId: "",
        description: "",
        date: "۱۴۰۳/۰۱/۲۲",
        isNew: false
      },
      {
        id: "ep-1-3",
        title: "فصل سوم",
        duration: "45:00",
        audioUrl: "https://t.me/navaybasirat/1004",
        telegramFileId: "",
        description: "",
        date: "۱۴۰۳/۰۱/۲۹",
        isNew: false
      }
    ]
  },
  {
    id: "book-2",
    title: "سلطانیه",
    author: "حاج محمد کریم کرمانی ",
    category: "اعتقادی",
    cover: "https://via.placeholder.com/300x300/0f3460/e94560?text=🧠",
    description: ".",
    totalEpisodes: 150,
    episodes: [
      {
        id: "ep-2-1",
        title: "فصل 1",
        duration: "50:20",
        audioUrl: "https://t.me/your_channel/4",
        telegramFileId: "",
        description: "معرفی دو نوع تفکر: اتوماتیک و تحلیلی",
        date: "۱۴۰۳/۰۲/۰۵",
        isNew: true
      },
      {
        id: "ep-2-2",
        title: "فصل دوم",
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
    title: "شرح الزیارة الجامعة الکبیرة",
    author: "شیخ احمد بن زین الدین احسائی",
    category: "فضائل",
    cover: "https://via.placeholder.com/300x300/16213e/53c0f0?text=✨",
    description: ".",
    totalEpisodes: 50,
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
