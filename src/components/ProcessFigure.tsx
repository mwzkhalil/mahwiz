import { useEffect, useId, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../motion';

export type ProcessKind = 'speech' | 'privacy';

export function processKind(src?: string): ProcessKind | null {
  if (src === '/illustrations/speech-to-ipa.svg') return 'speech';
  if (src === '/illustrations/privacy-filtering.svg') return 'privacy';
  return null;
}

const stroke = {
  fill: 'none',
  stroke: '#3b2b23',
  strokeWidth: 5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function canAutoplay() {
  const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return !reduced && !document.hidden;
}

export function ProcessFigure({ kind, onEnlarge }: { kind: ProcessKind; onEnlarge: () => void }) {
  const reduced = usePrefersReducedMotion();
  const captionId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const replayLock = useRef(false);
  const [playing, setPlaying] = useState(canAutoplay);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced) {
      setPlaying(false);
      return;
    }
    if (playing || replayLock.current) return;
    const start = () => {
      if (!document.hidden && !replayLock.current) setPlaying(true);
    };
    document.addEventListener('visibilitychange', start);
    return () => document.removeEventListener('visibilitychange', start);
  }, [playing, reduced]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || reduced) return;
    let visible = true;
    const sync = () => setPaused(document.hidden || !visible);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(node);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [reduced]);

  const replay = () => {
    replayLock.current = true;
    setPlaying(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        replayLock.current = false;
        if (!document.hidden) setPlaying(true);
      });
    });
  };

  const caption = kind === 'speech'
    ? 'Conceptual illustration of a waveform traced into the next stage of the diagram. Not a measured signal.'
    : 'Conceptual illustration. Existing marks are highlighted, then covered by the redaction already drawn in the figure. Not a live privacy filter.';

  return (
    <>
      <button className="figure-preview" type="button" onClick={onEnlarge}>
        <div ref={rootRef} className={`process-figure${playing ? ' is-playing' : ''}${paused ? ' is-paused' : ''}`}>
          <p id={captionId} className="visually-hidden">{caption}</p>
          {kind === 'speech' ? <SpeechDrawing labelledBy={captionId} /> : <PrivacyDrawing labelledBy={captionId} />}
        </div>
        <span className="figure-badge">Click to enlarge</span>
      </button>
      {!reduced ? <button className="figure-replay" type="button" onClick={replay}>Play</button> : null}
    </>
  );
}

function SpeechDrawing({ labelledBy }: { labelledBy: string }) {
  return (
    <svg className="figure-drawing" viewBox="0 0 640 360" role="img" aria-labelledby={labelledBy}>
      <rect width="640" height="360" fill="#fbf8f0" />
      <g {...stroke}>
        <rect x="65" y="82" width="180" height="198" rx="8" fill="#d6bca5" />
        <path className="draw draw-wave" pathLength={1} d="M100 140q30-35 60 0t60 0" />
        <path className="draw draw-wave draw-wave-2" pathLength={1} d="M100 190q30-35 60 0t60 0" />
        <path className="draw draw-wave draw-wave-3" pathLength={1} d="M100 240q30-35 60 0t60 0" />
        <path className="draw draw-arrow" pathLength={1} d="M280 180h75M335 155l30 25-30 25" />
        <rect className="emphasize" x="395" y="82" width="180" height="198" rx="8" />
        <path className="draw draw-next" pathLength={1} d="M430 138q13-23 26 0t26 0" />
        <path className="draw draw-next" pathLength={1} d="M430 190q13-23 26 0t26 0" />
        <path className="draw draw-next" pathLength={1} d="M430 242q13-23 26 0t26 0" />
      </g>
    </svg>
  );
}

function PrivacyDrawing({ labelledBy }: { labelledBy: string }) {
  return (
    <svg className="figure-drawing" viewBox="0 0 640 360" role="img" aria-labelledby={labelledBy}>
      <rect width="640" height="360" fill="#fbf8f0" />
      <g {...stroke}>
        <path d="M90 72h200l35 35v190H90z" fill="#d6bca5" />
        <path d="M290 72v36h35" />
        <path className="entity-line" d="M122 142h145" />
        <path className="entity-line" d="M122 178h145" />
        <path d="M122 214h145" />
        <g className="shield-group">
          <path d="M430 93l92 35v76c0 68-92 96-92 96s-92-28-92-96v-76z" fill="#fbf8f0" />
          <path d="M385 198l31 31 56-63" />
        </g>
        <path className="draw redact" pathLength={1} d="M110 142h90M110 178h75" stroke="#7b5139" strokeWidth={12} />
      </g>
    </svg>
  );
}
