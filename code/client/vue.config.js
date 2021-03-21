module.exports = {
    css: {
        loaderOptions : {
            scss: {
                prependData: `
                    @import "@/scss/_index.scss";
                `
            }
        }
    },
    pages: {
        index: {
            entry: 'src/App.js'
        }
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
    }
}