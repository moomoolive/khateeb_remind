const path = require("path")

module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    testMatch: ["**/*.test.js"],
    verbose: true,
    moduleNameMapper: {
        "*config$": "<rootDir>/App.config.js"
    },
    "moduleDirectories": [
        ".",
        "src",
        "App.config.js",
        "node_modules"
    ]
}
  