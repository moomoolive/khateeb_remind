const friday = 5
export default {
    generateRandomNumber(numberOfDigits=6) {
        const x = numberOfDigits === 1 ? 0 : numberOfDigits;
        return Math.round(Math.random() * Math.pow(10, x)) 
    },
    findUpcomingFriday(date=new Date()) {
        while (date.getDay() !== friday) {
            date.setDate(date.getDate() + 1)
        }
        return date
    },
}