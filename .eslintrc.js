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
    "class-methods-use-this": "error",
    "comma-dangle": ["error", "always-multiline"],
    "default-case": "error",
    "eqeqeq": "error",
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "no-console": "warn",
    "no-multiple-empty-lines": "error",
    "no-template-curly-in-string": "error",
    "no-throw-literal": "error",
    "no-var": "error",
    "object-curly-spacing": ["error", "always"],
    "prefer-arrow-callback": "error",
    "prefer-const": ["error"],
    "prefer-destructuring": ["error", {
      "array": true,
      "object": true
    }, {
      "enforceForRenamedProperties": false
    }],
    "prefer-template": "error",
    "quotes": ["error", "single"],
    "require-await": "error",
    "semi": ["error", "always"],
  }
}
