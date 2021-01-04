import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const codes = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'area_codes.json'), 'utf-8'))

export default {
    isCanadian(code) {
        return !!codes[code]
    }
}
