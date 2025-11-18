<script lang="ts">
    import { useFilters } from "@/lib/compositions/filter-management.svelte";
    import { cn } from "@/lib/utils/cn";

    const filterManager = useFilters();

    function openOptions() {
        browser.runtime.openOptionsPage();
    }
</script>

<main class="bg-bg-primary w-72 p-4">
    <div class="mb-4 flex items-center justify-between">
        <h1 class="text-text-primary text-lg font-bold">GitHub PR Filters</h1>
        <img src="/icons/icon-32.png" alt="Logo" class="size-6" />
    </div>

    {#if filterManager.isLoading}
        <div class="my-4 flex justify-center">
            <div
                class="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
            ></div>
        </div>
    {:else if filterManager.filters.length === 0}
        <div class="py-4 text-center">
            <p class="text-text-secondary mb-2">No filters configured yet</p>
        </div>
    {:else}
        <div class="mb-4 max-h-64 overflow-y-auto">
            {#each filterManager.filters as filter (filter.id)}
                <div class="border-border-light flex items-center justify-between border-b py-2">
                    <div>
                        <span class="text-text-primary text-sm font-medium">{filter.name}</span>
                        <div class="text-text-secondary text-xs">
                            <code class="bg-bg-tertiary rounded px-1">{filter.value}</code>
                        </div>
                    </div>

                    <button
                        class={cn(
                            "focus:ring-primary relative me-2 h-5 w-10 rounded-full shadow-inner transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                            filter.enabled
                                ? "bg-success hover:bg-success-dark focus:ring-success"
                                : "bg-text-tertiary hover:bg-text-secondary focus:ring-text-secondary"
                        )}
                        onclick={() => filterManager.toggleFilter(filter.id)}
                        aria-label={filter.enabled
                            ? `Disable ${filter.name}`
                            : `Enable ${filter.name}`}
                        role="switch"
                        aria-checked={filter.enabled}
                    >
                        <span
                            class={cn(
                                "absolute left-0.5 top-0.5 size-4 transform rounded-full bg-white shadow-md transition-all duration-200 ease-in-out",
                                filter.enabled && "translate-x-5 scale-105"
                            )}
                        ></span>
                    </button>
                </div>
            {/each}
        </div>
    {/if}

    <div class="mt-4">
        <button
            class="bg-primary hover:bg-primary-hover focus:ring-primary w-full rounded px-3 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            onclick={openOptions}
            aria-label="Open filter management page"
        >
            Manage Filters
        </button>
    </div>
</main>
