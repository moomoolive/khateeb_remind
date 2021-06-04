
// generate an integer with a specified number of digits
// numbers 0 or lower are defaulted to 1 digit
const generateRandomNumber = (numberOfDigits=6) => {
    const digits = numberOfDigits < 1 ? 1 : numberOfDigits
    // if exponent base is less than 0.1
    // it will create numbers less than the specified number of digits
    // because some of the leading "digits" will be zeros
    let exponentBase = Math.random()
    while (exponentBase < 0.1) {
        exponentBase = Math.random()
    }
    return Math.round(exponentBase * Math.pow(10, digits)) 
}

module.exports = {
    generateRandomNumber
}