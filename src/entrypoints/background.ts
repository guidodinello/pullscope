import type { PRFilter, NewPRFilter } from "@/lib/types/filter";
import type {
    ExtensionMessage,
    MessageResponse,
    ApplyFiltersNowMessage,
} from "@/lib/types/messages";
import { MESSAGE_ACTIONS, GITHUB_PATTERNS, CONTEXT_MENU_IDS } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";
import { loadFilters, saveFilters } from "@/lib/utils/storage";

const DEFAULT_FILTERS = [
    {
        name: "Is a PR",
        value: "is:pr",
        enabled: true,
    },
    {
        name: "Only Open PRs",
        value: "is:open",
        enabled: true,
    },
    {
        name: "Hide Dependabot PRs",
        value: "-author:app/dependabot",
        enabled: false,
    },
    {
        name: "Assigned to Me",
        value: "assignee:@me",
        enabled: false,
    },
    {
        name: "Created by Me",
        value: "author:@me",
        enabled: false,
    },
    {
        name: "Review Requested from Me",
        value: "review-requested:@me",
        enabled: false,
    },
] satisfies NewPRFilter[];

export default defineBackground(() => {
    logger.info("GitHub PR Filters background script initialized");

    // Set up default filters if none exist
    browser.runtime.onInstalled.addListener(async (details) => {
        if (details.reason === "install") {
            // Check if we already have filters
            const existingFilters = await loadFilters();

            if (existingFilters.length === 0) {
                // Add IDs to default filters and save
                const filtersWithIds: PRFilter[] = DEFAULT_FILTERS.map((filter) => ({
                    ...filter,
                    id: crypto.randomUUID(),
                }));
                await saveFilters(filtersWithIds);
                logger.info("Default filters installed");
            }

            browser.tabs.create({
                url: browser.runtime.getURL("/options.html"),
            });
        }
    });

    // Listen for commands from browser action
    browser.runtime.onMessage.addListener(
        async (message: ExtensionMessage, _sender): Promise<MessageResponse | undefined> => {
            if (message.action === MESSAGE_ACTIONS.APPLY_FILTERS) {
                const tabs = await browser.tabs.query({
                    active: true,
                    currentWindow: true,
                });
                const currentTab = tabs[0];

                if (currentTab?.id) {
                    // Check if the tab URL is a GitHub PR page
                    if (
                        currentTab.url?.includes(GITHUB_PATTERNS.PR_PAGE_PARTIAL) &&
                        currentTab.url?.includes(GITHUB_PATTERNS.PR_PATH_PARTIAL)
                    ) {
                        // Send message to content script to apply filters
                        try {
                            await browser.tabs.sendMessage(currentTab.id, {
                                action: MESSAGE_ACTIONS.APPLY_FILTERS_NOW,
                            } satisfies ApplyFiltersNowMessage);
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

            return undefined;
        }
    );

    // Add context menu for quickly applying filters
    browser.contextMenus?.create({
        id: CONTEXT_MENU_IDS.APPLY_PR_FILTERS,
        title: "Apply PR Filters",
        contexts: ["page"],
        documentUrlPatterns: [GITHUB_PATTERNS.PR_PAGE_QUERY],
    });

    // Handle context menu clicks
    browser.contextMenus?.onClicked.addListener((info, tab) => {
        if (info.menuItemId === CONTEXT_MENU_IDS.APPLY_PR_FILTERS && tab?.id) {
            browser.tabs.sendMessage(tab.id, {
                action: MESSAGE_ACTIONS.APPLY_FILTERS_NOW,
            } satisfies ApplyFiltersNowMessage);
        }
    });
});
