const fs = require('fs')
const path = require('path')

const codes = fs.readFileSync(path.resolve(__dirname, 'area_codes.json'), 'utf-8')

module.exports = {
    isCanadian(code) {
        return !!codes[code]
    }
}
