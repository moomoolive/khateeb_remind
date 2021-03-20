import store from '@/store/index.js'

const createFooterPopup = (type, componentsProps) => {
    store.commit('footerPopup/display', { type, componentsProps })
}

export default {
    createFooterPopup
}