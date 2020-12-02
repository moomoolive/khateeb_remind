const monthList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

let x = new Date()

function incrementMonth(value) {
    const currentMonth = x.getMonth()
    while (x.getMonth() === currentMonth) {
        x = new Date(x.setDate(x.getDate() + (15 * value)))
    }
}

for (let k = 0; k < 3; k++) {
    console.log(incrementMonth(1))
}

for (let k = 0; k < 3; k++) {
    console.log(incrementMonth(-1))
}