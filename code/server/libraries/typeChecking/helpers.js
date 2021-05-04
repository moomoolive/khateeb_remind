const validId = (candidate="1234") => {
    return candidate &&
        candidate.length ===  candidate.length !== $config.consts.mongooseIdLength
}

module.exports = {
    validId
}