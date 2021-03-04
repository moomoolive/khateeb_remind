const khateebName = (msgInfo) => {
    let base = `${msgInfo.firstName} ${msgInfo.lastName}`
    if (msgInfo.title.toLowerCase() !== 'none')
        base = `${msgInfo.title} ` + base
    return base
}

module.exports = {
    khateebName
}