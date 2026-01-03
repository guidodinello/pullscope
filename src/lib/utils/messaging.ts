import type { PRFilter } from "@/lib/types/filter";
import type { ToggleFilterMessage } from "@/lib/types/messages";
import { MESSAGE_ACTIONS, GITHUB_PATTERNS } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";

/**
 * Broadcast filter toggle to all GitHub PR tabs
 * This utility is shared between Popup and Options components
 */
export async function broadcastFilterToggle(filter: PRFilter): Promise<void> {
    try {
        const tabs = await browser.tabs.query({
            url: GITHUB_PATTERNS.PR_PAGE_QUERY,
        });

        const message = {
            action: MESSAGE_ACTIONS.TOGGLE_FILTER,
            filter,
        } satisfies ToggleFilterMessage;

        for (const tab of tabs) {
            if (tab.id) {
                try {
                    await browser.tabs.sendMessage(tab.id, message);
                } catch (err) {
                    // Silently ignore errors for individual tabs (e.g., content script not ready, tab closed)
                    logger.debug(`Failed to send message to tab ${tab.id}:`, err);
                }
            }
        }
    } catch (err) {
        logger.error("Failed to broadcast filter toggle:", err);
    }
}
