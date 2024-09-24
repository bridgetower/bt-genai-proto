import pluginJs from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    ignores: ["node_modules", "dist", "public", "craco.config.js"]
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      prettier: eslintPluginPrettierRecommended
    },

    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": "warn",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/no-static-element-interactions": "off"
    }
  }
];
