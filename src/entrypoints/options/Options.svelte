<script lang="ts">
    import FilterEditor from "@/lib/components/FilterEditor.svelte";
    import ErrorDisplay from "@/lib/components/ErrorDisplay.svelte";
    import Icon from "@/lib/components/Icon.svelte";
    import type { PRFilter } from "@/lib/types/filter";
    import { useFilters } from "@/lib/compositions/filter-management.svelte";
    import { cn } from "@/lib/utils/cn";
    import { logger } from "@/lib/utils/logger";

    const filterManager = useFilters();

    // Component-specific state
    let editingFilter = $state<PRFilter | null>(null);
    let showAddForm = $state(false);

    async function handleDeleteFilter(id: string) {
        if (!confirm("Are you sure you want to delete this filter?")) return;

        const success = await filterManager.deleteFilter(id);
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
</script>

<main class="mx-auto max-w-2xl p-4">
    <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold">GitHub PR Filters</h1>
        <img src="/icons/icon-48.png" alt="Logo" class="size-10" />
    </div>

    <ErrorDisplay message={filterManager.error} onRetry={() => filterManager.retry()} />

    <div class="bg-bg-primary mb-6 rounded-lg p-6 shadow">
        <p class="text-text-primary">
            Configure filters to be automatically applied when you visit GitHub Pull Request pages.
        </p>
        <p class="text-text-secondary mt-2">
            These filters use GitHub's search syntax. For example, add
            <code class="bg-bg-tertiary text-text-primary rounded px-1 py-0.5"
                >-author:app/dependabot</code
            >
            to hide Dependabot PRs.
        </p>
    </div>

    {#if filterManager.isLoading}
        <div class="my-8 flex justify-center">
            <div
                class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
            ></div>
        </div>
    {:else}
        {#if !editingFilter && !showAddForm}
            <div class="mb-6">
                <button
                    class="bg-primary hover:bg-primary-hover focus:ring-primary flex items-center gap-2 rounded px-4 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onclick={handleAddNew}
                >
                    <Icon name="plus" class="size-5" />
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

        {#if filterManager.filters.length === 0 && !showAddForm}
            <div class="bg-bg-tertiary rounded-lg p-8 text-center">
                <p class="text-text-secondary">You haven't added any filters yet.</p>
            </div>
        {:else}
            <h2 class="mb-4 text-xl font-semibold">Your Filters</h2>
            <div class="space-y-4">
                {#each filterManager.filters as filter (filter.id)}
                    <div
                        class="bg-bg-primary flex items-center justify-between rounded-lg p-4 shadow"
                    >
                        <div class="flex-1">
                            <div class="flex items-center">
                                <span class="font-medium">{filter.name}</span>
                                <span
                                    class={cn(
                                        "ml-2 rounded px-2 py-0.5 text-xs font-semibold",
                                        filter.enabled
                                            ? "filter-badge-enabled"
                                            : "filter-badge-disabled"
                                    )}
                                >
                                    {filter.enabled ? "Enabled" : "Disabled"}
                                </span>
                            </div>
                            <div class="text-text-secondary mt-1 text-sm">
                                <code class="bg-bg-tertiary rounded px-1 py-0.5"
                                    >{filter.value}</code
                                >
                            </div>
                        </div>

                        <div class="flex gap-1">
                            <button
                                class={cn(
                                    "rounded p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    filter.enabled
                                        ? "text-success hover:bg-success-light focus:ring-success hover:scale-110"
                                        : "text-text-tertiary hover:bg-bg-tertiary focus:ring-text-secondary opacity-60 hover:opacity-100"
                                )}
                                title={filter.enabled ? "Disable filter" : "Enable filter"}
                                onclick={() => filterManager.toggleFilter(filter.id)}
                                aria-label={filter.enabled
                                    ? `Disable ${filter.name}`
                                    : `Enable ${filter.name}`}
                            >
                                <Icon
                                    name={filter.enabled ? "toggle-on" : "toggle-off"}
                                    class="size-5"
                                />
                            </button>
                            <button
                                class="text-text-secondary hover:bg-bg-tertiary hover:text-text-primary focus:ring-text-secondary rounded p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                                title="Edit filter"
                                onclick={() => handleEditFilter(filter)}
                                aria-label={`Edit ${filter.name}`}
                            >
                                <Icon name="edit" class="size-5" />
                            </button>
                            <button
                                class="text-error hover:bg-error-light focus:ring-error rounded p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                                title="Delete filter"
                                onclick={() => handleDeleteFilter(filter.id)}
                                aria-label={`Delete ${filter.name}`}
                            >
                                <Icon name="delete" class="size-5" />
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}

    <footer class="text-text-tertiary mt-8 text-center text-sm">
        <p>Pullscope Extension</p>
        <p class="mt-1">by guidodinello</p>
    </footer>
</main>
