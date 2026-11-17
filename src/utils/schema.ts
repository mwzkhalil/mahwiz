import { site } from "@data/site";

/** schema.org Person node describing the site owner. */
export const personSchema = (siteUrl: URL | undefined) => ({
    "@type": "Person",
    name: site.fullName,
    alternateName: site.shortName,
    jobTitle: site.role,
    url: siteUrl?.toString() ?? site.url,
    sameAs: [
        site.links.github,
        site.links.huggingFace,
        site.links.linkedin,
        site.links.x
    ]
});
