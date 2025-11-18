/**
 * Wait for a DOM element to appear in the document
 * @param selector - CSS selector for the element
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 * @returns Promise that resolves with the element or rejects on timeout
 */
export function waitForElement<T extends Element = Element>(
  selector: string,
  timeout = 5000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const existingElement = document.querySelector<T>(selector);
    if (existingElement) {
      return resolve(existingElement);
    }

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for element: ${selector}`));
    }, timeout);

    const observer = new MutationObserver(() => {
      const element = document.querySelector<T>(selector);
      if (element) {
        clearTimeout(timeoutId);
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export const waitForElements = async (selectors: string[], timeout = 5000) =>
  Promise.all(selectors.map((s) => waitForElement(s, timeout)));

/**
 * Debounce function to limit how often a function can fire
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
