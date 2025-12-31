import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadFilters, saveFilters } from "./storage";
import type { PRFilter } from "@/lib/types/filter";
import { STORAGE_KEYS } from "@/lib/constants";

describe("storage utilities", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("loadFilters", () => {
        it("should load filters from storage successfully", async () => {
            const mockFilters: PRFilter[] = [
                {
                    id: "1",
                    name: "Test Filter",
                    value: "is:pr is:open",
                    enabled: true,
                },
                {
                    id: "2",
                    name: "Another Filter",
                    value: "author:@me",
                    enabled: false,
                },
            ];

            vi.mocked(browser.storage.sync.get).mockResolvedValue({
                [STORAGE_KEYS.PR_FILTERS]: mockFilters,
            });

            const result = await loadFilters();

            expect(browser.storage.sync.get).toHaveBeenCalledWith(STORAGE_KEYS.PR_FILTERS);
            expect(result).toEqual(mockFilters);
        });

        it("should return empty array when no filters exist in storage", async () => {
            vi.mocked(browser.storage.sync.get).mockResolvedValue({});

            const result = await loadFilters();

            expect(result).toEqual([]);
        });

        it("should return empty array when storage.get returns null/undefined", async () => {
            vi.mocked(browser.storage.sync.get).mockResolvedValue({
                [STORAGE_KEYS.PR_FILTERS]: null,
            });

            const result = await loadFilters();

            expect(result).toEqual([]);
        });

        it("should handle storage errors gracefully and return empty array", async () => {
            const error = new Error("Storage quota exceeded");
            vi.mocked(browser.storage.sync.get).mockRejectedValue(error);

            const result = await loadFilters();

            expect(result).toEqual([]);
        });
    });

    describe("saveFilters", () => {
        it("should save filters to storage successfully", async () => {
            const mockFilters: PRFilter[] = [
                {
                    id: "1",
                    name: "Test Filter",
                    value: "is:pr is:open",
                    enabled: true,
                },
            ];

            vi.mocked(browser.storage.sync.set).mockResolvedValue(undefined);

            await saveFilters(mockFilters);

            expect(browser.storage.sync.set).toHaveBeenCalledWith({
                [STORAGE_KEYS.PR_FILTERS]: mockFilters,
            });
        });

        it("should save empty array to storage", async () => {
            vi.mocked(browser.storage.sync.set).mockResolvedValue(undefined);

            await saveFilters([]);

            expect(browser.storage.sync.set).toHaveBeenCalledWith({
                [STORAGE_KEYS.PR_FILTERS]: [],
            });
        });

        it("should throw error when storage.set fails", async () => {
            const mockFilters: PRFilter[] = [
                {
                    id: "1",
                    name: "Test Filter",
                    value: "is:pr",
                    enabled: true,
                },
            ];

            const error = new Error("Storage quota exceeded");
            vi.mocked(browser.storage.sync.set).mockRejectedValue(error);

            await expect(saveFilters(mockFilters)).rejects.toThrow("Storage quota exceeded");
        });

        it("should handle large filter arrays", async () => {
            const mockFilters: PRFilter[] = Array.from({ length: 100 }, (_, i) => ({
                id: `${i}`,
                name: `Filter ${i}`,
                value: `is:pr label:test${i}`,
                enabled: i % 2 === 0,
            }));

            vi.mocked(browser.storage.sync.set).mockResolvedValue(undefined);

            await saveFilters(mockFilters);

            expect(browser.storage.sync.set).toHaveBeenCalledWith({
                [STORAGE_KEYS.PR_FILTERS]: mockFilters,
            });
        });
    });
});
