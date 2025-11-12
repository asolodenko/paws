import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: [
            "**/dist/**", 
            "**/node_modules/**", 
            "**/build/**", 
            "**/public/**",
            "**/*.config.js",
            "**/*.config.mjs"
        ],
    },
    ...compat.extends(
        "plugin:vue/vue3-recommended",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ),
    {
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                sourceType: "module",
                ecmaVersion: "latest",
                extraFileExtensions: [".vue"],
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        plugins: {
            "@typescript-eslint": ts,
        },
        rules: {
            // Vue-specific rules
            "vue/multi-word-component-names": "off",
            "vue/component-name-in-template-casing": ["error", "PascalCase", {
                registeredComponentsOnly: false,
            }],
            "vue/html-indent": ["error", 2],
            "vue/max-attributes-per-line": ["error", {
                singleline: { max: 3 },
                multiline: { max: 1 }
            }],
            "vue/html-self-closing": ["error", {
                html: { void: "always", normal: "never", component: "always" },
                svg: "always",
                math: "always"
            }],
            "vue/no-v-html": "warn",
            
            // TypeScript rules
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["error", { 
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_" 
            }],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            
            // General JavaScript/TypeScript rules
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "warn",
            "no-unused-vars": "off", // Use @typescript-eslint/no-unused-vars instead
            "prefer-const": "error",
            "no-var": "error",
            "eqeqeq": ["error", "always"],
            "curly": ["error", "all"],
            "semi": ["error", "never"],
            "quotes": ["error", "single", { avoidEscape: true }],
            "comma-dangle": ["error", "always-multiline"],
        },
    },
];