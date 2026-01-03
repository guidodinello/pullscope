import { logger } from "@/lib/utils/logger";
import { GITHUB_PATTERNS } from "@/lib/constants";

export const SELECTORS = {
    GITHUB_SEARCH: "#js-issues-search",
} as const;

export const isGitHubPRPage = (url: string): boolean => GITHUB_PATTERNS.PR_PAGE_REGEX.test(url);

export function getSearchInputElement(): HTMLInputElement | null {
    const element = document.querySelector<HTMLInputElement>(SELECTORS.GITHUB_SEARCH);
    if (!element) {
        logger.warn("Could not find GitHub search input element");
    }
    return element;
}

/**
 * Check if a filter is already present in the search value
 * Uses word boundary matching to avoid false positives
 */
function isFilterPresent(searchValue: string, filter: string): boolean {
    // Split both the search value and filter into tokens
    const searchTokens = searchValue.split(/\s+/).filter(Boolean);
    const filterTokens = filter.split(/\s+/).filter(Boolean);

    // Check if all filter tokens are present in search tokens
    return filterTokens.every((token) => searchTokens.includes(token));
}

function triggerSearch(searchInput: HTMLInputElement): void {
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));

    const form = searchInput.closest("form");
    if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        logger.debug("Triggered form submit");
    } else {
        // Fallback: trigger Enter key press
        searchInput.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
            })
        );
        logger.debug("Triggered Enter key press");
    }
}

/**
 * Add filters to the search input value
 * @returns Object with updated value and count of filters added
 */
function buildSearchValueWithFilters(
    currentValue: string,
    filterValues: string[]
): { value: string; count: number } {
    let value = currentValue.trim();
    let count = 0;

    filterValues.forEach((filter) => {
        if (!isFilterPresent(value, filter)) {
            if (value && !value.endsWith(" ")) {
                value += " ";
            }
            value += filter;
            count++;
        }
    });

    return { value, count };
}

export function applyFilters(filterValues: string[]): boolean {
    const searchInput = getSearchInputElement();
    if (!searchInput) {
        logger.error("Cannot apply filters: search input not found");
        return false;
    }

    const result = buildSearchValueWithFilters(searchInput.value || "", filterValues);

    if (result.count === 0) {
        logger.debug("All filters already present");
        return false;
    }

    searchInput.value = result.value;
    triggerSearch(searchInput);

    logger.info(`Applied ${result.count} filter(s)`);
    return true;
}

export function addFilter(filterValue: string): boolean {
    const searchInput = getSearchInputElement();
    if (!searchInput) {
        logger.error("Cannot add filter: search input not found");
        return false;
    }

    const result = buildSearchValueWithFilters(searchInput.value || "", [filterValue]);

    if (result.count === 0) {
        logger.debug(`Filter already present: ${filterValue}`);
        return false;
    }

    searchInput.value = result.value;
    triggerSearch(searchInput);

    logger.info(`Added filter: ${filterValue}`);
    return true;
}

/**
 * Remove a specific filter from the GitHub PR search input
 * @param filterValue The filter string to remove
 */
export function removeFilter(filterValue: string): boolean {
    const searchInput = getSearchInputElement();
    if (!searchInput) {
        logger.error("Cannot remove filter: search input not found");
        return false;
    }

    const currentValue = searchInput.value || "";
    const filterTokens = filterValue.split(/\s+/).filter(Boolean);

    // Split current value into tokens
    let tokens = currentValue.split(/\s+/).filter(Boolean);

    // Remove all tokens that are part of the filter
    tokens = tokens.filter((token) => !filterTokens.includes(token));

    // Reconstruct the search value
    const newValue = tokens.join(" ");

    if (newValue === currentValue) {
        logger.debug(`Filter not present: ${filterValue}`);
        return false;
    }

    searchInput.value = newValue;

    triggerSearch(searchInput);

    logger.info(`Removed filter: ${filterValue}`);
    return true;
}
