import "../app.css";
import { mount } from "svelte";
import GithubPrFilter from "@/entrypoints/content/GithubPRFilter.svelte";
import { logger } from "@/lib/utils/logger";

export default defineContentScript({
  matches: ["https://github.com/*/*/pulls*"],
  main() {
    logger.info("GitHub PR Filters Content Script activated");

    // Create a container for our component
    const container = document.createElement("div");
    container.id = "github-pr-filters-container";
    document.body.appendChild(container);

    // Mount the Svelte component
    mount(GithubPrFilter, {
      target: container,
    });
  },
});
