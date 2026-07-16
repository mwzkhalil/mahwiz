# Portfolio data sources

The site is designed to build from local snapshots. Visitors do not make live Hugging Face API requests.

## Hugging Face

Run:

```bash
npm run sync:hf
```

The synchronizer uses public official Hugging Face API and raw repository-card endpoints for `mahwizzzz`. It follows API pagination, applies timeouts and transient retries, normalizes and sorts repository records, and writes snapshots atomically to `src/data/generated/`. It does not require a token and does not download model weights or datasets.

If a core inventory request fails, the command exits with an error and preserves the last generated snapshots. Individual missing or malformed cards are recorded as warnings without failing the entire sync.

The public posts endpoint currently does not provide a working author filter. The writing snapshot therefore remains empty rather than importing the global feed and misattributing posts.

## Portfolio CSV

Place the authoritative CSV at `data/portfolio.csv`, or pass an explicit path:

```bash
npm run import:csv -- /absolute/path/to/portfolio.csv
```

The importer writes `src/data/generated/portfolio.json`, reports malformed rows and unknown/private-looking columns, and preserves the previous valid snapshot when parsing or writing fails.

Do not place credentials, private contact details, or secrets in generated public data.
