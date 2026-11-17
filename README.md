# mahwiz.me

Personal portfolio of **Muhammad Mahwiz Khalil**, a Python engineer and NLP/ML researcher working on Urdu speech, language models and production AI systems.

Live site: [mahwiz.me](https://mahwiz.me)

Built with [Astro 5](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), and deployed on Vercel.

## Getting started

Requires Node.js 18.20.8 or newer.

```sh
npm ci          # install dependencies
npm run dev     # start the dev server on http://localhost:4321
npm run build   # build the static site into dist/
npm run preview # serve the production build locally
```

## Project structure

```text
.
├── .github/workflows/    # CI: IndexNow submission after each deploy
├── public/               # Static files served as-is
│   ├── photos/           # Portrait and homepage photos
│   ├── images/projects/  # Images used by project pages
│   └── robots.txt
└── src/
    ├── components/
    │   ├── cards/        # List cards: projects, posts, experience, skills
    │   ├── content/      # Detail views and the table of contents
    │   ├── layout/       # <head>, navigation bar, logo
    │   └── sections/     # Homepage sections (photo grid)
    ├── content/          # Markdown collections (validated in content.config.ts)
    │   ├── experience/
    │   ├── posts/
    │   ├── projects/
    │   └── skills/
    ├── data/             # Typed data: site identity, education, certifications
    ├── layouts/          # BaseLayout, ListLayout, ContentLayout
    ├── pages/            # File-based routes and sitemap.xml
    ├── styles/           # global.css (Tailwind layers)
    ├── utils/            # Date formatting and schema.org helpers
    └── content.config.ts # Collection schemas
```

## Editing content

| What                                | Where                                    |
| ----------------------------------- | ---------------------------------------- |
| Name, bio, social links, page intros | `src/data/site.ts`                       |
| Education                           | `src/data/education.ts`                  |
| Licenses and certifications         | `src/data/certifications.ts`             |
| Projects                            | `src/content/projects/*.md`              |
| Experience                          | `src/content/experience/*.md`            |
| Skills                              | `src/content/skills/*.md`                |
| Blog posts                          | `src/content/posts/*.md`                 |
| Homepage photos and their layout    | `src/components/sections/ImageGrid.astro` |

Frontmatter for each collection is validated by the schemas in `src/content.config.ts`, so the build fails if a field is missing or has the wrong type.

## Import aliases

| Alias           | Path              |
| --------------- | ----------------- |
| `@components/*` | `src/components/*` |
| `@layouts/*`    | `src/layouts/*`    |
| `@data/*`       | `src/data/*`       |
| `@styles/*`     | `src/styles/*`     |
| `@utils/*`      | `src/utils/*`      |

## SEO

- The canonical origin is `site` in `astro.config.mjs`.
- `src/pages/sitemap.xml.ts` generates the sitemap from the static routes and the content collections.
- Every page gets Open Graph and Twitter tags, plus JSON-LD structured data, from `src/components/layout/Head.astro`.
- After each push to `master`, `.github/workflows/indexnow.yml` submits the sitemap URLs to IndexNow. The workflow's key must match the key file in `public/`.
