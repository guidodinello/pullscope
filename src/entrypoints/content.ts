import "../app.css";
import { mount } from "svelte";
import GithubPrFilter from "@/entrypoints/content/GithubPRFilter.svelte";
import { logger } from "@/lib/utils/logger";
import { GITHUB_PATTERNS } from "@/lib/constants";

export default defineContentScript({
    matches: [GITHUB_PATTERNS.REPO_PAGE_PATTERN],
    main() {
        logger.info("GitHub PR Filters Content Script activated");

        try {
            const container = document.createElement("div");
            container.id = "github-pr-filters-container";
            document.body.appendChild(container);

            mount(GithubPrFilter, { target: container });
        } catch (err) {
            logger.error("Failed to mount GitHub PR Filters component:", err);
            const errorDiv = document.createElement("div");
            errorDiv.style.cssText =
                "position: fixed; top: 10px; right: 10px; background-color: #f44336; color: white; padding: 12px; border-radius: 4px; z-index: 9999;";
            errorDiv.textContent = "GitHub PR Filters failed to load. Please refresh the page.";
            document.body.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    },
});
