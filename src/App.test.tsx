import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  window.scrollTo = jest.fn();
  HTMLElement.prototype.scrollIntoView = jest.fn();
});

function research() {
  window.history.replaceState({}, '', '/publications');
  return render(<App />);
}

test('home exposes readable social links and research navigation without blocking intro', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /view cv/i })).toHaveAttribute('href', '/CV.pdf');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: /explore the research/i }));
  expect(screen.getByRole('heading', { name: /the work/i })).toBeInTheDocument();
});

test('Research contains only the five selected projects and model-card qualifications', () => {
  research();
  expect(screen.getAllByRole('article')).toHaveLength(5);
  for (const name of ['Cadenza', 'Qalb-DPO', 'Avey-B Urdu', 'Lafzyn', 'Aegis for Piper']) {
    expect(screen.getByRole('heading', { name, exact: true })).toBeInTheDocument();
  }
  for (const old of ['skyloom', 'whispLM-600m', 'de-identify', 'urdu-208h']) {
    expect(screen.queryByText(new RegExp(old, 'i'))).not.toBeInTheDocument();
  }
  expect(screen.getByText(/not an independent replication/i)).toBeInTheDocument();
  expect(screen.getByText(/not a held-out evaluation/i)).toBeInTheDocument();
});

test('category filters work and can restore the full curated selection', () => {
  research();
  fireEvent.click(screen.getByRole('button', { name: 'Language models', exact: true }));
  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.queryByRole('heading', { name: 'Cadenza', exact: true })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open source', exact: true }));
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('link', { name: /view contribution/i })).toHaveAttribute('href', 'https://huggingface.co/rhasspy/piper-voices/discussions/89');
  fireEvent.click(screen.getByRole('button', { name: 'All work' }));
  expect(screen.getAllByRole('article')).toHaveLength(5);
});

test('project CTA selects its demo and moves focus to the playground', () => {
  research();
  fireEvent.click(screen.getByRole('button', { name: /try qalb-dpo/i }));
  expect(screen.getByRole('tab', { name: /qalb-dpo/i })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('heading', { name: /the playground/i })).toHaveFocus();
  expect(screen.getByRole('button', { name: /load qalb-dpo demo/i })).toBeInTheDocument();
});

test('embeds are opt-in, use verified Space hosts, and unmount when switching demos', () => {
  const { container } = research();
  expect(container.querySelectorAll('iframe')).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: /load cadenza demo/i }));
  const frame = screen.getByTitle('Cadenza interactive demo');
  expect(frame).toHaveAttribute('src', 'https://mahwizzzz-cadenza-tts.hf.space/?__theme=light');
  fireEvent.load(frame);
  expect(screen.getByText(/Space embedded/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab', { name: /lafzyn/i }));
  expect(container.querySelectorAll('iframe')).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: /load lafzyn demo/i }));
  expect(screen.getByTitle('Lafzyn interactive demo')).toHaveAttribute('src', 'https://mahwizzzz-lafzyn.hf.space/?__theme=light');
  expect(container.querySelectorAll('iframe')).toHaveLength(1);
});

test('slow demo has usable reload, close, and direct-link fallbacks', () => {
  jest.useFakeTimers();
  research();
  fireEvent.click(screen.getByRole('button', { name: /load cadenza demo/i }));
  const firstFrame = screen.getByTitle('Cadenza interactive demo');
  act(() => { jest.advanceTimersByTime(20000); });
  expect(screen.getByText(/taking longer than expected/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /reload demo/i }));
  expect(screen.getByTitle('Cadenza interactive demo')).not.toBe(firstFrame);
  expect(screen.getByRole('link', { name: /open on hugging face/i })).toHaveAttribute('href', 'https://huggingface.co/spaces/mahwizzzz/cadenza-tts');
  fireEvent.click(screen.getByRole('button', { name: /close demo/i }));
  expect(screen.queryByTitle('Cadenza interactive demo')).not.toBeInTheDocument();
  jest.useRealTimers();
});

test('demo tabs support keyboard navigation and roving focus', () => {
  research();
  fireEvent.keyDown(screen.getByRole('tab', { name: /cadenza/i }), { key: 'ArrowRight' });
  const qalb = screen.getByRole('tab', { name: /qalb-dpo/i });
  expect(qalb).toHaveFocus();
  expect(qalb).toHaveAttribute('aria-selected', 'true');
  fireEvent.keyDown(qalb, { key: 'End' });
  expect(screen.getByRole('tab', { name: /lafzyn/i })).toHaveFocus();
  fireEvent.keyDown(screen.getByRole('tab', { name: /lafzyn/i }), { key: 'Home' });
  expect(screen.getByRole('tab', { name: /cadenza/i })).toHaveFocus();
});

test('Avey-B offers real local usage and makes no fabricated hosted inference claim', () => {
  research();
  const article = screen.getByRole('heading', { name: 'Avey-B Urdu' }).closest('article')!;
  expect(within(article).queryByRole('button', { name: /try/i })).not.toBeInTheDocument();
  expect(within(article).getByText(/No hosted demo is configured/i)).toBeInTheDocument();
  expect(within(article).getByText(/AutoModelForMaskedLM/, { selector: 'code' })).toBeInTheDocument();
});

test('experience and grants routes remain available', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: 'Experience', exact: true }));
  expect(screen.getByRole('heading', { name: /engineering and research work/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Grants', exact: true }));
  expect(screen.getByText('Funding information has not been added yet.')).toBeInTheDocument();
});
