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
        // if rules need to be overidden
        // just place '// eslint-disable-next-line' above line
        // that you want to override linting rules for
        "vue/return-in-computed-property": 0, // turned off because I often use if-elseif-else in computed properties
        'no-console': 'error',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
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