import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

export default [
    // Ignore patterns
    {
        ignores: [
            ".output/**",
            ".wxt/**",
            "dist/**",
            "node_modules/**",
            "*.config.js",
            "*.config.ts",
        ],
    },

    // JavaScript/TypeScript files
    {
        files: ["**/*.js", "**/*.ts"],
        plugins: {
            "@typescript-eslint": tseslint,
        },
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
            globals: {
                // Browser globals
                browser: "readonly",
                document: "readonly",
                window: "readonly",
                crypto: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                Event: "readonly",
                KeyboardEvent: "readonly",
                HTMLInputElement: "readonly",
                Element: "readonly",
                MutationObserver: "readonly",
                // WXT globals
                defineBackground: "readonly",
                defineContentScript: "readonly",
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": ["warn", { allow: ["warn", "error"] }],
        },
    },

    // Svelte files
    {
        files: ["**/*.svelte"],
        plugins: {
            svelte: sveltePlugin,
            "@typescript-eslint": tseslint,
        },
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                parser: tsparser,
                extraFileExtensions: [".svelte"],
            },
            globals: {
                // Browser globals
                browser: "readonly",
                document: "readonly",
                window: "readonly",
                crypto: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                Event: "readonly",
                KeyboardEvent: "readonly",
                HTMLInputElement: "readonly",
                Element: "readonly",
                MutationObserver: "readonly",
                // WXT globals
                defineBackground: "readonly",
                defineContentScript: "readonly",
            },
        },
        rules: {
            ...sveltePlugin.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "svelte/no-at-html-tags": "warn",
        },
    },
];
