import "../app.css";
import { mount } from "svelte";
import GithubPrFilter from "@/entrypoints/content/GithubPRFilter.svelte";
import { logger } from "@/lib/utils/logger";
import { GITHUB_PATTERNS } from "@/lib/constants";

export default defineContentScript({
    matches: [GITHUB_PATTERNS.REPO_PAGE_PATTERN],
    main() {
        logger.info("GitHub PR Filters Content Script activated");

        const container = document.createElement("div");
        container.id = "github-pr-filters-container";
        document.body.appendChild(container);

        mount(GithubPrFilter, { target: container });
    },
});
