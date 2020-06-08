/** @typedef {import("xo").Options} XoOptions */

/** @type {XoOptions} */
const js = {
  envs: ["es2020"],
  space: 2,
  plugins: [
    "simple-import-sort",
  ],
  extends: [
    "xo/esnext",
  ],
  rules: {
    "import/extensions": "off",
    "import/no-mutable-exports": "off",
    "promise/param-names": "off",
    "simple-import-sort/sort": "error",
    "unicorn/catch-error-name": ["error", { name: "err", caughtErrorsIgnorePattern: "^err" }],
    "unicorn/consistent-function-scoping": "off",
    "unicorn/no-fn-reference-in-iterator": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/prefer-spread": "off",
    "unicorn/prefer-type-error": "off",
    "unicorn/prevent-abbreviations": "off",
    "array-element-newline": "off",
    "arrow-parens": ["error", "always"],
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "capitalized-comments": "off",
    "comma-dangle": ["error", "always-multiline"],
    "constructor-super": "off",
    "default-case": "off",
    "function-call-argument-newline": "off",
    "generator-star-spacing": ["error", { named: "after", anonymous: "neither", method: "before" }],
    indent: ["error", 2, {
      SwitchCase: 1,
      VariableDeclarator: "first",
      outerIIFEBody: 0,
      FunctionDeclaration: { parameters: 2 },
      FunctionExpression: { parameters: 2 },
      flatTernaryExpressions: true,
    }],
    "max-params": "off",
    "max-statements-per-line": ["error", { max: 3 }],
    "new-cap": "off",
    "no-await-in-loop": "off",
    "no-implicit-coercion": ["error", { allow: ["!!"] }],
    "no-inner-declarations": "off",
    "no-mixed-operators": "off",
    "no-return-assign": "off",
    "no-warning-comments": "off",
    "object-curly-spacing": ["error", "always"],
    "padded-blocks": ["error", "never", { allowSingleLineBlocks: true }],
    "padding-line-between-statements": "off",
    "prefer-destructuring": "off",
    "prefer-template": "error",
    quotes: ["error", "double"],
    "yield-star-spacing": ["error", "after"],
  },
};

/** @type {XoOptions} */
const ts = {
  extends: [
    "xo-typescript",
  ],
  rules: {
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/brace-style": js.rules["brace-style"],
    "@typescript-eslint/class-literal-property-style": ["error", "fields"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/indent": js.rules.indent,
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/no-base-to-string": "off",
    "@typescript-eslint/no-unnecessary-qualifier": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/promise-function-async": "off",
    "@typescript-eslint/prefer-readonly": "off",
    "@typescript-eslint/prefer-readonly-parameter-types": "off",
    "@typescript-eslint/quotes": js.rules.quotes,
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/switch-exhaustiveness-check": "off",
    "@typescript-eslint/unified-signatures": "off",
    "import/export": "off",
    "import/no-unassigned-import": "off",
    "brace-style": "off",
    indent: "off",
    "no-redeclare": "off",
    "no-return-await": "off",
    "no-unused-vars": "off",
    "no-useless-constructor": "off",
    quotes: "off",
  },
};

/** @type {XoOptions} */
const preact = {
  extends: [
    "xo-preact",
  ],
  envs: ["browser"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "react/jsx-closing-bracket-location": ["error", "tag-aligned"],
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/jsx-no-bind": "off",
    "react/require-optimization": "off",
    "no-script-url": "off",
  },
};

function merge(base, ...patches) {
  const res = { ...base };
  for (const patch of patches) {
    for (const [key, value] of Object.entries(patch)) {
      if (Array.isArray(res[key])) {
        res[key] = [...res[key], ...value];
      } else if (typeof res[key] === "object") {
        res[key] = { ...res[key], ...value };
      } else {
        res[key] = value;
      }
    }
  }
  return res;
}

/** @type {XoOptions} */
module.exports = {
  ...js,
  overrides: [
    {
      files: [
        "./src/**/*.(ts|tsx)",
      ],
      ...merge(js, ts, preact),
    },
  ],
};
