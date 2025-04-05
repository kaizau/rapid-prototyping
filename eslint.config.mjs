import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(["**/build", "**/dist", "**/public"]),
  {
    extends: compat.extends("eslint:recommended", "prettier"),

    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "module",
    },

    rules: {
      "no-console": "warn",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "no-unused-vars": "warn",
      "prefer-const": "error",
    },
  },
  {
    files: ["api/**/*"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["site/**/*"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },
  },
]);
