const toXCase = (arrayOfWords, format) => {
    return arrayOfWords.map((word) =>
        format === 'title' ? 
            word.charAt(0).toUpperCase() + word.slice(1) : otherCases(word, format)
    )
}

const otherCases = (word, format) => {
    return format === 'lower' ? word.toLowerCase() : word.toUpperCase()
}
const arrayToString = (arrayOfWords) => {
    return arrayOfWords.reduce((total, word) => total += ` ${word}`)
}

export default {
    toXCase,
    otherCases,
    arrayToString
}