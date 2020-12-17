import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const codes = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'area_codes_tree.json'), 'utf-8'))

export default {
    isCanadian(code, data=null) {
        let x = data ? data : codes
        let number = x.val
        if (code === number) return true
        else if ((code > number) && x.right ) return this.isCanadian(code, x.right)
        else if ((code < number) && x.left ) return this.isCanadian(code, x.left)
        return false
    }
}
