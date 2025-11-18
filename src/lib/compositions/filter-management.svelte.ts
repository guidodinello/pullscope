import { onMount, onDestroy } from "svelte";
import type { PRFilter } from "@/lib/types/filter";
import { filterStore } from "@/lib/stores/filters";
import { broadcastFilterToggle } from "@/lib/utils/messaging";
import { logger } from "@/lib/utils/logger";

class FilterManager {
    filters = $state<PRFilter[]>([]);
    isLoading = $state(false);
    error = $state("");
    private unsubscribe: (() => void) | null = null;

    async init() {
        this.unsubscribe = filterStore.subscribe((state) => {
            this.filters = state.filters;
            this.isLoading = state.isLoading;
            this.error = state.error || "";
        });

        await filterStore.init();
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        filterStore.destroy();
    }

    async toggleFilter(id: string) {
        logger.debug("toggleFilter", id);

        const filter = this.filters.find((f) => f.id === id);
        if (!filter) {
            logger.error("Filter not found:", id);
            return false;
        }

        const success = await filterStore.toggle(id);
        if (!success) {
            logger.error("Failed to toggle filter:", id);
            return false;
        }

        const toggledFilter = {
            ...filter,
            enabled: !filter.enabled,
        } satisfies PRFilter;

        broadcastFilterToggle(toggledFilter);
        return true;
    }

    async deleteFilter(id: string) {
        return await filterStore.delete(id);
    }

    retry() {
        filterStore.clearError();
        filterStore.init();
    }
}

export function useFilters() {
    const manager = new FilterManager();

    onMount(async () => {
        await manager.init();
    });

    onDestroy(() => {
        manager.destroy();
    });

    return manager;
}
