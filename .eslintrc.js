/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "plugin:import/recommended",
    "prettier"
  ],
  settings: {
    "import/resolver": {
      alias: {
        map: [["~", "./app/"]],
        extensions: [".jsx", ".js", ".tsx", ".ts", ".json", ".css"]
      }
    }
  }
};
