const { Unauthorized, Forbidden } = require('../errors/Errors')
const { admin } = require('../firebaseConnect')

class TokenService {
    static async checkAccess(req, res, next) {

        const authHeader = req.headers.authorization;

        const token = authHeader?.split(" ")?.[1];

        if (!token) {
            next(new Unauthorized());
        }

        try {
            const verifiedToken = await admin.auth().verifyIdToken(token);
            req.user = verifiedToken
            next()
        } catch (err) {
            return res.status(403).json({error: err.errorInfo.code, status: 403})
        }
    }
}

module.exports = TokenService