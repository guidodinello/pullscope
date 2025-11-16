/**
 * Utility for conditional class names
 * Merges class names and filters out falsy values
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
