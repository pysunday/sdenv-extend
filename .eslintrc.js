module.exports = {
  "parserOptions": {
    "ecmaVersion": 2020
  },
  "root": true,
  "extends": "airbnb-base",
  "plugins": [
    "jest"
  ],
  "env": {
    "jest/globals": true
  },
  "globals": {
    "window": true
  },
  "rules": {
    "semi": 0,
    "comma-dangle": 0,
    "no-param-reassign": 0,
    "func-names": 0,
    "no-underscore-dangle": 0,
    "object-curly-newline": 0,
    "no-console": 0,
    "no-plusplus": 0,
    "no-multi-assign": 0,
    "import/prefer-default-export": 0,
    "space-before-function-paren": 0,
    "new-cap": 0,
    "arrow-body-style": 0,
    "camelcase": 0,
    "consistent-return": 0,
    "no-restricted-syntax": 0,
    "guard-for-in": 0,
    "no-eval": 0,
    "no-extend-native": 0
  }
}
