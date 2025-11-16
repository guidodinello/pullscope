<script lang="ts">
  import type { PRFilter } from "@/lib/types/filter";
  import { addFilter, updateFilter } from "@/lib/storage";
  import { validateFilter, validateFilterName } from "@/lib/utils/validation";
  import ErrorDisplay from "./ErrorDisplay.svelte";

  // Props
  let { filter, onSave, onCancel } = $props<{
    filter?: PRFilter;
    onSave: () => void;
    onCancel: () => void;
  }>();

  // Form state
  let name = $state(filter?.name || "");
  let value = $state(filter?.value || "");
  let enabled = $state(filter?.enabled ?? true);
  let isSaving = $state(false);
  let error = $state("");
  let nameError = $state("");
  let valueError = $state("");

  function validateForm(): boolean {
    // Reset errors
    nameError = "";
    valueError = "";
    error = "";

    // Validate name
    const nameValidation = validateFilterName(name);
    if (!nameValidation.isValid) {
      nameError = nameValidation.error || "";
      return false;
    }

    // Validate value
    const valueValidation = validateFilter(value);
    if (!valueValidation.isValid) {
      valueError = valueValidation.error || "";
      return false;
    }

    return true;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      isSaving = true;
      error = "";

      if (filter) {
        // Update existing filter
        await updateFilter({
          ...filter,
          name: name.trim(),
          value: value.trim(),
          enabled,
        });
      } else {
        // Add new filter
        await addFilter({
          name: name.trim(),
          value: value.trim(),
          enabled,
        });
      }

      // Call the onSave callback to notify parent
      onSave();
    } catch {
      error = "Failed to save filter. Please try again.";
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="rounded-lg bg-white p-6 shadow">
  <h2 class="mb-4 text-xl font-semibold">
    {filter ? "Edit Filter" : "Add New Filter"}
  </h2>

  <ErrorDisplay message={error} onDismiss={() => (error = "")} />

  <form onsubmit={handleSubmit}>
    <div class="mb-4">
      <label for="name" class="mb-1 block text-sm font-medium text-gray-700"> Filter Name </label>
      <input
        type="text"
        id="name"
        bind:value={name}
        class="focus:ring-neon-blue w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 {nameError
          ? 'border-red-500'
          : 'border-gray-300'}"
        placeholder="e.g., Hide Dependabot PRs"
        aria-invalid={!!nameError}
        aria-describedby={nameError ? "name-error" : undefined}
      />
      {#if nameError}
        <p id="name-error" class="mt-1 text-sm text-red-600" role="alert">
          {nameError}
        </p>
      {:else}
        <p class="mt-1 text-sm text-gray-500">A descriptive name for your filter</p>
      {/if}
    </div>

    <div class="mb-4">
      <label for="value" class="mb-1 block text-sm font-medium text-gray-700"> Filter Value </label>
      <input
        type="text"
        id="value"
        bind:value
        class="focus:ring-neon-blue w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 {valueError
          ? 'border-red-500'
          : 'border-gray-300'}"
        placeholder="e.g., -author:app/dependabot"
        aria-invalid={!!valueError}
        aria-describedby={valueError ? "value-error" : undefined}
      />
      {#if valueError}
        <p id="value-error" class="mt-1 text-sm text-red-600" role="alert">
          {valueError}
        </p>
      {:else}
        <p class="mt-1 text-sm text-gray-500">
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
          class="text-neon-blue focus:ring-neon-blue h-4 w-4 rounded"
        />
        <label for="enabled" class="ml-2 block text-sm text-gray-700"> Enable this filter </label>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button
        type="button"
        onclick={onCancel}
        class="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
        disabled={isSaving}
      >
        Cancel
      </button>
      <button
        type="submit"
        class="bg-neon-blue rounded px-4 py-2 text-black hover:bg-blue-600"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : filter ? "Update Filter" : "Add Filter"}
      </button>
    </div>
  </form>
</div>
