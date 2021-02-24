
const deviceBrowsingViaPWA = () => {
    // for apple - then other browsers
    return window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
}

const deviceType = () => {
    // pretty horrible way of detection, but works for use case
    return window.navigator.userAgentData.mobile ? 'mobile' : 'tablet/desktop'
}

export default {
    deviceBrowsingViaPWA,
    deviceType
}