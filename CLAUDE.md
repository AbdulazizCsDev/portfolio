# CLAUDE.md

بورتفوليو شخصي لعبدالعزيز الحيدان (مهندس ذكاء اصطناعي / تعلّم آلة) — صفحة
واحدة ثنائية اللغة (EN/AR) مع مساعد صوتي `Aime` مدمج. منشور على Vercel.

## Stack
- React 19.2 + Vite 8 (JS فقط، لا TypeScript) — `type: module`
- three ^0.184 — يُحمَّل ديناميكياً فقط
- ESLint 9 flat config (`eslint.config.js`) + react-hooks + react-refresh
- CSS خام بمتغيّرات — لا Tailwind ولا أي مكتبة UI ولا router ولا state library

## الأوامر
- `npm run dev` — خادم التطوير
- `npm run build` — بناء الإنتاج (`dist/`)
- `npm run preview` — معاينة البناء
- `npm run lint` — `eslint .`
- **لا يوجد إطار اختبارات ولا سكربت `test`** — التحقق = `lint` + `build`

## المجلدات
- `src/main.jsx` — نقطة الدخول؛ يعطّل استرجاع موضع التمرير ويجبر الصفحة تبدأ من الأعلى
- `src/App.jsx` — التركيب والترتيب، ومراقب `IntersectionObserver` لتأثير الظهور
- `src/context/LanguageContext.jsx` — **كل** نصوص الموقع + بيانات المشاريع/المهارات/السيرة
- `src/components/` — مكوّن لكل قسم، مع ملف `.css` مجاور بنفس الاسم
- `src/index.css` — متغيّرات التصميم (`:root`)، الـ reset، الأصناف المشتركة
- `public/` — الأيقونات وملف الـ CV الذي يُحمَّل من زر الهيرو

## الـ Conventions (مستنتجة من الكود)
- **مصدر واحد للنصوص**: لا نص ثابت داخل أي مكوّن. كل شيء من `useLanguage()` عبر
  `t.<section>.<key>`. كائنا `en` و`ar` مرآة لبعض — أي مفتاح جديد يُضاف في
  الاثنين معاً، وإلا انهار العرض عند التبديل (`.map` على `undefined`).
- **البيانات محتوى لا كود**: المشاريع والمهارات والشهادات مصفوفات داخل
  `translations`؛ المكوّن يعرضها فقط. إضافة مشروع = إضافة عنصر، لا تعديل JSX.
- **مُعرّفات الأقسام عقد**: `hero/about/experience/projects/now/skills/contact`
  يستعملها الـ Navbar و`detectIntent` و`applyAction` عبر `getElementById`.
- **`data-target-id`** على البطاقات يطابق `id` في `translations`، والخادم الخارجي
  يرجّع رموزاً مثل `projects.board-room` لتوجيه التمرير والإضاءة.
- **هيكل القسم**: `<section id>` ← `.section-inner` ← `.section-title` + `.title-line`.
- **الحركة**: أضف `data-reveal` (+ `data-reveal-delay="1..5"` فقط، لا أكثر).
- **الأنماط**: متغيّرات `--*` من `index.css` حصراً، لا ألوان مكتوبة يدوياً.
  `.card-glass` و`.tag` أصناف مشتركة تُعاد لا تُستنسخ.
- **RTL**: يُدار بـ `body.rtl` + `documentElement.dir`؛ كل ملف CSS يحمل تجاوزات
  `.rtl` الخاصة به عند الحاجة.
- **الأخطاء**: لا Error Boundary ولا مكتبة تنبيهات. فشل الشبكة يُبتلع بـ `catch`
  ويُعرَض كرسالة من `t.aime.noBackend` / `t.aime.noTranscribe` — رسالة للمستخدم
  بلغته، لا استثناء يطفو للأعلى. أي نداء شبكة جديد يتبع نفس النمط.
- **الأيقونات**: SVG مضمّن كمكوّن صغير أعلى الملف الذي يستعمله — لا مكتبة أيقونات.
- **الرسوميات**: `import('three').then(...)` ديناميكياً، وقبلها حارس
  `prefers-reduced-motion` يُنهي التنفيذ مبكراً، وتنظيف كامل في `return` الـ effect.

## لا تفعل
- لا تضف مفتاح ترجمة في `en` دون `ar` (والعكس) — يكسر الموقع عند التبديل.
- لا تغيّر `id` أي قسم ولا `id` أي مشروع — يكسر التنقّل وأوامر Aime القادمة من الخادم.
- لا تستورد `three` استيراداً ثابتاً في الأعلى — يقفز حجم الحزمة الرئيسية ~500KB.
- لا تحذف `history.scrollRestoration = 'manual'` من `main.jsx` — الشاشة الافتتاحية
  وتأثيرات الظهور تفترض أن الصفحة تبدأ من الأعلى.
- لا تحذف تعليق `eslint-disable-next-line react-refresh/only-export-components`
  في `LanguageContext.jsx` — الـ lint يفشل بدونه.
- لا تنقل منطق التمرير/الإضاءة خارج `AimeWidget` — الويدجت هو المتحكّم الوحيد
  بالصفحة، والمكوّنات الأخرى تعرض فقط.
- عنوان خادم Aime ثابت في `AimeWidget.jsx` ويشير لمشروع منفصل — تغييره يقطع
  الدردشة والصوت.

اقرأ PROGRESS.md لآخر حالة عمل.
