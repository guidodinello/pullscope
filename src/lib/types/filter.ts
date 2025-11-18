export interface PRFilter {
  id: string;
  name: string;
  value: string; // The actual filter text (e.g., "-author:app/dependabot")
  enabled: boolean;
}

export type NewPRFilter = Omit<PRFilter, "id">;

export type PRFilterUpdate = Partial<Omit<PRFilter, "id">> & { id: string };
