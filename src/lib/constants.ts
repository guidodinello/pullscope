export const STORAGE_KEYS = {
    PR_FILTERS: "prFilters",
} as const;

export const GITHUB_PATTERNS = {
    PR_PAGE_REGEX: /^https:\/\/github\.com\/[^/]+\/[^/]+\/pulls(\/.*|\?.*)?$/,
    PR_PAGE_QUERY: "*://github.com/*/*/pulls*",
    PR_PAGE_PARTIAL: "github.com",
    PR_PATH_PARTIAL: "/pulls",
} as const;

export const MESSAGE_ACTIONS = {
    APPLY_FILTERS: "applyFilters",
    APPLY_FILTERS_NOW: "applyFiltersNow",
    TOGGLE_FILTER: "toggleFilter",
} as const;

export const TOAST_DURATION = {
    SHORT: 2000,
    DEFAULT: 3000,
    LONG: 5000,
} as const;

export const WAIT_TIMEOUTS = {
    INITIAL_LOAD: 5000,
    FILTER_TOGGLE: 2000,
    DEFAULT: 5000,
} as const;

export const DEBOUNCE_DELAYS = {
    URL_CHANGE: 500,
} as const;

export const VALIDATION = {
    FILTER_NAME_MAX_LENGTH: 50,
} as const;

export const CONTEXT_MENU_IDS = {
    APPLY_PR_FILTERS: "apply-pr-filters",
} as const;
