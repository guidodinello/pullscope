<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { PRFilter } from "@/lib/types/filter";
  import { filterStore } from "@/lib/stores/filters";
  import { logger } from "@/lib/utils/logger";

  // Component state
  let filters = $state<PRFilter[]>([]);
  let isLoading = $state(false);
  let unsubscribe: (() => void) | null = null;

  onMount(async () => {
    unsubscribe = filterStore.subscribe((state) => {
      filters = state.filters;
      isLoading = state.isLoading;
    });

    await filterStore.init();
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    filterStore.destroy();
  });

  async function handleToggleFilter(id: string) {
    logger.debug("handleToggleFilter", id);

    // Find the filter BEFORE toggling to get current state
    const filter = filters.find((f) => f.id === id);
    if (!filter) {
      logger.error("Filter not found:", id);
      return;
    }

    const success = await filterStore.toggle(id);
    if (!success) {
      logger.error("Failed to toggle filter:", id);
      return;
    }

    // Create updated filter with toggled state
    const toggledFilter: PRFilter = {
      ...filter,
      enabled: !filter.enabled,
    };

    // Broadcast to all GitHub PR tabs with NEW state
    broadcastFilterToggle(toggledFilter);
  }

  /**
   * Broadcast filter toggle to all GitHub PR tabs
   */
  async function broadcastFilterToggle(filter: PRFilter) {
    try {
      const tabs = await browser.tabs.query({
        url: "*://github.com/*/*/pulls*",
      });

      for (const tab of tabs) {
        if (tab.id) {
          browser.tabs.sendMessage(tab.id, {
            action: "toggleFilter",
            filter: filter,
          });
        }
      }
    } catch (err) {
      logger.error("Failed to broadcast filter toggle:", err);
    }
  }

  function openOptions() {
    browser.runtime.openOptionsPage();
  }
</script>

<main class="w-72 bg-white p-4">
  <div class="mb-4 flex items-center justify-between">
    <h1 class="text-lg font-bold">GitHub PR Filters</h1>
    <img src="/icons/icon-32.png" alt="Logo" class="size-6" />
  </div>

  {#if isLoading}
    <div class="my-4 flex justify-center">
      <div
        class="border-neon-blue h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
      ></div>
    </div>
  {:else if filters.length === 0}
    <div class="py-4 text-center">
      <p class="mb-2 text-gray-500">No filters configured yet</p>
      <button
        class="bg-neon-blue rounded px-3 py-1 text-sm text-black hover:bg-blue-600"
        onclick={openOptions}
      >
        Add Your First Filter
      </button>
    </div>
  {:else}
    <div class="mb-4 max-h-64 overflow-y-auto">
      {#each filters as filter (filter.id)}
        <div class="flex items-center justify-between border-b border-gray-100 py-2">
          <div>
            <span class="text-sm font-medium">{filter.name}</span>
            <div class="text-xs text-gray-500">
              <code class="rounded bg-gray-100 px-1">{filter.value}</code>
            </div>
          </div>

          <button
            class={`relative me-2 h-5 w-10 rounded-full ${filter.enabled ? "bg-green-500" : "bg-gray-300"} focus:ring-neon-blue transition-colors focus:outline-none focus:ring-2`}
            onclick={() => handleToggleFilter(filter.id)}
            aria-label={filter.enabled ? `Disable ${filter.name}` : `Enable ${filter.name}`}
            role="switch"
            aria-checked={filter.enabled}
          >
            <span
              class={`absolute left-0.5 top-0.5 size-4 transform rounded-full bg-white shadow transition-transform ${filter.enabled ? "translate-x-5" : ""}`}
            ></span>
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <div class="mt-4">
    <button
      class="bg-neon-blue focus:ring-neon-blue w-full rounded px-3 py-2 text-sm text-black hover:bg-blue-600 focus:outline-none focus:ring-2"
      onclick={openOptions}
      aria-label="Open filter management page"
    >
      Manage Filters
    </button>
  </div>
</main>
