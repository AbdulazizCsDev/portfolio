import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    nav: {
      projects: 'Projects',
      now: 'Now Building',
      contact: 'Contact',
    },
    hero: {
      name: 'Abdulaziz Alhaidan',
      title: 'AI / Machine Learning Engineer',
      line: "I build LLM and computer-vision systems in Arabic and English. Most of the work goes into the part where they should refuse to answer.",
      cta1: 'Talk to Aime',
      cta2: 'View Projects',
      cta3: 'Download CV',
    },
    projects: {
      title: 'Projects',
      backToProjects: 'Projects',
      open: 'Open project',
      notFound: 'No such project.',
      // §7 — three projects, four elements each. Nothing else belongs on a card.
      // Fields marked TODO are §11 decisions: the owner writes them, not the build.
      items: [
        {
          id: 'board-room',
          name: 'AI Board Room',
          number: '7',
          numberNote: 'LLM calls behind a single question',
          summary:
            "Three advisors — finance, Saudi law, and market — read the documents you upload and deliberate over two rounds, each one building on what the others said. A chairman turns the disagreement into one verdict: proceed, proceed under conditions, or don't.",
          broke:
            "Streaming the debate over SSE worked locally and died in production: the host's proxy cut long-lived responses, so the browser reported 'couldn't reach API' against a 200. I replaced it with one plain JSON request and moved the pacing into the client. Streaming is a property of the whole path, not of your server.",
          detail: {
            sections: [
              {
                heading: 'Architecture',
                body: "Intake classifies the input first: a question is answered directly from your documents, a decision goes to the board, and only a genuinely vague one triggers clarifying questions. Then two rounds run — three advisors in parallel per round, the second round seeing the first — and a chairman synthesizes a verdict with confidence, conditions, conflicts, and next steps. Every advisor returns the same Pydantic contract (perspective, conditions, recommendations, reasoning, relevant, responds_to), so the board runs any number of advisors without knowing who they are. A FAISS retriever over uploaded PDFs feeds each advisor your actual figures. FastAPI serves both the API and the built React UI as one service.",
              },
              {
                heading: 'Decisions',
                body: "Advisors give a perspective with conditions, not a for-or-against vote: a missing license is something to satisfy, never a veto. An advisor asked about something outside its lens says so rather than manufacturing an opinion. Adding a fourth advisor is one import line — the registry auto-discovers it, and the schema, retrieval, and UI pick it up unchanged. The debate auto-plays at reading pace instead of making you click through it.",
              },
              {
                heading: 'Metrics',
                body: '7 LLM calls per question — intake, three advisors in round one, three in round two, and the chairman. Two deliberation rounds, three advisors, one verdict. Round latency is about five seconds on gpt-4o-mini; the cost of a full session is a fraction of a cent, which is the point of the model choice.',
              },
              {
                heading: 'Limits',
                body: 'Session state — company profile and the RAG index — lives in memory. It resets on restart and is shared across visitors, which is fine for a demo and wrong for more than one user; per-session storage is the missing piece. The advisors reason over what you upload, so the verdict is only as good as the documents. The legal lens is written for Saudi law and should not be read as anything else.',
              },
              {
                heading: 'Tried and failed',
                body: "SSE streaming per round: correct locally, unreliable behind a managed host's proxy — dropped for plain JSON. A fourth Customer advisor: added, then removed twice, because it restated the market advisor instead of adding a lens. Arabic structured output truncated mid-object until max_tokens was raised — Arabic costs more tokens per sentence than the English the default was sized for.",
              },
              {
                heading: 'Code',
                body: 'github.com/AbdulazizCsDev/ai-board-room — open, MIT.',
              },
            ],
          },
        },
        {
          id: 'aime',
          name: 'Aime Voice Assistant',
          number: '1.5',
          numberNote: 'seconds of silence that decide you stopped talking',
          summary:
            "The assistant on this site. You speak, it answers in Arabic or English, and it drives the page while it talks — scrolling to whatever it is describing and highlighting it, so it points at the screen instead of reading it out to you.",
          broke:
            "The cloned voice was deleted from the ElevenLabs account and the whole assistant went mute — a 404 on every reply, with no path back. Now a missing or dead voice falls back to a standard one, failed voice IDs are remembered per process, and a failing TTS degrades to visible text instead of silence. Anything you do not own can be removed without telling you.",
          detail: {
            sections: [
              {
                heading: 'Architecture',
                body: "Whisper transcribes, Claude answers, ElevenLabs speaks it back in a cloned voice, and every reply carries a trailing ACTION token that is parsed out before display. The token names a section or a project card, and the page scrolls there and highlights it. The knowledge base is one text file injected whole into the system prompt. FastAPI on Vercel serves it; the local build adds always-on capture with its own voice-activity detection.",
              },
              {
                heading: 'Decisions',
                body: "No embeddings and no vector store: the knowledge base is small enough to inject in full, so retrieval would add a failure mode and a similarity threshold to tune while removing information the model can already see. The system prompt forbids restating anything already on screen — the reply is a pointing sentence plus a follow-up question, because the page is the answer and the voice is the index. Voice activity detection is a hand-tuned RMS threshold rather than a wake word, so nothing has to be said to start.",
              },
              {
                heading: 'Metrics',
                body: '1.5 seconds of silence ends a turn; speech starts after 2 loud 100 ms chunks, with 5 chunks kept before that so the first syllable survives; recording is capped at 30 seconds. Audio is mono 16 kHz because Whisper prefers it. The API allows 20 requests per IP per 5 minutes, 8,000 characters per message, and 30 turns of history.',
              },
              {
                heading: 'Limits',
                body: 'The assistant is a separate service at a hardcoded address, and this site has no fallback if it is down — you get an apology in your own language and nothing else. Rate limiting is per serverless instance, so the real ceiling is higher than the configured one. The navigation vocabulary still lists sections this site no longer has, so a few commands resolve to nothing.',
              },
              {
                heading: 'Tried and failed',
                body: 'Railway as the host, migrated to Vercel. A loud TTS failure that took the chat down with it, replaced by silent degradation to text. An earlier persona that answered by reading the page contents aloud — technically correct, unbearable to listen to, and fixed in the prompt rather than the code.',
              },
              {
                heading: 'Code',
                body: 'github.com/AbdulazizCsDev/aime-voice-assistant — open.',
              },
            ],
          },
        },
        {
          id: 'agrocure',
          name: 'AgroCure',
          number: '0.015',
          numberNote: 'calibration error after temperature scaling, down from 0.029',
          summary:
            "Photograph a leaf and it names the plant, then the disease. What it is actually built around is the refusal: below its confidence floor it abstains and hands the scan to a human reviewer instead of returning a confident wrong answer.",
          broke:
            "Every seeded image was embedded twice, by CLIP and by ResNet, and both vectors were written to the database. Months later the ResNet column had never been read once — the similarity query was CLIP-only from the first day. Storage and compute spent on a number nothing asked for. Now one embedding path is shared by seeding and inference, so the library and the query cannot drift apart.",
          detail: {
            sections: [
              {
                heading: 'Architecture',
                body: 'A CLIP zero-shot gate runs first and scores the image against leaf prompts versus animal, hand, car, and screenshot prompts, so a cat is rejected as not-a-leaf rather than diagnosed as one. Past the gate, Stage 1 is a ResNet50 over 16 plants; Stage 2 is a plant-specific disease classifier — 6 of them, for the 6 plants that have more than one disease. Low confidence, a thin top-1/top-2 margin, or a pgvector similarity match that disagrees with the CNN all route the scan to a reviewer dashboard. Expert labels feed back into the verified-image library. Each diagnosis gets LLM care advice, cached in Supabase.',
              },
              {
                heading: 'Decisions',
                body: 'Two stages instead of one flat classifier over every plant-disease pair: specialized heads only have to separate diseases within a plant they already know, and 10 of the 16 plants have a single disease and need no second model at all. Temperature scaling on top, because an uncalibrated confidence score cannot carry an abstention threshold — the number has to mean what it says before you can build a decision on it. The health check is deliberately biased: a sick leaf is rarely called healthy, at the cost of sometimes calling a healthy leaf sick. Every integration degrades to a no-op if its key is absent, so the API runs without Supabase or an LLM key.',
              },
              {
                heading: 'Metrics',
                body: '96.7% validation accuracy on Stage 1 across 16 plants. Temperature scaling cut expected calibration error from 0.029 to 0.015 on Stage 1, and from 0.092 to 0.059 on the tomato classifier — the tomato head was the badly overconfident one. 30 diseases across 16 plants, 6 Stage-2 models, 7 models and roughly 630 MB loaded at startup, trained on 7,057 images augmented to 200 per class. Around 41 ms per prediction.',
              },
              {
                heading: 'Limits',
                body: 'CLIP is weak at healthy versus diseased — a fine, spot-level distinction it was never trained for — so the health check is a bias, not a classifier, and a dedicated healthy/diseased model is the honest fix. It expects a close-up of a single leaf, which is what it was trained on; a whole-plant shot gets a framing tip rather than a refusal. 16 species, and anything outside them is returned as a best guess and queued for review, never as an answer.',
              },
              {
                heading: 'Tried and failed',
                body: 'A dual retrieval space, CLIP and ResNet embeddings side by side, on the assumption that two views would re-rank better than one. The ResNet half was never queried and was dropped; the column stays nullable in case a re-rank is ever wired up. Two separate seeding scripts with hardcoded dataset paths, folded into one idempotent script that takes the path as an argument — the duplication was quietly producing library embeddings from a different code path than inference used.',
              },
              {
                heading: 'Code',
                body: 'github.com/AbdulazizCsDev/AgriCure-App — open, MIT.',
              },
            ],
          },
        },
      ],
    },
    now: {
      title: 'Now Building',
      subtitle: "What I'm actively working on right now — built in public, updated as it happens.",
      startedLabel: 'Started',
      items: [
        {
          id: 'board-room',
          name: 'AI Board Room — Trustworthy Edition',
          status: 'In Progress',
          started: '2026',
          desc: 'Upgrading the hackathon-winning system for trustworthy, enterprise-grade use in the Saudi market: Arabic-first agents, grounded citations behind every recommendation, and safety & reliability evaluation.',
          focus: ['Arabic-first agents', 'Grounded citations', 'Evaluation & guardrails'],
        },
        {
          id: 'agrocure',
          name: 'AgroCure — Saudi Agriculture',
          status: 'In Progress',
          started: '2026',
          desc: 'Adapting the plant-disease system to Saudi crops and growing conditions, with Arabic advisory output and trustworthy-AI hardening: confidence thresholds, failure-case analysis, and human-review flows.',
          focus: ['Saudi crops', 'Arabic advisory', 'Confidence & review flows'],
        },
        {
          id: 'bootcamp',
          name: 'AI / ML Engineering Bootcamp',
          status: 'Ongoing',
          started: '2026',
          desc: 'Deepening production ML week by week — currently: transformer fine-tuning, DSPy/GEPA structured extraction, and MLOps workflows with MLflow and ONNX.',
          focus: ['Fine-tuning', 'DSPy / GEPA', 'MLOps'],
        },
      ],
    },
    contact: {
      title: "Let's Connect",
      subtitle: "I'm always open to new opportunities, collaborations, and interesting conversations.",
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      emailVal: 'abdulaziz.alhaidan.cs@gmail.com',
      linkedinVal: 'www.linkedin.com/in/abdulaziz-alhaidan-a902b4232/',
      githubVal: 'github.com/AbdulazizCsDev',
    },
    aime: {
      placeholder: 'Ask Aime anything...',
      hold: 'Hold to speak',
      greeting: "Hi! I'm Aime, Abdulaziz's AI assistant. I can tell you about his work and his projects — or run a job-fit check if you're hiring. How can I help you today?",
      bubbleGreet: "Hi there! Need help? I can tell you about Abdulaziz's work!",
      release: 'Release to send...',
      online: 'Online',
      listening: 'Listening...',
      thinking: 'Thinking...',
      speaking: 'Speaking...',
      noBackend: "Sorry, I couldn't connect to the backend right now.",
      noTranscribe: "Couldn't transcribe the audio. Please try again.",
      mute: 'Mute',
      unmute: 'Unmute',
      suggestions: [
        { label: 'Quick tour', tour: true },
        {
          label: 'Projects',
          query: 'What are his projects?',
          canned: 'These are his projects — any specific one you want to dig into?',
          action: 'projects',
        },
        { label: 'Hackathon Win', query: 'Tell me about the AI Board Room hackathon win' },
        { label: 'Job Fit Check', query: "I'm a recruiter. I'll paste a job description, and I want you to analyze how well Abdulaziz fits it — matched skills, which of his projects prove each requirement, and honest gaps. Ready?" },
        {
          label: 'Contact',
          query: 'How can I contact him?',
          canned: "Here's how to reach him — email or LinkedIn work best. Anything else you'd like to know first?",
          action: 'contact',
        },
      ],
      tour: [
        { text: 'His projects. Start with AI Board Room — a multi-agent advisory board that took 1st place at the Himmah Digital Camps hackathon.', action: 'projects.board-room' },
        { text: 'AgroCure — plant-disease detection running at 73 ms on a Raspberry Pi. He led the four-person team behind it.', action: 'projects.agrocure' },
        { text: "And Aime — that's me: Whisper, Claude, and ElevenLabs, deployed and talking to you right now.", action: 'projects.aime' },
        { text: "What he's building now: hardening Board Room and AgroCure into trustworthy, Arabic-first systems for the Saudi market.", action: 'now' },
        { text: "And this is where to reach him. Ask me anything else — I'm here.", action: 'contact' },
      ],
    },
  },
  ar: {
    nav: {
      projects: 'المشاريع',
      now: 'قيد البناء',
      contact: 'تواصل',
    },
    hero: {
      name: 'عبدالعزيز الحيدان',
      title: 'مهندس ذكاء اصطناعي وتعلّم آلة',
      line: 'أبني أنظمة نماذج لغوية ورؤية حاسوبية بالعربية والإنجليزية. وأكثر العمل يذهب إلى الجزء الذي يجب أن ترفض فيه الإجابة.',
      cta1: 'تحدث مع آيم',
      cta2: 'عرض المشاريع',
      cta3: 'تحميل السيرة الذاتية',
    },
    projects: {
      title: 'المشاريع',
      backToProjects: 'المشاريع',
      open: 'افتح المشروع',
      notFound: 'لا يوجد مشروع بهذا الاسم.',
      // §7 — ثلاثة مشاريع، أربعة عناصر لكل بطاقة. لا شيء غيرها.
      // الحقول المعلَّمة TODO قرارات §11: يكتبها المالك، لا البناء.
      items: [
        {
          id: 'board-room',
          name: 'مجلس الإدارة الذكي',
          number: '7',
          numberNote: 'نداءات نموذج خلف السؤال الواحد',
          summary:
            'ثلاثة مستشارين — مالي وقانوني سعودي وخبير سوق — يقرؤون المستندات التي ترفعها ويتداولون على جولتين، كل واحد يبني على ما قاله الآخرون. ثم يحوّل رئيس المجلس الخلاف إلى قرار واحد: نفّذ، أو نفّذ بشروط، أو لا تنفّذ.',
          broke:
            'بثّ النقاش عبر SSE اشتغل محلياً ومات على الاستضافة: بروكسي المضيف يقطع الاستجابات الطويلة، فيقول المتصفح «تعذّر الوصول» أمام استجابة ناجحة. استبدلته بطلب JSON واحد ونقلت إيقاع العرض إلى العميل. البثّ خاصية المسار كله لا خاصية خادمك.',
          detail: {
            sections: [
              {
                heading: 'المعمارية',
                body: 'تصنيف المدخل أولاً: السؤال يُجاب من مستنداتك مباشرة، والقرار يذهب إلى المجلس، والغامض وحده يستدعي أسئلة توضيحية. ثم تعمل جولتان — ثلاثة مستشارين بالتوازي في كل جولة، والثانية ترى الأولى — ويجمع رئيس المجلس النتيجة في قرار بدرجة ثقة وشروط ونقاط تعارض وخطوات تالية. كل مستشار يرجّع العقد نفسه بـPydantic (منظور، شروط، توصيات، تعليل، الصلة، ردّاً على من)، فالمجلس يشغّل أي عدد من المستشارين دون أن يعرف من هم. وطبقة استرجاع بـFAISS فوق ملفات PDF المرفوعة تغذّي كل مستشار بأرقامك أنت. وFastAPI يقدّم الواجهة البرمجية وواجهة React المبنية كخدمة واحدة.',
              },
              {
                heading: 'القرارات',
                body: 'المستشار يعطي منظوراً بشروط لا تصويتاً مع أو ضد: الترخيص الناقص شرط يُستوفى لا حقّ نقض. وإذا سُئل عن شيء خارج زاويته قال ذلك بدل أن يصطنع رأياً. إضافة مستشار رابع سطر استيراد واحد — السجلّ يكتشفه تلقائياً، والعقد والاسترجاع والواجهة تلتقطه بلا تعديل. والنقاش يُعرض تلقائياً بإيقاع القراءة بدل أن تضغط زراً بعد كل رد.',
              },
              {
                heading: 'المقاييس',
                body: 'سبعة نداءات نموذج للسؤال الواحد — تصنيف المدخل، وثلاثة مستشارين في الجولة الأولى، وثلاثة في الثانية، ورئيس المجلس. جولتا تداول، وثلاثة مستشارين، وقرار واحد. زمن الجولة نحو خمس ثوانٍ على gpt-4o-mini، وكلفة الجلسة الكاملة كسر من السنت — وهذا سبب اختيار النموذج.',
              },
              {
                heading: 'الحدود',
                body: 'حالة الجلسة — ملف الشركة وفهرس الاسترجاع — تسكن في الذاكرة. تُصفَّر عند إعادة التشغيل وتُشارَك بين الزوّار، وهذا مقبول للعرض وخطأ لأكثر من مستخدم؛ التخزين لكل جلسة هو القطعة الناقصة. والمستشارون يستدلّون مما ترفعه، فالقرار بجودة المستندات لا أكثر. والزاوية القانونية مكتوبة للنظام السعودي ولا تصلح لغيره.',
              },
              {
                heading: 'ما جُرّب وفشل',
                body: 'بثّ SSE لكل جولة: صحيح محلياً وغير موثوق خلف بروكسي استضافة مُدارة — أُسقط لصالح JSON عادي. ومستشار رابع للعميل: أُضيف ثم حُذف مرتين، لأنه كان يعيد كلام مستشار السوق بدل أن يضيف زاوية. والمخرج المهيكل بالعربية كان يُبتر في منتصف الكائن حتى رُفع سقف الرموز — العربية تكلّف رموزاً أكثر للجملة الواحدة من الإنجليزية التي قيس عليها الافتراضي.',
              },
              {
                heading: 'الكود',
                body: 'github.com/AbdulazizCsDev/ai-board-room — مفتوح، رخصة MIT.',
              },
            ],
          },
        },
        {
          id: 'aime',
          name: 'آيم — المساعد الصوتي',
          number: '1.5',
          numberNote: 'ثانية ونصف من الصمت تقرّر أنك سكتّ',
          summary:
            'المساعد الموجود في هذا الموقع. تتكلم فيجيبك بالعربية أو الإنجليزية، ويقود الصفحة وهو يتكلم — ينتقل إلى ما يصفه ويُبرزه، فيشير إلى الشاشة بدل أن يقرأها عليك.',
          broke:
            'الصوت المستنسخ حُذف من حساب ElevenLabs فصمت المساعد بالكامل — خطأ 404 على كل رد، بلا طريق رجوع. الآن الصوت المفقود يسقط إلى صوت قياسي، والمعرّفات الميتة تُحفظ فلا يُعاد سؤالها، وفشل النطق ينزل إلى نص مرئي لا إلى صمت. ما لا تملكه يمكن أن يُسحب منك بلا إشعار.',
          detail: {
            sections: [
              {
                heading: 'المعمارية',
                body: 'ويسبر يفرّغ الصوت نصاً، وكلود يجيب، وElevenLabs ينطق الرد بصوت مستنسخ، وكل رد يحمل في آخره رمز ACTION يُنتزع قبل العرض. الرمز يسمّي قسماً أو بطاقة مشروع، فتنتقل الصفحة إليه وتُبرزه. وقاعدة المعرفة ملف نصي واحد يُحقن كاملاً في تعليمات النظام. وFastAPI على Vercel يقدّمه، والنسخة المحلية تضيف التقاطاً دائماً بكشف نشاط صوتي خاص بها.',
              },
              {
                heading: 'القرارات',
                body: 'لا تضمينات ولا قاعدة متجهات: قاعدة المعرفة صغيرة بما يكفي لحقنها كاملة، فالاسترجاع كان سيضيف نقطة فشل وعتبة تشابه تُضبط، ويحجب عن النموذج معلومات يراها أصلاً. وتعليمات النظام تمنع منعاً باتاً إعادة ذكر أي شيء معروض على الشاشة — الرد جملة إشارة وسؤال متابعة، لأن الصفحة هي الجواب والصوت فهرسها. وكشف نشاط الصوت عتبة RMS مضبوطة يدوياً لا كلمة إيقاظ، فلا يلزم قول شيء للبدء.',
              },
              {
                heading: 'المقاييس',
                body: 'ثانية ونصف من الصمت تنهي الدور؛ والكلام يبدأ بعد مقطعين عاليين من مئة مللي ثانية، مع الاحتفاظ بخمسة مقاطع قبلهما حتى ينجو المقطع الأول من الكلمة؛ والتسجيل محدود بثلاثين ثانية. والصوت أحادي بستة عشر كيلوهرتز لأن ويسبر يفضّلها. والواجهة البرمجية تسمح بعشرين طلباً لكل عنوان في خمس دقائق، وثمانية آلاف حرف للرسالة، وثلاثين دوراً من السياق.',
              },
              {
                heading: 'الحدود',
                body: 'المساعد خدمة منفصلة على عنوان ثابت في الكود، ولا يملك هذا الموقع بديلاً إن سقطت — تصلك رسالة اعتذار بلغتك ولا شيء غيرها. وتحديد المعدّل لكل نسخة خادم، فالسقف الحقيقي أعلى من المكتوب. ومفردات التنقّل ما زالت تعدّد أقساماً لم تعد في هذا الموقع، فبعض الأوامر تُفضي إلى لا شيء.',
              },
              {
                heading: 'ما جُرّب وفشل',
                body: 'Railway كمستضيف، ثم الانتقال إلى Vercel. وفشل نطق صاخب كان يُسقط المحادثة معه، استُبدل بهبوط صامت إلى النص. وشخصية أقدم كانت تجيب بقراءة محتوى الصفحة بصوت عالٍ — صحيحة تقنياً ولا تُحتمل سماعاً، وعولجت في التعليمات لا في الكود.',
              },
              {
                heading: 'الكود',
                body: 'github.com/AbdulazizCsDev/aime-voice-assistant — مفتوح.',
              },
            ],
          },
        },
        {
          id: 'agrocure',
          name: 'أجروكيور',
          number: '0.015',
          numberNote: 'خطأ المعايرة بعد ضبط الحرارة، نازلاً من 0.029',
          summary:
            'تصوّر ورقة نبات فيسمّي النبتة ثم المرض. والذي بُني حوله فعلاً هو الامتناع: تحت عتبة الثقة يمتنع ويحوّل الصورة إلى مراجع بشري بدل أن يرجّع جواباً واثقاً خاطئاً.',
          broke:
            'كل صورة تُزرع في المكتبة كانت تُضمَّن مرتين، بـCLIP وبـResNet، ويُكتب المتجهان في قاعدة البيانات. وبعد شهور تبيّن أن عمود ResNet لم يُقرأ ولا مرة — استعلام التشابه كان بـCLIP وحده من أول يوم. تخزين وحوسبة أُنفقا على رقم لم يسأل عنه أحد. الآن مسار تضمين واحد تتشاركه الزراعة والاستدلال، فلا تنحرف المكتبة عن الاستعلام.',
          detail: {
            sections: [
              {
                heading: 'المعمارية',
                body: 'بوابة CLIP صفرية التدريب تعمل أولاً وتقارن الصورة بأوصاف ورقة النبات مقابل أوصاف حيوان ويد وسيارة ولقطة شاشة، فتُرفض صورة القطة كـ«ليست ورقة» بدل أن تُشخَّص كورقة. وبعد البوابة، المرحلة الأولى ResNet50 على ست عشرة نبتة؛ والمرحلة الثانية مصنّف أمراض خاص بالنبتة — ستة مصنّفات، للنباتات الستة التي لها أكثر من مرض واحد. والثقة المنخفضة، أو ضيق الفارق بين الاحتمالين الأولين، أو تطابق تشابه بـpgvector يخالف الشبكة، كلها تحوّل الصورة إلى لوحة المراجعة. وتصنيفات الخبراء ترجع لتغذية مكتبة الصور الموثّقة. ولكل تشخيص إرشاد عناية يولّده نموذج لغوي ويُخزَّن في Supabase.',
              },
              {
                heading: 'القرارات',
                body: 'مرحلتان بدل مصنّف مسطّح واحد على كل أزواج النبتة والمرض: الرؤوس المتخصّصة لا تفصل إلا بين أمراض نبتة تعرفها أصلاً، وعشر من الست عشرة نبتة لها مرض واحد فلا تحتاج نموذجاً ثانياً إطلاقاً. وفوقها ضبط الحرارة، لأن درجة ثقة غير معايَرة لا تحمل عتبة امتناع — الرقم يجب أن يعني ما يقوله قبل أن تُبنى عليه قرارات. وفحص السلامة منحاز عمداً: نادراً ما تُوصف ورقة مريضة بأنها سليمة، والثمن أن تُوصف ورقة سليمة أحياناً بأنها مريضة. وكل تكامل يهبط إلى لا-عملية إن غاب مفتاحه، فتعمل الواجهة البرمجية بلا Supabase وبلا مفتاح نموذج لغوي.',
              },
              {
                heading: 'المقاييس',
                body: 'دقة تحقّق 96.7% في المرحلة الأولى على ست عشرة نبتة. وضبط الحرارة خفّض خطأ المعايرة المتوقّع من 0.029 إلى 0.015 في المرحلة الأولى، ومن 0.092 إلى 0.059 في مصنّف الطماطم — ورأس الطماطم كان المفرط في الثقة. ثلاثون مرضاً على ست عشرة نبتة، وستة نماذج للمرحلة الثانية، وسبعة نماذج بنحو 630 ميجابايت تُحمَّل عند الإقلاع، مدرَّبة على 7,057 صورة موسَّعة إلى مئتين لكل صنف. ونحو 41 مللي ثانية للتنبؤ الواحد.',
              },
              {
                heading: 'الحدود',
                body: 'CLIP ضعيف في التمييز بين السليم والمريض — فرق دقيق على مستوى البقعة لم يُدرَّب عليه — فالفحص انحياز لا مصنّف، والحل الصادق نموذج مخصّص للسليم والمريض. ويتوقّع لقطة قريبة لورقة واحدة، وهو ما دُرِّب عليه؛ ولقطة النبتة كاملة تُقابَل بنصيحة تأطير لا برفض. وست عشرة نبتة، وما خرج عنها يُرجَّع كأفضل تخمين ويُحوَّل للمراجعة، لا كجواب.',
              },
              {
                heading: 'ما جُرّب وفشل',
                body: 'فضاء استرجاع مزدوج، تضمينات CLIP وResNet جنباً إلى جنب، على افتراض أن رؤيتين تعيدان الترتيب أفضل من واحدة. نصف ResNet لم يُستعلم قط فأُسقط؛ والعمود باقٍ قابلاً للفراغ تحسّباً لإعادة ترتيب تُوصَل لاحقاً. وسكربتا زراعة منفصلان بمسارات بيانات مثبّتة في الكود، طُويا في سكربت واحد عديم الأثر الجانبي يأخذ المسار وسيطاً — فالتكرار كان ينتج تضمينات المكتبة من مسار كود غير الذي يستعمله الاستدلال.',
              },
              {
                heading: 'الكود',
                body: 'github.com/AbdulazizCsDev/AgriCure-App — مفتوح، رخصة MIT.',
              },
            ],
          },
        },
      ],
    },
    now: {
      title: 'قيد البناء الآن',
      subtitle: 'ما أعمل عليه فعلياً في هذه اللحظة — يُبنى علناً ويُحدَّث أولاً بأول.',
      startedLabel: 'البداية',
      items: [
        {
          id: 'board-room',
          name: 'مجلس الإدارة الذكي — نسخة موثوقة',
          status: 'قيد التطوير',
          started: '2026',
          desc: 'تطوير النظام الفائز بالهاكاثون ليصبح جاهزاً للاستخدام المؤسسي الموثوق في السوق السعودي: وكلاء يعملون بالعربية أولاً، واستشهادات مؤصّلة خلف كل توصية، وتقييم للسلامة والموثوقية.',
          focus: ['وكلاء بالعربية أولاً', 'استشهادات مؤصّلة', 'تقييم وضوابط أمان'],
        },
        {
          id: 'agrocure',
          name: 'أجروكيور — للزراعة السعودية',
          status: 'قيد التطوير',
          started: '2026',
          desc: 'تكييف نظام كشف أمراض النباتات مع المحاصيل والظروف الزراعية السعودية، مع إرشاد زراعي بالعربية وتعزيز الموثوقية: عتبات ثقة، وتحليل حالات الفشل، ومسارات مراجعة بشرية.',
          focus: ['محاصيل سعودية', 'إرشاد بالعربية', 'عتبات ثقة ومراجعة'],
        },
        {
          id: 'bootcamp',
          name: 'معسكر هندسة الذكاء الاصطناعي',
          status: 'مستمر',
          started: '2026',
          desc: 'تعميق مهارات تعلّم الآلة الإنتاجي أسبوعاً بعد أسبوع — حالياً: الضبط الدقيق للمحوّلات، والاستخلاص المهيكل بـ DSPy/GEPA، وممارسات MLOps مع MLflow وONNX.',
          focus: ['ضبط دقيق', 'DSPy / GEPA', 'MLOps'],
        },
      ],
    },
    contact: {
      title: 'لنتواصل',
      subtitle: 'أنا دائماً منفتح على الفرص الجديدة والتعاون والمحادثات المثيرة للاهتمام.',
      email: 'البريد الإلكتروني',
      linkedin: 'لينكدإن',
      github: 'جيت هاب',
      emailVal: 'abdulaziz.alhaidan.cs@gmail.com',
      linkedinVal: 'www.linkedin.com/in/abdulaziz-alhaidan-a902b4232/',
      githubVal: 'github.com/AbdulazizCsDev',
    },
    aime: {
      placeholder: 'اسأل آيم أي شيء...',
      hold: 'اضغط مطولاً للتحدث',
      greeting: 'مرحباً! أنا آيم، مساعد الذكاء الاصطناعي لعبدالعزيز. يمكنني إخبارك عن أعماله ومشاريعه — أو تحليل مدى ملاءمته لوظيفة إن كنت توظّف. كيف أساعدك اليوم؟',
      bubbleGreet: 'أهلاً! هل تحتاج مساعدة؟ يمكنني إخبارك عن أعمال عبدالعزيز!',
      release: 'أرسل بالإفلات...',
      online: 'متصل',
      listening: 'يستمع...',
      thinking: 'يفكر...',
      speaking: 'يتحدث...',
      noBackend: 'عذراً، لم أتمكن من الاتصال بالخادم الآن.',
      noTranscribe: 'تعذّر تحويل الصوت. حاول مرة أخرى.',
      mute: 'كتم الصوت',
      unmute: 'تشغيل الصوت',
      suggestions: [
        { label: 'جولة سريعة', tour: true },
        {
          label: 'المشاريع',
          query: 'ما هي مشاريعه؟',
          canned: 'هذه مشاريعه — هل يهمّك مشروع محدد؟',
          action: 'projects',
        },
        { label: 'الفوز بالهاكاثون', query: 'أخبرني عن فوز مشروع مجلس الإدارة الذكي بالهاكاثون' },
        { label: 'ملاءمة وظيفية', query: 'أنا مسؤول توظيف. سألصق وصفاً وظيفياً وأريدك أن تحلل مدى ملاءمة عبدالعزيز له — المهارات المطابقة، والمشاريع التي تثبت كل متطلب، والفجوات بصراحة. جاهز؟' },
        {
          label: 'تواصل',
          query: 'كيف أتواصل مع عبدالعزيز؟',
          canned: 'هكذا تصل إليه — البريد أو لينكدإن الأفضل. هل تريد معرفة شيء آخر أولاً؟',
          action: 'contact',
        },
      ],
      tour: [
        { text: 'مشاريعه. لنبدأ بمجلس الإدارة الذكي — نظام استشاري متعدد الوكلاء حصد المركز الأول في هاكاثون معسكرات همّة الرقمية.', action: 'projects.board-room' },
        { text: 'أجروكيور — كشف أمراض النباتات بزمن 73 مللي ثانية على Raspberry Pi، وقد قاد فريقه المكوّن من أربعة مهندسين.', action: 'projects.agrocure' },
        { text: 'وآيم — هذا أنا: Whisper وClaude وElevenLabs، منشور ويتحدث معك الآن.', action: 'projects.aime' },
        { text: 'ما يبنيه الآن: تطوير مجلس الإدارة وأجروكيور إلى أنظمة موثوقة تتحدث العربية أولاً للسوق السعودي.', action: 'now' },
        { text: 'وهنا تصل إليه. اسألني ما تشاء — أنا هنا.', action: 'contact' },
      ],
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ar');
  const toggle = () => setLang((l) => (l === 'en' ? 'ar' : 'en'));
  return (
    <LanguageContext.Provider value={{ lang, toggle, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
