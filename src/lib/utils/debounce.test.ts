import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should delay function execution", () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 500);

        debouncedFunc();

        // Function should not be called immediately
        expect(func).not.toHaveBeenCalled();

        // Fast-forward time by 500ms
        vi.advanceTimersByTime(500);

        // Function should now be called
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("should cancel previous call when invoked multiple times", () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 500);

        debouncedFunc();
        vi.advanceTimersByTime(200);
        debouncedFunc();
        vi.advanceTimersByTime(200);
        debouncedFunc();

        // Function should not be called yet
        expect(func).not.toHaveBeenCalled();

        // Fast-forward remaining time (500ms from last call)
        vi.advanceTimersByTime(500);

        // Function should only be called once
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("should pass arguments to the debounced function", () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 500);

        debouncedFunc("arg1", "arg2", 123);

        vi.advanceTimersByTime(500);

        expect(func).toHaveBeenCalledWith("arg1", "arg2", 123);
    });

    it("should preserve the latest arguments when called multiple times", () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 500);

        debouncedFunc("first");
        debouncedFunc("second");
        debouncedFunc("third");

        vi.advanceTimersByTime(500);

        // Should only call with the latest arguments
        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith("third");
    });

    it("should preserve 'this' context", () => {
        const obj = {
            value: 42,
            method: function (this: { value: number }) {
                return this.value;
            },
        };

        const spy = vi.fn(obj.method);
        obj.method = debounce(spy, 500);

        obj.method();

        vi.advanceTimersByTime(500);

        expect(spy).toHaveBeenCalledTimes(1);
        // Verify the return value to ensure 'this' was preserved
        expect(spy.mock.results[0].value).toBe(42);
    });

    it("should handle multiple independent debounced functions", () => {
        const func1 = vi.fn();
        const func2 = vi.fn();
        const debouncedFunc1 = debounce(func1, 300);
        const debouncedFunc2 = debounce(func2, 500);

        debouncedFunc1();
        debouncedFunc2();

        vi.advanceTimersByTime(300);
        expect(func1).toHaveBeenCalledTimes(1);
        expect(func2).not.toHaveBeenCalled();

        vi.advanceTimersByTime(200);
        expect(func2).toHaveBeenCalledTimes(1);
    });

    it("should work with zero delay", () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 0);

        debouncedFunc();

        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(0);

        expect(func).toHaveBeenCalledTimes(1);
    });

    it("should allow multiple executions when enough time passes", () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 500);

        // First call
        debouncedFunc();
        vi.advanceTimersByTime(500);
        expect(func).toHaveBeenCalledTimes(1);

        // Second call after wait period
        debouncedFunc();
        vi.advanceTimersByTime(500);
        expect(func).toHaveBeenCalledTimes(2);

        // Third call after wait period
        debouncedFunc();
        vi.advanceTimersByTime(500);
        expect(func).toHaveBeenCalledTimes(3);
    });

    it("should handle rapid successive calls correctly", () => {
        const func = vi.fn();
        const debouncedFunc = debounce(func, 1000);

        // Simulate rapid clicking/typing
        for (let i = 0; i < 10; i++) {
            debouncedFunc(i);
            vi.advanceTimersByTime(50);
        }

        // Function should not be called yet
        expect(func).not.toHaveBeenCalled();

        // Fast-forward remaining time
        vi.advanceTimersByTime(1000);

        // Should only be called once with the last value
        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith(9);
    });
});
