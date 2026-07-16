#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const username = 'mahwizzzz';
const apiRoot = 'https://huggingface.co/api';
const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const generated = path.join(root, 'src', 'data', 'generated');
const timeoutMs = 20000;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchJson(url, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
      if (!response.ok) {
        if (![408, 425, 429, 500, 502, 503, 504].includes(response.status)) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        throw new Error(`transient ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt + 1 < attempts) await sleep(500 * 2 ** attempt);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`${url}: ${lastError?.message ?? 'unknown error'}`);
}

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, normalize(item)]));
  }
  return value ?? null;
}

function sortItems(items) {
  return [...new Map(items.filter(item => item && item.id).map(item => [item.id, normalize(item)])).values()]
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

async function list(kind) {
  const results = [];
  let page = 0;
  const limit = 100;
  while (true) {
    const query = new URLSearchParams({ author: username, limit: String(limit), offset: String(page * limit), full: 'true' });
    const batch = await fetchJson(`${apiRoot}/${kind}?${query}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    results.push(...batch);
    if (batch.length < limit) break;
    page += 1;
  }
  return sortItems(results);
}

async function writeSnapshot(filename, items, fetchedAt) {
  const payload = JSON.stringify({ fetchedAt, source: `${apiRoot}/${filename.replace('huggingface-', '').replace('.json', '')}`, username, items }, null, 2) + '\n';
  const target = path.join(generated, filename);
  const temp = `${target}.tmp-${process.pid}`;
  await fs.writeFile(temp, payload, 'utf8');
  await fs.rename(temp, target);
}

async function main() {
  await fs.mkdir(generated, { recursive: true });
  const fetchedAt = new Date().toISOString();
  const kinds = [['huggingface-models.json', 'models'], ['huggingface-datasets.json', 'datasets'], ['huggingface-spaces.json', 'spaces']];
  const summary = [];
  for (const [filename, kind] of kinds) {
    try {
      const items = await list(kind);
      await writeSnapshot(filename, items, fetchedAt);
      summary.push({ kind, count: items.length, status: 'ok' });
      console.log(`${kind}: ${items.length}`);
    } catch (error) {
      summary.push({ kind, count: null, status: 'error', error: error.message });
      console.error(`${kind}: ${error.message}`);
    }
  }
  await writeSnapshot('huggingface-summary.json', summary, fetchedAt);
  if (summary.some(item => item.status === 'error')) process.exitCode = 1;
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
