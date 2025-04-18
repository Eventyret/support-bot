import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["dist/**", "node_modules/**"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: { globals: globals.browser }
  },
  {
    ...pluginReact.configs.flat.recommended,
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["dist/**", "node_modules/**"],
    settings: {
      react: {
        version: "detect"
      }
    }
  },
]);