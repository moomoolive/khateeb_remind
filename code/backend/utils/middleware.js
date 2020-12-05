import jwt from 'jsonwebtoken'
import httpCodes from './httpCodes.js'

const JWT_SECRET = 'secret'

const funcs = {
    authAdmin(request, response, next) {
        const token = request.body.token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err || decoded.user !== "admin") {
                response.status(httpCodes.unauthorized)
                response.json({data: null, msg: 'Unauthorized'})
            } else { next() }  
        })
    },
    generalError(err, request, response, next) {
        console.log(err)
        response.status(httpCodes.serverError)
        response.json("Are servers aren't responding right now, try later...")
    }
}

export { funcs as middleware }