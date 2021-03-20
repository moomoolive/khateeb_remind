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
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            //skipWaiting: true,
            //clientsClaim: true
            swSrc: 'src/service-worker.js',
            //swDest: 'service-worker.js'
        }
    }
}