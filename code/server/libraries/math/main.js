// generate an integer with a specified number of digits
// digits 0 or lower are defaulted to 1 digit
const generateRandomNumber = (numberOfDigits=6) => {
    // if exponent base is less than 0.1
    // it will create numbers less than the specified number of digits
    // because some of the leading "digits" will be zeros
    // if bigger than 0.95 it may round up and create more digits
    let exponentBase = Math.random()
    while (exponentBase < 0.1 || exponentBase > 0.94999) {
        exponentBase = Math.random()
    }
    const digits = numberOfDigits < 1 ? 1 : numberOfDigits
    return Math.round(exponentBase * Math.pow(10, digits)) 
}

module.exports = {
    generateRandomNumber
}