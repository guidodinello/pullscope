import { writable, derived, get } from "svelte/store";
import type { PRFilter, NewPRFilter } from "@/lib/types/filter";
import { logger } from "@/lib/utils/logger";
import { STORAGE_KEYS } from "@/lib/constants";

interface FilterStoreState {
    filters: PRFilter[];
    isLoading: boolean;
    error: string | null;
}

/**
 * Create a reactive store for managing PR filters
 * Syncs with browser.storage and provides CRUD operations
 */
function createFilterStore() {
    const {
        subscribe,
        set: _set,
        update,
    } = writable<FilterStoreState>({
        filters: [],
        isLoading: false,
        error: null,
    });

    // Storage change listener
    let storageListener:
        | ((
              changes: Record<string, { newValue?: PRFilter[]; oldValue?: PRFilter[] }>,
              areaName: string
          ) => void)
        | null = null;

    return {
        subscribe,

        /**
         * Initialize the store by loading filters from storage
         */
        async init() {
            logger.debug("Initializing filter store");
            update((state) => ({ ...state, isLoading: true, error: null }));

            try {
                const data = await browser.storage.sync.get(STORAGE_KEYS.PR_FILTERS);
                const filters = (data[STORAGE_KEYS.PR_FILTERS] || []) as PRFilter[];

                logger.debug("Loaded filters from storage", filters);
                update((state) => ({
                    ...state,
                    filters,
                    isLoading: false,
                }));

                // Set up storage change listener
                if (!storageListener) {
                    storageListener = (changes, areaName) => {
                        if (areaName === "sync" && changes[STORAGE_KEYS.PR_FILTERS]) {
                            const newFilters = changes[STORAGE_KEYS.PR_FILTERS].newValue || [];
                            logger.debug("Storage changed, updating filters", newFilters);
                            update((state) => ({ ...state, filters: newFilters }));
                        }
                    };
                    browser.storage.onChanged.addListener(storageListener);
                }
            } catch (err) {
                logger.error("Failed to load filters", err);
                update((state) => ({
                    ...state,
                    isLoading: false,
                    error: "Failed to load filters. Please try again.",
                }));
            }
        },

        async add(filter: NewPRFilter): Promise<PRFilter | null> {
            logger.debug("Adding filter", filter);

            try {
                const state = get({ subscribe });
                const newFilter = {
                    ...filter,
                    id: crypto.randomUUID(),
                } satisfies PRFilter;

                const updatedFilters = [...state.filters, newFilter];
                await browser.storage.sync.set({ [STORAGE_KEYS.PR_FILTERS]: updatedFilters });

                update((s) => ({ ...s, filters: updatedFilters, error: null }));
                logger.info("Filter added successfully", newFilter);

                return newFilter;
            } catch (err) {
                logger.error("Failed to add filter", err);
                update((s) => ({
                    ...s,
                    error: "Failed to add filter. Please try again.",
                }));
                return null;
            }
        },

        async update(filter: PRFilter): Promise<boolean> {
            logger.debug("Updating filter", filter);

            try {
                const state = get({ subscribe });
                const updatedFilters = state.filters.map((f) => (f.id === filter.id ? filter : f));

                await browser.storage.sync.set({ [STORAGE_KEYS.PR_FILTERS]: updatedFilters });
                update((s) => ({ ...s, filters: updatedFilters, error: null }));

                logger.info("Filter updated successfully", filter);
                return true;
            } catch (err) {
                logger.error("Failed to update filter", err);
                update((s) => ({
                    ...s,
                    error: "Failed to update filter. Please try again.",
                }));
                return false;
            }
        },

        async delete(id: string): Promise<boolean> {
            logger.debug("Deleting filter", id);

            try {
                const state = get({ subscribe });
                const updatedFilters = state.filters.filter((f) => f.id !== id);

                await browser.storage.sync.set({ [STORAGE_KEYS.PR_FILTERS]: updatedFilters });
                update((s) => ({ ...s, filters: updatedFilters, error: null }));

                logger.info("Filter deleted successfully", id);
                return true;
            } catch (err) {
                logger.error("Failed to delete filter", err);
                update((s) => ({
                    ...s,
                    error: "Failed to delete filter. Please try again.",
                }));
                return false;
            }
        },

        async toggle(id: string): Promise<boolean> {
            logger.debug("Toggling filter", id);

            try {
                const state = get({ subscribe });
                const updatedFilters = state.filters.map((f) =>
                    f.id === id ? { ...f, enabled: !f.enabled } : f
                );

                await browser.storage.sync.set({ [STORAGE_KEYS.PR_FILTERS]: updatedFilters });
                update((s) => ({ ...s, filters: updatedFilters, error: null }));

                logger.info("Filter toggled successfully", id);
                return true;
            } catch (err) {
                logger.error("Failed to toggle filter", err);
                update((s) => ({
                    ...s,
                    error: "Failed to toggle filter. Please try again.",
                }));
                return false;
            }
        },

        getEnabled(): PRFilter[] {
            const state = get({ subscribe });
            return state.filters.filter((f) => f.enabled);
        },

        clearError() {
            update((s) => ({ ...s, error: null }));
        },

        destroy() {
            if (storageListener) {
                browser.storage.onChanged.removeListener(storageListener);
                storageListener = null;
            }
        },
    };
}

/**
 * Global filter store instance
 */
export const filterStore = createFilterStore();

/**
 * Derived store for enabled filters only
 */
export const enabledFilters = derived(filterStore, ($store) =>
    $store.filters.filter((f) => f.enabled)
);

/**
 * Derived store for filter count
 */
export const filterCount = derived(filterStore, ($store) => $store.filters.length);

/**
 * Derived store for enabled filter count
 */
export const enabledFilterCount = derived(
    filterStore,
    ($store) => $store.filters.filter((f) => f.enabled).length
);
