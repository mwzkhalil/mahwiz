import { useEffect, useRef, useState } from 'react';
import { aveyUsage, demos, selectedResearch, type DemoId, type ResearchCategory } from '../data/research';
import './research.css';

const categories: ResearchCategory[] = ['All work', 'Speech & phonetics', 'Language models', 'Open source'];
const demoIds: DemoId[] = ['cadenza', 'qalb', 'lafzyn'];

function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children} <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in a new tab)</span></a>;
}

export function ResearchArt({ kind }: { kind: string }) {
  if (kind === 'cadenza') return <div className="research-art art-speech" aria-hidden="true"><span className="art-caption">TEXT INTO VOICE</span><span className="art-urdu" lang="ur" dir="rtl">آواز</span><div className="waveform">{Array.from({ length: 51 }, (_, i) => <i key={i} style={{ height: `${12 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * .22)) * 64}px` }} />)}</div><span className="art-foot">URDU SPEECH SYNTHESIS</span></div>;
  if (kind === 'qalb') return <div className="research-art art-language" aria-hidden="true"><span className="art-caption">LANGUAGE WITH CONTEXT</span><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="art-urdu" lang="ur" dir="rtl">قلب</span><span className="art-foot">PROMPT · COMPARE · EXPLORE</span></div>;
  if (kind === 'avey') return <div className="research-art art-encoder" aria-hidden="true"><span className="art-caption">SMALL MODEL. RICH REPRESENTATIONS.</span><div className="token-line" dir="rtl" lang="ur"><span>پاکستان</span><span>کا</span><span className="mask-token">[MASK]</span><span>ہے۔</span></div><div className="encoder-grid">{Array.from({ length: 36 }, (_, i) => <i key={i} style={{ opacity: .12 + ((i * 7) % 11) / 14 }} />)}</div><span className="art-foot">24.87M PARAMETERS · 384-D HIDDEN STATES</span></div>;
  return <div className="research-art art-phonetic" aria-hidden="true"><span className="art-caption">SCRIPT INTO SOUND</span><span className="art-urdu" lang="ur" dir="rtl">پاکستان</span><span className="ipa-art">/ pɑːkɪsˈt̪aːn /</span><span className="art-foot">ILLUSTRATIVE IPA TRANSCRIPTION</span></div>;
}

function SpaceFrame({ demoId }: { demoId: DemoId }) {
  const demo = demos[demoId];
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<'loading' | 'embedded' | 'delayed'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!started || state !== 'loading') return;
    const timer = window.setTimeout(() => setState('delayed'), 20000);
    return () => window.clearTimeout(timer);
  }, [started, state, attempt]);
  const reload = () => { setState('loading'); setAttempt((n) => n + 1); };

  return <div className="space-container">
    <div className="space-toolbar"><span className="space-label"><span className="status-dot" />{demo.task}</span><OutLink href={demo.spaceUrl}>Open on Hugging Face 🤗</OutLink></div>
    {!started ? <div className={`space-cover space-cover-${demoId}`}>
      <div className="play-symbol" aria-hidden="true">↗</div>
      <h4>Try {demo.name}, right here.</h4>
      <p>{demo.description}</p>
      <button className="button primary" type="button" onClick={() => setStarted(true)}>Load {demo.name} demo <span aria-hidden="true">→</span></button>
      <small>Hosted on Hugging Face 🤗. Your inputs are sent to the Space.</small>
    </div> : <>
      <div className="embed-notice" role="status">
        <span>{state === 'loading' ? 'Opening the hosted demo…' : state === 'delayed' ? 'Taking longer than expected. The Space may be waking up or unavailable.' : 'Space embedded. If its app is sleeping or unavailable, open it on Hugging Face 🤗.'}</span>
        <button type="button" onClick={reload}>Reload demo</button>
        <button type="button" onClick={() => { setStarted(false); setState('loading'); }}>Close demo</button>
      </div>
      <iframe key={attempt} className="space-frame" title={`${demo.name} interactive demo`} src={`${demo.embedUrl}/?__theme=light`} allow="clipboard-write; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setState('embedded')} />
    </>}
  </div>;
}

function UsageCode() {
  const [copyStatus, setCopyStatus] = useState('Copy code');
  const copy = async () => {
    try { await navigator.clipboard.writeText(aveyUsage); setCopyStatus('Copied'); }
    catch { setCopyStatus('Select and copy the code below'); }
  };
  return <div className="usage-code"><div><span>Python · masked-token prediction</span><button type="button" onClick={copy} aria-live="polite">{copyStatus}</button></div><pre tabIndex={0} aria-label="Avey-B Urdu Python usage"><code dir="ltr">{aveyUsage}</code></pre></div>;
}

export function ResearchPage() {
  const [category, setCategory] = useState<ResearchCategory>('All work');
  const [activeDemo, setActiveDemo] = useState<DemoId>('cadenza');
  const playgroundRef = useRef<HTMLElement>(null);
  const playgroundHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { document.title = 'Research · Mahwiz Khalil'; }, []);

  const goToDemo = (id: DemoId) => {
    setActiveDemo(id);
    playgroundRef.current?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    playgroundHeading.current?.focus({ preventScroll: true });
  };
  const items = selectedResearch.filter((item) => category === 'All work' || item.category === category);

  return <>
    <section className="research-intro" aria-label="Research introduction">
      <div><p>Building for Urdu, from the way it sounds to the way it is understood. Explore the models, try the demos, and look inside the work.</p><a className="text-link" href="#playground">Explore the playground <span aria-hidden="true">↘</span></a></div>
    </section>

    <section aria-labelledby="selected-work-title" className="selected-work">
      <div className="section-bar"><h3 id="selected-work-title">The work <span>01 — 05</span></h3></div>
      <div className="research-controls"><div className="category-buttons" role="group" aria-label="Filter research by category">{categories.map((value) => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div><span className="filter-count" role="status">{items.length} project{items.length === 1 ? '' : 's'}</span></div>
      <div className="selected-grid">
        {items.map((item) => <article key={item.id} className={`project-card project-${item.id}`} aria-labelledby={`title-${item.id}`}>
          {item.id !== 'piper' && <ResearchArt kind={item.id} />}
          <div className="project-body">
            <div className="project-kicker"><span>{item.label}</span><span className="project-index">0{selectedResearch.indexOf(item) + 1}</span></div>
            {item.id === 'piper' && <div className="contribution-badge"><svg width="13" height="16" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="4" cy="4" r="2"/><circle cx="4" cy="16" r="2"/><circle cx="12" cy="4" r="2"/><path d="M4 6v8m8-8v2c0 3-8 1-8 5"/></svg> Merged upstream · PR #89</div>}
            <h3 id={`title-${item.id}`}>{item.name}</h3><p className="project-description">{item.description}</p>
            <div className="project-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="project-actions">{item.demo && <button type="button" className="text-link" onClick={() => goToDemo(item.demo!)}>Try {item.name} <span aria-hidden="true">↗</span></button>}<OutLink href={item.url}>{item.linkLabel}</OutLink></div>
            <details className="project-details"><summary>Research notes{item.id === 'avey' ? ' & usage' : ''}<span aria-hidden="true">+</span></summary><div className="details-content"><dl>{item.details.map((detail) => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl><p>{item.note}</p>{item.id === 'avey' && <><p>No hosted demo is configured for this encoder. Run masked-token inference using the example below.</p><OutLink href="https://github.com/rimads/avey-b">Upstream Avey-B architecture</OutLink><UsageCode /></>}{item.id === 'lafzyn' && <OutLink href="https://huggingface.co/mahwizzzz/lafzyn-gguf">Download the GGUF build</OutLink>}{item.id === 'piper' && <OutLink href="https://huggingface.co/mahwizzzz/piper-voice-ur-aegis-female">Voice model and sample audio</OutLink>}</div></details>
          </div>
          {item.id === 'piper' && <div className="contribution-art" aria-hidden="true"><span lang="ur" dir="rtl">ایک نئی آواز</span><div>URDU / PIPER / OPEN SOURCE</div></div>}
        </article>)}
      </div>
    </section>

    <section id="playground" className="playground" ref={playgroundRef} aria-labelledby="playground-title">
      <div className="section-bar"><h3 id="playground-title" ref={playgroundHeading} tabIndex={-1}>The playground <span>TRY IT YOURSELF</span></h3><span className="hosting-label">Powered by Hugging Face 🤗 Spaces</span></div>
      <p className="playground-intro">Research is better when you can interact with it.</p>
      <div className="demo-tabs" role="tablist" aria-label="Choose an interactive demo">{demoIds.map((id, index) => <button type="button" key={id} id={`tab-${id}`} role="tab" aria-selected={activeDemo === id} aria-controls="demo-panel" tabIndex={activeDemo === id ? 0 : -1} onClick={() => setActiveDemo(id)} onKeyDown={(event) => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % demoIds.length;
        else if (event.key === 'ArrowLeft') next = (index + demoIds.length - 1) % demoIds.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = demoIds.length - 1;
        else return;
        event.preventDefault(); setActiveDemo(demoIds[next]); document.getElementById(`tab-${demoIds[next]}`)?.focus();
      }}><span className="demo-number">0{index + 1}</span><span>{demos[id].name}<small>{demos[id].task}</small></span><span className="tab-arrow" aria-hidden="true">↗</span></button>)}</div>
      <div id="demo-panel" role="tabpanel" aria-labelledby={`tab-${activeDemo}`} tabIndex={0}><SpaceFrame key={activeDemo} demoId={activeDemo} /></div>
    </section>
    <div className="research-closing"><p>For Urdu. For everyone.</p><OutLink href="https://huggingface.co/mahwizzzz">Follow the work on Hugging Face 🤗</OutLink></div>
  </>;
}
