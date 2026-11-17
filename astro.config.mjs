import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
    site: "https://mahwiz.me",
    trailingSlash: "never",
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport"
    },
    integrations: [tailwind()]
});
