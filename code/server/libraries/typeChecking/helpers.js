const validId = (candidate="1234") => {
    return candidate && candidate.length === $config.consts.mongooseIdLength
}

module.exports = {
    validId
}