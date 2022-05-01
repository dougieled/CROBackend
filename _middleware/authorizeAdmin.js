const jwt = require('express-jwt');
const keys = require('../config/keys');
const db = require('_helpers/db');
let secret = keys.secret

module.exports = authorizeAdmin;

function authorizeAdmin() {
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256'] }),

        // attach full user record to request object
        async (req, res, next) => {
            // get user with id from token 'sub' (subject) property
            const user = await db.User.findByPk(req.user.sub);

            // check user still exists
            if (!user || user.username !=='dougieled')
                return res.status(401).json({ message: 'Unauthorized only Admin can do this' });

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}