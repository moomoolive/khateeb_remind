const path = require('path')

module.exports = {
    // if building for pwa testing include source maps
    // else don't include them
    productionSourceMap: !!process.env.VUE_APP_PWA,
    configureWebpack: {
        resolve: {
            alias: {
                'config$': path.resolve(__dirname, 'App.config.js')
            }
        }
    },
    css: {
        loaderOptions : {
            // import _index.scss style sheet into each vue component
            scss: {
                prependData: `
                    @import "@/scss/_index.scss";
                `
            }
        }
    },
    pages: {
        index: { entry: 'src/App.js' }
    },
    pwa: {
        name: 'Khateeb Remind',
        themeColor: "#4DBA87",
        msTileColor: "#4DBA87",
        appleMobileWebAppCache: "no",
        manifestOptions: {
            background_color: "#000000"
        },
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js',
            swDest: "service-worker.js"
        }
    },
    // remove all comments from build files
    chainWebpack: config => {
        config.optimization.minimizer('terser').tap(args => {
            args[0].terserOptions.output = {
                ...args[0].terserOptions.output,
                comments: false
            }
            return args
        })
    }
}