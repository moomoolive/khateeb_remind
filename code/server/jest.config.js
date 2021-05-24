const path = require("path")

module.exports = {
    verbose: true,
    testEnvironment: "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    globals: {
        $rootDir: path.resolve(__dirname),
        $config: path.resolve("Server.config.js"),
        $utils: path.resolve('libraries/globalUtilities.js'),
        $db: path.resolve('database/main.js')
    }
}