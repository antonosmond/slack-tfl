module.exports = {
  "parserOptions": {
    "ecmaVersion": 8
  },
  "env": {
    "node": true,
    "mocha": true,
    "es6": true
  },
  "extends": ["eslint:recommended"],
  "rules": {
    "array-bracket-spacing": ["error", "never"],
    "arrow-spacing": "error",
    "callback-return": "error",
    "camelcase": "error",
    "comma-dangle": ["error", "always-multiline"],
    "default-case": "error",
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "no-console": "warn",
    "no-template-curly-in-string": "error",
    "no-var": "error",
    "object-curly-spacing": ["error", "always"],
    "prefer-arrow-callback": "error",
    "prefer-const": ["error"],
    "prefer-template": "error",
    "quotes": ["error", "single"],
    "require-await": "error",
    "semi": ["error", "always"],
  }
}
