import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      now: 'Now Building',
      skills: 'Skills',
      contact: 'Contact',
    },
    hero: {
      greeting: "Hello, I'm",
      name: 'Abdulaziz Alhaidan',
      title: 'AI / Machine Learning Engineer',
      titles: ['AI / ML Engineer', 'LLM & Multi-Agent Systems', 'RAG & GenAI Engineer', 'Backend Engineer'],
      bio: "AI / Machine Learning Engineer who designs, builds, and ships production-grade LLM and ML systems end-to-end — from data and training to RAG pipelines, multi-agent orchestration, and deployment. Currently building trustworthy, Arabic-first AI for the Saudi market.",
      cta1: 'Talk to Aime',
      cta2: 'View Projects',
      cta3: 'Download CV',
      available: 'Available for opportunities',
    },
    about: {
      title: 'About Me',
      p1: "AI / Machine Learning Engineer with a B.Sc. in Computer Science who builds and ships production-grade LLM and ML systems end-to-end. I won 1st place at the Himmah Digital Camps hackathon for AI Board Room — a multi-agent executive-advisory system — and deployed an edge-optimized computer-vision model running at 73 ms inference latency on a Raspberry Pi.",
      p2: "My edge is Arabic-first, production-ready AI: LLM integration (OpenAI, Anthropic Claude), multi-agent orchestration, RAG pipelines built from scratch, embeddings, and vector databases — served through reliable FastAPI backends and deployed to the cloud. I've led a four-person engineering team across data, training, and deployment, and I build with responsible-AI practices from day one.",
      education: 'Education',
      university: 'Majmaah University — College of Sciences, Zulfi',
      degree: 'Bachelor of Computer Science',
      gpa: 'GPA: 4.01 / 5 — Very Good',
      period: '2020 – 2025',
      certifications: 'Certifications',
      certs: [
        { name: 'IBM Data Science Professional Certificate', issuer: 'IBM / Coursera', year: '2024' },
        { name: 'TensorFlow Developer Specialization', issuer: 'DeepLearning.AI', year: '2024' },
        { name: 'AWS Cloud Practitioner Essentials', issuer: 'Amazon Web Services', year: '2023' },
      ],
    },
    experience: {
      title: 'Experience',
      current: 'Current',
      items: [
        {
          role: 'AI / Machine Learning Engineering — Intensive Bootcamp',
          org: 'Projects & Coursework',
          period: '2026 – Present',
          current: true,
          points: [
            'End-to-end ML pipelines: EDA, feature engineering, hyperparameter tuning, and rigorous error analysis.',
            'CNNs, RNN/LSTM, Seq2Seq, and time-series models; fine-tuned BERT with Hugging Face.',
            'Built a complete RAG system from scratch (embeddings + FAISS); advanced prompt engineering with DSPy/GEPA.',
            'Production packaging: ONNX export, serialization, and MLflow experiment tracking.',
          ],
        },
        {
          role: 'Quality Assurance Specialist',
          org: 'T2 — Riyadh, Saudi Arabia',
          period: 'Feb 2025 – May 2025',
          current: false,
          points: [
            'Executed functional and regression testing across releases.',
            'Reported and tracked defects, and validated fixes to ensure product quality.',
          ],
        },
      ],
    },
    projects: {
      title: 'Projects',
      // §7 — three projects, four elements each. Nothing else belongs on a card.
      // Fields marked TODO are §11 decisions: the owner writes them, not the build.
      items: [
        {
          id: 'board-room',
          name: 'AI Board Room',
          number: '[[ ?? ]]',
          numberNote: '[[ TODO — what the number counts ]]',
          summary:
            '[[ TODO — one or two sentences: what this actually does, not what it is built with. Plain enough for a non-technical reader, precise enough to respect a technical one. ]]',
          broke: '[[ TODO — what did not work, and what it taught you ]]',
        },
        {
          id: 'aime',
          name: 'Aime Voice Assistant',
          number: '[[ ?? ]]',
          numberNote: '[[ TODO — what the number counts ]]',
          summary: '[[ TODO — one or two sentences, same rules ]]',
          broke: '[[ TODO — what broke, and what it taught you ]]',
        },
        {
          id: 'agrocure',
          name: 'AgroCure',
          number: '[[ ?? ]]',
          numberNote: '[[ TODO — what the number counts ]]',
          summary: '[[ TODO — one or two sentences, same rules ]]',
          broke: '[[ TODO — what broke, and what it taught you ]]',
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
    skills: {
      title: 'Skills',
      categories: [
        {
          name: 'GenAI & LLMs',
          icon: '🤖',
          skills: ['LLM Integration (OpenAI, Claude)', 'Multi-Agent Orchestration', 'RAG (built from scratch)', 'LangChain', 'FAISS', 'ChromaDB', 'Embeddings', 'Prompt Engineering (DSPy/GEPA)', 'Fine-tuning', 'Hugging Face', 'BERT'],
        },
        {
          name: 'ML & Deep Learning',
          icon: '🧠',
          skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'CNNs / Transfer Learning', 'RNN / LSTM / Seq2Seq', 'Time-Series Forecasting', 'Evaluation & Diagnostics'],
        },
        {
          name: 'MLOps & Deployment',
          icon: '🚀',
          skills: ['MLflow', 'ONNX', 'FastAPI Model Serving', 'Edge Deployment (Raspberry Pi)', 'Docker', 'CI/CD', 'AWS (IAM, EC2, S3)'],
        },
        {
          name: 'Backend & APIs',
          icon: '⚙️',
          skills: ['Python', 'FastAPI', 'Flask', 'REST APIs', 'Node.js'],
        },
        {
          name: 'Databases',
          icon: '🗄️',
          skills: ['SQL', 'MySQL', 'Vector Databases', 'Database Design'],
        },
        {
          name: 'Frontend & Mobile',
          icon: '🎨',
          skills: ['React.js', 'Next.js', 'HTML', 'CSS', 'Socket.IO', 'Flutter', 'Dart'],
        },
        {
          name: 'Practices & Languages',
          icon: '🌐',
          skills: ['Responsible AI / AI Ethics', 'Git & Version Control', 'Arabic (Native)', 'English (Advanced)'],
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
      greeting: "Hi! I'm Aime, Abdulaziz's AI assistant. I can tell you about his work, projects, and skills — or run a job-fit check if you're hiring. How can I help you today?",
      bubbleGreet: "Hi there! 👋 Need help? I can tell you about Abdulaziz's work!",
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
        { label: '🎯 Quick tour', tour: true },
        {
          label: 'Projects',
          query: 'What are his projects?',
          canned: 'These are his projects — any specific one you want to dig into?',
          action: 'projects',
        },
        { label: '🏆 Hackathon Win', query: 'Tell me about the AI Board Room hackathon win' },
        { label: 'Job Fit Check', query: "I'm a recruiter. I'll paste a job description, and I want you to analyze how well Abdulaziz fits it — matched skills, which of his projects prove each requirement, and honest gaps. Ready?" },
        {
          label: 'Contact',
          query: 'How can I contact him?',
          canned: "Here's how to reach him — email or LinkedIn work best. Anything else you'd like to know first?",
          action: 'contact',
        },
      ],
      tour: [
        { text: "Let me show you around. This is Abdulaziz — an AI/ML engineer who designs, builds, and ships LLM and ML systems end-to-end.", action: 'about' },
        { text: 'His projects. Start with AI Board Room — a multi-agent advisory board that took 1st place at the Himmah Digital Camps hackathon.', action: 'projects.board-room' },
        { text: 'AgroCure — plant-disease detection running at 73 ms on a Raspberry Pi. He led the four-person team behind it.', action: 'projects.agrocure' },
        { text: "And Aime — that's me: Whisper, Claude, and ElevenLabs, deployed and talking to you right now.", action: 'projects.aime' },
        { text: "What he's building now: hardening Board Room and AgroCure into trustworthy, Arabic-first systems for the Saudi market.", action: 'now' },
        { text: 'The toolkit behind it all — GenAI, deep learning, and MLOps.', action: 'skills' },
        { text: "And this is where to reach him. Ask me anything else — I'm here.", action: 'contact' },
      ],
    },
  },
  ar: {
    nav: {
      about: 'عني',
      projects: 'المشاريع',
      now: 'قيد البناء',
      skills: 'المهارات',
      contact: 'تواصل',
    },
    hero: {
      greeting: 'مرحباً، أنا',
      name: 'عبدالعزيز الحيدان',
      title: 'مهندس ذكاء اصطناعي وتعلّم آلة',
      titles: ['مهندس ذكاء اصطناعي / تعلّم آلة', 'أنظمة LLM والوكلاء المتعددين', 'مهندس RAG وذكاء توليدي', 'مهندس باك إند'],
      bio: 'مهندس ذكاء اصطناعي وتعلّم آلة أصمّم وأبني وأطلق أنظمة LLM وتعلّم آلة بجودة إنتاجية من البداية إلى النهاية — من البيانات والتدريب إلى RAG وتنسيق الوكلاء المتعددين والنشر. أعمل حالياً على بناء ذكاء اصطناعي موثوق يتحدث العربية أولاً للسوق السعودي.',
      cta1: 'تحدث مع آيم',
      cta2: 'عرض المشاريع',
      cta3: 'تحميل السيرة الذاتية',
      available: 'متاح للفرص المهنية',
    },
    about: {
      title: 'عني',
      p1: 'مهندس ذكاء اصطناعي وتعلّم آلة حاصل على بكالوريوس علوم الحاسب، أبني وأطلق أنظمة LLM وتعلّم آلة بجودة إنتاجية من البداية إلى النهاية. فزت بالمركز الأول في هاكاثون معسكرات همّة الرقمية عن «مجلس الإدارة الذكي» — نظام استشاري تنفيذي متعدد الوكلاء — ونشرت نموذج رؤية حاسوبية مُحسَّناً للحافة يعمل بزمن استدلال 73 مللي ثانية على Raspberry Pi.',
      p2: 'ما يميزني هو الذكاء الاصطناعي الإنتاجي بالعربية أولاً: دمج نماذج اللغة الكبيرة (OpenAI وClaude من Anthropic)، وتنسيق الوكلاء المتعددين، وبناء أنظمة RAG من الصفر مع التضمينات وقواعد البيانات المتجهة — تُقدَّم عبر واجهات FastAPI موثوقة وتُنشر على السحابة. قُدت فريقاً هندسياً من أربعة أشخاص عبر البيانات والتدريب والنشر، وأبني وفق ممارسات الذكاء الاصطناعي المسؤول منذ اليوم الأول.',
      education: 'التعليم',
      university: 'جامعة المجمعة — كلية العلوم، الزلفي',
      degree: 'بكالوريوس علوم الحاسب',
      gpa: 'المعدل: 4.01 / 5 — جيد جداً',
      period: '2020 – 2025',
      certifications: 'الشهادات',
      certs: [
        { name: 'شهادة IBM لعلوم البيانات', issuer: 'IBM / Coursera', year: '2024' },
        { name: 'تخصص TensorFlow للمطورين', issuer: 'DeepLearning.AI', year: '2024' },
        { name: 'أساسيات السحابة — AWS', issuer: 'أمازون ويب سيرفيسز', year: '2023' },
      ],
    },
    experience: {
      title: 'الخبرات',
      current: 'حالياً',
      items: [
        {
          role: 'هندسة الذكاء الاصطناعي وتعلّم الآلة — معسكر مكثّف',
          org: 'مشاريع ومقررات تطبيقية',
          period: '2026 – الآن',
          current: true,
          points: [
            'خطوط أنابيب تعلّم آلة متكاملة: تحليل استكشافي، هندسة خصائص، ضبط معاملات، وتحليل دقيق للأخطاء.',
            'شبكات CNN وRNN/LSTM وSeq2Seq ونماذج سلاسل زمنية؛ وضبط دقيق لـ BERT عبر Hugging Face.',
            'بناء نظام RAG كامل من الصفر (تضمينات + FAISS)؛ وهندسة موجهات متقدمة بـ DSPy/GEPA.',
            'تجهيز النماذج للإنتاج: تصدير ONNX، والتسلسل، وتتبع التجارب بـ MLflow.',
          ],
        },
        {
          role: 'أخصائي ضمان الجودة',
          org: 'T2 — الرياض، السعودية',
          period: 'فبراير 2025 – مايو 2025',
          current: false,
          points: [
            'تنفيذ اختبارات وظيفية واختبارات انحدار عبر الإصدارات.',
            'رصد العيوب وتتبعها والتحقق من الإصلاحات لضمان جودة المنتج.',
          ],
        },
      ],
    },
    projects: {
      title: 'المشاريع',
      // §7 — ثلاثة مشاريع، أربعة عناصر لكل بطاقة. لا شيء غيرها.
      // الحقول المعلَّمة TODO قرارات §11: يكتبها المالك، لا البناء.
      items: [
        {
          id: 'board-room',
          name: 'مجلس الإدارة الذكي',
          number: '[[ ?? ]]',
          numberNote: '[[ يُملأ — ماذا يقيس هذا الرقم ]]',
          summary:
            '[[ يُملأ — جملة أو جملتان: ماذا يفعل المشروع فعلاً، لا التقنيات المستخدمة فيه. يفهمه غير التقني، ويحترم عقل التقني. ]]',
          broke: '[[ يُملأ — ما الذي لم ينجح، وماذا تعلّمت منه ]]',
        },
        {
          id: 'aime',
          name: 'آيم — المساعد الصوتي',
          number: '[[ ?? ]]',
          numberNote: '[[ يُملأ — ماذا يقيس هذا الرقم ]]',
          summary: '[[ يُملأ — جملة أو جملتان، بنفس الشروط ]]',
          broke: '[[ يُملأ — ما الذي انكسر، وماذا تعلّمت منه ]]',
        },
        {
          id: 'agrocure',
          name: 'أجروكيور',
          number: '[[ ?? ]]',
          numberNote: '[[ يُملأ — ماذا يقيس هذا الرقم ]]',
          summary: '[[ يُملأ — جملة أو جملتان، بنفس الشروط ]]',
          broke: '[[ يُملأ — ما الذي انكسر، وماذا تعلّمت منه ]]',
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
    skills: {
      title: 'المهارات',
      categories: [
        {
          name: 'الذكاء التوليدي ونماذج اللغة',
          icon: '🤖',
          skills: ['دمج LLM (OpenAI, Claude)', 'تنسيق وكلاء متعددين', 'RAG (من الصفر)', 'LangChain', 'FAISS', 'ChromaDB', 'التضمينات', 'هندسة الموجهات (DSPy/GEPA)', 'الضبط الدقيق', 'Hugging Face', 'BERT'],
        },
        {
          name: 'تعلّم الآلة والتعلّم العميق',
          icon: '🧠',
          skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'CNN / نقل التعلم', 'RNN / LSTM / Seq2Seq', 'التنبؤ بالسلاسل الزمنية', 'التقييم وتشخيص الأخطاء'],
        },
        {
          name: 'MLOps والنشر',
          icon: '🚀',
          skills: ['MLflow', 'ONNX', 'تقديم النماذج عبر FastAPI', 'نشر على الحافة (Raspberry Pi)', 'Docker', 'CI/CD', 'AWS (IAM, EC2, S3)'],
        },
        {
          name: 'الباك إند والواجهات البرمجية',
          icon: '⚙️',
          skills: ['Python', 'FastAPI', 'Flask', 'REST APIs', 'Node.js'],
        },
        {
          name: 'قواعد البيانات',
          icon: '🗄️',
          skills: ['SQL', 'MySQL', 'قواعد بيانات متجهة', 'تصميم قواعد البيانات'],
        },
        {
          name: 'الواجهة الأمامية والموبايل',
          icon: '🎨',
          skills: ['React.js', 'Next.js', 'HTML', 'CSS', 'Socket.IO', 'Flutter', 'Dart'],
        },
        {
          name: 'الممارسات واللغات',
          icon: '🌐',
          skills: ['ذكاء اصطناعي مسؤول', 'Git وإدارة الإصدارات', 'العربية (أصيل)', 'الإنجليزية (متقدم)'],
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
      greeting: 'مرحباً! أنا آيم، مساعد الذكاء الاصطناعي لعبدالعزيز. يمكنني إخبارك عن أعماله ومشاريعه ومهاراته — أو تحليل مدى ملاءمته لوظيفة إن كنت توظّف. كيف أساعدك اليوم؟',
      bubbleGreet: 'أهلاً! 👋 هل تحتاج مساعدة؟ يمكنني إخبارك عن أعمال عبدالعزيز!',
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
        { label: '🎯 جولة سريعة', tour: true },
        {
          label: 'المشاريع',
          query: 'ما هي مشاريعه؟',
          canned: 'هذه مشاريعه — هل يهمّك مشروع محدد؟',
          action: 'projects',
        },
        { label: '🏆 الفوز بالهاكاثون', query: 'أخبرني عن فوز مشروع مجلس الإدارة الذكي بالهاكاثون' },
        { label: 'ملاءمة وظيفية', query: 'أنا مسؤول توظيف. سألصق وصفاً وظيفياً وأريدك أن تحلل مدى ملاءمة عبدالعزيز له — المهارات المطابقة، والمشاريع التي تثبت كل متطلب، والفجوات بصراحة. جاهز؟' },
        {
          label: 'تواصل',
          query: 'كيف أتواصل مع عبدالعزيز؟',
          canned: 'هكذا تصل إليه — البريد أو لينكدإن الأفضل. هل تريد معرفة شيء آخر أولاً؟',
          action: 'contact',
        },
      ],
      tour: [
        { text: 'دعني آخذك في جولة. هذا عبدالعزيز — مهندس ذكاء اصطناعي يصمّم ويبني ويطلق أنظمة LLM وتعلّم آلة من البداية إلى النهاية.', action: 'about' },
        { text: 'مشاريعه. لنبدأ بمجلس الإدارة الذكي — نظام استشاري متعدد الوكلاء حصد المركز الأول في هاكاثون معسكرات همّة الرقمية.', action: 'projects.board-room' },
        { text: 'أجروكيور — كشف أمراض النباتات بزمن 73 مللي ثانية على Raspberry Pi، وقد قاد فريقه المكوّن من أربعة مهندسين.', action: 'projects.agrocure' },
        { text: 'وآيم — هذا أنا: Whisper وClaude وElevenLabs، منشور ويتحدث معك الآن.', action: 'projects.aime' },
        { text: 'ما يبنيه الآن: تطوير مجلس الإدارة وأجروكيور إلى أنظمة موثوقة تتحدث العربية أولاً للسوق السعودي.', action: 'now' },
        { text: 'العدّة خلف كل ذلك — ذكاء توليدي وتعلّم عميق وMLOps.', action: 'skills' },
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
