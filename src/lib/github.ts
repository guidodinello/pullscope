import { logger } from "./utils/logger";
import { GITHUB_PATTERNS } from "./constants";

/**
 * Common GitHub search input selectors
 * Ordered by priority (most specific to most general)
 */
const SEARCH_INPUT_SELECTORS = [
  "#js-issues-search", // Primary selector
  'input[name="q"]', // Fallback selector
  'input[aria-label*="Search"]', // Aria-based fallback
] as const;

/**
 * Check if the current URL is a GitHub pull requests page
 */
export function isGitHubPRPage(url: string): boolean {
  return GITHUB_PATTERNS.PR_PAGE_REGEX.test(url);
}

/**
 * Extract repository owner and name from GitHub URL
 */
export function extractRepoInfo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2],
  };
}

/**
 * Get the search input element from GitHub PR page
 * Tries multiple selectors for robustness
 */
export function getSearchInputElement(): HTMLInputElement | null {
  for (const selector of SEARCH_INPUT_SELECTORS) {
    const element = document.querySelector(selector) as HTMLInputElement;
    if (element) {
      logger.debug(`Found search input with selector: ${selector}`);
      return element;
    }
  }

  logger.warn("Could not find GitHub search input element");
  return null;
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

/**
 * Trigger GitHub's search by submitting the form
 */
function triggerSearch(searchInput: HTMLInputElement): void {
  // Dispatch input event
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));

  // Find and submit the form
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
 * Apply filters to GitHub PR search input
 * @param filters Array of filter strings to apply
 */
export function applyFilters(filterValues: string[]): boolean {
  const searchInput = getSearchInputElement();
  if (!searchInput) {
    logger.error("Cannot apply filters: search input not found");
    return false;
  }

  // Get current value and parse it
  let currentValue = searchInput.value || "";
  logger.debug("Current search value:", currentValue);

  let filtersAdded = 0;

  // Add each filter if it's not already present
  filterValues.forEach((filter) => {
    if (!isFilterPresent(currentValue, filter)) {
      // Add space if there's already content
      if (currentValue && !currentValue.endsWith(" ")) {
        currentValue += " ";
      }
      currentValue += filter;
      filtersAdded++;
      logger.debug(`Added filter: ${filter}`);
    } else {
      logger.debug(`Filter already present: ${filter}`);
    }
  });

  if (filtersAdded === 0) {
    logger.info("No new filters to apply");
    return false;
  }

  // Update the input value
  searchInput.value = currentValue;

  // Trigger GitHub's search
  triggerSearch(searchInput);

  logger.info(`Applied ${filtersAdded} filter(s)`);
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

  // Trigger GitHub's search
  triggerSearch(searchInput);

  logger.info(`Removed filter: ${filterValue}`);
  return true;
}

/**
 * Add a single filter to the GitHub PR search input
 * @param filterValue The filter string to add
 */
export function addFilter(filterValue: string): boolean {
  const searchInput = getSearchInputElement();
  if (!searchInput) {
    logger.error("Cannot add filter: search input not found");
    return false;
  }

  let currentValue = searchInput.value || "";

  if (isFilterPresent(currentValue, filterValue)) {
    logger.debug(`Filter already present: ${filterValue}`);
    return false;
  }

  // Add space if there's already content
  if (currentValue && !currentValue.endsWith(" ")) {
    currentValue += " ";
  }
  currentValue += filterValue;

  searchInput.value = currentValue;

  // Trigger GitHub's search
  triggerSearch(searchInput);

  logger.info(`Added filter: ${filterValue}`);
  return true;
}
