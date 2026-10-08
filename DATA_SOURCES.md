# Portfolio data sources

## Displayed Research content

`src/data/research.ts` is the explicit curated source of truth. It contains exactly five projects requested by the owner: Cadenza, Qalb-DPO, Avey-B Urdu, Lafzyn, and Aegis for Piper. Full-Hub generated snapshots are no longer imported by the frontend.

- Avey-B Urdu and Lafzyn: descriptions, architecture attribution, reported results, and limitations supplied by the owner from their model cards.
- Cadenza and Qalb-DPO: supplied Space links and official public Hugging Face metadata.
- Piper contribution: https://huggingface.co/rhasspy/piper-voices/discussions/89, whose discussion records the voice package and merge.
- The official Hub `/api/spaces/mahwizzzz/{space}` endpoint was used to confirm each embedded host on 7 October 2026.

Do not attach upstream paper benchmark claims to the Urdu adaptation, treat demo outputs as held-out evaluations, or show hard-coded uptime or popularity counts.

## Optional archive maintenance

The original `npm run sync:hf` and `npm run import:csv -- path/to/file.csv` scripts are retained. They update `src/data/generated/` only; these snapshots do not populate the curated Research page. No API credential is required for the public Hub sync. Do not put secrets or private contact information into public data files.
