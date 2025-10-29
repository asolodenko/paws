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
        ignores: ["**/dist/**", "**/node_modules/**", "**/build/**", "**/public/**"],
    },
    ...compat.extends(
        "plugin:vue/vue3-essential",
        "eslint:recommended",
    ),
    {
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                sourceType: "module",
                ecmaVersion: "latest",
            },
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            "@typescript-eslint": ts,
        },
        rules: {
            "vue/multi-word-component-names": "off",
        },
    },
];