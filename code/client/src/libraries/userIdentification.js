const deviceBrowsingViaPWA = () => {
    // for apple - then other browsers
    return window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
}

export default {
    deviceBrowsingViaPWA
}