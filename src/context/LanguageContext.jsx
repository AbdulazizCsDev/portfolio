import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
    },
    hero: {
      greeting: "Hello, I'm",
      name: 'Abdulaziz Alhaidan',
      title: 'Software Engineer & AI Developer',
      titles: ['Software Engineer', 'AI Developer', 'Backend Developer', 'ML Engineer'],
      bio: "Fresh CS graduate from Majmaah University (GPA 4.01/5) specialized in backend development and AI-powered applications. I build things end-to-end — from architecture to production.",
      cta1: 'Talk to Aime',
      cta2: 'View Projects',
      cta3: 'Download CV',
      available: 'Available for opportunities',
    },
    about: {
      title: 'About Me',
      p1: "Fresh CS graduate from Majmaah University specialized in backend development and AI-powered applications. I combine solid engineering fundamentals with hands-on experience building production-ready systems.",
      p2: "My focus is at the intersection of backend engineering, machine learning, and conversational AI — crafting solutions that are not just functional, but truly impactful, from architecture all the way to deployment.",
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
    projects: {
      title: 'Projects',
      live: 'Live',
      docs: 'Docs',
      github: 'GitHub',
      items: [
        {
          name: 'Aime Voice Assistant',
          desc: 'An Arabic-first AI voice assistant with voice cloning, RAG pipeline, and LLM integration. Deployed as a production web app.',
          tags: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'Whisper', 'Claude', 'ElevenLabs'],
          live: 'https://aime-voice-assistant-production.up.railway.app/',
          github: 'https://github.com/AbdulazizCsDev/aime-voice-assistant',
        },
        {
          name: 'Weather-Driven Demand Forecasting',
          desc: 'End-to-end ML pipeline forecasting car wash demand in Riyadh using live weather data. Reduced prediction MAE by ~50%.',
          tags: ['Python', 'FastAPI', 'Scikit-learn', 'REST APIs', 'SQL'],
          live: null,
          github: 'https://github.com/AbdulazizCsDev/carwash-demand-forecast',
        },
        {
          name: 'Car Wash Management System',
          desc: 'Full-stack car wash management platform with role-based access, real-time order tracking, and payment integration. Graduation project.',
          tags: ['Dart', 'Flutter', 'PHP', 'MySQL', 'REST APIs'],
          live: null,
          docs: 'https://car-wash-system-b7mamo4.gamma.site/',
          github: 'https://github.com/AbdulazizCsDev/carwash_system',
        },
        {
          name: 'Online Multiplayer Spy Game',
          desc: 'Real-time multiplayer party game built with React and Socket.IO, featuring room management, voting system, and reconnection handling.',
          tags: ['React', 'Node.js', 'Socket.IO'],
          live: 'https://typing-game-client.onrender.com/',
          github: 'https://github.com/AbdulazizCsDev/typing-game',
        },
        {
          name: 'X Tweets Analyzer',
          desc: 'Data analysis app that analyzes engagement and activity patterns of X posts with interactive visualizations.',
          tags: ['Python', 'Streamlit', 'X API', 'Data Visualization'],
          live: 'https://x-tweets-analyzer.streamlit.app/',
          github: 'https://github.com/AbdulazizCsDev/x-tweets-analyzer',
        },
      ],
    },
    skills: {
      title: 'Skills',
      categories: [
        {
          name: 'Backend',
          icon: '⚙️',
          skills: ['Python', 'FastAPI', 'Flask', 'REST APIs', 'Node.js'],
        },
        {
          name: 'AI / ML',
          icon: '🧠',
          skills: ['LangChain', 'ChromaDB', 'RAG', 'Scikit-learn', 'TensorFlow', 'Whisper', 'Prompt Engineering'],
        },
        {
          name: 'Frontend',
          icon: '🎨',
          skills: ['React.js', 'HTML', 'CSS', 'Socket.IO'],
        },
        {
          name: 'Mobile',
          icon: '📱',
          skills: ['Flutter', 'Dart'],
        },
        {
          name: 'Cloud & DevOps',
          icon: '☁️',
          skills: ['AWS (IAM, EC2, S3)', 'Docker', 'Railway', 'CI/CD'],
        },
        {
          name: 'Databases',
          icon: '🗄️',
          skills: ['SQL', 'MySQL'],
        },
        {
          name: 'Languages',
          icon: '🌐',
          skills: ['Arabic (Native)', 'English (Advanced)'],
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
      greeting: "Hi! I'm Aime, Abdulaziz's AI assistant. I can tell you about his work, projects, and skills. How can I help you today?",
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
        { label: 'Projects', query: 'Tell me about the projects' },
        { label: 'Skills', query: 'What are his skills?' },
        { label: 'Certifications', query: 'What certifications does he have?' },
        { label: 'Contact', query: 'How can I contact him?' },
      ],
    },
  },
  ar: {
    nav: {
      about: 'عني',
      projects: 'المشاريع',
      skills: 'المهارات',
      contact: 'تواصل',
    },
    hero: {
      greeting: 'مرحباً، أنا',
      name: 'عبدالعزيز الحيدان',
      title: 'مهندس برمجيات ومطور ذكاء اصطناعي',
      titles: ['مهندس برمجيات', 'مطور ذكاء اصطناعي', 'مطور باك إند', 'مهندس تعلم آلي'],
      bio: 'خريج علوم حاسب من جامعة المجمعة (معدل 4.01/5) متخصص في تطوير الباك اند وتطبيقات الذكاء الاصطناعي. أبني المشاريع من الفكرة حتى الإطلاق.',
      cta1: 'تحدث مع آيم',
      cta2: 'عرض المشاريع',
      cta3: 'تحميل السيرة الذاتية',
      available: 'متاح للفرص المهنية',
    },
    about: {
      title: 'عني',
      p1: 'خريج علوم حاسب من جامعة المجمعة متخصص في تطوير الباك إند وتطبيقات الذكاء الاصطناعي. أجمع بين أسس هندسية متينة وخبرة عملية في بناء أنظمة جاهزة للإنتاج.',
      p2: 'يتمحور تركيزي حول تقاطع هندسة الخلفية والتعلم الآلي والذكاء الاصطناعي الحواري — لصياغة حلول ليست فعّالة فحسب، بل ذات أثر حقيقي من التصميم حتى النشر.',
      education: 'التعليم',
      university: 'جامعة المجمعة — كلية العلوم، زلفى',
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
    projects: {
      title: 'المشاريع',
      live: 'مباشر',
      docs: 'التوثيق',
      github: 'جيت هاب',
      items: [
        {
          name: 'آيم — المساعد الصوتي',
          desc: 'مساعد صوتي ذكي يدعم العربية بالدرجة الأولى، مع استنساخ الصوت وتقنية RAG ونماذج اللغة الكبيرة. منشور كتطبيق ويب إنتاجي.',
          tags: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'Whisper', 'Claude', 'ElevenLabs'],
          live: 'https://aime-voice-assistant-production.up.railway.app/',
          github: 'https://github.com/AbdulazizCsDev/aime-voice-assistant',
        },
        {
          name: 'التنبؤ بالطلب المرتبط بالطقس',
          desc: 'نظام تنبؤ بالطلب على غسيل السيارات باستخدام بيانات الطقس الحية وتقنيات تعلم الآلة. خفّض معدل الخطأ بنسبة ~50%.',
          tags: ['Python', 'FastAPI', 'Scikit-learn', 'REST APIs', 'SQL'],
          live: null,
          github: 'https://github.com/AbdulazizCsDev/carwash-demand-forecast',
        },
        {
          name: 'نظام إدارة غسيل السيارات',
          desc: 'منصة متكاملة لإدارة محطات غسيل السيارات مع تتبع الطلبات وإدارة الصلاحيات ودمج المدفوعات. مشروع التخرج.',
          tags: ['Dart', 'Flutter', 'PHP', 'MySQL', 'REST APIs'],
          live: null,
          docs: 'https://car-wash-system-b7mamo4.gamma.site/',
          github: 'https://github.com/AbdulazizCsDev/carwash_system',
        },
        {
          name: 'لعبة الجاسوس متعددة اللاعبين',
          desc: 'لعبة جماعية متعددة اللاعبين في الوقت الفعلي مع نظام تصويت وإدارة غرف وإعادة اتصال تلقائية.',
          tags: ['React', 'Node.js', 'Socket.IO'],
          live: 'https://typing-game-client.onrender.com/',
          github: 'https://github.com/AbdulazizCsDev/typing-game',
        },
        {
          name: 'محلل منشورات X',
          desc: 'تطبيق تحليل بيانات منشورات X مع تصورات بيانية تفاعلية ورؤى تحليلية حول التفاعل والنشاط.',
          tags: ['Python', 'Streamlit', 'X API', 'Data Visualization'],
          live: 'https://x-tweets-analyzer.streamlit.app/',
          github: 'https://github.com/AbdulazizCsDev/x-tweets-analyzer',
        },
      ],
    },
    skills: {
      title: 'المهارات',
      categories: [
        {
          name: 'الخلفية',
          icon: '⚙️',
          skills: ['Python', 'FastAPI', 'Flask', 'REST APIs', 'Node.js'],
        },
        {
          name: 'ذكاء اصطناعي / تعلم آلي',
          icon: '🧠',
          skills: ['LangChain', 'ChromaDB', 'RAG', 'Scikit-learn', 'TensorFlow', 'Whisper', 'Prompt Engineering'],
        },
        {
          name: 'الواجهة الأمامية',
          icon: '🎨',
          skills: ['React.js', 'HTML', 'CSS', 'Socket.IO'],
        },
        {
          name: 'الموبايل',
          icon: '📱',
          skills: ['Flutter', 'Dart'],
        },
        {
          name: 'السحابة والـ DevOps',
          icon: '☁️',
          skills: ['AWS (IAM, EC2, S3)', 'Docker', 'Railway', 'CI/CD'],
        },
        {
          name: 'قواعد البيانات',
          icon: '🗄️',
          skills: ['SQL', 'MySQL'],
        },
        {
          name: 'اللغات',
          icon: '🌐',
          skills: ['العربية (أصيل)', 'الإنجليزية (متقدم)'],
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
      greeting: 'مرحباً! أنا آيم، مساعد الذكاء الاصطناعي لعبدالعزيز. يمكنني إخبارك عن أعماله ومشاريعه ومهاراته. كيف يمكنني مساعدتك اليوم؟',
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
        { label: 'المشاريع', query: 'أخبرني عن المشاريع' },
        { label: 'المهارات', query: 'ما هي مهاراته؟' },
        { label: 'الشهادات', query: 'ما هي الشهادات؟' },
        { label: 'تواصل', query: 'كيف أتواصل مع عبدالعزيز؟' },
      ],
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const toggle = () => setLang((l) => (l === 'en' ? 'ar' : 'en'));
  return (
    <LanguageContext.Provider value={{ lang, toggle, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
