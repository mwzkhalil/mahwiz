import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders Mahwiz identity and verified links on home', () => {
  render(<App />);
  expect(screen.getAllByText('Muhammad Mahwiz Khalil').length).toBeGreaterThan(0);
  expect(screen.getByRole('link', { name: /view cv/i })).toHaveAttribute('href', '/CV.pdf');
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('rel', expect.stringContaining('noopener'));
  expect(screen.queryByText(/\+923330214897/)).not.toBeInTheDocument();
  expect(screen.queryByText(/khalilmahwiz@gmail.com/)).not.toBeInTheDocument();
});

test('navigates to Research and filters records', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: 'Research' }));
  expect(screen.getByRole('heading', { name: /models, datasets/i })).toBeInTheDocument();
  const search = screen.getByPlaceholderText(/search the archive/i);
  fireEvent.change(search, { target: { value: 'lafzyn' } });
  expect(screen.getAllByText('lafzyn').length).toBeGreaterThan(0);
  expect(screen.queryByText('whispLM-600m')).not.toBeInTheDocument();
});

test('shows honest grants empty state', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: 'Grants' }));
  expect(screen.getByText('Funding information has not been added yet.')).toBeInTheDocument();
});
