import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePrefersReducedMotion } from '../motion';

const VIDEO_ID = 'CYduwWHORSA';
const SEEN_KEY = 'mahwiz-intro-seen';

type Player = { destroy: () => void };

type PlayerStateEvent = { data: number };

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: {
        videoId: string;
        playerVars: Record<string, string | number>;
        events: { onStateChange: (event: PlayerStateEvent) => void };
      }) => Player;
      PlayerState: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function alreadySeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function IntroVideo() {
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(() => !alreadySeen());
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    setClosing((current) => {
      if (current) return current;
      try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* private browsing */ }
      return true;
    });
  }, []);

  useEffect(() => {
    if (!closing) return;
    const reducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setOpen(false), reducedMotion ? 0 : 180);
    return () => window.clearTimeout(timer);
  }, [closing]);

  useEffect(() => {
    if (!open || closing) return;
    skipRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closing, close]);

  useEffect(() => {
    if (!open || closing) return;
    const frame = frameRef.current;
    if (!frame) return;
    let player: Player | undefined;
    let cancelled = false;

    const mount = () => {
      if (cancelled || !frame || !window.YT?.Player) return;
      player = new window.YT.Player(frame, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: reduced || document.hidden ? 0 : 1,
          mute: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event) => {
            if (window.YT && event.data === window.YT.PlayerState.ENDED) close();
          },
        },
      });
    };

    if (window.YT?.Player) {
      mount();
    } else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        mount();
      };
      if (!document.querySelector('script[data-youtube-api]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.dataset.youtubeApi = 'true';
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, [open, closing, reduced, close]);

  if (!open) return null;

  return createPortal(
    <div className={`intro-video${closing ? ' is-closing' : ''}`} role="dialog" aria-modal="true" aria-label="Introduction video">
      <button ref={skipRef} className="intro-skip" type="button" onClick={close}>Skip intro</button>
      <div className="intro-stage">
        <div ref={frameRef} />
      </div>
    </div>,
    document.body,
  );
}
