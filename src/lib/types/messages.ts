import type { PRFilter } from "@/lib/types/filter";
import { MESSAGE_ACTIONS } from "@/lib/constants";

export type ApplyFiltersMessage = {
    action: typeof MESSAGE_ACTIONS.APPLY_FILTERS;
};

export type ApplyFiltersNowMessage = {
    action: typeof MESSAGE_ACTIONS.APPLY_FILTERS_NOW;
};

export type ToggleFilterMessage = {
    action: typeof MESSAGE_ACTIONS.TOGGLE_FILTER;
    filter: PRFilter;
};

export type ExtensionMessage = ApplyFiltersMessage | ApplyFiltersNowMessage | ToggleFilterMessage;

export type MessageResponse = {
    success: boolean;
    message?: string;
};
