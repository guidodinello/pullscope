import type { PRFilter } from "../types/filter";
import type { ToggleFilterMessage } from "../types/messages";
import { MESSAGE_ACTIONS, GITHUB_PATTERNS } from "../constants";
import { logger } from "./logger";

/**
 * Broadcast filter toggle to all GitHub PR tabs
 * This utility is shared between Popup and Options components
 */
export async function broadcastFilterToggle(filter: PRFilter): Promise<void> {
  try {
    const tabs = await browser.tabs.query({
      url: GITHUB_PATTERNS.PR_PAGE_QUERY,
    });

    const message: ToggleFilterMessage = {
      action: MESSAGE_ACTIONS.TOGGLE_FILTER,
      filter,
    };

    for (const tab of tabs) {
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, message);
      }
    }
  } catch (err) {
    logger.error("Failed to broadcast filter toggle:", err);
  }
}
