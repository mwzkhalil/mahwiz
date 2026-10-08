# Verification — 7 October 2026

## Completed

- `npm ci --no-audit --no-fund`: successful, using the supplied lockfile.
- `npm run build`: successful after the final changes, including locally bundled fonts.
- React interaction suite: **9 passed**, covering navigation, five-project curation, category filters, project-to-demo selection/focus, opt-in embeds, single-frame mounting, timeout/reload/close/direct-link fallbacks, keyboard tabs, and honest Avey-B usage.
- Chromium rendering: all five routes checked at **1440, 768, 390, and 320 pixels**. No page-level JavaScript errors or horizontal document overflow observed in those 20 route/viewport combinations.
- Desktop and mobile Research screenshots and desktop Home screenshot visually reviewed. Missing Urdu glyphs identified in the first pass were fixed by bundling Noto Nastaliq Urdu. DM Sans and Newsreader are also bundled. Font licenses are included with the source.
- Official Hugging Face API confirmed the three configured Space host URLs. Cadenza and Qalb-DPO exposed valid Gradio configurations at the time of checking.

## Scope and limits

- Live generation was **not verified end to end** inside the browser here. Cross-origin Space content did not become available during the browser checks. Lafzyn's configuration request timed out, and its Hub status was sleeping when checked. This is not a claim that the Spaces are currently unavailable for other visitors.
- The portfolio includes the actual Space iframe integrations, not simulated results. Their availability, generated outputs, audio playback, third-party login, and GPU quotas depend on Hugging Face and the owner-operated Spaces.
- iframe `load` is not treated as proof of model readiness. The UI keeps a direct Space link and reload/close controls available.
- Avey-B Urdu is an encoder. Its masked-token code example is included, but no weights were downloaded or executed during this website update.
- No production deployment or mahwiz.me change was made.
- The existing Create React App toolchain was retained. Its build emits legacy dependency/Browserslist notices, but compilation succeeds.

## Included previews

- `previews/research-desktop.png`
- `previews/research-mobile.png`
- `previews/home-desktop.png`

These are screenshots of the compiled site, not design mockups.
