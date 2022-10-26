module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: "eslint:recommended",
  overrides: [
    {
      files: [".eslintrc.js"],
      env: {
        node: true,
        browser: false
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "prefer-const": [
      "error",
      {
        destructuring: "any",
        ignoreReadBeforeAssign: false
      }
    ]
  }
};
