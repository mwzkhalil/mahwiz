import type { HubItem, ResearchItem } from '../types';
import models from './generated/huggingface-models.json';
import datasets from './generated/huggingface-datasets.json';
import spaces from './generated/huggingface-spaces.json';
import summary from './generated/huggingface-summary.json';

const featuredNames = new Set(['whispLM-600m', 'lafzyn', 'aurix-v1', 'deepspeak-v1', 'aegis', 'skyloom', 'piper-voice-ur-aegis-female', 'urdu-208h']);

function themeFor(item: HubItem): string {
  const text = `${item.name} ${item.description ?? ''} ${item.pipelineTag ?? ''} ${(item.tags ?? []).join(' ')}`.toLowerCase();
  if (text.includes('aqi') || text.includes('forecast') || text.includes('time series')) return 'Forecasting';
  if (text.includes('privacy') || text.includes('pii') || text.includes('ner')) return 'Privacy & extraction';
  if (text.includes('ocr') || text.includes('nastaliq')) return 'OCR & script';
  if (text.includes('ipa') || text.includes('phon') || text.includes('g2p')) return 'Speech & phonetics';
  if (text.includes('speech') || text.includes('tts') || text.includes('audio') || text.includes('whisper') || text.includes('wav2vec')) return 'Speech technology';
  if (text.includes('urdu') || text.includes('language model') || text.includes('text-generation') || text.includes('llm')) return 'Urdu language models';
  if (item.repoType === 'dataset') return 'Datasets & corpora';
  return 'Applied AI';
}

function statusFor(item: HubItem): string | undefined {
  const text = `${item.description ?? ''}`.toLowerCase();
  if (text.includes('not recommended for production')) return 'Not recommended for production';
  if (text.includes('active training')) return 'Active training';
  if (text.includes('experimental')) return 'Experimental';
  if (text.includes('self-reported')) return 'Model-card-reported evaluation';
  return undefined;
}

function makeItems(items: HubItem[], type: ResearchItem['type']): ResearchItem[] {
  return items.map((item) => ({ ...item, type, theme: themeFor(item), featured: featuredNames.has(item.name), status: statusFor(item), figure: figureFor(item.name) }));
}

function figureFor(name: string): string | undefined {
  if (name === 'skyloom') return '/illustrations/karachi-aqi-forecasting.svg';
  if (name === 'aegis' || name === 'de-identify') return '/illustrations/privacy-filtering.svg';
  if (name === 'lafzyn' || name === 'aurix-v1') return '/illustrations/speech-to-ipa.svg';
  if (name.includes('tts') || name.includes('TTS') || name === 'deepspeak-v1' || name === 'Dia-1.6B-Urdu') return '/illustrations/urdu-speech-synthesis.svg';
  if (name.includes('whisper') || name.includes('whispLM')) return '/illustrations/urdu-asr.svg';
  if (name.includes('urdu-208h') || name === '1DamnAudio' || name === 'UAT') return '/illustrations/urdu-datasets.svg';
  return undefined;
}

export const researchItems: ResearchItem[] = [
  ...makeItems(models.items as HubItem[], 'model'),
  ...makeItems(datasets.items as HubItem[], 'dataset'),
  ...makeItems(spaces.items as HubItem[], 'space'),
  {
    id: 'writing-aegis', name: 'Distilling OmniVoice into Aegis', repoType: 'writing', type: 'writing', url: 'https://huggingface.co/posts/mahwizzzz/129',
    description: 'Public Hugging Face article about a compact female Urdu TTS voice for CPU inference.', theme: 'Research writing', featured: true, figure: '/illustrations/research-writing.svg', tags: ['Urdu', 'TTS'],
  },
  {
    id: 'writing-lafzyn', name: 'Lafzyn release note', repoType: 'writing', type: 'writing', url: 'https://huggingface.co/posts/mahwizzzz/129',
    description: 'Public profile post announcing Lafzyn and its GGUF companion and demo.', theme: 'Research writing', featured: false, figure: '/illustrations/research-writing.svg', tags: ['IPA', 'Urdu'],
  },
];

export const hubSummary = summary.items[0] as { counts?: Record<string, number>; totals?: Record<string, number>; };
export const fetchedAt = summary.fetchedAt;

export const cvExperience = [
  { title: 'AI Engineer', org: 'Nova Tech', location: 'Dubai, UAE (Remote)', dates: 'June 2025 – Present', description: 'Developed an AI-agent cashflow management copilot; architected an intelligent trading bot; and led multi-agent portfolio and risk-management systems.' },
  { title: 'NLP Engineer', org: 'Proxima AI', location: 'Pakistan', dates: 'August 2023 – Present', description: 'Built Urdu speech-to-text and text-to-speech systems, chatbot infrastructure, image-generation pipelines, and deployment workflows.' },
  { title: 'Data Research Analyst', org: 'Technexia', location: 'Pakistan', dates: 'January 2023 – June 2023', description: 'Developed Python data-intelligence systems, web-scraping infrastructure, dashboards, and analytical reports.' },
];
