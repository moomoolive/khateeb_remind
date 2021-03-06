module.exports = {
    isNumeric(value) {
        return /^\d+$/.test(value)
    },
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    },
    deepCopy(object) {
        return JSON.parse(JSON.stringify(object))
    },
    generateRandomNumber(numberOfDigits=6) {
        const x = numberOfDigits === 1 ? 0 : numberOfDigits;
        return Math.round(Math.random() * Math.pow(10, x)) 
    }
}