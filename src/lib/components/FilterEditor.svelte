<script lang="ts">
    import type { PRFilter } from "@/lib/types/filter";
    import { filterStore } from "@/lib/stores/filters";
    import { validateFilter, validateFilterName } from "@/lib/utils/validation";
    import { cn } from "@/lib/utils/cn";
    import ErrorDisplay from "@/lib/components/ErrorDisplay.svelte";

    let {
        filter,
        onSave,
        onCancel,
    }: {
        filter?: PRFilter;
        onSave: () => void;
        onCancel: () => void;
    } = $props();

    // Form state
    let name = $state(filter?.name || "");
    let value = $state(filter?.value || "");
    let enabled = $state(filter?.enabled ?? true);
    let isSaving = $state(false);
    let error = $state("");
    let nameError = $state("");
    let valueError = $state("");

    function validateForm() {
        nameError = "";
        valueError = "";
        error = "";

        const nameValidation = validateFilterName(name);
        if (!nameValidation.isValid) {
            nameError = nameValidation.error || "";
            return false;
        }

        const valueValidation = validateFilter(value);
        if (!valueValidation.isValid) {
            valueError = valueValidation.error || "";
            return false;
        }

        return true;
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            isSaving = true;
            error = "";

            let success = false;

            if (filter) {
                success = await filterStore.update({
                    ...filter,
                    name: name.trim(),
                    value: value.trim(),
                    enabled,
                });
            } else {
                const newFilter = await filterStore.add({
                    name: name.trim(),
                    value: value.trim(),
                    enabled,
                });
                success = newFilter !== null;
            }

            if (success) {
                onSave();
            } else {
                error = "Failed to save filter. Please try again.";
            }
        } catch {
            error = "Failed to save filter. Please try again.";
        } finally {
            isSaving = false;
        }
    }

    const inputClasses =
        "focus:ring-primary w-full rounded border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
</script>

<div class="bg-bg-primary rounded-lg p-6 shadow">
    <h2 class="mb-4 text-xl font-semibold">
        {filter ? "Edit Filter" : "Add New Filter"}
    </h2>

    <ErrorDisplay message={error} onDismiss={() => (error = "")} />

    <form onsubmit={handleSubmit}>
        <div class="mb-4">
            <label for="name" class="text-text-primary mb-1 block text-sm font-medium">
                Filter Name
            </label>
            <input
                type="text"
                id="name"
                bind:value={name}
                class={cn(inputClasses, nameError ? "border-error" : "border-border")}
                placeholder="e.g., Hide Dependabot PRs"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "name-error" : undefined}
            />
            {#if nameError}
                <p id="name-error" class="text-error mt-1 text-sm" role="alert">
                    {nameError}
                </p>
            {:else}
                <p class="text-text-secondary mt-1 text-sm">A descriptive name for your filter</p>
            {/if}
        </div>

        <div class="mb-4">
            <label for="value" class="text-text-primary mb-1 block text-sm font-medium">
                Filter Value
            </label>
            <input
                type="text"
                id="value"
                bind:value
                class={cn(inputClasses, valueError ? "border-error" : "border-border")}
                placeholder="e.g., -author:app/dependabot"
                aria-invalid={!!valueError}
                aria-describedby={valueError ? "value-error" : undefined}
            />
            {#if valueError}
                <p id="value-error" class="text-error mt-1 text-sm" role="alert">
                    {valueError}
                </p>
            {:else}
                <p class="text-text-secondary mt-1 text-sm">
                    GitHub search syntax (e.g., <code>-author:app/dependabot</code>,
                    <code>is:open</code>)
                </p>
            {/if}
        </div>

        <div class="mb-6">
            <div class="flex items-center">
                <input
                    type="checkbox"
                    id="enabled"
                    bind:checked={enabled}
                    class="text-primary focus:ring-primary size-4 rounded transition-colors focus:ring-2 focus:ring-offset-2"
                />
                <label for="enabled" class="text-text-primary ml-2 block text-sm">
                    Enable this filter
                </label>
            </div>
        </div>

        <div class="flex justify-end gap-3">
            <button
                type="button"
                onclick={onCancel}
                class="bg-bg-tertiary text-text-primary hover:bg-border focus:ring-text-secondary rounded px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                disabled={isSaving}
            >
                Cancel
            </button>
            <button
                type="submit"
                class="bg-primary hover:bg-primary-hover focus:ring-primary rounded px-4 py-2 text-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                disabled={isSaving}
            >
                {isSaving ? "Saving..." : filter ? "Update Filter" : "Add Filter"}
            </button>
        </div>
    </form>
</div>
