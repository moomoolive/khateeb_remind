module.exports = {
    css: {
        loaderOptions : {
            scss: {
                prependData: `
                    @import "@/scss/_consts.scss";
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