module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ["airbnb", "prettier", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest"
  },
  plugins: ["prettier", "@typescript-eslint"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-non-null-assetion": 0,
    "prettier/prettier": ["error"],
    "no-console": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "no-underscore-dangle": 0,
    "no-restricted-syntax": 0
  }
};
