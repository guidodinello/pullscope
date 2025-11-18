import type { PRFilter, NewPRFilter } from "@/lib/types/filter";
import { logger } from "@/lib/utils/logger";
import { STORAGE_KEYS } from "@/lib/constants";

export async function saveFilters(filters: PRFilter[]): Promise<void> {
  await browser.storage.sync.set({ [STORAGE_KEYS.PR_FILTERS]: filters });
}

export async function getFilters(): Promise<PRFilter[]> {
  const data = await browser.storage.sync.get(STORAGE_KEYS.PR_FILTERS);
  logger.debug("getFilters", data[STORAGE_KEYS.PR_FILTERS] || []);

  return data[STORAGE_KEYS.PR_FILTERS] || [];
}

export async function addFilter(filter: NewPRFilter): Promise<PRFilter[]> {
  logger.debug("addFilter", filter);

  const updatedFilters = [
    ...(await getFilters()),
    {
      ...filter,
      id: crypto.randomUUID(),
    } satisfies PRFilter,
  ];
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

export async function deleteFilter(id: string): Promise<PRFilter[]> {
  const updatedFilters = (await getFilters()).filter((f) => f.id !== id);

  await saveFilters(updatedFilters);
  return updatedFilters;
}

export async function toggleFilter(id: string): Promise<PRFilter[]> {
  logger.debug("toggleFilter", id);

  const updatedFilters = (await getFilters()).map((f) =>
    f.id === id ? { ...f, enabled: !f.enabled } : f
  );

  await saveFilters(updatedFilters);

  logger.debug("after toggleFilter", await getFilters());
  return updatedFilters;
}
