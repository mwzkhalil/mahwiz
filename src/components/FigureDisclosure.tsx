import { useEffect, useLayoutEffect, useRef, useState, type TransitionEvent } from 'react';
import { ProcessFigure, processKind } from './ProcessFigure';

const LOADER_DELAY_MS = 150;
const CLOSE_FALLBACK_MS = 280;

export function FigureDisclosure({
  id,
  src,
  alt,
  open,
  onEnlarge,
}: {
  id: string;
  src: string;
  alt: string;
  open: boolean;
  onEnlarge: () => void;
}) {
  const regionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  const [rendered, setRendered] = useState(open);
  const [expanded, setExpanded] = useState(open);
  openRef.current = open;
  const kind = processKind(src);

  useEffect(() => {
    if (open) {
      setRendered(true);
      return;
    }
    setExpanded(false);
    const fallback = window.setTimeout(() => {
      if (!openRef.current) setRendered(false);
    }, CLOSE_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [open]);

  useEffect(() => {
    if (!open || !rendered) return;
    const frame = requestAnimationFrame(() => setExpanded(true));
    return () => cancelAnimationFrame(frame);
  }, [open, rendered]);

  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    if (open) node.removeAttribute('inert');
    else node.setAttribute('inert', '');
  }, [open, rendered]);

  const onTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== regionRef.current || event.propertyName !== 'grid-template-rows') return;
    if (!openRef.current) setRendered(false);
  };

  return (
    <div ref={regionRef} className={`figure-disclosure${expanded ? ' is-open' : ''}`} onTransitionEnd={onTransitionEnd}>
      <div ref={innerRef} className="figure-disclosure-inner" id={id} aria-hidden={open ? undefined : true}>
        {rendered ? (
          kind ? <ProcessFigure kind={kind} onEnlarge={onEnlarge} /> : <RasterFigure src={src} alt={alt} active={open} onEnlarge={onEnlarge} />
        ) : null}
      </div>
    </div>
  );
}

function RasterFigure({ src, alt, active, onEnlarge }: { src: string; alt: string; active: boolean; onEnlarge: () => void }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!active) return;
    const image = imgRef.current;
    if (image && image.complete && image.naturalWidth > 0) {
      setStatus('ready');
      setShowLoader(false);
      return;
    }
    if (image && image.complete && image.naturalWidth === 0) {
      setStatus('error');
      setShowLoader(false);
      return;
    }
    setStatus('loading');
    setShowLoader(false);
    const timer = window.setTimeout(() => setShowLoader(true), LOADER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, src]);

  if (status === 'error') {
    return <p className="figure-error" role="alert">This figure could not be loaded.</p>;
  }

  return (
    <button className="figure-preview" type="button" onClick={() => { if (status === 'ready') onEnlarge(); }}>
      <span className="figure-frame">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => { setStatus('ready'); setShowLoader(false); }}
          onError={() => { setStatus('error'); setShowLoader(false); }}
        />
        {showLoader && status === 'loading' ? (
          <span className="figure-loader" role="status">
            <i aria-hidden="true" />
            <span className="visually-hidden">Loading figure</span>
          </span>
        ) : null}
      </span>
      <span className="figure-badge">Click to enlarge</span>
    </button>
  );
}
