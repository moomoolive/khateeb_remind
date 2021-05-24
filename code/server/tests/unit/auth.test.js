const authHelpers = require("../../libraries/auth/main.js")

const jwt = require("jsonwebtoken")

// found in .env.test @ root folder
const testJWTSecret = "secret"
// end enviromental variable mocks

const tokenPayload = { random: "hi", random2: "bye" }
const token = authHelpers.createToken(tokenPayload, '2-days')

const tokenCreationFuctionName = `Token Creation Function`

describe(tokenCreationFuctionName, () => {
    it('Token verification succeeds with correct jwt secret', () => {        
        jwt.verify(token, testJWTSecret, (err, decoded) => {
            expect(err).toBe(null)
            // cast decoded to boolean
            expect(!!decoded).toBe(true)
        })
    })
})

describe(tokenCreationFuctionName, () => {
    it('Token verification fails with mismatched jwt secret', () => {
        jwt.verify(token, "not secret", err => {
            // cast err to boolean
            expect(!!err).toBe(true)
        })
    })
})

describe(tokenCreationFuctionName, () => {
    it('Created token holds correct expiration date using hours syntax', () => {
        jwt.verify(token, testJWTSecret, (_, decoded) => {
            const oneDayInSeconds = 60 * 60 * 24
            const tokenLifetime = decoded.exp - decoded.iat
            expect(tokenLifetime).toBe(oneDayInSeconds * 2)
        })
    })
})

describe(tokenCreationFuctionName, () => {
    it('Created token holds correct expiration date using minutes syntax', () => {
        const expiration = "20-minutes"
        const token = authHelpers.createToken(tokenPayload, expiration)
        jwt.verify(token, testJWTSecret, (_, decoded) => {
            const oneMinuteInSeconds = 60
            const tokenLifetime = decoded.exp - decoded.iat
            expect(tokenLifetime).toBe(oneMinuteInSeconds * 20)
        })
    })
})

describe(tokenCreationFuctionName, () => {
    it('Created token carries correct payload', () => {        
        jwt.verify(token, testJWTSecret, (_, decoded) => {
            expect(decoded.random).toBe("hi")
            expect(decoded.random2).toBe("bye")
        })
    })
})