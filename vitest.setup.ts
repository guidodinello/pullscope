/* eslint-disable no-undef, @typescript-eslint/no-explicit-any */

// Mock browser API for tests
global.browser = {
    storage: {
        sync: {
            get: vi.fn(),
            set: vi.fn(),
            getBytesInUse: vi.fn().mockResolvedValue(0),
        },
        onChanged: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
    },
    tabs: {
        query: vi.fn(),
        sendMessage: vi.fn(),
    },
    runtime: {
        getURL: vi.fn((path: string) => `chrome-extension://mock-id/${path}`),
        onMessage: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
        onInstalled: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
    },
} as any;
