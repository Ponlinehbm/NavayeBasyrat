// ============================================================
//  📚 کاتالوگ کتاب‌ها و اپیزودها
//  ویرایش‌شده با پنل مدیریت نوای بصیرت
//  آخرین به‌روزرسانی: ۱۴۰۵/۳/۱۹, ۱۸:۴۷:۰۵
// ============================================================

const CATALOG = [
  {
    "id": "book-4",
    "title": "سی فصل",
    "author": "مرحوم حاج میرزا محمدکریم کرمانی",
    "category": "جوابیه",
    "cover": "",
    "description": "",
    "totalEpisodes": 3,
    "episodes": [
      {
        "id": "ep-4-1",
        "title": "سی فصل",
        "duration": "3:03",
        "audioUrl": "https://t.me/navaybasirat/229",
        "telegramFileId": "CQACAgQAAx0CU3ncCAAD5WooHm3PINyvAAHz53hx_OohkcvQ1gACsBIAAkZUoVBag8xCea-ifjsE",
        "performer": "حامد جابری",
        "description": "🎧رساله سی فصل \n🔹مقدمه\n#سی_فصل\n#آقای_مرحوم\n#حامد_جابری\n\n@navaybasirat",
        "date": "۱۴۰۵/۰۳/۱۹",
        "isNew": true
      },
      {
        "id": "ep-4-42",
        "title": "سی فصل",
        "duration": "14:40",
        "audioUrl": "https://t.me/navaybasirat/230",
        "telegramFileId": "CQACAgQAAx0CU3ncCAAD5mooHm0mbSZojP4vqgABZo7ojmt2EwACshIAAkZUoVBKo5T-1voWmTsE",
        "performer": "حامد جابری",
        "description": "🎧رساله سی فصل \n🔹عبارت سؤال\n#سی_فصل\n#آقای_مرحوم\n#حامد_جابری\n\n@navaybasirat",
        "date": "۱۴۰۵/۰۳/۱۹",
        "isNew": true
      },
      {
        "id": "ep-4-443",
        "title": "سی فصل",
        "duration": "11:34",
        "audioUrl": "https://t.me/navaybasirat/231",
        "telegramFileId": "CQACAgQAAx0CU3ncCAAD52ooHm7mug8-1BgoyEIyNHDUOmT6AAKzEgACRlShUHNB_YywGnghOwQ",
        "performer": "حامد جابری",
        "description": "🎧رساله سی فصل \n🔹فصل اول:در جواب مسأله اول که اصول دین باشد\n#سی_فصل\n#آقای_مرحوم\n#حامد_جابری\n\n@navaybasirat",
        "date": "۱۴۰۵/۰۳/۱۹",
        "isNew": true
      }
    ]
  }
];

// دسته‌بندی‌های موجود
const CATEGORIES = ["همه", ...new Set(CATALOG.map(b => b.category))];
