<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { isGitHubPRPage, applyFilters, addFilter, removeFilter, SELECTORS } from "@/lib/github";
  import { filterStore } from "@/lib/stores/filters";
  import { waitForElement, debounce } from "@/lib/utils/dom";
  import { logger } from "@/lib/utils/logger";
  import type { PRFilter } from "@/lib/types/filter";
  import type { ExtensionMessage } from "@/lib/types/messages";
  import { MESSAGE_ACTIONS, WAIT_TIMEOUTS, DEBOUNCE_DELAYS, TOAST_DURATION } from "@/lib/constants";
  import Toast from "@/lib/components/Toast.svelte";
  import { TOAST_TYPES, ToastType } from "@/lib/types/toast";

  // Component state
  let _filtersApplied = $state(false);
  let toastMessage = $state("");
  let toastType = $state<ToastType>(TOAST_TYPES.SUCCESS);
  let enabledFilters = $state<string[]>([]);

  async function tryApplyFilters() {
    if (!isGitHubPRPage(window.location.href)) {
      return;
    }

    try {
      await waitForElement(SELECTORS.GITHUB_SEARCH, WAIT_TIMEOUTS.INITIAL_LOAD);

      if (enabledFilters.length > 0) {
        const success = applyFilters(enabledFilters);
        _filtersApplied = success;

        if (success) {
          toastMessage = `Applied ${enabledFilters.length} filter(s)`;
          toastType = TOAST_TYPES.SUCCESS;
        } else {
          toastMessage = "Filters already applied";
          toastType = TOAST_TYPES.INFO;
        }
      }
    } catch (err) {
      logger.error("Failed to apply filters:", err);
      toastMessage = "Failed to apply filters";
      toastType = TOAST_TYPES.ERROR;
    }
  }

  const debouncedURLChange = debounce(() => {
    if (isGitHubPRPage(window.location.href)) {
      _filtersApplied = false;
      tryApplyFilters();
    }
  }, DEBOUNCE_DELAYS.URL_CHANGE);

  async function handleFilterToggle(filter: PRFilter) {
    if (!isGitHubPRPage(window.location.href)) return;

    try {
      await waitForElement(SELECTORS.GITHUB_SEARCH, WAIT_TIMEOUTS.FILTER_TOGGLE);

      const success = filter.enabled ? addFilter(filter.value) : removeFilter(filter.value);

      if (success) {
        toastMessage = `Filter ${filter.enabled ? "enabled" : "disabled"}: ${filter.name}`;
        toastType = TOAST_TYPES.SUCCESS;
      }
    } catch (error) {
      logger.error("Error toggling filter:", error);
      toastMessage = "Failed to toggle filter";
      toastType = TOAST_TYPES.ERROR;
    }
  }

  const cleanupFunctions: (() => void)[] = [];

  onMount(async () => {
    const unsubscribe = filterStore.subscribe((state) => {
      enabledFilters = state.filters.filter((f) => f.enabled).map((f) => f.value);
    });
    cleanupFunctions.push(unsubscribe);

    await filterStore.init();
    cleanupFunctions.push(() => filterStore.destroy());

    await tryApplyFilters();

    const observer = new MutationObserver(debouncedURLChange);
    observer.observe(document.body, { childList: true, subtree: false });
    cleanupFunctions.push(() => observer.disconnect());

    window.addEventListener("popstate", debouncedURLChange);
    cleanupFunctions.push(() => window.removeEventListener("popstate", debouncedURLChange));

    const messageHandler = (message: ExtensionMessage) => {
      switch (message.action) {
        case MESSAGE_ACTIONS.APPLY_FILTERS_NOW:
          tryApplyFilters();
          break;
        case MESSAGE_ACTIONS.TOGGLE_FILTER:
          handleFilterToggle(message.filter);
          break;
        default:
          logger.debug("Ignoring unknown message action:", message.action);
      }
    };

    browser.runtime.onMessage.addListener(messageHandler);
    cleanupFunctions.push(() => browser.runtime.onMessage.removeListener(messageHandler));
  });

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
