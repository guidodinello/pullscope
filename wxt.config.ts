import { defineConfig } from "wxt";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    name: "Pullscope",
    description: "Automatically apply custom filters to GitHub Pull Request pages",
    permissions: ["storage", "contextMenus", "tabs"],
    icons: {
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png",
      128: "icons/icon-128.png",
    },
    browser_specific_settings: {
      gecko: {
        id: "pullscope@guidodinello.dev",
        // Required by Firefox for all new extensions. This extension does not collect any user data
        // @ts-ignore
        data_collection_permissions: { required: ["none"] },
      },
    },
  },
  vite: () => ({
    plugins: [wasm(), topLevelAwait(), tailwindcss()],
  }),

  runner: {
    startUrls: ["https://github.com/facebook/react/pulls"],
  },
});
