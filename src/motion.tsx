import { createContext, createElement, useContext, useEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react';

const STAGGER_MS = 45;
const STAGGER_CAP_MS = 135;
const BATCH_WINDOW_MS = 40;

let batchTime = 0;
let batchCount = 0;

export function resetRevealBatch() {
  batchTime = 0;
  batchCount = 0;
}

function nextRevealDelay() {
  const now = performance.now();
  if (now - batchTime > BATCH_WINDOW_MS) {
    batchTime = now;
    batchCount = 0;
  }
  const delay = Math.min(batchCount * STAGGER_MS, STAGGER_CAP_MS);
  batchCount += 1;
  return delay;
}

const ReducedMotionContext = createContext(false);

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      setReduced(query.matches);
      document.documentElement.dataset.motion = query.matches ? 'reduce' : 'full';
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return reduced;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionPreference();
  return <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>;
}

export function usePrefersReducedMotion() {
  return useContext(ReducedMotionContext);
}

type RevealVariant = 'card' | 'prose';

export function useReveal<T extends HTMLElement>(variant: RevealVariant) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<'wait' | 'show'>(reduced ? 'show' : 'wait');
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (reduced) {
      setState('show');
      return;
    }
    if (state === 'show') return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setState('show');
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      setDelay(nextRevealDelay());
      setState('show');
      observer.disconnect();
    }, { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, state]);

  return {
    ref,
    className: variant === 'card' ? 'reveal-card' : 'reveal-prose',
    'data-state': reduced ? 'show' as const : state,
    style: { '--reveal-delay': `${delay}ms` } as CSSProperties,
  };
}

export function Settle({ children }: { children: ReactElement<{ className?: string; style?: CSSProperties }> }) {
  const reveal = useReveal<HTMLElement>('prose');
  return createElement(children.type, {
    ...children.props,
    ref: reveal.ref,
    className: [reveal.className, children.props.className].filter(Boolean).join(' '),
    'data-state': reveal['data-state'],
    style: { ...children.props.style, ...reveal.style },
  });
}
