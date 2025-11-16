<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import FilterEditor from "@/lib/components/FilterEditor.svelte";
  import ErrorDisplay from "@/lib/components/ErrorDisplay.svelte";
  import type { PRFilter } from "@/lib/types/filter";
  import { filterStore } from "@/lib/stores/filters";
  import { logger } from "@/lib/utils/logger";

  // Component state
  let editingFilter = $state<PRFilter | null>(null);
  let showAddForm = $state(false);
  let filters = $state<PRFilter[]>([]);
  let isLoading = $state(false);
  let error = $state("");
  let unsubscribe: (() => void) | null = null;

  // Load filters on mount
  onMount(async () => {
    unsubscribe = filterStore.subscribe((state) => {
      filters = state.filters;
      isLoading = state.isLoading;
      error = state.error || "";
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

  async function handleDeleteFilter(id: string) {
    if (!confirm("Are you sure you want to delete this filter?")) return;

    const success = await filterStore.delete(id);
    if (!success) {
      logger.error("Failed to delete filter:", id);
    }
  }

  function handleEditFilter(filter: PRFilter) {
    editingFilter = filter;
    showAddForm = false;
  }

  function handleAddNew() {
    logger.debug("handleAddNew");
    editingFilter = null;
    showAddForm = true;
  }

  function handleSaveFilter() {
    // Reset editing state (store updates automatically)
    editingFilter = null;
    showAddForm = false;
  }

  function handleCancelEdit() {
    editingFilter = null;
    showAddForm = false;
  }

  function handleRetry() {
    filterStore.clearError();
    filterStore.init();
  }
</script>

<main class="mx-auto max-w-2xl p-4">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">GitHub PR Filters</h1>
    <img src="/icons/icon-48.png" alt="Logo" class="size-10" />
  </div>

  <ErrorDisplay message={error} onRetry={handleRetry} />

  <div class="mb-6 rounded-lg bg-white p-6 shadow">
    <p class="text-gray-700">
      Configure filters to be automatically applied when you visit GitHub Pull Request pages.
    </p>
    <p class="mt-2 text-gray-700">
      These filters use GitHub's search syntax. For example, add <code>-author:app/dependabot</code>
      to hide Dependabot PRs.
    </p>
  </div>

  {#if isLoading}
    <div class="my-8 flex justify-center">
      <div
        class="border-neon-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
      ></div>
    </div>
  {:else}
    {#if !editingFilter && !showAddForm}
      <div class="mb-6">
        <button
          class="bg-neon-blue rounded px-4 py-2 text-black hover:bg-blue-600"
          onclick={handleAddNew}
        >
          Add New Filter
        </button>
      </div>
    {/if}

    {#if editingFilter}
      <div class="mb-6">
        <FilterEditor
          filter={editingFilter}
          onSave={handleSaveFilter}
          onCancel={handleCancelEdit}
        />
      </div>
    {/if}

    {#if showAddForm}
      <div class="mb-6">
        <FilterEditor onSave={handleSaveFilter} onCancel={handleCancelEdit} />
      </div>
    {/if}

    {#if filters.length === 0 && !showAddForm}
      <div class="rounded-lg bg-gray-50 p-8 text-center">
        <p class="text-gray-500">You haven't added any filters yet.</p>
        <button
          class="bg-neon-blue mt-4 rounded px-4 py-2 text-black hover:bg-blue-600"
          onclick={handleAddNew}
        >
          Add Your First Filter
        </button>
      </div>
    {:else}
      <h2 class="mb-4 text-xl font-semibold">Your Filters</h2>
      <div class="space-y-4">
        {#each filters as filter (filter.id)}
          <div class="flex items-center justify-between rounded-lg bg-white p-4 shadow">
            <div class="flex-1">
              <div class="flex items-center">
                <span class="font-medium">{filter.name}</span>
                <span
                  class={`ml-2 rounded px-2 py-0.5 text-xs ${filter.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {filter.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div class="mt-1 text-sm text-gray-500">
                <code class="rounded bg-gray-100 px-1 py-0.5">{filter.value}</code>
              </div>
            </div>

            <div class="flex space-x-2">
              <button
                class="p-2 text-gray-500 hover:text-gray-700"
                title={filter.enabled ? "Disable" : "Enable"}
                onclick={() => handleToggleFilter(filter.id)}
              >
                {filter.enabled ? "🔴" : "🟢"}
              </button>
              <button
                class="p-2 text-gray-500 hover:text-gray-700"
                title="Edit"
                onclick={() => handleEditFilter(filter)}
              >
                ✏️
              </button>
              <button
                class="p-2 text-gray-500 hover:text-gray-700"
                title="Delete"
                onclick={() => handleDeleteFilter(filter.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}

  <footer class="mt-8 text-center text-sm text-gray-500">
    <p>Pullscope Extension</p>
    <p class="mt-1">by guidodinello</p>
  </footer>
</main>
