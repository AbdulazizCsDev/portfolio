import { useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import NowBuilding from './components/NowBuilding';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AimeWidget from './components/AimeWidget';
import TraceField from './components/TraceField';
import Calibration from './components/Calibration';
import ProjectPage from './components/ProjectPage';
import { useRoute, matchProject } from './lib/router';
import './App.css';

function AppContent() {
  const { lang } = useLanguage();
  const path = useRoute();
  const projectId = matchProject(path);

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
  }, [lang, path]);

  return (
    <>
      <div className={`app ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <a className="skip-link" href="#main">{lang === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content'}</a>
      <TraceField />
      <div className="scanline-overlay" aria-hidden="true" />
      <Navbar />
      {projectId ? (
        <ProjectPage id={projectId} />
      ) : (
        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <NowBuilding />
          <Skills />
          <Contact />
        </main>
      )}
      <AimeWidget />
      <Calibration />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
