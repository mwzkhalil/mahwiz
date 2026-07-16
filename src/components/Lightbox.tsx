import { useEffect, useRef } from 'react';

export function Lightbox({ src, alt, onClose }: { src: string | null; alt: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!src) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); };
  }, [src, onClose]);
  if (!src) return null;
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label="Expanded research illustration" onClick={onClose}>
    <button ref={closeRef} className="lightbox-close" type="button" aria-label="Close illustration" onClick={onClose}>×</button>
    <img src={src} alt={alt} onClick={(event) => event.stopPropagation()} />
  </div>;
}
