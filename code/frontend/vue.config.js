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
            entry: 'src/app.js'
        }
    }
}