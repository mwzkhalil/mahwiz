import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';

const EXIT_MS = 140;

export function Lightbox({ src, alt, onClose, returnFocus }: { src: string | null; alt: string; onClose: () => void; returnFocus: RefObject<HTMLElement | null> }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [retained, setRetained] = useState<{ src: string; alt: string } | null>(null);
  const [closing, setClosing] = useState(false);
  const [shown, setShown] = useState(false);
  const [failed, setFailed] = useState(false);
  const view = useMemo(() => (src ? { src, alt } : retained), [src, alt, retained]);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (src) {
      setRetained({ src, alt });
      setClosing(false);
      setFailed(false);
      return;
    }
    setShown(false);
    setClosing(true);
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => {
      setRetained(null);
      setClosing(false);
    }, reduced ? 0 : EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [src, alt]);

  useEffect(() => {
    if (!view || closing) return;
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [view, closing]);

  useEffect(() => {
    if (!src) return;
    const root = document.getElementById('root');
    root?.setAttribute('inert', '');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const opener = returnFocus.current;
    return () => {
      root?.removeAttribute('inert');
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      opener?.focus({ preventScroll: true });
    };
  }, [src, returnFocus]);

  if (!view) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className={`lightbox${shown && !closing ? ' is-shown' : ''}${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Expanded research illustration"
      onClick={() => onCloseRef.current()}
    >
      <button ref={closeRef} className="lightbox-close" type="button" aria-label="Close illustration" onClick={(event) => { event.stopPropagation(); onCloseRef.current(); }}>
        ×
      </button>
      {failed ? (
        <p className="lightbox-fallback" onClick={(event) => event.stopPropagation()}>This figure could not be loaded.</p>
      ) : (
        <img src={view.src} alt={view.alt} onClick={(event) => event.stopPropagation()} onError={() => setFailed(true)} />
      )}
    </div>,
    document.body,
  );
}
