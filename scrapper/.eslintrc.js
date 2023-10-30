module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-await-in-loop": "error",
    "no-duplicate-imports": "error",
    "no-self-compare": "error",
    "no-use-before-define": "error",
    "block-scoped-var": "error",
    "default-case": "error",
    "default-case-last": "error",
    "default-param-last": ["error"],
    "func-style": ["error", "declaration"],
    "max-depth": ["error", 2],
    "max-params": ["error", 3],
    "no-array-constructor": "error",
    "new-cap": "error",
    "no-else-return": ["error", { allowElseIf: false }],
    "no-eval": "error",
    "no-lonely-if": "error",
    "no-loop-func": "error",
    "no-return-assign": "error",
    "no-shadow": [
      "error",
      {
        builtinGlobals: true,
        hoist: "functions",
        allow: [],
        ignoreOnInitialization: false,
      },
    ],
    "no-throw-literal": "error",
    "no-underscore-dangle": "error",
    "no-useless-catch": "error",
    "no-var": "error",
    "no-useless-return": "error",
    "no-void": "error",
    "prefer-object-spread": "error",
    "prefer-rest-params": "error",
    "require-await": "error",
    yoda: "error",
    "array-bracket-newline": ["error", "consistent"],
    "comma-spacing": ["error", { before: false, after: true }],
    "dot-location": ["error", "property"],
    "eol-last": ["error", "always"],
    "brace-style": "error",
    indent: ["error", 2],
    "line-comment-position": ["error", { position: "above" }],
    "linebreak-style": ["error", "unix"],
    "max-len": ["error", { code: 80 }],
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
    semi: ["error", "always"],
    "semi-style": ["error", "last"],
    "no-nested-ternary": "error",
    "no-redeclare": "error",
    "no-sequences": "error",
    "no-undef-init": "error",
    "no-negated-condition": "error",
    "no-extra-boolean-cast": "error",
  },
};
