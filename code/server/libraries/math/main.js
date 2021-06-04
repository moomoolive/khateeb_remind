const generateRandomNumber = (numberOfDigits=6) => {
    const digits = numberOfDigits < 0 ? 0 : numberOfDigits
    return Math.round(Math.random() * Math.pow(10, digits === 1 ? 0 : digits)) 
}

module.exports = {
    generateRandomNumber
}