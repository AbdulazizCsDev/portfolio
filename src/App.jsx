import { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AimeWidget from './components/AimeWidget';
import NeuralBackground from './components/NeuralBackground';
import './App.css';

function AppContent() {
  const { lang } = useLanguage();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('rtl', lang === 'ar');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let observer;
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) =>
            e.target.classList.toggle('in-view', e.isIntersecting)
          ),
        { threshold: 0.1 }
      );
      document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    }, 60);
    return () => { clearTimeout(timer); observer?.disconnect(); };
  }, [lang]);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <div className={`app ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <NeuralBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <AimeWidget />
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
