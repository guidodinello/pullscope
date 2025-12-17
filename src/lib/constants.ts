export const STORAGE_KEYS = {
    PR_FILTERS: "pr_filters",
} as const;

export const GITHUB_PATTERNS = {
    // Used by isGitHubPRPage() for PR page validation
    PR_PAGE_REGEX: /^https:\/\/github\.com\/[^/]+\/[^/]+\/pulls(\/.*|\?.*)?$/,

    // Used by context menu in background.ts so it only shows on PR pages
    PR_PAGE_QUERY: "*://github.com/*/*/pulls*",

    // Used by content script, matches all github pages to avoid issues with SPA navigation
    REPO_PAGE_PATTERN: "https://github.com/*",

    // Used in background.ts for simple URL checks
    PR_PAGE_PARTIAL: "github.com",
    PR_PATH_PARTIAL: "/pulls",
} as const;

export const MESSAGE_ACTIONS = {
    APPLY_FILTERS: "apply_filters",
    APPLY_FILTERS_NOW: "apply_filters_now",
    TOGGLE_FILTER: "toggle_filter",
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
