import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const staticRoutes = [
    "/",
    "/projects",
    "/skills",
    "/experience",
    "/education",
    "/certifications",
    "/blog"
];

const toUrlEntry = (origin: string, path: string, lastmod?: string) => {
    const lines = [
        "  <url>",
        `    <loc>${origin}${path}</loc>`
    ];

    if (lastmod) {
        lines.push(`    <lastmod>${lastmod}</lastmod>`);
    }

    lines.push("  </url>");
    return lines.join("\n");
};

export const GET: APIRoute = async ({ site }) => {
    const origin = site?.origin ?? "https://mahwiz.me";
    const [projects, posts] = await Promise.all([
        getCollection("projects"),
        getCollection("posts")
    ]);

    const urls = [
        ...staticRoutes.map((path) => toUrlEntry(origin, path)),
        ...projects.map((project) =>
            toUrlEntry(
                origin,
                `/projects/${project.id}`,
                project.data.createdAt.toISOString().split("T")[0]
            )
        ),
        ...posts.map((post) =>
            toUrlEntry(
                origin,
                `/blog/${post.id}`,
                (post.data.updatedAt ?? post.data.createdAt).toISOString().split("T")[0]
            )
        )
    ];

    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        "</urlset>"
    ].join("\n");

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8"
        }
    });
};
