import type { PRFilter, NewPRFilter } from "./types/filter";
import { logger } from "./utils/logger";

const filtersKey = "prFilters";

/**
 * Save PR filters to browser storage
 */
export async function saveFilters(filters: PRFilter[]): Promise<void> {
  await browser.storage.sync.set({ [filtersKey]: filters });
}

/**
 * Retrieve PR filters from browser storage
 */
export async function getFilters(): Promise<PRFilter[]> {
  const data = await browser.storage.sync.get(filtersKey);
  logger.debug("getFilters", data.prFilters || []);

  return data.prFilters || [];
}

/**
 * Add a new filter to the list
 */
export async function addFilter(filter: NewPRFilter): Promise<PRFilter[]> {
  logger.debug("addFilter", filter);

  const filters = await getFilters();
  const newFilter: PRFilter = {
    ...filter,
    id: crypto.randomUUID(),
  };

  const updatedFilters = [...filters, newFilter];
  await saveFilters(updatedFilters);

  logger.debug("after addFilter", await getFilters());
  return updatedFilters;
}

/**
 * Update an existing filter
 */
export async function updateFilter(filter: PRFilter): Promise<PRFilter[]> {
  logger.debug("updateFilter", filter);

  const filters = await getFilters();
  const updatedFilters = filters.map((f) => (f.id === filter.id ? filter : f));

  await saveFilters(updatedFilters);

  logger.debug("after updateFilter", await getFilters());
  return updatedFilters;
}

/**
 * Delete a filter by id
 */
export async function deleteFilter(id: string): Promise<PRFilter[]> {
  const filters = await getFilters();
  const updatedFilters = filters.filter((f) => f.id !== id);

  await saveFilters(updatedFilters);
  return updatedFilters;
}

/**
 * Toggle a filter's enabled status
 */
export async function toggleFilter(id: string): Promise<PRFilter[]> {
  logger.debug("toggleFilter", id);

  const filters = await getFilters();
  const updatedFilters = filters.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f));

  await saveFilters(updatedFilters);

  logger.debug("after toggleFilter", await getFilters());
  return updatedFilters;
}
