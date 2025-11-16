<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { isGitHubPRPage, applyFilters, addFilter, removeFilter } from "@/lib/github";
  import { filterStore } from "@/lib/stores/filters";
  import { waitForElement, debounce } from "@/lib/utils/dom";
  import { logger } from "@/lib/utils/logger";
  import type { PRFilter } from "@/lib/types/filter";
  import type { ExtensionMessage } from "@/lib/types/messages";
  import { MESSAGE_ACTIONS, WAIT_TIMEOUTS, DEBOUNCE_DELAYS, TOAST_DURATION } from "@/lib/constants";
  import Toast from "@/lib/components/Toast.svelte";

  // Component state
  let _filtersApplied = $state(false);
  let toastMessage = $state("");
  let toastType = $state<"info" | "success" | "error" | "warning">("success");
  let enabledFilters = $state<string[]>([]);

  // Apply filters when on GitHub PR page
  async function tryApplyFilters() {
    logger.debug("tryApplyFilters");

    // Only run on GitHub PR pages
    if (!isGitHubPRPage(window.location.href)) {
      logger.debug("Not a GitHub PR page");
      return;
    }

    try {
      // Wait for the search input to be available
      await waitForElement("#js-issues-search", WAIT_TIMEOUTS.INITIAL_LOAD);

      logger.debug("Enabled filters:", enabledFilters);

      // If we have filters, apply them
      if (enabledFilters.length > 0) {
        const success = applyFilters(enabledFilters);
        _filtersApplied = success;

        // Show success toast
        if (success) {
          toastMessage = `Applied ${enabledFilters.length} filter(s)`;
          toastType = "success";
        } else {
          toastMessage = "Filters already applied";
          toastType = "info";
        }
      }
    } catch (err) {
      logger.error("Failed to apply filters:", err);
      toastMessage = "Failed to apply filters";
      toastType = "error";
    }
  }

  // Debounced URL change handler to prevent excessive filter applications
  const debouncedURLChange = debounce(() => {
    if (isGitHubPRPage(window.location.href)) {
      // Reset state
      _filtersApplied = false;
      tryApplyFilters();
    }
  }, DEBOUNCE_DELAYS.URL_CHANGE);

  // Handle navigation within GitHub (for SPA navigation)
  function handleURLChange() {
    debouncedURLChange();
  }

  /**
   * Handle real-time filter toggle from popup/options
   * @param filter The filter that was toggled
   */
  async function handleFilterToggle(filter: PRFilter) {
    logger.debug("handleFilterToggle", filter);

    // Only act if we're on a GitHub PR page
    if (!isGitHubPRPage(window.location.href)) {
      return;
    }

    try {
      // Wait for search input to be available
      await waitForElement("#js-issues-search", WAIT_TIMEOUTS.FILTER_TOGGLE);

      if (filter.enabled) {
        // Filter was enabled - add it
        const success = addFilter(filter.value);
        if (success) {
          toastMessage = `Added filter: ${filter.name}`;
          toastType = "success";
        }
      } else {
        // Filter was disabled - remove it
        const success = removeFilter(filter.value);
        if (success) {
          toastMessage = `Removed filter: ${filter.name}`;
          toastType = "info";
        }
      }
    } catch (err) {
      logger.error("Failed to toggle filter in real-time", err);
    }
  }

  // Create cleanup functions at the component level
  let cleanupFunctions: (() => void)[] = [];

  onMount(async () => {
    // Subscribe to filter store
    const unsubscribe = filterStore.subscribe((state) => {
      enabledFilters = state.filters.filter((f) => f.enabled).map((f) => f.value);
    });
    cleanupFunctions.push(unsubscribe);

    // Initialize store
    await filterStore.init();
    cleanupFunctions.push(() => filterStore.destroy());

    // Try to apply filters initially
    await tryApplyFilters();

    // Watch for URL changes (GitHub is a SPA) - using debounced handler
    const observer = new MutationObserver(handleURLChange);

    // Start observing with narrower scope
    observer.observe(document.body, { childList: true, subtree: false });
    cleanupFunctions.push(() => observer.disconnect());

    // Also listen for popstate events (browser back/forward)
    window.addEventListener("popstate", handleURLChange);
    cleanupFunctions.push(() => window.removeEventListener("popstate", handleURLChange));

    // Set up message listener
    const messageHandler = (message: ExtensionMessage) => {
      if (message.action === MESSAGE_ACTIONS.APPLY_FILTERS_NOW) {
        tryApplyFilters();
      } else if (message.action === MESSAGE_ACTIONS.TOGGLE_FILTER) {
        handleFilterToggle(message.filter);
      }
    };

    browser.runtime.onMessage.addListener(messageHandler);
    cleanupFunctions.push(() => browser.runtime.onMessage.removeListener(messageHandler));
  });

  // This is called directly during component initialization
  onDestroy(() => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  });
</script>

{#if toastMessage}
  <Toast
    message={toastMessage}
    type={toastType}
    duration={TOAST_DURATION.DEFAULT}
    onClose={() => (toastMessage = "")}
  />
{/if}
