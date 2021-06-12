const path = require("path")

module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    testMatch: ["**/*.test.js"],
    verbose: true,
    moduleNameMapper: {
        "\$config": "<rootDir>/App.config.js"
    }
}
  