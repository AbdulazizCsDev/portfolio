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
      line: '[[ TODO — one line. Who you are and what you actually do. No production-grade, no end-to-end. Write it as if explaining yourself to an engineer you respect. ]]',
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
          number: '[[ ?? ]]',
          numberNote: '[[ TODO — what the number counts ]]',
          summary:
            '[[ TODO — one or two sentences: what this actually does, not what it is built with. Plain enough for a non-technical reader, precise enough to respect a technical one. ]]',
          broke: '[[ TODO — what did not work, and what it taught you ]]',
          detail: {
            sections: [
              { heading: 'Architecture', body: '[[ TODO — how the pieces fit, and what talks to what ]]' },
              { heading: 'Decisions', body: '[[ TODO — the calls you made and why you made them ]]' },
              { heading: 'Metrics', body: '[[ TODO — the full numbers, not just the headline one ]]' },
              { heading: 'Limits', body: '[[ TODO — where it stops working, and what it does not claim ]]' },
              { heading: 'Tried and failed', body: '[[ TODO — what you attempted that did not work ]]' },
              { heading: 'Code', body: '[[ TODO — link, or say it is closed ]]' },
            ],
          },
        },
        {
          id: 'aime',
          name: 'Aime Voice Assistant',
          number: '[[ ?? ]]',
          numberNote: '[[ TODO — what the number counts ]]',
          summary: '[[ TODO — one or two sentences, same rules ]]',
          broke: '[[ TODO — what broke, and what it taught you ]]',
          detail: {
            sections: [
              { heading: 'Architecture', body: '[[ TODO — how the pieces fit, and what talks to what ]]' },
              { heading: 'Decisions', body: '[[ TODO — the calls you made and why you made them ]]' },
              { heading: 'Metrics', body: '[[ TODO — the full numbers, not just the headline one ]]' },
              { heading: 'Limits', body: '[[ TODO — where it stops working, and what it does not claim ]]' },
              { heading: 'Tried and failed', body: '[[ TODO — what you attempted that did not work ]]' },
              { heading: 'Code', body: '[[ TODO — link, or say it is closed ]]' },
            ],
          },
        },
        {
          id: 'agrocure',
          name: 'AgroCure',
          number: '[[ ?? ]]',
          numberNote: '[[ TODO — what the number counts ]]',
          summary: '[[ TODO — one or two sentences, same rules ]]',
          broke: '[[ TODO — what broke, and what it taught you ]]',
          detail: {
            sections: [
              { heading: 'Architecture', body: '[[ TODO — how the pieces fit, and what talks to what ]]' },
              { heading: 'Decisions', body: '[[ TODO — the calls you made and why you made them ]]' },
              { heading: 'Metrics', body: '[[ TODO — the full numbers, not just the headline one ]]' },
              { heading: 'Limits', body: '[[ TODO — where it stops working, and what it does not claim ]]' },
              { heading: 'Tried and failed', body: '[[ TODO — what you attempted that did not work ]]' },
              { heading: 'Code', body: '[[ TODO — link, or say it is closed ]]' },
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
      line: '[[ يُملأ — سطر واحد. من أنت وما الذي تصنعه فعلاً. لا «بجودة إنتاجية» ولا «من البداية إلى النهاية». اكتبه كأنك تشرح نفسك لمهندس تحترمه. ]]',
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
          number: '[[ ?? ]]',
          numberNote: '[[ يُملأ — ماذا يقيس هذا الرقم ]]',
          summary:
            '[[ يُملأ — جملة أو جملتان: ماذا يفعل المشروع فعلاً، لا التقنيات المستخدمة فيه. يفهمه غير التقني، ويحترم عقل التقني. ]]',
          broke: '[[ يُملأ — ما الذي لم ينجح، وماذا تعلّمت منه ]]',
          detail: {
            sections: [
              { heading: 'المعمارية', body: '[[ يُملأ — كيف تتركّب القطع، وما الذي يتحدث مع ماذا ]]' },
              { heading: 'القرارات', body: '[[ يُملأ — ما الذي قرّرته، ولماذا قرّرته ]]' },
              { heading: 'المقاييس', body: '[[ يُملأ — الأرقام كاملة، لا الرقم الواجهة فقط ]]' },
              { heading: 'الحدود', body: '[[ يُملأ — أين يتوقف عن العمل، وما الذي لا يدّعيه ]]' },
              { heading: 'ما جُرّب وفشل', body: '[[ يُملأ — ما حاولته ولم ينجح ]]' },
              { heading: 'الكود', body: '[[ يُملأ — رابط، أو قل إنه مغلق ]]' },
            ],
          },
        },
        {
          id: 'aime',
          name: 'آيم — المساعد الصوتي',
          number: '[[ ?? ]]',
          numberNote: '[[ يُملأ — ماذا يقيس هذا الرقم ]]',
          summary: '[[ يُملأ — جملة أو جملتان، بنفس الشروط ]]',
          broke: '[[ يُملأ — ما الذي انكسر، وماذا تعلّمت منه ]]',
          detail: {
            sections: [
              { heading: 'المعمارية', body: '[[ يُملأ — كيف تتركّب القطع، وما الذي يتحدث مع ماذا ]]' },
              { heading: 'القرارات', body: '[[ يُملأ — ما الذي قرّرته، ولماذا قرّرته ]]' },
              { heading: 'المقاييس', body: '[[ يُملأ — الأرقام كاملة، لا الرقم الواجهة فقط ]]' },
              { heading: 'الحدود', body: '[[ يُملأ — أين يتوقف عن العمل، وما الذي لا يدّعيه ]]' },
              { heading: 'ما جُرّب وفشل', body: '[[ يُملأ — ما حاولته ولم ينجح ]]' },
              { heading: 'الكود', body: '[[ يُملأ — رابط، أو قل إنه مغلق ]]' },
            ],
          },
        },
        {
          id: 'agrocure',
          name: 'أجروكيور',
          number: '[[ ?? ]]',
          numberNote: '[[ يُملأ — ماذا يقيس هذا الرقم ]]',
          summary: '[[ يُملأ — جملة أو جملتان، بنفس الشروط ]]',
          broke: '[[ يُملأ — ما الذي انكسر، وماذا تعلّمت منه ]]',
          detail: {
            sections: [
              { heading: 'المعمارية', body: '[[ يُملأ — كيف تتركّب القطع، وما الذي يتحدث مع ماذا ]]' },
              { heading: 'القرارات', body: '[[ يُملأ — ما الذي قرّرته، ولماذا قرّرته ]]' },
              { heading: 'المقاييس', body: '[[ يُملأ — الأرقام كاملة، لا الرقم الواجهة فقط ]]' },
              { heading: 'الحدود', body: '[[ يُملأ — أين يتوقف عن العمل، وما الذي لا يدّعيه ]]' },
              { heading: 'ما جُرّب وفشل', body: '[[ يُملأ — ما حاولته ولم ينجح ]]' },
              { heading: 'الكود', body: '[[ يُملأ — رابط، أو قل إنه مغلق ]]' },
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
