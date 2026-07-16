import { useState } from 'react';
import type { ResearchItem } from '../types';
import { ExternalLink } from './ExternalLink';

export function ResearchCard({ item, onOpenFigure, openFigureId, onToggleFigure }: { item: ResearchItem; onOpenFigure: (src: string, alt: string, trigger: HTMLButtonElement) => void; openFigureId?: string | null; onToggleFigure?: (id: string) => void }) {
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = openFigureId === undefined ? localExpanded : openFigureId === item.id;
  const buttonRef = { current: null as HTMLButtonElement | null };
  return <article className={`research-card ${expanded ? 'is-open' : ''}`}>
    <div className="card-top"><span className="eyebrow">{item.type}</span><span className="card-date">{item.lastModified ? new Date(item.lastModified).getFullYear() : '—'}</span></div>
    <h3><ExternalLink href={item.url}>{item.name}</ExternalLink></h3>
    <p>{item.description ? item.description.replace(/[`*_]/g, '').slice(0, 220) : 'Public repository with metadata available in the synchronized Hub snapshot.'}</p>
    <div className="card-meta"><span>{item.theme}</span>{item.pipelineTag ? <span>{item.pipelineTag}</span> : null}</div>
    <div className="card-footer">
      {item.downloads ? <span>{item.downloads.toLocaleString()} downloads</span> : <span>{item.status ?? 'Public repository'}</span>}
      {item.likes ? <span>{item.likes} likes</span> : null}
      {item.figure ? <button ref={(node) => { buttonRef.current = node; }} className="figure-button" type="button" aria-expanded={expanded} onClick={() => onToggleFigure ? onToggleFigure(item.id) : setLocalExpanded((value) => !value)}>{expanded ? 'Hide figure' : 'Show figure'} <span aria-hidden="true">⌄</span></button> : null}
    </div>
    {item.status ? <div className="status-note">{item.status}</div> : null}
    {item.figure && expanded ? <button className="figure-preview" type="button" onClick={() => buttonRef.current && onOpenFigure(item.figure as string, `${item.name} research illustration`, buttonRef.current)}><img src={item.figure} alt={`${item.name} research illustration`} /><span>Click to enlarge</span></button> : null}
  </article>;
}
