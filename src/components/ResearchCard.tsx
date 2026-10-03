import { useRef } from 'react';
import type { ResearchItem } from '../types';
import { ExternalLink } from './ExternalLink';
import { FigureDisclosure } from './FigureDisclosure';
import { useReveal } from '../motion';

export function ResearchCard({ item, onOpenFigure, openFigureId, onToggleFigure }: { item: ResearchItem; onOpenFigure: (src: string, alt: string, trigger: HTMLButtonElement) => void; openFigureId?: string | null; onToggleFigure?: (id: string) => void }) {
  const reveal = useReveal<HTMLElement>('card');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const expanded = openFigureId === undefined ? false : openFigureId === item.id;
  const panelId = `figure-${item.id}`;
  const alt = `${item.name} research illustration`;

  return (
    <article ref={reveal.ref} className={`research-card ${reveal.className}${expanded ? ' is-open' : ''}`} data-state={reveal['data-state']} style={reveal.style}>
      <div className="research-card-face">
        <div className="card-top"><span className="eyebrow">{item.type}</span><span className="card-date">{item.lastModified ? new Date(item.lastModified).getFullYear() : '—'}</span></div>
        <h3><ExternalLink href={item.url}>{item.name}</ExternalLink></h3>
        <p>{item.description ? item.description.replace(/[`*_]/g, '').slice(0, 220) : 'Public repository with metadata available in the synchronized Hub snapshot.'}</p>
        <div className="card-meta"><span>{item.theme}</span>{item.pipelineTag ? <span>{item.pipelineTag}</span> : null}</div>
        <div className="card-footer">
          {item.downloads ? <span>{item.downloads.toLocaleString()} downloads</span> : <span>{item.status ?? 'Public repository'}</span>}
          {item.likes ? <span>{item.likes} likes</span> : null}
          {item.figure ? (
            <button
              ref={buttonRef}
              className="figure-button"
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => onToggleFigure?.(item.id)}
            >
              {expanded ? 'Hide figure' : 'Show figure'} <span aria-hidden="true">⌄</span>
            </button>
          ) : null}
        </div>
        {item.status ? <div className="status-note">{item.status}</div> : null}
        {item.figure ? (
          <FigureDisclosure
            id={panelId}
            src={item.figure}
            alt={alt}
            open={expanded}
            onEnlarge={() => { if (buttonRef.current) onOpenFigure(item.figure as string, alt, buttonRef.current); }}
          />
        ) : null}
      </div>
    </article>
  );
}
