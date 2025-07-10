import drizzle from "eslint-plugin-drizzle";
import zod from "eslint-plugin-zod";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptEslint from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [...compat.extends(
  "next/core-web-vitals",
  "plugin:@typescript-eslint/recommended-type-checked",
  "plugin:@typescript-eslint/stylistic-type-checked",
  "plugin:tailwindcss/recommended",
  "prettier"
), {
  plugins: {
    "@typescript-eslint": typescriptEslint,
    drizzle,
    zod,
  },

  languageOptions: {
    parser: tsParser,
    ecmaVersion: 5,
    sourceType: "script",

    parserOptions: {
      project: true,
    },
  },

  rules: {
    "zod/prefer-enum": 2,
    "zod/require-strict": 2,
    "@next/next/no-duplicate-head": "off",
    "import/no-anonymous-default-export": "off",
    "drizzle/enforce-delete-with-where": ["error", {
      drizzleObjectName: ["db", "ctx.db"],
    }],
    "drizzle/enforce-update-with-where": ["error", {
      drizzleObjectName: ["db", "ctx.db"],
    }],
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": ["warn", {
      prefer: "type-imports",
      fixStyle: "inline-type-imports",
    }],
    "@typescript-eslint/no-unused-vars": ["warn", {
      argsIgnorePattern: "^_",
    }],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/prefer-nullish-coalescing":"off",
    // "@typescript-eslint/no-misused-promises":"on",
    "@typescript-eslint/no-misused-promises": ["error", {
      checksVoidReturn: {
        attributes: true,
      },
    }],
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
  },
}];