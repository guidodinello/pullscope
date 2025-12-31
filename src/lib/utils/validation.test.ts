import { describe, it, expect } from "vitest";
import { validateFilterName, validateFilter } from "./validation";

describe("validateFilterName", () => {
    it("should return isValid true for valid filter names", () => {
        expect(validateFilterName("Valid Filter").isValid).toBe(true);
        expect(validateFilterName("Filter 123").isValid).toBe(true);
        expect(validateFilterName("a").isValid).toBe(true);
    });

    it("should return isValid false for empty names", () => {
        const result1 = validateFilterName("");
        expect(result1.isValid).toBe(false);
        expect(result1.error).toBe("Filter name is required");

        const result2 = validateFilterName("   ");
        expect(result2.isValid).toBe(false);
        expect(result2.error).toBe("Filter name is required");
    });

    it("should return isValid false for names exceeding max length", () => {
        const longName = "a".repeat(51);
        const result = validateFilterName(longName);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain("50 characters or less");
    });

    it("should return isValid true for names at max length boundary", () => {
        const maxName = "a".repeat(50);
        expect(validateFilterName(maxName).isValid).toBe(true);
    });
});

describe("validateFilter", () => {
    describe("Valid GitHub qualifiers", () => {
        it("should accept basic is: qualifiers", () => {
            expect(validateFilter("is:pr").isValid).toBe(true);
            expect(validateFilter("is:open").isValid).toBe(true);
            expect(validateFilter("is:closed").isValid).toBe(true);
            expect(validateFilter("is:merged").isValid).toBe(true);
            expect(validateFilter("is:draft").isValid).toBe(true);
        });

        it("should accept author qualifiers", () => {
            expect(validateFilter("author:username").isValid).toBe(true);
            expect(validateFilter("author:@me").isValid).toBe(true);
            expect(validateFilter("author:app/dependabot").isValid).toBe(true);
        });

        it("should accept assignee qualifiers", () => {
            expect(validateFilter("assignee:username").isValid).toBe(true);
            expect(validateFilter("assignee:@me").isValid).toBe(true);
        });

        it("should accept review qualifiers", () => {
            expect(validateFilter("review:approved").isValid).toBe(true);
            expect(validateFilter("review:changes_requested").isValid).toBe(true);
            expect(validateFilter("review-requested:@me").isValid).toBe(true);
            expect(validateFilter("reviewed-by:username").isValid).toBe(true);
        });

        it("should accept label qualifiers", () => {
            expect(validateFilter("label:bug").isValid).toBe(true);
            expect(validateFilter("label:feature-request").isValid).toBe(true);
        });

        it("should accept negated qualifiers", () => {
            expect(validateFilter("-author:app/dependabot").isValid).toBe(true);
            expect(validateFilter("-is:draft").isValid).toBe(true);
            expect(validateFilter("-label:wip").isValid).toBe(true);
        });

        it("should accept multiple qualifiers", () => {
            expect(validateFilter("is:pr is:open author:@me").isValid).toBe(true);
            expect(validateFilter("is:pr -author:app/dependabot label:bug").isValid).toBe(true);
        });

        it("should accept qualifiers with quoted values", () => {
            expect(validateFilter('label:"needs review"').isValid).toBe(true);
        });
    });

    describe("Invalid filters", () => {
        it("should reject empty filter values", () => {
            const result1 = validateFilter("");
            expect(result1.isValid).toBe(false);
            expect(result1.error).toBe("Filter value cannot be empty");

            const result2 = validateFilter("   ");
            expect(result2.isValid).toBe(false);
            expect(result2.error).toBe("Filter value cannot be empty");
        });

        it("should reject filters with unmatched quotes", () => {
            const result = validateFilter('label:"unclosed');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe("Unclosed quote detected");
        });

        it("should reject completely invalid qualifiers", () => {
            const result = validateFilter("invalid:qualifier");
            expect(result.isValid).toBe(false);
            expect(result.error).toContain("Unknown qualifier");
        });

        it("should accept edge case qualifiers", () => {
            expect(validateFilter("no:assignee").isValid).toBe(true);
            expect(validateFilter("archived:false").isValid).toBe(true);
            expect(validateFilter("locked:true").isValid).toBe(true);
        });

        it("should reject qualifiers without values", () => {
            const result = validateFilter("author:");
            expect(result.isValid).toBe(false);
            expect(result.error).toContain("missing a value");
        });
    });

    describe("Complex filters", () => {
        it("should validate complex multi-qualifier filters", () => {
            const complex1 = "is:pr is:open -author:app/dependabot review:approved label:bug";
            expect(validateFilter(complex1).isValid).toBe(true);

            const complex2 = 'is:pr assignee:@me label:"needs review" -is:draft';
            expect(validateFilter(complex2).isValid).toBe(true);
        });

        it("should handle filters with extra spaces", () => {
            expect(validateFilter("is:pr  is:open").isValid).toBe(true);
            expect(validateFilter("  is:pr  ").isValid).toBe(true);
        });

        it("should validate date-based qualifiers", () => {
            expect(validateFilter("created:>2023-01-01").isValid).toBe(true);
            expect(validateFilter("updated:<=2023-12-31").isValid).toBe(true);
            expect(validateFilter("merged:2023-01-01..2023-12-31").isValid).toBe(true);
        });

        it("should validate numeric qualifiers", () => {
            expect(validateFilter("comments:>5").isValid).toBe(true);
            expect(validateFilter("interactions:<=10").isValid).toBe(true);
        });
    });
});
