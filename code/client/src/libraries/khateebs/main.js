import Config from '$config'

const khateebName = (khateeb={}) => {
    let base = `${khateeb.firstName} ${khateeb.lastName}`
    if (khateeb.title.toLowerCase() !== Config.globalConfig.nullId) {
        base = `${khateeb.title} ${base}`
    }
    return base
}

export default {
    khateebName
}