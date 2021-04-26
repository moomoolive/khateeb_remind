module.exports = {
    "root": true,
    "env": {
        "node": true
    },
    "extends": [
        "plugin:vue/essential",
        "eslint:recommended"
    ],
    "parserOptions": {
        "parser": "babel-eslint"
    },
    "rules": {
        "vue/return-in-computed-property": 0, // turned off because I sometimes use if-elseif-else in computed properties
        "vue/no-parsing-error": 0,
        "vue/valid-v-bind": 0,
    },
    "overrides": [
        {
        "files": [
            "**/__tests__/*.{j,t}s?(x)",
            "**/tests/unit/**/*.spec.{j,t}s?(x)"
        ],
        "env": {
            "jest": true
        }
        }
    ]
}