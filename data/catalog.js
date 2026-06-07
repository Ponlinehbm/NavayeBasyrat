// ============================================================
//  📚 کاتالوگ کتاب‌ها و اپیزودها
//  ویرایش‌شده با پنل مدیریت نوای بصیرت
//  آخرین به‌روزرسانی: ۱۴۰۵/۳/۱۷, ۱۶:۴۵:۵۷
// ============================================================

const CATALOG = [
  {
    "id": "book-1",
    "title": "میزان",
    "author": "مرحوم حاج میرزا محمدباقر شریف طباطبایی",
    "category": "اعتقادی",
    "cover": "image/test.png",
    "description": "",
    "totalEpisodes": 20,
    "episodes": [
      {
        "id": "ep-1-1",
        "title": "فصل اول",
        "duration": "42:30",
        "audioUrl": "https://t.me/navaybasirat/1006",
        "telegramFileId": "",
        "description": "",
        "date": "۱۴۰۳/۰۱/۱۵",
        "isNew": true
      },
      {
        "id": "ep-1-2",
        "title": "فصل دوم",
        "duration": "38:15",
        "audioUrl": "https://t.me/navaybasirat/1005",
        "telegramFileId": "",
        "description": "",
        "date": "۱۴۰۳/۰۱/۲۲",
        "isNew": false
      },
      {
        "id": "ep-1-3",
        "title": "فصل سوم",
        "duration": "45:00",
        "audioUrl": "https://t.me/navaybasirat/1004",
        "telegramFileId": "",
        "description": "",
        "date": "۱۴۰۳/۰۱/۲۹",
        "isNew": false
      }
    ]
  },
  {
    "id": "book-2",
    "title": "سلطانیه",
    "author": "حاج محمد کریم کرمانی ",
    "category": "اعتقادی",
    "cover": "https://via.placeholder.com/300x300/0f3460/e94560?text=🧠",
    "description": ".",
    "totalEpisodes": 150,
    "episodes": [
      {
        "id": "ep-2-1",
        "title": "فصل 1",
        "duration": "50:20",
        "audioUrl": "https://t.me/your_channel/4",
        "telegramFileId": "",
        "description": "معرفی دو نوع تفکر: اتوماتیک و تحلیلی",
        "date": "۱۴۰۳/۰۲/۰۵",
        "isNew": true
      },
      {
        "id": "ep-2-2",
        "title": "فصل دوم",
        "duration": "47:10",
        "audioUrl": "https://t.me/your_channel/5",
        "telegramFileId": "",
        "description": "بررسی رایج‌ترین اشتباهات ذهنی که روزانه مرتکب می‌شویم",
        "date": "۱۴۰۳/۰۲/۱۲",
        "isNew": false
      }
    ]
  },
  {
    "id": "book-3",
    "title": "شرح الزیارة الجامعة الکبیرة",
    "author": "شیخ احمد بن زین الدین احسائی",
    "category": "فضائل",
    "cover": "https://via.placeholder.com/300x300/16213e/53c0f0?text=✨",
    "description": ".",
    "totalEpisodes": 3,
    "episodes": [
      {
        "id": "ep-3-1",
        "title": "اصل‌گرایی چیست؟",
        "duration": "35:45",
        "audioUrl": "https://t.me/your_channel/6",
        "telegramFileId": "",
        "description": "تعریف اصل‌گرایی و تفاوت آن با مینیمالیسم",
        "date": "۱۴۰۳/۰۳/۰۱",
        "isNew": false
      },
      {
        "id": "ep-3-2",
        "title": "نه گفتن با احترام",
        "duration": "39:00",
        "audioUrl": "https://t.me/your_channel/7",
        "telegramFileId": "",
        "description": "چگونه به درخواست‌های غیرضروری نه بگوییم بدون آسیب به روابط",
        "date": "۱۴۰۳/۰۳/۰۸",
        "isNew": true
      },
      {
        "id": "ep-3-33",
        "title": "فصل 4",
        "duration": "5:12",
        "audioUrl": "https://t.me/algod1992/16416",
        "telegramFileId": "",
        "description": "",
        "date": "۱۴۰۵/۰۳/۱۷",
        "isNew": false
      }
    ]
  }
];

// دسته‌بندی‌های موجود
const CATEGORIES = ["همه", ...new Set(CATALOG.map(b => b.category))];
