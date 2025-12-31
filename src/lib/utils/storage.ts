import type { PRFilter } from "@/lib/types/filter";
import { STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";

/**
 * Load filters from browser.storage.sync
 */
export async function loadFilters(): Promise<PRFilter[]> {
    try {
        const data = await browser.storage.sync.get(STORAGE_KEYS.PR_FILTERS);
        return (data[STORAGE_KEYS.PR_FILTERS] || []) as PRFilter[];
    } catch (err) {
        logger.error("Failed to load filters from storage", err);
        return [];
    }
}

/**
 * Save filters to browser.storage.sync
 */
export async function saveFilters(filters: PRFilter[]): Promise<void> {
    try {
        await browser.storage.sync.set({ [STORAGE_KEYS.PR_FILTERS]: filters });
    } catch (err) {
        logger.error("Failed to save filters to storage", err);
        throw err;
    }
}
