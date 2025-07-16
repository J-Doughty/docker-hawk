import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  globalIgnores(["./src-tauri", "./dist", "./node_modules", ".tanstack"]),
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },
  },
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-duplicate-imports": 1,
      "no-self-compare": 2,
      "no-unreachable-loop": 1,
      "no-unused-private-class-members": 1,
      camelcase: 1,
      "capitalized-comments": [
        1,
        "always",
        { ignoreConsecutiveComments: true },
      ],
      curly: 1,
      "default-case": 1,
      "default-case-last": 1,
      "default-param-last": 2,
      "dot-notation": 1,
      eqeqeq: 2,
      "guard-for-in": 2,
      "multiline-comment-style": [1, "separate-lines"],
      "no-confusing-arrow": 2,
      "no-else-return": 2,
      "no-empty-function": 1,
      "no-eq-null": 2,
      "no-eval": 2,
      "no-inline-comments": 1,
      "no-script-url": 2,
      "no-shadow": 1,
      "no-unused-expressions": 1,
      "no-useless-computed-key": 1,
      "no-var": 2,
      "object-shorthand": [1, "always"],
      "prefer-arrow-callback": 1,
      "prefer-const": 1,
      "prefer-object-spread": 1,
      "prefer-spread": 1,
      "prefer-template": 1,
      radix: 2,
      "require-await": 2,
      "arrow-body-style": [1, "as-needed"],
      "simple-import-sort/exports": 1,
      "simple-import-sort/imports": [
        1,
        {
          groups: [
            // `react` first, then packages starting with a character
            ["^react$", "^[a-z]"],
            // Packages starting with `@`
            ["^@"],
            // Packages starting with `~`
            ["^~"],
            // Imports starting with `../`
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Imports starting with `./`
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
      // No no-unused-expressions detects this but it cannot auto fix it so we add this
      // rule
      "unused-imports/no-unused-imports": 1,
    },
  },
]);
