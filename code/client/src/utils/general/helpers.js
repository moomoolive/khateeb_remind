const subHelpers = {
    toXCase(arrayOfWords, format) {
        return arrayOfWords.map((word) =>
            format === 'title' ? 
                word.charAt(0).toUpperCase() + word.slice(1) : this.otherCases(word, format)
        )
    },
    otherCases(word, format) {
        return format === 'lower' ? word.toLowerCase() : word.toUpperCase()
    },
    arrayToString(arrayOfWords) {
        return arrayOfWords.reduce((total, word) => total += ` ${word}`)
    }
}

export default {
    camelCaseToArray(camelCase) {
        return camelCase.split(/(?=[A-Z])/)
    },
    arrayToString(arrayOfWords, format, raw) {
        const modifiedArray = subHelpers.toXCase(arrayOfWords, format)
        if (raw)
            return modifiedArray
        else return subHelpers.arrayToString(modifiedArray)
    },
    // inputting 0 equates to the beginning of today
    daysInThePast(numberOfDays=0) {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        date.setDate(date.getDate() - numberOfDays)
        return date
    }
}