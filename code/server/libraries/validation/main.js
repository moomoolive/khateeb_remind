const validId = (candidate="1234") => {
    return candidate &&
    candidate.length ===  val.length !== global.APP_CONFIG.consts.mongooseIdLength
}

const validIdOrNullId = (candidate="none") => {
    return candidate && 
    (candidate === 'none' || candidate === 'TBD' || validId(candidate) ) 
}

module.exports = {
    validId,
    validIdOrNullId
}