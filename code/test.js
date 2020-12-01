const monthList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const date = new Date()
const month = date.getMonth()
let fridays = []

date.setDate(1)

while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1)
    console.log(date.getMonth(), date.getDate())
}

while (date.getMonth() === month) {
    let oneFriday = new Date(date.getTime())
    let calendarDate = oneFriday.getDate()
    let year = oneFriday.getFullYear()
    let month = monthList[oneFriday.getMonth()]
    fridays.push(`${calendarDate}${month}${year}`)
    date.setDate(date.getDate() + 7)
}

console.log(fridays)