import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import './App.css';
import './motion.css';
import './social.css';
import { ResearchPage } from './components/ResearchPage';
import { cvExperience } from './data/content';
import { MotionProvider, Settle, resetRevealBatch } from './motion';

const routes = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/publications', label: 'Research' },
  { href: '/grants', label: 'Grants' },
];

function DocumentTitle({ title }: { title: string }) {
  useEffect(() => { document.title = `${title} · Mahwiz Khalil`; }, [title]);
  return null;
}

function SiteNav() {
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const [box, setBox] = useState<{ x: number; scale: number } | null>(null);
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!nav || !active) return;
    const navBox = nav.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    setBox({ x: item.left - navBox.left, scale: item.width });
  }, []);

  useEffect(() => {
    measure();
    const frame = requestAnimationFrame(() => setReady(true));
    window.addEventListener('resize', measure);
    const fonts = document.fonts;
    if (fonts?.ready) fonts.ready.then(() => measure()).catch(() => undefined);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
    };
  }, [location.pathname, measure]);

  return (
    <nav className="tabs" aria-label="Primary navigation" ref={navRef}>
      {routes.map((route) => <NavLink key={route.href} to={route.href} end={route.href === '/'}>{route.label}</NavLink>)}
      {box ? <span className={`nav-indicator${ready ? ' is-ready' : ''}`} style={{ width: box.scale, transform: `translateX(${box.x}px)` }} aria-hidden="true" /> : null}
    </nav>
  );
}

function SiteChrome() {
  return (
    <>
      <div className="topline"><span lang="ur" dir="rtl">مہویز خلیل</span><span className="availability"><i /> Karachi, Pakistan</span></div>
      <header className="site-header">
        <div className="brand"><h1><NavLink to="/">Muhammad Mahwiz Khalil</NavLink></h1><div className="eyebrow">AI engineer & language researcher</div></div>
      </header>
      <SiteNav />
    </>
  );
}

function SiteFooter() {
  return <footer><span>© {new Date().getFullYear()} Muhammad Mahwiz Khalil</span><a href="https://huggingface.co/mahwizzzz" target="_blank" rel="noopener noreferrer">Made for language. Built in Karachi. ↗</a></footer>;
}

function Logo({ kind }: { kind: 'cv' | 'github' | 'linkedin' }) {
  if (kind === 'cv') return <svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.5h8l4 4V21.5H6zM14 2.5v4h4M8.5 12h7M8.5 16h5" /></svg>;
  if (kind === 'linkedin') return <span className="social-monogram" aria-hidden="true">in</span>;
  return <svg className="social-logo filled" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15 1 1.7 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.43-2.2 1.15-2.98-.12-.29-.5-1.42.11-2.95 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.14-1.44 3.08-1.14 3.08-1.14.61 1.53.23 2.66.11 2.95.72.78 1.15 1.76 1.15 2.98 0 4.29-2.61 5.24-5.1 5.51.4.34.76 1 .76 2.03v3.01c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>;
}

function SocialLinks() {
  return (
    <div className="social-links">
      <a href="/CV.pdf" target="_blank" rel="noreferrer noopener"><Logo kind="cv" />View CV</a>
      <a href="https://huggingface.co/mahwizzzz" target="_blank" rel="noreferrer noopener">Hugging Face 🤗 <span aria-hidden="true">↗</span></a>
      <a href="https://github.com/mwzkhalil" target="_blank" rel="noreferrer noopener"><Logo kind="github" />GitHub <span aria-hidden="true">↗</span></a>
      <a href="https://www.linkedin.com/in/mahwiz-khalil" target="_blank" rel="noreferrer noopener"><Logo kind="linkedin" />LinkedIn <span aria-hidden="true">↗</span></a>
      <a href="https://twitter.com/mwzkhalil" target="_blank" rel="noreferrer noopener">X <span aria-hidden="true">↗</span></a>
    </div>
  );
}

function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <div className="section-heading">{eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}<h2>{title}</h2>{children}</div>;
}

function HomePage() {
  return (
    <>
      <DocumentTitle title="Home" />
      <section className="hero">
        <div className="hero-copy">
          <p>I build language AI for Urdu and Pakistani languages, connecting research in speech, language models, and signal processing with tools people can use.</p>
          <div className="hero-actions"><NavLink to="/publications" className="button primary">Explore the research <span aria-hidden="true">↗</span></NavLink><NavLink to="/about" className="text-link">A little about me →</NavLink></div>
          <SocialLinks />
        </div>
        <img className="hero-art" src="/me.png" alt="Muhammad Mahwiz Khalil" />
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <DocumentTitle title="About" />
      <SectionHeading eyebrow="A little about me" title="Language is where it starts." />
      <div className="prose about-prose">
        <Settle><p>Mahwiz Khalil is an AI engineer working across deep learning systems, NLP infrastructure, and low-resource language technology. Public work centers on Urdu and Pakistani-language speech, acoustic feature extraction, language models, and retrieval-augmented systems.</p></Settle>
        <Settle><p>Bachelor of Science in Computer Science at the University of Karachi, following a Diploma in Computer Information Technology from Aligarh Institute of Technology.</p></Settle>
        <Settle><h3>Technical focus</h3></Settle>
        <Settle><p>Python, C, SQL, PyTorch, TensorFlow, Transformers, Hugging Face 🤗, signal processing (FFT, mel-spectrograms, filter banks), Flask, Django, FastAPI, distributed systems, MLOps, vector databases, AWS, Docker, Kubernetes, and CI/CD.</p></Settle>
        <Settle><h3>Certifications and recognition</h3></Settle>
        <Settle><p>Google Cloud transformer-model specialization; AWS practical data science specialization; IBM data science certification; Kaggle Notebook Expert; a distinguished technical speaking recognition; and open-source maintenance recorded in the CV.</p></Settle>
      </div>
    </>
  );
}

function ExperiencePage() {
  return (
    <>
      <DocumentTitle title="Experience" />
      <SectionHeading eyebrow="Experience" title="Engineering and research work." />
      <div className="timeline">
        {cvExperience.map((entry) => (
          <Settle key={entry.org}>
            <article className="timeline-item">
              <div className="timeline-date">{entry.dates}</div>
              <div>
                <h3>{entry.title}</h3>
                <p className="org">{entry.org} · {entry.location}</p>
                <p>{entry.description}</p>
              </div>
            </article>
          </Settle>
        ))}
      </div>
    </>
  );
}

function GrantsPage() {
  return (
    <>
      <DocumentTitle title="Grants" />
      <SectionHeading eyebrow="Grants" title="Funding and recognition." />
      <div className="empty-state">Funding information has not been added yet.</div>
    </>
  );
}

function Shell() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    resetRevealBatch();
    if (navigationType === 'POP') return;
    window.scrollTo({ top: 0, behavior: 'auto' });
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname, navigationType]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteChrome />
      <main id="main" ref={mainRef} tabIndex={-1} className="wrap">
        <div key={location.pathname} className="route-body">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/publications" element={<ResearchPage />} />
            <Route path="/grants" element={<GrantsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MotionProvider>
        <Shell />
      </MotionProvider>
    </BrowserRouter>
  );
}

export default App;
