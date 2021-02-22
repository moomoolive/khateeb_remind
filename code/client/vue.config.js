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
        name: 'Khateeb Remind'
    }
}