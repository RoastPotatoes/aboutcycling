import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import solid from '@astrojs/solid-js';

export default defineConfig({
  site: "https://aboutcycling.xyz",
  integrations: [mdx(), sitemap(), tailwind(), solid()],
});
