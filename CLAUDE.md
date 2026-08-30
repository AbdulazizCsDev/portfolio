# CLAUDE.md

موقع شخصي (Portfolio) لعبدالعزيز الحيدان — مهندس ذكاء اصطناعي وتعلّم آلة.
تطبيق React صفحة واحدة، ثنائي اللغة (عربي/إنجليزي)، فيه مساعد ذكي مدمج (Aime) يتنقّل بالصفحة مع الزائر ويُبرز البطاقة التي يسأل عنها.

## الـ Stack
- React 19.2 + Vite 8 — JavaScript صِرف، **لا TypeScript**
- Three.js 0.184 — يُستورد ديناميكياً `import('three')` ليخرج من الحزمة الرئيسية
- ESLint 9 (flat config) — `eslint.config.js`
- النشر: Vercel (`portfolio-olive-pi-74.vercel.app`)

## الأوامر
```
npm run dev       # خادم التطوير
npm run build     # بناء الإنتاج → dist/
npm run lint      # ESLint (يجب أن يمر قبل أي commit)
npm run preview   # معاينة نتيجة البناء
```
**لا يوجد إطار اختبارات ولا أمر test.** التحقق يتم بالبناء + الـ lint + فحص بصري في المتصفح.

## المجلدات
| المسار | المسؤولية |
|---|---|
| `src/context/LanguageContext.jsx` | **مصدر المحتوى الوحيد** — كل النصوص والمشاريع والمهارات بالعربي والإنجليزي |
| `src/components/` | أقسام الصفحة، كل مكوّن ومعه ملف `.css` مجاور |
| `src/App.jsx` | ترتيب الأقسام + مراقب `IntersectionObserver` لأنيميشن الظهور + ضبط اتجاه الصفحة |
| `src/index.css` | متغيّرات التصميم (`:root`) والأنماط المشتركة (`.card-glass`, `.tag`, `.btn`) |
| `public/` | ملف السيرة الذاتية PDF والأيقونات |

## الـ Conventions (مستنتجة من الكود)
- **لا نص مكتوب داخل أي مكوّن.** كل نص يُقرأ من `t` عبر `useLanguage()`. أي نص مباشر يكسر الترجمة ويظهر بالإنجليزي في الوضع العربي.
- كل مكوّن: `export default function` + استيراد ملف الـ CSS المجاور في أول سطرين.
- الألوان والمسافات من متغيّرات `index.css` فقط — لا قيم لونية مكتوبة يدوياً داخل ملفات المكوّنات.
- الأنيميشن: أضف `data-reveal` و `data-reveal-delay="1..5"` على العنصر؛ المراقب في `App.jsx` يتكفّل بالباقي (يُعاد تشغيله عند تغيير اللغة).
- الاتجاه (RTL): يُدار عبر `body.rtl` و `.rtl` و `[dir='rtl']` في الـ CSS. استخدم خصائص منطقية (`padding-inline-end`, `inset-inline-start`) بدل `left/right` في أي نمط جديد.
- المنطق داخل المكوّن نفسه؛ لا طبقة خدمات. الاستثناء الوحيد `AimeWidget.jsx` — يحتوي كل منطق الصوت والمحادثة والتنقّل.
- عنوان الـ backend ثابت في أعلى `AimeWidget.jsx` (`const API`).

## الربط مع الـ Backend
مستودع منفصل: `AbdulazizCsDev/aime-voice-assistant` (FastAPI على Vercel).
- `POST /chat` → `{ reply, action }` — الـ `action` رمز تنقّل مثل `projects.board-room`
- `POST /transcribe` (Whisper) و `POST /speak` (ElevenLabs، مع صوت احتياطي إذا فشل الصوت المستنسخ)
- الواجهة تقرأ `data.action` وتُطبّقه عبر `applyAction()`؛ إذا غاب تسقط تلقائياً على `detectIntent()` المحلي، فلا شيء ينكسر لو تأخر نشر الـ backend.

## لا تفعل
- **لا تغيّر `data-target-id` على البطاقات** دون تحديث `VALID_ACTIONS` في `llm.py` بالمستودع الآخر — لو اختلفا، ينتقل Aime إلى لا شيء بصمت.
- **لا تحذف حقل `id`** من عناصر `projects.items` / `now.items` في `LanguageContext.jsx` — هو مصدر `data-target-id`.
- **لا تُعرِّف `useRef` بعد أي hook يعدّله** — قاعدة `react-hooks/immutability` تُفشل الـ lint. عرّف كل الـ refs في أعلى المكوّن.
- **لا ترفع `z-index` للـ `.neural-logo-fixed` فوق 0** — يغطّي بطاقات المشاريع.
- لا تعِد تسمية `public/Abdulaziz-Alhaidan-CV.pdf` — الاسم مكتوب في `Hero.jsx`.
- لا تحذف `// eslint-disable-next-line react-refresh/only-export-components` فوق `useLanguage` — بدونها يفشل الـ lint.
- عند إضافة أي محتوى: أضِفه في **الكتلتين `en` و `ar`** معاً، وإلا انهار القسم في إحدى اللغتين.

اقرأ PROGRESS.md لآخر حالة عمل
