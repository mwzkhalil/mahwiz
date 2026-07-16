import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import './social.css';
import { Lightbox } from './components/Lightbox';
import { ResearchCard } from './components/ResearchCard';
import { cvExperience, researchItems } from './data/content';

const routes = [{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }, { href: '/experience', label: 'Experience' }, { href: '/publications', label: 'Research' }, { href: '/grants', label: 'Grants' }];

function SiteHeader() {
  return <><a className="skip-link" href="#main">Skip to content</a><div className="topline"><span lang="ur" dir="rtl">مہویز خلیل</span><span className="availability"><i /> Karachi, Pakistan</span></div><header className="site-header"><div className="eyebrow">Speech · NLP · signal processing</div><h1><NavLink to="/">Muhammad Mahwiz Khalil</NavLink></h1><p>Closing the resource gap between <strong><em>Urdu</em></strong> and the frontier of <strong><em>AI</em></strong>.</p></header><nav className="tabs" aria-label="Primary navigation">{routes.map((route) => <NavLink key={route.href} to={route.href} end={route.href === '/'}>{route.label}</NavLink>)}</nav></>;
}

function SiteFooter() { return <footer><span>© {new Date().getFullYear()} Muhammad Mahwiz Khalil</span><span>University of Karachi</span></footer>; }

function Logo({ kind }: { kind: 'cv' | 'hf' | 'github' | 'linkedin' | 'x' }) {
  if (kind === 'cv') return <svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.5h8l4 4V21.5H6zM14 2.5v4h4M8.5 12h7M8.5 16h5" /></svg>;
  if (kind === 'linkedin') return <span className="social-monogram" aria-hidden="true">in</span>;
  if (kind === 'x') return <span className="social-monogram x-mark" aria-hidden="true">X</span>;
  if (kind === 'github') return <svg className="social-logo filled" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15 1 1.7 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.43-2.2 1.15-2.98-.12-.29-.5-1.42.11-2.95 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.14-1.44 3.08-1.14 3.08-1.14.61 1.53.23 2.66.11 2.95.72.78 1.15 1.76 1.15 2.98 0 4.29-2.61 5.24-5.1 5.51.4.34.76 1 .76 2.03v3.01c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>;
  return <svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M7 14q5-7 10 0M8.5 9.5h.1M15.4 9.5h.1" /></svg>;
}
function SocialLinks() { return <div className="social-links"><a href="/CV.pdf" target="_blank" rel="noreferrer noopener"><Logo kind="cv" />View CV</a><a href="https://huggingface.co/mahwizzzz" target="_blank" rel="noreferrer noopener"><Logo kind="hf" />Hugging Face <span aria-hidden="true">↗</span></a><a href="https://github.com/mwzkhalil" target="_blank" rel="noreferrer noopener"><Logo kind="github" />GitHub <span aria-hidden="true">↗</span></a><a href="https://www.linkedin.com/in/mahwiz-khalil" target="_blank" rel="noreferrer noopener"><Logo kind="linkedin" />LinkedIn <span aria-hidden="true">↗</span></a><a href="https://twitter.com/mwzkhalil" target="_blank" rel="noreferrer noopener"><Logo kind="x" />X <span aria-hidden="true">↗</span></a></div>; }

function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) { return <div className="section-heading">{eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}<h2>{title}</h2>{children}</div>; }

function HomePage() {
  return <Page title="Home"><section className="hero"><div className="hero-copy"><p>I work on low-resource language AI speech recognition, synthesis, and acoustic modeling for Urdu and Pakistani languages, with practical research tools built on modern signal processing pipelines.</p><SocialLinks /></div><img className="hero-art" src="/me.png" alt="Muhammad Mahwiz Khalil" /></section></Page>;
}

function AboutPage() { return <Page title="About"><div className="prose about-prose"><p>Mahwiz Khalil is an AI engineer working across deep learning systems, NLP infrastructure, and low-resource language technology. Public work centers on Urdu and Pakistani-language speech, acoustic feature extraction, language models, and retrieval-augmented systems.</p><p>Bachelor of Science in Computer Science at the University of Karachi, following a Diploma in Computer Information Technology from Aligarh Institute of Technology.</p><h3>Technical focus</h3><p>Python, C, SQL, PyTorch, TensorFlow, Transformers, Hugging Face, signal processing (FFT, mel-spectrograms, filter banks), Flask, Django, FastAPI, distributed systems, MLOps, vector databases, AWS, Docker, Kubernetes, and CI/CD.</p><h3>Certifications and recognition</h3><p>Google Cloud transformer-model specialization; AWS practical data science specialization; IBM data science certification; Kaggle Notebook Expert; a distinguished technical speaking recognition; and open-source maintenance recorded in the CV.</p></div></Page>; }

function ExperiencePage() { return <Page title="Experience"><SectionHeading eyebrow="Experience" title="Engineering and research work." /><div className="timeline">{cvExperience.map((entry) => <article className="timeline-item" key={entry.org}><div className="timeline-date">{entry.dates}</div><div><h3>{entry.title}</h3><p className="org">{entry.org} · {entry.location}</p><p>{entry.description}</p></div></article>)}</div></Page>; }

function ResearchPage() {
  const [query, setQuery] = useState(''); const [type, setType] = useState('all'); const [theme, setTheme] = useState('all'); const [sort, setSort] = useState('featured'); const [openFigure, setOpenFigure] = useState<string | null>(null); const [lightbox, setLightbox] = useState<{ src: string; alt: string; trigger: HTMLButtonElement } | null>(null);
  const themes = useMemo(() => Array.from(new Set(researchItems.map((item) => item.theme))).sort(), []);
  const filtered = useMemo(() => { const normalized = query.trim().toLowerCase(); return researchItems.filter((item) => (type === 'all' || item.type === type) && (theme === 'all' || item.theme === theme) && (!normalized || `${item.name} ${item.description ?? ''} ${item.tags?.join(' ') ?? ''}`.toLowerCase().includes(normalized))).sort((a, b) => { if (sort === 'downloads') return (b.downloads ?? 0) - (a.downloads ?? 0) || a.name.localeCompare(b.name); if (sort === 'likes') return (b.likes ?? 0) - (a.likes ?? 0) || a.name.localeCompare(b.name); if (sort === 'recent') return String(b.lastModified ?? '').localeCompare(String(a.lastModified ?? '')) || a.name.localeCompare(b.name); return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name); }); }, [query, sort, theme, type]);
  useEffect(() => { document.title = 'Research · Mahwiz Khalil'; }, []);
  return <Page title="Research"><SectionHeading eyebrow="Research archive" title="Models, datasets, demos, and writing."><span className="result-count">{filtered.length} results</span></SectionHeading><div className="filters" aria-label="Research filters"><label>Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" /></label><label>Type<select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All types</option><option value="model">Models</option><option value="dataset">Datasets</option><option value="space">Spaces</option><option value="writing">Writing</option></select></label><label>Theme<select value={theme} onChange={(event) => setTheme(event.target.value)}><option value="all">All themes</option>{themes.map((value) => <option key={value}>{value}</option>)}</select></label><label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="recent">Recently updated</option><option value="downloads">Downloads</option><option value="likes">Likes</option></select></label></div>{filtered.length ? <div className="research-grid">{filtered.map((item) => <ResearchCard key={item.id} item={item} openFigureId={openFigure} onToggleFigure={(id) => setOpenFigure((current) => current === id ? null : id)} onOpenFigure={(src, alt, trigger) => setLightbox({ src, alt, trigger })} />)}</div> : <div className="empty-state">No research records match these filters.</div>}<Lightbox src={lightbox?.src ?? null} alt={lightbox?.alt ?? ''} onClose={() => { lightbox?.trigger.focus(); setLightbox(null); }} /></Page>;
}

function GrantsPage() { return <Page title="Grants"><SectionHeading eyebrow="Grants" title="Funding and recognition." /><div className="empty-state">Funding information has not been added yet.</div></Page>; }

function Page({ title, children }: { title: string; children: React.ReactNode }) { useEffect(() => { document.title = `${title} · Mahwiz Khalil`; }, [title]); return <><SiteHeader /><main id="main" className="wrap">{children}</main><SiteFooter /></>; }

function App() { return <BrowserRouter><Routes><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/experience" element={<ExperiencePage />} /><Route path="/publications" element={<ResearchPage />} /><Route path="/grants" element={<GrantsPage />} /><Route path="*" element={<HomePage />} /></Routes></BrowserRouter>; }

export default App;
