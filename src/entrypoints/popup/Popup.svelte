<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { PRFilter } from "@/lib/types/filter";
  import { filterStore } from "@/lib/stores/filters";
  import { broadcastFilterToggle } from "@/lib/utils/messaging";
  import { cn } from "@/lib/utils/cn";
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

  function openOptions() {
    browser.runtime.openOptionsPage();
  }
</script>

<main class="bg-bg-primary w-72 p-4">
  <div class="mb-4 flex items-center justify-between">
    <h1 class="text-text-primary text-lg font-bold">GitHub PR Filters</h1>
    <img src="/icons/icon-32.png" alt="Logo" class="size-6" />
  </div>

  {#if isLoading}
    <div class="my-4 flex justify-center">
      <div
        class="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
      ></div>
    </div>
  {:else if filters.length === 0}
    <div class="py-4 text-center">
      <p class="text-text-secondary mb-2">No filters configured yet</p>
    </div>
  {:else}
    <div class="mb-4 max-h-64 overflow-y-auto">
      {#each filters as filter (filter.id)}
        <div class="border-border-light flex items-center justify-between border-b py-2">
          <div>
            <span class="text-text-primary text-sm font-medium">{filter.name}</span>
            <div class="text-text-secondary text-xs">
              <code class="bg-bg-tertiary rounded px-1">{filter.value}</code>
            </div>
          </div>

          <button
            class={cn(
              "focus:ring-primary relative me-2 h-5 w-10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
              filter.enabled ? "bg-success" : "bg-text-tertiary"
            )}
            onclick={() => handleToggleFilter(filter.id)}
            aria-label={filter.enabled ? `Disable ${filter.name}` : `Enable ${filter.name}`}
            role="switch"
            aria-checked={filter.enabled}
          >
            <span
              class={cn(
                "absolute left-0.5 top-0.5 size-4 transform rounded-full bg-white shadow transition-transform",
                filter.enabled && "translate-x-5"
              )}
            ></span>
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <div class="mt-4">
    <button
      class="bg-primary hover:bg-primary-hover focus:ring-primary w-full rounded px-3 py-2 text-sm text-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
      onclick={openOptions}
      aria-label="Open filter management page"
    >
      Manage Filters
    </button>
  </div>
</main>
