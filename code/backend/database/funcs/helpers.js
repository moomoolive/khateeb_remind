const bcyrpt = require('bcrypt')

module.exports = {
    async encryptFields(data, fieldsToBeEncrypted) {
        for (let [field, fieldData] of Object.entries(data)) {
            const found = fieldsToBeEncrypted.find(toBeEncrypted => toBeEncrypted === field)
            if (found) {
                const salt = Math.random()
                try {
                    data[field] = await bcyrpt.hash(fieldData, salt)
                } catch(err) {
                    console.log(`Could not hash ${field}`)
                    console.log(err)
                }
            }
        }
        return data
    }
}