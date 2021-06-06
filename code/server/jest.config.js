const path = require("path")

module.exports = {
    verbose: true,
    testEnvironment: "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    globals: {
        $rootDir: path.resolve(__dirname),
        $config: require(path.resolve("Server.config.js")).globalConfig,
        $utils: require(path.resolve('libraries/globalUtilities.js')),
    }
}