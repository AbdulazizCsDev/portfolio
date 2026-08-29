import { useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import NowBuilding from './components/NowBuilding';
import Contact from './components/Contact';
import AimeWidget from './components/AimeWidget';
import Calibration from './components/Calibration';
import Measure from './components/Measure';
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


  return (
    <>
      <div className={`app ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <a className="skip-link" href="#main">{lang === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content'}</a>
      <div className="scanline-overlay" aria-hidden="true" />
      <Measure />
      <Navbar />
      {projectId ? (
        <ProjectPage id={projectId} />
      ) : (
        <main id="main">
          <Hero />
          <Projects />
          <NowBuilding />
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
