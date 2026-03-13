import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },

  {
    files: ["**/*.{ts,tsx}"],

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
    ],

    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: true,
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      perfectionist,
      prettier: prettierPlugin,
    },

    rules: {
      ...reactHooks.configs.recommended.rules,

      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      /*
      ─────────────────────────────
      IMPORT RULES
      ─────────────────────────────
      */

      "no-restricted-imports": "off",

      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "Use @/ alias instead of relative parent imports",
            },
          ],
        },
      ],

      "import/order": "off",

      /*
      ─────────────────────────────
      SORT IMPORTS (AUTO FIX)
      ─────────────────────────────
      */

      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "type"],
        },
      ],

      /*
      ─────────────────────────────
      TYPESCRIPT
      ─────────────────────────────
      */

      "@typescript-eslint/no-explicit-any": "warn",

      /*
      ─────────────────────────────
      PRETTIER
      ─────────────────────────────
      */

      "prettier/prettier": "error",
    },
  },

  eslintConfigPrettier,
);
