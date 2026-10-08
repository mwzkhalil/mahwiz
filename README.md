# Mahwiz portfolio — Research redesign

A complete update of the supplied React + TypeScript portfolio. The existing `/publications` URL remains the Research page.

## Run locally

Install Node.js and npm, then from this folder:

```sh
npm ci
npm start
```

The development server opens at http://localhost:3000. Go to `/publications` for Research.

## Production

```sh
npm run build
```

The included `build/` directory is already compiled. Deploy its contents to a static host with an SPA fallback to `index.html`. The existing `vercel.json` retains that fallback for Vercel. To deploy from source, use `npm run build` and output directory `build`.

This delivery does not publish changes to mahwiz.me.

## What changed

- A curated Research page containing only Cadenza, Qalb-DPO, Avey-B Urdu, Lafzyn, and the Aegis contribution to Piper.
- An embedded playground for Cadenza, Qalb-DPO, and Lafzyn, with keyboard-accessible tabs, explicit loading, direct Hugging Face links, reload, close, and slow-load guidance.
- Project filters, expandable research notes, links to model cards and contribution details, and a copyable Avey-B Python inference example.
- Self-hosted DM Sans, Newsreader, and Noto Nastaliq Urdu fonts, including their licenses.
- New responsive visual system: off-white surfaces, forest-green accents, editorial typography, Urdu typography, and code-drawn project artwork.
- Updated homepage, masthead, navigation, readable social links, About and Experience headings, focus states, and reduced-motion support.
- The automatic blocking YouTube intro has been removed from the app.

## Inference behavior

The playground embeds the actual public Hugging Face Spaces. Users enter text, generate audio, or compare responses inside those embedded apps. This portfolio is a static frontend: no models, API tokens, server proxy, or fake inference results are bundled.

Space hosts were checked against the official Hub API on 7 October 2026:

- Cadenza: https://mahwizzzz-cadenza-tts.hf.space
- Qalb-DPO: https://mahwizzzz-qalb-dpo.hf.space
- Lafzyn: https://mahwizzzz-lafzyn.hf.space

Only one Space is mounted at a time. Switching demos closes the previous session and may discard its on-screen state; it does not promise to cancel already submitted upstream work. Each Space must remain public or protected and operational. Startup time, GPU quotas, authentication, and generation failures are controlled by the hosted Space. A frame load is never presented as proof that its inference backend is ready.

Avey-B Urdu has no supplied hosted endpoint. Its card provides real Python masked-token inference code instead of pretending to run the model in the browser. The Piper card links to the upstream contribution and voice repository; it does not invent a separate Space.

If a Space is renamed or moved, update `embedUrl` and `spaceUrl` in `src/data/research.ts` using the `host` returned by the Hugging Face Spaces API. Embedding reference: https://huggingface.co/docs/hub/spaces-embed.

## Content and attribution

Edit the five projects and demo URLs in `src/data/research.ts`. The new page does not import the old generated Hugging Face archive. `sync:hf` and CSV import scripts remain available for maintenance, but running them will not add projects to Research.

Avey-B and Lafzyn descriptions and reported metrics come from the supplied model cards. They preserve upstream attribution and evaluation limitations. Piper PR #89 is linked as the primary contribution record. Qalb's interactive comparison is not advertised as a benchmark.

## Checks

```sh
CI=true npm test -- --watchAll=false --runInBand
```

On Windows PowerShell:

```powershell
$env:CI = 'true'
npm test -- --watchAll=false --runInBand
```

See `VERIFICATION.md` for the completed checks and their limits.
