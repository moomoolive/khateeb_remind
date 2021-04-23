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
        "vue/no-side-effects-in-computed-properties": 0,
        "vue/return-in-computed-property": 0,
        "no-unused-vars": 0,
        "vue/require-v-for-key": 0,
        "vue/no-parsing-error": 0,
        "vue/valid-v-bind": 0,
        "vue/no-reserved-keys": 0,
        "vue/require-valid-default-prop": 0,
        "vue/no-async-in-computed-properties": 0,
        "no-case-declarations": 0,
        "no-useless-escape": 0
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