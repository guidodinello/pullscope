export const TOAST_TYPES = {
    INFO: "info",
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
} as const;

export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];
