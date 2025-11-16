import { VALIDATION } from "../constants";

/**
 * Validation utilities for GitHub filters
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valid GitHub search qualifiers
 * Source: https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests
 */
const GITHUB_QUALIFIERS = [
  "type",
  "in",
  "author",
  "assignee",
  "mentions",
  "team",
  "commenter",
  "involves",
  "linked",
  "label",
  "milestone",
  "project",
  "status",
  "head",
  "base",
  "language",
  "comments",
  "interactions",
  "reactions",
  "draft",
  "review",
  "reviewed-by",
  "review-requested",
  "team-review-requested",
  "user-review-requested",
  "is",
  "no",
  "archived",
  "locked",
  "created",
  "updated",
  "merged",
  "closed",
  "sort",
];

/**
 * Validate a GitHub search filter
 * @param value - The filter value to validate
 * @returns Validation result with error message if invalid
 */
export function validateFilter(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      error: "Filter value cannot be empty",
    };
  }

  // Check for unclosed quotes
  const quoteCount = (value.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    return {
      isValid: false,
      error: "Unclosed quote detected",
    };
  }

  // Check for basic syntax errors
  const tokens = value.split(/\s+/);
  for (const token of tokens) {
    // Check for invalid qualifier syntax (e.g., "author::" or "author:")
    if (token.includes(":")) {
      const [qualifier, ...valueParts] = token.split(":");

      // Remove leading - or + from qualifier
      const cleanQualifier = qualifier.replace(/^[-+]/, "");

      // Check if it's a recognized qualifier
      if (cleanQualifier && !GITHUB_QUALIFIERS.includes(cleanQualifier)) {
        return {
          isValid: false,
          error: `Unknown qualifier: ${cleanQualifier}`,
        };
      }

      // Check if value is empty (e.g., "author:")
      const value = valueParts.join(":");
      if (!value && cleanQualifier) {
        return {
          isValid: false,
          error: `Qualifier "${cleanQualifier}" is missing a value`,
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * Validate filter name
 * @param name - The filter name to validate
 * @returns Validation result
 */
export function validateFilterName(name: string): ValidationResult {
  if (!name || !name.trim()) {
    return {
      isValid: false,
      error: "Filter name is required",
    };
  }

  if (name.length > VALIDATION.FILTER_NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Filter name must be ${VALIDATION.FILTER_NAME_MAX_LENGTH} characters or less`,
    };
  }

  return { isValid: true };
}
