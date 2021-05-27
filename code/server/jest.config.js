const path = require("path")

module.exports = {
    verbose: true,
    testEnvironment: "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    // ONLY target files inside the test folder that end with
    // ".spec.js" 
    testMatch: ["<rootDir>/tests/**/*.test.js"],
    globals: {
        $rootDir: path.resolve(__dirname),
        $config: require(path.resolve("Server.config.js")).globalConfig,
        $utils: require(path.resolve('libraries/globalUtilities.js')),
        $db: path.resolve('database/main.js')
    }
}