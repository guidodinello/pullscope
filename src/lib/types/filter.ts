/**
 * Represents a GitHub PR filter
 */
export interface PRFilter {
  id: string; // Unique identifier
  name: string; // Display name
  value: string; // The actual filter text (e.g., "-author:app/dependabot")
  enabled: boolean; // Whether this filter is active
}

/**
 * Filter without ID (used when creating new filters)
 */
export type NewPRFilter = Omit<PRFilter, "id">;

/**
 * Partial filter for updates
 */
export type PRFilterUpdate = Partial<Omit<PRFilter, "id">> & { id: string };
