import { getFilters, saveFilters } from "@/lib/storage";
import type { PRFilter } from "@/lib/types/filter";
import { logger } from "@/lib/utils/logger";

export default defineBackground(() => {
  logger.info("GitHub PR Filters background script initialized");

  // Set up default filters if none exist
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      // Check if we already have filters
      const existingFilters = await getFilters();

      if (existingFilters.length === 0) {
        // Add some default filters as examples
        const defaultFilters: PRFilter[] = [
          {
            id: crypto.randomUUID(),
            name: "Hide Dependabot PRs",
            value: "-author:app/dependabot",
            enabled: true,
          },
          {
            id: crypto.randomUUID(),
            name: "Only Open PRs",
            value: "is:open",
            enabled: true,
          },
        ];

        await saveFilters(defaultFilters);
        logger.info("Default filters installed");
      }

      // Open options page on install to configure filters
      browser.tabs.create({
        url: browser.runtime.getURL("/options.html"),
      });
    }
  });

  // Listen for commands from browser action
  browser.runtime.onMessage.addListener(
    async (message, _sender): Promise<{ success: boolean; message?: string } | undefined> => {
      if (message.action === "applyFilters") {
        // Get the current active tab
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        const currentTab = tabs[0];

        if (currentTab?.id) {
          // Check if the tab URL is a GitHub PR page
          if (currentTab.url?.includes("github.com") && currentTab.url?.includes("/pulls")) {
            // Send message to content script to apply filters
            try {
              await browser.tabs.sendMessage(currentTab.id, {
                action: "applyFiltersNow",
              });
              return { success: true };
            } catch (err) {
              logger.error("Failed to send message to tab", err);
              return {
                success: false,
                message: "Failed to communicate with page",
              };
            }
          }
        }

        return { success: false, message: "Not a GitHub PR page" };
      }

      // Return undefined for unhandled messages
      return undefined;
    }
  );

  // Add context menu for quickly applying filters
  browser.contextMenus?.create({
    id: "apply-pr-filters",
    title: "Apply PR Filters",
    contexts: ["page"],
    documentUrlPatterns: ["*://github.com/*/*/pulls*"],
  });

  // Handle context menu clicks
  browser.contextMenus?.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "apply-pr-filters" && tab?.id) {
      browser.tabs.sendMessage(tab.id, { action: "applyFiltersNow" });
    }
  });
});
