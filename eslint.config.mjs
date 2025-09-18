import { eslint } from "@siberiacancode/eslint";

/** @type {import('eslint').Linter.FlatConfig} */
export default eslint({
  typescript: true,
  javascript: true,
  react: true,
  jsx: true,
  jsxA11y: true,
});
